import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  UserSchema,
  CompanySchema,
  AddressSchema,
} from "../../../../prisma/generated/zod";
import { User, Address, Company } from "@prisma/client";

export default createTRPCRouter({
  create: protectedProcedure
    .input(z.object({}).optional())
    .query(({ input, ctx }) => {
      return "Test";
    }),
  paginatedFind: protectedProcedure
    .input(
      z.object({
        page: z.number().nonnegative(),
        limit: z.number().nonnegative(),
      })
    )
    .query(async ({ input, ctx }) => {
      const totalPages = (await ctx.prisma.user.count()) / input.limit;
      if (input.page > totalPages) throw new TRPCError({ code: "BAD_REQUEST" });
      const users = await ctx.prisma.user.findMany({
        skip: input.page * input.limit,
        take: input.limit,
        select: {
          id: true,
          name: true,
          email: true,
          company: {
            select: {
              name: true,
            },
          },
        },
      });
      return { users, totalPages };
    }),
  findUser: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
        include: {
          company: true,
          address: true,
        },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      return user;
    }),
  deleteUser: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.delete({
        where: {
          id: input,
        },
        include: {
          company: true,
          address: true,
        },
      });
    }),
  upsertUser: protectedProcedure
    .input(
      z.object({
        user: UserSchema,
        address: AddressSchema,
        company: CompanySchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      const user = await ctx.prisma.user.upsert({
        update: input.user,
        create: input.user,
        where: {
          id: input.user.id === -1 ? undefined : input.user.id,
        },
      });

      input.address.userId = user.id;
      input.company.userId = user.id;

      await ctx.prisma.address.upsert({
        update: input.address,
        create: input.address,
        where: {
          userId: user.id,
        },
      });

      await ctx.prisma.company.upsert({
        update: input.company,
        create: input.company,
        where: {
          userId: user.id,
        },
      });
    }),
});

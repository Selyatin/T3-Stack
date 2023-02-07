import z from "zod";
import Cookies from "cookies";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "../../../env/server.mjs";

export default createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (
        input.username !== env.ADMIN_USERNAME ||
        input.password !== env.ADMIN_PASSWORD
      )
        throw new TRPCError({ code: "BAD_REQUEST" });

      const createResponse = await ctx.prisma.session.create({
        data: {
          expires: new Date(new Date().getTime() + 1 * 3600 * 1000),
        },
      });

      const { id, expires } = createResponse;

      const cookies = new Cookies(ctx.req, ctx.res);

      cookies.set("authorization", id, { httpOnly: true, expires });

      return true;
    }),
});

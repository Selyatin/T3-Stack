import * as cookie from "cookie";

import { prisma } from "./db";
import { IncomingMessage } from "http";

export const isAuthenticated = async (req: IncomingMessage) => {
  const cookieHeader = req.headers.cookie;

  console.log(cookieHeader);

  if (!cookieHeader) return false;

  const parsedCookies = cookie.parse(cookieHeader);

  if (!parsedCookies) return false;

  const auth = parsedCookies["authorization"];

  if (!auth) return false;

  const session = await prisma.session.findFirst({
    where: {
      id: auth,
    },
  });

  if (!session) return false;

  if (new Date().getTime() - session.expires.getTime() >= 3600) {
    await prisma.session.delete({ where: { id: auth } });
    return false;
  }

  return true;
};

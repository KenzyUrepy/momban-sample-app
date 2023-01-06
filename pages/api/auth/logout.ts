import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
  const { access_token } = parseCookies({ req });

  const logoutRes = await (
    await fetch("https://localhost.api.momban.net:3000/logout", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).text();

  res.setHeader("Set-Cookie", [
    serialize("access_token", "expired", {
      domain: ".momban.net",
      httpOnly: true,
      maxAge: 0,
      path: "/",
      secure: true,
    }),
    serialize("refresh_token", "expired", {
      domain: ".momban.net",
      httpOnly: true,
      maxAge: 0,
      path: "/",
      secure: true,
    }),
    serialize("session", "expired", {
      domain: ".momban.net",
      httpOnly: true,
      maxAge: 0,
      path: "/",
      secure: true,
    }),
  ]);

  res.redirect(logoutRes);
}

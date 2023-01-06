import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const openidConfigurationRes = await (
    await fetch("https://localhost.api.momban.net:3000/.well-known/openid-configuration", {
      method: "GET",
    })
  ).json();

  const state = v4();
  const issuer = openidConfigurationRes.issuer;

  const session = {
    issuer,
    state,
  };

  res.setHeader(
    "Set-Cookie",
    serialize("_session", JSON.stringify(session) ?? "", {
      domain: ".momban.net",
      maxAge: 60 * 10,
      path: "/",
      secure: true,
    }),
  );

  res.redirect(
    `${process.env.MOMBAN_DOMAIN_URL}?response_type=code&client_id=${
      process.env.MOMBAN_CLIENT_ID
    }&scope=openid profile email&callback_uri=${req.headers.referer?.replace(/\/$/, "")}` ?? "",
  );
}

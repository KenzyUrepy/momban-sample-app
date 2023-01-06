import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const domain = `https://${req.headers.host}`;
  const discoveryEndpointRes = await (
    await fetch("https://localhost.api.momban.net:3000/.well-known/openid-configuration", {
      method: "GET",
    })
  ).json();

  const state = v4().replace(/-/g, "");

  const sessionCookie = {
    domain: domain,
    issuer: discoveryEndpointRes.issuer,
    state: state,
  };

  res.setHeader(
    "Set-Cookie",
    serialize("session", Buffer.from(JSON.stringify(sessionCookie)).toString("base64"), {
      domain: ".momban.net",
      maxAge: 60 * 10,
      path: "/",
      secure: true,
    }),
  );

  res.redirect(
    `${process.env.MOMBAN_DOMAIN_URL}?response_type=code&client_id=${process.env.MOMBAN_CLIENT_ID}&scope=openid profile email&state=${state}` ??
      "",
  );
}

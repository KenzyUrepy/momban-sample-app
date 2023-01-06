import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";

export default async function me(req: NextApiRequest, res: NextApiResponse) {
  const { access_token } = parseCookies({ req });

  const me = await (
    await fetch("https://localhost.api.momban.net:3000/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json();

  res.json(me);
  return me;
}

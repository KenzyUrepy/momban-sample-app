import { serialize } from "cookie";
import CryptoJS from "crypto-js";
import * as AES from "crypto-js/aes";
import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";

type getTokenRes = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: "Bearer";
};

const isIDTokenVaild = (data: getTokenRes, issuer: string) => {
  const codedPayload = data.id_token.split(".")[1];
  const payload = JSON.parse(Buffer.from(codedPayload, "base64").toString());
  const signature = data.id_token.split(".")[2];

  const iss = payload.iss === decodeURI(issuer);
  const aud = payload.aud === process.env.MOMBAN_CLIENT_ID;
  const exp = payload.exp > new Date().getTime() / 1000;
  if (!iss || !aud || !exp) return false;

  const decodedSignature = AES.decrypt(signature, process.env.MOMBAN_CLIENT_SECRET || "").toString(
    CryptoJS.enc.Utf8,
  );
  if (
    !(JSON.stringify(payload) === Buffer.from(decodedSignature.split(".")[1], "base64").toString())
  )
    return false;

  return true;
};

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
  const clientCredential = Buffer.from(
    `${process.env.MOMBAN_CLIENT_ID}:${process.env.MOMBAN_CLIENT_SECRET}`,
  ).toString("base64");
  const cookies = parseCookies({ req });
  const { issuer, state } = JSON.parse(cookies["_session"]);

  if (!(state.length === 0)) {
    if (req.query.state !== state) {
      throw new Error("stateが違うよ");
    }
    const tokens = (await (
      await fetch(
        `https://localhost.api.momban.net:3000/token?code=${req.query.code}&client_id=${req.query.client_id}`,
        {
          credentials: "include",
          headers: {
            Authorization: `Basic ${clientCredential}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
        },
      )
    ).json()) as getTokenRes;
    if (!isIDTokenVaild(tokens, issuer)) {
      throw new Error("認証エラーが発生しました");
    }

    const date = new Date().getTime();

    const userInfo = await (
      await fetch("https://localhost.api.momban.net:3000/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })
    ).json();

    if (!!userInfo) {
      res.setHeader("Set-Cookie", [
        serialize("access_token", tokens.access_token, {
          domain: ".momban.net",
          expires: new Date(date + 60 * 60 * 1 * 1000),
          path: "/",
          secure: true,
        }),
        serialize("refresh_token", tokens.refresh_token, {
          domain: ".momban.net",
          expires: new Date(date + 60 * 60 * 24 * 90 * 1000),
          path: "/",
          secure: true,
        }),
        serialize(
          "_session",
          JSON.stringify(Buffer.from(JSON.stringify(userInfo)).toString("base64")),
          {
            domain: ".momban.net",
            expires: new Date(date + 60 * 60 * 24 * 90 * 1000),
            path: "/",
            secure: true,
          },
        ),
      ]);
      res.redirect(String(req.query.callback_uri));
    }
  } else {
    throw new Error("stateが存在しないよ");
  }
}

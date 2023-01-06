const fs = require("fs");
const https = require("https");

const express = require("express");
const next = require("next");

const app = next({ dev: true });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const expressApp = express();

  expressApp.get("*", (req, res) => handle(req, res));

  const options = {
    cert: fs.readFileSync("./secrets/fullchain.pem"),
    key: fs.readFileSync("./secrets/privkey.pem"),
  };
  const server = https.createServer(options, expressApp);
  server.listen(3002);
})();

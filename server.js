const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_ROOT = __dirname;

app.disable("x-powered-by");

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "LoadCalcPro X Website"
  });
});

app.use(
  express.static(SITE_ROOT, {
    extensions: ["html"],
    index: "index.html",
    redirect: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      } else {
        res.setHeader("Cache-Control", "public, max-age=3600");
      }
    }
  })
);

app.use((req, res) => {
  res.status(404).sendFile(path.join(SITE_ROOT, "404.html"), (error) => {
    if (error) {
      res.status(404).send("Page not found.");
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`LoadCalcPro X website running on port ${PORT}`);
});

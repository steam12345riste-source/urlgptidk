
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = "/data";
const DATA_FILE = path.join(DATA_DIR, "urls.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/list", (req, res) => {
  const urls = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(urls);
});

app.post("/api/add", (req, res) => {
  const { code, url } = req.body;
  const urls = JSON.parse(fs.readFileSync(DATA_FILE));
  urls.push({ code, url });
  fs.writeFileSync(DATA_FILE, JSON.stringify(urls, null, 2));
  res.json({ ok: true });
});

app.delete("/api/delete/:code", (req, res) => {
  const code = req.params.code;
  let urls = JSON.parse(fs.readFileSync(DATA_FILE));
  urls = urls.filter(u => u.code !== code);
  fs.writeFileSync(DATA_FILE, JSON.stringify(urls, null, 2));
  res.json({ ok: true });
});

app.get("/s/:code", (req, res) => {
  const code = req.params.code;
  const urls = JSON.parse(fs.readFileSync(DATA_FILE));
  const match = urls.find(u => u.code === code);
  if (match) return res.redirect(match.url);
  res.status(404).send("Not found");
});

app.listen(PORT, () => console.log("Server running on " + PORT));

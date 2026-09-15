import fs from "node:fs";

const content = fs.readFileSync("src/app/icon.svg", "utf8");
const match = content.match(/base64,([A-Za-z0-9+/=]+)/);
if (match) {
  const buf = Buffer.from(match[1], "base64");
  fs.writeFileSync("public/decoded-icon.png", buf);
  console.log("Saved decoded icon to public/decoded-icon.png, size:", buf.length);
}

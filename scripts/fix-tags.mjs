import fs from "fs";
import path from "path";

const BAD = "motionContent";
const root = path.join(import.meta.dirname, "..", "src");

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(name)) {
      let t = fs.readFileSync(p, "utf8");
      if (t.includes(BAD)) {
        fs.writeFileSync(p, t.replaceAll(BAD, "div"));
        console.log("fixed", p);
      }
    }
  }
}

walk(root);

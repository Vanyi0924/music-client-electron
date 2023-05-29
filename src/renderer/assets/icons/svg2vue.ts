import { readFileSync, writeFileSync, readdirSync } from "fs";
import prettier from "prettier";

const sSemplate = "<template>";
const eSemplate = "</template>";

function convert() {
  const files = readdirSync("./svg");

  for (const file of files) {
    const buf = readFileSync(`./svg/${file}`);
    const svgStr = buf.toString();
    const vueTpl = `${sSemplate}${svgStr}${eSemplate}`;

    const [filename, ext] = file.split(".");
    writeFileSync(
      `./vue/${filename}.vue`,
      prettier.format(vueTpl, { semi: false, parser: "babel" }).slice(1)
    );
  }
}

convert();

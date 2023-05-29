import { readFileSync, writeFileSync, readdirSync } from "fs";
import prettier from "prettier";

const sSemplate = "<template>";
const eSemplate = "</template>";

function convert() {
  const files = readdirSync("./vue");

  for (const file of files) {
    const buf = readFileSync(`./vue/${file}`);
    const svgVueStr = buf.toString();

    const sSemplateIndex = svgVueStr.indexOf(sSemplate);
    const eSemplateIndex = svgVueStr.indexOf(eSemplate);

    const [filename, ext] = file.split(".");
    writeFileSync(
      `./svg/${filename}.svg`,
      prettier
        .format(
          svgVueStr.slice(sSemplateIndex + sSemplate.length, eSemplateIndex),
          { semi: false, parser: "babel" }
        )
        .slice(1)
    );
  }
}

convert();

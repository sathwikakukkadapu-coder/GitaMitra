import { mkdir, writeFile } from "node:fs/promises";

const sourceUrl = "https://raw.githubusercontent.com/chandra-79/gita-learner/main/data.js";
const response = await fetch(sourceUrl);
if (!response.ok) throw new Error(`Dataset fetch failed: HTTP ${response.status}`);

let source = await response.text();
if (!source.includes("GITA")) throw new Error("Unexpected upstream dataset format.");

// Export the source array to the browser while retaining its original export.
source += "\n\nif (typeof window !== 'undefined') window.GITA_DATA = GITA;\n";

await mkdir("public/data", { recursive: true });
await writeFile("public/data/gita-multilingual.js", source, "utf8");
console.log("Created public/data/gita-multilingual.js");

const fs = require("fs");
const papaparse = require("papaparse");

const csv_text = fs.readFileSync("./crs.csv", "utf-8");
const parsed = papaparse.parse(csv_text, { header: true });
const rows = parsed.data;
const oldDefs = rows
  .filter(row => row.code && row.proj4)
  .sort((a, b) => Math.sign(a.code - b.code))
  .map(row => [parseInt(row.code), row.proj4]);
// .map(([code, def], i, arr) => [code - (arr[i - 1] || [0])[0], def])
// .flat();
console.log("oldDefs.length:", oldDefs.length);
const oldDefsSrids = oldDefs.map(item => item[0]);

const csv_text2 = fs.readFileSync("./gdalsrsinfo.csv", "utf-8");
const parsed2 = papaparse.parse(csv_text2, { header: true });
const rows2 = parsed2.data;
const newDefs = rows2
  .filter(row => row["EPSG"] && row["PROJ.4"])
  .sort((a, b) => Math.sign(a["EPSG"] - b["EPSG"]))
  .map(row => [parseInt(row["EPSG"]), row["PROJ.4"]])
  .filter(row => oldDefsSrids.includes(row[0]) !== true);
  // .map(([code, def], i, arr) => [code - (arr[i - 1] || [0])[0], def])
  // .flat();
console.log("newDefs.length:", newDefs.length);

/* Step 3: Save JSON */
const defs = [
  ...oldDefs.flat(),
  ...newDefs.flat(),
];
console.log("defs.length:", defs.length);
fs.writeFileSync("./defs.json", JSON.stringify(defs));

console.log("completed step 2");


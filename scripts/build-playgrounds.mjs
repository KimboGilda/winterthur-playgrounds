import { readFileSync, writeFileSync } from "fs";

const raw = JSON.parse(readFileSync("src/data/overpass-raw.json", "utf-8"));

const playgrounds = raw.elements
  .map((el) => {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!lat || !lon) return null;
    return {
      id: el.id,
      name: el.tags?.name ?? "Spielplatz (unnamed)",
      lat,
      lon,
      surface: el.tags?.surface ?? null,
      operator: el.tags?.operator ?? null,
    };
  })
  .filter(Boolean);

writeFileSync(
  "src/data/playgrounds.json",
  JSON.stringify(playgrounds, null, 2),
);
console.log(`Wrote ${playgrounds.length} playgrounds`);

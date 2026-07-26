import { readFileSync, writeFileSync } from "fs";

const raw = JSON.parse(readFileSync("src/data/overpass-raw.json", "utf-8"));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "WinterthurPlaygroundsTutorial/1.0 (kimbogilda personal project)",
      },
    });

    if (!res.ok) {
      console.warn(`  ⚠ HTTP ${res.status} for ${lat},${lon}`);
      return null;
    }

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      console.warn(
        `  ⚠ Non-JSON response for ${lat},${lon}: ${text.slice(0, 80)}`,
      );
      return null;
    }

    return json.address?.road ?? null;
  } catch (err) {
    console.warn(`  ⚠ Request failed for ${lat},${lon}: ${err.message}`);
    return null;
  }
}

async function buildPlaygrounds() {
  const initial = raw.elements
    .map((el) => {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      if (!lat || !lon) return null;

      const street = el.tags?.["addr:street"];
      const houseNumber = el.tags?.["addr:housenumber"];
      const fallbackName = street
        ? `Spielplatz, ${street}${houseNumber ? " " + houseNumber : ""}`
        : null; // null = no address tag, needs geocoding

      return {
        id: el.id,
        name: el.tags?.name ?? fallbackName,
        lat,
        lon,
        surface: el.tags?.surface ?? null,
        operator: el.tags?.operator ?? null,
      };
    })
    .filter(Boolean);

  const playgrounds = [];
  const toGeocode = initial.filter((p) => p.name === null).length;
  let geocodedCount = 0;

  for (const p of initial) {
    if (p.name === null) {
      geocodedCount++;
      const road = await reverseGeocode(p.lat, p.lon);
      p.name = road ? `Spielplatz, ${road}` : "Spielplatz (unnamed)";
      console.log(`[${geocodedCount}/${toGeocode}] ${p.id} → ${p.name}`);
      await sleep(1100); // Nominatim allows max 1 request/second

      if (geocodedCount % 20 === 0) {
        writeFileSync(
          "src/data/playgrounds.json",
          JSON.stringify([...playgrounds, p], null, 2),
        );
        console.log(`  💾 progress saved (${playgrounds.length + 1} so far)`);
      }
    }
    playgrounds.push(p);
  }

  writeFileSync(
    "src/data/playgrounds.json",
    JSON.stringify(playgrounds, null, 2),
  );
  console.log(
    `\nWrote ${playgrounds.length} playgrounds (${geocodedCount} geocoded)`,
  );
}

buildPlaygrounds();

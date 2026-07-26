import { useEffect, useState, useRef } from "react";
import { mapStore } from "../stores/map-store";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

function AddressSearch() {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);

      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query,
        )}&format=json&limit=5&countrycodes=ch&viewbox=8.62,47.55,8.80,47.45&bounded=1`;
        const res = await fetch(url);
        const json: NominatimResult[] = await res.json();
        setResults(json);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function selectResult(r: NominatimResult) {
    mapStore.flyTo(parseFloat(r.lat), parseFloat(r.lon), 15, r.display_name);
    setQuery(r.display_name);
    setResults([]);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Adresse suchen..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results.length > 0) {
            const topResult = results[0];
            selectResult(topResult);
          }
        }}
      />
      {results.length > 0 && (
        <ul>
          {results.map((r) => (
            <li key={r.place_id}>
              <button
                onClick={() => {
                  selectResult(r);
                }}
              >
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AddressSearch;

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

    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

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

  function clearSearch() {
    setQuery("");
    setResults([]);
    mapStore.clear();
  }

  return (
    <div className="relative w-72">
      <input
        type="text"
        placeholder="Adresse suchen..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results.length > 0) {
            selectResult(results[0]);
          }
        }}
        className="w-full rounded border border-gray-600 bg-white px-3 py-2 pr-8 text-sm text-[#1A1A1A] focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
      />

      {query && (
        <button
          onClick={clearSearch}
          aria-label="Suche zurücksetzen"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A1A1A]"
        >
          ✕
        </button>
      )}

      {loading && (
        <p className="absolute left-0 top-full mt-1 text-xs text-gray-500">
          Suche…
        </p>
      )}

      {results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded border border-gray-200 bg-white shadow-lg">
          {results.map((r) => (
            <li key={r.place_id}>
              <button
                onClick={() => selectResult(r)}
                className="w-full truncate px-3 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F4F4F2]"
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

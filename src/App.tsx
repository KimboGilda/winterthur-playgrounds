import { useState, useMemo } from "react";
import PlaygroundMap from "./components/playground-map";
import PlaygroundSidebar from "./components/playground-sidebar";
import playgroundsData from "./data/playgrounds.json";
import AddressSearch from "./components/address-search";
import type { Playground } from "./stores/types";

export default function App() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const data = playgroundsData as Playground[];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((p) => p.name.toLowerCase().includes(q));
  }, [data, search]);

  return (
    <div className="flex h-screen w-screen flex-col">
      <header className="flex items-center gap-3 bg-[#1A1A1A] px-4 py-3 text-white shadow">
        <div className="flex h-11 w-13 flex-shrink-0 items-center justify-center rounded-sm bg-white text-sm font-bold">
          <img src="logo.png" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight text-red-300">
            Spielplätze Winterthur
          </h1>
        </div>
      </header>
      <div className="relative flex flex-1 overflow-hidden">
        <PlaygroundSidebar
          playgrounds={filtered}
          search={search}
          onSearchChange={setSearch}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="relative flex-1 isolate">
          <PlaygroundMap playgrounds={filtered} />
        </main>
      </div>
    </div>
  );
}

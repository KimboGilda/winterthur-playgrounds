import { useState, useMemo } from "react";
import PlaygroundMap from "./components/playground-map";
import PlaygroundSidebar from "./components/playground-sidebar";
import playgroundsData from "./data/playgrounds.json";
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
      <header className="bg-emerald-700 px-4 py-3 text-white shadow">
        <h1 className="text-lg font-bold">Winterthur Playgrounds</h1>
        <p className="text-sm text-emerald-100">
          {filtered.length} of {data.length} playgrounds
        </p>
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

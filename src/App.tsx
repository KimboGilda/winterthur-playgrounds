import PlaygroundMap from "./components/playground-map";

export default function App() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <header className="bg-red-700 px-4 py-3 text-white shadow">
        <h1 className="text-lg font-bold">Winterthur Playgrounds</h1>
        <p className="text-sm text-emerald-100">
          Public playgrounds around the city
        </p>
      </header>
      <main className="flex-1">
        <PlaygroundMap />
      </main>
    </div>
  );
}

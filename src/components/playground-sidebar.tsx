import type { Playground } from "../stores/types";

interface Props {
  playgrounds: Playground[];
  search: string;
  onSearchChange: (value: string) => void;
}

function PlaygroundSidebar({ playgrounds, search, onSearchChange }: Props) {
  return (
    <aside className="flex w-72 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-3">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search playgrounds…"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
        />
      </div>

      <ul className="flex-1 overflow-y-auto">
        {playgrounds.length === 0 && (
          <li className="p-4 text-sm text-gray-400">No playgrounds match.</li>
        )}
        {playgrounds.map((p) => (
          <li key={p.id} className="border-b border-gray-100 px-4 py-2 text-sm">
            <div className="font-medium text-gray-800">{p.name}</div>
            {p.operator && (
              <div className="text-xs text-gray-500">{p.operator}</div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default PlaygroundSidebar;

import type { Playground } from "../stores/types";

interface Props {
  playgrounds: Playground[];
  search: string;
  onSearchChange: (value: string) => void;
  open: boolean;
  onToggle: () => void;
}

function PlaygroundSidebar({
  playgrounds,
  search,
  onSearchChange,
  open,
  onToggle,
}: Props) {
  return (
    <>
      <aside
        className={`
          absolute inset-y-0 left-0 z-20 flex w-full flex-col
          border-r border-gray-200 bg-white shadow-lg
          transition-transform duration-300 ease-in-out
          sm:w-72
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center gap-2 border-b border-gray-200 p-3">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Spielplätze suchen…"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
          />

          <button
            onClick={onToggle}
            aria-label="Hide sidebar"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded border border-gray-300 text-lg hover:bg-gray-50 sm:hidden"
          >
            ✕
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto">
          {playgrounds.length === 0 && (
            <li className="p-4 text-sm text-gray-400">No playgrounds match.</li>
          )}
          {playgrounds.map((p) => (
            <li
              key={p.id}
              className="border-b border-gray-100 px-4 py-3 text-sm sm:py-2"
            >
              <div className="font-medium text-gray-800">{p.name}</div>
              {p.operator && (
                <div className="text-xs text-gray-500">{p.operator}</div>
              )}
            </li>
          ))}
        </ul>
      </aside>
      <button
        onClick={onToggle}
        aria-label={open ? "Hide sidebar" : "Show sidebar"}
        className={`
          absolute top-4 z-30 h-10 w-10 items-center justify-center
          rounded-r-md border border-gray-200 bg-white shadow
          transition-[left] duration-300 ease-in-out
          hover:bg-gray-50
          ${open ? "hidden left-72 sm:flex" : "flex left-4"}
          `}
      >
        {open ? "‹" : "›"}
      </button>
    </>
  );
}

export default PlaygroundSidebar;

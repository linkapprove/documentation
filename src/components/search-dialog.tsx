import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CornerDownLeft, FileText, Hash, Search, X } from "lucide-react";
import { SEARCH_INDEX, type TSearchEntry } from "@/constants/navigation";
import { cn } from "@/utils";

const MAX_RESULTS = 8;

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pool = needle
      ? SEARCH_INDEX.filter(
          (entry) =>
            entry.label.toLowerCase().includes(needle) ||
            entry.page.toLowerCase().includes(needle) ||
            entry.group.toLowerCase().includes(needle)
        )
      : SEARCH_INDEX.filter((entry) => !entry.hash);
    return pool.slice(0, MAX_RESULTS);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setHighlighted(0);
    const timer = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => setHighlighted(0), [query]);

  const go = (entry: TSearchEntry) => {
    navigate(`${entry.path}${entry.hash}`);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlighted((current) => (current + 1) % Math.max(results.length, 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlighted((current) =>
          current === 0 ? Math.max(results.length - 1, 0) : current - 1
        );
      }
      if (event.key === "Enter") {
        const entry = results[highlighted];
        if (entry) go(entry);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, results, highlighted]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
      />

      <div className="animate-fade-up relative w-full max-w-[38rem] overflow-hidden rounded-2xl border border-line bg-surface shadow-pop">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <Search className="h-4 w-4 shrink-0 text-subtle" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the docs…"
            className="min-w-0 flex-1 bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-subtle"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-line p-1 text-subtle transition-colors hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="scrollbar-slim max-h-[22rem] overflow-y-auto p-2">
          {results.length ? (
            results.map((entry, index) => {
              const Icon = entry.hash ? Hash : FileText;
              return (
                <button
                  key={`${entry.path}${entry.hash}`}
                  type="button"
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => go(entry)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    index === highlighted ? "bg-accent/[0.09]" : "hover:bg-elevated"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line",
                      index === highlighted
                        ? "border-accent/40 text-accent"
                        : "text-subtle"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">
                      {entry.label}
                    </span>
                    <span className="block truncate text-xs text-subtle">
                      {entry.group} · {entry.page}
                    </span>
                  </span>
                  {index === highlighted ? (
                    <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-subtle" />
                  ) : null}
                </button>
              );
            })
          ) : (
            <p className="px-3 py-8 text-center text-sm text-subtle">
              Nothing matches “{query}”.
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[0.6875rem] text-subtle">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            open
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>esc</Kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-elevated px-1.5 py-0.5 font-sans text-[0.625rem] text-subtle">
      {children}
    </kbd>
  );
}

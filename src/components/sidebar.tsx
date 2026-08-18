import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, KeyRound } from "lucide-react";
import { API_KEYS_URL, API_VERSION, NAV_GROUPS } from "@/constants/navigation";
import { cn } from "@/utils";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col gap-6">
      <nav className="space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-2 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-subtle">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.pages.map((page) => {
                const isActive = pathname === page.path;
                return (
                  <div key={page.path}>
                    <Link
                      to={page.path}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-accent/10 font-medium text-accent"
                          : "text-subtle hover:bg-elevated hover:text-ink"
                      )}
                    >
                      <page.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive ? "text-accent" : "text-subtle"
                        )}
                      />
                      {page.label}
                    </Link>

                    {isActive ? (
                      <div className="ml-[1.5625rem] mt-1 space-y-px border-l border-line pl-3">
                        {page.sections.map((section) => (
                          <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={onNavigate}
                            className="block rounded-md px-2 py-1 text-[0.8125rem] text-subtle transition-colors hover:text-accent"
                          >
                            {section.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <a
        href={API_KEYS_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-auto flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 transition-colors hover:border-accent/40"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <KeyRound className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1 text-[0.8125rem] font-medium text-ink">
            Get an API key
            <ArrowUpRight className="h-3 w-3 text-subtle" />
          </span>
          <span className="mt-0.5 block text-[0.6875rem] leading-snug text-subtle">
            Account → API Keys in your publisher dashboard
          </span>
        </span>
      </a>

      <p className="px-3 pb-2 font-mono text-[0.6875rem] text-subtle">
        API version {API_VERSION}
      </p>
    </div>
  );
}

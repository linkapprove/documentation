import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  KeyRound,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { SearchDialog } from "@/components/search-dialog";
import { useTheme } from "@/contexts/theme-context";
import { useApiToken } from "@/contexts/api-token-context";
import { DASHBOARD_URL, NAV_GROUPS } from "@/constants/navigation";
import { cn } from "@/utils";

const TOP_LINKS = [
  { label: "Documentation", to: "/overview" },
  { label: "API Reference", to: "/programs" },
  { label: "Errors", to: "/errors" },
];

export function TopBar({
  onOpenMobileNav,
  isMobileNavOpen,
}: {
  onOpenMobileNav: () => void;
  isMobileNavOpen: boolean;
}) {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { token } = useApiToken();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const ThemeIcon = theme === "dark" ? Sun : Moon;
  const isReferenceActive = NAV_GROUPS[1]?.pages.some(
    (page) => page.path === pathname
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-canvas/85 backdrop-blur-xl transition-colors",
          isScrolled ? "border-line" : "border-transparent"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[110rem] items-center gap-6 px-6 max-md:gap-3 max-md:px-4">
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label="Toggle navigation"
            className="hidden rounded-lg border border-line p-2 text-subtle max-lg:block"
          >
            {isMobileNavOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>

          <Link
            to="/overview"
            className="w-[10.5rem] shrink-0 max-md:w-[8.5rem]"
          >
            <Logo />
          </Link>

          <nav className="flex items-center gap-1 max-lg:hidden">
            {TOP_LINKS.map((link) => {
              const isActive =
                link.to === pathname ||
                (link.label === "API Reference" && isReferenceActive);
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-subtle hover:text-ink"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 rounded-xl border border-line bg-surface py-1.5 pl-3 pr-2 text-sm text-subtle transition-colors hover:border-accent/40 hover:text-ink max-md:hidden"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="w-[7rem] text-left">Search docs</span>
              <kbd className="rounded border border-line bg-elevated px-1.5 py-0.5 font-sans text-[0.625rem]">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="hidden rounded-lg border border-line p-2 text-subtle max-md:block"
            >
              <Search className="h-4 w-4" />
            </button>

            <span
              title={
                token
                  ? "An API key is set for this session"
                  : "No API key set. Add one in any Try it panel"
              }
              className={cn(
                "flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-[0.6875rem] font-medium max-md:hidden",
                token
                  ? "border-get/30 bg-get/[0.08] text-get"
                  : "border-line text-subtle"
              )}
            >
              <KeyRound className="h-3.5 w-3.5" />
              {token ? "Key set" : "No key"}
            </span>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-lg border border-line p-2 text-subtle transition-colors hover:border-accent/40 hover:text-accent"
            >
              <ThemeIcon className="h-4 w-4" />
            </button>

            <a
              href={DASHBOARD_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-sm font-medium text-canvas transition-opacity hover:opacity-90 max-md:hidden"
            >
              Dashboard
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      <SearchDialog
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

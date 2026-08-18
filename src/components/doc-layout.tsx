import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { DOC_PAGES, type TDocPage } from "@/constants/navigation";
import { cn } from "@/utils";

export function DocLayout({
  page,
  children,
}: {
  page: TDocPage;
  children: ReactNode;
}) {
  const { pathname, hash } = useLocation();
  const [activeSection, setActiveSection] = useState(
    page.sections[0]?.id ?? ""
  );

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );

    page.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [page]);

  const index = DOC_PAGES.findIndex((item) => item.path === page.path);
  const previous = index > 0 ? DOC_PAGES[index - 1] : null;
  const next = index < DOC_PAGES.length - 1 ? DOC_PAGES[index + 1] : null;

  return (
    <div className="mx-auto grid w-full max-w-[110rem] grid-cols-[15rem_minmax(0,1fr)_13rem] gap-x-10 px-6 pb-24 pt-10 max-2xl:grid-cols-[15rem_minmax(0,1fr)] max-lg:grid-cols-1 max-md:px-4">
      <aside className="sticky top-[5.5rem] h-[calc(100vh-8rem)] max-lg:hidden">
        <div className="scrollbar-slim h-full overflow-y-auto pr-2">
          <Sidebar />
        </div>
      </aside>

      <main className="min-w-0">
        <div className="animate-fade-up">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent">
            {page.eyebrow}
          </p>
          <h1 className="mt-2.5 text-[2.5rem] font-bold leading-[1.1] tracking-[-0.035em] text-ink max-md:text-[2rem]">
            {page.label}
          </h1>
          <p className="mt-3 max-w-3xl text-[1.0625rem] leading-[1.7] text-subtle">
            {page.summary}
          </p>
        </div>

        <div className="mt-10">{children}</div>

        <div className="mt-16 grid grid-cols-2 gap-4 border-t border-line pt-8 max-md:grid-cols-1">
          {previous ? (
            <Link
              to={previous.path}
              className="group flex flex-col gap-1 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent/40"
            >
              <span className="flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-subtle">
                <ArrowLeft className="h-3 w-3" />
                Previous
              </span>
              <span className="text-sm font-medium text-ink group-hover:text-accent">
                {previous.label}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={next.path}
              className="group flex flex-col items-end gap-1 rounded-2xl border border-line bg-surface p-4 text-right transition-colors hover:border-accent/40"
            >
              <span className="flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-subtle">
                Next
                <ArrowRight className="h-3 w-3" />
              </span>
              <span className="text-sm font-medium text-ink group-hover:text-accent">
                {next.label}
              </span>
            </Link>
          ) : null}
        </div>
      </main>

      <aside className="sticky top-[5.5rem] h-fit max-2xl:hidden">
        <p className="pb-3 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-subtle">
          On this page
        </p>
        <div className="space-y-px border-l border-line">
          {page.sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1.5 pl-3 text-[0.8125rem] transition-colors",
                activeSection === section.id
                  ? "border-accent font-medium text-accent"
                  : "border-transparent text-subtle hover:text-ink"
              )}
            >
              {section.label}
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}

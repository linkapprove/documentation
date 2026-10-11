import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { TopBar } from "@/components/top-bar";
import { Sidebar } from "@/components/sidebar";
import Overview from "@/pages/overview";
import Quickstart from "@/pages/quickstart";
import Authentication from "@/pages/authentication";
import Channels from "@/pages/channels";
import Programs from "@/pages/programs";
import TrackingLinks from "@/pages/tracking-links";
import Reports from "@/pages/reports";
import Payments from "@/pages/payments";
import Account from "@/pages/account";
import Webhooks from "@/pages/webhooks";
import Errors from "@/pages/errors";
import { SITE_NAME } from "@/constants/navigation";
import { cn } from "@/utils";

export default function App() {
  const { pathname } = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="grid-fade absolute inset-x-0 top-0 h-[32rem]" />
        <div className="animate-float absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-halo/[0.14] blur-3xl" />
        <div className="animate-float-slow absolute -right-40 top-20 h-[28rem] w-[28rem] rounded-full bg-post/[0.07] blur-3xl" />
      </div>

      <TopBar
        onOpenMobileNav={() => setIsMobileNavOpen((open) => !open)}
        isMobileNavOpen={isMobileNavOpen}
      />

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-30 hidden bg-canvas/95 backdrop-blur-xl",
          isMobileNavOpen && "max-lg:block"
        )}
      >
        <div className="scrollbar-slim h-full overflow-y-auto px-4 py-6">
          <Sidebar onNavigate={() => setIsMobileNavOpen(false)} />
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/quickstart" element={<Quickstart />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/tracking-links" element={<TrackingLinks />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/account" element={<Account />} />
        <Route path="/webhooks" element={<Webhooks />} />
        <Route path="/errors" element={<Errors />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[110rem] items-center justify-between gap-4 px-6 py-8 text-xs text-subtle max-md:flex-col max-md:gap-3 max-md:px-4">
          <span>
            © {new Date().getFullYear()} LinkApprove LLC · Harrisonville, MO
          </span>
          <span className="font-mono">{pathname}</span>
        </div>
      </footer>
    </div>
  );
}

function NotFound() {
  useEffect(() => {
    document.title = `Page not found · ${SITE_NAME}`;
  }, []);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[110rem] flex-col items-start justify-center gap-4 px-6 py-24 max-md:px-4">
      <span className="font-mono text-xs text-subtle">404</span>
      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-[-0.035em] text-ink max-md:text-[2rem]">
        Page not found
      </h1>
      <p className="max-w-xl text-[0.9375rem] leading-relaxed text-subtle">
        This page does not exist. It may have moved when the docs were
        reorganised.
      </p>
      <Link
        to="/overview"
        className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent"
      >
        Go to the overview
      </Link>
    </main>
  );
}

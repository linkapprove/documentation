import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
        <Route path="*" element={<Navigate to="/overview" replace />} />
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

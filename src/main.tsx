import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/app";
import { ThemeProvider } from "@/contexts/theme-context";
import { ApiTokenProvider } from "@/contexts/api-token-context";
import "@/index.css";

const root = document.getElementById("root") as HTMLElement;

const app = (
  <StrictMode>
    <ThemeProvider>
      <ApiTokenProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApiTokenProvider>
    </ThemeProvider>
  </StrictMode>
);

if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);

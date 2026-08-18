import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/app";
import { ThemeProvider } from "@/contexts/theme-context";
import { ApiTokenProvider } from "@/contexts/api-token-context";
import "@/index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
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

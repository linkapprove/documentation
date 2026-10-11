import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "@/app";
import { ThemeProvider } from "@/contexts/theme-context";
import { ApiTokenProvider } from "@/contexts/api-token-context";

export {
  DOC_PAGES,
  SITE_NAME,
  SITE_URL,
  toDocumentTitle,
} from "@/constants/navigation";

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <ThemeProvider>
        <ApiTokenProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </ApiTokenProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

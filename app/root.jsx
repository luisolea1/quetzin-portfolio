import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import { projects, site } from "./content/index.js";
import SiteLayout from "./components/layout/SiteLayout.jsx";
import ErrorState from "./components/ui/ErrorState.jsx";
import interLatin from "@fontsource-variable/inter/files/inter-latin-standard-normal.woff2?url";
import "./styles/tokens.css";
import "./styles/fonts.css";
import "./styles/globals.css";

export function links() {
  return [
    { rel: "preload", as: "font", type: "font/woff2", href: interLatin, crossOrigin: "anonymous" },
  ];
}

export function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        <SiteLayout site={site} projectCount={projects.length}>
          {children}
        </SiteLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const missing = isRouteErrorResponse(error) && error.status === 404;
  return (
    <ErrorState
      label={missing ? "404 / No encontrado" : "Error"}
      title={missing ? "Esta página no existe." : "No hemos podido cargar la página."}
      linkLabel="Volver al inicio ↗"
      reload
    />
  );
}

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import { site } from "./content/index.js";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import MotionProvider from "./motion/MotionProvider.jsx";
import DeformationProvider from "./motion/deformation/DeformationProvider.jsx";
import "./styles/tokens.css";
import "./styles/fonts.css";
import "./styles/globals.css";

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
        <MotionProvider>
          <DeformationProvider>
            <Header site={site} />
            <main id="main" className="site-main">
              {children}
            </main>
            <Footer site={site} />
          </DeformationProvider>
        </MotionProvider>
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
    <div className="error-page">
      <span className="eyebrow">{missing ? "404 / No encontrado" : "Error"}</span>
      <h1>{missing ? "Esta página no existe." : "No hemos podido cargar la página."}</h1>
      <a href="/">Volver al inicio ↗</a>
    </div>
  );
}

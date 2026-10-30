import { createPageMeta } from "../content/seo.js";
import ErrorState from "../components/ui/ErrorState.jsx";

export function meta() {
  return createPageMeta("/404", { noIndex: import.meta.env.VITE_NOINDEX });
}
export default function NotFound() {
  return <ErrorState title="Esta página no existe." />;
}

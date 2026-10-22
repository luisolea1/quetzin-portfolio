import { site } from "../content/index.js";
import ErrorState from "../components/ui/ErrorState.jsx";

export function meta() {
  return [{ title: `Página no encontrada — ${site.name}` }];
}
export default function NotFound() {
  return <ErrorState title="Esta página no existe." />;
}

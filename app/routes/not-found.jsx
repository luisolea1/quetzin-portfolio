import { Link } from "react-router";
import { site } from "../content/index.js";

export function meta() {
  return [{ title: `Página no encontrada — ${site.name}` }];
}
export default function NotFound() {
  return (
    <div className="error-page">
      <h1>Esta página no existe.</h1>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}

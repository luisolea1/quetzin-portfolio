import { Link } from "react-router";
import styles from "./ErrorState.module.css";

export default function ErrorState({
  title,
  label,
  linkLabel = "Volver al inicio",
  reload = false,
}) {
  return (
    <div className={styles["error-state"]}>
      {label && <span className="u-eyebrow">{label}</span>}
      <h1 className={styles["error-state__title"]}>{title}</h1>
      {reload ? (
        <a className={styles["error-state__link"]} href="/">
          {linkLabel}
        </a>
      ) : (
        <Link className={styles["error-state__link"]} to="/">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

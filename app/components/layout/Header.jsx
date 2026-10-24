import { NavLink } from "react-router";
import AnimatedLink from "../../motion/AnimatedLink.jsx";
import styles from "./Header.module.css";

export default function Header({ site, projectCount }) {
  const formattedProjectCount = String(projectCount).padStart(2, "0");
  return (
    <header className={styles["site-header"]}>
      <NavLink className={styles["site-header__brand"]} to="/" aria-label="Inicio">
        {site.name}
        <span className={styles["site-header__registration"]} aria-hidden="true">
          ®
        </span>
      </NavLink>
      <nav className={styles["site-header__nav"]} aria-label="Navegación principal">
        <AnimatedLink to="/">Home</AnimatedLink>
        <AnimatedLink
          to="/work"
          ariaLabel={`Work (${formattedProjectCount})`}
          suffix={<span className={styles["site-header__count"]}>({formattedProjectCount})</span>}
        >
          Work
        </AnimatedLink>
        <AnimatedLink to="/about">About</AnimatedLink>
      </nav>
      {site.email ? (
        <a className={styles["site-header__contact"]} href={`mailto:${site.email}`}>
          Contacto
        </a>
      ) : (
        <span className={styles["site-header__contact"]}>
          Contacto{" "}
          <span className={`${styles["site-header__contact-pending"]} u-muted`}>(pendiente)</span>
        </span>
      )}
    </header>
  );
}

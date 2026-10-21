import { NavLink } from "react-router";
import AnimatedLink from "../../motion/AnimatedLink.jsx";
import styles from "./Header.module.css";

export default function Header({ site }) {
  return (
    <header className={styles.header}>
      <NavLink className={styles.brand} to="/" aria-label="Inicio">{site.name}<span aria-hidden="true">®</span></NavLink>
      <nav className={styles.nav} aria-label="Navegación principal">
        <AnimatedLink to="/">Home</AnimatedLink>
        <AnimatedLink to="/work">Work <span className={styles.count}>(06)</span></AnimatedLink>
        <AnimatedLink to="/about">About</AnimatedLink>
      </nav>
      {site.email ? <a className={styles.contact} href={`mailto:${site.email}`}>Contacto ↗</a> : <span className={styles.contact}>Contacto <span className="muted">(pendiente)</span></span>}
    </header>
  );
}

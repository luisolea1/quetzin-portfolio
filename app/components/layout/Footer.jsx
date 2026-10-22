import { Link } from "react-router";
import AnimatedLink from "../../motion/AnimatedLink.jsx";
import WordmarkEffect from "../../motion/WordmarkEffect.jsx";
import styles from "./Footer.module.css";

export default function Footer({ site }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div>
          <span className="eyebrow">Enlaces</span>
          <div className={styles.links}>
            {site.socials.length ? (
              site.socials
                .filter((social) => social.url)
                .map((social) => (
                  <a key={social.url} href={social.url} target="_blank" rel="noopener noreferrer">
                    {social.label} ↗
                  </a>
                ))
            ) : (
              <span className="muted">Redes pendientes</span>
            )}
          </div>
        </div>
        <div>
          <span className="eyebrow">Explorar</span>
          <div className={styles.links}>
            <AnimatedLink to="/">Inicio</AnimatedLink>
            <AnimatedLink to="/work">Proyectos</AnimatedLink>
            <AnimatedLink to="/about">Sobre mí</AnimatedLink>
          </div>
        </div>
        <div className={styles.details}>
          <span className="eyebrow">Contacto</span>
          <div className={styles.links}>
            {site.email ? (
              <a href={`mailto:${site.email}`}>{site.email}</a>
            ) : (
              <span className="muted">Correo pendiente</span>
            )}
            {site.phone && <a href={`tel:${site.phone}`}>{site.phone}</a>}
          </div>
        </div>
      </div>
      <WordmarkEffect site={site} />
      <div className={styles.bottom}>
        <span>Portfolio personal</span>
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            })
          }
        >
          Volver arriba ↑
        </button>
        <span>{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

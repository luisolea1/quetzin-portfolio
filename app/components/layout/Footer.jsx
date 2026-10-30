import { Link } from "react-router";
import AnimatedLink from "../../motion/AnimatedLink.jsx";
import WordmarkEffect from "../../motion/WordmarkEffect.jsx";
import styles from "./Footer.module.css";

export default function Footer({ site }) {
  return (
    <footer className={styles["site-footer"]}>
      <div className={styles["site-footer__columns"]}>
        <div>
          <span className="u-eyebrow">Enlaces</span>
          <div className={styles["site-footer__links"]}>
            {site.socials.length ? (
              site.socials
                .filter((social) => social.url)
                .map((social) => (
                  <a
                    className={styles["site-footer__link"]}
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}
                  </a>
                ))
            ) : (
              <span className="u-muted">Redes pendientes</span>
            )}
          </div>
        </div>
        <nav aria-labelledby="footer-navigation-title">
          <h2
            id="footer-navigation-title"
            className={`${styles["site-footer__heading"]} u-eyebrow`}
          >
            Explorar
          </h2>
          <div className={styles["site-footer__links"]}>
            <AnimatedLink className={styles["site-footer__link"]} to="/">
              Inicio
            </AnimatedLink>
            <AnimatedLink className={styles["site-footer__link"]} to="/work">
              Proyectos
            </AnimatedLink>
            <AnimatedLink className={styles["site-footer__link"]} to="/about">
              Sobre mí
            </AnimatedLink>
          </div>
        </nav>
        <div className={styles["site-footer__contact"]}>
          <span className="u-eyebrow">Contacto</span>
          <div className={styles["site-footer__links"]}>
            {site.email ? (
              <a className={styles["site-footer__link"]} href={`mailto:${site.email}`}>
                {site.email}
              </a>
            ) : (
              <span className="u-muted">Correo pendiente</span>
            )}
            {site.phone && (
              <a
                className={styles["site-footer__link"]}
                href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
              >
                {site.phone}
              </a>
            )}
          </div>
        </div>
      </div>
      <WordmarkEffect site={site} />
      <div className={styles["site-footer__bottom"]}>
        <span>Portfolio personal</span>
        <button
          className={styles["site-footer__back-to-top"]}
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

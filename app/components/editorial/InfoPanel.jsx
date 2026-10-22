import { Link } from "react-router";
import CircularCarousel from "../../motion/CircularCarousel.jsx";
import styles from "./InfoPanel.module.css";

export default function InfoPanel({
  heading,
  headingId,
  description,
  services,
  industries,
  carouselItems,
  linkTo,
  linkLabel,
  className = "",
  children,
}) {
  return (
    <section className={`${styles["info-panel"]} ${className}`} aria-labelledby={headingId}>
      <div className={styles["info-panel__columns"]}>
        <div>
          <h2 id={headingId} className={`${styles["info-panel__heading"]} u-eyebrow`}>
            {heading}
          </h2>
          {children || <p className={styles["info-panel__description"]}>{description}</p>}
        </div>
        <div className={styles["info-panel__lists"]}>
          <div>
            <span className="u-eyebrow">Servicios</span>
            {services.length ? (
              services.map((item) => (
                <p className={styles["info-panel__list-item"]} key={item}>
                  {item}
                </p>
              ))
            ) : (
              <p className={styles["info-panel__list-item"]}>Pendientes</p>
            )}
          </div>
          <div>
            <span className="u-eyebrow">Sectores</span>
            {industries.length ? (
              industries.map((item) => (
                <p className={styles["info-panel__list-item"]} key={item}>
                  {item}
                </p>
              ))
            ) : (
              <p className={styles["info-panel__list-item"]}>Pendientes</p>
            )}
          </div>
        </div>
      </div>
      <CircularCarousel
        items={carouselItems}
        className={styles["info-panel__carousel"]}
        fadeColor="#111111"
      />
      <Link className={styles["info-panel__link"]} to={linkTo}>
        {linkLabel}
        <span className={styles["info-panel__arrow"]}>↗</span>
      </Link>
    </section>
  );
}

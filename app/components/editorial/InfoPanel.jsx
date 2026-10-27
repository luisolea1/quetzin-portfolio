import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router";
import CircularCarousel from "../../motion/CircularCarousel.jsx";
import { ScrollImageContext } from "../../motion/ScrollImageContext.js";
import ArrowBadge from "../ui/ArrowBadge.jsx";
import styles from "./InfoPanel.module.css";

export default function InfoPanel({
  heading,
  headingId,
  ariaLabel,
  description,
  services,
  industries,
  carouselItems,
  linkTo,
  linkLabel,
  className = "",
  scrollEffect = "none",
  children,
}) {
  const panelRef = useRef(null);
  const registerSurface = useContext(ScrollImageContext);
  useEffect(() => {
    if (scrollEffect !== "curve") return;
    return registerSurface(null, panelRef.current);
  }, [registerSurface, scrollEffect]);

  return (
    <section
      ref={panelRef}
      className={`${styles["info-panel"]} ${scrollEffect === "curve" ? styles["info-panel--scroll-curve"] : ""} ${className}`}
      data-scroll-surface={scrollEffect === "curve" ? "color" : undefined}
      aria-labelledby={heading ? headingId : undefined}
      aria-label={heading ? undefined : ariaLabel}
    >
      <div className={styles["info-panel__columns"]}>
        <div>
          {heading && (
            <h2 id={headingId} className={`${styles["info-panel__heading"]} u-eyebrow`}>
              {heading}
            </h2>
          )}
          {children || (
            <p
              className={`${styles["info-panel__description"]} ${!heading ? styles["info-panel__description--without-heading"] : ""}`}
            >
              {description}
            </p>
          )}
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
        <ArrowBadge />
      </Link>
    </section>
  );
}

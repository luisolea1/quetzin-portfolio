import { useEffect, useRef, useState } from "react";
import styles from "./WordmarkEffect.module.css";

export default function WordmarkEffect({ site, heading = false, id }) {
  const ref = useRef(null);
  const Tag = heading ? "h1" : "div";
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [site.logo]);
  function move(event) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty(
      "--pointer-x",
      `${((event.clientX - rect.left) / rect.width) * 100}%`,
    );
  }
  return (
    <Tag
      id={id}
      ref={ref}
      className={styles["wordmark"]}
      onPointerMove={move}
      onPointerLeave={() => ref.current?.style.setProperty("--pointer-x", "50%")}
    >
      {site.logo && !failed ? (
        <img
          className={styles["wordmark__image"]}
          src={site.logo}
          alt={site.name}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={styles["wordmark__text"]}>{site.name}</span>
      )}
    </Tag>
  );
}

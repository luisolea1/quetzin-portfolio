import { useEffect, useState } from "react";
import styles from "./Media.module.css";

export default function Media({
  media,
  label = "Imagen pendiente",
  className = "",
  priority = false,
  tone = "light",
}) {
  const [failed, setFailed] = useState(false);
  const src = media?.src;

  useEffect(() => setFailed(false), [src]);

  return (
    <div
      className={`${styles["media"]} ${tone === "dark" ? styles["media--dark"] : ""} ${className}`}
      style={{ "--media-position": media?.position || "50% 50%" }}
    >
      {src && !failed ? (
        <img
          className={styles["media__image"]}
          src={src}
          alt={media.alt || ""}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={styles["media__placeholder"]} role="img" aria-label={media?.alt || label}>
          <span className={styles["media__placeholder-label"]}>{label}</span>
        </div>
      )}
    </div>
  );
}

import { useContext, useEffect, useRef, useState } from "react";
import { ScrollImageContext } from "../../motion/ScrollImageContext.js";
import styles from "./Media.module.css";

export default function Media({
  media,
  label = "Imagen pendiente",
  className = "",
  priority = false,
  tone = "light",
  scrollEffect = "none",
}) {
  const [failed, setFailed] = useState(false);
  const src = media?.src;
  const surfaceRef = useRef(null);
  const imageRef = useRef(null);
  const registerImage = useContext(ScrollImageContext);

  useEffect(() => {
    // Un recurso prioritario puede fallar antes de que React hidrate el HTML.
    const image = imageRef.current;
    setFailed(Boolean(src && image?.complete && !image.naturalWidth));
  }, [src]);
  useEffect(() => {
    if (scrollEffect !== "curve" || !imageRef.current || failed) return;
    return registerImage(imageRef.current, surfaceRef.current);
  }, [registerImage, scrollEffect, src, failed, media?.position]);

  return (
    <div
      ref={surfaceRef}
      className={`${styles["media"]} ${tone === "dark" ? styles["media--dark"] : ""} ${className}`}
      style={{ "--media-position": media?.position || "50% 50%" }}
    >
      {src && !failed ? (
        <img
          ref={imageRef}
          className={styles["media__image"]}
          src={src}
          alt={media.alt || ""}
          width={media.width}
          height={media.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
          data-scroll-image={scrollEffect === "curve" ? "" : undefined}
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

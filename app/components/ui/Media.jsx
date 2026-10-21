import { useEffect, useRef, useState } from "react";
import { useDeformation } from "../../motion/deformation/DeformationProvider.jsx";
import styles from "./Media.module.css";

export default function Media({ media, label = "Imagen pendiente", className = "", priority = false, deform = false }) {
  const ref = useRef(null);
  const imageRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const renderer = useDeformation();
  const src = media?.src;

  useEffect(() => setFailed(false), [src]);
  useEffect(() => {
    if (!src || failed || !deform || !renderer || !imageRef.current) return;
    const remote = src.startsWith("https://");
    const image = remote ? new Image() : imageRef.current;
    let unregister;
    const register = () => { if (image.naturalWidth) unregister = renderer.register(ref.current, image); };
    if (remote) {
      image.crossOrigin = "anonymous";
      image.addEventListener("load", register);
      image.src = src;
    } else if (image.complete) register();
    else image.addEventListener("load", register);
    return () => { image.removeEventListener("load", register); unregister?.(); };
  }, [src, failed, deform, renderer]);

  return <div ref={ref} className={`${styles.media} ${className}`} style={{ "--media-position": media?.position || "50% 50%" }}>
    {src && !failed ? <img ref={imageRef} src={src} alt={media.alt || ""} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} onError={() => setFailed(true)} /> : <div className={styles.placeholder} role="img" aria-label={media?.alt || label}><span>{label}</span></div>}
  </div>;
}

import { useEffect, useRef, useState } from "react";
import FoldText from "./FoldText.jsx";
import { motionConfig } from "./motionConfig.js";
import styles from "./WordmarkEffect.module.css";

export default function WordmarkEffect({ site, heading = false, id, effect = "spotlight" }) {
  const ref = useRef(null);
  const Tag = heading ? "h1" : "div";
  const [failed, setFailed] = useState(false);
  const fold = effect === "fold";
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
      className={`${styles["wordmark"]} ${fold ? styles["wordmark--fold"] : ""}`}
      onPointerMove={fold ? undefined : move}
      onPointerLeave={fold ? undefined : () => ref.current?.style.setProperty("--pointer-x", "50%")}
    >
      {site.logo && !failed ? (
        <img
          className={styles["wordmark__image"]}
          src={site.logo}
          alt={site.name}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={styles["wordmark__text"]}>
          {fold ? (
            <FoldText
              text={site.name}
              {...motionConfig.foldText}
              fontSize="inherit"
              fontWeight="inherit"
              style={{
                letterSpacing: "inherit",
                lineHeight: "inherit",
                whiteSpace: "nowrap",
                wordSpacing: "0.12em",
              }}
            />
          ) : (
            site.name
          )}
        </span>
      )}
    </Tag>
  );
}

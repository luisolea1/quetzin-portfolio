// Adaptación de FoldText (JavaScript + CSS), React Bits / David Haz.
// Licencia: ../../licenses/react-bits-LICENSE.md. Fuente aportada por el usuario.
import { useEffect, useMemo, useRef } from "react";
import useReducedMotion from "./useReducedMotion.js";
import styles from "./FoldText.module.css";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function FoldText({
  text = "Design unfolds",
  splitBy = "char",
  hinge = "top",
  foldStyle = "paper",
  duration = 0.65,
  stagger = 0.045,
  staggerFrom = "start",
  foldAngle = 92,
  ease = "power3.out",
  perspective = 700,
  creaseShading = 0.55,
  trigger = "mount",
  loopDelay = 1.4,
  hoverRefold = false,
  refoldRadius = 140,
  refoldAngle = 45,
  fontSize = 80,
  fontWeight = 800,
  color = "currentColor",
  className = "",
  style = {},
}) {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();
  const safeHinge = ["top", "bottom", "left", "right"].includes(hinge) ? hinge : "top";
  const safeStyle = ["paper", "blinds", "flip"].includes(foldStyle) ? foldStyle : "paper";
  const safeCrease = clamp(creaseShading, 0, 1);
  const safeAngle = clamp(foldAngle, 0, 180);
  const safeStagger = Math.max(0, stagger);
  const safeDelay = Math.max(0, loopDelay);
  const safeRadius = Math.max(1, refoldRadius);
  const safeRefold = clamp(refoldAngle, 0, 180);

  const segments = useMemo(() => {
    const renderPiece = (content, key, isLine = false) => (
      <span
        className={styles["fold-text__segment"]}
        data-fold-split={isLine ? "line" : undefined}
        key={key}
      >
        <span
          className={styles["fold-text__piece"]}
          data-fold-piece
          data-fold-hinge={safeHinge}
          data-fold-style={safeStyle}
          data-fold-text={safeStyle === "blinds" ? undefined : content}
        >
          {safeStyle === "blinds" ? (
            <>
              <span
                className={styles["fold-text__slat"]}
                data-fold-slat="a"
                data-fold-text={content}
              >
                {content}
              </span>
              <span
                className={styles["fold-text__slat"]}
                data-fold-slat="b"
                data-fold-text={content}
              >
                {content}
              </span>
            </>
          ) : (
            content
          )}
        </span>
      </span>
    );

    if (splitBy === "line")
      return text
        .split("\n")
        .map((line, index) => renderPiece(line || "\u00a0", `line-${index}`, true));

    return text.split(/(\s+)/).flatMap((part, partIndex) => {
      if (!part) return [];
      if (/^\s+$/.test(part))
        return part
          .split("\n")
          .flatMap((spaces, lineIndex) => [
            lineIndex > 0 ? <br key={`br-${partIndex}-${lineIndex}`} /> : null,
            spaces,
          ])
          .filter(Boolean);
      if (splitBy === "word") return [renderPiece(part, `word-${partIndex}`)];
      return [
        <span className={styles["fold-text__word"]} key={`word-${partIndex}`}>
          {Array.from(part).map((char, charIndex) =>
            renderPiece(char, `char-${partIndex}-${charIndex}`),
          )}
        </span>,
      ];
    });
  }, [text, splitBy, safeHinge, safeStyle]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let dispose;
    const restore = () => {
      // El HTML inicial y el respaldo nunca comienzan ocultos.
      for (const element of root.querySelectorAll("[data-fold-piece], [data-fold-slat]"))
        element.removeAttribute("style");
      delete root.dataset.foldReady;
    };
    import("./foldTextMotion.js")
      .then(({ createFoldTextMotion }) => {
        if (cancelled) return;
        dispose = createFoldTextMotion(root, {
          hinge: safeHinge,
          foldStyle: safeStyle,
          duration: Math.max(0, duration),
          stagger: safeStagger,
          staggerFrom,
          foldAngle: safeAngle,
          ease,
          creaseShading: safeCrease,
          trigger,
          loopDelay: safeDelay,
          hoverRefold,
          refoldRadius: safeRadius,
          refoldAngle: safeRefold,
        });
      })
      .catch((error) => {
        restore();
        if (!cancelled && import.meta.env.DEV)
          console.warn("FoldText: se conserva el texto estático.", error);
      });
    return () => {
      cancelled = true;
      dispose?.();
      restore();
    };
  }, [
    segments,
    reduced,
    safeHinge,
    safeStyle,
    duration,
    safeStagger,
    staggerFrom,
    safeAngle,
    ease,
    safeCrease,
    trigger,
    safeDelay,
    hoverRefold,
    safeRadius,
    safeRefold,
  ]);

  return (
    <span
      ref={rootRef}
      className={`${styles["fold-text"]} ${className}`.trim()}
      data-fold-root
      style={{
        "--fold-text-font-size": typeof fontSize === "number" ? `${fontSize}px` : fontSize,
        "--fold-text-font-weight": fontWeight,
        "--fold-text-color": color,
        "--fold-perspective": `${Math.max(120, perspective)}px`,
        ...style,
      }}
    >
      <span className="u-visually-hidden">{text}</span>
      <span className={styles["fold-text__visual"]} aria-hidden="true">
        {segments}
      </span>
    </span>
  );
}

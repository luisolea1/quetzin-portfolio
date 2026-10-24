import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ScrollImages.module.css";

export default function useScrollImages(subscribeFrame, reduced) {
  const targets = useRef(new Map());
  const failed = useRef(false);
  const [version, setVersion] = useState(0);
  const register = useCallback((image, surface) => {
    targets.current.set(image, surface);
    setVersion((value) => value + 1);
    return () => {
      surface.removeAttribute("data-scroll-curve-ready");
      targets.current.delete(image);
      if (!targets.current.size) failed.current = false;
      setVersion((value) => value + 1);
    };
  }, []);

  useEffect(() => {
    if (
      !targets.current.size ||
      reduced ||
      failed.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let cancelled = false;
    let engine;
    const onFailure = (error) => {
      if (cancelled) return;
      failed.current = true;
      if (import.meta.env.DEV) console.warn("M05: se mantiene el respaldo HTML.", error);
    };
    import("./scrollCurveEngine.js")
      .then(({ createScrollCurveEngine }) => {
        if (cancelled) return;
        engine = createScrollCurveEngine({
          targets: targets.current,
          subscribeFrame,
          canvasClassName: styles["scroll-images__canvas"],
          onFailure,
        });
      })
      .catch(onFailure);
    return () => {
      cancelled = true;
      engine?.dispose();
    };
  }, [version, reduced, subscribeFrame]);
  return register;
}

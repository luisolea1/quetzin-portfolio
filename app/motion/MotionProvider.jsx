import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router";
import { ScrollImageContext } from "./ScrollImageContext.js";
import useReducedMotion from "./useReducedMotion.js";
import useScrollImages from "./useScrollImages.js";

export default function MotionProvider({ children }) {
  const reduced = useReducedMotion();
  const location = useLocation();
  const lenisRef = useRef(null);
  const listeners = useRef(new Set());
  const subscribeFrame = useCallback((callback) => {
    listeners.current.add(callback);
    return () => listeners.current.delete(callback);
  }, []);
  const registerImage = useScrollImages(subscribeFrame, reduced);
  useLayoutEffect(() => {
    let cancelled = false;
    // ScrollRestoration decide la posición en sus layout effects. Después sólo
    // sincronizamos Lenis para que una inercia anterior no vuelva a sobrescribirla.
    queueMicrotask(() => {
      if (cancelled) return;
      lenisRef.current?.resize();
      lenisRef.current?.scrollTo(window.scrollY, { immediate: true, force: true });
    });
    return () => {
      cancelled = true;
    };
  }, [location.key]);
  useEffect(() => {
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let lenis;
    let ticker;
    let sync;
    let gsapInstance;
    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        gsapInstance = gsap;
        lenis = new Lenis({ autoRaf: false, duration: 1.1 });
        lenisRef.current = lenis;
        sync = () => ScrollTrigger.update();
        let previousTime = 0;
        ticker = (time) => {
          lenis.raf(time * 1000);
          const delta = previousTime ? Math.min(time - previousTime, 0.05) : 1 / 60;
          previousTime = time;
          for (const callback of listeners.current)
            callback({ time, delta, scroll: window.scrollY });
        };
        lenis.on("scroll", sync);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
      })
      .catch((error) => {
        if (!cancelled && import.meta.env.DEV)
          console.warn("Scroll nativo: no se pudo iniciar Lenis.", error);
      });
    return () => {
      cancelled = true;
      if (ticker) gsapInstance?.ticker.remove(ticker);
      lenis?.off("scroll", sync);
      lenis?.destroy();
      if (lenisRef.current === lenis) lenisRef.current = null;
    };
  }, [reduced]);

  return (
    <ScrollImageContext.Provider value={registerImage}>{children}</ScrollImageContext.Provider>
  );
}

import { useEffect } from "react";

export default function MotionProvider({ children }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let lenis;
    let ticker;
    let sync;
    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({ autoRaf: false, duration: 1.1 });
      sync = () => ScrollTrigger.update();
      ticker = (time) => lenis.raf(time * 1000);
      lenis.on("scroll", sync);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    });
    return () => { cancelled = true; if (ticker) import("gsap").then(({ gsap }) => gsap.ticker.remove(ticker)); lenis?.off("scroll", sync); lenis?.destroy(); };
  }, []);

  return children;
}

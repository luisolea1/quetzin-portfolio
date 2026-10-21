import { useEffect, useRef } from "react";
import styles from "./Reveal.module.css";

export default function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { entry.target.classList.add(styles.visible); observer.disconnect(); }
    }, { rootMargin: "0px 0px -30px 0px" });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`${styles.reveal} ${className}`}>{children}</div>;
}

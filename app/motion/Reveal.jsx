import { useEffect, useRef } from "react";
import styles from "./Reveal.module.css";

export default function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.IntersectionObserver
    )
      return;
    const element = ref.current;
    const finish = (event) => {
      if (event.target !== element) return;
      element.classList.remove(styles.visible);
      delete element.dataset.deformationPaused;
    };
    element.addEventListener("animationend", finish);
    element.addEventListener("animationcancel", finish);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.dataset.deformationPaused = "true";
          entry.target.classList.add(styles.visible);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -30px 0px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.removeEventListener("animationend", finish);
      element.removeEventListener("animationcancel", finish);
      element.classList.remove(styles.visible);
      delete element.dataset.deformationPaused;
    };
  }, []);
  return (
    <div ref={ref} className={`${styles.reveal} ${className}`}>
      {children}
    </div>
  );
}

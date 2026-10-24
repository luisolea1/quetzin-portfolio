import { useEffect, useRef } from "react";
import styles from "./Reveal.module.css";

export default function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches || !window.IntersectionObserver) {
      element.dataset.revealState = "done";
      return;
    }
    element.dataset.revealState = "pending";
    const finish = (event) => {
      if (event && event.target !== element) return;
      element.classList.remove(styles["reveal--visible"]);
      element.dataset.revealState = "done";
    };
    element.addEventListener("animationend", finish);
    element.addEventListener("animationcancel", finish);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.revealState = "running";
          entry.target.classList.add(styles["reveal--visible"]);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -30px 0px" },
    );
    const onPreference = () => {
      if (query.matches) {
        observer.disconnect();
        finish();
      }
    };
    query.addEventListener("change", onPreference);
    observer.observe(element);
    return () => {
      observer.disconnect();
      query.removeEventListener("change", onPreference);
      element.removeEventListener("animationend", finish);
      element.removeEventListener("animationcancel", finish);
      element.classList.remove(styles["reveal--visible"]);
      element.dataset.revealState = "done";
    };
  }, []);
  return (
    <div ref={ref} data-reveal-state="pending" className={`${styles["reveal"]} ${className}`}>
      {children}
    </div>
  );
}

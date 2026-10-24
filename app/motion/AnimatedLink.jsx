import { Link } from "react-router";
import { motionConfig } from "./motionConfig.js";
import styles from "./AnimatedLink.module.css";

export default function AnimatedLink({ to, children, className = "", suffix, ariaLabel }) {
  const label = typeof children === "string" ? children : null;
  if (!label)
    return (
      <Link to={to} aria-label={ariaLabel} className={`${styles["animated-link"]} ${className}`}>
        {children}
        {suffix != null && <> {suffix}</>}
      </Link>
    );
  return (
    <Link
      to={to}
      aria-label={ariaLabel ?? label}
      className={`${styles["animated-link"]} ${className}`}
      style={{
        "--letter-duration": `${motionConfig.letterDuration}s`,
        "--letter-stagger": `${motionConfig.letterStagger}s`,
      }}
    >
      <span aria-hidden="true" className={styles["animated-link__line"]}>
        {Array.from(label).map((character, index) => (
          <span className={styles["animated-link__mask"]} key={index} style={{ "--index": index }}>
            <span className={styles["animated-link__letters"]}>
              {character === " " ? "\u00a0" : character}
              <span className={styles["animated-link__copy"]}>
                {character === " " ? "\u00a0" : character}
              </span>
            </span>
          </span>
        ))}
      </span>
      {suffix != null && <> {suffix}</>}
    </Link>
  );
}

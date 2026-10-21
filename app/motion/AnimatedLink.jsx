import { Link } from "react-router";
import { motionConfig } from "./motionConfig.js";
import styles from "./AnimatedLink.module.css";

export default function AnimatedLink({ to, children, className = "" }) {
  const label = typeof children === "string" ? children : null;
  if (!label) return <Link to={to} className={`${styles.link} ${className}`}>{children}</Link>;
  return <Link to={to} aria-label={label} className={`${styles.link} ${className}`} style={{ "--letter-duration": `${motionConfig.letterDuration}s`, "--letter-stagger": `${motionConfig.letterStagger}s` }}><span aria-hidden="true" className={styles.line}>{Array.from(label).map((character, index) => <span className={styles.mask} key={index} style={{ "--index": index }}><span className={styles.letters}>{character === " " ? "\u00a0" : character}<span className={styles.second}>{character === " " ? "\u00a0" : character}</span></span></span>)}</span></Link>;
}

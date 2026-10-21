import styles from "./BrandRing.module.css";
import { motionConfig } from "./motionConfig.js";

export default function BrandRing({ brands }) {
  const labels = [...brands, ...brands];
  return <div className={styles.space} aria-label="Marcas pendientes de personalizar"><div className={styles.tilt}><div className={styles.ring} style={{ "--duration": `${motionConfig.brandRotationSeconds}s` }}>{labels.map((label, index) => <span aria-hidden="true" key={index} style={{ "--angle": `${index * 36}deg` }}>{label}</span>)}</div></div></div>;
}

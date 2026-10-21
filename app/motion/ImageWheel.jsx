import Media from "../components/ui/Media.jsx";
import { motionConfig } from "./motionConfig.js";
import styles from "./ImageWheel.module.css";

export default function ImageWheel({ images }) {
  return <div className={styles.space} aria-label="Rueda de fotografías pendientes"><div className={styles.tilt}><div className={styles.wheel} style={{ "--duration": `${motionConfig.wheelRotationSeconds}s` }}>{images.map((media, index) => <div className={styles.face} key={index} style={{ "--angle": `${index * 36}deg` }}><Media media={media} label={`Imagen ${index + 1}`} /></div>)}</div></div></div>;
}

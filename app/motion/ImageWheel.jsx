import Media from "../components/ui/Media.jsx";
import { motionConfig } from "./motionConfig.js";
import styles from "./ImageWheel.module.css";

export default function ImageWheel({ images, className = "" }) {
  return (
    <div
      className={`${styles["image-wheel"]} ${className}`}
      aria-label="Rueda de fotografías pendientes"
    >
      <div className={styles["image-wheel__tilt"]}>
        <div
          className={styles["image-wheel__track"]}
          style={{ "--duration": `${motionConfig.wheelRotationSeconds}s` }}
        >
          {images.map((media, index) => (
            <div
              className={styles["image-wheel__face"]}
              key={index}
              style={{ "--angle": `${index * 36}deg` }}
            >
              <Media
                className={styles["image-wheel__image"]}
                media={media}
                label={`Imagen ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

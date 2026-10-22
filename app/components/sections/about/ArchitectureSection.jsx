import Media from "../../ui/Media.jsx";
import styles from "./ArchitectureSection.module.css";

export default function ArchitectureSection({ image }) {
  return (
    <section className={styles["architecture-section"]} aria-labelledby="architecture-title">
      <h2 id="architecture-title" className="u-visually-hidden">
        Arquitectura
      </h2>
      <Media
        className={styles["architecture-section__image"]}
        media={image}
        label="Fotografía pendiente"
      />
    </section>
  );
}

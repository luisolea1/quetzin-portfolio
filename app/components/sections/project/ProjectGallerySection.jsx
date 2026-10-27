import ProjectGallery from "../../portfolio/ProjectGallery.jsx";
import Reveal from "../../../motion/Reveal.jsx";
import styles from "./ProjectGallerySection.module.css";

export default function ProjectGallerySection({ items }) {
  return (
    <section className={styles["project-gallery-section"]} aria-labelledby="project-gallery-title">
      <Reveal className={styles["project-gallery-section__header"]}>
        <h2 id="project-gallery-title" className={styles["project-gallery-section__title"]}>
          Galería
        </h2>
        <span className={`${styles["project-gallery-section__hint"]} u-eyebrow`} aria-hidden="true">
          Desplázate para explorar ↓
        </span>
      </Reveal>
      <ProjectGallery items={items} />
    </section>
  );
}

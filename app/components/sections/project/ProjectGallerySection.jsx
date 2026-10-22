import ProjectGallery from "../../portfolio/ProjectGallery.jsx";
import styles from "./ProjectGallerySection.module.css";

export default function ProjectGallerySection({ blocks, media }) {
  return (
    <section className={styles["project-gallery-section"]} aria-labelledby="project-gallery-title">
      <h2 id="project-gallery-title" className="u-visually-hidden">
        Galería del proyecto
      </h2>
      <ProjectGallery blocks={blocks} media={media} />
    </section>
  );
}

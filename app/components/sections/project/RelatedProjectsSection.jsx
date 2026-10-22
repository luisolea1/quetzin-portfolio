import { Link } from "react-router";
import ProjectGrid from "../../portfolio/ProjectGrid.jsx";
import styles from "./RelatedProjectsSection.module.css";

export default function RelatedProjectsSection({ projects, media }) {
  return (
    <section className={styles["related-projects"]} aria-labelledby="related-projects-title">
      <div className={styles["related-projects__header"]}>
        <h2 id="related-projects-title" className={styles["related-projects__title"]}>
          Más proyectos.
        </h2>
        <Link className={styles["related-projects__link"]} to="/work">
          Ver todos ↗
        </Link>
      </div>
      <ProjectGrid projects={projects} media={media} />
    </section>
  );
}

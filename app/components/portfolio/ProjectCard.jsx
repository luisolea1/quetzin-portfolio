import { Link } from "react-router";
import Media from "../ui/Media.jsx";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project, media }) {
  return (
    <Link
      className={styles["project-card"]}
      to={`/projects/${project.slug}`}
      aria-label={`Ver ${project.title}`}
    >
      <Media
        media={media[project.cover]}
        className={styles["project-card__media"]}
        label={`Portada · ${project.title}`}
        tone="dark"
      />
      <div className={styles["project-card__overlay"]}>
        <span className={styles["project-card__title"]}>
          <span className={styles["project-card__title-text"]}>{project.title}</span>
          <span
            className={`${styles["project-card__title-text"]} ${styles["project-card__title-text--copy"]}`}
            aria-hidden="true"
          >
            {project.title}
          </span>
        </span>
        <span className={styles["project-card__arrow"]}>
          <span className={styles["project-card__arrow-icon"]}>↗</span>
          <span
            className={`${styles["project-card__arrow-icon"]} ${styles["project-card__arrow-icon--copy"]}`}
            aria-hidden="true"
          >
            ↗
          </span>
        </span>
      </div>
      {project.categories.length > 0 && (
        <div className={styles["project-card__categories"]}>
          {project.categories.map((category) => (
            <span className={styles["project-card__category"]} key={category}>
              {category}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

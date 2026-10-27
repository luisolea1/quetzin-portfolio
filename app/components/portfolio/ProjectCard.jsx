import { Link } from "react-router";
import Media from "../ui/Media.jsx";
import ArrowBadge from "../ui/ArrowBadge.jsx";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project, media, scrollEffect = "none" }) {
  return (
    <Link
      className={`${styles["project-card"]} ${scrollEffect === "curve" ? styles["project-card--scroll-curve"] : ""}`}
      to={`/projects/${project.slug}`}
      aria-label={`Ver ${project.title}`}
    >
      <Media
        media={media[project.cover]}
        className={styles["project-card__media"]}
        label={`Portada · ${project.title}`}
        tone="dark"
        scrollEffect={scrollEffect}
      />
      <div className={styles["project-card__overlay"]}>
        <span className={styles["project-card__title"]}>{project.title}</span>
        <ArrowBadge />
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

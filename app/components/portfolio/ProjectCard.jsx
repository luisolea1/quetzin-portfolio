import { Link } from "react-router";
import Media from "../ui/Media.jsx";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project, media }) {
  return (
    <Link
      className={styles.card}
      to={`/projects/${project.slug}`}
      aria-label={`Ver ${project.title}`}
    >
      <Media
        media={media[project.cover]}
        className={styles.picture}
        label={`Portada · ${project.title}`}
        deform
      />
      <div className={styles.top}>
        <span className={styles.title}>
          <span>{project.title}</span>
          <span aria-hidden="true">{project.title}</span>
        </span>
        <span className={styles.arrow}>
          <span>↗</span>
          <span aria-hidden="true">↗</span>
        </span>
      </div>
      {project.categories.length > 0 && (
        <div className={styles.categories}>
          {project.categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
      )}
    </Link>
  );
}

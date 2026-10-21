import ProjectCard from "./ProjectCard.jsx";
import styles from "./ProjectGrid.module.css";

export default function ProjectGrid({ projects, media }) {
  return <div className={styles.grid}>{projects.map((project) => <ProjectCard key={project.id} project={project} media={media} />)}</div>;
}

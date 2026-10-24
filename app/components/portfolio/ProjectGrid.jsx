import ProjectCard from "./ProjectCard.jsx";
import styles from "./ProjectGrid.module.css";

export default function ProjectGrid({ projects, media, scrollEffect = "none" }) {
  return (
    <div className={styles["project-grid"]}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} media={media} scrollEffect={scrollEffect} />
      ))}
    </div>
  );
}

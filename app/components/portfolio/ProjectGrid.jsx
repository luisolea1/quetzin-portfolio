import ProjectCard from "./ProjectCard.jsx";
import styles from "./ProjectGrid.module.css";

export default function ProjectGrid({
  projects,
  media,
  scrollEffect = "none",
  priorityFirst = false,
}) {
  return (
    <div className={styles["project-grid"]}>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          media={media}
          scrollEffect={scrollEffect}
          priority={priorityFirst && index === 0}
        />
      ))}
    </div>
  );
}

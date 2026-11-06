import styles from "./ProjectOverview.module.css";

export default function ProjectOverview({ project }) {
  return (
    <section className={styles["project-overview"]} aria-labelledby="project-overview-title">
      <div>
        <h2 id="project-overview-title" className={styles["project-overview__title"]}>
          {project.title}
        </h2>
      </div>
      <div>
        <div className={styles["project-overview__summary"]}>
          {project.summary.map((paragraph) => (
            <p key={paragraph} className={styles["project-overview__paragraph"]}>
              {paragraph}
            </p>
          ))}
        </div>
        {project.url && (
          <a
            className={styles["project-overview__visit"]}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visitar proyecto ↗
          </a>
        )}
      </div>
    </section>
  );
}

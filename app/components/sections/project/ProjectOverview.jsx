import styles from "./ProjectOverview.module.css";

export default function ProjectOverview({ project }) {
  return (
    <section className={styles["project-overview"]} aria-labelledby="project-overview-title">
      <div>
        <span className="u-eyebrow">El proyecto / 01</span>
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
        <dl className={styles["project-overview__metadata"]}>
          <div>
            <dt className={`${styles["project-overview__label"]} u-eyebrow`}>Cliente</dt>
            <dd className={styles["project-overview__value"]}>{project.client || "Pendiente"}</dd>
          </div>
          <div>
            <dt className={`${styles["project-overview__label"]} u-eyebrow`}>Servicios</dt>
            <dd className={styles["project-overview__value"]}>
              {project.categories.join(", ") || "Pendientes"}
            </dd>
          </div>
          <div>
            <dt className={`${styles["project-overview__label"]} u-eyebrow`}>Año</dt>
            <dd className={styles["project-overview__value"]}>{project.year || "Pendiente"}</dd>
          </div>
        </dl>
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

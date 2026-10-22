import { Link } from "react-router";
import { findProject, findRelated, media, site } from "../content/index.js";
import Media from "../components/ui/Media.jsx";
import ProjectGallery from "../components/portfolio/ProjectGallery.jsx";
import ProjectGrid from "../components/portfolio/ProjectGrid.jsx";
import NotFound from "./not-found.jsx";
import styles from "./Page.module.css";

export function meta({ params }) {
  const project = findProject(params.slug);
  if (!project) return [{ title: `Página no encontrada — ${site.name}` }];
  return [
    { title: `${project.title} — ${site.name}` },
    { name: "description", content: project.description },
    ...(media[project.hero]?.src
      ? [{ property: "og:image", content: media[project.hero].src }]
      : []),
  ];
}

export default function Project({ params }) {
  const project = findProject(params.slug);
  if (!project) return <NotFound />;
  return (
    <div className={styles.page}>
      <h1 className={styles.projectTitle}>{project.title}</h1>
      <Media
        className={styles.projectHero}
        media={media[project.hero]}
        label="Imagen principal pendiente"
        priority
        deform
      />
      <section className={styles.projectDetails}>
        <div>
          <span className="eyebrow">El proyecto / 01</span>
          <h2>{project.title}</h2>
        </div>
        <div>
          <div className={styles.summary}>
            {project.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className={styles.metadata}>
            <div>
              <span className="eyebrow">Cliente</span>
              <strong>{project.client || "Pendiente"}</strong>
            </div>
            <div>
              <span className="eyebrow">Servicios</span>
              <strong>{project.categories.join(", ") || "Pendientes"}</strong>
            </div>
            <div>
              <span className="eyebrow">Año</span>
              <strong>{project.year || "Pendiente"}</strong>
            </div>
          </div>
          {project.url && (
            <a
              className={styles.visit}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visitar proyecto ↗
            </a>
          )}
        </div>
      </section>
      <ProjectGallery blocks={project.gallery} media={media} />
      <section className={styles.related}>
        <div className={styles.relatedHeading}>
          <h2>Más proyectos.</h2>
          <Link to="/work">Ver todos ↗</Link>
        </div>
        <ProjectGrid projects={findRelated(project)} media={media} />
      </section>
    </div>
  );
}

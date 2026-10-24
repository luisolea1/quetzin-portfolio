import Reveal from "../../../motion/Reveal.jsx";
import ProjectGrid from "../../portfolio/ProjectGrid.jsx";
import styles from "./ProjectsSection.module.css";

export default function ProjectsSection({
  projects,
  media,
  headingId,
  title,
  scrollEffect = "none",
}) {
  return (
    <section className={styles["projects-section"]} aria-labelledby={headingId}>
      <h2 id={headingId} className="u-visually-hidden">
        {title}
      </h2>
      <Reveal>
        <ProjectGrid projects={projects} media={media} scrollEffect={scrollEffect} />
      </Reveal>
    </section>
  );
}

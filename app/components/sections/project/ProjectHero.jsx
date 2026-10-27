import Media from "../../ui/Media.jsx";
import Reveal from "../../../motion/Reveal.jsx";
import styles from "./ProjectHero.module.css";

export default function ProjectHero({ title, image }) {
  return (
    <header className={styles["project-hero"]}>
      <Reveal>
        <h1 id="project-title" className={styles["project-hero__title"]}>
          {title}
        </h1>
      </Reveal>
      <Reveal>
        <Media
          className={styles["project-hero__image"]}
          media={image}
          label="Imagen principal pendiente"
          priority
        />
      </Reveal>
    </header>
  );
}

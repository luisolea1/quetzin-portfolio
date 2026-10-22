import Media from "../../ui/Media.jsx";
import styles from "./BiographySection.module.css";

export default function BiographySection({ paragraphs, resume, portrait }) {
  return (
    <section className={styles["biography-section"]} aria-labelledby="biography-title">
      <div className={styles["biography-section__content"]}>
        <h2 id="biography-title" className={`${styles["biography-section__heading"]} u-eyebrow`}>
          Sobre mí / 01
        </h2>
        <div className={styles["biography-section__body"]}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles["biography-section__paragraph"]}>
              {paragraph}
            </p>
          ))}
        </div>
        {resume ? (
          <a
            className={styles["biography-section__resume"]}
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Descargar CV ↗
          </a>
        ) : (
          <span className="u-eyebrow">CV pendiente</span>
        )}
      </div>
      <Media
        className={styles["biography-section__portrait"]}
        media={portrait}
        label="Retrato pendiente"
      />
    </section>
  );
}

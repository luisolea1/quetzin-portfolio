import Media from "../../ui/Media.jsx";
import styles from "./BiographySection.module.css";

export default function BiographySection({ paragraphs, portrait }) {
  return (
    <section className={styles["biography-section"]} aria-label="Biografía">
      <div className={styles["biography-section__content"]}>
        <div className={styles["biography-section__body"]}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles["biography-section__paragraph"]}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <Media
        className={styles["biography-section__portrait"]}
        media={portrait}
        label="Retrato pendiente"
        sizes="(max-width: 809px) calc(100vw - 40px), 45vw"
        priority
      />
    </section>
  );
}

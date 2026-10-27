import CircularCarousel from "../../../motion/CircularCarousel.jsx";
import styles from "./WorkHero.module.css";

export default function WorkHero({ intro, carouselItems }) {
  return (
    <section className={styles["work-hero"]} aria-labelledby="work-title">
      <div className={styles["work-hero__content"]}>
        <h1 id="work-title" className={styles["work-hero__title"]}>
          Proyectos
          <br />
          Destacados
        </h1>
        <p className={styles["work-hero__description"]}>{intro}</p>
      </div>
      <CircularCarousel
        items={carouselItems}
        className={styles["work-hero__carousel"]}
        fadeColor="#ffffff"
        label="Fotografías de Work"
      />
    </section>
  );
}

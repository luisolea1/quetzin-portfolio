import ImageWheel from "../../../motion/ImageWheel.jsx";
import styles from "./WorkHero.module.css";

export default function WorkHero({ intro, images }) {
  return (
    <section className={styles["work-hero"]} aria-labelledby="work-title">
      <div className={styles["work-hero__content"]}>
        <h1 id="work-title" className={styles["work-hero__title"]}>
          Selected
          <br />
          Work.
        </h1>
        <p className={styles["work-hero__description"]}>{intro}</p>
      </div>
      <ImageWheel images={images} className={styles["work-hero__wheel"]} />
    </section>
  );
}

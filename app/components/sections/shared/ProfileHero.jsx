import WordmarkEffect from "../../../motion/WordmarkEffect.jsx";
import styles from "./ProfileHero.module.css";

export default function ProfileHero({ site, intro, headingId, markEffect, compactMobile = false }) {
  return (
    <section
      className={`${styles["profile-hero"]} ${compactMobile ? styles["profile-hero--compact-mobile"] : ""}`}
      aria-labelledby={headingId}
    >
      <div className={styles["profile-hero__mark"]}>
        <WordmarkEffect site={site} heading id={headingId} effect={markEffect} />
      </div>
      <div className={styles["profile-hero__intro"]}>
        <p className={styles["profile-hero__paragraph"]}>
          <strong className={styles["profile-hero__emphasis"]}>{site.role}.</strong> {intro}
        </p>
        <p className={styles["profile-hero__paragraph"]}>{site.approach}</p>
      </div>
    </section>
  );
}

import InfoPanel from "../../editorial/InfoPanel.jsx";
import styles from "./AboutSection.module.css";

export default function AboutSection({ site, carouselItems }) {
  return (
    <InfoPanel
      className={styles["about-section"]}
      ariaLabel={`Acerca de ${site.name}`}
      scrollEffect="curve"
      description={site.description}
      services={site.services}
      industries={site.industries}
      carouselItems={carouselItems}
      linkTo="/about"
      linkLabel="Conoce mi historia"
    />
  );
}

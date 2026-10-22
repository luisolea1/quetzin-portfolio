import InfoPanel from "../../editorial/InfoPanel.jsx";
import styles from "./AboutSection.module.css";

export default function AboutSection({ site, carouselItems }) {
  return (
    <InfoPanel
      className={styles["about-section"]}
      heading="Acerca de / 01"
      headingId="home-about-title"
      description={site.description}
      services={site.services}
      industries={site.industries}
      carouselItems={carouselItems}
      linkTo="/about"
      linkLabel="Conoce mi historia"
    />
  );
}

import InfoPanel from "../../editorial/InfoPanel.jsx";
import styles from "./ExperienceSection.module.css";

export default function ExperienceSection({ site, carouselItems }) {
  return (
    <InfoPanel
      heading="Experiencia / 01"
      headingId="experience-title"
      description="Aquí podrás añadir tu experiencia profesional."
      services={site.services}
      industries={site.industries}
      carouselItems={carouselItems}
      linkTo="/work"
      linkLabel="Ver proyectos"
    >
      {site.experience.length > 0 && (
        <ul className={styles["experience-list"]}>
          {site.experience.map((entry, index) => (
            <li className={styles["experience-list__item"]} key={index}>
              <span>{entry.role}</span>
              <span>{entry.period}</span>
            </li>
          ))}
        </ul>
      )}
    </InfoPanel>
  );
}

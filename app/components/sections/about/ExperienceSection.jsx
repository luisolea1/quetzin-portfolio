import InfoPanel from "../../editorial/InfoPanel.jsx";
import styles from "./ExperienceSection.module.css";

export default function ExperienceSection({ site, carouselItems }) {
  return (
    <InfoPanel
      ariaLabel="Experiencia"
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
              {entry.url ? (
                <a
                  className={styles["experience-list__link"]}
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {entry.role}
                  <span className="u-visually-hidden"> (abre en otra pestaña)</span>
                </a>
              ) : (
                <span>{entry.role}</span>
              )}
              <span className={styles["experience-list__separator"]} aria-hidden="true" />
              <span className={styles["experience-list__period"]}>{entry.period}</span>
            </li>
          ))}
        </ul>
      )}
    </InfoPanel>
  );
}

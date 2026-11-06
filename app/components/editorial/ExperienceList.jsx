import styles from "./ExperienceList.module.css";

export default function ExperienceList({ entries }) {
  return (
    <ul className={styles["experience-list"]}>
      {entries.map((entry, index) => (
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
  );
}

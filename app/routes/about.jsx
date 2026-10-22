import { media, site } from "../content/index.js";
import Media from "../components/ui/Media.jsx";
import InfoPanel from "../components/editorial/InfoPanel.jsx";
import WordmarkEffect from "../motion/WordmarkEffect.jsx";
import styles from "./Page.module.css";

export function meta() {
  return [{ title: `About — ${site.name}` }, { name: "description", content: site.aboutIntro }];
}

export default function About() {
  return (
    <div className={styles.page}>
      <div className={styles.heroMark}>
        <WordmarkEffect site={site} heading />
      </div>
      <div className={styles.intro}>
        <p>
          <strong>{site.role}.</strong> {site.aboutIntro}
        </p>
        <p>{site.approach}</p>
      </div>
      <div className={styles.aboutGrid}>
        <section className={styles.bio}>
          <span className="eyebrow">Sobre mí / 01</span>
          <div className={styles.bioBody}>
            {site.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {site.resume ? (
            <a href={site.resume} target="_blank" rel="noopener noreferrer">
              Descargar CV ↗
            </a>
          ) : (
            <span className="eyebrow">CV pendiente</span>
          )}
        </section>
        <Media
          className={styles.portrait}
          media={media[site.portrait]}
          label="Retrato pendiente"
          deform
        />
      </div>
      <Media
        className={styles.architecture}
        media={media[site.architecture]}
        label="Fotografía pendiente"
        deform
      />
      <InfoPanel site={site} about />
    </div>
  );
}

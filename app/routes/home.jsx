import { media, projects, site } from "../content/index.js";
import WordmarkEffect from "../motion/WordmarkEffect.jsx";
import Reveal from "../motion/Reveal.jsx";
import ProjectGrid from "../components/portfolio/ProjectGrid.jsx";
import InfoPanel from "../components/editorial/InfoPanel.jsx";
import styles from "./Page.module.css";

export function meta() { return [{ title: `${site.name} — Portfolio` }, { name: "description", content: site.intro }]; }

export default function Home() {
  return <div className={styles.page}>
    <div className={styles.heroMark}><WordmarkEffect site={site} heading /></div>
    <div className={styles.intro}><p><strong>{site.role}.</strong> {site.intro}</p><p>{site.approach}</p></div>
    <Reveal><ProjectGrid projects={projects.filter((project) => project.featured)} media={media} /></Reveal>
    <div className={styles.info}><InfoPanel site={site} /></div>
  </div>;
}

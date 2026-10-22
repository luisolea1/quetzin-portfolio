import { media, projects, site } from "../content/index.js";
import ImageWheel from "../motion/ImageWheel.jsx";
import Reveal from "../motion/Reveal.jsx";
import ProjectGrid from "../components/portfolio/ProjectGrid.jsx";
import styles from "./Page.module.css";

export function meta() {
  return [{ title: `Work — ${site.name}` }, { name: "description", content: site.workIntro }];
}

export default function Work() {
  return (
    <div className={styles.page}>
      <div className={styles.workHero}>
        <div>
          <h1>
            Selected
            <br />
            Work.
          </h1>
          <p>{site.workIntro}</p>
        </div>
        <ImageWheel images={site.wheel.map((id) => media[id])} />
      </div>
      <Reveal>
        <ProjectGrid projects={projects} media={media} />
      </Reveal>
    </div>
  );
}

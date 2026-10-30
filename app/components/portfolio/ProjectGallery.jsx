import Media from "../ui/Media.jsx";
import Reveal from "../../motion/Reveal.jsx";
import styles from "./ProjectGallery.module.css";

export default function ProjectGallery({ items }) {
  const columns = [
    items.filter((_, index) => index % 2 === 0),
    items.filter((_, index) => index % 2 === 1),
  ];

  return (
    <div className={styles["project-gallery"]} data-project-gallery>
      <div className={styles["project-gallery__columns"]}>
        {columns.map((column, index) => (
          <div key={index} className={styles["project-gallery__column"]}>
            {column.map((item) => (
              <figure
                key={item.key}
                className={styles["project-gallery__item"]}
                style={{
                  "--gallery-aspect-ratio": item.aspectRatio,
                  "--gallery-mobile-order": item.mobileOrder,
                }}
              >
                <Reveal className={styles["project-gallery__entry"]}>
                  <Media
                    className={styles["project-gallery__image"]}
                    media={item.media}
                    label="Imagen del proyecto pendiente"
                    sizes="(max-width: 809px) calc(100vw - 40px), (max-width: 1199px) calc((100vw - 70px) / 2), calc((90vw - 10px) / 2)"
                  />
                </Reveal>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

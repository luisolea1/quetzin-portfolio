import Media from "../ui/Media.jsx";
import styles from "./ProjectGallery.module.css";

export default function ProjectGallery({ blocks, media }) {
  return (
    <div className={styles["project-gallery"]}>
      {blocks.map((block, index) =>
        block.type === "wide" ? (
          <Media
            key={index}
            className={`${styles["project-gallery__image"]} ${styles["project-gallery__image--wide"]}`}
            media={media[block.media]}
            label="Imagen del proyecto pendiente"
          />
        ) : (
          <div key={index} className={styles["project-gallery__pair"]}>
            {block.items.map((id, position) => (
              <div
                key={`${index}-${position}`}
                className={`${styles["project-gallery__item"]} ${styles[block.mobileOrder[0] === position ? "project-gallery__item--first" : "project-gallery__item--second"]}`}
              >
                <Media
                  className={`${styles["project-gallery__image"]} ${styles["project-gallery__image--square"]}`}
                  media={media[id]}
                  label="Imagen del proyecto pendiente"
                />
              </div>
            ))}
          </div>
        ),
      )}
    </div>
  );
}

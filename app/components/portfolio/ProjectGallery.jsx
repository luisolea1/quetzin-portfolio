import Media from "../ui/Media.jsx";
import styles from "./ProjectGallery.module.css";

export default function ProjectGallery({ blocks, media }) {
  return (
    <div className={styles.gallery}>
      {blocks.map((block, index) =>
        block.type === "wide" ? (
          <Media
            key={index}
            className={styles.wide}
            media={media[block.media]}
            label="Imagen del proyecto pendiente"
            deform
          />
        ) : (
          <div key={index} className={styles.pair}>
            {block.items
              .map((id, position) => (
                <Media
                  key={`${index}-${position}`}
                  className={styles.square}
                  media={media[id]}
                  label="Imagen del proyecto pendiente"
                  deform
                  priority={false}
                />
              ))
              .map((element, position) => (
                <div
                  key={position}
                  className={block.mobileOrder[0] === position ? styles.first : styles.second}
                >
                  {element}
                </div>
              ))}
          </div>
        ),
      )}
    </div>
  );
}

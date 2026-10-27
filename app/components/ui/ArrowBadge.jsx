import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import styles from "./ArrowBadge.module.css";

export default function ArrowBadge() {
  return (
    <span className={styles["arrow-badge"]} aria-hidden="true">
      <ArrowUpRightIcon
        className={styles["arrow-badge__icon"]}
        size={18}
        color="#ffffff"
        focusable="false"
      />
    </span>
  );
}

import styles from "./PageLayout.module.css";

export default function PageLayout({ as: Tag = "div", children }) {
  return <Tag className={styles["page-layout"]}>{children}</Tag>;
}

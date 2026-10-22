import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import MotionProvider from "../../motion/MotionProvider.jsx";
import styles from "./SiteLayout.module.css";

export default function SiteLayout({ site, projectCount, children }) {
  return (
    <MotionProvider>
      <Header site={site} projectCount={projectCount} />
      <main id="main" className={styles["site-main"]}>
        {children}
      </main>
      <Footer site={site} />
    </MotionProvider>
  );
}

import { createPageMeta } from "../content/seo.js";
import { getCarouselPreloads } from "../content/media-variants.js";
import { getWorkCarouselItems, media, projects, site } from "../content/index.js";
import PageLayout from "../components/layout/PageLayout.jsx";
import WorkHero from "../components/sections/work/WorkHero.jsx";
import ProjectsSection from "../components/sections/shared/ProjectsSection.jsx";

export function meta() {
  return createPageMeta("/work", { noIndex: import.meta.env.VITE_NOINDEX });
}

export const links = () => getCarouselPreloads(getWorkCarouselItems());

export default function Work() {
  return (
    <PageLayout>
      <WorkHero intro={site.workIntro} carouselItems={getWorkCarouselItems()} />
      <ProjectsSection
        projects={projects}
        media={media}
        headingId="work-projects-title"
        title="Proyectos"
        scrollEffect="curve"
        priorityFirst
      />
    </PageLayout>
  );
}

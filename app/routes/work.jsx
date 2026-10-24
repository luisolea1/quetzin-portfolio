import { getWorkCarouselItems, media, projects, site } from "../content/index.js";
import PageLayout from "../components/layout/PageLayout.jsx";
import WorkHero from "../components/sections/work/WorkHero.jsx";
import ProjectsSection from "../components/sections/shared/ProjectsSection.jsx";

export function meta() {
  return [{ title: `Work — ${site.name}` }, { name: "description", content: site.workIntro }];
}

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
      />
    </PageLayout>
  );
}

import { getCarouselItems, media, projects, site } from "../content/index.js";
import PageLayout from "../components/layout/PageLayout.jsx";
import HomeHero from "../components/sections/home/HomeHero.jsx";
import FeaturedProjectsSection from "../components/sections/home/FeaturedProjectsSection.jsx";
import AboutSection from "../components/sections/home/AboutSection.jsx";

export function meta() {
  return [{ title: `${site.name} — Portfolio` }, { name: "description", content: site.intro }];
}

export default function Home() {
  const featuredProjects = projects.filter((project) => project.featured);
  return (
    <PageLayout>
      <HomeHero site={site} />
      <FeaturedProjectsSection projects={featuredProjects} media={media} />
      <AboutSection site={site} carouselItems={getCarouselItems()} />
    </PageLayout>
  );
}

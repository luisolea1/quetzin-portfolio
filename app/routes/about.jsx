import { createPageMeta } from "../content/seo.js";
import { getCarouselPreloads } from "../content/media-variants.js";
import { getCarouselItems, media, site } from "../content/index.js";
import PageLayout from "../components/layout/PageLayout.jsx";
import AboutHero from "../components/sections/about/AboutHero.jsx";
import BiographySection from "../components/sections/about/BiographySection.jsx";
import ArchitectureSection from "../components/sections/about/ArchitectureSection.jsx";
import ExperienceSection from "../components/sections/about/ExperienceSection.jsx";

export function meta() {
  return createPageMeta("/about", { noIndex: import.meta.env.VITE_NOINDEX });
}

export const links = () => getCarouselPreloads(getCarouselItems());

export default function About() {
  return (
    <PageLayout>
      <AboutHero site={site} />
      <BiographySection paragraphs={site.bio} portrait={media[site.portrait]} />
      <ArchitectureSection image={media[site.architecture]} />
      <ExperienceSection site={site} carouselItems={getCarouselItems()} />
    </PageLayout>
  );
}

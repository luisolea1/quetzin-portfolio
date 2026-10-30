import { createPageMeta } from "../content/seo.js";
import { Navigate, useLocation } from "react-router";
import { findLegacyProject, findProject, findRelated, media } from "../content/index.js";
import { getGalleryItems } from "../content/gallery.js";
import PageLayout from "../components/layout/PageLayout.jsx";
import ProjectHero from "../components/sections/project/ProjectHero.jsx";
import ProjectOverview from "../components/sections/project/ProjectOverview.jsx";
import ProjectGallerySection from "../components/sections/project/ProjectGallerySection.jsx";
import RelatedProjectsSection from "../components/sections/project/RelatedProjectsSection.jsx";
import NotFound from "./not-found.jsx";
import Reveal from "../motion/Reveal.jsx";

export function meta({ params }) {
  return createPageMeta(`/projects/${params.slug}`, { noIndex: import.meta.env.VITE_NOINDEX });
}

export default function Project({ params }) {
  const { search, hash } = useLocation();
  const legacy = findLegacyProject(params.slug);
  if (legacy) return <Navigate to={`/projects/${legacy.slug}${search}${hash}`} replace />;
  const project = findProject(params.slug);
  if (!project) return <NotFound />;
  return (
    <PageLayout key={project.id} as="article">
      <ProjectHero title={project.title} image={media[project.hero]} />
      <Reveal>
        <ProjectOverview project={project} />
      </Reveal>
      <ProjectGallerySection key={project.id} items={getGalleryItems(project.gallery, media)} />
      <Reveal>
        <RelatedProjectsSection projects={findRelated(project)} media={media} />
      </Reveal>
    </PageLayout>
  );
}

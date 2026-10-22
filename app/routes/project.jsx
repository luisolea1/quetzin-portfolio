import { findProject, findRelated, media, site } from "../content/index.js";
import PageLayout from "../components/layout/PageLayout.jsx";
import ProjectHero from "../components/sections/project/ProjectHero.jsx";
import ProjectOverview from "../components/sections/project/ProjectOverview.jsx";
import ProjectGallerySection from "../components/sections/project/ProjectGallerySection.jsx";
import RelatedProjectsSection from "../components/sections/project/RelatedProjectsSection.jsx";
import NotFound from "./not-found.jsx";

export function meta({ params }) {
  const project = findProject(params.slug);
  if (!project) return [{ title: `Página no encontrada — ${site.name}` }];
  return [
    { title: `${project.title} — ${site.name}` },
    { name: "description", content: project.description },
    ...(media[project.hero]?.src
      ? [{ property: "og:image", content: media[project.hero].src }]
      : []),
  ];
}

export default function Project({ params }) {
  const project = findProject(params.slug);
  if (!project) return <NotFound />;
  return (
    <PageLayout as="article">
      <ProjectHero title={project.title} image={media[project.hero]} />
      <ProjectOverview project={project} />
      <ProjectGallerySection blocks={project.gallery} media={media} />
      <RelatedProjectsSection projects={findRelated(project)} media={media} />
    </PageLayout>
  );
}

import ProjectsSection from "../shared/ProjectsSection.jsx";

export default function FeaturedProjectsSection({ projects, media, scrollEffect = "none" }) {
  return (
    <ProjectsSection
      projects={projects}
      media={media}
      scrollEffect={scrollEffect}
      headingId="featured-projects-title"
      title="Proyectos destacados"
    />
  );
}

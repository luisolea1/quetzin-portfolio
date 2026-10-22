import ProjectsSection from "../shared/ProjectsSection.jsx";

export default function FeaturedProjectsSection({ projects, media }) {
  return (
    <ProjectsSection
      projects={projects}
      media={media}
      headingId="featured-projects-title"
      title="Proyectos destacados"
    />
  );
}

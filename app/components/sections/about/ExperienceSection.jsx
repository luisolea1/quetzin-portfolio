import ExperienceList from "../../editorial/ExperienceList.jsx";
import InfoPanel from "../../editorial/InfoPanel.jsx";

export default function ExperienceSection({ site, carouselItems }) {
  return (
    <InfoPanel
      ariaLabel="Experiencia"
      description="Aquí podrás añadir tu experiencia profesional."
      services={site.services}
      industries={site.industries}
      carouselItems={carouselItems}
      linkTo="/work"
      linkLabel="Ver proyectos"
    >
      {site.experience.length > 0 && <ExperienceList entries={site.experience} />}
    </InfoPanel>
  );
}

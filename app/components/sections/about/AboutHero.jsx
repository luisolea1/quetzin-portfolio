import ProfileHero from "../shared/ProfileHero.jsx";

export default function AboutHero({ site }) {
  return <ProfileHero site={site} intro={site.aboutIntro} headingId="about-title" />;
}

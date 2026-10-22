import ProfileHero from "../shared/ProfileHero.jsx";

export default function HomeHero({ site }) {
  return <ProfileHero site={site} intro={site.intro} headingId="home-title" />;
}

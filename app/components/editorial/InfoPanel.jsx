import { Link } from "react-router";
import { useEffect, useRef } from "react";
import BrandRing from "../../motion/BrandRing.jsx";
import { useDeformation } from "../../motion/deformation/DeformationProvider.jsx";
import styles from "./InfoPanel.module.css";

export default function InfoPanel({ site, about = false }) {
  const ref = useRef(null);
  const renderer = useDeformation();
  useEffect(() => renderer?.register(ref.current), [renderer]);
  return <section ref={ref} className={styles.panel}>
    <div className={styles.columns}>
      <div><span className="eyebrow">{about ? "Experiencia" : "Acerca de"} / 01</span>{about && site.experience.length ? <ul className={styles.experience}>{site.experience.map((entry, index) => <li key={index}><span>{entry.role}</span><span>{entry.period}</span></li>)}</ul> : <p className={styles.description}>{about ? "Aquí podrás añadir tu experiencia profesional." : site.description}</p>}</div>
      <div className={styles.lists}><div><span className="eyebrow">Servicios</span>{site.services.length ? site.services.map((item) => <p key={item}>{item}</p>) : <p>Pendientes</p>}</div><div><span className="eyebrow">Sectores</span>{site.industries.length ? site.industries.map((item) => <p key={item}>{item}</p>) : <p>Pendientes</p>}</div></div>
    </div>
    <BrandRing brands={site.brands} />
    <Link className={styles.link} to={about ? "/work" : "/about"}>{about ? "Ver proyectos" : "Conoce mi historia"}<span>↗</span></Link>
  </section>;
}

function requireText(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} debe contener texto`);
}

function requireMedia(id, media, label) {
  if (typeof id !== "string" || !Object.hasOwn(media, id)) throw new Error(`${label}: recurso inexistente ${id}`);
}

function requireLink(value, label, allowLocal = false) {
  if (value == null) return;
  if (typeof value !== "string" || !(value.startsWith("https://") || (allowLocal && /^\/[^/]/.test(value)))) {
    throw new Error(`${label}: enlace inválido`);
  }
}

export function validate(site, projects, media) {
  requireText(site.name, "Nombre");
  if (!Array.isArray(projects) || projects.length !== 6) throw new Error("Se requieren seis proyectos");
  if (!Array.isArray(site.wheel) || site.wheel.length !== 10) throw new Error("La rueda requiere diez imágenes");
  if (!Array.isArray(site.brands) || site.brands.length !== 5) throw new Error("El anillo requiere cinco nombres");
  requireLink(site.logo, "Logotipo", true);
  requireLink(site.resume, "CV", true);
  if (!Array.isArray(site.socials)) throw new Error("Redes inválidas");
  for (const social of site.socials) { requireText(social.label, "Red social"); requireLink(social.url, "Red social"); }
  if (site.email != null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email)) throw new Error("Correo inválido");
  for (const id of [...site.wheel, site.portrait, site.architecture]) requireMedia(id, media, "Sitio");
  const ids = new Set();
  const slugs = new Set();
  for (const project of projects) {
    requireText(project.id, "Identificador");
    requireText(project.title, "Título");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) throw new Error(`Slug inválido: ${project.slug}`);
    if (ids.has(project.id) || slugs.has(project.slug)) throw new Error(`Proyecto duplicado: ${project.slug}`);
    ids.add(project.id);
    slugs.add(project.slug);
    if (!Array.isArray(project.summary) || project.summary.length < 1) throw new Error(`Resumen vacío: ${project.slug}`);
    for (const paragraph of project.summary) requireText(paragraph, `Resumen de ${project.slug}`);
    if (!Array.isArray(project.categories)) throw new Error(`Categorías inválidas: ${project.slug}`);
    requireLink(project.url, `Enlace de ${project.slug}`);
    requireMedia(project.cover, media, project.slug);
    requireMedia(project.hero, media, project.slug);
    if (!Array.isArray(project.gallery) || !Array.isArray(project.related)) throw new Error(`Galería o relacionados inválidos: ${project.slug}`);
    for (const block of project.gallery) {
      if (block.type === "wide") requireMedia(block.media, media, project.slug);
      else if (block.type === "pair") {
        if (!Array.isArray(block.items) || block.items.length !== 2) throw new Error(`Bloque de galería inválido: ${project.slug}`);
        if (!Array.isArray(block.mobileOrder) || !["0,1", "1,0"].includes(block.mobileOrder.join())) {
          throw new Error(`Orden móvil inválido: ${project.slug}`);
        }
      } else throw new Error(`Bloque de galería inválido: ${project.slug}`);
      if (block.type === "pair") for (const id of block.items) requireMedia(id, media, project.slug);
    }
  }
  for (const project of projects) {
    if (project.related.length !== 2 || new Set(project.related).size !== 2 || project.related.some((id) => !ids.has(id) || id === project.id)) {
      throw new Error(`Proyectos relacionados inválidos: ${project.slug}`);
    }
  }
  for (const [id, resource] of Object.entries(media)) {
    if (!resource || typeof resource.alt !== "string") throw new Error(`Texto alternativo inválido: ${id}`);
    if (resource.src != null && (typeof resource.src !== "string" || !(/^(\/[^/]|https:\/\/)/.test(resource.src)))) {
      throw new Error(`Ruta de imagen inválida: ${id}`);
    }
    if (resource.src && !resource.alt.trim()) throw new Error(`Falta texto alternativo: ${id}`);
  }
  return true;
}

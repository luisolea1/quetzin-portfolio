export function applyMediaVariants(media, assets, { carouselIds = [] } = {}) {
  return Object.fromEntries(
    Object.entries(media).map(([id, resource]) => {
      const asset = assets[resource.src];
      if (!asset) return [id, resource];
      const fallback =
        asset.variants.find((variant) => variant.width >= 960) ?? asset.variants.at(-1);
      const carousel = asset.variants.find((variant) => variant.width >= 640) ?? fallback;
      return [
        id,
        {
          ...resource,
          originalSrc: resource.src,
          src: carouselIds.includes(id) ? carousel.src : fallback.src,
          srcSet: carouselIds.includes(id)
            ? undefined
            : asset.variants.map(({ src, width }) => `${src} ${width}w`).join(", "),
          carouselSrc: carousel.src,
          width: asset.width,
          height: asset.height,
        },
      ];
    }),
  );
}

export const getCarouselPreloads = (items) =>
  items
    .filter((item) => item.src)
    .map((item) => ({
      rel: "preload",
      as: "image",
      href: item.src,
      fetchPriority: "low",
    }));

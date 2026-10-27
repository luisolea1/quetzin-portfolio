export const MAX_GALLERY_IMAGES = 10;

// Las apariciones tienen identidad propia: una misma foto puede repetirse.
export function getGalleryItems(blocks, media) {
  let offset = 0;
  return blocks.flatMap((block, blockIndex) => {
    const ids = block.type === "pair" ? block.items : [block.media];
    const items = ids.map((id, index) => {
      const resource = media[id];
      return {
        key: `${blockIndex}-${index}`,
        id,
        media: resource,
        // Pareja inicial vertical/cuadrado, dos parejas verticales y se repite.
        aspectRatio: block.aspectRatio ?? ((offset + index) % 6 === 1 ? 1 : 0.75),
        mobileOrder: offset + (block.type === "pair" ? block.mobileOrder.indexOf(index) : 0),
      };
    });
    offset += ids.length;
    return items;
  });
}

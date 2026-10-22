import { createContext, useContext, useEffect, useState } from "react";

const DeformationContext = createContext(null);
export const useDeformation = () => useContext(DeformationContext);

export default function DeformationProvider({ children }) {
  const [renderer, setRenderer] = useState(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let active = true;
    let instance;
    import("./renderer.client.js")
      .then(({ DeformationRenderer }) => {
        if (!active) return;
        instance = new DeformationRenderer();
        setRenderer(instance);
      })
      .catch(() => {
        /* El HTML permanece visible sin renderizador. */
      });
    return () => {
      active = false;
      instance?.destroy();
    };
  }, []);

  return <DeformationContext.Provider value={renderer}>{children}</DeformationContext.Provider>;
}

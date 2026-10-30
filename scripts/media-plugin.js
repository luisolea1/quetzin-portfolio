import { prepareMedia } from "./prepare-media.js";

// Los originales y el JSON siguen siendo editables mientras Vite está abierto.
export function mediaPlugin() {
  return {
    name: "portfolio-media",
    configureServer(server) {
      let timer;
      let queue = Promise.resolve();
      const changed = (path) => {
        if (
          !path.includes("/images/generated/") &&
          (path.includes("/public/images/") || path.endsWith("/app/content/media.json"))
        ) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            queue = queue
              .then(prepareMedia)
              .then(() => server.ws.send({ type: "full-reload" }))
              .catch((error) => server.config.logger.error(error.message));
          }, 200);
        }
      };
      server.watcher.on("change", changed).on("add", changed).on("unlink", changed);
      server.httpServer?.once("close", () => {
        clearTimeout(timer);
        server.watcher.off("change", changed).off("add", changed).off("unlink", changed);
      });
    },
  };
}

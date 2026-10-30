# AGENTS.md — Instrucciones para trabajar en el portfolio

## Alcance y documentos de referencia

Este archivo se aplica a todo el proyecto. La aplicación tiene contenido provisional; comprueba los archivos reales y el estado de la implementación antes de asumir que una característica está terminada.

Antes de modificar el proyecto, lee [README.md](./README.md). Es la especificación de diseño, rutas, contenido, animaciones y arquitectura aprobada. Consulta también [recursos-referencia.json](./recursos-referencia.json) y las capturas de `referencias/` cuando necesites comparar la apariencia. Esos recursos documentan la referencia; no representan contenido personal aprobado.

Las instrucciones actuales del usuario prevalecen sobre este documento. Si una decisión nueva modifica lo acordado, actualiza la documentación correspondiente. Conserva la distinción del README entre observaciones verificadas, inferencias y valores propuestos para calibración.

## Objetivo y alcance del producto

- Construir un portfolio público que reproduzca la composición, el comportamiento adaptable y las animaciones documentadas de [Paul Michel](https://paul-michel.framer.website/), usando la identidad y el contenido del usuario.
- Implementar siete páginas: `/`, `/work`, `/about` y cuatro fichas bajo `/projects/:slug`.
- Reutilizar cuatro plantillas: inicio, catálogo, biografía y proyecto. La página de error 404 es auxiliar.
- Mantener cuatro proyectos editables mediante datos locales. No incorporar un administrador, CMS, base de datos ni servidor de aplicación sin un cambio de alcance acordado.
- Permitir que textos, imágenes y enlaces se completen después mediante registros provisionales y espacios reservados.
- Omitir la insignia y los enlaces comerciales de Framer. No inventar clientes, experiencia, datos de contacto ni proyectos personales.

## Base técnica aprobada

| Área | Instrucción |
|---|---|
| Lenguaje | JavaScript con módulos ES; componentes y páginas en `.jsx`, lógica y configuración en `.js` |
| Interfaz y compilación | React y Vite |
| Dependencias | pnpm; conservar `pnpm-lock.yaml` en el repositorio |
| Rutas | React Router en modo framework, integrado con Vite |
| Publicación | Prerenderizar las siete rutas y publicar archivos estáticos |
| Estilos | BEM dentro de CSS Modules junto a los componentes y variables CSS compartidas |
| Contenido | Archivos JSON locales, acceso común y validación en JavaScript |
| Movimiento | GSAP/ScrollTrigger, Lenis y CSS 3D; prueba M05 con Three.js en Home y Work |

No introducir TypeScript, archivos `.ts` o `.tsx`, `tsconfig.json` ni tareas de `tsc`. `jsconfig.json` puede configurar el editor para JavaScript. Usar `"type": "module"` en `package.json`.

La arquitectura general ya está aprobada: avanzar con las decisiones locales necesarias para implementarla. Consultar al usuario antes de sustituir tecnologías principales, cambiar la estrategia de renderizado o ampliar el alcance funcional. La prueba M05 solicitada el 24 de octubre de 2026 utiliza Three.js 0.180.0 en las cuatro portadas de Home y en las cuatro tarjetas de Work, mediante `Media` con `scrollEffect="curve"`. Por petición del 27 de octubre se extiende al fondo opaco de todo el `InfoPanel` de Home, incluido su borde inferior junto a «Conoce mi historia», mediante el mismo canvas y ticker. Sus textos, enlaces y carrusel permanecen en HTML sin deformación. Mantener fuera el panel de About y las demás imágenes. Conservar curvatura `0.05` desde 810 px y `0.04` en móvil; siguen siendo valores propuestos para calibración.

## Organización y límites del código

Seguir el árbol de la sección 15 del README. Crear archivos cuando su función sea necesaria y mantener los siguientes límites:

- `app/root.jsx`: documento HTML, metadatos y límites de error; delega el marco compartido a `SiteLayout`.
- `app/routes.js` y `app/routes/`: declaración de URL, selección de datos, composición de páginas y metadatos.
- `app/components/`: piezas reutilizables de layout, portfolio, contenido editorial e interfaz. Reciben sus datos mediante propiedades.
- `app/components/layout/`: `SiteLayout` reúne proveedores, `Header`, un único `main` y `Footer`; `PageLayout` aplica el margen lateral del contenido.
- `app/components/sections/`: secciones de `home/`, `work/`, `about/` y `project/`, con composiciones reutilizables en `shared/`. Reciben datos de las rutas y no importan los JSON.
- `app/content/`: `site.json`, `projects.json`, `media.json`, `index.js` y `validate.js`. No importa componentes ni motores de animación.
- `app/motion/`: componentes de movimiento y parámetros comunes en `motionConfig.js`.
- `app/motion/CircularCarousel.jsx`: adaptación JavaScript/CSS de React Bits que sustituye el anillo de marcas en Home/About y la rueda de Work. Recibe fotos por propiedades, usa BEM con CSS Modules y conserva su licencia en `licenses/react-bits-LICENSE.md`.
- `app/styles/`: `tokens.css`, `fonts.css` y `globals.css` para valores compartidos, fuentes y reglas base.
- `public/images/`, `public/fonts/` y `public/documents/`: recursos definitivos del usuario.

Nombrar componentes en PascalCase y funciones, variables y hooks según las convenciones habituales de JavaScript y React. Colocar `Nombre.module.css` junto al componente correspondiente. Mantener nombres y formato coherentes con el código existente.

Usar BEM dentro de CSS Modules: `bloque`, `bloque__elemento` y `bloque--modificador`, con palabras en minúsculas separadas por guiones. Los modificadores acompañan a su clase base. Acceder desde JSX con `styles["bloque__elemento"]`. Reservar el prefijo global `u-` para utilidades compartidas; mantener estilos propios en el módulo de su componente, sin volver a reunir varias páginas en `Page.module.css` ni depender de clases internas de otro componente.

Conservar un único `h1` por página. Usar `header`, `nav`, `main`, `article`, `section` y `footer` según su función; las secciones y navegaciones deben tener nombre accesible. Cuando un encabezado no forme parte del diseño visible, usar `u-visually-hidden`. Mantener las imágenes HTML ajustadas al contenedor con `object-fit: cover` y el encuadre de `media.json`.

Evitar copiar cuatro páginas de proyecto, introducir un estado global sin necesidad o mezclar datos personales dentro de los efectos. La estructura debe facilitar cambios de contenido y diseño sin añadir capas que el portfolio no necesita.

## Contenido, imágenes y enlaces

- Centralizar perfil, biografía, experiencia, contacto y redes en `site.json`; proyectos y galerías en `projects.json`; rutas o URL de imágenes, texto alternativo y encuadres en `media.json`.
- Conservar las notas `_comment` de `media.json` para orientar la edición; JSON estándar no admite `//`. Mantener [MEDIA-GUIDE.md](./app/content/MEDIA-GUIDE.md) coherente con los usos y carpetas. El Circular Carousel usa ocho recursos propios (`carousel01` a `carousel08`) para Home/About, ordenados mediante `site.carousel`, y otros ocho (`workCarousel01` a `workCarousel08`) para Work, ordenados mediante `site.workCarousel`. Las dos colecciones son independientes entre sí y de `cover01` a `cover04`. La rueda y sus registros `wheel01` a `wheel10` se retiraron por petición del usuario.
- Usar identificadores estables para proyectos relacionados y recursos. Derivar las rutas prerenderizadas de los slugs de los cuatro registros, junto con las tres páginas principales.
- Validar campos necesarios, slugs duplicados y referencias inexistentes antes de generar las páginas. Distinguir un recurso pendiente admitido de una referencia incorrecta.
- Conservar la configuración individual de galerías: imagen ancha (`wide`), pareja (`pair`), foto suelta (`image`), encuadre y orden móvil. Por petición del 27 de octubre de 2026, las cuatro fichas usan una galería inspirada en Works de Owen: dos columnas independientes desde 810 px y una columna en móvil. Por petición posterior de ese día, toda la ficha comparte el scroll de página desde el título hasta el pie; no reintroducir un panel desplazable en la galería. Las entradas M01 cubren los bloques de la ficha. El patrón de galería comienza vertical a la izquierda y cuadrado a la derecha, sigue con dos parejas verticales y repite; el resto de fotos es 3:4, con `aspectRatio` opcional por bloque. Admitir hasta diez apariciones por ficha, sin contar el hero; no rellenar con contenido inventado ni eliminar repeticiones. Las dimensiones de `media.json` describen el archivo; el patrón y `aspectRatio` reservan el recorte visible. Para añadir una foto se requiere tanto el registro de `media.json` como su referencia en `projects.json > gallery`. Mantener los slugs `modelaje`, `paisajes`, `producto` y `musica`, sus identificadores estables y los alias anteriores en `legacySlugs`.
- Mantener visibles los espacios reservados cuando `src` esté vacío o un recurso falle. Reservar dimensiones y proporciones para evitar saltos de contenido.
- Aceptar rutas locales y URL HTTPS editables. Preferir recursos locales para la versión final. Si una imagen remota no permite su uso como textura por CORS, mantener la imagen HTML de respaldo y comunicar la limitación.
- Mantener inactivos u omitir los enlaces sin destino real. No dirigirlos a contactos del autor de la referencia ni a enlaces comerciales de su plantilla.
- Para slugs desconocidos, mostrar el estado 404. No devolver el primer proyecto como sustituto. Si cambia una URL ya publicada, contemplar su redirección.

## Fidelidad visual y adaptación

Tomar las medidas, colores, tipografías, proporciones y jerarquías del README como punto de partida. Centralizar los valores compartidos en `tokens.css`; conservar los ajustes particulares necesarios para cada composición.

Respetar los tres intervalos documentados: móvil por debajo de 810 px, tableta desde 810 px hasta menos de 1200 px y escritorio desde 1200 px. Comprobar especialmente el apilado de tarjetas, el carrusel sobre el título de Work, el retrato antes del texto en About y el orden de las parejas de imágenes en móvil.

Por petición del 27 de octubre de 2026, los SVG de flecha de todas las tarjetas miden 18 × 18 px, dentro de un círculo reducido posteriormente de 50 a 25 px. Compartir `ArrowBadge` con el enlace de `InfoPanel`; mantener ambos estáticos y decorativos. Home omite el encabezado «Acerca de / 01» y su margen asociado, conservando el nombre accesible de la sección mediante `aria-label`. About mantiene su encabezado. Los títulos de `ProjectCard` usan Inter Display 500 local mediante `--font-card-title`, con tamaño/línea de 24/28,8 px desde 1200 px y 20/24 px por debajo, anchura normal e interletrado −0,01 em. Mantener la licencia de la fuente en `licenses/inter-OFL.txt`. La cabecera usa `var(--muted)` como color de texto; por debajo de 810 px se oculta la marca y Home, Work, About y Contacto se reparten en una sola fila, conservando el `nav` accesible, M02, el contador y el foco visible.

En Home móvil, por petición posterior del 27 de octubre de 2026, la presentación usa 44 px de margen superior e inferior (`compactMobile` de `ProfileHero`), sustituyendo los 150 px superiores iniciales. Aplicar sólo por debajo de 810 px; conservar el espaciado de escritorio y el de About.

En Work, por petición posterior del 27 de octubre de 2026, el título «Proyectos / Destacados» usa `clamp(65px, 9.5vw, 150px)` desde 810 px para evitar el solapamiento con el carrusel. El hero tiene 440 px de altura mínima y 32 px de margen inferior. En móvil conservar su composición y tamaño de título, reduciendo únicamente el margen inferior del hero a 28 px.

La identidad del usuario sustituye a la de la referencia. El nombre tipográfico «Quetzin Cuevas», definido en `site.name`, es la marca aprobada del portfolio y no debe etiquetarse como logotipo pendiente. `site.logo` admite una imagen opcional; su ausencia no implica contenido pendiente. Conservar la función compositiva de la marca sin presentar el nombre tipográfico como una reproducción exacta del SVG de referencia.

No añadir efectos, secciones o comportamientos que no estén pedidos o documentados para reinterpretar el estilo. Revisar los títulos largos, el recorte de imágenes y el desplazamiento horizontal accidental.

## Animaciones obligatorias y puntos por verificar

Seguir el inventario de la sección 11 del README. Mantener estos identificadores en las notas de implementación y revisión para comprobar su cobertura:

| ID | Responsabilidad |
|---|---|
| M01 | Entradas de página por bloques, sin alterar el espacio reservado |
| M02 | Sustitución vertical de letras en enlaces, con desfase por carácter |
| M03 | Retirado por el usuario el 25 de octubre de 2026; un título estático por tarjeta |
| M04 | Retirado por el usuario el 25 de octubre de 2026; una flecha SVG estática por tarjeta |
| M05 | Prueba WebGL de curvatura por posición y velocidad en las cuatro tarjetas de Home/Work y el fondo completo del panel de Home; menor intensidad móvil y respaldo HTML/CSS |
| M06 | FoldText de React Bits en el nombre principal de Home (petición del 27 de octubre): JavaScript/CSS, GSAP diferido, texto HTML visible y movimiento reducido inmediato; About y pie conservan su marca actual |
| M07 | Circular Carousel de React Bits con ocho fotos independientes en Home y About; sustituye el anillo de marcas por petición del usuario |
| M08 | Circular Carousel reutilizado en el hero de Work con ocho fotos propias; sustituye la rueda de diez imágenes por petición del usuario |
| M09 | Scroll amortiguado, enlaces internos, retorno al inicio y restauración de posición |
| M10 | Navegación, entradas, montaje y limpieza al cambiar de ruta |

Los tiempos, curvas y fórmulas aún no medidos deben seguir identificados como provisionales. Comparar el movimiento con la referencia antes de afirmar fidelidad exacta. No sustituir la deformación por una simple escala o inclinación ni dar por confirmada una transición compartida entre imágenes.

M03 y M04 se retiraron en todas las instancias de `ProjectCard`, incluidos Home, Work y los proyectos relacionados de las fichas. Mantener un solo título y un solo SVG, sin copias decorativas ni transformaciones o transiciones de hover/foco. Conservar el indicador de foco del enlace, el círculo de la flecha y la curvatura M05.

M07 y M08 son desviaciones aprobadas de la referencia: mantener arrastre con inercia, ajuste y selección de tarjeta, teclado, foco visible y respaldo HTML. El usuario pidió retirar los botones, nombres y contador visibles; no reintroducirlos. Conservar los nombres accesibles y las instrucciones para lectores de pantalla, así como Espacio para pausar o reanudar y flechas e Inicio/Fin para navegar. Con movimiento reducido no girar automáticamente ni interpolar la navegación. Pausar el carrusel fuera de pantalla, con foco dentro o con la pestaña oculta. Este carrusel usa CSS 3D y no participa en M05.

Por petición posterior del usuario, los carruseles de Home, About y Work vuelven a cargar sus ocho fotos completas desde el inicio. Mantener su representación 3D en el HTML inicial, precargar todas las fuentes al montar y conservar el respaldo hasta preparar el conjunto o alcanzar 2400 ms. No reintroducir la cola de dos cargas, la selección de vecinas ni el montaje diferido por proximidad. La pausa fuera de pantalla o con pestaña oculta sigue afectando al movimiento, sin aplazar las descargas. `Media` conserva la decodificación asíncrona y la carga diferida fuera de las imágenes prioritarias de los heroes de proyecto. Las cuatro tarjetas de cada listado y la curvatura M05 de Home/Work permanecen. No añadir Motion/LazyMotion: los motores actuales ya usan importaciones dinámicas.

Mantener un solo controlador de scroll. Sincronizar Lenis y ScrollTrigger, coordinar la restauración con el router y evitar que dos motores animen simultáneamente la misma propiedad.

Si se reincorpora un efecto gráfico por petición del usuario, compartir el canvas y coordinar su ciclo de animación. No crear un bucle independiente por imagen ni actualizar el estado de React en cada fotograma. Limpiar animaciones, observadores y eventos al desmontar; pausar efectos continuos fuera de pantalla y cuando la pestaña no sea visible.

## Prerenderizado, accesibilidad y respaldo visual

- Ejecutar accesos a `window`, canvas, medidas DOM y motores gráficos únicamente en el navegador. Mantenerlos fuera del prerenderizado.
- Entregar contenido y metadatos específicos por ruta en el HTML inicial. La primera renderización de React debe ser compatible con ese HTML.
- Mantener textos, enlaces e imágenes de respaldo en HTML. Activar la representación gráfica sólo cuando esté lista y restaurar el respaldo si falla.
- Conservar la interacción en los elementos HTML; el canvas decorativo no debe interceptar el puntero ni sustituir enlaces accesibles.
- Usar elementos semánticos, navegación por teclado y foco visible. Las copias de letras, títulos o iconos utilizadas para animar no deben duplicar el nombre accesible.
- Respetar `prefers-reduced-motion`: mostrar el contenido inmediatamente, detener giros, desactivar deformación y usar scroll sin amortiguación.
- Priorizar los recursos visibles al abrir la página y diferir las galerías inferiores. Mantener proporciones y encuadres durante la carga.

## Dependencias y comandos

Antes de ejecutar una tarea, revisar `package.json` y usar los comandos realmente definidos:

| Acción | Comando |
|---|---|
| Instalar dependencias | `pnpm install` |
| Desarrollo | `pnpm dev` → prepara variantes y ejecuta `react-router dev` |
| Compilación y prerenderizado | `pnpm build` → prepara imágenes, prerenderiza y genera SEO, compresión y salida estática |
| Instalación reproducible en integración continua | `pnpm install --frozen-lockfile` |
| Verificación del HTML ya compilado | `pnpm check:pages` |
| Formato, pruebas, compilación y HTML generado | `pnpm check` |
| Revisar compilación estática | `pnpm preview` (servidor estático de revisión con 308/404) |

Fijar la versión exacta de pnpm mediante `packageManager` al inicializar el proyecto y documentar una versión compatible de Node.js. Usar pnpm para instalar, añadir o retirar dependencias; no generar archivos de bloqueo de otros gestores ni editar manualmente `pnpm-lock.yaml`.

Incorporar dependencias sólo cuando resuelvan una necesidad concreta. El prototipo Canvas 2D anterior se eliminó; no reintroducirlo. La prueba actual usa un único canvas Three.js, recibe fotogramas del ticker existente y conserva HTML ante fallos. No dar la deformación por calibrada. Actualizar el README cuando cambien los comandos o la estructura real.

## Verificación y entrega de cambios

Para cambios de implementación, ejecutar la compilación y las comprobaciones existentes pertinentes. No anunciar pruebas superadas si no se ejecutaron. Para cambios sólo de documentación, revisar coherencia, enlaces y ejemplos; no instalar dependencias ni crear una aplicación para validarlos.

Al completar las pantallas y sus efectos, verificar:

1. Las siete rutas mediante navegación, acceso directo y recarga; también un slug desconocido y la navegación atrás/adelante.
2. El HTML generado, los metadatos de cada proyecto y la ausencia de errores de hidratación o de consola relacionados con el cambio.
3. La comparación visual a 1440, 1024 y 390 px; añadir 360, 768, 809/810, 1199/1200 y 1920 px para comprobar extremos y cambios de distribución.
4. Reposo, entrada, hover, scroll lento, rápido e inverso, retorno al inicio y ciclos completos de ambos carruseles; comprobar también arrastre, pausa y teclado. Una captura estática no valida una animación.
5. La alineación entre canvas y DOM al cargar fuentes, redimensionar y navegar repetidamente; comprobar que no se acumulen bucles o eventos.
6. Teclado, foco, movimiento reducido, contenido pendiente, imágenes fallidas y respaldo al desactivar el renderizador.

Adaptar la verificación al cambio realizado. Añadir pruebas automatizadas cuando protejan comportamiento significativo, como validación de datos o resolución de rutas; evitar pruebas que sólo repitan la implementación.

Conservar los cambios existentes del usuario y mantener el trabajo dentro del alcance solicitado. Comunicar en español qué se modificó, qué se comprobó y qué queda pendiente. No afirmar que la réplica es exacta mientras existan diferencias o animaciones sin calibrar. Publicar únicamente cuando el usuario lo solicite.


## SEO y entrega estática aprobados el 30 de octubre de 2026

- Usar `site.url` (`https://quetzin-portfolio.vercel.app`) como origen canónico; metadatos generales en `site.seo`, títulos opcionales de ficha en `seoTitle` y descripciones en `project.description`. Conservar el enfoque aprobado en fotografía y producción audiovisual.
- Compartir `getPagePaths` entre prerenderizado y sitemap. Las siete rutas editoriales son canónicas; `/404` es auxiliar. `legacySlugs` alimenta los HTTP 308 de Vercel y de `pnpm preview`. Conservar el respaldo de navegación cliente.
- Mantener canónicas, Open Graph, tarjetas sociales y JSON-LD en HTML inicial y navegación. Schema usa Person/WebSite, ProfilePage, CollectionPage/ItemList y CreativeWork a partir de datos reales. No añadir fechas, clientes, dirección ni valoraciones inventados.
- Generar sitemap, robots y error 404 en la compilación. Vercel usa Build Output API estática (`.vercel/output`), sin servidor de aplicación. El documento HTTP 404 conserva estilos y enlaces, sin hidratar React contra una URL desconocida.
- `VERCEL_ENV=preview` o `SEO_NOINDEX=1` activa noindex en HTML y cabeceras. No aplicar noindex a producción por defecto. Robots permite rastreo para que el buscador pueda leer la directiva.
- `media:prepare` deriva dimensiones reales y variantes WebP locales (calidad 82, sin ampliar) antes de desarrollo, pruebas y compilación. Originales y encuadres se conservan. `.cache/` y `public/images/generated/` no se versionan. Los carruseles mantienen las ocho fotos completas desde el inicio, usando una variante de 640 px compartida entre precarga, respaldo y fragmentos 3D.
- Priorizar la primera portada de Home/Work, el retrato de About y los heroes de proyecto: son imágenes LCP observadas en laboratorio. El resto mantiene carga diferida. El motor M05 usa `currentSrc`, conserva el canvas/ticker compartidos y no cambia su curvatura.
- Mantener Brotli/gzip en la previsualización y las comparaciones de Lighthouse. `pnpm check` incluye enlaces/recursos locales; `pnpm check:links --external` distingue errores confirmados y bloqueos. `pnpm perf` registra perfiles móvil/escritorio y medianas de tres ejecuciones por defecto. No presentar TBT como INP ni laboratorio como datos de usuarios reales.
- Node.js mínimo 22.19; sharp, Lighthouse y sirv son herramientas de desarrollo. Ver resultados y procedimiento en `docs/SEO-RENDIMIENTO.md`.

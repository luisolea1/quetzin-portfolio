# Portfolio personal — Diseño basado en Paul Michel, con JavaScript + React + Vite + pnpm

**Referencia:** [paul-michel.framer.website](https://paul-michel.framer.website/)  
**Inspección:** 21 de octubre de 2026  
**Estado:** arquitectura aprobada; primera implementación funcional con contenido provisional. La calibración visual y de animación está pendiente.

Este documento especifica la apariencia, composición adaptable, navegación, recursos y movimiento de la referencia para construir el portfolio con JavaScript, React y Vite, usando pnpm como gestor de paquetes. La base técnica descrita en las secciones 14, 15 y 19 ha sido aprobada y actualizada a petición del usuario. Las mediciones del sitio original siguen siendo la referencia para calibrar la implementación.

### Ejecutar y editar la implementación actual

Con Node.js 22.19 o posterior y pnpm 11.3.0: `pnpm install`, `pnpm dev` y abrir http://localhost:5173. Desarrollo, pruebas y compilación preparan las variantes locales de imagen antes de importar el contenido. `pnpm test` valida contenido, SEO, rutas HTTP, carrusel, curvatura y conservación del HTML. `pnpm build` genera siete páginas editoriales y una página auxiliar 404, sitemap, robots, variantes de imagen y recursos comprimidos en `build/client/`, además de la salida estática de Vercel en `.vercel/output/`. `pnpm preview` sirve la compilación en http://localhost:8080 con alias HTTP 308 y errores 404 reales; no utiliza un fallback 200 para direcciones desconocidas. `pnpm check` comprueba formato, pruebas, compilación, HTML, metadatos y enlaces/recursos locales. No se incorpora un servidor de aplicación en producción.

**SEO y rendimiento, 30 de octubre de 2026:** el dominio canónico aprobado es `https://quetzin-portfolio.vercel.app`, con enfoque en fotografía y producción audiovisual. `site.url` y `site.seo` centralizan el dominio y los títulos, descripciones e imágenes sociales de Inicio, Work y About; las fichas usan `seoTitle`, `description` y `hero` de cada proyecto. Un único generador produce canónicas, Open Graph, tarjetas sociales y JSON-LD en el HTML inicial y al navegar. El sitemap deriva de las mismas siete rutas del prerenderizado, sin alias, 404 ni fechas inventadas. Las compilaciones de Vercel Preview (`VERCEL_ENV=preview`) o `SEO_NOINDEX=1` generan `noindex` en metadatos y cabeceras; producción permite indexación. Consulta la [guía de SEO y resultados de rendimiento](./docs/SEO-RENDIMIENTO.md).

La configuración estática de Vercel se genera desde los slugs y `legacySlugs` mediante Build Output API. Conserva siete páginas editoriales; `/404` es un recurso auxiliar. El error HTTP utiliza HTML sin hidratación para evitar que una URL desconocida intente hidratar el árbol de `/404`; los enlaces siguen funcionando. La navegación dentro de React conserva su estado 404. En otros alojamientos hay que reproducir las redirecciones y respuestas HTTP de la salida generada.

El documento de inicio generado está en `build/client/index.html`. `pnpm format:html` vuelve a formatear los HTML de una compilación existente. `scripts/format-html.js` utiliza Prettier con sensibilidad estricta a los espacios y verifica con parse5 que el DOM permanezca idéntico. Algunos cierres `>` quedan en la línea siguiente para no introducir nodos de texto que afecten a la hidratación. Los textos, comentarios de React y scripts se conservan literalmente. Los cambios de contenido y estructura se realizan en `app/`; los HTML de `build/` se regeneran al compilar.

Para mantener legibles los archivos fuente, `pnpm format` aplica Prettier al JavaScript, JSX, CSS y JSON de `app/`, a los scripts y a la configuración de la raíz. `pnpm format:check` comprueba el formato sin modificar archivos y se ejecuta al inicio de `pnpm check`. La configuración compartida está en `prettier.config.js`: sangría de dos espacios y un ancho objetivo de 100 caracteres. `.prettierignore` excluye dependencias, compilaciones, recursos de `public/` y el archivo de bloqueo. Los componentes y las reglas CSS conservan su estructura y comportamiento.

Personaliza `app/content/site.json`, `projects.json` y `media.json`; coloca imágenes propias bajo `public/images/` y, si existe, tu logo SVG en `public/images/`. Las cuatro fichas están en `/projects/modelaje`, `/projects/paisajes`, `/projects/producto` y `/projects/musica`. Los slugs anteriores se conservan en `legacySlugs` y redirigen en el navegador a su URL legible; los identificadores estables y las relaciones no cambian. Los recursos y enlaces vacíos muestran espacios reservados o quedan desactivados. Inter Variable e IBM Plex Mono se empaquetan desde Fontsource. Los títulos de las tarjetas usan Inter Display 500 local, con el mismo archivo latino de la referencia; el resto de la tipografía mantiene Inter Variable como aproximación de Inter Display. Los efectos activos requieren comparación animada con la referencia y medios propios. No se han recibido `recursos-referencia.json` ni las capturas mencionadas en este documento.

**Galerías y URL solicitadas el 27 de octubre de 2026:** las fichas usan los nombres de proyecto como slugs. Su galería adopta la composición de [Works de Owen](https://owen.framer.media/), sin modificar Home ni Work. **Observado** en la referencia: dos columnas independientes, junta de 10 px, fotos con proporciones distintas y un panel de altura limitada con `overflow-y: auto`; al desplazarlo, su encabezado permanece fuera del área desplazable. En móvil se convierte en una columna, con junta de 8 px y scroll de página. Los dos fragmentos HTML aportados corresponden a esa variante de una columna. La entrada observada desplaza las fotos unos 18 px; sus tiempos exactos no se midieron.

**Implementación inicial del 27 de octubre, sustituida por la petición posterior:** el panel tenía scroll propio y altura limitada desde 810 px. La referencia observada anterior se conserva como análisis; el comportamiento actual se describe a continuación.

Cada galería admite **hasta diez apariciones**, sin contar el hero. Se mantienen `pair`, `wide` y `mobileOrder`, y se añade el bloque `image` para incorporar fotos sueltas. En esta composición, cada foto ocupa su columna; `wide` identifica una imagen horizontal, sin forzar que abarque ambas columnas. El patrón actual reserva fotos 3:4, con cuadrados a la derecha en las posiciones 2 y 8 (contando desde 1). Empieza con una pareja vertical/cuadrado, sigue con dos parejas verticales y repite. `aspectRatio` numérico en el bloque permite modificar el recorte; `width` y `height` de `media.json` describen el archivo original. El número de fotos se configura por proyecto y no se completa automáticamente. No se añade contenido para llenar los diez espacios. La [guía de imágenes](./app/content/MEDIA-GUIDE.md#cómo-ampliar-una-galería-hasta-diez-fotos) explica cómo añadirlas. El prerenderizado mantiene siete rutas canónicas; los alias antiguos usan HTTP 308 en Vercel y en la previsualización desde el cambio SEO del 30 de octubre; el router conserva un respaldo cliente.

Verificación de la implementación inicial del 27 de octubre (anterior al cambio siguiente): `pnpm check` supera 29 pruebas, compila las siete rutas canónicas y comprueba las galerías en su HTML inicial. En Chrome se revisaron los cuatro alias, un slug desconocido, enlaces relacionados, recarga e historial; no se observaron errores de hidratación o consola en esas rutas. La galería de Modelaje se comprobó a 360, 390, 768, 809, 810, 1024, 1199, 1200, 1440 y 1920 px, sin desbordamiento horizontal, con el orden móvil conservado, scroll interno desde 810 px y foco/salida con Tab. Una página temporal, retirada después, verificó diez apariciones, imágenes pendientes y fallidas sin colapso, y el estado de entradas con movimiento reducido simulado. No se ha probado un teléfono físico ni se han calibrado los tiempos exactos frente a Owen.

**Petición posterior del 27 de octubre: scroll de toda la ficha y FoldText en Home.** Se elimina la altura limitada y el scroll interno de la galería. Desde el título hasta el pie, las cuatro fichas comparten el scroll de página M09 y el único Lenis existente; el movimiento reducido usa scroll nativo. Las entradas M01 (`Reveal`, 22 px y 0,7 s, valores propuestos) cubren ahora título, portada, resumen, encabezado/fotos de galería y proyectos relacionados. La galería mantiene dos columnas desde 810 px y una por debajo, con `mobileOrder` conservado, proporciones reservadas y respaldo HTML. El primer elemento derecho es cuadrado; el resto comienza vertical, y el cuadrado derecho se repite después de dos parejas verticales. Los tiempos y recortes siguen siendo ajustes para revisión, no medidas exactas de Owen.

`modelajeGallery04` estaba definido en `media.json`, pero no figuraba en `projects.json > Modelaje > gallery`; se añade su referencia como bloque `image`. Su archivo `model0.webp` mide 2048 × 1538 px, y esos son ahora sus metadatos. Es válido reutilizarlo aunque también aparezca en el hero. El listado de `projects.json` decide qué aparece y en qué orden; añadir un registro al catálogo de medios por sí solo no lo incorpora a una pantalla.

M06 del nombre principal de Home cambia al [FoldText de React Bits](https://reactbits.dev/text-animations/fold-text), usando la fuente JavaScript/CSS aportada por el usuario. Se adaptan sus clases a BEM/CSS Modules en `FoldText.jsx` y `FoldText.module.css`, y el motor queda en `foldTextMotion.js`, importado sólo en el navegador. Usa GSAP/ScrollTrigger ya instalados, el ticker GSAP existente, sin otro Lenis ni bucle `requestAnimationFrame`. Parámetros en `motionConfig.foldText`: `paper`, caracteres, bisagra superior, entrada con scroll, ángulo 92°, duración 0,65 s, desfase 0,045 s y repliegue cercano al puntero de hasta 45° / radio 140 px. Conserva la fuente, el peso y el interletrado del nombre aprobado, con una calibración de tamaño propia (`14.6vw` desde 810 px y `13.8vw` en móvil, dentro de sus límites CSS) para mantener el nombre completo en una línea. Son ajustes propuestos para FoldText, no medidas de la referencia. No se aplica al nombre de About ni al pie. La licencia compartida se conserva en `licenses/react-bits-LICENSE.md`.

El HTML inicial de FoldText contiene el nombre visible y un único texto accesible; sólo se pliega al preparar el motor. Si falla su carga queda estático. Con movimiento reducido, inicial o cambiado durante la sesión, se cancelan la entrada y la reacción al puntero y se muestra el nombre completo. Las animaciones pausarán fuera de pantalla y con la pestaña oculta; se limpian observadores, listeners, timeline, ScrollTrigger y suscripción al ticker al desmontar.

Verificación de esta petición posterior: `pnpm check` supera 30 pruebas, compila las siete rutas y verifica el respaldo estático/accesible de FoldText y todas las fotos de las galerías en HTML. En Chrome se revisaron Home y Modelaje a 360, 390, 768, 809, 810, 1024, 1199, 1200, 1440 y 1920 px: nombre completo en una línea, sin desbordamiento horizontal, recorte 3:4 / 1:1 real, orden móvil y scroll de página sobre la galería. Las cuatro fotos de Modelaje cargan, incluida `modelajeGallery04`. Se observaron el despliegue de letras y su repliegue con el puntero. Una página temporal, retirada después, verificó diez fotos y movimiento reducido inicial, activado durante la sesión y reanudado. La navegación entre las siete rutas, el alias de Modelaje y un slug desconocido no produjo errores de consola observados; FoldText aparece sólo en Home. Las comprobaciones no equivalen a una prueba en teléfono físico ni a calibración exacta contra las referencias.

Las tarjetas omiten las categorías cuando su lista está vacía; no muestran la etiqueta «Proyecto pendiente». Los nombres y las flechas se representan en HTML sobre la imagen.

Las flechas de todas las tarjetas de proyecto utilizan `ArrowUpRightIcon` de [Phosphor Icons para React](https://github.com/phosphor-icons/react), como SVG blanco de 18 px (reducido de 36 px por petición del usuario el 27 de octubre de 2026). Se importa únicamente ese icono desde su módulo SSR, compatible con el prerenderizado. Cada tarjeta conserva una flecha estática dentro del círculo. Los SVG son decorativos y el nombre accesible continúa en el enlace de cada tarjeta.

**Ajuste de tarjetas y cabecera solicitado el 27 de octubre de 2026:** se reduce únicamente el SVG de flecha a 18 × 18 px; su círculo de 50 px y la presentación estática M03/M04 se conservan. **Observado de nuevo** en el título Syndicate de la referencia a 1440, 1024 y 390 px: Inter Display, peso 500, anchura normal (100 %), tamaño/línea 24/28,8 px en escritorio y 20/24 px en tableta/móvil, con interletrado de −0,01 em. Se aplica esa familia y los mismos valores a todos los títulos de `ProjectCard` de Home, Work y proyectos relacionados, sin cambiar su semántica.

La fuente latina original, sin modificar, se aloja en `public/fonts/inter-display-latin-500.woff2`, obtenida del [archivo usado por la referencia](https://framerusercontent.com/assets/iwWTDc49ENF2tCHbqlNARXw6Ug.woff2). `fonts.css` declara sólo Inter Display 500 y `tokens.css` expone `--font-card-title`; los demás textos siguen usando su familia actual. Se conserva la [licencia SIL OFL de Inter](./licenses/inter-OFL.txt). El conjunto latino incluye los caracteres españoles de los nombres actuales y recurre a las fuentes de respaldo para otros glifos.

La cabecera adopta `color: var(--muted)` en sus textos, marca y Contacto. En móvil (menos de 810 px), la marca se oculta y Home, Work (04), About y Contacto ocupan una sola fila en cuatro espacios equivalentes, con áreas de enlace de al menos 44 px de alto. El `nav` conserva su nombre accesible, M02 y el contador de catálogo. Desde 810 px permanece la distribución de tres zonas. Esta disposición móvil es una desviación aprobada de la referencia observada en la sección 5.1.

Verificación del ajuste: `pnpm check` supera 30 pruebas, compila y comprueba las siete páginas. Chrome confirma Inter Display cargada, peso 500 y las medidas de texto anteriores; los SVG de Home y Work miden 18 × 18 px. Se revisaron 320, 360, 390, 768, 809, 810, 1024, 1199, 1200, 1440 y 1920 px: sin desbordamiento horizontal, cuatro enlaces en una fila y marca oculta por debajo de 810 px, distribución de tres zonas por encima. Se comprobaron navegación móvil y foco de teclado, sin errores de consola observados. Se normalizó únicamente el formato de `media.json`, comparando antes/después para conservar todos sus datos.

**Ajuste posterior de espaciado móvil de Home, 27 de octubre de 2026:** el texto de presentación deja 44 px tanto por encima como por debajo, reduciendo su margen superior anterior de 150 px. `HomeHero` activa `compactMobile` en `ProfileHero`; el modificador actúa únicamente por debajo de 810 px. Desde 810 px se mantienen los márgenes anteriores de 35 px arriba y 110 px abajo. About conserva su espaciado previo. Los 150 px descritos en la inspección de la referencia son una observación histórica, sustituida para Home móvil por esta petición.

**Ajuste posterior del hero de Work, 27 de octubre de 2026:** «Proyectos / Destacados» reduce su tamaño desde 810 px a `clamp(65px, 9.5vw, 150px)` para caber junto al carrusel. La altura mínima del hero baja de 520 a 440 px y su margen inferior de 65 a 32 px, acercando la cuadrícula. En móvil se conserva el tamaño del título y el carrusel sobre él; el margen inferior baja de 43 a 28 px. Son ajustes propios solicitados por el usuario, que sustituyen estas medidas de la referencia para Work.

Verificación del hero de Work: `pnpm check` supera 32 pruebas y compila/verifica las siete rutas. En Chrome a 360, 390, 809, 810, 1024, 1199, 1200, 1440 y 1920 px, el título cabe en su columna, queda separado del carrusel desde 810 px y no hay desbordamiento horizontal. El margen entre hero y cuadrícula mide 28 px en móvil y 32 px desde 810 px, sin errores de consola observados.

**Ajuste posterior de flechas y panel de Home, 27 de octubre de 2026:** los círculos se reducen también a la mitad, de 50 a 25 px, manteniendo el SVG blanco de 18 px. `ArrowBadge` comparte esa presentación entre todas las tarjetas y los enlaces de `InfoPanel`, donde sustituye la flecha tipográfica. Home retira «Acerca de / 01» y el margen asociado; la sección conserva el nombre accesible «Acerca de Quetzin Cuevas» y About mantiene su encabezado.

Por confirmación del usuario, M05 se extiende al fondo completo del panel de Home, hasta el borde inferior junto a «Conoce mi historia». `InfoPanel` registra su superficie opaca mediante `scrollEffect="curve"`; el motor admite un material de color junto a las texturas y comparte canvas, geometría, ticker y parámetros `0.05` / `0.04`. El color se obtiene de `--scroll-surface-color`, que permanece estable durante el relevo del fondo CSS al canvas. Textos, enlace y carrusel siguen en HTML por encima del fondo y conservan sus interacciones. Esta ampliación sustituye la restricción anterior a las fotografías de los listados; el panel de About y las fotos del carrusel siguen fuera del efecto. El fondo CSS se conserva antes de preparar el dibujo y se restaura al salir de pantalla, desmontar, fallar WebGL o activar movimiento reducido. No se incorpora otro controlador de scroll ni se da por calibrada la animación.

Verificación del panel y las flechas: `pnpm check` supera 32 pruebas, compila las siete rutas y comprueba en el HTML que sólo Home incorpora una superficie de color, con nombre accesible, sin el encabezado retirado y con su enlace final dentro. En Chrome a 1440, 1024 y 390 px se verificaron fondo curvo, ausencia de desbordamiento horizontal, círculo/SVG de 25/18 px, scroll e inversión, arrastre y teclado del carrusel, enlace final y navegación Home/About/Work sin acumular canvas ni errores de consola observados. About conserva su encabezado y no incorpora canvas. Una página temporal, retirada después, confirmó respaldo CSS con movimiento reducido simulado inicial/dinámico, reanudación y pérdida real del contexto WebGL. Las pruebas del motor cubren compartir un único canvas/ticker, toda la altura del panel, pausa, salida de pantalla y conservación del fondo ante fallos de textura o GPU. No se ha probado un teléfono físico ni se ha calibrado el movimiento exacto de la referencia.

**Retirada de M03/M04 solicitada el 25 de octubre de 2026:** los títulos y las flechas de todas las tarjetas quedan estáticos, tanto en Home y Work como en los proyectos relacionados de las fichas. Se eliminan las copias de texto y SVG, las máscaras exclusivas del intercambio y sus reglas de transformación, opacidad y transición para hover/foco. Cada tarjeta muestra una sola vez su título y su flecha; mantiene el foco visible del enlace y la curvatura de la fotografía M05. Las observaciones de M03/M04 en la sección 11 corresponden a la referencia y ya no son requisitos de animación para este portfolio.

Por indicación del usuario, About omite el botón de CV y su estado pendiente; se retiraron su propiedad de contenido, su validación y sus estilos. Las listas de servicios y sectores de `InfoPanel` mantienen 4 px entre elementos consecutivos y conservan la separación inicial respecto a su etiqueta.

Contacto en la cabecera y los enlaces de redes del pie muestran sólo su texto, sin la flecha tipográfica final. En la navegación principal, Work utiliza la misma sustitución de letras M02 que Home y About. `AnimatedLink` admite un `suffix` estático para el contador y un `ariaLabel` que conserva el nombre completo `Work (04)`; texto y contador siguen formando un único enlace.

**Cambio de alcance solicitado el 22 de octubre de 2026:** se retiró temporalmente M05, la deformación de imágenes y paneles al hacer scroll. Se eliminaron el motor Canvas 2D, su proveedor, registros, parámetros y pruebas exclusivas. Las imágenes se muestran directamente en HTML con `object-fit: cover`, el encuadre de `media.json` y recorte dentro de su contenedor. Las entradas de bloques M01 y las demás animaciones permanecen activas. Esta retirada se mantiene como registro histórico; la prueba aprobada el 24 de octubre se describe a continuación.

**Prueba de M05 solicitada el 24 de octubre de 2026, extendida a Work por petición del usuario:** la retirada anterior se sustituye por una prueba en las cuatro portadas de Home y las cuatro tarjetas de Work. Se adapta la demo local de scroll curvo mediante Three.js 0.180.0 y un shader: las imágenes se ensanchan hacia los lados cerca del borde inferior, tomando el centro del viewport como referencia. La velocidad añade un refuerzo acotado. El motor, los shaders y los cálculos se separan en `app/motion/scrollCurveEngine.js`, `scrollCurveShaders.js` y `scrollCurveMath.js`; `useScrollImages.js` conecta el registro React con el ticker existente de `MotionProvider`. Three.js se importa sólo en el navegador cuando hay participantes y no se solicita movimiento reducido. No se añade otro Lenis ni otro ciclo de fotogramas.

`Media` acepta `scrollEffect="none"` (predeterminado) o `"curve"`. Home y Work transmiten la activación a sus cuatro tarjetas; Home también activa el fondo de su `InfoPanel` por la petición posterior anterior. Las fichas, About y los carruseles no participan. Un canvas fijo se añade directamente a `body`, con `pointer-events: none`. Conserva encuadres porcentuales, recorte `cover`, radios y color sRGB. El relevo desde HTML/CSS espera a un dibujo válido y a que `Reveal` comunique `data-reveal-state="done"`; títulos, flechas y foco permanecen en HTML por encima. El área de enlace mantiene su geometría rectangular. Si el encuadre no es compatible, la textura falla, WebGL no está disponible o se pierde el contexto, vuelve a verse el respaldo; un fallo global desactiva el motor hasta el siguiente montaje de participantes. El renderizador libera sus recursos al abandonar cada listado, también entre Home y Work, y no dibuja con la pestaña oculta, sin superficies cercanas o con la escena estable.

Parámetros actuales **propuestos, no medidos de la referencia**, centralizados en `motionConfig.scrollCurve`: curvatura `0.05` desde 810 px y `0.04` por debajo; deformación progresiva desde el 48 % de altura; refuerzo máximo del 45 % a 1800 px/s y suavizado exponencial de factor `10`; DPR máximo `1.5` en tableta/escritorio y `1` en móvil. Por petición del usuario, la curvatura desde 810 px se redujo de `0.10` a `0.05` para una apertura lateral más sutil, cercana a la móvil. Con movimiento reducido se usa HTML/CSS y se desactiva Lenis, también al cambiar la preferencia durante la sesión. La prueba no implica fidelidad exacta ni deforma textos; sólo el fondo del panel de Home se incorpora por la petición posterior documentada.

Verificación inicial de la prueba sólo en Home el 24 de octubre (anterior a esta extensión): `pnpm check` supera 25 pruebas, compila las siete rutas y comprueba que sólo Home marca las portadas configuradas, con HTML visible y sin canvas prerenderizado. Chrome se revisó a 1440, 1024, 810, 809, 390 y 360 px y en orientación 844 × 390: scroll, navegación, historial, retorno arriba y foco visible; se comprobó un único canvas activo tras varios ciclos Home/Work. Una página temporal de pruebas permitió simular movimiento reducido inicial y durante la sesión, pérdida real del contexto WebGL e imagen fallida; no forma parte del sitio publicable. Las pruebas automatizadas con adaptadores DOM/GPU cubren además pausa de dibujo, errores de textura/shader, liberación y cargas tardías. No se ha probado un teléfono físico ni se ha acreditado fidelidad animada con la referencia.

**Cambio de M07 solicitado el 22 de octubre de 2026:** el anillo de nombres de marcas se sustituyó en Home y About por [Circular Carousel de React Bits](https://reactbits.dev/components/circular-carousel), con ocho fotografías independientes de las portadas, configuradas como `carousel01` a `carousel08` en `media.json` y ordenadas mediante `site.carousel`. Por indicación posterior del usuario se retiraron los botones visibles, los nombres y el contador inferior, junto con sus estilos y espacio reservado; las fotos quedan centradas en toda la altura del carrusel. La adaptación JavaScript/CSS conserva la geometría 3D, arrastre con inercia, ajuste a tarjetas y enfoque al pulsar una foto. Mantiene navegación con flechas e Inicio/Fin, pausa o reanudación con Espacio, pausa durante el foco y movimiento reducido sin giro ni interpolación. Las instrucciones, los nombres y la posición activa permanecen disponibles para lectores de pantalla. Mantiene HTML visible durante la carga, espacios reservados para fotos pendientes o fallidas y detiene el ciclo fuera de pantalla o con la pestaña oculta. Utiliza CSS 3D, sin canvas ni dependencias nuevas, y no participa en M05. Los parámetros iniciales no son medidas de la referencia.

**Restauración de la carga completa de M07/M08, por petición posterior del usuario:** se retira la carga progresiva introducida el 24 de octubre. Home, About y Work vuelven al componente anterior: las ocho fotos y sus fragmentos 3D están presentes desde el HTML inicial, todas las fuentes se precargan al montar y el respaldo HTML permanece hasta que termina la preparación del conjunto o transcurren 2400 ms. Las copias decorativas cargan inmediatamente y conservan `decoding="async"`. Se eliminan la cola de dos cargas, la preparación por vecinas y el montaje a 400 px del viewport. La pausa fuera de pantalla o con la pestaña oculta conserva su función sobre el movimiento. No cambian la geometría, el arrastre, el teclado, las colecciones de fotos ni el respaldo ante errores.

La curvatura M05 permanece en las cuatro tarjetas de Home y las cuatro de Work, con valores `0.05` / `0.04`. Fuera de los carruseles se conservan las mejoras de `Media`: decodificación asíncrona, carga diferida para imágenes secundarias, prioridad alta en los cuatro heroes de proyecto y detección de fallos previos a la hidratación. Se retira la prioridad especial de la primera foto de Work al restaurar el comportamiento anterior del carrusel. Las cuatro tarjetas completas de cada listado siguen en el HTML inicial. Continúan las importaciones dinámicas de GSAP, Lenis y Three.js.

Las mediciones de carga progresiva de la entrega anterior ya no describen esta configuración y se retiraron de este documento. Las comprobaciones de HTML exigen ahora ocho superficies 3D y la precarga de cada foto configurada por carrusel, además del respaldo de ocho fotos, M05 sólo en Home/Work y la prioridad de los heroes de proyecto.

Verificación de esta restauración: `pnpm check` supera 25 pruebas, compila las siete rutas y confirma en el HTML las ocho fotos completas de cada carrusel desde el inicio, las cuatro tarjetas de cada listado, las marcas M05 sólo en Home/Work y la prioridad de las imágenes principales de proyecto. El componente del carrusel vuelve a la versión anterior a la carga progresiva.

La fuente adaptada es [CircularCarousel.jsx de React Bits](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/src/content/Components/CircularCarousel/CircularCarousel.jsx), revisión `e12c22192ac7b4b452c5e2feb9b586d74765d696`. Su aviso de autoría y licencia se conserva en [licenses/react-bits-LICENSE.md](./licenses/react-bits-LICENSE.md). El CSS se integra mediante BEM y CSS Modules.

Los registros de `media.json` incluyen una nota `_comment` con su ubicación, proporción y ejemplo de ruta. JSON estándar no admite comentarios `//`; estas notas son campos de edición y no se muestran en el sitio. Consulta [la guía de imágenes](./app/content/MEDIA-GUIDE.md) para organizar carpetas y completar cada registro. Las fotos existentes conservan su ubicación hasta que se decida moverlas y actualizar sus rutas.

**Ajuste de contenido solicitado el 22 de octubre de 2026:** Work muestra cuatro proyectos y la navegación deriva su contador del catálogo (`Work (04)`). Se retiraron los registros provisionales 05 y 06, sus recursos vacíos y sus rutas prerenderizadas; sus URL muestran 404. El anillo de Home/About pasa a ocho recursos propios, inicialmente pendientes, que no comparten identificadores con las portadas.

**Cambio de M08 solicitado el 23 de octubre de 2026:** se retiró la rueda de diez imágenes de Work y se reutilizó `CircularCarousel` en el mismo espacio del hero. Usa ocho fotos independientes (`workCarousel01` a `workCarousel08` en `media.json`), inicialmente con `src: null` y ordenadas mediante `site.workCarousel`. La carpeta preparada es `public/images/work/carousel/`. Conserva los ocho espacios reservados, el arrastre, el teclado, la pausa y el movimiento reducido del carrusel existente, sin botones, nombres ni contador visibles. El fondo y el foco se adaptan al hero blanco; el carrusel permanece a la derecha en escritorio y encima del título en móvil. Se eliminaron `ImageWheel`, su CSS y el parámetro de giro anterior. Las medidas y la geometría descritas en la inspección de la rueda original son referencias históricas y ya no forman parte de la implementación actual.

### Requisitos confirmados por el usuario

- Será un portfolio público que evolucionará antes de considerarse definitivo.
- Se prioriza una estructura fácil de modificar y ampliar en el futuro.
- Se utilizarán **JavaScript, React, Vite y pnpm**, con componentes `.jsx` y módulos de lógica y configuración `.js`.
- Se implementan **siete páginas**: inicio, catálogo, biografía y cuatro fichas de proyecto.
- El catálogo tendrá cuatro proyectos: Modelaje, Paisajes, Producto y Música. No se ha solicitado un editor administrativo.
- Se utilizará **contenido propio**. Las imágenes y los textos podrán quedar pendientes mediante espacios reservados y referencias editables.
- El diseño adaptable y las animaciones de la referencia siguen formando parte del alcance, con M05 en prueba sobre las cuatro tarjetas de Home/Work y el fondo completo del panel de Home, y M07/M08 sustituidos por Circular Carousel con colecciones de ocho fotos independientes por indicación del usuario.

Las secciones de inspección describen el sitio original. Sus nombres, imágenes, marcas, datos de contacto y textos son referencias de análisis, no contenido aprobado para el portfolio personal. La arquitectura acordada se detalla en las secciones 14, 15 y 19. M05 utiliza ahora la prueba WebGL de los listados de Home/Work y el fondo del panel de Home descrita arriba; las observaciones del original no acreditan igualdad con ese efecto.

## 1. Alcance y grado de certeza

Se inspeccionaron las nueve rutas públicas de la navegación principal: Home, Work, About y seis proyectos. Se revisaron cuatro familias de pantalla: portada, catálogo, biografía y ficha de proyecto.

Se observaron diseños con anchos efectivos de **1440, 1024 y 390 píxeles CSS**, además del ancho inicial del navegador. Las comprobaciones móviles son de distribución a ancho reducido; no equivalen a pruebas en un teléfono físico. Las medidas pueden variar unos píxeles por la barra de desplazamiento y el escalado del navegador.

En este documento:

- **Observado:** visto en la página renderizada o medido en sus estilos/elementos.
- **Inferido:** respaldado por la estructura, pero sin verificación completa de su comportamiento.
- **Propuesto:** decisión de implementación o valor inicial para calibrar; no es un parámetro extraído del original.

La mayor incertidumbre está en las curvas y tiempos exactos de las animaciones, la respuesta fina del logotipo al puntero y algunas variantes de hover. No se presenta una duración estimada como si fuera una medición. Una copia exacta deberá cerrar estos puntos mediante comparación animada durante la implementación.

## 2. Dirección visual

Portfolio editorial de dirección de arte. Fondo blanco, textos negros y grises, tipografía muy grande y compacta, fotografía de color intenso y módulos oscuros de información. Las imágenes y el movimiento concentran la atención; la interfaz de navegación es pequeña y discreta.

Rasgos que determinan la fidelidad:

1. El nombre grande es **un SVG**, no un título escrito con una fuente aproximada.
2. Los grandes títulos tienen interletrado negativo y una altura de línea muy cerrada.
3. Las tarjetas dejan juntas estrechas; los grandes espacios se reservan para separar grupos editoriales.
4. Las imágenes y algunas superficies oscuras se curvan/deforman. Reproducir únicamente escala o inclinación no consigue el mismo resultado.
5. Work incluye una rueda tridimensional de fotografías. Home y About incluyen un anillo tridimensional de nombres de marcas.
6. Los enlaces de texto usan sustitución vertical de letras con desfase entre caracteres.

## 3. Mapa de rutas y contenido

| Ruta | Función | Composición principal |
|---|---|---|
| `/` | Presentación | Cabecera, logotipo grande, introducción, cuatro proyectos, bloque About, anillo de marcas, pie |
| `/work` | Catálogo | Cabecera, título editorial y rueda de imágenes, seis proyectos, pie |
| `/about` | Biografía | Cabecera, logotipo grande, introducción, biografía y retrato, fotografía de arquitectura, experiencia, anillo, pie |
| `/projects/syndicate` | Proyecto | Título, imagen principal, resumen y metadatos, galería, dos relacionados, pie |
| `/projects/beyond-the-screen` | Proyecto | Misma familia de composición |
| `/projects/machine-s-children` | Proyecto | Misma familia de composición |
| `/projects/medium-scene` | Proyecto | Misma familia, con menos imágenes de galería |
| `/projects/kaleidoscope` | Proyecto | Misma familia, con menos imágenes de galería |
| `/projects/camera-rx` | Proyecto | Misma familia de composición |

### Proyectos y orden

| Orden | Proyecto | Categorías observadas | Año | Home |
|---|---|---|---|---|
| 1 | Syndicate | Branding / Design | 2026 | Sí |
| 2 | Beyond the Screen | Design / Development | 2026 | Sí |
| 3 | Machine's Children | Branding / Design | 2026 | Sí |
| 4 | Medium Scene | Branding / Design | 2026 | Sí |
| 5 | Kaleidoscope | Design / Development | 2025 | No |
| 6 | Camera RX | Branding / Development | 2025 | No |

El slug original es `machine-s-children`. Para el portfolio personal, las cuatro rutas de proyecto se definen desde los datos de contenido, con los slugs `modelaje`, `paisajes`, `producto` y `musica`. La implementación tiene siete páginas; la tabla anterior conserva las nueve rutas observadas en la referencia. Si un slug cambia después de publicar, deberá contemplarse la redirección de su URL anterior.

## 4. Sistema visual medido

### 4.1 Colores

| Rol | Valor observado | Aplicación |
|---|---|---|
| Fondo principal | `#FFFFFF` | Página y espacios entre módulos |
| Negro principal | `#111111` | Logotipo, títulos, superficies oscuras renderizadas |
| Texto secundario | `#888888` | Navegación, etiquetas, partes de la introducción |
| Texto sobre oscuro | `rgba(255,255,255,.8)` | Párrafos y listas |
| Blanco | `#FFFFFF` | Títulos y flechas de tarjetas |
| Superficie de control oscura | `#2A2A2A` | Botones sobre panel oscuro |
| Cristal sobre fotografías | `rgba(0,0,0,.15)` | Etiquetas y círculo de flecha |
| Grises adicionales declarados | `#454545`, `#AAAAAA`, `#D8D8D8` | Paleta auxiliar; asignar por componente al reproducirlo |

En las tarjetas, los controles tienen `backdrop-filter: blur(15px)` y saturación de `1.25`. No hay un color de acento general de interfaz: el color procede de las imágenes.

**Detalle técnico importante:** algunas cajas que se ven negras tienen un contenedor DOM blanco o transparente porque la superficie visible la dibuja el lienzo gráfico. Para reconstruir el diseño, manda la apariencia renderizada, no un `background-color` aislado del contenedor.

### 4.2 Tipografías

| Uso | Familia y peso | Escritorio | Tableta / móvil |
|---|---|---|---|
| Párrafos e introducciones | Inter Display, 400 | 21 px; línea ≈ 28 px; tracking `-.01em` | Tableta ≈ 19 px en introducciones; móvil 17 px / 23.8 px |
| Títulos de tarjetas | Inter Display, 500 | 24 px / 28.8 px; tracking `-.01em` | 20 px / 24 px |
| Títulos editoriales | Inter Display, 600 | Fluido; Work ≈ 163 px a 1440; Syndicate ≈ 171 px | Work ≈ 112.6 px a 1024 y 58.5 px a 390 |
| Navegación | IBM Plex Mono, 500 | 14 px; línea 1.6; tracking `.025em` | 13 px; línea 1.6 |
| Etiquetas y metadatos | IBM Plex Mono, 500 | 14 px / 16.8 px; tracking `.025em` | 13 px / 15.6 px |

Los títulos editoriales usan tracking `-.06em` y línea aproximada `.8735`. En móvil, el título largo de Beyond the Screen se parte en dos líneas. No fijar todos los títulos a una altura única.

La referencia declara estilos fluidos y variantes por anchura. Las medidas anteriores son puntos de control, no una orden de fijar esos tamaños para cualquier pantalla.

El SVG del logotipo de referencia tiene proporción de origen **1470:250**, aproximadamente `5.88:1`, y ajuste `contain`. Sus trazados explican por qué escribir el mismo nombre con Inter Display no produce una copia exacta. La identidad aprobada del portfolio es el nombre tipográfico «Quetzin Cuevas», definido en `site.name`; es contenido definitivo y no se etiqueta como logotipo pendiente. `site.logo` permite usar una imagen de marca opcional; si está vacío o la imagen falla, se muestra el nombre. Conservar la importancia visual, el contenedor y el efecto; adaptar el encaje a la longitud del nombre real. No presentar el nombre de Paul Michel como identidad del usuario.

Para que el nombre completo quepa en escritorio, desde 1200 px `WordmarkEffect.module.css` utiliza `clamp(70px, 14.8vw, 260px)` en el texto. Es un ajuste propio para esta identidad; los tamaños de móvil y tableta se conservan. Se aplica a la marca compartida en Home, About y el pie.

### 4.3 Espaciado y geometría

| Elemento | Escritorio | Tableta | Móvil |
|---|---|---|---|
| Margen lateral de contenido | Aproximadamente `5vw` | 30 px | 20 px |
| Separación entre tarjetas | 10 px | Se midieron juntas de 5 px en algunas variantes | 10 px en listado; 5 px en parejas de galería |
| Relleno de tarjeta | 30 px | 20 px | 20 px |
| Relleno de panel informativo | 40 px | 30 px | 30 px |
| Radio de imagen | 7 px | 7 px | 7 px |
| Radio de etiquetas | 100 px | Igual | Igual |
| Cabecera | 30 px arriba, 10 abajo | Igual | 15 px arriba y abajo |

El contenido es fluido. A 1440 px, el contenedor observado mide aproximadamente **1284 px**, con inicio alrededor de **72 px**; la diferencia restante incluye la barra del navegador. No interpretar los anchos de diseño internos de Framer como un `max-width` rígido.

## 5. Componentes compartidos

### 5.1 Cabecera

Tres zonas: marca pequeña a la izquierda, navegación central y contacto a la derecha. En escritorio, Home, Work(06) y About están en una fila. En móvil, esos tres enlaces se apilan verticalmente en el centro, mientras marca y contacto permanecen a los lados. **No hay menú hamburguesa en la variante observada.**

La cabecera forma parte del flujo normal; no se observó una cabecera fija al hacer scroll. El contacto utiliza `mailto:paul@michel.com`.

### 5.2 Tarjeta de proyecto

- Imagen cuadrada, `object-fit: cover`, encuadre centrado.
- Enlace que ocupa toda la tarjeta.
- Nombre blanco arriba a la izquierda; círculo translúcido con flecha diagonal arriba a la derecha.
- Categorías en cápsulas translúcidas en la zona inferior izquierda.
- Nombre y flecha tienen dos capas internas para estados animados.
- Capa visual deformable y capa semántica de enlace/texto diferenciadas.

No convertir la imagen deformada en el único elemento interactivo: el enlace debe seguir existiendo y conservar su área de activación.

### 5.3 Panel oscuro

Superficie casi negra, radio pequeño, etiquetas monoespaciadas grises y texto blanco atenuado. Algunas superficies participan en la deformación visual. Los textos conservan legibilidad sobre la superficie.

### 5.4 Pie

Primera franja: redes y menú a la izquierda, datos de contacto hacia la derecha. Segunda franja: logotipo SVG grande. Franja final: acceso a la plantilla, retorno al inicio y año.

En móvil, redes y menú quedan en dos columnas y contacto baja a una fila posterior. La franja final también se reorganiza; conservar su orden y no forzar la fila de escritorio.

Se observaron enlaces de correo y teléfono (`tel:+18376528800`). El botón de retorno al inicio fue probado y devuelve la página a `scrollY = 0` con desplazamiento animado.

## 6. Home

Orden visual:

1. Cabecera.
2. SVG del nombre a todo el ancho del contenedor.
3. Introducción en dos extremos: perfil profesional a la izquierda y enfoque de trabajo a la derecha. Hay palabras negras dentro de texto gris; no aplicar un único color a todo el párrafo.
4. Cuatro tarjetas, dos columnas y dos filas en escritorio.
5. Panel oscuro: descripción a la izquierda; servicios e industrias a la derecha; anillo de marcas debajo; enlace hacia About.
6. Pie común.

En móvil, las dos introducciones se unen en un bloque centrado de unos **320 px** de ancho máximo. Entre el logotipo y la introducción aparece un vacío deliberado de aproximadamente **150 px**. A 390 px, el logotipo empieza alrededor de `y=106`, la introducción en `y=314` y la primera tarjeta en `y=415`, según el viewport inspeccionado.

Las tarjetas se apilan en una columna. En el panel oscuro, la descripción pasa arriba y los servicios/industrias quedan debajo. Mantener el anillo centrado y dentro de su espacio reservado.

## 7. Work

Cabecera editorial con título grande de dos líneas a la izquierda, descripción corta debajo y rueda de fotografías a la derecha. La rueda utiliza **diez imágenes**, distintas de las seis portadas del catálogo; no sustituirla por una rotación de las seis tarjetas sin revisar el inventario.

Debajo se muestra la cuadrícula de seis proyectos, en el orden indicado en la sección 3. No se observaron filtros, buscador, paginación ni selector de categorías.

En móvil, se invierte la composición superior: **rueda primero, título centrado después, descripción y catálogo debajo**. En la medida de 390 px, la rueda ocupa unos 210 px de alto y la primera tarjeta comienza cerca de `y=531`.

## 8. About

Comparte cabecera y logotipo con Home, pero cambia el texto introductorio. La siguiente zona muestra un panel biográfico a la izquierda y un retrato a la derecha. Aunque el archivo del retrato es cuadrado, en la muestra de escritorio se recorta dentro de una columna vertical de aproximadamente **637 × 997 px**, igualada a la altura del panel. El panel contiene dos párrafos y un botón de CV situado abajo.

Después aparece una fotografía ancha de arquitectura urbana, aproximadamente en proporción 2:1. Le sigue el panel oscuro de experiencia, servicios e industrias, con el mismo anillo de marcas y un enlace hacia Work.

La experiencia consta de cinco puestos, ordenados del más reciente al más antiguo, con fechas desde 2018 hasta el presente. Los servicios y las industrias coinciden con los de Home.

En móvil se coloca **el retrato antes de la biografía** y su contenedor pasa a ser cuadrado. Luego siguen la fotografía ancha y el panel de experiencia. Es un cambio de orden real, no simplemente reducir las columnas.

## 9. Ficha de proyecto

Composición compartida:

1. Cabecera.
2. Título grande centrado.
3. Imagen principal ancha, contenedor aproximadamente 16:9.
4. Panel oscuro de resumen: etiqueta a la izquierda, dos párrafos y metadatos a la derecha.
5. Tabla de cliente, servicios y año; botón hacia el sitio del proyecto.
6. Dos imágenes cuadradas en paralelo y posteriores imágenes anchas según el proyecto.
7. Dos proyectos relacionados.
8. Pie común.

En móvil, resumen y metadatos se apilan. La pareja de imágenes también se apila y, en la ficha inspeccionada de Beyond the Screen, la columna derecha de escritorio aparece antes que la izquierda. Modelar el orden móvil explícitamente; no confiar en el orden de un array sin comprobarlo.

| Proyecto | Imágenes de contenido, incluida la principal | Relacionados observados |
|---|---:|---|
| Syndicate | 5 | Beyond the Screen, Machine's Children |
| Beyond the Screen | 5 | Syndicate, Machine's Children |
| Machine's Children | 5 | Syndicate, Beyond the Screen |
| Medium Scene | 4 | Syndicate, Beyond the Screen |
| Kaleidoscope | 4 | Syndicate, Beyond the Screen |
| Camera RX | 5 | Syndicate, Beyond the Screen |

Los recuentos representan apariciones: algunas rutas repiten una misma imagen. La galería no debe deduplicarlas automáticamente.

## 10. Comportamiento adaptable

Los límites observados en los estilos publicados son:

| Variante | Intervalo |
|---|---|
| Móvil | Menos de 810 px |
| Tableta | Desde 810 px hasta menos de 1200 px |
| Escritorio | Desde 1200 px |

| Parte | Escritorio / tableta | Móvil |
|---|---|---|
| Navegación central | Fila | Tres enlaces apilados |
| Introducción Home/About | Dos extremos | Bloque centrado |
| Cuadrícula | Dos columnas | Una columna |
| Hero de Work | Texto y rueda en paralelo | Rueda encima del texto |
| Biografía | Texto antes del retrato | Retrato antes del texto |
| Resumen de proyecto | Dos columnas | Una columna |
| Galería por parejas | Dos imágenes | Imágenes apiladas; revisar inversión |
| Pie | Contacto hacia la derecha | Contacto debajo |

Para la aceptación posterior, revisar también 360, 768, 809/810, 1199/1200 y 1920 px. Esos tamaños adicionales son pruebas propuestas; no se afirma que se hayan inspeccionado ahora.

## 11. Inventario de animaciones e interacciones

Esta tabla incluye los efectos detectados y los puntos que deberán cerrarse al reproducirlos. La existencia de un efecto y la precisión de sus tiempos son comprobaciones distintas.

| ID | Elemento / activador | Comportamiento y evidencia | Especificación para React | Certeza |
|---|---|---|---|---|
| M01 | Entrada de página | En las capturas iniciales aparecen estados intermedios antes del contenido estable; hay elementos con identificadores de aparición | Orquestar entradas por bloques sin cambiar su espacio reservado; medir orden, desplazamiento y opacidad | Aparición observada; tiempos pendientes |
| M02 | Enlaces de navegación, pie y CTA / puntero | Dos juegos de letras dentro de una máscara. La segunda línea parte en `translateY(110%)`. Se midieron letras de Work con desplazamientos diferentes durante la interacción | Sustitución vertical por caracteres, con desfase; conservar un solo nombre accesible | Estructura y movimiento confirmados |
| M03 | Nombre de tarjeta / hover | Dos títulos superpuestos en la referencia; uno visible y otro inicialmente con opacidad 0 | Retirado por el usuario el 25 de octubre: un título estático, sin duplicados ni animación | La observación corresponde a la referencia; retirada aprobada |
| M04 | Flecha de tarjeta / hover | Dos flechas dentro de círculo de cristal en la referencia; segunda con opacidad 0 | Retirado por el usuario el 25 de octubre: un SVG estático dentro del círculo | La observación corresponde a la referencia; retirada aprobada |
| M05 | Imágenes y paneles / scroll y posición en pantalla | Los bordes se curvan hacia fuera; se observó un lienzo compartido superpuesto y elementos de reserva debajo | Prueba WebGL en las cuatro tarjetas de Home/Work y, desde el 27 de octubre, el fondo completo del panel de Home; respaldo HTML/CSS | Deformación y canvas confirmados en la referencia; fórmula pendiente |
| M06 | Logotipo grande | SVG de base y lienzo adicional en Home, About y pie; el lienzo puede exceder 28 px el contenedor | Componente aislado de efecto sobre la marca aprobada: nombre tipográfico o SVG opcional, preservando el texto o imagen de respaldo | Capas de la referencia confirmadas; respuesta exacta al puntero pendiente |
| M07 | Marcas / tiempo en la referencia | Diez rótulos: cinco marcas repetidas. Anillo con giro continuo en Y, perspectiva e inclinación | Sustituido por Circular Carousel de React Bits con fotos de proyectos en Home y About, sin botones, nombres ni contador visibles; reserva de espacio, pausa por teclado y movimiento reducido | La observación describe el original; la sustitución fue solicitada por el usuario |
| M08 | Rueda de imágenes de Work / tiempo | Diez planos con separaciones de 36°, giro común sobre X e inclinación global sobre Y | CSS 3D; imágenes reales; contenedor adaptable; no es un carrusel horizontal | Giro y estructura confirmados |
| M09 | Scroll general / rueda y retorno al inicio | Desplazamiento amortiguado; clases y estilos de Lenis presentes; retorno al inicio probado | Un solo controlador de scroll y sincronización con efectos; restauración por ruta | Observado; configuración exacta pendiente |
| M10 | Cambio de ruta | Cambia la pantalla y se reproducen estados de entrada | Gestionar scroll, montaje y limpieza; verificar atrás/adelante | Navegación confirmada; no se acreditó una transición compartida entre imágenes |

No se observaron vídeos con reproducción automática, un cursor personalizado, una pantalla de carga porcentual ni una galería modal. No añadirlos para interpretar el estilo.

### 11.1 Anillo de marcas: medidas útiles

Esta subsección conserva las observaciones del original. La implementación actual usa Circular Carousel con fotos de proyectos, según el cambio de M07 indicado al principio del documento.

Marcas: Nike, Google, Chanel, Netflix y Framer, repetidas dos veces. Los diez rótulos se distribuyen en pasos de **36°**. Se observaron `preserve-3d` y caras posteriores visibles, por lo que algunos textos se leen invertidos en la parte posterior del anillo.

En una muestra de escritorio: perspectiva ≈ **929 px**, radio ≈ **283 px**, inclinación Z de **15°**, inclinación X de **−2°** y escala de conjunto ≈ **1.17**. Son valores de esa instancia y tamaño, no constantes para todas las pantallas. El ángulo Y cambia con el tiempo; no copiar el ángulo de un fotograma como posición fija.

### 11.2 Rueda de Work: medidas útiles

Diez planos en pasos de **36°**, rotación común sobre X y orientación global Y de **−30°**. Las fotografías tienen radio de **7 px**, opacidad de **.95**, ajuste `cover` y caras posteriores visibles. En la muestra de 1024 px, los planos medían aproximadamente **111 × 131 px** y la perspectiva del contenedor era de **1756 px**. La escala se adapta al espacio disponible.

### 11.3 Deformación de imágenes y superficies

Se observó un canvas compartido con `pointer-events: none` y nivel visual 5; el contenido informativo utiliza capas superiores. Algunas imágenes DOM quedan transparentes cuando el renderizador está activo y sirven de respaldo cuando se desactiva.

Esto exige tres responsabilidades separadas: geometría de diseño, representación visual deformada e interacción/accesibilidad. La biblioteca de animación puede controlar valores, pero **no genera por sí sola la deformación gráfica**.

La presencia de canvas no basta para afirmar si el motor original usa Canvas 2D, WebGL o una combinación. Esta sección documenta la referencia. La prueba actual de M05 utiliza Three.js y un shader de ensanchamiento lateral sobre cuatro tarjetas en cada listado de Home/Work y el fondo completo del panel de Home; su geometría y tiempos son propuestos y requieren calibración visual.

### 11.4 Valores iniciales de calibración — propuestos, no medidos

| Efecto | Punto de partida propuesto | Cómo validarlo |
|---|---|---|
| Sustitución de letras | 350–550 ms; desfase de 15–30 ms por carácter | Comparar inicio, cruce y asentamiento con la referencia |
| Entrada de bloques | 500–800 ms; desfase de 60–100 ms | Revisar cabecera, título, texto e imágenes por separado |
| Intercambio de título/flecha | 250–450 ms | Confirmar primero la dirección exacta del original |
| Giro de marcas/rueda | Medir un ciclo completo antes de fijar segundos por vuelta | Comparar orientación a tiempos equivalentes |
| Deformación | Medir amplitud y recuperación con scroll lento, rápido e invertido | Comparar contornos y encuadre de la imagen |

Estos rangos sirven para preparar la calibración. No constituyen una promesa de igualdad temporal.

### 11.5 Movimiento reducido y rendimiento

Propuesta para la réplica: con `prefers-reduced-motion`, mostrar contenido inmediatamente, detener giros, desactivar deformación y usar scroll sin amortiguación. El comportamiento exacto de esa preferencia en la referencia no se verificó.

Pausar efectos continuos fuera de pantalla y cuando la pestaña no esté visible; limpiar observadores, eventos y bucles al cambiar de ruta. Mantener el fotograma inicial compatible con el HTML prerenderizado. Evitar actualizar estado React en cada fotograma: los valores del motor se mantienen en referencias o en su propio sistema de animación.

## 12. Recursos para una réplica fiel

El archivo [recursos-referencia.json](./recursos-referencia.json) registra **43 URL únicas de imágenes/SVG y 4 archivos de fuente observados**, con las páginas y posiciones donde aparecen. Es un inventario, no una descarga de los originales. Permite distinguir portadas, galerías, retrato, imagen urbana y diez fotografías de la rueda.

| Recurso esencial | Referencia |
|---|---|
| Logotipo SVG | [SVG original](https://framerusercontent.com/images/BvIp3bvyQpQSUBO45BgwKvTTijA.svg?width=1470&height=250) |
| Portada de Syndicate | [Imagen](https://framerusercontent.com/images/HFEtC0Ng1NLdpc45Uvcv0kCPKGQ.jpg?width=1088&height=1088) |
| Portada de Beyond the Screen | [Imagen](https://framerusercontent.com/images/JJXynqD7Kh3XAP55Y9DTirhNY.jpg?width=1120&height=1120) |
| Portada de Machine's Children | [Imagen](https://framerusercontent.com/images/Sg5SO1KEm7VA3PMqBHBvCM6o3TQ.jpg?width=1120&height=1120) |
| Portada de Medium Scene | [Imagen](https://framerusercontent.com/images/RrKtmzo9tPsNkWpquMCtcXD3nQ.jpg?width=1120&height=1120) |
| Portada de Kaleidoscope | [Imagen](https://framerusercontent.com/images/2iUWkza2thCya1uYFkzJQqJ8M.jpg?width=1920&height=953) |
| Portada de Camera RX | [Imagen](https://framerusercontent.com/images/T2KPDN5PlS9ko3c76rAuN2EBY0.jpg?width=1120&height=1120) |
| Retrato de About | [Imagen](https://framerusercontent.com/images/9vM47sKbE82jG2J1p7i2zA8yjo4.jpg?width=715&height=715) |
| Arquitectura de About | [Imagen](https://framerusercontent.com/images/jcHVtB50v47Mv7uDrqMx0jHR6o.jpg?width=1920&height=953) |

Las tres fuentes Inter Display observadas corresponden a pesos 400, 500 y 600. La cuarta fuente corresponde a IBM Plex Mono. En una implementación aprobada, conviene alojar los recursos localmente, conservar sus proporciones, generar tamaños adecuados y evitar depender de enlaces remotos para el renderizado gráfico.

Reservar dimensiones antes de cargar las imágenes. Priorizar la imagen principal visible y cargar las galerías inferiores de forma diferida. Ajustar resolución a la pantalla sin degradar el detalle perceptible de la referencia.

## 13. Particularidades del original y adaptación al contenido propio

- En Camera RX, el valor de cliente es **Resonance**. Es una particularidad de la referencia; el portfolio personal utilizará un campo independiente para su cliente real.
- Las redes sociales, el botón de CV y los botones de sitio del proyecto apuntan al mismo enlace de Framer: `https://framer.link/CxdtHWB`. No se verificaron sus destinos finales ni se descargó un CV.
- El acceso comercial a la plantilla apunta a `https://framer.link/1b1OrNz`.
- Aparece la insignia flotante de Framer. La propuesta aprobada contempla omitirla junto con los enlaces comerciales de la plantilla, conservando la composición del pie y adaptándola al contenido propio.
- Hay textos alternativos de imágenes que no corresponden a la fotografía mostrada. Mejorarlos sería una decisión semántica, sin necesidad de alterar el diseño visible.
- El texto profesional de portada y algunos puestos de la biografía no son completamente equivalentes. Se sustituirán por los datos del usuario; mientras falten, usar etiquetas provisionales explícitas, sin inventar experiencia profesional.

Los destinos originales de correo, teléfono, CV y redes quedan documentados como referencia. En la versión personal, los campos sin completar no deben activar enlaces hacia Paul Michel ni hacia la plantilla.

## 14. Arquitectura aprobada y alternativas evaluadas

La base aprobada, actualizada según la última indicación del usuario, es: JavaScript, React, Vite y pnpm, con React Router para el prerenderizado, CSS Modules, datos JSON locales y animación aislada con GSAP/Lenis. Las tablas conservan la comparación de alternativas; la opción elegida se identifica debajo. El alcance comprende las siete páginas y el contenido propio.

### 14.1 Renderizado y publicación

| Opción | Qué significa | Ventajas para este sitio | Coste / límite | Cuándo la elegiría |
|---|---|---|---|---|
| A. SPA estática con React Router | El navegador genera las páginas a partir de JavaScript | Configuración inicial sencilla; navegación fluida; alojamiento estático | Requiere fallback de rutas; HTML inicial poco específico por proyecto; metadatos sociales necesitan atención | Demo o portfolio donde SEO y enlaces compartidos no sean prioritarios |
| B. Rutas prerenderizadas con React Router en modo framework y Vite | Se genera HTML para cada ruta al construir; React activa la interacción después | Contenido y metadatos por URL desde la respuesta inicial; alojamiento estático; buena base para portfolio público | Configuración adicional; separar APIs de navegador del render inicial; reconstruir al cambiar contenido | Portfolio público terminado, con páginas de proyecto compartibles |
| C. Renderizado en servidor | Un servidor genera la respuesta en cada petición | Útil con datos muy dinámicos, personalización o funciones privadas | Más infraestructura y mantenimiento que el sitio observado requiere | Sólo si aparecen requisitos que justifiquen un servidor |

React Router documenta renderizado cliente, servidor y prerenderizado; su modo framework se integra mediante Vite. Véanse [estrategias de renderizado](https://reactrouter.com/start/framework/rendering) y [modos de React Router](https://reactrouter.com/start/modes). Vite permite publicar una compilación estática; `vite preview` es una herramienta de comprobación local. Véase [publicación con Vite](https://vite.dev/guide/static-deploy.html).

**Opción aprobada: B.** Se generará HTML por ruta al construir y se mantendrá la interacción en React. Los cambios de contenido o diseño se incorporarán mediante una nueva compilación y publicación. La capacidad de modificar el portfolio dependerá de la separación entre contenido, componentes y efectos; el prerenderizado no exige que su diseño sea definitivo.

### 14.2 Contenido: decisión independiente del renderizado

| Opción | Resultado | Recomendación condicionada |
|---|---|---|
| Datos locales con validación | Proyectos, biografía, enlaces y recursos en archivos del repositorio | Adecuado para cuatro proyectos y cambios ocasionales gestionados por desarrollo |
| CMS externo | Editor para actualizar proyectos sin modificar código | Adecuado si tú u otra persona publicaréis contenido con frecuencia |

Un CMS puede combinarse con A o B; no obliga a renderizar en servidor. Añadirlo desde el principio sólo tiene sentido si resuelve una necesidad editorial real.

Se utilizarán **archivos JSON locales con validaciones escritas en JavaScript**, sin CMS, base de datos ni servidor de aplicación en esta etapa. Serán editables con un editor de texto; no equivalen a un panel visual. El contenido se leerá desde un punto común para poder cambiar su procedencia más adelante si aparece una necesidad nueva. La validación comprobará campos obligatorios, slugs duplicados y referencias a proyectos o imágenes inexistentes antes de generar las páginas; admitirá los espacios reservados previstos para contenido pendiente.

### 14.3 Animación

| Opción | Capacidad | Implicación para la copia |
|---|---|---|
| CSS + Motion + módulo gráfico propio | Entradas y estados declarativos; valores de scroll; deformación en componente separado | Viable, especialmente si el equipo ya trabaja con Motion |
| CSS + GSAP/ScrollTrigger + Lenis + módulo gráfico propio | Control de secuencias, sincronización con scroll y valores del renderizador | Opción aprobada para calibrar con precisión el movimiento observado |
| CSS y efectos simples | Menor complejidad inicial | No cubre por sí sola la deformación gráfica que define esta referencia |

Motion ofrece efectos ligados al scroll y activados al entrar en pantalla. GSAP permite controlar secuencias y valores de DOM, canvas y otros renderizadores. Lenis resuelve el scroll suavizado y documenta su sincronización con GSAP. Fuentes: [Motion](https://motion.dev/docs/react-scroll-animations), [GSAP con React](https://gsap.com/resources/React/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) y [Lenis](https://github.com/darkroomengineering/lenis).

El anillo y la rueda observados pueden construirse con CSS 3D. No se ha demostrado que necesiten una escena completa con Three.js. La muestra aprobada para M05 son las cuatro tarjetas de Home/Work y el fondo completo del panel de Home: usa Three.js 0.180.0, cargado de forma diferida, y un shader personalizado. No animar la misma propiedad simultáneamente con dos motores.

### 14.4 Organización y estilos

Aplicación modular por páginas y componentes, con datos separados y un módulo de movimiento independiente. Para este tamaño, no hace falta introducir una arquitectura empresarial de múltiples capas, un gestor de estado global ni un backend por defecto.

Se utilizan JavaScript y CSS Modules con variables CSS. Las rutas seleccionan datos, declaran metadatos y componen secciones explícitas. Cada sección mantiene sus estilos junto al componente; los colores, espaciados y escalas compartidos están centralizados. Los nombres de clase siguen BEM dentro de CSS Modules, según las convenciones de la sección 15.

### 14.5 Gestor de paquetes

**pnpm** gestionará las dependencias y ejecutará las tareas del proyecto. Se conservará `pnpm-lock.yaml` en el repositorio para registrar las versiones resueltas. Al crear la aplicación, se fijará la versión exacta de pnpm en el campo `packageManager` de `package.json` y se documentará una versión de Node.js compatible con las dependencias elegidas. La misma versión de pnpm se utilizará en desarrollo y en publicación.

## 15. Arquitectura del proyecto

```text
portfolio/
├── app/
│   ├── root.jsx                     Documento HTML, metadatos y límites de error
│   ├── routes.js                    Mapa de URL y módulos de página
│   ├── routes/
│   │   ├── home.jsx                  Inicio
│   │   ├── work.jsx                  Catálogo de cuatro proyectos
│   │   ├── about.jsx                 Biografía
│   │   ├── project.jsx               Plantilla de las cuatro fichas
│   │   └── not-found.jsx             Estado de página no encontrada
│   ├── components/
│   │   ├── layout/                   SiteLayout, PageLayout, Header, Footer
│   │   ├── sections/
│   │   │   ├── home/                 HomeHero, FeaturedProjectsSection, AboutSection
│   │   │   ├── work/                 WorkHero
│   │   │   ├── about/                AboutHero, BiographySection, ArchitectureSection,
│   │   │   │                         ExperienceSection
│   │   │   ├── project/              ProjectHero, ProjectOverview, ProjectGallerySection,
│   │   │   │                         RelatedProjectsSection
│   │   │   └── shared/               ProfileHero, ProjectsSection
│   │   ├── portfolio/                ProjectCard, ProjectGrid, ProjectGallery
│   │   ├── editorial/                InfoPanel
│   │   └── ui/                       Media, ErrorState, ArrowBadge
│   ├── motion/
│   │   ├── MotionProvider.jsx        Lenis, ticker compartido y preferencias de movimiento
│   │   ├── ScrollImageContext.js    Registro de imágenes y fondos participantes
│   │   ├── useScrollImages.js       Integración React y carga diferida de M05
│   │   ├── scrollCurveEngine.js     Renderizador compartido y respaldo HTML
│   │   ├── scrollCurveShaders.js    Curvatura y recorte de texturas/fondos opacos
│   │   ├── scrollCurveMath.js       Encuadres y parámetros de movimiento
│   │   ├── useReducedMotion.js      Preferencia de movimiento reactiva
│   │   ├── AnimatedLink.jsx          Sustitución de letras
│   │   ├── Reveal.jsx                Aparición de bloques
│   │   ├── CircularCarousel.jsx      Carrusel 3D de fotos, adaptado de React Bits
│   │   ├── circularCarouselMotion.js Avance, inercia y detención; independiente del DOM
│   │   ├── circularCarouselMotion.test.js Pausa, ciclo, selección y movimiento reducido
│   │   ├── FoldText.jsx              Texto plegado de Home y respaldo accesible
│   │   ├── FoldText.module.css       Estilos locales de FoldText
│   │   ├── foldTextMotion.js         Motor GSAP diferido y limpieza de FoldText
│   │   ├── WordmarkEffect.jsx        Marca, FoldText de Home y efecto compartido
│   │   └── motionConfig.js           Parámetros de las animaciones activas
│   ├── content/
│   │   ├── site.json                Perfil, biografía, experiencia y enlaces
│   │   ├── projects.json            Cuatro proyectos, galerías y relacionados
│   │   ├── media.json               Rutas/URL, texto alternativo, dimensiones y encuadre
│   │   ├── gallery.js               Apariciones, proporciones y orden móvil; límite de diez
│   │   ├── MEDIA-GUIDE.md           Guía de carpetas e identificadores de imágenes
│   │   ├── validate.js              Validación de campos y referencias
│   │   ├── validate.test.js         Casos válidos y errores de contenido
│   │   └── index.js                 Acceso y comprobación de contenido
│   └── styles/
│       ├── tokens.css               Colores, espaciados, tipografía y radios
│       ├── fonts.css                Declaraciones de fuentes
│       └── globals.css              Base, utilidades u-, foco y movimiento reducido
├── public/
│   ├── favicon.svg
│   ├── fonts/                      Inter Display 500 latino, con licencia en licenses/
│   └── images/                     Fotografías propias; rutas editables en media.json
├── scripts/
│   ├── format-html.js               Formato del HTML generado sin alterar el DOM
│   ├── format-html.test.js          Conservación de texto, scripts y marcas de React
│   └── check-pages.js               Semántica, metadatos y enlaces de las siete páginas
├── react-router.config.js           Prerenderizado de las siete rutas
├── vite.config.js                   Integración de Vite con React Router
├── jsconfig.json                    Configuración del editor para JavaScript
├── prettier.config.js               Formato compartido de los archivos fuente
├── .prettierignore                  Archivos generados y recursos excluidos del formato
├── package.json                     Dependencias y tareas del proyecto
├── pnpm-lock.yaml                   Versiones resueltas de dependencias
└── README.md                        Diseño, instalación y guía de edición
```

Este árbol refleja la organización implementada; omite los archivos CSS adyacentes y algunos archivos de configuración para facilitar la lectura. `app/` sigue las convenciones de React Router en modo framework. Cada componente con estilos propios tiene su archivo `Nombre.module.css`; las rutas no concentran estilos de varias páginas en un archivo común. `public/fonts/` contiene Inter Display 500 para las tarjetas; `public/documents/` se creará cuando haya documentos propios que lo requieran. Referencia: [configuración de rutas de React Router](https://reactrouter.com/start/framework/routing).

Los componentes y las páginas usarán JSX; la lógica y la configuración usarán módulos JavaScript con `import` y `export`. `package.json` declarará `"type": "module"`. `jsconfig.json` servirá al editor y no añadirá una etapa de comprobación de tipos. React Router admite archivos de configuración JavaScript; su [resolución de archivos de entrada](https://github.com/remix-run/react-router/blob/main/packages/react-router-dev/config/config.ts) contempla las extensiones `.js` y `.jsx`.

### Instalación y comandos con pnpm

Estos comandos están disponibles desde la raíz del repositorio, con Node.js y pnpm instalados:

| Acción | Comando | Resultado |
|---|---|---|
| Instalar dependencias | `pnpm install` | Instala los paquetes y crea o actualiza el archivo de versiones |
| Iniciar desarrollo | `pnpm dev` | Ejecuta `react-router dev`, integrado con Vite |
| Formatear los archivos fuente | `pnpm format` | Aplica sangría y saltos de línea consistentes |
| Comprobar el formato | `pnpm format:check` | Revisa los archivos fuente sin modificarlos |
| Generar la versión publicable | `pnpm build` | Prepara imágenes, prerenderiza siete rutas y 404, genera SEO, compresión y salida estática de Vercel |
| Verificar el HTML ya compilado | `pnpm check:pages` | Comprueba regiones, encabezados, identificadores, metadatos y tarjetas |
| Verificar el proyecto completo | `pnpm check` | Comprueba formato, pruebas, compilación, HTML y enlaces/recursos |
| Instalar en integración continua | `pnpm install --frozen-lockfile` | Instala respetando el archivo de versiones y falla si requiere cambios |

Las tareas principales de `package.json` son:

```json
{
  "type": "module",
  "scripts": {
    "dev": "pnpm media:prepare && react-router dev",
    "build": "pnpm media:prepare && react-router build && node scripts/generate-seo.js && pnpm format:html && node scripts/compress-static.js && node scripts/build-vercel.js",
    "preview": "node scripts/preview.js",
    "format:html": "node scripts/format-html.js",
    "check:pages": "node scripts/check-pages.js",
    "check:links": "node scripts/check-links.js",
    "check": "pnpm format:check && pnpm test && pnpm build && pnpm check:pages && pnpm check:links"
  }
}
```

Es un fragmento de configuración, no un `package.json` completo. La compilación se realizará con Vite a través de React Router, conservando el prerenderizado acordado. Referencias: [inicio de React Router](https://reactrouter.com/tutorials/quickstart) e [instalación con pnpm](https://pnpm.io/cli/install).

### Siete páginas a partir de cuatro plantillas

| URL | Módulo | Fuente de contenido |
|---|---|---|
| `/` | `routes/home.jsx` | Perfil y cuatro proyectos destacados |
| `/work` | `routes/work.jsx` | Los cuatro proyectos y las diez imágenes de la rueda |
| `/about` | `routes/about.jsx` | Biografía, experiencia, servicios y recursos personales |
| `/projects/modelaje`, `/projects/paisajes`, `/projects/producto`, `/projects/musica` | `routes/project.jsx`, mediante `/projects/:slug` | El registro que corresponda al slug |

Los slugs de proyecto corresponden a sus nombres y se editan en los datos. `legacySlugs` conserva sus URL anteriores. Vercel y la previsualización redirigen con HTTP 308; `Navigate` mantiene el respaldo durante la navegación cliente y el desarrollo. La lista de rutas que se prerenderiza se derivará de esos registros, junto con las tres rutas principales. El estado 404 es auxiliar y no añade una octava página editorial. Un slug desconocido debe mostrar ese estado, sin reutilizar por defecto el primer proyecto.

### Layout, secciones y semántica

`root.jsx` define el documento HTML y delega el marco compartido a `SiteLayout`: proveedores de movimiento, `Header`, un único `main` y `Footer`. `PageLayout` aplica el margen lateral del contenido; en las fichas utiliza `article`. La navegación principal y la del pie usan `nav` con nombre accesible.

| Plantilla | Secciones en orden |
|---|---|
| Inicio | `HomeHero`, `FeaturedProjectsSection`, `AboutSection` |
| Work | `WorkHero`, `ProjectsSection` |
| About | `AboutHero`, `BiographySection`, `ArchitectureSection`, `ExperienceSection` |
| Proyecto | `ProjectHero`, `ProjectOverview`, `ProjectGallerySection`, `RelatedProjectsSection` |

Cada página tiene un único `h1`. Las secciones editoriales usan `section` con un encabezado asociado mediante `aria-labelledby`; el hero de una ficha es el `header` de su `article`. Los encabezados que no forman parte de la composición visible usan `u-visually-hidden`, que los conserva disponibles para lectores de pantalla.

`HomeHero` y `AboutHero` reutilizan `ProfileHero`. Los listados destacados y de Work reutilizan `ProjectsSection`; las tarjetas y galerías permanecen en `portfolio/`. `InfoPanel` comparte la composición oscura, el Circular Carousel y el enlace; las secciones deciden su contenido por propiedades y, cuando corresponde, mediante `children`. Home y About obtienen las fotos mediante `getCarouselItems()`, que resuelve los ocho identificadores de `site.carousel` en `media.json`. Work reutiliza el mismo componente mediante `getWorkCarouselItems()` y sus ocho registros de `site.workCarousel`. Ambas colecciones son independientes entre sí y de las portadas. Las secciones no consultan los JSON ni deciden rutas de proyecto.

### Convención de clases: BEM con CSS Modules

- Un bloque representa un componente o sección: `.project-card`, `.work-hero`, `.site-header`.
- Sus elementos usan dos guiones bajos: `.project-card__title`, `.work-hero__description`.
- Las variantes y estados usan dos guiones: `.media--dark`, `.project-card--scroll-curve`, `.reveal--visible`. El modificador acompaña a la clase base.
- En JSX se accede con `styles["project-card__title"]`. CSS Modules conserva el aislamiento y añade un identificador al compilar; las clases generadas del navegador no se editan directamente.
- `globals.css` contiene reglas base y las utilidades `u-eyebrow`, `u-muted` y `u-visually-hidden`. Los ajustes específicos de una sección pertenecen a su módulo, y los valores compartidos a `tokens.css`.

Los componentes exponen propiedades para variantes visuales, como `tone` en `Media`, y `className` para su encaje en el padre. Evitar selectores que dependan de las clases internas o del orden de elementos de otro componente.

En las tarjetas, `ProjectCard.module.css` define el marco cuadrado, los radios y la presentación estática de título y flecha. `Media.module.css` hace que la imagen HTML cubra ese marco con `width: 100%`, `height: 100%`, `object-fit: cover` y el encuadre de `media.json`. `overflow: hidden` y los radios del contenedor recortan la imagen; en Home y Work, `scrollEffect="curve"` permite sustituir únicamente la presentación visual por el canvas compartido después de un fotograma válido; el HTML se conserva.

### Flujo de contenido y publicación

```text
Archivos JSON + recursos propios
               ↓
Acceso común al contenido y comprobación de referencias
               ↓
Módulos de ruta → secciones → componentes visuales con estilos locales
               ↓
Compilación: HTML y metadatos para cada una de las siete URL
               ↓
Alojamiento estático → React activa navegación y animaciones en el navegador
```

Editar contenido o diseño requerirá una nueva compilación para actualizar la versión publicada. Las páginas contienen texto e imágenes de respaldo desde el HTML inicial; los efectos se activan después. Esta división permite conservar contenido visible mientras se carga el módulo gráfico. Referencia: [prerenderizado de React Router](https://reactrouter.com/start/framework/rendering).

### Límites entre módulos

- **Contenido:** no importa componentes ni herramientas de animación. `index.js` expone la lectura de perfil, proyectos, destacados y recursos; utiliza `validate.js` para comprobar los datos antes de generar y publicar las páginas.
- **Rutas:** seleccionan los datos y componen la página. Una ficha nueva reutilizaría `project.jsx`; las cuatro previstas no requieren cuatro archivos de pantalla distintos.
- **Layout:** `SiteLayout` mantiene el marco compartido y los proveedores; `PageLayout` aplica el margen lateral sin introducir un segundo `main`.
- **Secciones:** expresan la composición y semántica de cada plantilla. Reciben los datos de la ruta y reutilizan piezas compartidas.
- **Componentes:** reciben datos y opciones de presentación. La tarjeta usa el mismo título y portada en Home, Work y proyectos relacionados.
- **Movimiento:** recibe elementos, recursos y parámetros; no contiene información personal ni búsquedas de proyectos. Las animaciones usan un ciclo coordinado y se limpian al desmontarse.
- **Efectos gráficos futuros:** si el usuario solicita uno, aislarlo del contenido y ejecutarlo sólo en el navegador, conservando el HTML inicial y el respaldo visual. M05 abarca los listados de Home/Work y el fondo completo del panel de Home, sin deformar textos, carruseles ni fotografías de otras páginas.
- **Estilos:** las reglas locales quedan junto a cada componente; los valores comunes viven en `tokens.css`. Los límites de pantalla conservan 810 y 1200 px.

La implementación actual confía la restauración de rutas a `ScrollRestoration` de React Router; `MotionProvider` integra Lenis y ScrollTrigger sin añadir una segunda restauración: después de los layout effects del router sincroniza Lenis con el scroll real para cancelar la inercia de la ruta anterior. `Media` muestra imágenes HTML y espacios reservados; sólo con `scrollEffect="curve"` registra la imagen en el motor compartido, sin crear bucles propios.

### Modelo de contenido

Cada proyecto necesita: identificador estable, `slug`, título, cliente, año, categorías, posición en catálogo, presencia en Home, portada, imagen principal, párrafos, bloques de galería, orden móvil, enlace externo, proyectos relacionados y metadatos sociales. Portadas y galerías referencian identificadores de `media.json`; los proyectos relacionados usan identificadores estables. Así, cambiar un título, una URL de imagen o un slug no exige copiar cambios en varias páginas.

Los bloques de galería distinguen **imagen ancha**, **pareja de imágenes** y **foto suelta** (`wide`, `pair`, `image`), con encuadre, proporción y orden por tamaño; se validan hasta diez apariciones por proyecto. `gallery.js` resuelve estas apariciones para la galería de columnas inspirada en Owen, descrita al inicio del documento. Evitar cuatro páginas copiadas manualmente: una plantilla de proyecto puede resolver las cuatro rutas sin borrar sus diferencias.

El módulo gráfico debe aceptar recursos y geometría desde los componentes; no debe conocer slugs ni textos editoriales. Si falla o no está habilitado, la imagen de respaldo debe conservar el mismo espacio y encuadre.

### Edición de textos e imágenes

La estructura permitirá cambiar contenido sin editar los componentes de pantalla:

| Cambio | Archivo de edición | Consecuencia |
|---|---|---|
| Nombre, biografía, contacto y redes | `site.json` | Se actualizan todas las zonas que comparten ese dato |
| Título, resumen, cliente, año y categorías de un proyecto | `projects.json` | Se actualizan tarjeta y ficha desde un mismo registro |
| Imagen, descripción o encuadre | `media.json` | Se actualizan sus apariciones por identificador |
| Colores, separación o escala tipográfica | `tokens.css` | Se modifica el sistema visual compartido |
| Velocidad o amplitud de un efecto | `motionConfig.js` | Se ajusta el efecto sin reescribir las páginas |

Ejemplo simplificado de un registro de imagen usado en la implementación:

```json
{
  "project01Cover": {
    "src": null,
    "alt": "",
    "position": "50% 50%"
  }
}
```

Al completar el contenido, `src` podrá ser una ruta local como `/images/projects/modelaje/portada.webp` o una URL HTTPS. Se recomienda la ruta local para los recursos definitivos. Los componentes mantienen la proporción correspondiente a cada uso: tarjeta cuadrada, imagen principal ancha o retrato adaptable.

Las rutas locales son URL desde la raíz del sitio: un archivo en `public/images/modelaje.webp` se configura como `"src": "/images/modelaje.webp"`. No se incluye `public/` ni se utilizan rutas relativas al archivo JSON, como `../../public/images/modelaje.webp`.

Si `src` está vacío o la imagen falla, se mostrará un espacio reservado con el mismo tamaño y una etiqueta discreta. No se dejarán iconos de imagen rota ni se colapsará la composición. Los cuatro proyectos tendrán registros provisionales para que sus cuatro páginas y los listados puedan revisarse desde el inicio.

Las imágenes remotas utilizadas como texturas necesitan acceso compatible con CORS. Si una URL puede mostrarse como imagen pero no puede usarse en el renderizador, la propuesta contempla mostrarla de forma normal, sin deformación, y señalarlo durante la revisión. Para garantizar el efecto, lo más fiable es alojar el archivo con el sitio.

También hay referencias editables para las ocho imágenes del carrusel de Work, el retrato, la fotografía ancha y el logotipo opcional. El Circular Carousel usa ocho recursos propios (`carousel01` a `carousel08`), ordenados mediante `site.carousel`, y las tarjetas utilizan `cover01` a `cover04`; los nombres provisionales de marcas se retiraron de `site.json`. No se necesita entregar todo ese contenido antes de desarrollar la estructura: los espacios reservados permiten avanzar, aunque la aceptación visual final debe hacerse con los recursos reales.

### Cómo podrá evolucionar la estructura

La cabecera, el pie, las tarjetas y las galerías se reutilizarán. Las cuatro fichas compartirán una plantilla con bloques de contenido configurables. Una nueva sección podrá incorporarse sin copiar una página completa; los ajustes de diseño se concentrarán en componentes y variables compartidas. El renderizador gráfico y el acceso a contenido permanecerán separados de las rutas. Esto facilita cambios posteriores sin prometer que cualquier ampliación futura carecerá de coste.

## 16. Plan de implementación con la arquitectura aprobada

1. Crear la base con JavaScript, React, Vite y React Router, gestionada con pnpm; preparar sus cuatro plantillas, el layout compartido y las siete rutas derivadas de los datos. La aprobación técnica ya fue recibida.
2. Preparar recursos locales, fuentes y datos; comprobar encuadres.
3. Construir primero las cuatro plantillas estáticas en los tres intervalos de pantalla.
4. Validar proporciones, tipografía, espacios y orden móvil contra las referencias.
5. Revisar la prueba M05 de Home/Work y el fondo completo del panel de Home en escritorio, tableta y móvil; calibrarla antes de extender el efecto a otras superficies.
6. Incorporar enlaces animados, rueda, Circular Carousel, entradas y scroll con parámetros centralizados.
7. Calibrar amplitudes, velocidades, tiempos y reversión; resolver el efecto del logotipo y los hovers pendientes.
8. Verificar navegación, acceso directo a rutas, foco, movimiento reducido, carga de recursos y rendimiento; publicar sólo cuando se solicite.

## 17. Criterios de aceptación de la futura réplica

- Las siete rutas acordadas existen y se pueden abrir directamente y recargar.
- Las fuentes, pesos, geometría, jerarquía y animaciones siguen la referencia; la identidad, los textos y los recursos corresponden al usuario o están identificados como provisionales.
- Se pueden reemplazar textos e imágenes desde los archivos de contenido propuestos, sin editar las plantillas de pantalla.
- Los recursos ausentes conservan sus espacios, y los enlaces sin configurar no dirigen a contactos ni sitios del autor de la referencia.
- Las cuadrículas y los cambios de orden en móvil coinciden con el original.
- Los títulos largos no se recortan y no aparece desplazamiento horizontal accidental.
- Se han comparado fotogramas equivalentes, incluyendo reposo, entrada, hover, scroll rápido, scroll inverso y retorno al inicio.
- Los títulos y las flechas de tarjeta permanecen estáticos según la retirada de M03/M04; se ha cerrado el pendiente M06 y calibrado los tiempos de los demás efectos.
- El giro de la rueda y del Circular Carousel se revisa por ciclo, junto con arrastre, pausa y navegación por teclado; una captura estática no acredita el movimiento.
- Canvas, texto y enlaces se mantienen alineados al cargar fuentes, redimensionar y navegar.
- El contenido permanece disponible si se reduce el movimiento o falla el renderizador.
- No se multiplican los bucles de animación al navegar varias veces entre páginas.
- Correo, teléfono y enlaces externos responden a la decisión de contenido acordada.
- Cada proyecto entrega título, descripción e imagen social propios en su HTML prerenderizado, cuando se haya completado ese contenido.

Estos criterios requieren verificación visual y de interacción con recursos reales; la compilación y las pruebas de datos por sí solas no acreditan una réplica exacta.

## 18. Referencias visuales guardadas

Las capturas documentan la página original durante la inspección. Algunas contienen un fotograma de deformación; no deben usarse como si fueran un estado de reposo universal. El navegador puede añadir espacio blanco exterior al capturar tamaños emulados; las medidas fiables son las de las tablas en píxeles CSS.

| Pantalla | Captura |
|---|---|
| Home, escritorio | [Ver](./referencias/home-desktop.png) |
| Home, panel inferior y pie | [Ver](./referencias/home-footer.png) |
| Home, móvil | [Ver](./referencias/home-mobile.png) |
| Work, escritorio | [Ver](./referencias/work-desktop.png) |
| Work, tableta | [Ver](./referencias/work-tablet.png) |
| Work, móvil | [Ver](./referencias/work-mobile.png) |
| About, escritorio | [Ver](./referencias/about-desktop.png) |
| About, móvil | [Ver](./referencias/about-mobile.png) |
| Proyecto, escritorio | [Ver](./referencias/project-desktop.png) |
| Proyecto con título largo, móvil | [Ver](./referencias/project-mobile.png) |

## 19. Registro de la arquitectura aprobada

Tras el ajuste de alcance solicitado por el usuario, la base técnica aprobada comprende un portfolio público en evolución, cuatro proyectos y siete páginas, con contenido propio, un anillo de ocho fotos independientes y espacios reservados para completarlo.

| Parte | Elección aprobada | Motivo para este caso |
|---|---|---|
| Base | JavaScript + React + Vite | Usar el lenguaje y las herramientas solicitados, con componentes JSX y lógica en JavaScript |
| Gestor de paquetes | pnpm, con `pnpm-lock.yaml` versionado | Mantener las dependencias y los comandos del proyecto consistentes |
| Rutas y renderizado | React Router en modo framework, con prerenderizado de las siete rutas y publicación estática | Entregar HTML por página y conservar navegación interactiva sin servidor de aplicación |
| Organización | Componentes reutilizables y una plantilla configurable para las cuatro fichas | Facilitar cambios de diseño sin repetir trabajo |
| Estilos | CSS Modules y variables CSS | Ajustar medidas con precisión y modificar valores compartidos |
| Contenido | Tres archivos JSON locales para perfil, proyectos y recursos | Sustituir textos, rutas de imagen y URL sin editar componentes |
| Animación | GSAP/ScrollTrigger, Lenis, CSS 3D y prueba M05 con Three.js en Home y Work | Conservar los demás efectos y calibrar la curvatura en las cuatro tarjetas de cada listado y el fondo del panel de Home |
| Contenido provisional | Cuatro registros y espacios reservados con proporciones estables | Construir y revisar las siete páginas antes de recibir los recursos definitivos |
| Identidad de plantilla | Omitir insignia y enlaces comerciales de Framer | Adecuar el portfolio a la identidad del usuario |

Esta arquitectura mantiene el contenido fácil de editar y concentra la complejidad gráfica en un módulo específico. Los nombres definitivos, imágenes, textos y dominio podrán incorporarse después; no es necesario decidirlos para preparar la estructura.

**Estado: primera implementación funcional con contenido provisional.** M05 está en prueba en las cuatro tarjetas de Home/Work y el fondo completo del panel de Home por indicación del usuario. La comparación visual y la calibración de los efectos activos siguen pendientes y no requieren volver a elegir la arquitectura general.

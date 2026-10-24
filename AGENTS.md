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
| Movimiento | GSAP/ScrollTrigger, Lenis y CSS 3D; M05 retirado temporalmente |

No introducir TypeScript, archivos `.ts` o `.tsx`, `tsconfig.json` ni tareas de `tsc`. `jsconfig.json` puede configurar el editor para JavaScript. Usar `"type": "module"` en `package.json`.

La arquitectura general ya está aprobada: avanzar con las decisiones locales necesarias para implementarla. Consultar al usuario antes de sustituir tecnologías principales, cambiar la estrategia de renderizado o ampliar el alcance funcional. M05 se retiró temporalmente por indicación del usuario: no reintroducir la deformación de imágenes y paneles al hacer scroll hasta que defina su sustitución. Si solicita un efecto gráfico nuevo, evaluar su implementación mediante la prueba técnica prevista en el README.

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
- Conservar la configuración individual de galerías: imagen ancha, pareja de imágenes, encuadre y orden móvil. No eliminar apariciones repetidas de una imagen automáticamente.
- Mantener visibles los espacios reservados cuando `src` esté vacío o un recurso falle. Reservar dimensiones y proporciones para evitar saltos de contenido.
- Aceptar rutas locales y URL HTTPS editables. Preferir recursos locales para la versión final. Si una imagen remota no permite su uso como textura por CORS, mantener la imagen HTML de respaldo y comunicar la limitación.
- Mantener inactivos u omitir los enlaces sin destino real. No dirigirlos a contactos del autor de la referencia ni a enlaces comerciales de su plantilla.
- Para slugs desconocidos, mostrar el estado 404. No devolver el primer proyecto como sustituto. Si cambia una URL ya publicada, contemplar su redirección.

## Fidelidad visual y adaptación

Tomar las medidas, colores, tipografías, proporciones y jerarquías del README como punto de partida. Centralizar los valores compartidos en `tokens.css`; conservar los ajustes particulares necesarios para cada composición.

Respetar los tres intervalos documentados: móvil por debajo de 810 px, tableta desde 810 px hasta menos de 1200 px y escritorio desde 1200 px. Comprobar especialmente el apilado de tarjetas, el carrusel sobre el título de Work, el retrato antes del texto en About y el orden de las parejas de imágenes en móvil.

La identidad del usuario sustituye a la de la referencia. El nombre tipográfico «Quetzin Cuevas», definido en `site.name`, es la marca aprobada del portfolio y no debe etiquetarse como logotipo pendiente. `site.logo` admite una imagen opcional; su ausencia no implica contenido pendiente. Conservar la función compositiva de la marca sin presentar el nombre tipográfico como una reproducción exacta del SVG de referencia.

No añadir efectos, secciones o comportamientos que no estén pedidos o documentados para reinterpretar el estilo. Revisar los títulos largos, el recorte de imágenes y el desplazamiento horizontal accidental.

## Animaciones obligatorias y puntos por verificar

Seguir el inventario de la sección 11 del README. Mantener estos identificadores en las notas de implementación y revisión para comprobar su cobertura:

| ID | Responsabilidad |
|---|---|
| M01 | Entradas de página por bloques, sin alterar el espacio reservado |
| M02 | Sustitución vertical de letras en enlaces, con desfase por carácter |
| M03 | Intercambio de capas del título de tarjeta; verificar trayectoria y reversión |
| M04 | Movimiento de las flechas de tarjeta; verificar recorrido sin desplazar el círculo |
| M05 | Retirado temporalmente por el usuario; imágenes HTML sin deformación y sustitución pendiente |
| M06 | Efecto sobre la marca tipográfica o el SVG opcional; verificar la respuesta al puntero |
| M07 | Circular Carousel de React Bits con ocho fotos independientes en Home y About; sustituye el anillo de marcas por petición del usuario |
| M08 | Circular Carousel reutilizado en el hero de Work con ocho fotos propias; sustituye la rueda de diez imágenes por petición del usuario |
| M09 | Scroll amortiguado, enlaces internos, retorno al inicio y restauración de posición |
| M10 | Navegación, entradas, montaje y limpieza al cambiar de ruta |

Los tiempos, curvas y fórmulas aún no medidos deben seguir identificados como provisionales. Comparar el movimiento con la referencia antes de afirmar fidelidad exacta. No sustituir la deformación por una simple escala o inclinación ni dar por confirmada una transición compartida entre imágenes.

M07 y M08 son desviaciones aprobadas de la referencia: mantener arrastre con inercia, ajuste y selección de tarjeta, teclado, foco visible y respaldo HTML. El usuario pidió retirar los botones, nombres y contador visibles; no reintroducirlos. Conservar los nombres accesibles y las instrucciones para lectores de pantalla, así como Espacio para pausar o reanudar y flechas e Inicio/Fin para navegar. Con movimiento reducido no girar automáticamente ni interpolar la navegación. Pausar el carrusel fuera de pantalla, con foco dentro o con la pestaña oculta. Este carrusel usa CSS 3D y no reactiva M05.

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
| Desarrollo | `pnpm dev` → `react-router dev` |
| Compilación y prerenderizado | `pnpm build` → `react-router build` |
| Instalación reproducible en integración continua | `pnpm install --frozen-lockfile` |
| Verificación del HTML ya compilado | `pnpm check:pages` |
| Formato, pruebas, compilación y HTML generado | `pnpm check` |
| Revisar compilación estática | `pnpm preview` (`sirv` con fallback propio) |

Fijar la versión exacta de pnpm mediante `packageManager` al inicializar el proyecto y documentar una versión compatible de Node.js. Usar pnpm para instalar, añadir o retirar dependencias; no generar archivos de bloqueo de otros gestores ni editar manualmente `pnpm-lock.yaml`.

Incorporar dependencias sólo cuando resuelvan una necesidad concreta. El prototipo Canvas 2D se eliminó al retirar M05; no reintroducirlo ni dar la deformación por calibrada. Actualizar el README cuando cambien los comandos o la estructura real.

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

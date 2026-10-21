# Portfolio personal — Diseño basado en Paul Michel, con JavaScript + React + Vite + pnpm

**Referencia:** [paul-michel.framer.website](https://paul-michel.framer.website/)  
**Inspección:** 21 de octubre de 2026  
**Estado:** arquitectura aprobada; primera implementación funcional con contenido provisional. La calibración visual y de animación está pendiente.

Este documento especifica la apariencia, composición adaptable, navegación, recursos y movimiento de la referencia para construir el portfolio con JavaScript, React y Vite, usando pnpm como gestor de paquetes. La base técnica descrita en las secciones 14, 15 y 19 ha sido aprobada y actualizada a petición del usuario. Las mediciones del sitio original siguen siendo la referencia para calibrar la implementación.

### Ejecutar y editar la implementación actual

Con Node.js 22 o posterior y pnpm 11.3.0: `pnpm install`, `pnpm dev` y abrir http://localhost:5173. `pnpm test` valida el modelo de contenido; `pnpm build` genera las nueve páginas en `build/client/`; `pnpm preview` sirve esa compilación en http://localhost:8080. `pnpm check` ejecuta pruebas y compilación. El alojamiento estático debe servir los HTML prerenderizados antes del fallback `__spa-fallback.html` para rutas no generadas; este fallback muestra 404 en el navegador, pero la respuesta HTTP de un servidor estático sin configuración específica puede ser 200.

Personaliza `app/content/site.json`, `projects.json` y `media.json`; coloca imágenes propias bajo `public/images/` y, si existe, tu logo SVG en `public/images/`. Las seis fichas provisionales están en `/projects/proyecto-01` a `/projects/proyecto-06`. Los recursos y enlaces vacíos muestran espacios reservados o quedan desactivados. Las fuentes Inter e IBM Plex Mono se empaquetan desde Fontsource; Inter Variable aproxima Inter Display hasta contar con el archivo definitivo. La prueba inicial de deformación utiliza Canvas 2D compartido con tiras horizontales para imágenes y panel oscuro; amplitudes, encuadre, logotipo y transiciones M01–M10 requieren comparación animada con la referencia y medios propios. No se han recibido `recursos-referencia.json` ni las capturas mencionadas en este documento.

### Requisitos confirmados por el usuario

- Será un portfolio público que evolucionará antes de considerarse definitivo.
- Se prioriza una estructura fácil de modificar y ampliar en el futuro.
- Se utilizarán **JavaScript, React, Vite y pnpm**, con componentes `.jsx` y módulos de lógica y configuración `.js`.
- Se reproducirán las **nueve páginas**: inicio, catálogo, biografía y seis fichas de proyecto.
- No se necesita añadir más proyectos ni se ha solicitado un editor administrativo.
- Se utilizará **contenido propio**. Las imágenes y los textos podrán quedar pendientes mediante espacios reservados y referencias editables.
- El diseño adaptable y las animaciones de la referencia siguen formando parte del alcance.

Las secciones de inspección describen el sitio original. Sus nombres, imágenes, marcas, datos de contacto y textos son referencias de análisis, no contenido aprobado para el portfolio personal. La arquitectura acordada se detalla en las secciones 14, 15 y 19. La elección interna de Canvas 2D o WebGL sigue sujeta a la prueba técnica de fidelidad prevista; no bloquea la organización del proyecto.

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

El slug original es `machine-s-children`. Para el portfolio personal, las seis rutas de proyecto se definirán desde los datos de contenido; podrán comenzar con nombres provisionales como `proyecto-01`. Se conserva la estructura de nueve páginas, sin exigir los nombres de los proyectos de la referencia. Si un slug cambia después de publicar, deberá contemplarse la redirección de su URL anterior.

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

El SVG del logotipo de referencia tiene proporción de origen **1470:250**, aproximadamente `5.88:1`, y ajuste `contain`. Sus trazados explican por qué escribir el mismo nombre con Inter Display no produce una copia exacta. Para el portfolio personal se propone un campo de logotipo propio y, mientras falte, el texto provisional «Tu nombre». Conservar la importancia visual, el contenedor y el efecto; adaptar el encaje a la longitud del nombre real. No presentar el nombre de Paul Michel como identidad del usuario.

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
| M03 | Nombre de tarjeta / hover | Dos títulos superpuestos; uno visible y otro inicialmente con opacidad 0 | Preparar intercambio de capas dentro de máscara; confirmar trayectoria y reversión antes de fijarlas | Estructura confirmada; transición exacta pendiente |
| M04 | Flecha de tarjeta / hover | Dos flechas dentro de círculo de cristal; segunda con opacidad 0 | Animar las capas sin desplazar el círculo ni alterar el área del enlace | Estructura confirmada; recorrido exacto pendiente |
| M05 | Imágenes y paneles / scroll y posición en pantalla | Los bordes se curvan hacia fuera; se observó un lienzo compartido superpuesto y elementos de reserva debajo | Módulo de deformación con geometría/texturas sincronizadas con el DOM; mantener el enlace y texto en HTML | Deformación y canvas confirmados; fórmula pendiente |
| M06 | Logotipo grande | SVG de base y lienzo adicional en Home, About y pie; el lienzo puede exceder 28 px el contenedor | Componente aislado de efecto sobre el SVG, preservando una imagen estática de respaldo | Capas confirmadas; respuesta exacta al puntero pendiente |
| M07 | Marcas / tiempo | Diez rótulos: cinco marcas repetidas. Anillo con giro continuo en Y, perspectiva e inclinación | CSS 3D con un ángulo de rotación compartido; reservar volumen y evitar recortes | Giro y estructura confirmados |
| M08 | Rueda de imágenes de Work / tiempo | Diez planos con separaciones de 36°, giro común sobre X e inclinación global sobre Y | CSS 3D; imágenes reales; contenedor adaptable; no es un carrusel horizontal | Giro y estructura confirmados |
| M09 | Scroll general / rueda y retorno al inicio | Desplazamiento amortiguado; clases y estilos de Lenis presentes; retorno al inicio probado | Un solo controlador de scroll y sincronización con efectos; restauración por ruta | Observado; configuración exacta pendiente |
| M10 | Cambio de ruta | Cambia la pantalla y se reproducen estados de entrada | Gestionar scroll, montaje y limpieza; verificar atrás/adelante | Navegación confirmada; no se acreditó una transición compartida entre imágenes |

No se observaron vídeos con reproducción automática, un cursor personalizado, una pantalla de carga porcentual ni una galería modal. No añadirlos para interpretar el estilo.

### 11.1 Anillo de marcas: medidas útiles

Marcas: Nike, Google, Chanel, Netflix y Framer, repetidas dos veces. Los diez rótulos se distribuyen en pasos de **36°**. Se observaron `preserve-3d` y caras posteriores visibles, por lo que algunos textos se leen invertidos en la parte posterior del anillo.

En una muestra de escritorio: perspectiva ≈ **929 px**, radio ≈ **283 px**, inclinación Z de **15°**, inclinación X de **−2°** y escala de conjunto ≈ **1.17**. Son valores de esa instancia y tamaño, no constantes para todas las pantallas. El ángulo Y cambia con el tiempo; no copiar el ángulo de un fotograma como posición fija.

### 11.2 Rueda de Work: medidas útiles

Diez planos en pasos de **36°**, rotación común sobre X y orientación global Y de **−30°**. Las fotografías tienen radio de **7 px**, opacidad de **.95**, ajuste `cover` y caras posteriores visibles. En la muestra de 1024 px, los planos medían aproximadamente **111 × 131 px** y la perspectiva del contenedor era de **1756 px**. La escala se adapta al espacio disponible.

### 11.3 Deformación de imágenes y superficies

Se observó un canvas compartido con `pointer-events: none` y nivel visual 5; el contenido informativo utiliza capas superiores. Algunas imágenes DOM quedan transparentes cuando el renderizador está activo y sirven de respaldo cuando se desactiva.

Esto exige tres responsabilidades separadas: geometría de diseño, representación visual deformada e interacción/accesibilidad. La biblioteca de animación puede controlar valores, pero **no genera por sí sola la deformación gráfica**.

La presencia de canvas no basta para afirmar si el motor original usa Canvas 2D, WebGL o una combinación. Esa elección interna se resolverá con una prueba técnica breve y comparación visual dentro de la arquitectura ya aprobada.

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

La base aprobada, actualizada según la última indicación del usuario, es: JavaScript, React, Vite y pnpm, con React Router para el prerenderizado, CSS Modules, datos JSON locales y animación aislada con GSAP/Lenis. Las tablas conservan la comparación de alternativas; la opción elegida se identifica debajo. El alcance comprende las nueve páginas y el contenido propio.

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
| Datos locales con validación | Proyectos, biografía, enlaces y recursos en archivos del repositorio | Adecuado para seis proyectos y cambios ocasionales gestionados por desarrollo |
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

El anillo y la rueda observados pueden construirse con CSS 3D. No se ha demostrado que necesiten una escena completa con Three.js. Para la deformación, evaluar un módulo Canvas 2D o WebGL con una muestra representativa antes de incorporar una dependencia grande. No animar la misma propiedad simultáneamente con dos motores.

### 14.4 Organización y estilos

Aplicación modular por páginas y componentes, con datos separados y un módulo de movimiento independiente. Para este tamaño, no hace falta introducir una arquitectura empresarial de múltiples capas, un gestor de estado global ni un backend por defecto.

Se utilizarán JavaScript y CSS Modules con variables CSS. Los estilos específicos vivirán junto al componente correspondiente; los colores, espaciados y escalas compartidos estarán centralizados.

### 14.5 Gestor de paquetes

**pnpm** gestionará las dependencias y ejecutará las tareas del proyecto. Se conservará `pnpm-lock.yaml` en el repositorio para registrar las versiones resueltas. Al crear la aplicación, se fijará la versión exacta de pnpm en el campo `packageManager` de `package.json` y se documentará una versión de Node.js compatible con las dependencias elegidas. La misma versión de pnpm se utilizará en desarrollo y en publicación.

## 15. Arquitectura del proyecto

```text
portfolio/
├── app/
│   ├── root.jsx                     Documento y estructura compartida
│   ├── routes.js                    Mapa de URL y módulos de página
│   ├── routes/
│   │   ├── home.jsx                  Inicio
│   │   ├── work.jsx                  Catálogo de seis proyectos
│   │   ├── about.jsx                 Biografía
│   │   ├── project.jsx               Plantilla de las seis fichas
│   │   └── not-found.jsx             Estado de página no encontrada
│   ├── components/
│   │   ├── layout/                   Header, Footer, Container
│   │   ├── portfolio/                ProjectCard, ProjectGrid, ProjectGallery
│   │   │                            ProjectDetails, RelatedProjects
│   │   ├── editorial/                Intro, BioPanel, ExperienceList
│   │   └── ui/                       Media, Placeholder, Button
│   ├── motion/
│   │   ├── MotionProvider.jsx        Ciclo de vida y preferencias de movimiento
│   │   ├── ScrollController.jsx      Lenis, sincronización y política de scroll
│   │   ├── AnimatedLink.jsx          Sustitución de letras
│   │   ├── Reveal.jsx                Aparición de bloques
│   │   ├── BrandRing.jsx             Anillo de marcas con CSS 3D
│   │   ├── ImageWheel.jsx            Rueda de diez imágenes con CSS 3D
│   │   ├── WordmarkEffect.jsx        Logotipo y su efecto
│   │   ├── motionConfig.js          Tiempos, curvas, amplitudes y variantes
│   │   └── deformation/
│   │       ├── DeformationProvider.jsx   Registro de superficies y canvas compartido
│   │       ├── DeformableMedia.jsx       Imagen/panel con respaldo HTML
│   │       └── renderer.client.js       Motor gráfico, exclusivo del navegador
│   ├── content/
│   │   ├── site.json                Perfil, biografía, experiencia y enlaces
│   │   ├── projects.json            Seis proyectos, galerías y relacionados
│   │   ├── media.json               Rutas/URL, texto alternativo y encuadre
│   │   ├── validate.js              Validación de campos y referencias
│   │   └── index.js                 Acceso y comprobación de contenido
│   └── styles/
│       ├── tokens.css               Colores, espaciados, tipografía y radios
│       ├── fonts.css                Declaraciones de fuentes
│       └── globals.css              Base, foco y movimiento reducido
├── public/
│   ├── images/
│   │   ├── profile/
│   │   ├── projects/
│   │   │   ├── proyecto-01/
│   │   │   └── ...                  Hasta proyecto-06
│   │   └── placeholders/
│   ├── fonts/
│   └── documents/                   CV u otros documentos propios
├── react-router.config.js           Prerenderizado de las nueve rutas
├── vite.config.js                   Integración de Vite con React Router
├── jsconfig.json                    Configuración del editor para JavaScript
├── package.json                     Dependencias y tareas del proyecto
├── pnpm-lock.yaml                   Versiones resueltas de dependencias
└── README.md                        Diseño, instalación y guía de edición
```

Este árbol describe la organización aprobada; la implementación actual crea los archivos que necesita y todavía no todas las piezas propuestas. `app/` agrupa el código y sigue las convenciones de React Router en modo framework. Cada componente con estilos propios tiene su archivo adyacente `Nombre.module.css`; no se enumeran todos para mantener legible el árbol. Los módulos de rutas componen las pantallas y definen sus metadatos, mientras los componentes resuelven las piezas visuales. Referencia: [configuración de rutas de React Router](https://reactrouter.com/start/framework/routing).

Los componentes y las páginas usarán JSX; la lógica y la configuración usarán módulos JavaScript con `import` y `export`. `package.json` declarará `"type": "module"`. `jsconfig.json` servirá al editor y no añadirá una etapa de comprobación de tipos. React Router admite archivos de configuración JavaScript; su [resolución de archivos de entrada](https://github.com/remix-run/react-router/blob/main/packages/react-router-dev/config/config.ts) contempla las extensiones `.js` y `.jsx`.

### Instalación y comandos con pnpm

Estos comandos están disponibles desde la raíz del repositorio, con Node.js y pnpm instalados:

| Acción | Comando | Resultado |
|---|---|---|
| Instalar dependencias | `pnpm install` | Instala los paquetes y crea o actualiza el archivo de versiones |
| Iniciar desarrollo | `pnpm dev` | Ejecuta `react-router dev`, integrado con Vite |
| Generar la versión publicable | `pnpm build` | Ejecuta `react-router build` y prerenderiza las nueve rutas |
| Instalar en integración continua | `pnpm install --frozen-lockfile` | Instala respetando el archivo de versiones y falla si requiere cambios |

Las tareas previstas en `package.json` serán:

```json
{
  "type": "module",
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build"
  }
}
```

Es un fragmento de configuración, no un `package.json` completo. La compilación se realizará con Vite a través de React Router, conservando el prerenderizado acordado. Referencias: [inicio de React Router](https://reactrouter.com/tutorials/quickstart) e [instalación con pnpm](https://pnpm.io/cli/install).

### Nueve páginas a partir de cuatro plantillas

| URL | Módulo | Fuente de contenido |
|---|---|---|
| `/` | `routes/home.jsx` | Perfil y cuatro proyectos destacados |
| `/work` | `routes/work.jsx` | Los seis proyectos y las diez imágenes de la rueda |
| `/about` | `routes/about.jsx` | Biografía, experiencia, servicios y recursos personales |
| `/projects/proyecto-01` a `/projects/proyecto-06` | `routes/project.jsx`, mediante `/projects/:slug` | El registro que corresponda al slug |

Los slugs de proyecto son provisionales y se editarán en los datos. La lista de rutas que se prerenderiza se derivará de esos registros, junto con las tres rutas principales. El estado 404 es auxiliar y no añade una décima página editorial. Un slug desconocido debe mostrar ese estado, sin reutilizar por defecto el primer proyecto.

### Flujo de contenido y publicación

```text
Archivos JSON + recursos propios
               ↓
Acceso común al contenido y comprobación de referencias
               ↓
Módulos de página → componentes visuales + estilos compartidos
               ↓
Compilación: HTML y metadatos para cada una de las nueve URL
               ↓
Alojamiento estático → React activa navegación y animaciones en el navegador
```

Editar contenido o diseño requerirá una nueva compilación para actualizar la versión publicada. Las páginas contienen texto e imágenes de respaldo desde el HTML inicial; los efectos se activan después. Esta división permite conservar contenido visible mientras se carga el módulo gráfico. Referencia: [prerenderizado de React Router](https://reactrouter.com/start/framework/rendering).

### Límites entre módulos

- **Contenido:** no importa componentes ni herramientas de animación. `index.js` expone la lectura de perfil, proyectos, destacados y recursos; utiliza `validate.js` para comprobar los datos antes de generar y publicar las páginas.
- **Rutas:** seleccionan los datos y componen la página. Una ficha nueva reutilizaría `project.jsx`; las seis previstas no requieren seis archivos de pantalla distintos.
- **Componentes:** reciben datos y opciones de presentación. La tarjeta usa el mismo título y portada en Home, Work y proyectos relacionados.
- **Movimiento:** recibe elementos, recursos y parámetros; no contiene información personal ni búsquedas de proyectos. Las animaciones usan un ciclo coordinado y se limpian al desmontarse.
- **Renderizador:** se inicializa sólo en el navegador. Sus APIs de canvas, `window` y medidas DOM no se ejecutan durante el prerenderizado. La primera renderización mantiene el mismo contenido de respaldo que el HTML generado.
- **Estilos:** las reglas locales quedan junto a cada componente; los valores comunes viven en `tokens.css`. Los límites de pantalla conservan 810 y 1200 px.

La implementación actual confía la restauración de rutas a `ScrollRestoration` de React Router; `MotionProvider` integra Lenis y ScrollTrigger sin añadir una segunda restauración. `DeformationProvider` comparte el canvas entre las superficies que necesitan el efecto; no se crean bucles independientes para cada imagen.

### Modelo de contenido

Cada proyecto necesita: identificador estable, `slug`, título, cliente, año, categorías, posición en catálogo, presencia en Home, portada, imagen principal, párrafos, bloques de galería, orden móvil, enlace externo, proyectos relacionados y metadatos sociales. Portadas y galerías referencian identificadores de `media.json`; los proyectos relacionados usan identificadores estables. Así, cambiar un título, una URL de imagen o un slug no exige copiar cambios en varias páginas.

Los bloques de galería deben distinguir **imagen ancha** y **pareja de imágenes**, con encuadre, proporción y orden por tamaño. Evitar seis páginas copiadas manualmente: una plantilla de proyecto puede resolver las seis rutas sin borrar sus diferencias.

El módulo gráfico debe aceptar recursos y geometría desde los componentes; no debe conocer slugs ni textos editoriales. Si falla o no está habilitado, la imagen de respaldo debe conservar el mismo espacio y encuadre.

### Edición de textos e imágenes

La estructura permitirá cambiar contenido sin editar los componentes de pantalla:

| Cambio | Archivo de edición | Consecuencia |
|---|---|---|
| Nombre, biografía, contacto, CV y redes | `site.json` | Se actualizan todas las zonas que comparten ese dato |
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

Al completar el contenido, `src` podrá ser una ruta local como `/images/proyecto-01/portada.webp` o una URL HTTPS. Se recomienda la ruta local para los recursos definitivos. Los componentes mantienen la proporción correspondiente a cada uso: tarjeta cuadrada, imagen principal ancha o retrato adaptable.

Si `src` está vacío o la imagen falla, se mostrará un espacio reservado con el mismo tamaño y una etiqueta discreta. No se dejarán iconos de imagen rota ni se colapsará la composición. Los seis proyectos tendrán registros provisionales para que sus seis páginas y los listados puedan revisarse desde el inicio.

Las imágenes remotas utilizadas como texturas necesitan acceso compatible con CORS. Si una URL puede mostrarse como imagen pero no puede usarse en el renderizador, la propuesta contempla mostrarla de forma normal, sin deformación, y señalarlo durante la revisión. Para garantizar el efecto, lo más fiable es alojar el archivo con el sitio.

También habrá referencias editables para las diez imágenes de la rueda, el retrato, la fotografía ancha, el logotipo y las marcas del anillo. Los nombres de clientes del original no se tratarán como clientes reales del usuario. No se necesita entregar todo ese contenido antes de desarrollar la estructura: los espacios reservados permiten avanzar, aunque la aceptación visual final debe hacerse con los recursos reales.

### Cómo podrá evolucionar la estructura

La cabecera, el pie, las tarjetas y las galerías se reutilizarán. Las seis fichas compartirán una plantilla con bloques de contenido configurables. Una nueva sección podrá incorporarse sin copiar una página completa; los ajustes de diseño se concentrarán en componentes y variables compartidas. El renderizador gráfico y el acceso a contenido permanecerán separados de las rutas. Esto facilita cambios posteriores sin prometer que cualquier ampliación futura carecerá de coste.

## 16. Plan de implementación con la arquitectura aprobada

1. Crear la base con JavaScript, React, Vite y React Router, gestionada con pnpm; preparar sus cuatro plantillas, el layout compartido y las nueve rutas derivadas de los datos. La aprobación técnica ya fue recibida.
2. Preparar recursos locales, fuentes y datos; comprobar encuadres.
3. Construir primero las cuatro plantillas estáticas en los tres intervalos de pantalla.
4. Validar proporciones, tipografía, espacios y orden móvil contra las referencias.
5. Probar la deformación con una tarjeta, una imagen ancha y un panel oscuro; resolver el renderizador antes de extenderlo.
6. Incorporar enlaces animados, rueda, anillo, entradas y scroll con parámetros centralizados.
7. Calibrar amplitudes, velocidades, tiempos y reversión; resolver el efecto del logotipo y los hovers pendientes.
8. Verificar navegación, acceso directo a rutas, foco, movimiento reducido, carga de recursos y rendimiento; publicar sólo cuando se solicite.

## 17. Criterios de aceptación de la futura réplica

- Las nueve rutas acordadas existen y se pueden abrir directamente y recargar.
- Las fuentes, pesos, geometría, jerarquía y animaciones siguen la referencia; la identidad, los textos y los recursos corresponden al usuario o están identificados como provisionales.
- Se pueden reemplazar textos e imágenes desde los archivos de contenido propuestos, sin editar las plantillas de pantalla.
- Los recursos ausentes conservan sus espacios, y los enlaces sin configurar no dirigen a contactos ni sitios del autor de la referencia.
- Las cuadrículas y los cambios de orden en móvil coinciden con el original.
- Los títulos largos no se recortan y no aparece desplazamiento horizontal accidental.
- Se han comparado fotogramas equivalentes, incluyendo reposo, entrada, hover, scroll rápido, scroll inverso y retorno al inicio.
- Se han cerrado los pendientes M03, M04 y M06 y calibrado los tiempos de los demás efectos.
- El giro de la rueda y el anillo se compara por ciclo, no sólo por una captura estática.
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

El usuario aprobó la base técnica después de confirmar: portfolio público en evolución, seis proyectos y nueve páginas, con contenido propio y espacios reservados para completarlo.

| Parte | Elección aprobada | Motivo para este caso |
|---|---|---|
| Base | JavaScript + React + Vite | Usar el lenguaje y las herramientas solicitados, con componentes JSX y lógica en JavaScript |
| Gestor de paquetes | pnpm, con `pnpm-lock.yaml` versionado | Mantener las dependencias y los comandos del proyecto consistentes |
| Rutas y renderizado | React Router en modo framework, con prerenderizado de las nueve rutas y publicación estática | Entregar HTML por página y conservar navegación interactiva sin servidor de aplicación |
| Organización | Componentes reutilizables y una plantilla configurable para las seis fichas | Facilitar cambios de diseño sin repetir trabajo |
| Estilos | CSS Modules y variables CSS | Ajustar medidas con precisión y modificar valores compartidos |
| Contenido | Tres archivos JSON locales para perfil, proyectos y recursos | Sustituir textos, rutas de imagen y URL sin editar componentes |
| Animación | GSAP/ScrollTrigger, Lenis, CSS 3D y módulo gráfico independiente | Reproducir y calibrar los efectos observados; resolver Canvas 2D/WebGL mediante la prueba técnica descrita |
| Contenido provisional | Seis registros y espacios reservados con proporciones estables | Construir y revisar las nueve páginas antes de recibir los recursos definitivos |
| Identidad de plantilla | Omitir insignia y enlaces comerciales de Framer | Adecuar el portfolio a la identidad del usuario |

Esta arquitectura mantiene el contenido fácil de editar y concentra la complejidad gráfica en un módulo específico. Los nombres definitivos, imágenes, textos y dominio podrán incorporarse después; no es necesario decidirlos para preparar la estructura.

**Estado: primera implementación funcional con contenido provisional.** La prueba del renderizador Canvas 2D es inicial; la comparación visual y la calibración de animaciones siguen pendientes y no requieren volver a elegir la arquitectura general.

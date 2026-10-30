# SEO y rendimiento del portfolio

Implementación del 30 de octubre de 2026, en la rama `seo-rendimiento`. Se conserva React Router con generación estática de siete páginas, además de una página auxiliar 404. La publicación se actualiza al integrar los cambios en `main` y hacer push a `origin`.

## Cómo editar SEO

- `site.url`: origen HTTPS canónico, sin barra final ni ruta. Valor aprobado: https://quetzin-portfolio.vercel.app.
- `site.seo.home`, `work` y `about`: `title`, `description` e identificador de medio `image`.
- Cada proyecto: `seoTitle` opcional, `description` específica y `hero` como imagen social. Los párrafos visibles de proyecto se siguen editando en `summary`; no se han inventado clientes, fechas ni experiencia.
- `app/content/seo.js` genera título, descripción, canónica, Open Graph, tarjetas sociales y un único grafo JSON-LD. El marcado usa WebSite/Person, ProfilePage, CollectionPage/ItemList y CreativeWork, con identificadores comunes y datos existentes.
- La lista canónica se comparte entre prerenderizado y sitemap. No incluye alias ni 404; no publica fechas ficticias de modificación.

## Generación, alojamiento y enlaces

`pnpm build` prepara imágenes, prerenderiza, genera sitemap/robots/404, conserva el DOM al formatear HTML, crea Brotli/gzip y produce `build/client/` y `.vercel/output/`. No edites los archivos generados. `vercel.json` utiliza la salida estática Build Output API; los alias se derivan de `legacySlugs` y las rutas de los slugs actuales. No hay un servidor de aplicación en producción.

`pnpm preview` sirve esta salida en http://127.0.0.1:8080. `PORT=8082 pnpm preview` permite elegir otro puerto. Las siete páginas devuelven 200, los cuatro alias devuelven 308 y las URL desconocidas devuelven 404 con `X-Robots-Tag: noindex, follow`. El error HTTP contiene enlaces y estilos, sin hidratar React contra una URL distinta; la navegación interna sigue usando el estado 404 del router.

Producción genera `index, follow`. `VERCEL_ENV=preview` o `SEO_NOINDEX=1` genera `noindex, follow` tanto en HTML como en las cabeceras de Vercel. El sitemap y las canónicas siempre señalan el dominio principal. Robots permite el rastreo para que se pueda leer noindex; no se utiliza como bloqueo de indexación.

`pnpm check:links` revisa páginas, anclas, imágenes, variantes, scripts, estilos, fuentes y archivos. Las fuentes enlazadas desde CSS también se comprueban. `pnpm check:links --external` revisa destinos HTTPS; distingue 404/410 confirmados de 401/403/429 y errores no concluyentes. Instagram y YouTube devolvieron HTTP 200 durante esta revisión. El teléfono visible se conserva y su enlace usa un formato normalizado.

## Imágenes y movimiento

Los originales se conservan. Sharp genera WebP con calidad 82 a 320/640/960/1440/1920 px, sin ampliar, y obtiene las dimensiones y orientación reales. Las imágenes usan `srcset` y `sizes`; el canvas M05 conserva `currentSrc`. Los hashes invalidan las variantes al cambiar el archivo. Vite regenera al editar fotos o el catálogo; `.cache/` y `public/images/generated/` se ignoran en Git.

Los carruseles conservan las ocho fotografías completas desde el HTML inicial y la precarga al montar. Cada foto usa una variante de aproximadamente 640 px compartida entre respaldo y fragmentos 3D; las ocho precargas tienen prioridad baja para no competir con la imagen principal. No se añade una cola, selección de vecinas ni carga por proximidad. El respaldo sigue hasta preparar el conjunto o alcanzar 2400 ms.

El peso de la colección Home/About baja de 4.013.582 a 296.710 bytes (92,6 %); Work baja de 4.087.384 a 396.136 bytes (90,3 %). Se priorizan las imágenes LCP observadas: primera portada de Home/Work, retrato de About y heroes de proyecto. Se precarga sólo la fuente Inter latina principal. Las amplitudes y el funcionamiento aprobado de las animaciones se conservan.

## Comparación de laboratorio

Node 26.0.0 y Lighthouse 13.6.0, Chrome sin interfaz, caché nueva en cada auditoría, perfiles predeterminados móvil/escritorio y limitación simulada de Lighthouse. Ambas compilaciones se sirven con compresión Brotli/gzip. La referencia conserva los cambios locales de contenido e imágenes anteriores al trabajo SEO. Se hizo una ejecución por ruta y dispositivo; por tanto hay variabilidad y no son medianas ni percentiles de visitantes. Las pruebas sin compresión previas al ajuste del servidor no se usan en esta tabla.

| Página | Perfil | Rendimiento /100 | LCP (s) | TBT (ms) | Transferencia (MiB) |
| --- | --- | --- | --- | --- | --- |
| Inicio | Móvil | 51 → 92 | 12.23 → 3.31 | 1080 → 4 | 6.46 → 1.00 |
| Inicio | Escritorio | 96 → 100 | 0.89 → 0.66 | 152 → 0 | 6.46 → 0.82 |
| Work | Móvil | 73 → 92 | 3.15 → 3.31 | 831 → 10 | 6.53 → 1.09 |
| Work | Escritorio | 95 → 100 | 0.64 → 0.66 | 172 → 0 | 6.53 → 0.96 |
| About | Móvil | 95 → 92 | 3.00 → 3.38 | 0 → 0 | 4.77 → 0.71 |
| About | Escritorio | 100 → 100 | 0.24 → 0.24 | 0 → 0 | 4.77 → 0.72 |
| Modelaje | Móvil | 79 → 94 | 5.78 → 3.15 | 0 → 0 | 3.10 → 0.83 |
| Modelaje | Escritorio | 98 → 100 | 1.06 → 0.66 | 0 → 0 | 4.05 → 0.64 |

CLS fue 0 en las ocho auditorías finales y SEO obtuvo 100 en los cuatro tipos de página. Los resultados completos resumidos están en [performance-summary.json](./performance-summary.json). Lighthouse SEO ya puntuaba 100 en la referencia: esa puntuación no acredita sitemap, calidad editorial ni posicionamiento.

El LCP móvil final está aproximadamente entre 3,15 y 3,38 s, por encima del objetivo de 2,5 s. Work y About no mejoran el LCP frente a su muestra de referencia, aunque descargan muchos menos bytes y Work reduce el bloqueo de JavaScript. No se afirma que el portfolio supere todos los Core Web Vitals. TBT no es INP; faltan datos reales al percentil 75, segmentados por móvil y escritorio. No se ha añadido seguimiento de visitantes ni se ha activado un servicio de métricas.

Para repetir, instala Node 22.19 o posterior y Chrome y ejecuta:

```sh
pnpm check
pnpm preview
# En otra terminal; tres repeticiones por plantilla y dispositivo por defecto:
pnpm perf --label current
# Una medición rápida:
pnpm perf --label quick --runs 1
```

Los informes JSON detallados quedan en `reports/performance/`, ignorados por Git. La puntuación es orientativa; conserva equipo, perfiles y compresión al comparar.

## Verificación y publicación

- `pnpm check` supera 44 pruebas; compila las siete páginas y el error auxiliar; verifica metadatos, JSON-LD y 1.053 referencias locales. Las pruebas nuevas cubren también compresión sin alterar el HTML, alias HTTP, noindex, recursos adaptables y selección de texturas `currentSrc`.
- Se verificaron los HTTP 200/308/404, robots y sitemap con sus tipos de contenido, y compresión Brotli. Una compilación con `SEO_NOINDEX=1` confirmó noindex en las siete páginas y en la salida HTTP de Vercel; se restauró producción.
- En Chrome se revisaron las siete páginas en móvil, metadatos al navegar, un alias y recarga, ausencia de errores de hidratación, y Work a 390/1024/1440 px. Los carruseles mantienen ocho fotos, arrastre, pausa y teclado. El canvas sigue siendo único en Home/Work y se retira en About; se revisó el scroll y su inversión en Home. Las pruebas existentes conservan la cobertura de movimiento reducido; no se ha probado un teléfono físico.
- Al publicar esta rama en Vercel, comprobar de nuevo cabeceras, rutas y previsualizaciones en la URL remota. Las reglas de alojamiento se han comprobado aquí mediante su configuración generada y el servidor estático local.
- Después del despliegue, verificar la propiedad del dominio en Google Search Console y enviar `https://quetzin-portfolio.vercel.app/sitemap.xml`. Esta entrega no crea cuentas, verifica propiedad ni envía el sitemap a Google.

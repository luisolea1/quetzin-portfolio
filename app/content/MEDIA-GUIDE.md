# Cómo colocar las imágenes del portfolio

Edita `media.json` para asignar cada fotografía. Los campos `_comment` explican dónde aparece cada recurso; son notas de edición y no se muestran en la página. JSON no admite comentarios `//`.

## Optimización automática al desarrollar y compilar

Sigue editando los originales y `media.json`. `pnpm dev`, `pnpm test` y `pnpm build` ejecutan `media:prepare`: genera versiones WebP de 320, 640, 960, 1440 y 1920 px cuando el original lo permite, sin ampliarlo, con calidad 82 y orientación corregida. Los originales y los encuadres `position` se conservan.

Las dimensiones del HTML se obtienen del archivo real; las imágenes generales usan `srcset` y `sizes`. Las ocho fotos de cada carrusel usan la misma variante de aproximadamente 640 px en precarga, respaldo y fragmentos 3D, y siguen cargándose todas desde el inicio. La imagen social utiliza el original. Las URL HTTPS externas conservan su fuente; conviene completar sus dimensiones reales en el registro; no se descargan ni recomprimen durante la compilación.

`public/images/generated/` y `.cache/media.json` son resultados ignorados por Git: no los edites ni los uses como `src` del contenido. Un hash cambia las URL al sustituir un original. Vite vuelve a generar las variantes al modificar fotografías o `media.json`; `pnpm media:prepare` permite prepararlas manualmente. Un archivo local referenciado que no existe se considera un error; usa `src: null` para un recurso pendiente.

## Tres colecciones independientes

| Registros en `media.json`   | Uso                                                               | Orden                    |
| --------------------------- | ----------------------------------------------------------------- | ------------------------ |
| `cover01` a `cover04`       | Portadas de Modelaje, Paisajes, Producto y Música en las tarjetas | `projects.json`          |
| `carousel01` a `carousel08` | Ocho fotos propias del anillo de Home y About                     | `site.json` → `carousel` |
| `workCarousel01` a `workCarousel08` | Ocho fotos propias del carrusel del hero de Work             | `site.json` → `workCarousel` |

Cambiar una portada no modifica el anillo. Cambiar una foto del anillo no modifica las tarjetas ni las fichas. Cada colección tiene sus propios identificadores y rutas; puedes elegir fotografías diferentes para cada una.

## Cómo cambiar las ocho fotos del anillo

La carpeta `public/images/carousel/` ya está preparada. Los ocho registros comienzan con `src: null`: conservan sus espacios reservados mientras eliges las fotografías.

1. Guarda las fotos en esa carpeta, por ejemplo `01.webp` a `08.webp`.
2. En `media.json`, completa los registros `carousel01` a `carousel08`. Para la primera foto:

```json
{
  "carousel01": {
    "_comment": "Primera foto independiente del anillo de Home y About.",
    "src": "/images/carousel/01.webp",
    "alt": "Describe aquí lo que aparece en tu fotografía",
    "position": "50% 50%"
  }
}
```

Este ejemplo muestra un registro: edítalo dentro del archivo existente sin borrar los demás. No incluyas `public/` en `src`. Si prefieres otros nombres de archivo, actualiza las rutas para que coincidan.

Para cambiar el orden, reorganiza los ocho identificadores de `site.carousel` en `site.json`. Deben ser ocho referencias distintas existentes en `media.json`. El anillo no usa los identificadores `cover`, `hero` ni `workCarousel`.

El carrusel muestra las fotos y los espacios reservados pendientes, sin botones, nombre ni contador inferior. Puedes arrastrarlo o navegar con flechas e Inicio/Fin al enfocarlo; Espacio cambia la pausa. Las descripciones accesibles se conservan.

## Cómo colocar las ocho fotos del carrusel de Work

El hero de `/work` usa el mismo Circular Carousel, con una colección propia. Sus ocho espacios están pendientes y se editan en `workCarousel01` a `workCarousel08`; cambiar estas fotos no modifica Home, About ni las tarjetas de proyecto.

Guarda las imágenes en `public/images/work/carousel/`. Para la primera, completa el registro existente así:

```json
{
  "workCarousel01": {
    "_comment": "Primera fotografía del carrusel de Work.",
    "src": "/images/work/carousel/01.webp",
    "alt": "Describe aquí tu fotografía",
    "position": "50% 50%"
  }
}
```

Repite el proceso hasta `workCarousel08`. Mantén `src: null` para conservar un espacio reservado. Ordena las ocho fotos mediante `site.workCarousel` en `site.json`. Los antiguos registros `wheel01` a `wheel10` se retiraron junto con la rueda.

## Carpetas recomendadas para el resto de las imágenes

```text
public/images/
├── carousel/                 Fotos exclusivas del anillo de Home y About
│   ├── 01.webp
│   ├── …
│   └── 08.webp
├── projects/
│   ├── modelaje/             Modelaje
│   │   ├── cover.webp        Portada de las tarjetas
│   │   ├── hero.webp         Foto principal de la ficha
│   │   ├── gallery-01.webp   Primera imagen de la pareja
│   │   ├── gallery-02.webp   Segunda imagen de la pareja
│   │   └── gallery-wide.webp Imagen ancha posterior
│   ├── paisajes/             Paisajes
│   ├── producto/             Producto
│   └── musica/               Música
├── about/
│   ├── portrait.webp
│   └── architecture.webp
├── work/
│   └── carousel/             Fotos exclusivas del carrusel de Work
│       ├── 01.webp
│       ├── …
│       └── 08.webp
└── brand/
    └── logo.svg              Sólo si usas una imagen de marca
```

Los nombres del árbol son ejemplos de archivos que puedes colocar. Las cuatro fotografías actuales mantienen sus rutas. Para mover `public/images/modelaje.webp` a `public/images/projects/modelaje/cover.webp`, actualiza `cover01.src` a `/images/projects/modelaje/cover.webp` en el mismo cambio. Se actualizarán las tarjetas de Modelaje; el anillo conservará sus ocho fotos independientes.

Usa nombres en minúsculas, sin espacios ni acentos, separados por guiones. Mover un archivo no requiere cambiar su identificador de `media.json`.

## Imágenes de las fichas y About

| Identificador                    | Dónde se muestra                                  | Encuadre del contenedor                    |
| -------------------------------- | ------------------------------------------------- | ------------------------------------------ |
| `cover01` a `cover04`            | Tarjetas de Home, Work y proyectos relacionados   | Cuadrado                                   |
| `hero01` a `hero04`              | Foto grande debajo del título de la ficha         | 16:9                                       |
| `gallery01a`, `gallery01b`, etc. | Pareja de imágenes de la galería correspondiente  | Patrón 3:4 / 1:1; se apilan en móvil              |
| `gallery01wide`, etc.            | Imagen independiente después de la pareja        | Patrón 3:4 / 1:1                                       |
| `portrait`                       | Retrato de About                                  | Cuadrado en móvil y vertical en escritorio |
| `architecture`                   | Fotografía ancha después de la biografía de About | 2:1                                        |

Las fichas se abren en `/projects/modelaje`, `/projects/paisajes`, `/projects/producto` y `/projects/musica`. Los números de los identificadores siguen siendo estables: `01` es Modelaje, `02` Paisajes, `03` Producto y `04` Música. `projects.json` decide el orden de las galerías y su orden móvil; las notas describen la configuración actual. Los registros provisionales 05 y 06 se retiraron al reducir el catálogo a cuatro proyectos.

Para completar `hero01`, guarda una foto en `public/images/projects/modelaje/hero.webp` y cambia su `src` a `/images/projects/modelaje/hero.webp`. Es independiente de `cover01` y de las ocho fotos del anillo. Cuando un `hero` tiene imagen, su ruta también se usa en el metadato `og:image` de esa ficha.

## Cómo ampliar una galería hasta diez fotos

El número de fotos depende del proyecto. Cada ficha admite hasta **diez apariciones en la galería**, aparte de su hero. **Importante:** crear un registro en `media.json` no añade la foto automáticamente: también debe estar referenciada en `gallery` de su proyecto en `projects.json`. No hay que completar las diez. Una foto repetida cuenta como otra aparición; los recursos pendientes (`src: null`) también cuentan y conservan su espacio.

1. Guarda la foto en la carpeta de su proyecto, por ejemplo `public/images/projects/modelaje/gallery-04.webp`.
2. Añade un registro propio a `media.json`, o edítalo si ya existe (no borres los demás):

```json
{
  "modelajeGallery04": {
    "_comment": "Cuarta fotografía de la galería de Modelaje.",
    "src": "/images/projects/modelaje/gallery-04.webp",
    "alt": "Describe aquí tu fotografía",
    "position": "50% 50%",
    "width": 1800,
    "height": 2400
  }
}
```

3. En el registro de Modelaje de `projects.json`, añade este bloque al final de `gallery` (ya está incorporado para `modelajeGallery04`; no lo dupliques):

```json
{ "type": "image", "media": "modelajeGallery04" }
```

Repite con identificadores nuevos hasta diez fotos. Puedes usar el nombre del proyecto en los identificadores nuevos; no renombres los antiguos sin actualizar sus referencias. El undécimo elemento provoca un error de validación en `pnpm check`. Una pareja (`pair`) cuenta como **dos fotos**.

Desde 810 px, las apariciones se distribuyen alternadamente en dos columnas independientes (1, 3, 5… a la izquierda; 2, 4, 6… a la derecha). Toda la ficha comparte el mismo scroll de página, desde el título hasta el pie: no hay un panel desplazable dentro de la galería. Por debajo de 810 px, las fotos pasan a una columna y se respeta `mobileOrder` de cada pareja. No se duplican las imágenes para construir las dos composiciones.

`width` y `height` deben contener las dimensiones reales del archivo, como enteros positivos. La galería reserva un recorte editorial: vertical 3:4, salvo las fotos 2 y 8, cuadradas en la columna derecha. Después de la primera pareja vertical/cuadrado hay dos parejas verticales antes de repetir. Para un recorte distinto, añade al bloque un `aspectRatio` numérico (ancho dividido entre alto):

```json
{ "type": "image", "media": "modelajeGallery04", "aspectRatio": 0.75 }
```

Ese ejemplo fuerza 3:4; `1` fuerza un cuadrado y `1.5` equivale a 3:2. El encuadre se sigue ajustando mediante `position` en `media.json`. Los bloques anteriores `pair` y `wide` siguen siendo válidos: cada imagen aparece dentro de su columna y adopta el patrón anterior, salvo que su bloque declare `aspectRatio`. Las proporciones ya están reservadas antes de descargar las fotos.

## Campos comunes

- `src`: ruta desde `/images/` o URL HTTPS. Mantén `null` mientras no tengas la foto.
- `alt`: descripción de lo que aparece en la foto para quien no puede verla; no es una instrucción de edición ni un título visible.
- `width` y `height`: dimensiones originales opcionales, siempre juntas; describen el archivo, mientras que `aspectRatio` y el patrón de la galería definen el recorte visible.
- `position`: punto de recorte. `50% 50%` centra la foto y `50% 30%` acerca el encuadre a su parte superior. `object-fit: cover` conserva la proporción y recorta para cubrir el contenedor.

Una foto pendiente o fallida conserva su espacio reservado. Puedes repetir una misma ruta si lo necesitas; las colecciones siguen teniendo registros separados.

Guarda los cambios y ejecuta `pnpm check`. Para publicar las imágenes nuevas necesitarás volver a compilar y publicar los archivos estáticos.

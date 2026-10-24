# Cómo colocar las imágenes del portfolio

Edita `media.json` para asignar cada fotografía. Los campos `_comment` explican dónde aparece cada recurso; son notas de edición y no se muestran en la página. JSON no admite comentarios `//`.

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
│   ├── proyecto-01/           Modelaje
│   │   ├── cover.webp        Portada de las tarjetas
│   │   ├── hero.webp         Foto principal de la ficha
│   │   ├── gallery-01.webp   Primera imagen de la pareja
│   │   ├── gallery-02.webp   Segunda imagen de la pareja
│   │   └── gallery-wide.webp Imagen ancha posterior
│   ├── proyecto-02/           Paisajes
│   ├── proyecto-03/           Producto
│   └── proyecto-04/           Música
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

Los nombres del árbol son ejemplos de archivos que puedes colocar. Las cuatro fotografías actuales mantienen sus rutas. Para mover `public/images/modelaje.webp` a `public/images/projects/proyecto-01/cover.webp`, actualiza `cover01.src` a `/images/projects/proyecto-01/cover.webp` en el mismo cambio. Se actualizarán las tarjetas de Modelaje; el anillo conservará sus ocho fotos independientes.

Usa nombres en minúsculas, sin espacios ni acentos, separados por guiones. Mover un archivo no requiere cambiar su identificador de `media.json`.

## Imágenes de las fichas y About

| Identificador                    | Dónde se muestra                                  | Encuadre del contenedor                    |
| -------------------------------- | ------------------------------------------------- | ------------------------------------------ |
| `cover01` a `cover04`            | Tarjetas de Home, Work y proyectos relacionados   | Cuadrado                                   |
| `hero01` a `hero04`              | Foto grande debajo del título de la ficha         | 16:9                                       |
| `gallery01a`, `gallery01b`, etc. | Pareja de imágenes de la galería correspondiente  | Cuadrados; se apilan en móvil              |
| `gallery01wide`, etc.            | Imagen ancha después de la pareja                 | 16:9                                       |
| `portrait`                       | Retrato de About                                  | Cuadrado en móvil y vertical en escritorio |
| `architecture`                   | Fotografía ancha después de la biografía de About | 2:1                                        |

Los números identifican el proyecto: `01` es Modelaje, `02` Paisajes, `03` Producto y `04` Música. `projects.json` decide el orden de las galerías y su orden móvil; las notas describen la configuración actual. Los registros provisionales 05 y 06 se retiraron al reducir el catálogo a cuatro proyectos.

Para completar `hero01`, guarda una foto en `public/images/projects/proyecto-01/hero.webp` y cambia su `src` a `/images/projects/proyecto-01/hero.webp`. Es independiente de `cover01` y de las ocho fotos del anillo. Cuando un `hero` tiene imagen, su ruta también se usa en el metadato `og:image` de esa ficha.

## Campos comunes

- `src`: ruta desde `/images/` o URL HTTPS. Mantén `null` mientras no tengas la foto.
- `alt`: descripción de lo que aparece en la foto para quien no puede verla; no es una instrucción de edición ni un título visible.
- `position`: punto de recorte. `50% 50%` centra la foto y `50% 30%` acerca el encuadre a su parte superior. `object-fit: cover` conserva la proporción y recorta para cubrir el contenedor.

Una foto pendiente o fallida conserva su espacio reservado. Puedes repetir una misma ruta si lo necesitas; las colecciones siguen teniendo registros separados.

Guarda los cambios y ejecuta `pnpm check`. Para publicar las imágenes nuevas necesitarás volver a compilar y publicar los archivos estáticos.

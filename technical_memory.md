THE DIVE BRIDGE

## MEMORIA TÉCNICA

**Proyecto individual de JavaScript — Bootcamp de The Bridge**

## 1. DESCRIPCIÓN DEL PROYECTO

The Dive Bridge es una aplicación web para explorar puntos de buceo. El usuario puede consultar un catálogo, buscar sitios por nombre, filtrar por país y por rango de profundidad, avanzar por los resultados y guardar puntos favoritos en el navegador.

Los datos de los puntos proceden de OpenDiveMap. La aplicación utiliza HTML, CSS y JavaScript, sin frameworks. La página de exploración y la página de favoritos se encuentran en `index.html` y `favorite.html`.

## 2. ARQUITECTURA
El código se divide en módulos para que cada archivo se ocupe de una parte concreta de la aplicación:

| Archivo | Responsabilidad |
| --- | --- |
| `src/function.js` | Consulta OpenDiveMap, transforma cada elemento de GeoJSON en datos utilizables y crea las tarjetas. Aquí se define el modelo `DiveSpot`. |
| `src/form.js` | Crea las opciones de país y aplica los filtros de nombre, país y profundidad. |
| `src/render.js` | Recibe los resultados filtrados, calcula la página visible y los representa en el DOM. |
| `src/index.js` | Inicializa la página principal y coordina carga, formulario, filtros y paginación. |
| `src/localStorage.js` | Guarda, recupera y elimina puntos favoritos de `localStorage`. |
| `src/favorite.js` | Recupera los favoritos y los muestra en la página `favorite.html`. |
| `index.html` | Contiene la estructura de la página de exploración, el formulario y el contenedor de resultados. |
| `favorite.html` | Contiene la estructura de la página de favoritos. |
| `css/` | Incluye los estilos compartidos y los específicos de cada página. |

### 2.2 Modelo de clases (POO)

La clase `DiveSpot` representa un punto de buceo individual. Su constructor recibe un elemento de la API, lee `feature.properties` y prepara los datos que usa la aplicación, por ejemplo:

- `id`, `name`, `countryName` y `countryCode`.
- `environment` y `maxDepth`.
- `image`, con una imagen local de sustitución si la API no incluye una miniatura.
- `description` y `descriptionWildlife`, con textos alternativos si faltan en la respuesta.

El uso de `DiveSpot` evita que el resto de la interfaz tenga que navegar continuamente por la estructura anidada de GeoJSON. Los componentes de la página trabajan con propiedades normalizadas, como `diveSpot.name` y `diveSpot.maxDepth`.

La clase modela los datos y la aplicación delega las operaciones de catálogo, presentación y persistencia en los módulos descritos arriba. En esta versión no se usa herencia entre clases; la relación principal es el paso de los objetos `DiveSpot` entre esos módulos.

### 2.3 Flujo de datos

```text
OpenDiveMap
    │ fetch de páginas de sitios
    ▼
function.js
    │ 
    │ crea objetos DiveSpot
    ▼
index.js ──► form.js aplica búsqueda y filtros
    │                         │
    └─────────────────────────┘
                 ▼
             render.js
                 │ divide los resultados filtrados en páginas
                 ▼
          tarjetas en index.html
                 │ botón de favorito
                 ▼
          localStorage.js ──► localStorage del navegador
                 │                         │
                 └──────── favorite.js ◄───┘
                              ▼
                       favorite.html
```

Descripción del recorrido:

1. `index.js` solicita los puntos a las funciones de `function.js`.
2. `function.js` realiza la petición con `fetch`. La respuesta es una colección GeoJSON y los sitios se encuentran en `features`.
3. Cada `feature` se transforma en un objeto `DiveSpot`, leyendo sus datos desde `feature.properties` y los campos adicionales desde `properties.tags` cuando existen.
4. `form.js` obtiene los valores del formulario. Los filtros activos se combinan: el sitio debe coincidir con todos los criterios seleccionados. Si un criterio está vacío o seleccionado como “todos”, no descarta resultados.
5. `render.js` calcula el número de páginas a partir del array filtrado, selecciona los elementos de la página actual y crea las tarjetas.
6. Al marcar un favorito, `localStorage.js` convierte la lista a JSON y la guarda en el navegador. `favorite.js` recupera esa lista para mostrarla en `favorite.html`.

## 3. DISEÑO Y EXPERIENCIA DE USUARIO

### 3.1 Dos páginas con objetivos claros

La aplicación separa la exploración de la colección personal de favoritos:

- **Explorar:** concentra el buscador, los filtros, la paginación y las tarjetas.
- **Favoritos:** muestra únicamente los puntos guardados y permite quitarlos.

Esta separación mantiene la pantalla de búsqueda enfocada en descubrir lugares y facilita volver a consultar los sitios seleccionados.

3.2 Búsqueda antes que navegación compleja

El formulario ofrece tres criterios relacionados con la elección de un sitio: nombre, país y profundidad. La búsqueda por nombre admite coincidencias parciales; el selector de país se construye a partir de los países presentes en los datos. La profundidad se agrupa en los niveles que define el proyecto.

Los filtros se pueden combinar. Después de cambiar los criterios, la aplicación debe volver a la primera página para evitar mostrar una página vacía que pertenecía a la búsqueda anterior. La paginación se calcula sobre los resultados filtrados, no sobre el catálogo completo.

### 3.3 Tarjetas para comparar sitios

Cada tarjeta reúne los datos principales del punto en un mismo lugar: nombre, país, entorno, profundidad, imagen y descripciones disponibles. La imagen alternativa permite mantener una presentación coherente cuando la API no aporta una miniatura.

La profundidad se usa como una clasificación orientativa para los filtros del proyecto. No sustituye los límites de certificación ni las recomendaciones de seguridad de una organización de buceo.

### 3.4 Persistencia de favoritos

`localStorage` permite que los favoritos permanezcan al recargar la página sin crear una cuenta ni necesitar un servidor propio. La información se serializa como JSON y se recupera al abrir la página de favoritos.

## 4. GESTIÓN DEL TRABAJO


| Etapa | Tarea | Resultado |
| :--- | :--- | :--- |
| **1. Planificación** | Definir el objetivo, las páginas y las funciones principales. |Alcance: exploración y favoritos. |
| **2. API y modelo** | Consultar OpenDiveMap y adaptar los datos de GeoJSON al modelo DiveSpot. | Datos listos para filtros y tarjetas. |
| **3. Interfaz** | Crear las páginas HTML, los estilos y las tarjetas dinámicas. | Vistas de exploración y favoritos. |
| **4. Búsqueda** | Añadir opciones de país, búsqueda por nombre y filtros de profundidad. | Resultados filtrables sin recargar la página. |
| **5. Paginación** | Dividir los resultados filtrados y actualizar los controles de navegación. | Navegación por páginas de resultados. |
| **6. Favoritos** | Guardar, recuperar y eliminar puntos con localStorage. | Favoritos persistentes entre recargas. |
| **7. Revisión** | Comprobar rutas, selectores del DOM y estados vacíos o sin imagen. | Ajustes y correcciones de integración. |


###4.1 DESAFÍOS TÉCNICOS Y SOLUCIONES

| Desafío | Solución aplicada o criterio usado |
| --- | --- |
| La respuesta de la API tiene estructura GeoJSON anidada. | Leer la lista desde `features` y los campos descriptivos desde `feature.properties`; revisar `properties.tags` para los datos opcionales. |
| Algunos sitios no incluyen imagen, descripción o profundidad. | Usar valores alternativos para los campos opcionales y una imagen local cuando no hay miniatura. |
| La lista de países puede contener repeticiones. | Construir opciones únicas usando el código del país como clave y mostrar el nombre en el selector. |
| Los filtros y la paginación pueden quedar desincronizados. | Aplicar los filtros antes de paginar, calcular las páginas con el tamaño del array filtrado y reiniciar a la página 1 cuando cambia la búsqueda. |
| `localStorage` solo almacena texto. | Convertir la lista de favoritos a JSON al guardar y parsearla al recuperar; buscar índices con `findIndex` al eliminar por ID. |
| Los módulos y `fetch` no funcionan al abrir el HTML como `file://`. | Ejecutar la web con un servidor local, por ejemplo Live Server en Visual Studio Code. |

##5. FLUJO DE TRABAJO CON GIT Y GITHUB

 El recorrido visible, desde los cambios iniciales hasta el cierre, es el siguiente:

```text
primer commit proyecto
  → primera fase HTML
  → estilos de cabecera y pie
  → primera llamada a la API
  → localStorage y favoritos
  → merge PR #1 a main
  → paginador
  → merge PR #2 a main
  → separación de form.js y render.js
  → filtros por nombre, país y nivel
  → merge PR #3 a main
  → diseño responsive e imagen de respaldo
  → clase DiveSpot y version 1
  → merge PR #4 a main
  → README y memoria técnica
  → limpieza de comentarios y console; nuevas imágenes
  → merge PR #5 a main
  → commit «final»
```

Los commits registran los cambios de cada etapa. Los pull requests permitieron integrar en `main` los cambios preparados desde `reibax-dev/dev`; el gráfico muestra cinco integraciones, numeradas del PR #1 al PR #5.


## 6. CONCLUSIONES

El proyecto integra varios conceptos del bootcamp en un caso concreto: modelado de datos con POO, consumo de una API, manipulación del DOM, filtros, paginación y persistencia en el navegador.

El reto principal es coordinar datos que llegan de una fuente externa con el estado de la interfaz. Normalizar cada sitio, aplicar los filtros antes de paginar y centralizar el acceso a favoritos ayuda a que cada módulo tenga una responsabilidad comprensible.

Como posibles ampliaciones quedan el mapa interactivo, pruebas automatizadas, mensajes de carga y error más completos, y una revisión de accesibilidad de etiquetas, navegación por teclado y textos alternativos.

## 7. TECNOLOGÍAS Y FUENTES DE DATOS

- HTML, CSS y JavaScript con módulos ES.
- Fetch API para las peticiones HTTP.
- `localStorage` para los favoritos.
- [OpenDiveMap](https://opendivemap.com/docs), API de sitios de buceo que entrega datos GeoJSON.

Endpoint usado por la aplicación:

```text
https://api.opendivemap.com/v1/sites/
```

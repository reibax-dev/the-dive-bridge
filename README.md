                    THE DIVE BRIDGE

## BUSCADOR DE PUNTOS DE BUCEO

Es una aplicación web para explorar puntos de buceo, creada con HTML, CSS y JavaScript. Permite consultar los sitios obtenidos desde OpenDiveMap, buscar por nombre, filtrar por país y profundidad, y guardar puntos favoritos en el navegador.

## FUNCIONALIDADES

Acciones disponibles en la aplicación:

- Consultar puntos de buceo desde la API OpenDiveMap.
- Mostrar los puntos en tarjetas con su nombre, país, entorno, profundidad, imagen y descripciones disponibles.
- Usar una imagen local cuando el punto no incluye una miniatura.
- Buscar puntos por nombre.
- Filtrar por país y por nivel de certificado de buceo.
- Recorrer los resultados con paginación, que se actualiza al cambiar los filtros.
- Añadir y quitar puntos de la lista de favoritos.
- Mantener los favoritos guardados en `localStorage` al recargar la página.

Los datos de los sitios proceden de OpenDiveMap. Los favoritos se guardan en el almacenamiento local del navegador.


## NAVEGACIÓN

1. **Explorar (`index.html`):** se muestra el catálogo de puntos de buceo.
2. **Buscar y filtrar:** se introduce un nombre o se elige un país y un nivel de certificado de buceo.
3. **Recorrer resultados:** los botones de paginación permiten avanzar o volver entre las páginas que coinciden con la búsqueda.
4. **Guardar favorito:** se pulsa el botón de favorito en una tarjeta.
5. **Favoritos (`favorite.html`):** se consultan los puntos guardados y se pueden quitar de la lista.

## ESTRUCTURA

```text

the_dive_bridge/
├── .vscode/
├── css/
│   ├── favorite.css          # Estilos de la página de favoritos
│   ├── index.css             # Estilos de la página principal
│   ├── normalize.css         # Normalización de estilos entre navegadores
│   └── style.css             # Estilos compartidos
├── img/                      # Imágenes y recursos gráficos
├── src/
│   ├── favorite.js            # Carga y renderiza los puntos favoritos
│   ├── form.js                # Búsqueda, filtros y opciones de país
│   ├── function.js            # Llamadas a la API, modelo y creación de tarjetas
│   ├── index.js               # Inicio de la página principal y paginación
│   ├── localStorage.js        # Guardado y gestión de favoritos
│   └── render.js              # Renderizado de tarjetas y páginas
├── .gitignore
├── favorite.html              # Página de favoritos
├── index.html                 # Página de exploración
└── README.md
```

## CLASES Y MÓDULOS

| Clase o módulo | Responsabilidad |
| --- | --- |
| `DiveSpot` | Representa un punto de buceo y prepara sus datos para usarlos en la aplicación. |
| `function.js` | Consulta OpenDiveMap, adapta los datos recibidos y construye las tarjetas. |
| `form.js` | Añade países al selector y filtra por nombre, país y certificado de buceo por profundidad. |
| `render.js` | Muestra las tarjetas correspondientes a la página actual. |
| `localStorage.js` | Añade, elimina y recupera favoritos del almacenamiento del navegador. |
| `index.js` | Inicializa la página principal y conecta búsqueda, filtros y paginación. |
| `favorite.js` | Recupera y muestra los favoritos en `favorite.html`.


## TECNOLOGÍAS Y API

- **HTML** para la estructura de las páginas.
- **CSS** para los estilos y la presentación adaptable.
- **JavaScript** con módulos ES para la lógica y la interacción con el DOM.
- **Fetch API** para solicitar los puntos de buceo.
- **`localStorage`** para conservar los favoritos en el navegador.
- **OpenDiveMap API** como fuente de datos de puntos de buceo.

Endpoint principal:

```text
https://api.opendivemap.com/v1/sites/
```

La documentación está disponible en [OpenDiveMap Docs](https://opendivemap.com/docs).

## FUERA DEL ALCANCE ACTUAL

- Inicio de sesión y sincronización de favoritos entre dispositivos.
- Interacción con otras APIs para mostrar mas datos e imagenes.
- Gestión de reservas o compras.
- Mapa interactivo de los puntos de buceo.

Estas funciones se pueden añadir en las siguientes fases del proyecto.

Proyecto individual del bootcamp The Bridge de full stack.

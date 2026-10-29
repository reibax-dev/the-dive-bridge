# the-dive-bridge


proyecto-buceo/
├── index.html
├── css/
│   └── styles.css
└── src/
    ├── domain/
    │   ├── DiveSite.js
    │   └── DiveSiteCatalog.js
    ├── data/
    │   └── sampleSites.js
    ├── openDiveMapApi.js
    └── main.js



    xOpenDiveMapApi ──obtiene──> DiveSite[]
                                  │
                                  ▼
                         DiveSiteCatalog
                         contiene 0..* sitios



DiveSite
Representa un punto de buceo.
Atributos
- id: string
- name: string
- country: string
- sea: string
- maxDepth: number | null — metros
- entry: string — shore, boat u other
- coordinates: [number, number] | null — longitud y latitud
Métodos
- constructor(data)
DiveSiteCatalog
Guarda y busca los puntos de buceo.
Atributo privado
- #sites: DiveSite[]
Métodos
- add(site)
- getAll()
- getById(id)
- search(term)
- filterByCountry(country)
- filterByEntry(entry)
OpenDiveMapApi
Conecta la aplicación con OpenDiveMap.
Atributo
- baseUrl: string
Método
- getSites() — descarga los sitios y los convierte en objetos DiveSite.
La interfaz y sus eventos pueden coordinarse desde main.js, sin crear más clases. Así mantienes el modelo claro y el número de clases bajo.                         
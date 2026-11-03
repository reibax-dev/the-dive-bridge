
//! Que tengo que hacer ?
// Añadir los paises al formulario que aparecen en la API
// Poder hacer una busqueda por nombre del dive spot
// filtrar por nombre, pais y nivel de certificacion
// y como extra mostrarlo un mapa interactivo.



//!  Añadir los paises al select / option
//?  Map guarda parejas de datos: el código del país y su nombre.
//?  El código va en option.value; el nombre es lo que verá la persona.

function addCountriesToSelect (diveSpots) {
    const countrySelect = document.getElementById ("diveSpot-country")
    const countries = new Map ();

    //? guarda cada pais con su codigo una sola vez en "countries"
    diveSpots.forEach ( diveSpot => { 
        if (diveSpot.countryCode && diveSpot.countryName) {
                countries.set(diveSpot.countryCode, diveSpot.countryName);
        }
    })

    //? convierte el .Map en una lista 
    const countryList = Array.from ( countries.entries());

    //? lo ordeno por nombre 
    countryList.sort( (countryA, countryB ) => {
    return countryA[1].localeCompare(countryB[1]);
    })

    //? crear un "option" en el HTML para cada pais 
    countryList.forEach(country => {
        const countryCode = country[0];
        const countryName = country[1];

        const option       = document.createElement("option");
        option.value       = countryCode;
        option.textContent = countryName;

        countrySelect.append(option);
    })
}

//!  Filtro por nombre , pais y profundidad 

function filterDiveSpots ( diveSpots) {

    const nameInput     = document.getElementById ("diveSpot-name");
    const countrySelect = document.getElementById ("diveSpot-country");
    const levelSelect   = document.getElementById ("diveSpot-level");

    const name          = nameInput.value.trim().toLowerCase();
    const country       = countrySelect.value;
    const level         = levelSelect.value;

    return diveSpots.filter(diveSpot => {
        //* filtro por el nombre 

        const matchName = name === "" || diveSpot.name.toLowerCase().includes (name);

        //* filtro por el pais

        const machCountry = country === "" || diveSpot.countryCode === country;
     

        //* comprobar el nivel por profundidad
        let machLevel       = level === 'all'

            //? si la API no da la profundidad , no podemos asignarle un nivel

            if ( level !== 'all' && diveSpot.maxDepth !== null ) {

             if ( level === "open-water") {
                machLevel = diveSpot.maxDepth <= 18;
            } else if ( level === "advance") {
                machLevel = diveSpot.maxDepth > 18 && diveSpot.maxDepth <= 30;
            } else if ( level === "divemaster") {
                machLevel = diveSpot.maxDepth > 30 && diveSpot.maxDepth <= 40;
            } else if ( level === "technical" ) {
                machLevel = diveSpot.maxDepth > 40;
            }
        }
        // para que de un resultado de diveSpots tiene que cumplir los 3 filtros 
        return matchName && machCountry && machLevel;
    })

}

export {
   addCountriesToSelect,
   filterDiveSpots 
}

//! Que tengo que hacer ?
// Añadir los paises al formulario que aparecen en la API
// Poder hacer una busqueda por nombre del dive spot
// filtrar por nombre, pais y nivel de certificacion
// y como extra mostrarlo un mapa interactivo.



//!  Añadir los paises al select / option
//?  Map guarda parejas de datos: el código del país y su nombre.
//?  El código va en option.value; el nombre es lo que verá la persona.

function addCountriesToSelect (diveSpots) {                             
    const countrySelect = document.getElementById ("diveSpot-country")  //* HTML select de paises
    const countries = new Map ();                                       //* guarda cada pais con su codigo una sola vez en "countries" 

    diveSpots.forEach ( diveSpot => {                                   //* recorre los diveSpots    
        if (diveSpot.countryCode && diveSpot.countryName) {             //* verifica que el diveSpot tenga su codigo y pais
                countries.set(diveSpot.countryCode, diveSpot.countryName);  //* codigo como clave, pais como valor, si existe el codigo, Map actualiza el pais de entrada
        }
    })

    const countryList = Array.from ( countries.entries());              //* convierte el Map en una lista Array

    
    countryList.sort( (countryA, countryB ) => {                        //* lo ordeno por nombre alfabetico
    return countryA[1].localeCompare(countryB[1]);
    })

    //? crear un "option" en el HTML para cada pais 
    countryList.forEach(country => {                                    //* rcorre el Array de paises
        const countryCode = country[0];                                 //* posicion 0 codigo
        const countryName = country[1];                                 //* posicion 1 pais que se muestra

        const option       = document.createElement("option");          //* etiqueta option
        option.value       = countryCode;                               //* valor interno select
        option.textContent = countryName;                               //* nombre pais que muestra

        countrySelect.append(option);                                   //* se le añade al select los paises
    })
}

//!  Filtro por nombre , pais y profundidad 

function filterDiveSpots ( diveSpots) {

    //? HTML formulario
    const nameInput     = document.getElementById ("diveSpot-name");
    const countrySelect = document.getElementById ("diveSpot-country");
    const levelSelect   = document.getElementById ("diveSpot-level");

    const name          = nameInput.value.trim().toLowerCase();         //* filta el nombre escrito en el formHTML
    const country       = countrySelect.value;                          //* pais seleccionado
    const level         = levelSelect.value;                            //* nivel seleccionado
    
    //? Filtro de busquedas
    return diveSpots.filter(diveSpot => {                               
        
        const matchName = name === "" || diveSpot.name.toLowerCase().includes (name);   //* filtro por el nombre 
        const machCountry = country === "" || diveSpot.countryCode === country;         //* filtro por el pais
     
        //* comprobar el nivel por profundidad
        let machLevel       = level === 'all';

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
        //? para que de un resultado de diveSpots tiene que cumplir los 3 filtros 
        return matchName && machCountry && machLevel;
    })

}

export {
   addCountriesToSelect,
   filterDiveSpots 
}
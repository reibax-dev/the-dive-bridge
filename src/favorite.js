


import { createDiveSpotCard } from "./function.js";
import { getFavoritesFromLocalStorage } from "./localStorage.js";

//! Crea la página y muestra los puntos

function init () {                                  
    const diveSpots = getFavoritesFromLocalStorage();                       //* traigo los favoritos del localStorage
    const section   = document.getElementById("favorite-points-list");      //* busca en el HTML donde añadirlos
    diveSpots.forEach((diveSpot) => {                                       //* recorre cada punto favorito
        const card  = createDiveSpotCard (diveSpot, (dS, isFavorite) => {   //* crea el card, el callback se ejecuta cuando cambia su estado de favorito
            if (!isFavorite) {                                              //* si deja de ser favorito
                card.remove();                                              //* borrar las card de favorites                 
            }
        } );
        section.append(card);                                               //* añade la card al HTML

    })
}
init();                                                                     //* ejecuta la funcion para cargar y mostrar los favoritos
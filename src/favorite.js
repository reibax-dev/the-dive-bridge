import { createDiveSpotCard } from "./function.js";
import { getFavoritesFromLocalStorage } from "./localStorage.js";

function init () {
    const diveSpots = getFavoritesFromLocalStorage();
    const section   = document.getElementById("favorite-points-list");
    diveSpots.forEach((diveSpot) => {
        const card  = createDiveSpotCard (diveSpot, (dS, isFavorite) => {
            if (!isFavorite) {          //* para borrar las card de favorites 
                card.remove();          //* si tenemos acceso a card
                // const card = document.querySelector(`.diveSpot-card [data-id = "${diveSpot.id}"]`);
                // if (card) {         //* sino card, buscar con querySelector especificamente por data-id
                //     card.remove;    //* y despues hacer un remove
                // }
            }
        } );
        section.append(card);
    })
}
init();
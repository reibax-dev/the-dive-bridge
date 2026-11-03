import { createDiveSpotCard } from "./function.js";


const diveSpotListSection = document.getElementById("diveSpot-list");
const currentPageText = document.getElementById("current-page");
const totalPagesText = document.getElementById("total-pages");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");



//! Mostrar resultados 

function renderPage(filterDiveSpots, page, limit) {
  
    //* vacia las cards que se mostraban 
    diveSpotListSection.replaceChildren();

    const totalPages = Math.ceil(filterDiveSpots.length / limit);

      //* Si no hay resultados , no mostrar nada 
      if (filterDiveSpots.length === 0) {

            currentPageText.textContent = 0;
            totalPagesText.textContent = 0;

            const message = document.createElement ("p");
            message.textContent = "Dive Spots not found";
            diveSpotListSection.append(message);

            prevButton.disabled = true;
            nextButton.disabled = true;

            return {
                page: 0,
                totalPages: 0
            }
      }

      //* Evita que la pagina actual supere el total de paginas
     if (page < 1) {
         page = 1;
     }

     if (page > totalPages) {
         page = totalPages;
     }

     currentPageText.textContent = page;
     totalPagesText.textContent = totalPages;

      //* calcula que parte del array corresponde a esta pagina
      const start = (page - 1) * limit;
      const end   = start + limit;
      const diveSpotsToShow = filterDiveSpots.slice(start, end);

      //* crea y muestra las tarjetas de esta pagina
      diveSpotsToShow.forEach(diveSpot => {
            const card = createDiveSpotCard (diveSpot);
            diveSpotListSection.append(card);
      })

      //* Activar o no los botones segun la pagina
      prevButton.disabled = page === 1;
      nextButton.disabled = page === totalPages;

     return {
        page: page,
        totalPages: totalPages
     }
};

export {
    renderPage
}
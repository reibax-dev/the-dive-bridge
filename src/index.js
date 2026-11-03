
import { getDiveSpots, getDiveSpotData, createDiveSpotCard, getCleanDiveSpot, getAllDiveSpots } from "./function.js";
import { addCountriesToSelect, filterDiveSpots } from "./form.js";
import {renderPage } from "./render.js";


const limit       = 9;
let page          = 1;
let totalPages    = 1;  //* no sabemos el numero hasta que no cargen todas, mientras pongo 1 

let allDiveSpots  = [];
let filteredDiveSpots = [];

const form = document.getElementById ("diveSpot-form");
const diveSpotListSection = document.getElementById ("diveSpot-list");
const diveSpotCountry   = document.getElementById ("diveSpot-country");
const diveSpotName      = document.getElementById ("diveSpot-name");
const diveSpotLevel     = document.getElementById ("diveSpot-level");

// se podria poner el comando para utilizar un solo listener y sacar donde se ha hecho click a paertir de ese listener
function showPage() {
      const pagination = renderPage(filteredDiveSpots, page, limit);

      page = pagination.page;
      totalPages = pagination.totalPages;
}

//? elementos que muestra por página

function getOffsetFromPage (page, limit) {
      return (page - 1) * limit;
}

// //? calcula el numero total de páginas

function getPageQuantity (totalCount, limit) {
      const totalPages = Math.ceil(totalCount / limit);
      return totalPages;
}

function setText (elementId, text) {
      const element           = document.getElementById(elementId);
      element.textContent     = text;
}

//? Formulario




//* Aplica los filtros y vuelve al principio

function applyFilters () {
      filteredDiveSpots = filterDiveSpots (allDiveSpots);
      page = 1;
      showPage ();
}

//* evenListeners de lo recogido en el formulario y los botones de paginador

function createPageListeners () {
      const prevButton = document.getElementById ("prev-button");
      const nextButton = document.getElementById ("next-button");

      form.addEventListener("submit", (event) => {
            event.preventDefault ();
            applyFilters();
      })

      prevButton.addEventListener("click", () => {
            if (page > 1) {
                  page = page - 1;
                  showPage()
            }
      })

      nextButton.addEventListener("click", () => {
            if (page < totalPages) {
                  page = page + 1;
                  showPage()
            }
      })
};

//* cargar datos y poner en marcha la pagina

async function init () {
      try {
            allDiveSpots = await getAllDiveSpots();

            addCountriesToSelect (allDiveSpots);

            filteredDiveSpots = allDiveSpots;

            createPageListeners ();
            showPage ();

      } catch (error) {
            console.error("Error in load dive spots", error);
            diveSpotListSection.textContent = "Can't load dive Spots"
      }
}
init()

//? Botones de prev y next

// function createPageListeners () {
//      const prevButton = document.getElementById ( "prev-button");
//      const nextButton = document.getElementById ( "next-button");

//       form.addEventListener("submit", function (event) {
//             event.preventDefault();
//             applyFilters();
//       });


//      prevButton.addEventListener("click", () => {
//             if (page > 1) {
//                   page -- ;
//                   nextButton.disabled = false;              
//                   if ( page === 1 ) {
//                         nextButton.disabled = true;  //* deshabilita boton
//                   }  
//                   loadPage (page, limit);     
//             } 
//      })
//      nextButton.addEventListener("click", () => {
//             if (page < totalPages) {
//                   prevButton.disabled = false ;
//                   page ++ ;
//                   setText("current-page", page);      //* pongo aqui para que cambie el numero de pag antes de que carge todo.
//                   if ( prevButton === totalPages) {
//                         nextButton.disabled = true;   //* deshabilita boton
//                   }
//                   loadPage (page, limit);   
//             }
//      })
// }

// * conseguir seccion donde se muetran

async function loadPage(page, limit) {
      const diveSpotListSection = document.getElementById("diveSpot-list");  //* Busco la seccion
      diveSpotListSection.replaceChildren(); //* vacia la seleccion para añadir una nueva

      const offset = getOffsetFromPage(page, limit);
      const diveSpots = await getDiveSpots(limit, offset);   //* llamo a la API para que me de la lista
      // console.log (diveSpots);
      totalPages = getPageQuantity(diveSpots.numberMatched, limit);
      
      setText('total-pages', totalPages);
      // setText("current-page", page);

      diveSpots.features.forEach((feature) => {                //* Para cada uno,features donde estan los datos  
      const data = getCleanDiveSpot(feature);         //* Saco los datos
      const card = createDiveSpotCard(data);          //* Creo la tarjeta
      diveSpotListSection.append(card);               //* Añado dentro de la seccion
      });
      // //? Para crear otra lista para ordenarlos antes de mostrarlos ( no es lo que busco )
      //   const results = diveSpots.map(async(features) => {    //* Lo guardo en una variable, que sera una lista de promesas
      //       return await getDiveSpotData(features.id);      //* llamo a la API para buscar los datos
      // })
      // // console.log(results)
      //   const datos = await Promise.all(results);
      //   datos.forEach(features => {
      //       const card = createDiveSpotCard ( features);
      //       diveSpotListSection.append(card)
      // })
      //   console.log(datos)
}






// addCountriesToSelect(allDiveSpots);
// createPageListeners();
// loadPage(page, limit);



// document.addEventListener("DOMContentLoaded", () => {
      // getDiveSpotData ("j7vb2y");
// })    //* Evento que se activa cuando se ha completado toda la carga del DOM, se pondria con la ejecucion de la funcion dentro , y al final 







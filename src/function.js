import { isInFavorites, toggleFavorite } from "./localStorage.js";

const API_URL = "https://api.opendivemap.com/v1/sites/";      //? mejor con "/"



//! LLamada a la API para obtener datos de los diveSpots

async function getDiveSpots(limit = 1000, offset = 0) {     //? limit cuantos pide, offset desde donde empieza
  try {
    const url = new URL(API_URL);                           //? crea URL a partir del la API
    url.searchParams.append("limit", limit);                //? cuantos queremos
    url.searchParams.append("offset", offset);              //? donde empezar
    const urlString = url.toString();                       //? convierte URl en texto para usarla en fetch
    const response = await fetch(urlString);                //? envio de peticion 
    if(!response.ok) {                                      //? sino hay respuesta
      throw new Error (`Error API : ${response.status}`);   //? indica error
    }
    const result = await response.json();                   //? convierte repuesta json a una variable

    return result;                                          //? devuelve la respuesta 

  } catch(error) {                                          //? muesta error

      console.error("Error al cargar loS dive spotS :",error );
    throw error;                                            //?throw error permite que init() en index.js detecte el problema y pueda mostrar un mensaje de error                            
  }         
}

//! Para obtener los datos de un punto , solo funciona con Ids

async function getDiveSpotData(diveSpotId) {                
  try {
    const url = new URL(API_URL+diveSpotId );               //? añade ID a la URL para los datos del diveSpot
    const urlString = url.toString();                       //? envio de peticion 
    const response = await fetch(urlString);                //? Saco los datos con el fetch
    if (!response.ok) {
      throw new Error (`Error API : ${response.status}`);
    }
    const result = await response.json();                   //? convierte repuesta json a una variable

    const diveSpot = getCleanDiveSpot(result);              //? Filtro para obtener los datos que se utilizan
    return diveSpot                                         //? devuelve los datos
  } catch (error) {

      console.error("Error al cargar el dive spot :",error );
      return [];
  }  
}

//!  Filtar Datos del Dive Spot de la API para obtener lo que quiero

class DiveSpot {                                            //? punto de buceo
      constructor ( feature ) {                             //? recibe los datos de la API
            const properties = feature.properties;          //? guarda las properties de la API
            const tags = properties.tags ?? {};             //? guardas los tags, si no devuelve algun tag usa objeto vacio para crear un error

                  this.id = properties.id;
                  this.name = properties.name;
                  this.countryName  = properties.country_name;
                  this.countryCode = properties.country_code;
                  this.environment = properties.environment;
                  this.maxDepth = properties.max_depth ?? null;
                  this.image = tags.thumbnail ?? "img/prov2.JPG";  //? si no tiene foto pone la mia 
                  this.description = tags.description ?? "Sorry, description not available";
                  this.descriptionWildlife = tags.description_wildlife ?? "Sorry, description not available";
//*  ?? es el operador de coalescencia nula. Significa: “si lo de la izquierda es null o undefined, usa lo de la derecha”.Lo pongo porque la API no me garantiza esos datos en todos los spots.//
      }
}

function getCleanDiveSpot (feature) {
      return new DiveSpot (feature);
}

//!    Función para crear un diveSpot con los datos que tengo en el DOM

function createDiveSpotCard (diveSpot, onFavorite = () => {} ) {        //* callback vacio para crear card
  const article         = document.createElement("article");            //* crear article en HTML
        article.classList.add("diveSpot-card")                          //* añade una clase para HTML
        article.dataset.id = diveSpot.id;                               

  const titleName       = document.createElement("h3");
        titleName.textContent = diveSpot.name;

  const titleCountry    = document.createElement("h4");
        titleCountry.textContent = diveSpot.countryName;

  const pEnvironment    = document.createElement("h5");
        pEnvironment.textContent = diveSpot.environment.toUpperCase();

  const pMaxDepth       = document.createElement("h5");
        pMaxDepth.textContent =` ${diveSpot.maxDepth} Meters`;

  const image           = document.createElement("img");
        image.src       = diveSpot.image;
        image.setAttribute("alt" , diveSpot.name);

  const pDescription    = document.createElement("p");
        pDescription.textContent = diveSpot.description;

  const pDescripWild    = document.createElement("p");
        pDescripWild.textContent = diveSpot.descriptionWildlife

  const favoriteButton  = document.createElement("button");
  const isFavorite      = isInFavorites (diveSpot);
      if ( isFavorite) {
            favoriteButton.classList.add("favorite-button");
            favoriteButton.textContent = "🫳🏻";
            
      } else {
            favoriteButton.textContent = "👌🏻";  
      }
      favoriteButton.addEventListener("click", () => {
            const isFavorite = toggleFavorite(diveSpot);  //* X "let result" añadido en togglefavorite

            if ( isFavorite) {
            favoriteButton.classList.add("favorite-button");
            favoriteButton.textContent = "🫳🏻";
            onFavorite ( diveSpot, true);           //* Respuesta del callback
      } else {
            favoriteButton.classList.remove("favorite-button");
            favoriteButton.textContent = "👌🏻"; 
            onFavorite ( diveSpot, false);           //* Respuesta del callback 
      }
      })
        

  article.append(image, titleName, titleCountry, pEnvironment, pMaxDepth, pDescription, pDescripWild, favoriteButton )
  return article;                         //* orden de como mostrar 
}

//? Solicitar todas ls paginas a la API para filtar los resultados para utilizarlos

async function getAllDiveSpots () {                                     //* obtiene todos los puntos de buceo
      const allFeatures = [];                                           //* Array para acumular diveSpot 

      let apiOffset     = 0;                                            //* posicion para pedir
      let isAnotherPage = true;                                         //* bucle hasta que no queden paginas 

      while (isAnotherPage) {                                           //* repite la peticion hasta la ultima pagina 
            const colection = await getDiveSpots (1000, apiOffset);     //*pide hasta 1000 diveSpots empezando desde apiOffset
            
            if (!Array.isArray (colection.features)) {                  //* comprueba que la respuesta tenga una propiedad features que sea un Array        
                  throw new Error ("Error en la respuesta de la Api");
            }

                                                                        //* Añade a la lista los puntos de esta página
      colection.features.forEach ( feature => {
            allFeatures.push (feature);
      })

                                                                        //* comprueba si la API indica que hay otra página
      isAnotherPage = colection.links.some (link => {
            return link.rel === "next";
      })

                                                                        //* Actualiza apiOffset para la siguiente petición 
      apiOffset = apiOffset + colection.numberReturned;
      }

                                                                        //* Convierte cada feature de la API al formato de filtrado y seleccion 
      const cleanDiveSpots = allFeatures.map( feature => {
            return getCleanDiveSpot ( feature );
      })
      return cleanDiveSpots;
}


export {
    getDiveSpots,
    getDiveSpotData,
    createDiveSpotCard,
    getCleanDiveSpot,
    getAllDiveSpots

}
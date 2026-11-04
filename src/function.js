import { isInFavorites, toggleFavorite, addToFavorites } from "./localStorage.js";

const API_URL = "https://api.opendivemap.com/v1/sites/";      //? mejor con "/"



//! LLamada a la API para obtener datos

async function getDiveSpots(limit = 1000, offset = 0) {     //? limit 1000 para crear el indice paises, offset para empezar desde el princ
  try {
    const url = new URL(API_URL);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);
    const urlString = url.toString();                       
    // console.log( urlString)
    const response = await fetch(urlString);                //? Saco los datos con el fetch
    if(!response.ok) {
      throw new Error (`Error API : ${response.status}`);
    }
    const result = await response.json();                   //? Los convierto a json

    return result;                                          //? Los guarda en features la API
    // console.log(result)
    // console.log(result.features[0], { depth: null })
  } catch(error) {

      console.error("Error al cargar loS dive spotS :",error );
    throw error;                                            //?throw error permite que init() en index.js detecte el problema y pueda mostrar un mensaje de error                            
  }         
}
// getDiveSpots();

//! Para obtener los datos de un punto , solo funciona con Ids

async function getDiveSpotData(diveSpotId) {                
  try {
    const url = new URL(API_URL+diveSpotId );
    const urlString = url.toString();
    const response = await fetch(urlString);                //? Saco los datos con el fetch
    if (!response.ok) {
      throw new Error (`Error API : ${response.status}`);
    }
    const result = await response.json();                   //? Los convierto a json

    const diveSpot = getCleanDiveSpot(result);              //? Filtro para obtener los datos que me interesan
    console.log(diveSpot);
    return diveSpot    
  } catch (error) {

      console.error("Error al cargar el dive spot :",error );
      return [];
  }  
}
// getDiveSpotData ();

//!  Filtar Datos del Dive Spot para obtener lo que quiero

// ? foto provisional por si no me la da la API

// class DiveImagen {
//       constructor(thumbnail) {
//             this.url = thumbnail ||  "img/prov2.JPG";
//       }
//       getImagenProv () {
//             return this.url;
//       }
// }

class DiveSpot {
      constructor ( feature ) {
            const properties = feature.properties;
            const tags = properties.tags ?? {};

                  this.id = properties.id;
                  this.name = properties.name;
                  this.countryName  = properties.country_name;
                  this.countryCode = properties.country_code;
                  this.environment = properties.environment;
                  this.maxDepth = properties.max_depth ?? null;
                  this.image = tags.thumbnail ?? "img/prov2.JPG";  //* si no tiene foto pone la mia 
                  this.description = tags.description ?? "Sorry, description not available";
                  this.descriptionWildlife = tags.description_wildlife ?? "Sorry, description not available";

      }
}

function getCleanDiveSpot (feature) {
      return new DiveSpot (feature);
}


// function getCleanDiveSpot (diveSpotData) {
//   const properties = diveSpotData.properties;  //* xk los datos estan dentro de la propiedad "properties"
//   const tags = properties.tags ?? {};         //* evito la petición adicional de getDiveSpotData para cada card.
//     return {
//       id: properties.id,
//       name: properties.name,
//       countryName : properties.country_name,
//       countryCode: properties.country_code,
//       environment : properties.environment,
//       maxDepth : properties.max_depth ?? null,
//       image : tags.thumbnail ?? "img/prov2.JPG",  //* si no tiene foto pone la mia 
//       description : tags.description ?? "Sorry, description not available",
//       descriptionWildlife : tags.description_wildlife ?? "Sorry, description not available"
    
//     }  
// }
//*  ?? es el operador de coalescencia nula. Significa: “si lo de la izquierda es null o undefined, usa lo de la derecha”.Lo pongo porque la API no me garantiza esos datos en todos los spots.//





//!    Función para crear un diveSpot con los datos que tengo en el DOM

function createDiveSpotCard (diveSpot, onFavorite = () => {} ) {        //* callback vacio
  const article         = document.createElement("article");
        article.classList.add("diveSpot-card")
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
            // const isFavorite = isInFavorites (diveSpot)
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

async function getAllDiveSpots () {
      const allFeatures = [];

      let apiOffset     = 0;
      let isAnotherPage = true;

      while (isAnotherPage) {
            const colection = await getDiveSpots (1000, apiOffset);
            
            if (!Array.isArray (colection.features)) {
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
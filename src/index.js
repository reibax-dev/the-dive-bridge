import { isInFavorites, toggleFavorite } from "./localStorage.js";

const API_URL = "https://api.opendivemap.com/v1/sites/";      //? mejor con "/"



//! LLamada a la API para obtener datos

async function getDiveSpots(limit = 9, offset = 0) {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("limit", limit);
    url.searchParams.append("offset", offset);
    const urlString = url.toString();
    // console.log( urlString)
    const response = await fetch(urlString);      //? Saco los datos
    if(!response.ok) {
      throw new Error (`Error API : ${response.status}`);
    }
    const result = await response.json();         //? Los convierto a json

    return result.features;                       //? Los guarda en features la API
    // console.log(result)
    // console.log(result.features[0], { depth: null })
  } catch(error) {

      console.error("Error al cargar loS dive spotS :",error );
      return []                                   //? captura el Error 
  } 
}
getDiveSpots();

//! Para obtener los datos de un punto , solo funciona con Ids

async function getDiveSpotData(diveSpotId) {
  try {
    const url = new URL(API_URL+diveSpotId );
    const urlString = url.toString();
    const response = await fetch(urlString);      //? Saco los datos
    if (!response.ok) {
      throw new Error (`Error API : ${response.status}`);
    }
    const result = await response.json();         //? Los convierto a json

    const diveSpot = getCleanDiveSpot(result);    //? Filtro para obtener los datos que me interesan
    console.log(diveSpot);
    return diveSpot    
  } catch (error) {

      console.error("Error al cargar el dive spot :",error );
      return [];
  }  
}
getDiveSpotData ("j7vb2y");

//!  Filtar Datos del Dive Spot para obtener lo que quiero

function getCleanDiveSpot (diveSpotData) {
  const properties = diveSpotData.properties;  //* xk los datos estan dentro de la propiedad "properties"
  const tags = properties.tags ?? {};         //* evito la petición adicional de getDiveSpotData para cada card.
    return {
      id: properties.id,
      name: properties.name,
      countryName : properties.country_name,
      environment : properties.environment,
      maxDepth : properties.max_depth ?? null,
      image : properties.tags.thumbnail ?? null,
      description : properties.tags.description ?? "Sorry, description not available",
      descriptionWildlife : properties.tags.description_wildlife ?? "Sorry, description not available"
//*  ?? es el operador de coalescencia nula. Significa: “si lo de la izquierda es null o undefined, usa lo de la derecha”.Lo pongo porque la API no me garantiza esos datos en todos los spots.
    }
}

//!    Función para crear un diveSpot con los datos que tengo en el DOM

function createDiveSpotCard (diveSpot) {
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
            favoriteButton.classList.add("favoriButton");
            favoriteButton.textContent = "🫳🏻";
      } else {
            favoriteButton.textContent = "👌🏻";  
      }
      favoriteButton.addEventListener("click", () => {
            const isFavorite = toggleFavorite(diveSpot);  //* X "let result" añadido en togglefavorite
            // const isFavorite = isInFavorites (diveSpot)
            if ( isFavorite) {
            favoriteButton.classList.add("favoriButton");
            favoriteButton.textContent = "🫳🏻";
      } else {
            favoriteButton.classList.remove("favoriButton");
            favoriteButton.textContent = "👌🏻";  
      }
      })
        

  article.append(image, titleName, titleCountry, pEnvironment, pMaxDepth, pDescription, pDescripWild, favoriteButton )
  return article;
}
async function init() {
        const diveSpotListSection = document.getElementById("diveSpot-list");  //* Busco la seccion
        const diveSpots = await getDiveSpots();             //* llamo a la API para que me de la lista
        console.log (diveSpots)
        diveSpots.forEach( (feature) => {                   //* Para cada uno,features donde estan los datos  
            const data =  getCleanDiveSpot(feature);        //* Saco los datos
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
init()



// document.addEventListener("DOMContentLoaded", () => {
      // getDiveSpotData ("j7vb2y");
// })    //* Evento que se activa cuando se ha completado toda la carga del DOM, se pondria con la ejecucion de la funcion dentro , y al final 







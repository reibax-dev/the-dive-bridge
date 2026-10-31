
import { getDiveSpots, getDiveSpotData, createDiveSpotCard, getCleanDiveSpot } from "./function.js";


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







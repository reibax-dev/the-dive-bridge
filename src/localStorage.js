//! que tengo que hacer ?
// tengo que traer los favoritos que elija
// tengo que guaradarlo
// tengo que mostrarlo
// poder borrarlo de la lista
// filtrar por pais , mar y profundidad maxima y minima
// y como extra mostrarlo un mapa interactivo.


//? sacar todos los favoritos

function getFavoritesFromLocalStorage () {       //* devolvera un string o null. O me devuelve un elemento a favo o se queda el array vacio en formato string
    const favoritesString = localStorage.getItem("favoritesSpots") || "[]";  
    const favoritesSpots  = JSON.parse(favoritesString); //* convierte un string formato json a un array con objetos
    return favoritesSpots;
}
//? sirve para guardar todos los favoritos

    //* cuando sea un Array de elementos , guardar el Array completo en vez de guardar un registro por cada elemento
function savefavoritesToLocalStorage (favoritesSpots) {
    const favoritesString = JSON.stringify(favoritesSpots);
    localStorage.setItem("favoritesSpots", favoritesString);
}

//?  Añadir un elemento a favoritos 

function addToFavorites (element) {
    const favoritesSpots = getFavoritesFromLocalStorage();
    const oldFavorite = favoritesSpots.find( f => f.id === element.id );  //* busca y si lo encuentra entrega el elemento en su posición de id
    if (!oldFavorite ) {          //* si la respuesta es -1 , no existia ese elemento en el array
        favoritesSpots.push(element);       //* lo añadimos
        savefavoritesToLocalStorage( favoritesSpots)           //* almacenamos
    } 
}

//? Borramos elemento

function removeFavorite (element) {
    const favoritesSpots = getFavoritesFromLocalStorage();
    const oldFavoriteIndex = favoritesSpots.findIndex( f => f.id === element.id );  //* busca y si lo encuentra entrega el elemento en su posición de id
    if (oldFavoriteIndex !== -1) {                          //* si la respuesta es -1 , no existia ese elemento en el array
        favoritesSpots.splice(oldFavoriteIndex, 1)          //* quitamos 1 elemento a partir de ese indice
              
    }
    savefavoritesToLocalStorage( favoritesSpots)           //* almacenamos
}

//? Limpiamos el Array de los favoritos

function clearFavorites () {
    localStorage.setItem("favoritesSpots", "[]")
}
 
//?  Si esta aborta, y lo borra

function toggleFavorite (element) {
    const favoritesSpots = getFavoritesFromLocalStorage();
    const oldFavoriteIndex = favoritesSpots.findIndex( f => f.id === element.id );  //* busca y si lo encuentra entrega el elemento en su posición de id
    let result = false ;

    if (oldFavoriteIndex === -1) {          //* si la respuesta es -1 , no existia ese elemento en el array
        favoritesSpots.push(element);       //* lo añadimos
        result = true ;
    } else {
        favoritesSpots.splice(oldFavoriteIndex, 1)       //* quitamos 1 elemento a partir de ese indice
    }
    savefavoritesToLocalStorage( favoritesSpots)           //* almacenamos
    return result ;
}

//? Comprobar si existe en favoritos o no

function isInFavorites (element) {
    const favoritesSpots = getFavoritesFromLocalStorage();
    const oldFavorite = favoritesSpots.find( f => f.id === element.id );
    if (oldFavorite) {
        return true ;
    } else {
        return false ;
    }
}

export {
    getFavoritesFromLocalStorage,
    savefavoritesToLocalStorage,
    addToFavorites,
    removeFavorite,
    clearFavorites,
    toggleFavorite,
    isInFavorites
}

const API_URL = "https://api.opendivemap.com/v1/sites/";



const res = await fetch("https://api.opendivemap.com/v1/sites");
const geojson = await res.json();

function getCleanDiveSite(feature) {
  const properties = feature.properties;

  return {
    id: properties.id,
    name: properties.name,
    country: properties.country_name,
    sea: properties.sea_name,
    maxDepth: properties.max_depth,
    entry: properties.entry,
    environment: properties.environment,

  };
}

const sitio = geojson.features[0];
const tags = sitio.properties?.tags ?? {};

console.log(tags.description);
console.log(tags.description_wildlife);
console.log(tags.thumbnail);
console.log(tags.ssi_url);

console.log(geojson.features.length + " dive sites");
console.log(geojson.features[0].properties.name);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v9",
  zoom: 9,
  center: coordinates,
});

const marker2 = new mapboxgl.Marker({ color: "red", rotation: 45 })
  .setLngLat(coordinates)
  .addTo(map);

const popup = new mapboxgl.Popup({
  offset: 25,
})
  .setLngLat(coordinates)
  .setHTML(`<h4>${listingLocation}</h4><p>exact location provided after booking</p>`)
  .setMaxWidth("400px")
  .addTo(map);

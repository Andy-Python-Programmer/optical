/// Mapbox access token.
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYW5keXB5dGhvbmFwcGRldmVsb3BlciIsImEiOiJja2x5cXZoejUwNHJoMm9xc2F1Z2cweXUzIn0.DQkJOVfq_JZz9u27SLbqBw";

function main() {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    var center;

    let get_started = document.getElementById("get-started");

    let geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
    });

    geocoder.addTo('#geocoder');
    geocoder.on("result", (result) => {
        center = result.result.center;

    });

    get_started.addEventListener("click", () => {
        if (center != undefined) window.location = `/cost?lat=${center[0]}&lng=${center[1]}`
    });
}

main();
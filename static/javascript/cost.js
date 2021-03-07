async function main(argv) {
    // This is the default public token. So do not be angry and open issues.
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5keXB5dGhvbmFwcGRldmVsb3BlciIsImEiOiJja2x5cXJ5ZWgxamM0MnZuNnNrZmh3MmpzIn0.kBiHFpLBNbxite7fpdoWNw';

    new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [argv.get("lat"), argv.get("lng")],
        zoom: 18
    });
}

let args = new URLSearchParams(window.location.search);
main(args);
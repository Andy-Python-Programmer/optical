const GLOBE_IMAGE_TEXTURE = "/static/images/globe.png";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5keXB5dGhvbmFwcGRldmVsb3BlciIsImEiOiJja2x5cXJ5ZWgxamM0MnZuNnNrZmh3MmpzIn0.kBiHFpLBNbxite7fpdoWNw';

    var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
    });

    geocoder.addTo('#geocoder');

    let data = await (await fetch("/static/geo.json")).json();
    let target_country;

    const canvas = document.getElementById("canvas");

    let go = document.getElementById("go");

    let features_vector = {};

    for (let i = 0; i < data.features.length; i++) {
        const country = data.features[i].properties.NAME;

        features_vector[country] = [data.features[i]]
    }

    let earth = Globe()(canvas)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.3)
        .hexPolygonLabel(({ properties: d }) => {
            return `<b>${d.NAME}</b>`;
        })
        .hexPolygonColor(() => `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`)
        .globeImageUrl(GLOBE_IMAGE_TEXTURE);

    earth.controls().autoRotate = true;
    earth.controls().autoRotateSpeed = -0.3;

    let cords;
    let res;

    geocoder.on("result", (result) => {
        res = result.result.center;

        result.result.context.forEach(element => {
            if (element.id.startsWith("country")) {
                target_country = element.text;
            }
        });

        console.log(target_country);

        let country_data = features_vector[target_country];
        cords = country_data[0]["geometry"]["coordinates"];

        while (true) {
            cords = cords[0];

            if (typeof cords[0] == "number") {
                break;
            }
        }

        earth
            .hexPolygonsData(country_data)
            .pointOfView({
                "lng": cords[0],
                "lat": cords[1],
            }, 3000);
    });

    go.addEventListener("click", async () => {
        earth.pointOfView({
            "lng": cords[0],
            "lat": cords[1],
            "altitude": 1
        }, 3000);

        await sleep(3000);

        window.location.replace(`/cost?lat=${res[0]}&lng=${res[1]}`)
    });

    // Make the our earth responsive :D
    window.addEventListener('resize', (event) => {
        earth.width([event.target.innerWidth]);
        earth.height([event.target.innerHeight]);
    });
}

main();
const GLOBE_IMAGE_TEXTURE = "/static/images/globe.png";

async function main() {
    let data = await (await fetch("/static/geo.json")).json();

    const canvas = document.getElementById("canvas");

    let country_selector = document.getElementById("country-select");
    let features_vector = {};

    for (let i = 0; i < data.features.length; i++) {
        const country = data.features[i].properties.NAME;

        country_selector.innerHTML += `<option value="${country}">${country}</option>`;
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

    country_selector.addEventListener("change", (event) => {
        const target_country = event.target.value;

        let country_data = features_vector[target_country];
        let cords = country_data[0]["geometry"]["coordinates"];

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
            });
    });


    // Make the our earth responsive :D
    window.addEventListener('resize', (event) => {
        earth.width([event.target.innerWidth]);
        earth.height([event.target.innerHeight]);
    });
}

main();
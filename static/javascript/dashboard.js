const GLOBE_IMAGE_TEXTURE = "/static/images/globe.png";

let data;

function get_country_data(target_country) {
    for (let i = 0; i < data.features.length; i++) {
        const country = data.features[i].properties.NAME;

        if (target_country == country) {
            return [data.features[i]]
        }
    }
}

async function main() {
    data = await (await fetch("/static/geo.json")).json();

    const main = document.getElementById("main");
    const country_data = get_country_data("Australia");

    let earth = Globe()(main)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.3)
        .hexPolygonLabel(({ properties: d }) => {
            return `<b>${d.NAME}</b>`;
        })
        .hexPolygonsData(country_data)
        .hexPolygonColor(() => `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`)
        .globeImageUrl(GLOBE_IMAGE_TEXTURE);

    earth.pointOfView({
        "lng": country_data[0]["geometry"]["coordinates"][0][0][0][0],
        "lat": country_data[0]["geometry"]["coordinates"][0][0][0][1],
    });

    // Make the our earth responsive :D
    window.addEventListener('resize', (event) => {
        earth.width([event.target.innerWidth]);
        earth.height([event.target.innerHeight]);
    });
}

main();
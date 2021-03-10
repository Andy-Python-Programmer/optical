/// The zoom level for the map.
const DEFAULT_MAP_ZOOM = 18;
/// The default map style.
const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/satellite-v9";
/// Mapbox access token.
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYW5keXB5dGhvbmFwcGRldmVsb3BlciIsImEiOiJja2x5cXZoejUwNHJoMm9xc2F1Z2cweXUzIn0.DQkJOVfq_JZz9u27SLbqBw";

(
    async () => {
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    }
)();

async function main_res(area) {
    let panels_c = document.getElementById("panels-count");

    let panel_count = Math.round(area / 1.7);

    console.log(`Roof Area: ${area}`);
    console.log(`You can fit around ${panel_count} panels.`)

    panels_c.innerHTML = `${panel_count} solar panels.`;
}

async function main(argv) {
    let center = [argv.get("lat"), argv.get("lng")];

    let map_config = {
        "container": "map",
        "center": center,
        "style": DEFAULT_MAP_STYLE,
        "zoom": DEFAULT_MAP_ZOOM,
    };

    let overlay_config = {
        "displayControlsDefault": false,
        "controls": {
            "polygon": true,
            "trash": true
        }
    };

    let map = window.map = new mapboxgl.Map(map_config);

    let draw = new MapboxDraw(overlay_config);

    map.addControl(draw);

    map.on("draw.create", updateArea);
    map.on("draw.delete", updateArea);
    map.on("draw.update", updateArea);

    var area;

    let calc_next = document.getElementById("calc-next");
    let answer = document.getElementById("calculated-area");

    let calc = document.getElementById("calc");
    let calc_res = document.getElementById("calc-res");

    let updateArea = () => {
        var data = draw.getAll();

        if (data.features.length > 0) {
            const area_t = turf.area(data);
            const rounded_area = Math.round(area_t * 100) / 100;

            area = rounded_area;
            calc_next.style.display = "initial";

            answer.innerHTML = `<p>Your roof area is around: <strong>${rounded_area}</strong> square meters.`;
        } else {
            area = undefined;
            calc_next.style.display = "none";

            answer.innerHTML = "";
        }
    }

    calc_next.addEventListener("click", () => {
        calc.style.display = "none";
        calc_res.style.display = "initial";

        main_res(area);
    });
}

main(new URLSearchParams(window.location.search));
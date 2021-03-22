/// The zoom level for the map.
const DEFAULT_MAP_ZOOM = 18;
/// The default map style.
const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/satellite-v9";
/// Mapbox access token.
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYW5keXB5dGhvbmFwcGRldmVsb3BlciIsImEiOiJja2x5cXZoejUwNHJoMm9xc2F1Z2cweXUzIn0.DQkJOVfq_JZz9u27SLbqBw";

async function main(argv) {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

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

    function updateArea() {
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
        if (area != undefined) window.location = `/result?area=${area}&lat=${argv.get("lat")}&lng=${argv.get("lng")}`;
    });

    let explain = new Tour({
        backdrop: true, storage: false, steps: [
            {
                element: ".mapbox-gl-draw_polygon",
                title: "Draw around your roof area",
                content: "Click on the draw button to start drawing",
                placement: "left"
            },
        ]
    });

    explain.init();
    explain.start();

    // localStorage.clear();
}

main(new URLSearchParams(window.location.search));
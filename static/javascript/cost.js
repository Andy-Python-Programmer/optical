(
    // Init.
    async () => { }
)();

async function main_res(area) {
    let panels_c = document.getElementById("panels-count");

    console.log(`Roof Area: ${area}`);
    console.log(`You can fit around ${Math.round(area / 1.7)} panels.`)

    panels_c.innerHTML = `${Math.round(area / 1.7)} solar panels.`;
}

async function main(argv) {
    // This is the public access token. You can only access it if you are using optical :)
    mapboxgl.accessToken = "pk.eyJ1IjoiYW5keXB5dGhvbmFwcGRldmVsb3BlciIsImEiOiJja2x5cXZoejUwNHJoMm9xc2F1Z2cweXUzIn0.DQkJOVfq_JZz9u27SLbqBw";

    let map = (window.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/satellite-v9",
        center: [argv.get("lat"), argv.get("lng")],
        zoom: 18,
    }));

    let calc_next = document.getElementById("calc-next");
    let answer = document.getElementById("calculated-area");


    // Sections.
    let calc = document.getElementById("calc");
    let calc_res = document.getElementById("calc-res");

    let draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true
        }
    });

    map.addControl(draw);

    map.on("draw.create", updateArea);
    map.on("draw.delete", updateArea);
    map.on("draw.update", updateArea);

    var area;

    function updateArea() {
        var data = draw.getAll();

        if (data.features.length > 0) {
            const area_t = turf.area(data);
            const rounded_area = Math.round(area_t * 100) / 100;

            area = rounded_area;
            answer.innerHTML = `<p>Your roof area is around: <strong>${rounded_area}</strong> square meters.`;
            calc_next.style.display = "initial";
        } else {
            area = undefined;
            answer.innerHTML = "";
            calc_next.style.display = "none";
        }
    }

    calc_next.addEventListener("click", () => {
        calc.style.display = "none";
        calc_res.style.display = "initial";

        main_res(area);
    });
}

let args = new URLSearchParams(window.location.search);
main(args);
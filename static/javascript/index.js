/// Mapbox access token.
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYW5keXB5dGhvbmFwcGRldmVsb3BlciIsImEiOiJja2x5cXZoejUwNHJoMm9xc2F1Z2cweXUzIn0.DQkJOVfq_JZz9u27SLbqBw";

/// The main entry point.
function main() {
    let intro_section = document.getElementById("intro-section");
    let top_button = document.getElementById("top-button");
    let start_saving = document.getElementById("start-saving");

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > intro_section.style.height) {
            if (!top_button.classList.contains("btnEntrance")) {
                top_button.classList.remove("btnExit");
                top_button.classList.add("btnEntrance");
                top_button.style.display = "initial";
            }
        } else {
            if (top_button.classList.contains("btnEntrance")) {
                top_button.classList.remove("btnEntrance");
                top_button.classList.add("btnExit");

                setTimeout(() => {
                    top_button.style.display = "none";
                }, 250);
            }
        }
    });

    top_button.addEventListener("click", scroll_to_the_top);
    start_saving.addEventListener("click", scroll_to_the_top);

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
        if (center != undefined) window.location = `/main?lat=${center[0]}&lng=${center[1]}`
    });
}

main();

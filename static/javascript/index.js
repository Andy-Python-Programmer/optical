/// Mapbox access token.
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiYW5keXB5dGhvbmFwcGRldmVsb3BlciIsImEiOiJja2x5cXZoejUwNHJoMm9xc2F1Z2cweXUzIn0.DQkJOVfq_JZz9u27SLbqBw";

/// Simple calculations for the ease in out cubic animation.
function ease_in_out_cubic(time, start, change, duration) {
    time /= duration / 2;

    if (time < 1) return change / 2 * time * time * time + start;
    time -= 2;

    return change / 2 * (time * time * time + 2) + start;
};

function scroll_to_the_top() {
    const targetPosition = 0;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 750;
    let start = null;

    window.requestAnimationFrame(step);

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        window.scrollTo(0, ease_in_out_cubic(progress, startPosition, distance, duration));
        if (progress < duration) window.requestAnimationFrame(step);
    }
}

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
        if (center != undefined) window.location = `/cost?lat=${center[0]}&lng=${center[1]}`
    });
}

main();

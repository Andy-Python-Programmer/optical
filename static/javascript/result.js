/// Power watts of one solar panel.
let power_w = 320;
let clear_c = 0;

let power_watts_res;

function render(panel_c) {
    power_watts_res.innerHTML = `${power_w * panel_c}W`;
}

async function main(argv) {
    const lat = argv.get("lat");
    const lng = argv.get("lng");
    const area = argv.get("area");

    let res_api = await fetch(`/api/result/${lng}/${lat}`);
    let res_json = await res_api.json();

    clear_c = res_json["clear"];

    var elems = document.querySelectorAll(".destroy-all");

    [].forEach.call(elems, function (el) {
        el.classList.remove("loading");
    });

    let calc_t = document.getElementById("calc-total");
    let panel_count = Math.round(area / 1.7);

    calc_t.innerHTML = `
        <i class="bi bi-check2-circle" style="color: #1AA260"></i>
        Analysis complete. Your roof can fit around ${panel_count} solar panels on your roof top.
    `;

    document.getElementById("res-card").innerHTML += `
        <div>
            <h3 style="display: inline-block"><i class="bi bi-plug"></i></h3>
            <h5 style="display: inline-block" id="power_w">${power_w}</h5>
            <p class="text-muted">Of electricity</p>
        </div>
        <div>
            <h3 style="display: inline-block"><i class="bi bi-sun"></i></h3>
            <h5 style="display: inline-block" id="clear_c">${clear_c * 24}</h5>
            <p class="text-muted">Hours of usuable sunlight</p>
        </div>
    `;

    power_watts_res = document.getElementById("power_w");

    console.log(`Roof Area: ${area}`);
    console.log(`You can fit around ${panel_count} panels.`)

    let intro_section = document.getElementById("intro-section");

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

    let power_w_selector = document.getElementById("power_w_selector");

    power_w_selector.addEventListener("change", () => {
        let watts = String(power_w_selector.value);
        watts = parseInt(watts.substring(0, watts.length - 1));

        power_w = watts;
        render(panel_count);
    });

    render(panel_count);
}

main(new URLSearchParams(window.location.search));
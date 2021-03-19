/// Power watts of one solar panel.
let power_w = 320;

let power_watts_res = document.getElementById("power_w");

function render(calc_t, panel_c) {
    calc_t.innerHTML = `You can fit around ${panel_c} solar panels on your roof top.`;

    power_watts_res.innerHTML = `Power: ${power_w * panel_c}W`;
}

function main(argv) {
    const area = argv.get("area");

    let calc_t = document.getElementById("calc-total");
    let panel_count = Math.round(area / 1.7);

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
        render(calc_t, panel_count);
    });

    render(calc_t, panel_count);
}

main(new URLSearchParams(window.location.search));
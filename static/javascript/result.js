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

    let chart_sun = res_json["chart"];

    let d1 = new Date(1000 * chart_sun[0]);
    let d2 = new Date(1000 * chart_sun[1]);

    console.log(d1, d2);

    chart_sun = d2.getTime() - d1.getTime();
    chart_sun = [Math.round(chart_sun / 60000)];

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
            <h3 style="display: inline-block"><i class="bi bi-house"></i></h3>
            <h5 style="display: inline-block">${area}m²</h5>
            <p class="text-muted">Avaliable for your solar panels</p>
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

    let sun_chart = document.getElementById("chart-sun");
    sun_chart.height = 50;

    new Chart(sun_chart, {
        type: "horizontalBar",
        data: {
            labels: ["Today"],
            datasets: [{
                label: "Amount of sunlight recieved on your roof top",
                backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)"],
                borderColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)"],
                data: chart_sun,
                borderWidth: 1
            }],
        },
        options: {
            scales: {
                xAxes: [
                    {
                        ticks: {
                            callback: function (value) {
                                return value + " min";
                            },
                        }
                    },
                ],
            },
        }

    });

    document.getElementById("download").addEventListener('click', function () {
        var url_base64jp = document.getElementById("chart-sun").toDataURL("image/jpg");
        var a = document.getElementById("download");
        a.href = url_base64jp;
    });

    render(panel_count);
}

main(new URLSearchParams(window.location.search));
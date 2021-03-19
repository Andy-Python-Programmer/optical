async function main_res(area) {
    let calc_t = document.getElementById("calc-total");

    let panel_count = Math.round(area / 1.7);

    console.log(`Roof Area: ${area}`);
    console.log(`You can fit around ${panel_count} panels.`)

    calc_t.innerHTML = `You can fit around ${panel_count} solar panelson your roof top`;
}


function main(argv) {
    const area = argv.get("area");

    main_res(area);
}

main(new URLSearchParams(window.location.search));
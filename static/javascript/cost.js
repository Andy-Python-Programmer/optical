async function main(argv) {
    const target_country = argv.get("country");

    console.log(target_country);
}

let args = new URLSearchParams(window.location.search);
main(args);
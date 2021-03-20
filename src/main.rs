#![feature(proc_macro_hygiene, decl_macro)]

mod routes;

use std::{env, path::PathBuf};

use lazy_static::lazy_static;
use rocket::*;

lazy_static! {
    pub static ref PUBLIC_PATH: PathBuf = PathBuf::from("./public/");
    pub static ref OPEN_WEATHER_MAP_KEY: String =
        env::var("OPEN_WEATHER_MAP_KEY").expect("Optical requires open weather map to operate.");
}

fn main() {
    dotenv::dotenv().ok();

    let routes = routes![
        routes::index::get,
        routes::contact::get,
        routes::public::get,
        routes::dashboard::get,
        routes::main::get,
        routes::result::get,
        // API routes
        routes::api::result::get
    ];

    rocket::ignite().mount("/", routes).launch();
}

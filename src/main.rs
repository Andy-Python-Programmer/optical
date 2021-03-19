#![feature(proc_macro_hygiene, decl_macro)]

mod routes;

use std::path::PathBuf;

use lazy_static::lazy_static;
use rocket::*;

lazy_static! {
    pub static ref PUBLIC_PATH: PathBuf = PathBuf::from("./public/");
}

fn main() {
    let routes = routes![
        routes::index::get,
        routes::contact::get,
        routes::public::get,
        routes::dashboard::get,
        routes::main::get,
        routes::result::get,
    ];

    rocket::ignite().mount("/", routes).launch();
}

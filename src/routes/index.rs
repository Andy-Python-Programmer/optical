use rocket::response::NamedFile;
use rocket::*;

use crate::PUBLIC_PATH;

#[get("/")]
pub fn get() -> Option<NamedFile> {
    NamedFile::open(PUBLIC_PATH.join("index.html")).ok()
}

use rocket::response::NamedFile;
use rocket::*;

use crate::PUBLIC_PATH;

#[get("/main")]
pub fn get() -> Option<NamedFile> {
    NamedFile::open(PUBLIC_PATH.join("main.html")).ok()
}

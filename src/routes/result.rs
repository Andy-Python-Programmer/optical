use rocket::response::NamedFile;
use rocket::*;

use crate::PUBLIC_PATH;

#[get("/result")]
pub fn get() -> Option<NamedFile> {
    NamedFile::open(PUBLIC_PATH.join("result.html")).ok()
}

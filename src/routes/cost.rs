use rocket::response::NamedFile;
use rocket::*;

use crate::PUBLIC_PATH;

#[get("/cost")]
pub fn get() -> Option<NamedFile> {
    NamedFile::open(PUBLIC_PATH.join("cost.html")).ok()
}

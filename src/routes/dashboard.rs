use rocket::response::NamedFile;
use rocket::*;

use crate::PUBLIC_PATH;

#[get("/dashboard")]
pub fn get() -> Option<NamedFile> {
    NamedFile::open(PUBLIC_PATH.join("dashboard.html")).ok()
}

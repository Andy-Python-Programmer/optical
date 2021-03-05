use rocket::response::NamedFile;
use rocket::*;

use crate::PUBLIC_PATH;

#[get("/contact")]
pub fn get() -> Option<NamedFile> {
    NamedFile::open(PUBLIC_PATH.join("contact.html")).ok()
}

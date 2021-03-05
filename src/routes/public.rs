use std::path::{Path, PathBuf};

use rocket::response::NamedFile;
use rocket::*;

#[get("/static/<file..>")]
pub fn get(file: PathBuf) -> Option<NamedFile> {
    let path = Path::new("static").join(file);

    NamedFile::open(path).ok()
}

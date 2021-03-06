use std::path::{Path, PathBuf};

use rocket::response::NamedFile;
use rocket::*;

#[get("/static/<file..>")]
pub fn get(file: PathBuf) -> Result<NamedFile, String> {
    if file.to_string_lossy().contains("private") {
        return Err("Access Denied".into());
    }

    let path = Path::new("static").join(file);

    match NamedFile::open(path) {
        Ok(file) => Ok(file),
        Err(_) => Err("File not found.".into()),
    }
}

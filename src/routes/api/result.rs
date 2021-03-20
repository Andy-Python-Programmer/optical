use crate::OPEN_WEATHER_MAP_KEY;

use requests::ToJson;
use rocket::*;

use json::JsonValue;

#[get("/api/result/<lat>/<lng>")]
pub fn get(lat: f64, lng: f64) -> rocket_contrib::json::JsonValue {
    dbg!(lat, lng);

    let weather = requests::get(format!(
        "https://api.openweathermap.org/data/2.5/forecast?lat={}&lon={}&appid={}&cnt={}",
        lat, lng, *OPEN_WEATHER_MAP_KEY, 16
    ))
    .unwrap()
    .json()
    .unwrap();

    let data = if let JsonValue::Array(array) = &weather["list"] {
        array
    } else {
        panic!("Expected data");
    };

    let mut clear_count: u8 = 0;

    for data in data {
        let forecast = if let JsonValue::Short(short) = &data["weather"][0]["main"] {
            short.as_str()
        } else {
            panic!("Expected forecast found: {:?}", &data["weather"][0]["main"]);
        };

        if forecast == "Clear" {
            clear_count += 1;
        } else {
            println!("{}", forecast)
        }
    }

    println!();
    println!("Clear for {} days", clear_count);

    rocket_contrib::json!({ "clear": clear_count })
}

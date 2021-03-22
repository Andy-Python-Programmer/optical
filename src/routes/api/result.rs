use crate::OPEN_WEATHER_MAP_KEY;

use rocket::*;

use rocket_contrib::json;
use rocket_contrib::json::JsonValue;
use serde_json::Value;

#[get("/api/result/<lat>/<lng>")]
pub fn get(lat: f64, lng: f64) -> JsonValue {
    dbg!(lat, lng);

    let weather = ureq::get(
        format!(
            "https://api.openweathermap.org/data/2.5/forecast?lat={}&lon={}&appid={}&cnt={}",
            lat, lng, *OPEN_WEATHER_MAP_KEY, 16
        )
        .as_str(),
    )
    .call()
    .unwrap()
    .into_json::<Value>()
    .unwrap();

    let today = ureq::get(
        format!(
            "https://api.openweathermap.org/data/2.5/weather?lat={}&lon={}&appid={}",
            lat, lng, *OPEN_WEATHER_MAP_KEY
        )
        .as_str(),
    )
    .call()
    .unwrap()
    .into_json::<Value>()
    .unwrap();

    let data = if let Value::Array(array) = &weather["list"] {
        array
    } else {
        panic!("Expected data");
    };

    let mut clear_count = 0;
    let mut chart = vec![];

    let sunrise = if let Value::Number(num) = &today["sys"]["sunrise"] {
        num.as_f64().unwrap()
    } else {
        0.0
    };

    let sunset = if let Value::Number(num) = &today["sys"]["sunset"] {
        num.as_f64().unwrap()
    } else {
        0.0
    };

    chart.push(sunset - sunrise);

    for (i, data) in data.iter().enumerate() {
        if i <= 7 {
            let forecast = if let Value::String(str) = &data["weather"][0]["main"] {
                str.as_str()
            } else {
                panic!("Expected forecast found: {:?}", &data["weather"][0]["main"]);
            };

            let description = if let Value::String(str) = &data["weather"][0]["description"] {
                str.as_str()
            } else {
                ""
            };

            if forecast == "Clear"
                || description == "broken clouds"
                || description == "scattered clouds"
                || description == "few clouds"
            {
                clear_count += 1;
            }
        }
    }

    println!("chart: {:#?}", chart);
    println!("Clear for {} days", clear_count);

    json!({ "clear": clear_count, "chart": chart })
}

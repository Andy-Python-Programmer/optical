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
    let mut chart = vec![];

    for (i, data) in data.iter().enumerate() {
        let temp = if let JsonValue::Number(num) = &data["main"]["temp_max"] {
            (*num).into()
        } else {
            0.0
        } - 273.15;

        let forecast = if let JsonValue::Short(short) = &data["weather"][0]["main"] {
            short.as_str()
        } else {
            panic!("Expected forecast found: {:?}", &data["weather"][0]["main"]);
        };

        let description = if let JsonValue::Short(short) = &data["weather"][0]["description"] {
            short.as_str()
        } else {
            ""
        };

        if i <= 7 {
            // Big brain maths 🧠
            if forecast == "Clear" {
                if temp >= 35.0 {
                    chart.push(100);
                } else {
                    chart.push(90);
                }
            } else if description == "broken clouds"
                || description == "scattered clouds"
                || description == "few clouds"
            {
                if temp >= 35.0 {
                    chart.push(95);
                } else {
                    chart.push(80);
                }
            } else if description == "light rain" {
                if temp <= 32.0 {
                    chart.push(60);
                } else {
                    chart.push(50);
                }
            } else {
                if temp <= 25.0 {
                    chart.push(40);
                } else {
                    chart.push(5);
                }
            }

            println!("{}", temp);

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

    rocket_contrib::json!({ "clear": clear_count, "chart": chart })
}

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


let token = process.env.Api_KEY;
const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: ` Bearer  ${token}`
    }
  };

  module.exports.fetchWeather = (town) => {
    let city = {
        lon: town.lon,
        lat: town.lat
    }
    const apiUrl = process.env.WeatherUrl;
    return new Promise((resolve, reject) => {
        let meteoTemp = "";
        let meteoDescription = "";

        fetch(apiUrl + `${city.lat}&${city.lon}&units=metric&exclude=hourly,daily&appid=${token}`, options)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log("DATA ---> : ", data);
                const currentWeather = data.current;

                if (currentWeather) {
                    meteoTemp = currentWeather.temp || "";
                    const weatherDescription = currentWeather.weather;
                    meteoDescription = weatherDescription ? weatherDescription[0].description : "";
                    resolve({ meteoTemp, meteoDescription });
                } else {
                    reject(new Error("Données météo actuelles non disponibles ."));
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
                reject(error);
            });
    });
};


// exemple de data recupérer de l'api 

// {
//     "lat":33.44,
//     "lon":-94.04,
//     "timezone":"America/Chicago",
//     "timezone_offset":-18000,
//     "current":{
//        "dt":1684929490,
//        "sunrise":1684926645,
//        "sunset":1684977332,
//        "temp":292.55,
//        "feels_like":292.87,
//        "pressure":1014,
//        "humidity":89,
//        "dew_point":290.69,
//        "uvi":0.16,
//        "clouds":53,
//        "visibility":10000,
//        "wind_speed":3.13,
//        "wind_deg":93,
//        "wind_gust":6.71,
//        "weather":[
//           {
//              "id":803,
//              "main":"Clouds",
//              "description":"broken clouds",
//              "icon":"04d"
//           }
//        ]
//     },
//     "minutely":[
//        {
//           "dt":1684929540,
//           "precipitation":0
//        },
//        ...
//     ],
// }

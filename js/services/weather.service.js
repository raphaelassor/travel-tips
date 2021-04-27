export const weatherService={
    getWeather
}

const W_API_KEY = 'f84e1586c1fdb8518a00de46a0678e41'
const gDemo = {
    "coord": { "lon": 139, "lat": 35 },
    "weather": [
        {
            "id": 800,
            "main": "Clear",
            "description": "clear sky",
            "icon": "01n"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 281.52,
        "feels_like": 278.99,
        "temp_min": 280.15,
        "temp_max": 283.71,
        "pressure": 1016,
        "humidity": 93
    },
    "wind": {
        "speed": 0.47,
        "deg": 107.538
    },
    "clouds": {
        "all": 2
    },
    "dt": 1560350192,
    "sys": {
        "type": 3,
        "id": 2019346,
        "message": 0.0065,
        "country": "JP",
        "sunrise": 1560281377,
        "sunset": 1560333478
    },
    "timezone": 32400,
    "id": 1851632,
    "name": "Shuzenji",
    "cod": 200
}


function getWeather(pos) {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.lat}&lon=${pos.lng}&units=metric&appid=7d40cd19c56957fa23f5daa35fd85a33`)
        .then(res => {
            const weather={
                temp:res.data.main.temp,
                desc:res.data.weather[0].description,
                wind:res.data.wind.speed,
            }
            return weather;
        })
        .catch(err=>console.log('error getting weather',err))

        // const weather={
        //     temp:gDemo.main.temp,
        //     desc:gDemo.weather[0].description,
        //     wind:gDemo.wind.speed,
        // }
       
        // return Promise.resolve(weather);
}


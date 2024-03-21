
ymaps.ready(init);

function init(){ 
    let myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 7
    });

    fetch('https://ipinfo.io?token=97731e9d1ffdcd')
    .then(response => response.json())
    .then(data => {
        let loc = data.loc.split(',');
        myMap.setCenter([parseFloat(loc[0]), parseFloat(loc[1])], 10);
    })
    .catch(error => console.error('Ошибка при получении данных о местоположении:', error));

    const searchInput = document.querySelector('.header__input');
    const searchBtn = document.querySelector('.header__form_btn');

    searchBtn.addEventListener('click', function () {
        let city = searchInput.value;

        ymaps.geocode(city)
            .then(function (res) {
                let firstGeoObject = res.geoObjects.get(0);
                let coords = firstGeoObject.geometry.getCoordinates();
                myMap.setCenter(coords, 10);
            })
            .catch(function (error) {
                console.error('Ошибка при геокодировании:', error);
            });
    });
};


function updateDateTime() {
    const dateTimeElement = document.querySelector('.main__date');

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const now = new Date();
    const dayOfWeek = daysOfWeek[now.getDay()];
    const dayOfMonth = now.getDate();
    const month = monthsOfYear[now.getMonth()];
    
    const time = now.toLocaleTimeString();

    dateTimeElement.textContent = `${dayOfWeek} ${dayOfMonth} ${month} ${time}`;
};

setInterval(updateDateTime, 1000);


// Получение местоположения пользователя
function getWeather() {
    fetch('https://ipinfo.io/?token=97731e9d1ffdcd')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.main__city').innerText = `${data.city}, ${data.country}`;

            const [latitude, longitude] = data.loc.split(',');
            document.querySelector('.map__latitude').innerText = `Latitude: ${latitude}`;
            document.querySelector('.map__longitude').innerText = `Longitude: ${longitude}`;

            // Погода на сегодня
            fetch(`https://api.weatherapi.com/v1/current.json?key=f913aa13721c43af81b125706240903&q=${data.loc}`)
            .then(response => response.json())
            .then(data => {
                document.querySelector('.weather__value').innerText = `${data.current.temp_c}°`;
                document.querySelector('.weather__img').src = `https:${data.current.condition.icon}`;
                document.querySelector('.weather__img').alt=`"Weather Icon"`;
                document.querySelector('.description').innerText = `${data.current.condition.text}`;
                document.querySelector('.feels_like').innerText = `Feels like: ${data.current.feelslike_c}°C`;
                document.querySelector('.wind').innerText = `Wind: ${data.current.wind_kph} km/h`;
                document.querySelector('.humidity').innerText = `Humidity: ${data.current.humidity}%`;

                const celsius = document.querySelector('.header__btn_C');
                const farenheit = document.querySelector('.header__btn_F');

                farenheit.addEventListener('click', () => {
                    document.querySelector('.weather__value').innerText = Math.round(data.current.temp_f);
                    document.querySelector('.feels_like').innerText = `Feels like: ${data.current.feelslike_f}°F`;
                    document.querySelector('.header__btn_F').style.background = '#8ea2ac';
                    document.querySelector('.header__btn_C').style.background = 'rgba(255, 255, 255, 0.3)';
                });
        
                celsius.addEventListener('click', () => {
                    document.querySelector('.weather__value').innerText = Math.round(data.current.temp_c);
                    document.querySelector('.feels_like').innerText = `Feels like: ${data.current.feelslike_c}°C`;
                    document.querySelector('.header__btn_C').style.background = '#8ea2ac';
                    document.querySelector('.header__btn_F').style.background = 'rgba(255, 255, 255, 0.3)';
                });

            });   

                // Погода на три дня
                fetch(`https://api.weatherapi.com/v1/forecast.json?key=f913aa13721c43af81b125706240903&q=${data.loc}&days=3`)
                    .then(response => response.json())
                    .then(data => {
                        const forecast = data.forecast.forecastday;
                        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    
                            for (let i = 0; i < 3; i++) {
                                const date = new Date(forecast[i].date);
                                const dayOfWeek = daysOfWeek[date.getDay()];
                                const temp = forecast[i].day.avgtemp_c;
                                const icon = `https:${forecast[i].day.condition.icon}`;
                                document.querySelector(`.weather__day${i + 1}`).textContent = dayOfWeek;
                                document.querySelector(`.weather__temp${i + 1}`).textContent = `${temp}°C`;
                                document.querySelector(`.icon__days${i + 1}`).innerHTML = `<img src="${icon}" alt="Weather Icon">`;

                                const celsius = document.querySelector('.header__btn_C');
                                const farenheit = document.querySelector('.header__btn_F');
                                farenheit.addEventListener('click', () => {
                                    const temp_f = forecast[i].day.avgtemp_f;
                                    document.querySelector(`.weather__temp${i + 1}`).textContent = `${temp_f}°F`;
                                });
                            
                                celsius.addEventListener('click', () => {
                                    const temp_c = forecast[i].day.avgtemp_c;
                                    document.querySelector(`.weather__temp${i + 1}`).textContent = `${temp_c}°C`;
                                });
                            }
                    })
                    .catch ((err) => {
                        alert("Something went wrong");
                        console.log("Error fetching weather data:", err);
                });

            });
};

getWeather();


const refreshBtn = document.querySelector('#refreshBtn');

function renderBackground() {
    fetch('https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature&client_id=3weiH4JD7jfoK87qEYCgET6aTNZHosBSrkRgyPfVZ9o')
        .then(response => response.json())
        .then(data => {
            document.body.style.backgroundImage = `url(${data.urls.regular})`;
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundSize = "cover";
        });
}

refreshBtn.addEventListener('click', renderBackground);
renderBackground();
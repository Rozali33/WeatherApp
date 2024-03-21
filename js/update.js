
document.querySelector('.header__form_btn').addEventListener('click', function(event) {
    event.preventDefault();
    const searchInput = document.querySelector('.header__input').value;

    fetch(`https://api.weatherapi.com/v1/current.json?key=f913aa13721c43af81b125706240903&q=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('.main__city').innerText = `${data.location.name}, ${data.location.country}`;

            const [latitude, longitude] = [data.location.lat, data.location.lon];
            document.querySelector('.map__latitude').innerText = `Latitude: ${latitude}`;
            document.querySelector('.map__longitude').innerText = `Longitude: ${longitude}`;         

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
                    document.querySelector('.weather__value').innerText = data.current.temp_f;
                    document.querySelector('.feels_like').innerText = `Feels like: ${data.current.feelslike_f}°F`;
                    document.querySelector('.header__btn_F').style.background = '#8ea2ac';
                    document.querySelector('.header__btn_C').style.background = 'rgba(255, 255, 255, 0.3)';
                });
        
                celsius.addEventListener('click', () => {
                    document.querySelector('.weather__value').innerText = data.current.temp_c;
                    document.querySelector('.feels_like').innerText = `Feels like: ${data.current.feelslike_c}°C`;
                    document.querySelector('.header__btn_C').style.background = '#8ea2ac';
                    document.querySelector('.header__btn_F').style.background = 'rgba(255, 255, 255, 0.3)';
                });


            fetch(`https://api.weatherapi.com/v1/forecast.json?key=f913aa13721c43af81b125706240903&q=${searchInput}&days=3`)
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
                .catch((err) => {
                    alert("Something went wrong");
                    console.log("Error fetching weather data:", err);
                });
        })
        .catch((err) => {
            alert("City not found");
            console.log("Error fetching city data:", err);
        });
});
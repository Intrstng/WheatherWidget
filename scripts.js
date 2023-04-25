function WheatherWidget() {
  let widget = null;
  let showWidgetBtn = null;
  let url = null;
  let that = this;
  // latitude = null;
  // longitude = null;
}

WheatherWidget.prototype.getWeather = function() {
  this.buildHTML();
  this.addHandlers();
}

WheatherWidget.prototype.buildHTML = function() {
  widget = document.createElement('div');
  widget.id = 'widget';
  widget.innerHTML = `
    <div class="widget__controls">
      <a href="#" class="widget__show-forecast">Прогоноз на 3 дня</a>
      <a href="#" class="widget__reload-forecast">Обновить</a>
      <div class="widget__close-forecast"></div>
    </div>
      <div class="widget__title">
        <p class="widget__day"><span class="widget__weekday">Tuesday</span><span class="widget__date">24.05.2022</span></p>
        <p class="widget__geolocation"><img class="widget__geolocation-icon" src="https://pngicon.ru/file/uploads/ikonka-geolokatsii-85x128.png" alt="Гео метка"><span class="widget__city">Минск</span></p>
      </div>
        <div class="widget__block">
          <div class="widget__icon-block">
            <div class="widget__weather-icon"></div>
            <span class="widget__description">ясно</span>
          </div>
          <p class="widget__temperature">24.C</p>
        </div>
        <hr>
        <div class="widget__block-additional">
          <div class="widget__wind">
            <img class="widget__icon" src="https://img.icons8.com/color/48/000000/wind.png" alt="wind"/>
            <span class="wind-info">1232131</span>
            <p class="wind-title">Ветер</p>
          </div>
          <div class="widget__chance-rain">
            <img class="widget__icon" src="https://img.icons8.com/ios/50/ffffff/rainy-weather.png" alt="chance of rain"/>
            <span class="chance-rain-info">212321</span>
            <p class="chance-rain-title">Вероятность осадков</p>
          </div>
          <div class="widget__humidity">
            <img class="widget__icon" src="https://img.icons8.com/external-line-adri-ansyah/64/ffffff/external-humidity-world-ozone-day-line-adri-ansyah.png" alt="humidity"/>
            <span class="humidity-info">12213</span>
            <p class="humidity-title">Влажность</p>
          </div>
          <div class="widget__pressure">
            <img class="widget__icon" src="https://img.icons8.com/dotty/80/ffffff/barometer-gauge.png" alt="pressure"/>
            <span class="pressure-info">213123</span>
            <span class="pressure-title">Атмосферное давление</span></div>
          </div> 
        <hr class="second-line">
      
        <div class="widget__future-forecast closed">
          <div class="tomorrow">
            <p class="future-date">01.12.23</p>
            <p class="future-day">wefew</p>
            <div class="future-icon"></div>
            <p class="future-temp">ewrew</p>
          </div>
            <div class="first-d-after-tomorrow">
              <p class="future-date">24.12.23</p>
              <p class="future-day">wefwe</p>
              <div class="future-icon"></div>
              <p class="future-temp">ewrew</p>
            </div>
              <div class="second-d-after-tomorrow">
                <p class="future-date">21.12.23</p>
                <p class="future-day">wefewfew</p>
                <div class="future-icon"></div>
                <p class="future-temp">ewrew</p>
              </div>
        </div>
      </div>`
  document.body.append(widget);
  showWidgetBtn = document.createElement('button');
  showWidgetBtn.id = 'open-widget';
  showWidgetBtn.innerHTML = '<img src="https://img.icons8.com/glyph-neue/64/ffffff/chance-of-storm.png"/>';
  document.body.append(showWidgetBtn);
  this.addCurrentDate();
}

WheatherWidget.prototype.addCurrentDate = function() {
  let today = new Date();
  let weekDays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  widget.querySelector('.widget__weekday').textContent = weekDays[today.getDay()];
  widget.querySelector('.widget__date').textContent = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth()).padStart(2, '0')}.${String(today.getFullYear()).padStart(2, '0')}`;
}

WheatherWidget.prototype.addHandlers = function() {
  const closeWidgetBtn = widget.querySelector('.widget__close-forecast');
  const showFutureForecastBtn = widget.querySelector('.widget__show-forecast');
  const reloadForecastBtn = widget.querySelector('.widget__reload-forecast');
  const futureForecast = widget.querySelector('.widget__future-forecast');
  
  showWidgetBtn.addEventListener('click', () => {
    this.getGeolocation();
    widget.style.opacity = 1;
    showWidgetBtn.style.opacity = 0;
    showWidgetBtn.style.zIndex = -1;
  })
  
  closeWidgetBtn.addEventListener('click', () => {
    widget.style.opacity = 0;
    showWidgetBtn.style.opacity = 1;
    showWidgetBtn.style.zIndex = 1;
  })
  
  showFutureForecastBtn.addEventListener('click', () => {
    futureForecast.classList.toggle('closed');
    showFutureForecastBtn.textContent === 'Прогоноз на 3 дня' ?
    showFutureForecastBtn.textContent = 'Скрыть прогноз' :
    showFutureForecastBtn.textContent = 'Прогоноз на 3 дня';
  });

  reloadForecastBtn.addEventListener('click', () => {
    this.getGeolocation();
  });
} 

WheatherWidget.prototype.getGeolocation = function() {
  let latitude = 53.9; // Minsk by default
  let longitude = 27.5667; // Minsk by default
  const apiKey = 'f2ee85bef9bb3dbecbbcaa12e822aec6';
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=ru&units=metric`;
  
  const success = (position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=ru&units=metric`;
console.log(url)
console.log(latitude, longitude)
this.getDataFromApi(url);
  }

  const error = (err) => {
    alert(err.message);
    
    console.log(url)
    this.getDataFromApi(url);
  }

  if (!navigator.geolocation) {
    alert('Your browser does not support geolocation. The city of Minsk will be applied by default');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
  


  
}

WheatherWidget.prototype.printData = function(data) {
  widget.querySelector('.widget__weather-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].main}">`;
  widget.querySelector('.widget__city').textContent = data.name;
  widget.querySelector('.widget__temperature').textContent = `${Math.round(data.main.temp)}${String.fromCodePoint(8451)}`;
  widget.querySelector('.widget__description').textContent = data.weather[0].description;
  widget.querySelector('.wind-info').textContent = data.wind.speed + ' м/с';
  widget.querySelector('.chance-rain-info').textContent = `${data.clouds.all} ${String.fromCodePoint(37)}`;
  widget.querySelector('.humidity-info').textContent = `${data.main.humidity} ${String.fromCodePoint(37)}`;
  widget.querySelector('.pressure-info').textContent = data.main.pressure + ' мм';
}

WheatherWidget.prototype.getDataFromApi = function(link) {
  fetch(link)
    .then(response => //{  
      // if (response.status !== 200) { 
      //   // Delete previous weather data from screen when you get a weather error
      //   //weatherIcon.className = 'weather-icon owf';
      //   weatherIcon.classList.add('weather-icon_hidden');
      //   weatherDescription.classList.add('description-container_hidden');
      //   wind.classList.add('wind_hidden');
      //   humidity.classList.add('humidity_hidden');
      //   console.log(`${consoleErrorText}: ${response.status}`);
      //   setTimeout(() => {
      //     weatherError.textContent = `${errorText}: ${response.status}`;
      //     weatherError.classList.add('weather-error_active');
      //     wind.textContent = '';
      //     humidity.textContent = '';
      //     weatherDescription.firstElementChild.textContent = '';
      //     weatherDescription.lastElementChild.textContent = '';
      //   }, 500);
      //   return;
      // }
      response.json())
      .then(data => this.printData(data)) 
      .catch(err => console.error('Fetch Error :-S', err))
}




let widgetApp = new WheatherWidget();
widgetApp.getWeather();
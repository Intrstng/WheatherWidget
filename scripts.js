function WheatherWidget() {
  let widget = null;
  let showWidgetBtn = null;
  let url_1_day = null;
  let url_3_day = null;
  this.weekDays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  this.backgroundImages = {
    '01': 'https://i.ibb.co/dg3V5gr/01d.jpg', // имя ключа выбрано числом т.к. ключ должен совпадать с номером иконки погоды
    '02': 'https://i.ibb.co/T2xSHkf/02d.jpg',
    '03': 'https://i.ibb.co/9sjp2PS/03d.jpg',
    '04': 'https://i.ibb.co/PFjPCDR/04d.jpg',
    '09': 'https://i.ibb.co/YNDp50j/09d.jpg',
    '10': 'https://i.ibb.co/fvQ0CSH/10d.jpg',
    '11': 'https://i.ibb.co/c19TKzN/11d.jpg',
    '13': 'https://i.ibb.co/hKHGVTd/13d.jpg',
    '50': 'https://i.ibb.co/sCJsDPs/50d.jpg',
  }
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
        <p class="widget__geolocation"><img class="widget__geolocation-icon" src="https://pngicon.ru/file/uploads/ikonka-geolokatsii-85x128.png" alt="Гео метка"><span class="widget__city"></span></p>
      </div>
        <div class="widget__block">
          <div class="widget__icon-block">
            <div class="widget__weather-icon"></div>
            <span class="widget__description"></span>
          </div>
          <p class="widget__temperature"></p>
        </div>
        <hr>
        <div class="widget__block-additional">
          <div class="widget__wind">
            <img class="widget__icon" src="https://img.icons8.com/color/48/000000/wind.png" alt="wind"/>
            <span class="wind-info"></span>
            <p class="wind-title">Ветер</p>
          </div>
          <div class="widget__chance-rain">
            <img class="widget__icon" src="https://img.icons8.com/ios/50/ffffff/rainy-weather.png" alt="chance of rain"/>
            <span class="chance-rain-info"></span>
            <p class="chance-rain-title">Вероятность осадков</p>
          </div>
          <div class="widget__humidity">
            <img class="widget__icon" src="https://img.icons8.com/external-line-adri-ansyah/64/ffffff/external-humidity-world-ozone-day-line-adri-ansyah.png" alt="humidity"/>
            <span class="humidity-info"></span>
            <p class="humidity-title">Влажность</p>
          </div>
          <div class="widget__pressure">
            <img class="widget__icon" src="https://img.icons8.com/dotty/80/ffffff/barometer-gauge.png" alt="pressure"/>
            <span class="pressure-info"></span>
            <span class="pressure-title">Атмосферное давление</span></div>
          </div> 
        <hr class="second-line">
      
        <div class="widget__future-forecast closed">
          <div class="tomorrow">
            <p class="future-date"></p>
            <p class="future-day"></p>
            <div class="future-icon"></div>
            <p class="future-temp"></p>
          </div>
            <div class="first-d-after-tomorrow">
              <p class="future-date"></p>
              <p class="future-day"></p>
              <div class="future-icon"></div>
              <p class="future-temp"></p>
            </div>
              <div class="second-d-after-tomorrow">
                <p class="future-date"></p>
                <p class="future-day"></p>
                <div class="future-icon"></div>
                <p class="future-temp"></p>
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
  widget.querySelector('.widget__weekday').textContent = this.weekDays[today.getDay()];
  widget.querySelector('.widget__date').textContent = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth()).padStart(2, '0')}.${String(today.getFullYear()).padStart(2, '0')}`;
}

WheatherWidget.prototype.addHandlers = function() {
  const closeWidgetBtn = widget.querySelector('.widget__close-forecast');
  const showFutureForecastBtn = widget.querySelector('.widget__show-forecast');
  const reloadForecastBtn = widget.querySelector('.widget__reload-forecast');
  const futureForecast = widget.querySelector('.widget__future-forecast');
  
  showWidgetBtn.addEventListener('click', () => {
    this.getGeolocation('today');
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
    this.getGeolocation('threeDays');
  });

  reloadForecastBtn.addEventListener('click', () => {
    this.getGeolocation('today');
    !widget.querySelector('.widget__future-forecast').classList.contains('closed') && this.getGeolocation('threeDays');
  });
} 

WheatherWidget.prototype.getGeolocation = function(day = 'today') {
  let latitude = 53.9; // Minsk by default
  let longitude = 27.5667; // Minsk by default
  const apiKey = 'f2ee85bef9bb3dbecbbcaa12e822aec6';
  let url_1_day = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=ru&units=metric`;
  let url_3_day = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=ru&units=metric`;

  const success = (position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    url_1_day = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=ru&units=metric`;
    url_3_day = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=ru&units=metric`;
console.log(url_1_day)
    if (day === 'today') this.getDataFromApiForToday(url_1_day)
    else if (day === 'threeDays') this.getDataFromApiForThreeDays(url_3_day)
  }

  const error = (err) => {
    alert(err.message);
console.log(url_1_day)
    if (day === 'today') this.getDataFromApiForToday(url_1_day)
    else if (day === 'threeDays') this.getDataFromApiForThreeDays(url_3_day)
  }

  if (!navigator.geolocation) {
    alert('Your browser does not support geolocation. The city of Minsk will be applied by default');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

WheatherWidget.prototype.printDataForToday = function(data) {
  widget.style.backgroundImage = `url('${this.backgroundImages[data.weather[0].icon.slice(0,-1)]}')`;
  widget.querySelector('.widget__weather-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].main}" width="90" height="90">`;
  widget.querySelector('.widget__city').textContent = data.name;
  widget.querySelector('.widget__temperature').textContent = `${Math.round(data.main.temp)}${String.fromCodePoint(8451)}`;
  widget.querySelector('.widget__description').textContent = data.weather[0].description;
  widget.querySelector('.wind-info').textContent = data.wind.speed + ' м/с';
  widget.querySelector('.chance-rain-info').textContent = `${data.clouds.all} ${String.fromCodePoint(37)}`;
  widget.querySelector('.humidity-info').textContent = `${data.main.humidity} ${String.fromCodePoint(37)}`;
  widget.querySelector('.pressure-info').textContent = data.main.pressure + ' мм';
}


WheatherWidget.prototype.printDataForThreeDays = function(data) {
  console.log(data)
  console.log('data.list[4].main.temp', data.list[4].main.temp)
  widget.querySelector('.tomorrow .future-date').textContent = data.list[4].dt_txt.slice(5, 10).split('-').reverse().join('.');
  widget.querySelector('.first-d-after-tomorrow .future-date').textContent = data.list[12].dt_txt.slice(5, 10).split('-').reverse().join('.');
  widget.querySelector('.second-d-after-tomorrow .future-date').textContent = data.list[20].dt_txt.slice(5, 10).split('-').reverse().join('.');

  widget.querySelector('.tomorrow .future-day').textContent = this.weekDays[new Date(data.list[4].dt * 1000).getDay()];
  widget.querySelector('.first-d-after-tomorrow .future-day').textContent = this.weekDays[new Date(data.list[12].dt * 1000).getDay()];
  widget.querySelector('.second-d-after-tomorrow .future-day').textContent = this.weekDays[new Date(data.list[20].dt * 1000).getDay()];
 


  console.log(data.list[4].dt, new Date(data.list[4].dt * 1000))
  console.log(data.list[12].dt, new Date(data.list[12].dt * 1000))
  console.log(data.list[20].dt, new Date(data.list[20].dt * 1000))
  widget.querySelector('.tomorrow .future-temp').textContent = `${Math.round(data.list[4].main.temp)}${String.fromCodePoint(8451)}`; // 4 элемент в массиве это 12:00 завтрашнего дня
  widget.querySelector('.first-d-after-tomorrow .future-temp').textContent = `${Math.round(data.list[12].main.temp)}${String.fromCodePoint(8451)}`; // 12 элемент в массиве это 12:00 послезавтрашнего дня
  widget.querySelector('.second-d-after-tomorrow .future-temp').textContent = `${Math.round(data.list[20].main.temp)}${String.fromCodePoint(8451)}`; // 20 элемент в массиве это 12:00 дня после послезавтрашнего дня
  widget.querySelector('.tomorrow .future-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.list[4].weather[0].icon}@2x.png" alt="${data.list[4].weather[0].main}" width="50" height="50">`;
  widget.querySelector('.first-d-after-tomorrow .future-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.list[12].weather[0].icon}@2x.png" alt="${data.list[12].weather[0].main}" width="50" height="50">`;
  widget.querySelector('.second-d-after-tomorrow .future-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.list[20].weather[0].icon}@2x.png" alt="${data.list[20].weather[0].main}" width="50" height="50">`;
}

WheatherWidget.prototype.getDataFromApiForToday = function(link) {
  fetch(link)
    .then(response => {  
      if (response.status !== 200) {
        widget.querySelector('.widget__description').textContent = `Возникла проблема. Код ошибки: ${response.status}`;
        return;
      }
      response.json()
      .then(data => this.printDataForToday(data)) 
      .catch(err => console.error('Fetch Error :-S', err))
})}

WheatherWidget.prototype.getDataFromApiForThreeDays = function(link) {
  fetch(link)
    .then(response => {  
      if (response.status !== 200) {
        widget.querySelector('.widget__description').textContent = `Возникла проблема. Код ошибки: ${response.status}`;
        return;
      }
      response.json()
      .then(data => this.printDataForThreeDays(data)) 
      .catch(err => console.error('Fetch Error :-S', err))
})}


let widgetApp = new WheatherWidget();
widgetApp.getWeather();
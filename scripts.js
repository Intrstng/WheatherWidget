
const widget = document.getElementById('widget');
const showWidgetBtn = document.getElementById('open-widget');
const closeWidgetBtn = widget.querySelector('.widget__close-forecast');
const showFutureForecastBtn = widget.querySelector('.widget__show-forecast');
const futureForecast = widget.querySelector('.widget__future-forecast');

showWidgetBtn.addEventListener('click', () => {
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


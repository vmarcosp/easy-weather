import { NEW_WEATHER, NEW_WEEKS_FORECAST } from '@constants/events'
import { CELSIUS_HTML_TEMPLATE } from '@utils/templates'
import { toCelsius, getAppElement } from '@utils/helpers'
import { subscribe } from 'pubsub-js'

const WEATHER_ICONS = {
  '01d': 'wi-day-sunny',
  '02d': 'wi-day-cloudy',
  '03d': 'wi-cloud',
  '04d': 'wi-cloudy',
  '09d': 'wi-showers',
  '10d': 'wi-day-hail',
  '11d': 'wi-thunderstorm',
  '13d': 'wi-snowflake-cold',
  '50d': 'wi-windy',
  '01n': 'wi-night-clear',
  '02n': 'wi-night-alt-cloudy',
  '03n': 'wi-cloud',
  '04n': 'wi-cloudy',
  '09n': 'wi-showers',
  '10n': 'wi-night-alt-showers',
  '11n': 'wi-thunderstorm',
  '13n': 'wi-snowflake-cold',
  '50n': 'wi-windy'
}

class WeatherDetails {
  constructor() {
    this.$cityTemperature = getAppElement('city-temperature')
    this.$locationInfo = getAppElement('location-info')
    this.$weatherIcon = getAppElement('weather-icon')
    this.$maxTemp = getAppElement('max-temp')
    this.$minTemp = getAppElement('min-temp')
  }

  init () {
    this._onNewWeather()
    this._onNewWeeksForecast()
  }

  _renderWeather (forecast) {
    const temperature = toCelsius(forecast.main.temp)

    this.$cityTemperature.innerHTML = `${temperature} ${CELSIUS_HTML_TEMPLATE}`
    this.$locationInfo.innerHTML = `${forecast.cityName}, ${forecast.state.sigla}`
    this.$weatherIcon.classList.add(WEATHER_ICONS[forecast.weather[0].icon])
  }

  /**
   * @param {Array} days
   */
  _renderMaxAndMinTemp (days) {
    const maxTemperature = (temperature, { temp }) =>
      temperature < temp.max ? temp.max : temperature

    const minTemperature = (temperature, { temp }) =>
      temperature > temp.min ? temp.min : temperature

    this.$maxTemp.innerHTML =
      `MAX: ${toCelsius(days.reduce(maxTemperature, 0))} ${CELSIUS_HTML_TEMPLATE}`
    this.$minTemp.innerHTML =
      `MIN: ${toCelsius(days.reduce(minTemperature, 500))} ${CELSIUS_HTML_TEMPLATE}`
  }

  _onNewWeather () {
    subscribe(NEW_WEATHER, (message, data) => this._renderWeather(data))
  }

  _onNewWeeksForecast () {
    subscribe(NEW_WEEKS_FORECAST, (message, data) => this._renderMaxAndMinTemp(data.list))
  }
}

export default new WeatherDetails()

import { NEW_WEATHER } from '@constants/events'
import { toCelsius, getAppElement } from '@utils/helpers'
import { CELSIUS_HTML_TEMPLATE } from '@utils/templates'
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
  constructor () {
    this.$cityTemperature = getAppElement('city-temperature')
    this.$locationInfo = getAppElement('location-info')
    this.$weatherIcon = getAppElement('weather-icon')
  }

  init () {
    this._onNewWeather()
  }

  _renderWeather (forecast) {
    const temperature = toCelsius(forecast.main.temp)
    console.log(forecast.weather[0].icon)
    this.$cityTemperature.innerHTML = `${temperature} ${CELSIUS_HTML_TEMPLATE}`
    this.$locationInfo.innerHTML = `${forecast.cityName}, ${forecast.state.sigla}`
    this.$weatherIcon.classList.add(WEATHER_ICONS[forecast.weather[0].icon])
  }

  _onNewWeather () {
    subscribe(NEW_WEATHER, (message, data) => this._renderWeather(data))
  }
}

export default new WeatherDetails()

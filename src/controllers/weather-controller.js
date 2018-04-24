import locationForm from '@components/location-form'
import weatherDetails from '@components/weather-details'
import weekForecast from '@components/week-forecast'

import { NEW_CITY_SELECTED, OPEN_MENU, NEW_WEATHER, NEW_WEEKS_FORECAST } from '@constants/events'
import { WEATHER_OPTIONS, WEATHER_MAP_URL } from '@constants/api'

import axios from 'axios'
import { subscribe, publish } from 'pubsub-js'
import { stringify } from 'qs'
import { getAppElement, $on, toCelsius } from '@utils/helpers'

class WeatherController {
  constructor () {
    this.$menuButton = getAppElement('menu-button')
    this.$locationForm = getAppElement('location-form')
    this.currentAppTheme = 'cool'
    this.currentLocation = {
      cityName: 'Blumenau',
      state: { sigla: 'SC' }
    }
  }

  init () {
    /**
     * Boostrap components
     */
    locationForm.init()
    weatherDetails.init()
    weekForecast.init()

    /**
     * Register events
     */
    this._onChangeCity()
    this._onMenuButtonClick()

    /**
     * Call methods
     */
    this._findByFavCity()
  }

  /**
   * @param {String} city
   */
  _findWeather (city) {
    const query = {
      q: `${city},br`,
      ...WEATHER_OPTIONS
    }

    axios(`${WEATHER_MAP_URL}weather?${stringify(query)}`)
      .then(({ data }) => {
        this._changeAppTheme(toCelsius(data.main.temp))
        publish(NEW_WEATHER, { ...data, ...this.currentLocation })
      })
  }

  _findForecast (city) {
    const query = {
      q: `${city},br`,
      ...WEATHER_OPTIONS
    }

    axios(`${WEATHER_MAP_URL}forecast/daily?${stringify(query)}`)
      .then(({ data }) =>
        publish(NEW_WEEKS_FORECAST, data))
  }

  _findByFavCity () {
    this._findWeather('Blumenau')
    this._findForecast('Blumenau')
  }

  /**
   *
   * @param {number} currentTemperature
   */
  _changeAppTheme (currentTemperature) {
    const theme = this._getCurrentTheme(currentTemperature)
    document.body.classList.remove(this.currentAppTheme)
    this.$locationForm.classList.remove(this.currentAppTheme)

    document.body.classList.add(theme)
    this.$locationForm.classList.add(theme)

    this.currentAppTheme = theme
  }

  /**
   *
   * @param {number} temperature
   */
  _getCurrentTheme (temperature) {
    if (temperature >= 25) return 'hot'
    if (temperature >= 20) return 'cool'
    if (temperature >= 10) return 'cold'
    else return 'freezing'
  }

  _onChangeCity () {
    subscribe(NEW_CITY_SELECTED, (message, data) => {
      this.currentLocation = data
      this._findWeather(data.cityName)
      this._findForecast(data.cityName)
    })
  }

  _onMenuButtonClick () {
    $on(this.$menuButton, 'click', () =>
      publish(OPEN_MENU))
  }
}

export default new WeatherController()

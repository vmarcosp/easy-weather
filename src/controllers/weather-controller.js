/**
 * Components
 */
import locationForm from '@components/location-form'
import weatherDetails from '@components/weather-details'
/**
 * Constants
 */
import { NEW_CITY_SELECTED, OPEN_MENU, NEW_WEATHER } from '@constants/events'
import { WEATHER_OPTIONS, WEATHER_MAP_URL } from '@constants/api'

import axios from 'axios'
import { subscribe, publish } from 'pubsub-js'
import { stringify } from 'qs'
import { getAppElement, $on } from '@utils/helpers'

class WeatherController {
  constructor () {
    this.$menuButton = getAppElement('menu-button')
    this.currentLocation = {}
  }

  init () {
    this._onChangeCity()
    this._onMenuButtonClick()
    this._findByDefaultCity()

    /**
     * Boostrap components
     */
    locationForm.init()
    weatherDetails.init()
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
      .then(response => publish(NEW_WEATHER, {...response.data, ...this.currentLocation}))
  }

  _findForecast (city) {
    const query = {
      q: `${city},br`,
      ...WEATHER_OPTIONS
    }

    axios(`${WEATHER_MAP_URL}forecast/daily?${stringify(query)}`)
      .then(console.log)
  }

  _onChangeCity () {
    subscribe(NEW_CITY_SELECTED, (message, data) => {
      this.currentLocation = data
      this._findWeather(data.cityName)
      // this._findForecast(data.cityName)
    })
  }

  _findByDefaultCity () {
    // this._findWeather('Blumenau')
  }

  _onMenuButtonClick () {
    $on(this.$menuButton, 'click', () =>
      publish(OPEN_MENU))
  }
}

export default new WeatherController()

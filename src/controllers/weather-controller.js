import locationForm from '@components/location-form'
import { NEW_CITY_SELECTED } from '@constants/events'
import { WEATHER_OPTIONS, WEATHER_MAP_URL } from '@constants/api'
import axios from 'axios'
import { stringify } from 'qs'
import { subscribe } from 'pubsub-js'

class WeatherController {
  init () {
    this._onChangeCity()
    this._findByDefaultCity()
    locationForm.init()
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
      .then(console.log)
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
      this._findWeather(data.cityName)
      this._findForecast(data.cityName)
    })
  }

  _findByDefaultCity () {
    this._findWeather('Blumenau')
  }
}

export default new WeatherController()

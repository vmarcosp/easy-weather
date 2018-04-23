import locationForm from '@components/location-form'
import { NEW_CITY_SELECTED } from '@constants/events'
import { subscribe } from 'pubsub-js'

class WeatherController {
  init () {
    this._onChangeCity()
    locationForm.init()
  }

  _onChangeCity () {
    subscribe(NEW_CITY_SELECTED, (message, data) =>
      console.log(data))
  }
}

export default new WeatherController()

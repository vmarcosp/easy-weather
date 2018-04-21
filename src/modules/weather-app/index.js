import locationForm from '@modules/location-form'

// Scss import
import './index.scss'

class WeatherApp {
  init () {
    locationForm.init()
  }
}

export default new WeatherApp()

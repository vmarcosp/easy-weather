import locationForm from '@components/location-form'
import weatherDetails from '@components/weather-details'
import weekForecast from '@components/week-forecast'

import axios from 'axios'
import store from 'store'
import Chart from 'chart.js'
import 'chartjs-plugin-datalabels'

import { NEW_CITY_SELECTED, OPEN_MENU, NEW_WEATHER, NEW_WEEKS_FORECAST } from '@constants/events'
import { WEATHER_OPTIONS, WEATHER_MAP_URL } from '@constants/api'
import { showMessage } from '@utils/alert-dialog'
import { subscribe, publish } from 'pubsub-js'
import { stringify } from 'qs'
import { getAppElement, $on, toCelsius, createChartOptions } from '@utils/helpers'

const FAVORITE_LOCATION_NAME = 'favoriteLocation'
const FAVORITE_ACTIVE_ICON = 'fa-star'
const FAVORITE_INACTIVE_ICON = 'fa-star-o'

class WeatherController {
  constructor () {
    this.$menuButton = getAppElement('menu-button')
    this.$locationForm = getAppElement('location-form')
    this.$favoriteButton = getAppElement('favorite-button')
    this.$weekForecastChart = getAppElement('week-forecast-chart')

    this.currentAppTheme = 'cool'
    this.currentLocation = store.get(FAVORITE_LOCATION_NAME) || {
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
    this._onFavoriteButtonClick()

    /**
     * Call methods
     */
    this._findByFavCity()

    Chart.defaults.global.defaultFontFamily = 'Montserrat'
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
        this._checkFavoriteLocation(this.currentLocation)
        this._changeAppTheme(toCelsius(data.main.temp))
        publish(NEW_WEATHER, { ...data, ...this.currentLocation })
      }).catch(response => {
        showMessage('Não foram encontrados resultados para a cidade selecionada.', 5 * 1000)
      })
  }

  _findForecast (city) {
    const query = {
      q: `${city},br`,
      ...WEATHER_OPTIONS
    }

    axios(`${WEATHER_MAP_URL}forecast/daily?${stringify(query)}`)
      .then(({ data }) => {
        this._generateChart(data.list)
        publish(NEW_WEEKS_FORECAST, data)
      })
  }

  _findByFavCity () {
    this._findWeather(this.currentLocation.cityName)
    this._findForecast(this.currentLocation.cityName)
  }

  /**
   *
   * @param {number} currentTemperature
   */
  _changeAppTheme (currentTemperature) {
    const theme = this._getCurrentTheme(currentTemperature)
    const $container = getAppElement('app-container')

    $container.classList.remove(this.currentAppTheme)
    this.$locationForm.classList.remove(this.currentAppTheme)

    $container.classList.add(theme)
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

  /**
   *
   * @param {object} location
   */
  _checkFavoriteLocation (location) {
    const { cityName, state } = this.currentLocation
    const favoriteLocation = store.get(FAVORITE_LOCATION_NAME)
    const $icon = this.$favoriteButton.querySelector('.fa')

    // refatorar
    if (favoriteLocation && favoriteLocation.cityName === cityName && state.sigla === favoriteLocation.state.sigla) {
      $icon.classList.remove(FAVORITE_INACTIVE_ICON)
      $icon.classList.add(FAVORITE_ACTIVE_ICON)
    } else {
      $icon.classList.add(FAVORITE_INACTIVE_ICON)
      $icon.classList.remove(FAVORITE_ACTIVE_ICON)
    }
  }

  /**
   *
   * @param {object} forecasts
   */
  _generateChart (forecasts) {
    const chartData = forecasts.map(({ temp }) => toCelsius(temp.day))
    this.weekChart = new Chart(this.$weekForecastChart, createChartOptions(chartData))
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

  _onFavoriteButtonClick () {
    $on(this.$favoriteButton, 'click', () => {
      const $icon = this.$favoriteButton.querySelector('.fa')
      const favoriteLocation = store.get(FAVORITE_LOCATION_NAME)
      const { cityName, state } = this.currentLocation

      $icon.classList.toggle(FAVORITE_INACTIVE_ICON)
      $icon.classList.toggle(FAVORITE_ACTIVE_ICON)

      // Refatorar...
      if (favoriteLocation && favoriteLocation.cityName === cityName && favoriteLocation.state.sigla && state.sigla) {
        store.set(FAVORITE_LOCATION_NAME, undefined)
      } else {
        store.set(FAVORITE_LOCATION_NAME, this.currentLocation)
      }
    })
  }
}

export default new WeatherController()

import { NEW_WEEKS_FORECAST } from '@constants/events'
import { toCelsius, getAppElement } from '@utils/helpers'
import { subscribe } from 'pubsub-js'

const DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

class WeekForecast {
  constructor () {
    this.$daysList = getAppElement('forecast-days-list')
  }

  init () {
    this._onNewWeeksForecast()
  }

  _onNewWeeksForecast () {
    subscribe(NEW_WEEKS_FORECAST, (message, { list }) => this._renderWeeksForecast(list))
  }

  /**
   * @param {Array} days
   */
  _renderWeeksForecast (days) {
    const $items = days.map((day, index) =>
      `
        <li class="day">
          <span class="label">${DAYS[index]}</span>
          <span class="max">${toCelsius(day.temp.max)}<sup>ºc</sup></span>
          <span class="min">${toCelsius(day.temp.min)}<sup>ºc</sup></span>
        </li>
        `)
    this.$daysList.innerHTML = $items.join` `
  }
}

export default new WeekForecast()

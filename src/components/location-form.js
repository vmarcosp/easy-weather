import Awesomplete from 'awesomplete'
import axios from 'axios'
import { IBGE_URL } from '@constants/api'
import { getAppElement, $on } from '@utils/helpers'
import { NEW_CITY_SELECTED, OPEN_MENU } from '@constants/events'
import { publish, subscribe } from 'pubsub-js'

const AUTOCOMPLETE_OPTIONS = {
  data: item => ({ label: item.nome, value: item.nome }),
  list: []
}

class LocationForm {
  constructor () {
    this.$form = getAppElement('location-form')
    this.$closeButton = getAppElement('close-button')
    this.$statesSelect = getAppElement('states-select')
    this.$citiesSelect = new Awesomplete(getAppElement('cities-select'), AUTOCOMPLETE_OPTIONS)
    this.states = []
  }

  init () {
    this._onOpenMenu()
    this._onCloseClick()
    this._onStatesSelectChange()
    this._onFormSubmit()
    this._findStates()
  }

  _findStates () {
    axios.get(`${IBGE_URL}/estados`)
      .then(response => this._renderStates(response.data))
  }

  /**
   *
   * @param {stromg} state
   */
  _findCitiesByState (state) {
    axios.get(`${IBGE_URL}/estados/${state}/municipios`)
      .then(response => { this.$citiesSelect.list = response.data })
  }

  /**
   *
   * @param {array} states
   */
  _renderStates (states) {
    this.states = states

    const $initialOption = ['<option disabled selected="selected" value="">Estado</option>']
    const $options = states.map(state =>
      `<option value='${state.id}'>${state.nome}</option>`)

    this.$statesSelect.innerHTML = [...$initialOption, ...$options].join` `
  }

  _onStatesSelectChange () {
    $on(this.$statesSelect, 'change', $event => {
      this._findCitiesByState($event.target.value)
      this.$citiesSelect.input.disabled = false
    })
  }

  _onFormSubmit () {
    $on(this.$form, 'submit', $event => {
      $event.preventDefault()

      const state = this.states.filter(state =>
        state.id === parseInt(this.$statesSelect.value))[0]

      publish(NEW_CITY_SELECTED, { state, cityName: this.$citiesSelect.input.value })

      this.$form.classList.remove('-active')
      this.$citiesSelect.input.value = ''
      this.$citiesSelect.input.disabled = true
      this.$statesSelect.value = ''
    })
  }

  _onCloseClick () {
    $on(this.$closeButton, 'click', () =>
      this.$form.classList.remove('-active'))
  }

  _onOpenMenu () {
    subscribe(OPEN_MENU, () =>
      this.$form.classList.add('-active'))
  }
}

export default new LocationForm()

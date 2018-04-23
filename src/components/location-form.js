import { IBGE_URL } from '@constants/apis'
import { getAppElement, $on } from '@utils/helpers'
import { NEW_CITY_SELECTED } from '@constants/events'
import Awesomplete from 'awesomplete'
import { publish } from 'pubsub-js'
import axios from 'axios'

const AUTOCOMPLETE_OPTIONS = {
  data: item => ({label: item.nome, value: item.nome}),
  list: []
}

class LocationForm {
  constructor () {
    this.$form = getAppElement('location-form')
    this.$statesSelect = getAppElement('states-select')
    this.$citiesSelect = new Awesomplete(getAppElement('cities-select'), AUTOCOMPLETE_OPTIONS)
    this.states = []
  }

  init () {
    this._findStates()
    this._onStatesSelectChange()
    this._onFormSubmit()
  }

  _findStates () {
    axios.get(`${IBGE_URL}/estados`)
      .then(response => this._renderStates(response.data))
  }

  _findCitiesByState (state) {
    axios.get(`${IBGE_URL}/estados/${state}/municipios`)
      .then(response => { this.$citiesSelect.list = response.data })
  }

  _renderStates (states) {
    this.states = states
    const $options = ['<option disabled selected="selected" value="">Estado</option>']

    states.map(state =>
      $options.push(`<option value='${state.id}'>${state.nome}</option>`))

    this.$statesSelect.innerHTML = $options.join(' ')
  }

  _onStatesSelectChange () {
    $on(this.$statesSelect, 'change', $event =>
      this._findCitiesByState($event.target.value))
  }

  _onFormSubmit () {
    $on(this.$form, 'submit', $event => {
      $event.preventDefault()
      const state = this.states.filter(state =>
        state.id === parseInt(this.$statesSelect.value))[0]
      publish(NEW_CITY_SELECTED, { state, cityName: this.$citiesSelect.input.value })
    })
  }
}

export default new LocationForm()

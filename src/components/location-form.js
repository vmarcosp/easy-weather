import { IBGE_URL } from '@constants/apis'
import selector from '@utils/selector'
import Awesomplete from 'awesomplete'
import axios from 'axios'

const AUTOCOMPLETE_OPTIONS = {
  data: item => ({label: item.nome, value: item.nome}),
  list: []
}

class LocationForm {
  constructor () {
    this.$statesSelect = selector.getAppElement('states-select')
    this.$citiesSelect = new Awesomplete(selector.getAppElement('cities-select'), AUTOCOMPLETE_OPTIONS)
  }

  init () {
    this._findStates()
    this._onStatesSelectChange()
  }

  _findStates () {
    axios.get(`${IBGE_URL}/estados`)
      .then(states => this._renderStates(states))
  }

  _findCitiesByState (state) {
    axios.get(`${IBGE_URL}/estados/${state}/municipios`)
      .then(response => { this.$citiesSelect.list = response.data })
  }

  _renderStates (states) {
    const $options = states.data.map(state =>
      `<option value='${state.id}'>${state.nome}</option>`)
    this.$statesSelect.innerHTML = $options.join(' ')
  }

  _onStatesSelectChange () {
    this.$statesSelect.addEventListener('change', $event =>
      this._findCitiesByState($event.target.value))
  }
}

export default new LocationForm()

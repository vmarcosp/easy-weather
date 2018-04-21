import { IBGE_URL } from '@constants/apis'
import selector from '@utils/selector'

import axios from 'axios'

class LocationForm {
  constructor () {
    this.$statesSelect = selector.getAppElement('states-select')
  }

  init () {
    this._findStates()
  }

  _findStates () {
    axios.get(`${IBGE_URL}/estados`)
      .then(states => this._renderStates(states))
  }

  _renderStates (states) {
    const $options = states.data.map(state =>
      `<option value="${state.sigla}">${state.nome}</option>`)
    this.$statesSelect.innerHTML = $options.join(' ')
  }
}

export default new LocationForm()

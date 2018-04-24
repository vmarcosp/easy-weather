export const getAppElement = element =>
  document.querySelector(`[data-element="${element}"]`)

export const $on = (target, event, callback) =>
  target.addEventListener(event, callback)

export const toCelsius = value => Math.round((value - 32) / 1.8)

export default {
  getAppElement,
  $on,
  toCelsius
}

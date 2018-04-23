export const getAppElement = element =>
  document.querySelector(`[data-element="${element}"]`)

export const $on = (target, event, callback) =>
  target.addEventListener(event, callback)

export default {
  getAppElement,
  $on
}

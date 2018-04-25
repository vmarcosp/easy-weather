import { getAppElement } from '@utils/helpers'

const $alertDialog = getAppElement('alert-dialog')

export const showMessage = (message, time) => {
  $alertDialog.innerHTML = message
  $alertDialog.classList.add('-active')
  setTimeout(() => $alertDialog.classList.remove('-active'), (time || 5) * 1000)
}

export default {
  showMessage
}

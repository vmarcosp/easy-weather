import { $on } from '@utils/helpers'
import weatherController from './weather-controller'

$on(window, 'DOMContentLoaded', () =>
  weatherController.init())

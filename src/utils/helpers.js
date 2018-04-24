export const getAppElement = element =>
  document.querySelector(`[data-element="${element}"]`)

export const $on = (target, event, callback) =>
  target.addEventListener(event, callback)

export const toCelsius = value => Math.round((value - 32) / 1.8)

export const createChartOptions = data => (
  {
    type: 'line',
    data: {
      labels: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
      datasets: [
        {
          datalabels: {
            color: 'white',
            font: { weight: 'bold' },
            align: 'end',
            anchor: 'end' },
          borderColor: 'white',
          label: 'Temp',
          fill: false,
          data }]
    },
    options: {
      legend: { display: false },
      responsive: true,
      title: { display: false },
      scales: {
        xAxes: [{
          ticks: { fontColor: 'white' },
          gridLines: { display: false, color: 'white' } }],
        yAxes: [{
          ticks: { fontColor: 'white' },
          gridLines: { color: 'white', display: false } }] }
    }
  }
)

export default {
  getAppElement,
  $on,
  toCelsius,
  createChartOptions
}

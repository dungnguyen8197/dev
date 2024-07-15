<script>
import { Pie } from 'vue-chartjs'
import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.plugins.unregister(ChartDataLabels)
// import { Tooltip } from 'chart.js/dist'
// const options: ChartOptions = {
//   legend: {
//     display: true,
//     position: 'right' // <=========== change this to the position you like.
//   },
//   title: {
//     display: true,
//     text: "Employee Details",
//   }
//   // ... and so on. see below about options
// }

export default {
  extends: Pie,
  data() {
    return {
      data: [],
      labels: [],
      options: {
        layout: {
          padding: {
            // bottom: 25
          }
        },
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              footer: (ttItem) => {
                let sum = 0
                const dataArr = ttItem[0].dataset.data
                dataArr.map(data => {
                  sum += Number(data)
                })

                const percentage = (ttItem[0].parsed * 100 / sum).toFixed(2) + '%'
                return `Percentage of data: ${percentage}`
              }
            }
          },
          /** Imported from a question linked above.
              Apparently Works for ChartJS V2 **/
          datalabels: {
            formatter: (value, dnct1) => {
              let sum = 0
              const dataArr = dnct1.chart.data.datasets[0].data
              dataArr.map(data => {
                sum += Number(data)
              })

              const percentage = (value * 100 / sum).toFixed(2) + '%'
              return percentage
            },
            color: '#ff3'
          }
        }
      }
    }
  },
  mounted() {
    this.addPlugin(ChartDataLabels)
    // this.gradient = this.$refs.canvas
    //   .getContext('2d')
    //   .createLinearGradient(0, 0, 0, 450)
    // this.gradient2 = this.$refs.canvas
    //   .getContext('2d')
    //   .createLinearGradient(0, 0, 0, 450)

    // this.gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)')
    // this.gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)')
    // this.gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')

    // this.gradient2.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
    // this.gradient2.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)')
    // this.gradient2.addColorStop(1, 'rgba(0, 231, 255, 0)')
    // this.renderChart(
    //   {
    //     labels: this.labels,
    //     datasets: [
    //       {
    //         backgroundColor: [this.gradient, this.gradient2, '#00D8FF'],
    //         data: this.data
    //       }
    //     ]
    //   },
    //   { responsive: true, maintainAspectRatio: false }
    // )
  },
  methods: {
    drawChart(data, lables) {
      this.data = [...data]
      this.labels = [...lables]
      this.draw()
    },
    draw() {
      this.gradient = this.$refs.canvas
        .getContext('2d')
        .createLinearGradient(0, 0, 0, 450)
      this.gradient2 = this.$refs.canvas
        .getContext('2d')
        .createLinearGradient(0, 0, 0, 450)

      this.gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)')
      this.gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)')
      this.gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')

      this.gradient2.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
      this.gradient2.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)')
      this.gradient2.addColorStop(1, 'rgba(0, 231, 255, 0)')
      // const options = {
      // tooltips: {
      //   enabled: true
      // },
      // plugins: {
      //   datalabels: {
      //     formatter: (value, ctx) => {
      //       const sum = ctx.dataset._meta[0].total
      //       const percentage = (value * 100 / sum).toFixed(2) + '%'
      //       console.log('............ formater : ', sum, percentage)
      //       return percentage
      //     },
      //     color: '#fff'
      //   }
      // },
      // pieceLabel: {
      //   mode: 'percentage',
      //   precision: 1
      // },
      // responsive: true,
      // maintainAspectRatio: false
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'right'
        },
        plugins: {
          datalabels: {
            color: 'white',
            formatter: (val, ctx) => {
              const totalDatasetSum = ctx.chart.data.datasets[ctx.datasetIndex].data.reduce((a, b) => (a + b), 0)
              const percentage = val * 100 / totalDatasetSum
              const roundedPercentage = Math.round(percentage * 100) / 100
              return `${roundedPercentage}%`
            }
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              generateLabels: function(chart) {
                // Get the default label list
                const original = Chart.overrides.pie.plugins.legend.labels.generateLabels
                const labelsOriginal = original.call(this, chart)

                // Build an array of colors used in the datasets of the chart
                var datasetColors = chart.data.datasets.map(function(e) {
                  return e.backgroundColor
                })
                datasetColors = datasetColors.flat()

                // Modify the color and hide state of each label
                labelsOriginal.forEach(label => {
                  // Change the color to match the dataset
                  label.fillStyle = datasetColors[label.index]
                })

                return labelsOriginal
              }
            },
            onClick: function(mouseEvent, legendItem, legend) {
              // toggle the visibility of the dataset from what it currently is
              legend.chart.getDatasetMeta(
                legendItem.datasetIndex
              ).hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex)
              legend.chart.update()
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const labelIndex = (context.datasetIndex * 2) + context.dataIndex
                return context.chart.data.labels[labelIndex] + ': ' + context.formattedValue + '%'
              }
            }
          }
        }
        // }
      }
      this.renderChart(
        {
          labels: this.labels,
          datasets: [
            {
              backgroundColor: [this.gradient, this.gradient2, '#00D8FF'],
              data: this.data
            }
          ]
        },
        options
        // { responsive: true, maintainAspectRatio: false }
      )
    }
  }
}
</script>

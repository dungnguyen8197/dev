<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data() {
    return {
      labels: [],
      datasets: []
    }
  },
  mounted() {
    this.draw()
  },
  methods: {
    drawChart(data, labels) {
      console.log('.............. set line chart ', JSON.stringify(data))
      this.datasets = [...data]
      this.labels = [...labels]
      this.draw()
    },
    draw() {
      this.renderChart(
        {
          labels: this.labels,
          datasets: this.datasets
          // datasets: [
          //   {
          //     label: 'Data 1',
          //     data: [0, 20, 50, 0, 25, 0, 60],
          //     backgroundColor: 'transparent',
          //     borderColor: 'rgba(1, 116, 188, 0.50)',
          //     pointBackgroundColor: 'rgba(171, 71, 188, 1)'
          //   },
          //   {
          //     label: 'Data 2',
          //     data: [1, 20, 70, 30, 25, 0, 60],
          //     backgroundColor: 'transparent',
          //     borderColor: 'rgba(1, 116, 188, 0.50)',
          //     pointBackgroundColor: 'rgba(171, 71, 188, 1)'
          //   }
          // ]
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: 'Thống kê đơn hàng 7 ngày qua'
          },
          legend: {
            display: true,
            position: 'right'
          }
        }
      )
    }
  }
}
</script>

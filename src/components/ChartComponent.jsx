import React from 'react'
import Chart from 'react-apexcharts'

export const ChartComponent = ({ model }) => {

    let options = {
        chart: {
            id: 'apexchart-example'
        },
        dataLabels: {
            enabled: false
          },
          legend: {
            show: false
          },
        plotOptions: {
            bar: {
                distributed: true,
                borderRadius: 4,
                horizontal: true,
            }
        },
        xaxis: {
            categories: model && model.map(c => { return c.category }),
            labels: {
                formatter: function (val) {
                return Math.abs(Math.round(val)) + "%"
                }
            }
        }
    }

    let series = [{
        name: '',
        data: model && model.map(c => { return c.data })
    }]

    return (
        <Chart options={options} series={series} type="bar" width={500} height={320} />
    )
}
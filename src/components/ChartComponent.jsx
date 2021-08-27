import React from 'react'
import Chart from 'react-apexcharts'

export const ChartComponent = ({ model }) => {

    let options = {
        chart: {
            id: 'apexchart-example'
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },

        xaxis: {
            categories: model && model.map(c => { return c.category })
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
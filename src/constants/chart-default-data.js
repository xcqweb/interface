export let data1 = {
    legend: {
        data: ['图例'],
        bottom: 0,
    },
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
            alignWithLabel: true
        }
    },
    yAxis: {
        type: 'value'
    },
    series: {
        name: '图例',
        type: 'line',
        data: [10, 52, 200, 334, 390, 330, 220],
        markLine: {
            silent: true,
            data: []
        }
    }
}

export let data2 = {
    tooltip: {
        formatter: "{a} <br/>{b} : {c}%"
    },
    series: {
        type: 'gauge',
        detail: {
            formatter: '{value}%'
        },
        data: [50],
        min: 0,
        max: 100,
    },
}
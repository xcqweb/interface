export let data1 = {
    title: {
        text: '标题',
    },
    legend: {
        data: ['图例'],
        bottom: 0,
    },
    color: ['#3398DB'],
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
    title: {
        text: '标题',
    },
    tooltip: {
        formatter: "{a} <br/>{b} : {c}%"
    },
    series: {
        name: '业务指标',
        type: 'gauge',
        detail: {
            formatter: '{value}%'
        },
        data: [{
            value: 50,
            name: '完成率'
        }],
        min: 0,
        max: 100,
    },
}
export let data1 = {
    legend: {
        show:true,
        data: ['图例'],
        x:'center',
        y:'bottom',
        orient: 'horizontal',
        textStyle:{
            
        }
    },
    grid:{
        top:45,
        bottom:45,
        left:45,
        right:45
    },
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: {
            lineStyle: {

            }
        },
        axisTick: {
            lineStyle: {

            }
        },
        axisLabel: {
            lineStyle: {

            }
        }
    },
    yAxis: {
        type: 'value',
        splitLine:{
            lineStyle:{

            }
        },
        axisLine:{
            lineStyle:{

            }
        },
        axisTick:{
            lineStyle: {

            }
        },
        axisLabel:{
            lineStyle: {

            }
        }
    },
    series: [{
        name: '图例',
        type: 'line',
        data: [10, 52, 200, 334, 390, 330, 220],
        markLine: {
            silent: true,
            data: [],
            symbol:'none', // 去掉基准线箭头和点
        }
    }]
}

export let data2 = {
    tooltip: {
        formatter: "{c}"
    },
    series: {
        name:'仪表盘',
        type: 'gauge',
        radius:'80%',
        detail: {
            show:false,
            formatter: '{value}%'
        },
        data: [{name:'',value:50}],
        min: 0,
        max: 100,
    },
}
export let data1 = {
    color: ['#3D91F7', '#61C3FA', '#A838D8', '#EE6B5F', '#6DDAA6', '#F7B83D'],
    legend: {
        show:true,
        data: ['图例'],
        x:'center',
        y:'bottom',
        padding:[40,0,0,0],
        orient: 'horizontal',
        textStyle:{
            
        }
    },
    grid:{
        top:60,
        bottom:50,
        left:50,
        right:50,
        containLabel: true
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
    dataZoom:[{
        type:'inside',
        id:'insideX',
        xAxisIndex:0,
        zoomOnMouseWheel:true,
        moveOnMouseMove:true,
    }],
    series: [{
        name: '图例',
        type: 'line',
        data: [10, 52, 200, 334, 390, 330, 220],
        connectNulls: true,
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
        radius:'100%',
        center: ['50%', '62%'],
        detail: {
            show:false,
            formatter: '{value}%'
        },
        title: {
            show:false
        },
        data: [{name:'',value:50}],
        min: 0,
        max: 100,
    },
}
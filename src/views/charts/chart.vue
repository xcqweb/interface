<template>
  <div>
    <v-chart
      ref="chart"
      :options="options"
      autoresize
      style="height:320px;width:100%;"
    />
  </div>
</template>

<script>
export default{
    data() {
        return {
            options: {
                title : {
                    text: '未来一周气温变化',
                    subtext: '纯属虚构'
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['最高气温','最低气温']
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : ['周一','周二','周三','周四','周五','周六','周日']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value} °C'
                        }
                    }
                ],
                series : [
                    {
                        name:'最高气温',
                        type:'line',
                        data:[11, 11, 15, 13, 12, 13, 10],
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    },
                    {
                        name:'最低气温',
                        type:'line',
                        data:[1, -2, 2, 5, 3, 2, 0],
                        markPoint : {
                            data : [
                                {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                            ]
                        },
                        markLine : {
                            data : [
                                {type : 'average', name : '平均值'}
                            ]
                        }
                    }
                ]
            }
        }
    },
    mounted() {
        const component = this.$mount();
        let echartsCon = document.querySelectorAll(".echarts_con")
        let targetCon = echartsCon[1]
        targetCon.style.cssText = "width:320px;height:240px;position:relative;top: -26vh;left: -22vh;"
        targetCon.appendChild(component.$el)
    },
    methods: {
        
    },      
}
</script>

<style scoped lang="less">

</style>

<style lang="less">
  
</style>

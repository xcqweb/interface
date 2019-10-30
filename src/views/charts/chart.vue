<template>
  <!--delete_flag_chartDialog_terry 用来特殊标志-删除 其他地方不能用-->
  <div class="delete_flag_chartDialog_terry">
    <div class="background" />
    <div
      class="geDialog"
      style="width:640px; left:calc(50% - 320px);top:20%; z-index: 10005;"
    >
      <p
        class="geDialogTitle"
        @click="hideChartDialog"
      >
        编辑图表
      </p>
      <div
        class="geDialogInfo interface_chart"
        style="overflow-y: auto;max-height: 70vh;"
      >
        <v-chart
          :options="shapeName=='lineChart' ? options1 : options2"
          autoresize
          style="height:300px;width:46%;"
        />
        <div style="width:46%">
          <div v-if="shapeName=='gaugeChart'">
            <div class="item-title">
              数值范围
            </div>
            <div
              style="display:flex;"
            >
              <div
                class="item-container"
              >
                <span style="color:#797979;margin:0 6px;">上限</span>
                <input
                  v-model="progressMax"
                  v-number.minus="1"
                  style="border-left:none;border-right:none;width:52%;"
                  @keyup.enter="changeProgress"
                  @blur="changeProgress"
                >
              </div>
              <div
                class="item-container"
                style="margin-left:10px;"
              >
                <span style="color:#797979;margin:0 6px;">下限</span>
                <input
                  v-model="progressMin"
                  v-number.minus="1"
                  style="border-left:none;border-right:none;width:52%;"
                  @keyup.enter="changeProgress"
                  @blur="changeProgress"
                > 
              </div>
            </div>
          </div>
          <div v-if="shapeName=='lineChart'">
            <div
              class="item-title"
              style="display:flex;justify-content:space-between;align-items:center;"
            >
              图例
              <i-switch
                v-model="chartLegend"
                size="small"
                @on-change="chooseLegend"
              />
              <div
                v-visible="chartLegend"
                v-clickOutSide="hideLegendChooseFun"
                class="item-container fontSet"
                style="justify-content:space-between;position:relative;"
              >
                {{ legendChooseText }}
                <img
                  src="../../assets/images/menu/down_ic.png"
                  @click="showLegendChoose=true"
                >
                <ul
                  v-if="showLegendChoose"
                  class="font-dialog"
                  @mouseleave="showLegendChoose=false"
                  @keyup.enter="showLegendChoose=false"
                  @blur="showLegendChoose=false"
                >
                  <li
                    v-for="(d,index) in legendChooseList"
                    :key="index"
                    @click="changeLegendChoose(d,$event)"
                  >
                    {{ d.text }}
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="item-title"
              style="display:flex;justify-content:space-between;"
            >
              风格
              <div
                class="setColor"
                style="width:80%;"
                :style="{backgroundColor:styleColorBg}"
                @click="pickStyleColor"
              />
            </div>
            <div
              class="item-title"
              style="display:flex;justify-content:space-between;"
            >
              指标
              <div
                v-if="!isAddMark"
                style="display:flex;align-items:center;"
                @click="addMark"
              >
                <img src="../../assets/images/rightsidebar/plus_ic.png"> 添加
              </div>
            </div>
            <div
              v-if="isAddMark"
              class="addMark-con"
            >
              <div style="display:flex;justify-content:space-between;align-items:center;">
                名称 <input
                  v-model="markName"
                  style="width:82%;padding-left:4px;"
                >
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                数值 <input
                  v-model="markValue"
                  v-number.minus="1"
                  style="width:82%;padding-left:4px;"
                >
              </div>
              <div style="display:flex;margin-top:10px;"> 
                <div style="margin-right:5.5%;">
                  线条
                </div>
                <div
                  class="setColor"
                  style="flex:1;margin-right:6px;"
                  :style="{backgroundColor:borderColor}"
                  @click="pickChartBorderColor"
                />
                <div
                  v-clickOutSide="hideBorderLine"
                  class="item-container fontSet"
                  style="justify-content:space-between;position:relative;flex:1;"
                  @click="showBorderLine=true"
                >
                  <div :class="borderLineCls" />
                  <img src="../../assets/images/menu/down_ic.png">
                  <ul
                    v-if="showBorderLine"
                    class="font-dialog"
                    @mouseleave="showBorderLine=false"
                    @keyup.enter="showBorderLine=false"
                    @blur="showBorderLine=false"
                  >
                    <li
                      v-for="(d,index) in borderLineList"
                      :key="index"
                      @click="changeChartBorderLine(d,$event)"
                    >
                      <div style="width:100%;height:4px;display:inline-block;vertical-align:middle;">
                        <div :class="d" />
                      </div>
                    </li>
                  </ul>
                </div>
                <div
                  v-clickOutSide="hideBorderLineBold"
                  class="item-container fontSet"
                  style="justify-content:space-between;position:relative;flex:1;margin:0;"
                >
                  <div>{{ borderLineBoldText }}</div>
                  <img 
                    src="../../assets/images/menu/down_ic.png"
                    @click="showBorderLineBold=true"
                  >
                  <ul
                    v-if="showBorderLineBold"
                    class="font-dialog"
                    style="height:100px;overflow:auto;"
                    @mouseleave="showBorderLineBold=false"
                    @keyup.enter="showBorderLineBold=false"
                    @blur="showBorderLineBold=false"
                  >
                    <li
                      v-for="(d,index) in borderLineBoldList"
                      :key="index"
                      @click="changeChartBorderLineBold(d,$event)"
                    >
                      {{ d }}
                    </li>
                  </ul>
                </div>
              </div>
              <div style="display:flex;justify-content:space-between;margin-top:10px;">
                <button
                  class="mutual-btn"
                  @click="cancel()"
                >
                  取消
                </button>
                <button
                  class="mutual-btn selected"
                  @click="submit()"
                >
                  提交
                </button>
              </div>
            </div>
            <div
              v-if="!isAddMark"
              style="max-height:220px;overflow-y:scroll;"
            >
              <div
                v-for="(item,index) in markLineList"
                :key="index"
                class="markline-item"
                @click="editMarkLineFun(item,index,$event)"
              >
                <div
                  style="display:flex;justify-content:space-between;"
                >
                  <div>名称-{{ item.markName }}</div>
                  数值-{{ item.markValue }}
                  <img
                    src="../../assets/images/rightsidebar/dele_ic.png"
                    @click="delMark(item,index,$event)"
                  >
                </div>
                <div style="display:flex;margin-top:10px;"> 
                  <div style="margin-right:5.5%;">
                    线条
                  </div>
                  <div
                    class="setColor"
                    style="flex:1;margin-right:6px;"
                    :style="{backgroundColor:item.borderColor}"
                  />
                  <div
                    class="item-container fontSet"
                    style="justify-content:space-between;position:relative;flex:1;"
                  >
                    <div :class="item.borderLineCls" />
                  </div>
                  <div
                    class="item-container fontSet"
                    style="justify-content:space-between;position:relative;flex:1;margin:0;"
                  >
                    {{ item.borderLineBoldText }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {sureDialog} from '../../services/Utils'
import {data1,data2} from '../../constants/chart-default-data'
export default{
    props:['shapeName','bindChartProps'],
    data() {
        return {
            options1:data1,
            options2:data2,
            progressMax:100,
            progressMin:0,
            chartLegend:true,
            markLineList:[],//标线 line-chart
            isAddMark:false,
            markName:'指标1',
            markValue:0,
            borderColor:"#000",
            borderLineCls:"border-line",
            borderLineBoldText:"1",
            showBorderLine:false,
            showBorderLineBold:false,
            borderLineList:['border-line','border-dash'],
            borderLineBoldList:[1,2,3,4,5],
            editMarkLine:null,
            editMarkLineIndex:0,
            styleColorBg:'#000',
            showLegendChoose:false,
            legendChooseText:'底部',
            legendChooseList:[{text:'底部',type:1},{text:'顶部',type:2},{text:'左侧',type:3},{text:'右侧',type:4}]
        }
    },
    mounted() {
        const component = this.$mount()
        document.body.appendChild(component.$el)
        if(this.bindChartProps) {
            if(this.shapeName == 'lineChart') {
                this.options1 = this.bindChartProps
                this.chartLegend = this.options1.legend.show
                this.initLegendChoose()
                let lineData = this.bindChartProps.series[0].markLine.data
                if(lineData.length) {
                    lineData.forEach((item)=>{
                        this.markLineList.push({
                            markName:item.label,
                            markValue:item.yAxis,
                            borderColor:item.lineStyle.color,
                            borderLineCls:item.lineStyle.type === 'solid' ? 'border-line' : 'border-dash',
                            borderLineBoldText:item.lineStyle.width,
                        })
                    })
                }
                this.styleColorBg = this.bindChartProps.yAxis.splitLine.lineStyle.color
            }else{
                this.options2 = this.bindChartProps
                this.progressMin = this.options2.series.min
                this.progressMax = this.options2.series.max
            }
        }
    },
    destoryed() {
    },
    methods: {
        hideChartDialog() {
            let options
            if(this.shapeName == 'lineChart') {
                this.setMarkLineFun()
                options = Object.assign({},this.options1)
            }else{
                options = Object.assign({},this.options2)
            }
            this.$emit("hideChartDialog",options)
        },
        setMarkLineFun() {
            this.options1.series[0].markLine.data.splice(0)
            this.markLineList.forEach((item)=>{
                this.options1.series[0].markLine.data.push({
                    lineStyle:{
                        color:item.borderColor,
                        type:item.borderLineCls === 'border-line' ? 'solid' : 'dashed',
                        width:item.borderLineBoldText
                    },
                    label:item.markName,
                    yAxis:item.markValue
                })
            })
            let markValArr = this.markLineList.map(item=>{
                return item.markValue
            })
            let yAxisMax = Math.max(...markValArr,...this.options1.series[0].data)
            this.options1.yAxis.max = yAxisMax
        },
        changeProgress() {
            this.options2.series.min = this.progressMin
            this.options2.series.max = this.progressMax
        },
        addMark() {//折线chart 添加标线
            this.isAddMark = true
            this.editMarkLine = null
            this.markName = `指标${this.markLineList.length + 1}`
        },
        pickChartBorderColor() {//chart mark-line
            this.myEditorUi.pickColor(this.borderColor,color=>{
                this.borderColor = color
            })
        },
        changeChartBorderLine(d,e) {
            this.borderLineCls = d
            this.showBorderLine = false
            e.stopPropagation()
        },
        changeChartBorderLineBold(d,e) {
            this.borderLineBoldText = d
            this.showBorderLineBold = false
            e.stopPropagation()
        },
        cancel() {
            this.isAddMark = false
        },
        hideBorderLine() {
            this.showBorderLine = false
        },
        submit() {
            if(this.editMarkLine) {
                this.markLineList.splice(this.editMarkLineIndex,1)
            }
            this.markLineList.push(
                {
                    markName:this.markName,
                    markValue:this.markValue,
                    borderColor:this.borderColor,
                    borderLineCls:this.borderLineCls,
                    borderLineBoldText:this.borderLineBoldText,
                }
            )
            this.setMarkLineFun()
            this.isAddMark = false
        },
        hideBorderLineBold() {
            this.showBorderLineBold = false
        },
        delMark(d,index,evet) {
            evet.stopPropagation()
            sureDialog(this.myEditorUi,`确定要删除${d.markName}吗`,()=>{
                this.markLineList.splice(index,1)
                this.setMarkLineFun()
            },)
        },
        editMarkLineFun(item,index,evet) {
            evet.stopPropagation()
            this.editMarkLine = item
            this.editMarkLineIndex = index
            this.isAddMark = true
            this.markName = item.markName
            this.markValue = item.markValue
            this.borderColor = item.borderColor
            this.borderLineCls = item.borderLineCls
            this.borderLineBoldText = item.borderLineBoldText
        },
        chooseLegend() {
            this.options1.legend.show = this.chartLegend
            this.initLegendChoose()
        },
        pickStyleColor() {
            this.myEditorUi.pickColor(this.styleColorBg,color=>{
                this.styleColorBg = color
                let obj = {color:color}
                this.options1.yAxis.splitLine.lineStyle = obj
                this.options1.yAxis.axisLine.lineStyle = obj
                this.options1.yAxis.axisTick.lineStyle = obj
                this.options1.xAxis.axisLabel.lineStyle = obj
                this.options1.xAxis.axisLine.lineStyle = obj
                this.options1.xAxis.axisTick.lineStyle = obj
                this.options1.xAxis.axisLabel.lineStyle = obj
                this.options1.legend.textStyle = obj
            })
        },
        changeLegendChoose(d,e) {
            this.legendChooseText = d.text
            let tempLegend = {
                show:true,
                data: ['图例'],
                textStyle:{
            
                }
            }
            tempLegend.mtype = d.type
            switch(d.type) {
                case 1:
                    tempLegend.x = 'center'
                    tempLegend.y = 'bottom'
                    tempLegend.orient = 'horizontal'
                    break
                case 2:
                    tempLegend.x = 'center'
                    tempLegend.y = 'top'
                    tempLegend.orient = 'horizontal'
                    tempLegend.padding = [10,0,0,0]
                    break
                case 3:
                    tempLegend.x = 'left'
                    tempLegend.y = 'center'
                    tempLegend.orient = 'vertical'
                    tempLegend.padding = [0,0,0,-30]
                    this.options1.grid.left = 60
                    break
                case 4:
                    tempLegend.x = 'right'
                    tempLegend.y = 'center'
                    tempLegend.orient = 'vertical'
                    tempLegend.padding = [0,-30,0,0]
                    break
            }
            this.options1.legend = Object.assign({},tempLegend)
            this.showLegendChoose = false
            e.stopPropagation()
        },
        initLegendChoose() {
            let mtype = this.options1.legend.mtype || 1
            this.legendChooseText = this.legendChooseList[mtype - 1].text
        },
        hideLegendChooseFun() {
            this.showLegendChoose = false
        }
    },      
}
</script>

<style scoped lang="less">
 li{
    padding:3px 6px;
}
li:hover{
    background:#3D91F7;
    color:#fff;
}
 .item-title{
    border-top:solid 1px #ccc;
    padding-top:6px;
    margin-top:6px;
}
 input{
    outline: none;
    border:none;
    width:100%;
    height:24px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(212,212,212,1);
    border-radius:2px;
}
 .addMark-con{
    margin-top:10px;
    border:1px solid rgba(212,212,212,1);
    border-radius:2px;
    padding:8px 4px;
}
.markline-item{
    margin-top:10px;
    border:1px solid rgba(212,212,212,1);
    border-radius:2px;
    padding:4px;
}
 .setColor{
    width:24%;
    height:24px;
    background: #000;
    border-radius: 2px;
    border:1px solid rgba(212,212,212,1);
}
.item-container{
    width:100%;
    height:24px;
    display: flex;
    align-items:center;
    background:rgba(255,255,255,1);
    border:1px solid rgba(212,212,212,1);
    border-radius:2px;
    font-weight:400;
    color:rgba(37,37,37,1);
}
 .font-dialog{
    position:absolute;
    left:0;
    top:24px;
    z-index:22;
    background:#f5f5f5;
    width:100%;
    border:1px solid rgba(204,204,204,1);
    box-shadow:0px 3px 8px 0px rgba(0, 0, 0, 0.2);
    opacity:0.98;
    border-radius:0px 0px 2px 2px;
}
.fontSet{
    width: 50%;
    padding-left: 6px;
    margin-right: 6px;
}
.border-line{
    background:#000;
    height:1px;
    box-sizing:border-box;
    width:40px;
}
.border-dash{ 
    border:dashed 1px #000;
    height:1px;
    width:40px;
}
</style>

<style lang="less">
.interface_chart{
    display:flex;
    justify-content: space-between;
    padding:10px 4px 30px !important;
}
</style>

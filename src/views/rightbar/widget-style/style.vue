<template>
  <div
    class="dialogPage"
    style="padding:0 4px 40px;overflow: auto;height:100%;margin-bottom:40px;"
  >
    <p style="margin-top:10px;">
      组件名称
    </p>
    <input
      v-model="widgetName"
      style="padding:0 4px;"
      @keyup.enter="changeName"
    >
    <div class="item-line" />
    <div
      v-if="shapeName!='menuCell' && shapeName!='tableCell'"
      style="display:flex;margin-top:4px;"
    >
      <div
        class="item-container"
      >
        <span style="color:#797979;margin:0 6px;">X</span>
        <input
          v-model="positionSize.x"
          style="border-left:none;border-right:none;"
          @keyup.enter="changePositionSize"
        >
      </div>
      <div
        class="item-container"
        style="margin-left:10px;"
      >
        <span style="color:#797979;margin:0 6px;">Y</span>
        <input
          v-model="positionSize.y"
          style="border-left:none;border-right:none;"
          @keyup.enter="changePositionSize"
        > 
      </div>
    </div>
    <div style="display:flex;margin-top:2px;">
      <div
        class="item-container"
      >
        <span style="color:#797979;margin:0 6px;">宽</span>
        <input
          v-model="positionSize.width"
          style="border-left:none;border-right:none;"
          @keyup.enter="changePositionSize"
        >
      </div>
      <div
        class="item-container"
        style="margin-left:10px;"
      >
        <span style="color:#797979;margin:0 6px;">高</span>
        <input
          v-model="positionSize.height"
          style="border-left:none;border-right:none;"
          @keyup.enter="changePositionSize"
        > 
      </div>
    </div>
    <div
      v-if="shapeName=='tableBox'"
      style="display:flex;margin-top:2px;"
    >
      <div
        class="item-container"
      >
        <span style="color:#797979;margin:0 6px;">行</span>
        <input
          v-model="tableRow"
          style="border-left:none;border-right:none;"
          @keyup.enter="changeTableSize"
        >
      </div>
      <div
        class="item-container"
        style="margin-left:10px;"
      >
        <span style="color:#797979;margin:0 6px;">列</span>
        <input
          v-model="tableCol"
          style="border-left:none;border-right:none;"
          @keyup.enter="changeTableSize"
        > 
      </div>
    </div>
    <div v-if="shapeName=='menuCell'">
      <div class="item-title">
        选中
      </div>
      <i-switch
        v-model="selectMenu"
        size="small"
      />
    </div>
    <div v-if="shapeName.includes('Chart')">
      <div
        class="item-title"
        style="display:flex;justify-content:space-between;"
      >
        标题
        <i-switch
          v-model="chartTitle"
          size="small"
        />
      </div>
    </div>
    <div
      v-if="shapeName!='image' && selectMenu && shapeName!='light' && !shapeName.includes('pipeline') && shapeName!='progress' && chartTitle"
      class="titleSet"
    >
      <div class="item-title">
        文本
      </div>
      <div class="titleCon">
        <div class="itemLine">
          <div
            v-clickOutSide="hideFont"
            class="item-container fontSet"
            style="justify-content:space-between;position:relative;"
            @click="showFont=true"
          >
            {{ fontText }}
            <img src="../../../assets/images/menu/down_ic.png">
            <ul
              v-if="showFont"
              class="font-dialog"
              @mouseleave="showFont=false"
              @blur="showFont=false"
            >
              <li
                v-for="(d,index) in fontList"
                :key="index"
                @click="changeFont(d,$event)"
              >
                {{ d }}
              </li>
            </ul>
          </div>
          <div
            class="setBold"
            :class="{'selected':isSetBold}"
            @click="setBold"
          />
          <div
            class="setColor"
            :style="{backgroundColor:fontColor}"
            @click="pickFontColor"
          />
        </div>
        <div class="itemLine">
          <div class="setLevel">
            <div
              class="left"
              :class="{'selected':alignIndex1==1}"
              @click="changeAlignIndex(1,1)"
            />
            <div
              class="center"
              :class="{'selected':alignIndex1==2}"
              @click="changeAlignIndex(1,2)"
            />
            <div
              class="right"
              :class="{'selected':alignIndex1==3}"
              @click="changeAlignIndex(1,3)"
            />
          </div>
          <div class="setVertical">
            <div
              class="top" 
              :class="{'selected':alignIndex2==1}"
              @click="changeAlignIndex(2,1)"
            />
            <div
              class="mid"
              :class="{'selected':alignIndex2==2}"
              @click="changeAlignIndex(2,2)"
            />
            <div
              class="bottom" 
              :class="{'selected':alignIndex2==3}"
              @click="changeAlignIndex(2,3)"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="shapeName.includes('Chart')">
      <div
        v-if="shapeName=='lineChart'"
        class="item-title"
        style="display:flex;justify-content:space-between;"
      >
        图例
        <i-switch
          v-model="chartLegend"
          size="small"
        />
      </div>
      <div
        v-if="shapeName=='lineChart'"
        class="item-title"
        style="display:flex;justify-content:space-between;"
      >
        网格线
        <i-switch
          v-model="chartGrid"
          size="small"
        />
      </div>
      <div>
        <p style="margin-top:10px;">
          背景颜色
        </p>
        <div
          class="item-container"
          style="position:relative;"
          :style="{backgroundColor:bgChartColor}"
          @click="pickBgChartColor"
        />
      </div>
    </div>
    <div v-if="selectMenu && shapeName!='light' && !shapeName.includes('pipeline') && shapeName!='progress' && !shapeName.includes('Chart')">
      <div class="item-title">
        外观
      </div>
      <div v-if="!fillStyleList.includes(shapeName)">
        <p style="margin-top:10px;">
          填充
        </p>
        <div
          class="item-container"
          style="position:relative;"
          :style="{backgroundColor:bgColor}"
          @click="pickBgColor"
        />
      </div>
      <div>
        <p style="margin-top:10px;">
          {{ shapeName=='beeline' ? '线条' : '边框' }}
        </p>
        <div style="display:flex;"> 
          <div
            class="setColor"
            style="flex:1;margin-right:6px;"
            :style="{backgroundColor:borderColor}"
            @click="pickBorderColor"
          />
          <div
            v-clickOutSide="hideBorderLine"
            class="item-container fontSet"
            style="justify-content:space-between;position:relative;flex:1;"
            @click="showBorderLine=true"
          >
            <div :class="borderLineCls" />
            <img src="../../../assets/images/menu/down_ic.png">
            <ul
              v-if="showBorderLine"
              class="font-dialog"
              @mouseleave="showBorderLine=false"
              @blur="showBorderLine=false"
            >
              <li
                v-for="(d,index) in borderLineList"
                :key="index"
                @click="changeBorderLine(d,$event)"
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
            @click="showBorderLineBold=true"
          >
            <div>{{ borderLineBoldText }}</div>
            <img src="../../../assets/images/menu/down_ic.png">
            <ul
              v-if="showBorderLineBold"
              class="font-dialog"
              style="height:100px;overflow:auto;"
              @mouseleave="showBorderLineBold=false"
              @blur="showBorderLineBold=false"
            >
              <li
                v-for="(d,index) in borderLineBoldList"
                :key="index"
                @click="changeBorderLineBold(d,$event)"
              >
                {{ d }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="shapeName=='beeline'">
        <p style="margin-top:10px;">
          箭头
        </p>
        <div
          v-clickOutSide="hideArrowFun"
          class="item-container fontSet"
          style="justify-content:space-between;position:relative;width:100%;"
          @click="showArrowDialog=true"
        >
          <div :class="arrowCls" />
          <img src="../../../assets/images/menu/down_ic.png">
          <ul
            v-if="showArrowDialog"
            class="font-dialog"
            @mouseleave="showArrowDialog=false"
            @blur="showArrowDialog=false"
          >
            <li
              v-for="(d,index) in arrowClsList"
              :key="index"
              @click="changeArrowDialog(d,$event)"
            >
              <div :class="d" />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div
      v-if="shapeName.includes('pipeline')"
      class="titleSet"
    >
      <div class="item-title">
        流动指示
      </div>
      <div class="titleCon">
        <div class="itemLine">
          <div
            v-clickOutSide="hidePipelineFlow"
            class="item-container fontSet"
            style="justify-content:space-between;position:relative;width:100%;"
            @click="pipelineFlow=true"
          >
            {{ pipelineFlowText }}
            <img src="../../../assets/images/menu/down_ic.png">
            <ul
              v-if="pipelineFlow"
              class="font-dialog"
              @mouseleave="pipelineFlow=false"
              @blur="pipelineFlow=false"
            >
              <li
                v-for="(d,index) in pipelineFlowList"
                :key="index"
                @click="changePipelineFlow(d,$event)"
              >
                {{ d.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-if="shapeName=='progress' || shapeName=='gaugeChart'">
      <div class="item-title">
        数值范围
      </div>
      <div
        v-if="shapeName!='menuCell' && shapeName!='tableCell'"
        style="display:flex;"
      >
        <div
          class="item-container"
        >
          <span style="color:#797979;margin:0 6px;">上限</span>
          <input
            v-model="progressMax"
            style="border-left:none;border-right:none;width:52%;"
            @keyup.enter="changeProgress"
          >
        </div>
        <div
          class="item-container"
          style="margin-left:10px;"
        >
          <span style="color:#797979;margin:0 6px;">下限</span>
          <input
            v-model="progressMin"
            style="border-left:none;border-right:none;width:52%;"
            @keyup.enter="changeProgress"
          > 
        </div>
      </div>
      <div v-if="shapeName!='gaugeChart'">
        <div
          class="item-title"
          style="border:none;"
        >
          数值显示
        </div>
        <div
          class="titleCon"
        >
          <div class="itemLine">
            <div
              v-clickOutSide="hideProgressDialogFun"
              class="item-container fontSet"
              style="justify-content:space-between;position:relative;width:100%;"
              @click="progressDialog=true"
            >
              {{ progressText }}
              <img src="../../../assets/images/menu/down_ic.png">
              <ul
                v-if="progressDialog"
                class="font-dialog"
                @mouseleave="progressDialog=false"
                @blur="progressDialog=false"
              >
                <li
                  v-for="(d,index) in progressDialogList"
                  :key="index"
                  @click="changeProgressTypeDialog(d,$event)"
                >
                  {{ d.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="shapeName=='lineChart'">
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
          <img src="../../../assets/images/rightsidebar/plus_ic.png"> 添加
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
            <img src="../../../assets/images/menu/down_ic.png">
            <ul
              v-if="showBorderLine"
              class="font-dialog"
              @mouseleave="showBorderLine=false"
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
            @click="showBorderLineBold=true"
          >
            <div>{{ borderLineBoldText }}</div>
            <img src="../../../assets/images/menu/down_ic.png">
            <ul
              v-if="showBorderLineBold"
              class="font-dialog"
              style="height:100px;overflow:auto;"
              @mouseleave="showBorderLineBold=false"
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
      >
        <div
          v-for="(item,index) in markLineList"
          :key="index"
          class="markline-item"
        >
          <div
            style="display:flex;justify-content:space-between;"
            @click="delMark(item,index)"
          >
            名称-{{ item.markName }}
            <img src="../../../assets/images/rightsidebar/dele_ic.png">
          </div>
          <p style="margin:10px 0;">
            数值-{{ item.markValue }}
          </p>
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
</template>
<script>
import {mxEvent,mxConstants,mxEventObject} from '../../../services/mxGlobal'
import {sureDialog} from '../../../services/Utils'
let newFontColor = "#000000",newBgColor = "#ffffff",newBorderColor = "#000000",name
let alignArr = [mxConstants.ALIGN_LEFT,mxConstants.ALIGN_CENTER,mxConstants.ALIGN_RIGHT]
let valignArr = [mxConstants.ALIGN_TOP,mxConstants.ALIGN_MIDDLE,mxConstants.ALIGN_BOTTOM]

export default {
    data() {
        return {
            showFont:false,
            fontColor:'#333333',
            fontText:12,
            alignIndex1:2,
            showBorderLine:false,
            alignIndex2:2,
            isSetBold:false,
            showBorderLineBold:false,
            selectMenu:true,
            bgColor:'#277AE0',
            borderColor:'#277AE0',
            borderLineList:['border-line','border-dash'],
            borderLineCls:'border-line',
            showArrowDialog:false,
            fontList:[
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20
            ],
            borderLineBoldText:1,
            borderLineBoldList:[
                1,2,3,4,5,6,7,8,9,10
            ],
            arrowClsList:['arrow-empty','arrow-left','arrow-right','arrow-double'],
            arrowCls:'arrow-empty',
            fillStyleList:['beeline','image'],
            tableRow:3,
            tableCol:3,
            pipelineFlow:false,//指示灯下拉框
            pipelineFlowText:'无指示',
            pipelineFlowList:[{name:'无指示',value:'none'},{name:'正向流动',value:'forward'},{name:'反向流动',value:'back'}],
            progressMax:100,
            progressMin:0,
            progressDialog:false,
            progressText:'百分比',
            progressDialogList:[{name:'百分比',value:'percent'},{name:'实际数值',value:'realValue'}],
            chartTitle:true,
            chartLegend:false,
            chartGrid:false,//chart网格线
            bgChartColor:"#fff",
            markLineList:[],//标线 line-chart
            isAddMark:false,
            markName:'指标1',
            markValue:0
        }
    },
    computed: {
        shapeName() {
            return this.$store.state.main.widgetInfo.shapeInfo.shape
        },
        widgetName: {
            get() {
                return this.$store.state.main.widgetInfo.widgetName
                
            },
            set(val) {
                name = val
            }
        },
        positionSize() {
            console.log(this.shapeName)
            let {x,y,width,height} = this.$store.state.main.widgetInfo.geo
            return {
                x:x,
                y:y,
                width:width,
                height:height,
            }
        }
    },
    created() {},
    mounted() {
        let graph = this.myEditorUi.editor.graph
        graph.getModel().addListener(mxEvent.CHANGE,()=>{
            this.$store.commit('getWidgetInfo',graph)
        })
        this.fontText = this.$store.state.main.widgetInfo.fontSize
        this.isSetBold = this.$store.state.main.widgetInfo.isSetBold
        this.fontColor =  this.$store.state.main.widgetInfo.color
        this.alignIndex1 = alignArr.indexOf(this.$store.state.main.widgetInfo.align) + 1
        this.alignIndex2 = valignArr.indexOf(this.$store.state.main.widgetInfo.valign) + 1
        this.bgColor =  this.$store.state.main.widgetInfo.bgColor
        this.borderColor =  this.$store.state.main.widgetInfo.borderColor
        this.borderLineBoldText =  this.$store.state.main.widgetInfo.borderBold
        this.borderLineCls = this.$store.state.main.widgetInfo.borderLineCls
        if(this.shapeName == 'beeline') {
            this.arrowCls = this.$store.state.main.widgetInfo.arrowCls
        }
        if(this.shapeName == 'tableBox') {
            let res = this.getRowColNum(graph)
            this.tableRow = res[0]
            this.tableCol = res[1]
        }
    },
    methods: {
        changeName() {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let cellInfo = graph.getModel().getValue(cell);
            cellInfo.setAttribute('palettename',name);
            graph.getModel().setValue(cell, cellInfo);
            this.$store.commit('getWidgetInfo',graph)
        },
        changePositionSize() {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let geo = graph.getCellGeometry(cell)
            geo.x = +this.positionSize.x
            geo.y = +this.positionSize.y
            geo.width = +this.positionSize.width
            geo.height = +this.positionSize.height
            graph.getModel().beginUpdate()
            graph.getModel().setGeometry(cell,geo)
            graph.getModel().endUpdate()
            this.$store.commit('getWidgetInfo',graph)
            
        },
        changeFont(d,e) {
            this.fontText = d
            let graph = this.myEditorUi.editor.graph
            let ss = this.shapeName === 'tableBox' || this.shapeName === 'menulist' ? graph.getSelectionCells().concat(graph.getSelectionCell().children) : graph.getSelectionCells();
            let key = mxConstants.STYLE_FONTSIZE
            graph.setCellStyles(key,d, ss);
            this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [key],
                'values', [+d], 'cells', ss));
            this.showFont = false;
            e.stopPropagation()
        },
        changeAlignIndex(type,index) {
            if(type == 1) {
                this.alignIndex1 = index
                this.myEditorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [alignArr[index - 1]])()
            }else{
                this.alignIndex2 = index
                this.myEditorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [valignArr[index - 1]])()
            }
        },
        setBold() {
            this.isSetBold = !this.isSetBold
            let graph = this.myEditorUi.editor.graph
            let ss = this.shapeName === 'tableBox' || this.shapeName === 'menulist' ? graph.getSelectionCells().concat(graph.getSelectionCell().children) : graph.getSelectionCells();
            let bold = 0
            if(this.isSetBold) {
                bold = 1
            }
            graph.setCellStyles('fontStyle', bold, ss);
            this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', ['fontStyle'],'values', [bold], 'cells',ss));
        },
        hideFont() {
            this.showFont = false
        },
        pickFontColor() {
            this.myEditorUi.pickColor(newFontColor || 'none',color=>{
                newFontColor = color  
                this.fontColor = color
                let graph = this.myEditorUi.editor.graph
                let ss = this.shapeName === 'tableBox' || this.shapeName === 'menulist' ? graph.getSelectionCells().concat(graph.getSelectionCell().children) : graph.getSelectionCells()
                graph.setCellStyles('fontColor', color, ss);
                this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', ['fontColor'],'values', [color], 'cells', ss))
            });
        },
        pickBgColor() {
            this.myEditorUi.pickColor(newBgColor || 'none',color=>{
                newBgColor = color  
                this.bgColor = color
                let graph = this.myEditorUi.editor.graph
                graph.setCellStyles('fillColor', color, graph.getSelectionCells());
                this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', ['fillColor'],'values', [color], 'cells', graph.getSelectionCells()));
            });
        },
        pickBorderColor() {
            this.myEditorUi.pickColor(newBorderColor || 'none',color=>{
                newBorderColor = color  
                this.borderColor = color
                let graph = this.myEditorUi.editor.graph
                let key = 'strokeColor'
                if(this.shapeName == 'image') {
                    key = 'imageBorder'
                }
                graph.setCellStyles(key, color, graph.getSelectionCells());
                this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [key],'values', [color], 'cells', graph.getSelectionCells()));
            });
        },
        hideBorderLine() {
            this.showBorderLine = false
        },
        changeBorderLine(d,e) {
            this.borderLineCls = d
            let graph = this.myEditorUi.editor.graph
            let keys = [mxConstants.STYLE_DASHED],values = [null]
            if(d.includes('dash')) {
                keys = [mxConstants.STYLE_DASHED]
                values = ['1']
            }
            for (let i = 0; i < keys.length; i++) {
                graph.setCellStyles(keys[i], values[i]);
            }
            this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', keys,'values', values, 'cells', graph.getSelectionCells()));
            this.showBorderLine = false
            e.stopPropagation()
        },
        changeBorderLineBold(d,e) {
            this.borderLineBoldText = d
            let graph = this.myEditorUi.editor.graph
            graph.setCellStyles('strokeWidth', d, graph.getSelectionCells());
            this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', ['strokeWidth'],'values', [d], 'cells', graph.getSelectionCells()));
            this.showBorderLineBold = false;
            e.stopPropagation()
        },
        hideBorderLineBold() {
            this.showBorderLineBold = false
        },
        hideArrowFun() {
            this.showArrowDialog = false
        },
        changeArrowDialog(d,e) {
            this.arrowCls = d
            let keys = [],values = [],keys2 = [],values2 = []
            let graph = this.myEditorUi.editor.graph
            if(d.includes('left')) {
                keys = [mxConstants.STYLE_STARTARROW, 'startFill']
                values = [mxConstants.ARROW_CLASSIC, 1]
                keys2 = [mxConstants.STYLE_ENDARROW, 'startFill']
                values2 = [mxConstants.NONE, 0]
            }else if(d.includes('right')) {
                keys = [mxConstants.STYLE_ENDARROW, 'startFill']
                values = [mxConstants.ARROW_CLASSIC, 1]
                keys2 = [mxConstants.STYLE_STARTARROW, 'startFill']
                values2 = [mxConstants.NONE, 0]
            }else if(d.includes('double')) {
                keys = [mxConstants.STYLE_STARTARROW, 'startFill']
                values = [mxConstants.ARROW_CLASSIC, 1]
                keys2 = [mxConstants.STYLE_ENDARROW, 'startFill']
                values2 = [mxConstants.ARROW_CLASSIC, 1]
            }else{
                keys = [mxConstants.STYLE_ENDARROW, 'startFill']
                values = [mxConstants.NONE, 0]
                keys2 = [mxConstants.STYLE_STARTARROW, 'startFill']
                values2 = [mxConstants.NONE, 0]
            }
            for (let i = 0; i < keys2.length; i++) {
                graph.setCellStyles(keys2[i], values2[i]);
            }
            this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys',keys2,'values', values2, 'cells', graph.getSelectionCells()));
            
            for (let i = 0; i < keys.length; i++) {
                graph.setCellStyles(keys[i], values[i]);
            }
            this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys',keys,'values', values, 'cells', graph.getSelectionCells()));
            this.showArrowDialog = false
            e.stopPropagation()
        },
        getRowColNum(graph) {
            let cellLast =  this.getCellLast(graph)
            let table = graph.getSelectionCell()
            let currentRowNum = parseInt(table.geometry.height / cellLast.geometry.height)
            let currentColNum =  parseInt(table.geometry.width / cellLast.geometry.width)
            return [currentRowNum,currentColNum]
        },
        changeTableSize() {
            let actions = this.myEditorUi.actions
            let graph = this.myEditorUi.editor.graph
            let res = this.getRowColNum(graph)
           
            let disRow = this.tableRow - res[0]
            let disCol = this.tableCol - res[1]
            graph.getModel().beginUpdate()
            try{
                if(disRow > 0) {
                    for(let i = 0;i < disRow;i++) {
                        actions.insertTableCell('lower',this.getCellLast(graph))
                    }
                }else if(disRow < 0) {
                    for(let i = 0;i < -disRow;i++) {
                        actions.deleteTableCell('row',this.getCellLast(graph))
                    }
                }
                if(disCol > 0) {
                    for(let i = 0;i < disCol;i++) {
                        actions.insertTableCell('right',this.getCellLast(graph))
                    }
                }else if(disCol < 0) {
                    for(let i = 0;i < -disCol;i++) {
                        actions.deleteTableCell('col', this.getCellLast(graph))
                    }
                }
            }finally {
                graph.getModel().endUpdate();
            }
        },
        getCellLast(graph) {
            let table = graph.getSelectionCell()
            let children = table.children
            let cellLast = children[children.length - 1]
            return cellLast
        },
        hidePipelineFlow() {
            this.pipelineFlow = false
        },
        changePipelineFlow(d,e) {//管道
            this.pipelineFlowText = d.name
            this.pipelineFlow = false
            e.stopPropagation()
        },
        changeProgress() {

        },
        hideProgressDialogFun() {
            this.progressDialog = false
        },
        changeProgressTypeDialog(d,e) {//数值范围
            this.progressText = d.name
            this.progressDialog = false
            e.stopPropagation()
        },
        pickBgChartColor() {//chart 设置背景色
            this.myEditorUi.pickColor('#fff',color=>{
                this.bgChartColor = color
            })
        },
        addMark() {//折线chart 添加标线
            this.isAddMark = true
            this.markName = `指标${this.markLineList.length + 1}`
        },
        pickChartBorderColor() {//chart mark-line
            this.myEditorUi.pickColor('#fff',color=>{
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
            this.showBorderLineBold = false;
            e.stopPropagation()
        },
        cancel() {
            this.isAddMark = false
        },
        submit() {
            this.markLineList.push(
                {
                    markName:this.markName,
                    markValue:this.markValue,
                    borderColor:this.borderColor,
                    borderLineCls:this.borderLineCls,
                    borderLineBoldText:this.borderLineBoldText,
                }
            )
            this.isAddMark = false
        },
        delMark(d,index) {
            sureDialog(this.myEditorUi,`确定要删除${d.markName}吗`,()=>{
                this.markLineList.splice(index,1)
            },)
        },
    }
};
</script>

<style lang="less" scoped>
.dialogPage {
    input{
        outline: none;
        border:none;
        width:100%;
        height:24px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(212,212,212,1);
        border-radius:2px;
    }
    li{
        padding:3px 6px;
    }
    li:hover{
        background:#3D91F7;
        color:#fff;
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
    .item-line{
      margin:6px 0;
      background:#ccc;
      height:1px;
    }
    .item-title{
        border-top:solid 1px #ccc;
        padding-top:6px;
        margin-top:6px;
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
    .titleSet{
      margin-top: 10px;
    }
    .titleText{
      margin-bottom: 4px;
    }
    .fontSet{
      width: 50%;
      padding-left: 6px;
      margin-right: 6px;
    }
    .itemLine{
      display: flex;
      height: 24px;
      &:nth-child(2){
        margin-top: 5px;
      }
    }
    .setColor{
      width:24%;
      height:24px;
      background: #000;
      border-radius: 2px;
      border:1px solid rgba(212,212,212,1);
    }
    .setBold{
      width:24%;
      margin-right:2%;
      height:24px;
      border:1px solid rgba(212,212,212,1);
      border-radius:2px;
      background:url('../../../assets/images/rightsidebar/bold_ic1.png') no-repeat center center;
       &.selected{
          background:url('../../../assets/images/rightsidebar/bold_ic2.png') no-repeat center center;
          background-color:#277AE0;
          border:1px solid rgba(39,122,224,1);
        }
    }
    .setLevel{
      width: 50%;
      border:1px solid rgba(212,212,212,1);
      height: 24px;
      display: flex;
      border-radius:2px;
      background: #fff;
      margin-right: 6px;
      .left{
        width: 33.333%;
        background:url('../../../assets/images/rightsidebar/left1.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
        &.selected{
          background:url('../../../assets/images/rightsidebar/left2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
      .center{
        width: 33.333%;
        background:url('../../../assets/images/rightsidebar/center1.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
        &.selected{
          background:url('../../../assets/images/rightsidebar/center2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
      .right{
        width: 33.333%;
        background:url('../../../assets/images/rightsidebar/right1.png') no-repeat center center;
        &.selected{
          background:url('../../../assets/images/rightsidebar/right2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
    }
    .setVertical{
      width: 50%;
      border:1px solid rgba(212,212,212,1);
      height: 24px;
      display: flex;
      border-radius:2px;
      background: #fff;
      .top{
        width: 33.333%;
        background:url('../../../assets/images/rightsidebar/top1.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
        &.selected{
          background:url('../../../assets/images/rightsidebar/top2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
      .mid{
        width: 33.333%;
        background:url('../../../assets/images/rightsidebar/middle1.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
        &.selected{
          background:url('../../../assets/images/rightsidebar/middle2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
      .bottom{
        width: 33.333%;
        background:url('../../../assets/images/rightsidebar/bottom1.png') no-repeat center center;
        &.selected{
          background:url('../../../assets/images/rightsidebar/bottom2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
    }
    .setVertical{
      width: 50%;
      border:1px solid rgba(212,212,212,1);
    }
    .setBackgroundImg {
        cursor: pointer;
    }
    .color-dialog{
        position:absolute;
        left:0;
        top:24px;
        border:solid 1px red;
    }
    .arrow-empty::after{
      content:'无';
    }
    .arrow-left{
      width:100%;
      height: 18px;
      background: url('../../../assets/images/rightsidebar/arrow_letf1_ic.png') no-repeat center left;
      cursor: pointer;
      pointer-events: auto;
    }
    .arrow-right{
      width:100%;
      height: 18px;
      background: url('../../../assets/images/rightsidebar/arrow_right1_ic.png') no-repeat center left;
      cursor: pointer;
      pointer-events: auto;
    }
    .arrow-double{
      width:100%;
      height:18px;
      background: url('../../../assets/images/rightsidebar/arrow_twoway1_ic.png') no-repeat center left;
      cursor: pointer;
      pointer-events: auto;
      position: relative;
      left:-6px;
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
}
</style>

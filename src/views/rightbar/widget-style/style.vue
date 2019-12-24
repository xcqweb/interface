<template>
  <div
    class="stylePage"
  >
    <div style="height:10px;" />
    <template
      v-if="cellsCount == 1"
    >
      {{ $t('rightBar.widgetName') }}
      <input
        v-model="widgetName"
        style="padding:0 4px;"
        @keyup.enter="changeName"
        @blur="changeName"
      >
      <div class="item-line" />
    </template>
    <div
      v-if="shapeName!='menuCell' && shapeName!='tableCell' && shapeName!='beeline' && edgeInfo !== 2 && shapeName!='tableBox' && shapeName!='menulist' || (shapeName=='tableBox' || shapeName=='menulist')&&cellsCount==1"
      style="display:flex;margin-top:4px;"
    >
      <div
        class="item-container"
      >
        <span style="color:#797979;margin:0 6px;">{{ $t('X') }}</span>
        <input
          v-model="positionSize.x"
          v-number="0"
          style="border-left:none;border-right:none;"
          @keyup.enter="changePositionSize('X')"
          @blur="changePositionSize('X')"
        >
      </div>
      <div
        class="item-container"
        style="margin-left:10px;"
      >
        <span style="color:#797979;margin:0 6px;">{{ $t('Y') }}</span>
        <input
          v-model="positionSize.y"
          v-number="0"
          style="border-left:none;border-right:none;"
          @keyup.enter="changePositionSize('Y')"
          @blur="changePositionSize('Y')"
        > 
      </div>
    </div>
    <div
      v-if="shapeName!='beeline' && shapeName!='tableBox' && shapeName!='menulist' && edgeInfo !== 2 && shapeName!='tableCell' && shapeName!='menuCell' || (shapeName=='tableCell' || shapeName=='menuCell')&&cellsCount==1"
      style="display:flex;margin-top:2px;"
    >
      <div
        class="item-container"
      >
        <span style="color:#797979;margin:0 6px;">{{ $t('width') }}</span>
        <input
          v-model="positionSize.width"
          v-number="0"
          style="border-left:none;border-right:none;"
          @keyup.enter="changePositionSize('W')"
          @blur="changePositionSize('W')"
        >
      </div>
      <div
        class="item-container"
        style="margin-left:10px;"
      >
        <span style="color:#797979;margin:0 6px;">{{ $t('height') }}</span>
        <input
          v-model="positionSize.height"
          v-number="0"
          style="border-left:none;border-right:none;"
          @keyup.enter="changePositionSize('H')"
          @blur="changePositionSize('H')"
        > 
      </div>
    </div>
    <div v-if="shapeName=='beeline' && edgeInfo !== 2">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        {{ $t('rightBar.startPos') }}
        <div
          class="item-container"
          style="width:40%;"
        >
          <span style="color:#797979;margin:0 6px;">{{ $t('X') }}</span>
          <input
            v-model="positionSize.sx"
            v-number="0"
            style="border-left:none;border-right:none;"
            @keyup.enter="changePositionSize('SX')"
            @blur="changePositionSize('SX')"
          > 
        </div>
        <div
          class="item-container"
          style="width:40%;"
        >
          <span style="color:#797979;margin:0 6px;">{{ $t('Y') }}</span>
          <input
            v-model="positionSize.sy"
            v-number="0"
            style="border-left:none;border-right:none;"
            @keyup.enter="changePositionSize('SY')"
            @blur="changePositionSize('SY')"
          > 
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">
        {{ $t('rightBar.endPos') }}
        <div
          class="item-container"
          style="width:40%;"
        >
          <span style="color:#797979;margin:0 6px;">{{ $t('X') }}</span>
          <input
            v-model="positionSize.tx"
            v-number="0"
            style="border-left:none;border-right:none;"
            @keyup.enter="changePositionSize('TX')"
            @blur="changePositionSize('TX')"
          > 
        </div>
        <div
          class="item-container"
          style="width:40%;"
        >
          <span style="color:#797979;margin:0 6px;">{{ $t('Y') }}</span>
          <input
            v-model="positionSize.ty"
            v-number="0"
            style="border-left:none;border-right:none;"
            @keyup.enter="changePositionSize('TY')"
            @blur="changePositionSize('TY')"
          > 
        </div>
      </div>
    </div>
    <div
      v-if="shapeName=='tableBox' && cellsCount==1"
      style="display:flex;margin-top:2px;"
    >
      <div
        class="item-container"
      >
        <span style="color:#797979;margin:0 6px;">{{ $t('row') }}</span>
        <input
          v-model="tableRow"
          v-number="0"
          style="border-left:none;border-right:none;"
          @keyup.enter="changeTableSize"
          @blur="changeTableSize"
        >
      </div>
      <div
        class="item-container"
        style="margin-left:10px;"
      >
        <span style="color:#797979;margin:0 6px;">{{ $t('col') }}</span>
        <input
          v-model="tableCol"
          v-number="0"
          style="border-left:none;border-right:none;"
          @keyup.enter="changeTableSize"
          @blur="changeTableSize"
        > 
      </div>
    </div>
    <div v-if="shapeName=='menuCell' && cellsCount==1">
      <div class="item-title">
        {{ $t('checked') }}
      </div>
      <i-switch
        v-model="selectMenu"
        size="small"
        @on-change="checkMenu"
      />
    </div>
    <div
      v-if="(!selectMenu && shapeName!='menuCell' || selectMenu && shapeName=='menuCell') && shapeName!='light' && !shapeName.includes('pipeline') && shapeName!='progress' && shapeName!='linkTag' && !shapeName.includes('Chart') && !shapeName.includes('image') && shapeName!='beeline' && edgeInfo!==2"
      class="titleSet"
    >
      <div class="item-title">
        {{ $t('text') }}
      </div>
      <div class="titleCon">
        <div class="itemLine">
          <div
            v-clickOutSide="hideFont"
            class="item-container fontSet"
            style="justify-content:space-between;position:relative;"
          >
            <input
              v-model="fontText"
              v-number="0"
              :disabled="showFont"
              style="border-left: none;border-right: none"
              @keyup.enter="changeFont(fontText)"
              @blur="changeFont(fontText)"
            >
            <img
              src="../../../assets/images/menu/down_ic.png"
              @click="showFont=true"
            >
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
            :style="{background:fontColor}"
            @click="pickFontColor"
          />
        </div>
        <div
          v-if="shapeName!='menulist' && shapeName!='tableBox'"
          class="itemLine"
        >
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
    <div v-if="(!selectMenu && shapeName!='menuCell' || selectMenu && shapeName=='menuCell') && shapeName!='light' && !shapeName.includes('pipeline') && shapeName!='progress' && !shapeName.includes('Chart') && shapeName!='linkTag' && shapeName!='text' && shapeName!='menulist'">
      <div class="item-title">
        {{ $t('appearance') }}
      </div>
      <div v-if="!fillStyleList.includes(shapeName) && edgeInfo!==2">
        <p style="margin-top:10px;">
          {{ $t('fill') }}
        </p>
        <div
          class="item-container"
          style="position:relative;"
          :style="{background:bgColor, 'cursor': 'pointer'}"
          @click="pickBgColor"
        />
      </div>
      <div>
        <p style="margin-top:10px;">
          {{ shapeName=='beeline' && edgeInfo!==2 ? $t('line') : $t('border') }}
        </p>
        <div style="display:flex;"> 
          <div
            class="setColor"
            style="flex:1;margin-right:6px;"
            :style="{background:borderColor}"
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
          >
            <input
              v-model="borderLineBoldText"
              v-number="0"
              :disabled="showBorderLineBold"
              style="border-left: none;border-right: none"
              @keyup.enter="changeBorderLineBold(borderLineBoldText)"
              @blur="changeBorderLineBold(borderLineBoldText)"
            >
            <img 
              src="../../../assets/images/menu/down_ic.png"
              @click="showBorderLineBold=true"
            >
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
      <div v-if="shapeName=='beeline' && edgeInfo!==2">
        <p style="margin-top:10px;">
          {{ $t('arrow') }}
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
      v-if="shapeName=='pipeline1'"
      class="titleSet"
    >
      <div class="item-title">
        {{ $t('rightBar.flowDirection') }}
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
        {{ $t('rightBar.numberRange') }}
      </div>
      <div
        style="display:flex;"
      >
        <div
          class="item-container"
        >
          <span style="color:#797979;margin:0 6px;">{{ $t('upLimit') }}</span>
          <input
            v-model="progressMax"
            v-number="0"
            style="border-left:none;border-right:none;width:52%;"
            @keyup.enter="changeProgress"
            @blur="changeProgress"
          >
        </div>
        <div
          class="item-container"
          style="margin-left:10px;"
        >
          <span style="color:#797979;margin:0 6px;">{{ $t('downLimit') }}</span>
          <input
            v-model="progressMin"
            v-number="0"
            style="border-left:none;border-right:none;width:52%;"
            @keyup.enter="changeProgress"
            @blur="changeProgress"
          > 
        </div>
      </div>
      <div v-if="shapeName=='progress'">
        <div
          class="item-title"
          style="border:none;"
        >
          {{ $t('rightBar.numberShow') }}
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
              {{ progressTypeText }}
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
    <div v-if="shapeName=='linkTag'">
      <div class="item-title">
        {{ $t('rightBar.linkAddress') }}
      </div>
      <input
        v-model="linkUrl"
        style="padding:0 4px;"
        @keyup.enter="addLinkUrl"
        @blur="addLinkUrl"
      >
    </div>
    <div v-if="shapeName=='lineChart'">
      <div
        class="item-title"
        style="display:flex;justify-content:space-between;align-items:center;"
      >
        {{ $t('legend') }}
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
            src="../../../assets/images/menu/down_ic.png"
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
        {{ $t('style') }}
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
        {{ $t('marker') }}
        <div
          v-if="!isAddMark"
          style="display:flex;align-items:center;"
          @click="addMark"
        >
          <img src="../../../assets/images/rightsidebar/plus_ic.png"> {{ $t('add') }}
        </div>
      </div>
      <div
        v-if="isAddMark"
        class="addMark-con"
      >
        <div style="display:flex;justify-content:space-between;align-items:center;">
          {{ $t('name') }} <input
            v-model="markName"
            style="width:82%;padding-left:4px;"
          >
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
          {{ $t('number') }} <input
            v-model="markValue"
            v-number.minus="1"
            style="width:82%;padding-left:4px;"
          >
        </div>
        <div style="display:flex;margin-top:10px;"> 
          <div style="margin-right:5.5%;">
            {{ $t('line') }}
          </div>
          <div
            class="setColor"
            style="flex:1;margin-right:6px;"
            :style="{backgroundColor:borderColorChart}"
            @click="pickChartBorderColor"
          />
          <div
            v-clickOutSide="hideBorderLineChart"
            class="item-container fontSet"
            style="justify-content:space-between;position:relative;flex:1;"
            @click="showBorderLineChart=true"
          >
            <div :class="borderLineClsChart" />
            <img src="../../../assets/images/menu/down_ic.png">
            <ul
              v-if="showBorderLineChart"
              class="font-dialog"
              @mouseleave="showBorderLineChart=false"
              @keyup.enter="showBorderLineChart=false"
              @blur="showBorderLine=false"
            >
              <li
                v-for="(d,index) in borderLineListChart"
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
            v-clickOutSide="hideBorderLineBoldChart"
            class="item-container fontSet"
            style="justify-content:space-between;position:relative;flex:1;margin:0;"
          >
            <div>{{ borderLineBoldTextChart }}</div>
            <img 
              src="../../../assets/images/menu/down_ic.png"
              @click="showBorderLineBoldChart=true"
            >
            <ul
              v-if="showBorderLineBoldChart"
              class="font-dialog"
              style="height:100px;overflow:auto;"
              @mouseleave="showBorderLineBoldChart=false"
              @keyup.enter="showBorderLineBoldChart=false"
              @blur="showBorderLineBoldChart=false"
            >
              <li
                v-for="(d,index) in borderLineBoldListChart"
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
            {{ $t('cancel') }}
          </button>
          <button
            class="mutual-btn selected"
            @click="submit()"
          >
            {{ $t('submit') }}
          </button>
        </div>
      </div>
      <div
        v-if="!isAddMark"
        style="max-height:500px;overflow-y:scroll;margin-top:10px;"
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
            <div>{{ $t('name') }}-{{ item.markName }}</div>
            {{ $t('number') }}-{{ item.markValue }}
            <img
              src="../../../assets/images/rightsidebar/dele_ic.png"
              @click="delMark(item,index,$event)"
            >
          </div>
          <div style="display:flex;margin-top:10px;"> 
            <div style="margin-right:5.5%;">
              {{ $t('line') }}
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
    <div
      v-if="shapeName == 'rectangle'"
      class="arcSize-rectangle"
    >
      <p>{{ $t('rightBar.corner') }}</p>
      <Slider
        :value="$store.state.main.widgetInfo.shapeInfo.arcSize / 100"
        :max="0.5"
        :min="0"
        style="margin-left:6px;"
        :step="0.005"
        :show-tip="'never'"
        @on-input="arcSizeChange"
      />
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import {Slider} from 'iview'
import {mxConstants,mxEventObject,Dialog,mxUtils} from '../../../services/mxGlobal'
import {data1,data2} from '../../../constants/chart-default-data'
import {sureDialog} from '../../../services/Utils'
let palettName
let alignArr = [mxConstants.ALIGN_LEFT,mxConstants.ALIGN_CENTER,mxConstants.ALIGN_RIGHT]
let valignArr = [mxConstants.ALIGN_TOP,mxConstants.ALIGN_MIDDLE,mxConstants.ALIGN_BOTTOM]
let cellEchart,bindChartProps
export default {
    components:{
        Slider
    },
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
            selectMenu:false,
            bgColor:'#fff',
            borderColor:'#000',
            borderLineList:['border-line','border-dash'],
            borderLineCls:'border-line',
            showArrowDialog:false,
            fontList:[12,13,14,16,18,20,28,36,48],
            borderLineBoldText:1,
            borderLineBoldList:[1,2,3,4,5,6,7,8],
            arrowClsList:['arrow-empty','arrow-left','arrow-right','arrow-double'],
            arrowCls:'arrow-empty',
            fillStyleList:['beeline','image','userimage'],
            tableRow:3,
            tableCol:3,
            pipelineFlow:false,//指示灯下拉框
            pipelineFlowText:this.$t('noFlow'),
            pipelineFlowList:[{name:this.$t('noFlow'),value:'none'},{name:this.$t('forwardFlow'),value:'forward'},{name:this.$t('backwardFlow'),value:'back'}],
            pipelineFlowVal:'none',
            progressMax:100,
            progressMin:0,
            progressDialog:false,
            progressTypeText:this.$t('percent'),
            progressTypeVal:'percent',
            progressDialogList:[{name:this.$t('percent'),value:'percent'},{name:this.$t('real'),value:'real'}],
            linkUrl:"",
            chartLegend:true,
            markLineList:[],//标线 line-chart
            isAddMark:false,
            markName:'',
            markValue:0,
            borderColorChart:"#000",
            borderLineClsChart:"border-line",
            borderLineBoldTextChart:"1",
            showBorderLineChart:false,
            showBorderLineBoldChart:false,
            borderLineListChart:['border-line','border-dash'],
            borderLineBoldListChart:[1,2,3,4,5],
            editMarkLine:null,
            editMarkLineIndex:0,
            styleColorBg:'#000',
            showLegendChoose:false,
            legendChooseText:this.$t('bottom'),
            legendChooseList:[{text:this.$t('bottom'),type:1},{text:this.$t('top'),type:2},{text:this.$t('left'),type:3},{text:this.$t('right'),type:4}],
        }
    },
    computed: {
        shapeName() {
            return this.$store.state.main.widgetInfo.shapeInfo.shape
        },
        cellsCount() {
            return this.$store.state.main.widgetInfo.cellsCount
        },
        edgeInfo() {
            return this.$store.state.main.widgetInfo.edgeInfo
        },
        widgetName: {
            get() {
                return this.$store.state.main.widgetInfo.widgetName
            },
            set(val) {
                palettName = val
            }
        },
        positionSize() {
            let geo = this.$store.state.main.widgetInfo.geo
            let {width,height,x,y,sx,sy,tx,ty} = geo
            let newGeo = {
                width:this.dealNumber(width),height:this.dealNumber(height),x:this.dealNumber(x),
                y:this.dealNumber(y),sx:this.dealNumber(sx),sy:this.dealNumber(sy),
                tx:this.dealNumber(tx),ty:this.dealNumber(ty)
            }
            return Object.assign(geo,newGeo)
        }
    },
    created() {},
    mounted() {
        let graph = this.myEditorUi.editor.graph
        this.fontText = this.$store.state.main.widgetInfo.fontSize
        this.isSetBold = this.$store.state.main.widgetInfo.isSetBold
        this.fontColor = this.dealDefaultColor(this.$store.state.main.widgetInfo.color)
        this.alignIndex1 = alignArr.indexOf(this.$store.state.main.widgetInfo.align) + 1
        this.alignIndex2 = valignArr.indexOf(this.$store.state.main.widgetInfo.valign) + 1
        this.bgColor =  this.dealDefaultColor(this.$store.state.main.widgetInfo.bgColor)
        this.borderColor =  this.dealDefaultColor(this.$store.state.main.widgetInfo.borderColor)
        this.borderLineBoldText =  this.$store.state.main.widgetInfo.borderBold
        this.borderLineCls = this.$store.state.main.widgetInfo.borderLineCls
        if(this.shapeName == 'rectangle') {
            graph.setCellStyles(mxConstants.STYLE_ROUNDED, 1, graph.getSelectionCells())
            this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_ROUNDED],'values', [1], 'cells', graph.getSelectionCells()))
        }else if(this.shapeName == 'beeline') {
            this.arrowCls = this.$store.state.main.widgetInfo.arrowCls
        }else if(this.shapeName == 'tableBox') {
            let res = this.getRowColNum()
            this.tableRow = res[0]
            this.tableCol = res[1]
        }else if(this.shapeName === 'progress') {
            let progressProps = this.getWidgetProps('progressProps')
            if(progressProps) {
                this.progressMax = progressProps.max
                this.progressMin = progressProps.min
                if(progressProps.type) {
                    let findCurrent = this.progressDialogList.find((item)=>{
                        return item.value == progressProps.type
                    })
                    this.progressTypeText = findCurrent.name
                    this.progressTypeVal = findCurrent.value
                }
            }else{
                this.setWidgetProps('progressProps',{max:this.progressMax,min:this.progressMin,type:this.progressTypeVal})
            }
        }else if(this.shapeName.includes('pipeline')) {
            let pipelineProps = this.getWidgetProps('pipelineProps')
            if(pipelineProps) {
                let findCurrent = this.pipelineFlowList.find((item)=>{
                    return item.value == pipelineProps.flow
                })
                this.pipelineFlowText = findCurrent.name
                this.pipelineFlowVal = findCurrent.value
            }
        }else if(this.shapeName.includes('Chart')) {
            bindChartProps = this.getWidgetProps('chartProps')
            if(bindChartProps) {
                if(this.shapeName == 'gaugeChart') {
                    this.progressMin = bindChartProps.series.min
                    this.progressMax = bindChartProps.series.max
                } else{
                    this.chartLegend = bindChartProps.legend.show
                    this.styleColorBg = bindChartProps.yAxis.splitLine.lineStyle.color
                    let lineData = bindChartProps.series[0].markLine.data
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
                    this.initLegendChoose()
                }
            }
            this.initChartDom()
        }else if(this.shapeName == 'linkTag') {
            if (this.getWidgetProps('link')) {
                this.linkUrl = this.getWidgetProps('link').url
            }
        }else if(this.shapeName == 'menuCell') {
            let cellProp = this.getWidgetProps('menuCellProps')
            if(cellProp) {
                this.selectMenu = cellProp.check
            }
        }else if(this.shapeName == 'light') {
            this.initLightStates()
        }
        let dblClickFn = graph.dblClick
        graph.dblClick = (evt, cell) => {
            let state = graph.view.getState(cell)
            if (!state) {
                return false
            }
            if (state.style.shape === 'image') {
                document.querySelector('#dlbChooseImage').click()
                let $inputfile = `<input type="file" style="opacity: 0" id="dlbChooseImage" title="" accept=".jpg,.jpge,.gif,.png,.svg">`
                document.getElementById('dlbChooseImage').addEventListener('change', (evt) => {
                    this.dblclickHandle(evt)
                    $('#dlbChooseImage').replaceWith($inputfile)
                })
            } else {
                dblClickFn.call(graph,evt, cell)
            }
        }
    },
    methods: {
        initChartDom() {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            graph.getModel().beginUpdate()
            cell.setAttribute('label',`<div class="widget-chart chart${cell.id}"/>`)
            graph.view.refresh(cell)
            let echartsDom = document.querySelector(`.widget-chart.chart${cell.id}`)
            echartsDom.style.width = `${cell.geometry.width}px`
            echartsDom.style.height = `${cell.geometry.height}px`
            let options = {}
            cellEchart = echarts.init(echartsDom)
            if(this.shapeName == 'lineChart') {
                options = data1
            }else{
                options = data2
            }
            if(bindChartProps) {
                options = bindChartProps
            }else{
                bindChartProps = options
                this.setWidgetProps("chartProps",bindChartProps)
            }
            cellEchart.setOption(options)
            graph.getModel().endUpdate()
        },
        initLightStates() {
            let bindStates = this.getWidgetProps("statesInfo")
            if(bindStates) {
                return
            }
            let states = []
            for(let i = 0;i < 4;i++) {
                let obj = {
                    "id":`state_${i}`,
                    "name":i === 0 ? this.$t("defaultText") : `${this.$t("state")}${i}`,
                    "desc":i === 0 ? this.$t("defaultText") : `${this.$t("state")}${i}`,
                    'animateCls':i === 0 ? '' : 'animate-blink',
                    'style':{},
                    'imgInfo':{
                        url:i === 0 ? `../../../../static/stencils/basic/light.png` : `../../../../static/stencils/basic/light${i}.png`,
                    },
                    'check':false
                }
                states.push(obj)
            }
            this.setModeInfoStates(states)
        },
        dealNumber(number) {
            if(number) {
                return parseInt(number)
            }
            return number
        },
        dealDefaultColor(color) {
            if(!color || color == 'none') {
                return `url(${Dialog.prototype.noColorImage})`
            }
            return color
        },
        removeImageRadio() {
            if (document.querySelector('.mxPopupMenu')) {
                document.querySelector('.mxPopupMenu').remove()
            }
        },
        changeName() {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let cellInfo = graph.getModel().getValue(cell)
            cellInfo.setAttribute('palettename',palettName)
            graph.getModel().setValue(cell, cellInfo)
            this.$store.commit('getWidgetInfo',graph)
        },
        changePositionSize(type) {
            let graph = this.myEditorUi.editor.graph
            let cells = graph.getSelectionCells()
            let positionObj = Object.assign({},this.positionSize)
            cells.forEach((cell)=>{
                graph.getModel().beginUpdate()
                let geo = graph.getCellGeometry(cell)
                let diff = 0
                if(graph.model.isEdge(cell)) {
                    switch(type) {
                        case 'SX':
                            geo.sourcePoint.x = +positionObj.sx
                            break
                        case 'SY':
                            geo.sourcePoint.y = +positionObj.sy
                            break
                        case 'TX':
                            geo.targetPoint.x = +positionObj.tx
                            break
                        case 'TY':
                            geo.targetPoint.y = +positionObj.ty
                            break
                    }
                }else {
                    switch(type) {
                        case 'X':
                            geo.x = +positionObj.x
                            break
                        case 'Y':
                            geo.y = +positionObj.y
                            break
                        case 'W':
                            diff = positionObj.width * 1 - geo.width
                            geo.width = +positionObj.width
                            break
                        case 'H':
                            diff = positionObj.height * 1 - geo.height
                            geo.height = +positionObj.height
                            break
                    }
                }
                graph.getModel().setGeometry(cell,geo)
                if (diff !== 0) {
                    this.updateTableSizeAfterCell(type, diff, cell)
                }
                graph.getModel().endUpdate()
                graph.refresh(cell)
            })
            this.$nextTick(() => {
                this.$store.commit('getWidgetInfo',graph)
            })
        },
        // 修改表格单元格宽高后回调
        updateTableSizeAfterCell(type, diff, cell) {
            let actions = this.myEditorUi.actions
            actions.updateRowColSize(type, diff, cell)
        },
        changeFont(d,e) {
            this.fontText = d
            let graph = this.myEditorUi.editor.graph
            let ss = this.shapeName === 'tableBox' || this.shapeName === 'menulist' ? graph.getSelectionCells().concat(graph.getSelectionCell().children) : graph.getSelectionCells()
            let key = mxConstants.STYLE_FONTSIZE
            graph.setCellStyles(key,d, ss)
            this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [key],'values', [+d], 'cells', ss))
            this.showFont = false
            e && e.stopPropagation()
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
            this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', ['fontStyle'],'values', [bold], 'cells',ss))
        },
        hideFont() {
            this.showFont = false
        },
        pickFontColor() {
            this.myEditorUi.pickColor(this.fontColor || 'none',color=>{
                if(color == 'none') {
                    this.fontColor = `url(${Dialog.prototype.noColorImage})`
                }else{
                    this.fontColor = color
                }
                let graph = this.myEditorUi.editor.graph
                let ss = this.shapeName === 'tableBox' || this.shapeName === 'menulist' ? graph.getSelectionCells().concat(graph.getSelectionCell().children) : graph.getSelectionCells()
                graph.setCellStyles('fontColor', color, ss);
                this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', ['fontColor'],'values', [color], 'cells', ss))
            });
        },
        pickBgColor() {
            this.myEditorUi.pickColor(this.bgColor || 'none',color=>{
                if(color == 'none') {
                    this.bgColor = `url(${Dialog.prototype.noColorImage})`
                }else{
                    this.bgColor = color
                }
                let graph = this.myEditorUi.editor.graph
                graph.setCellStyles('fillColor', color, graph.getSelectionCells());
                this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', ['fillColor'],'values', [color], 'cells', graph.getSelectionCells()))
            });
        },
        pickBorderColor() {
            this.myEditorUi.pickColor(this.borderColor || 'none',color=>{
                if(color == 'none') {
                    this.borderColor = `url(${Dialog.prototype.noColorImage})`
                }else{
                    this.borderColor = color
                }
                let graph = this.myEditorUi.editor.graph
                let key = 'strokeColor'
                if(this.shapeName.includes('image')) {
                    key = 'imageBorder'
                }
                graph.setCellStyles(key, color, graph.getSelectionCells());
                this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [key],'values', [color], 'cells', graph.getSelectionCells()))
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
                graph.setCellStyles(keys[i], values[i])
            }
            this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', keys,'values', values, 'cells', graph.getSelectionCells()))
            this.showBorderLine = false
            e.stopPropagation()
        },
        changeBorderLineBold(d,e) {
            this.borderLineBoldText = d
            let graph = this.myEditorUi.editor.graph
            graph.setCellStyles('strokeWidth', d, graph.getSelectionCells())
            this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', ['strokeWidth'],'values', [d], 'cells', graph.getSelectionCells()))
            this.showBorderLineBold = false
            e && e.stopPropagation()
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
        getRowColNum() {
            const ui = this.myEditorUi;
            const actions = ui.actions;
            const graph = ui.editor.graph;
            const table = graph.getSelectionCell();
            const {row, col} = actions.getTableRowColNum(table);
            return [row, col];
        },
        changeTableSize() {
            let actions = this.myEditorUi.actions
            let graph = this.myEditorUi.editor.graph
            let res = this.getRowColNum()
           
            let disRow = this.tableRow - res[0]
            let disCol = this.tableCol - res[1]
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
            this.pipelineFlowVal = d.value
            this.pipelineFlow = false
            this.setWidgetProps('pipelineProps',{flow:this.pipelineFlowVal})
            e.stopPropagation()
        },
        changeProgress() {
            if(this.shapeName == 'progress') {
                this.setWidgetProps('progressProps',{max:this.progressMax,min:this.progressMin,type:this.progressTypeVal})
            }else{
                bindChartProps.series.min = this.progressMin
                bindChartProps.series.max = this.progressMax
                cellEchart.setOption(bindChartProps)
                this.setWidgetProps("chartProps",bindChartProps)
            }
        },
        hideProgressDialogFun() {
            this.progressDialog = false
        },
        changeProgressTypeDialog(d,e) {//数值范围
            this.progressTypeText = d.name
            this.progressTypeVal = d.value
            this.progressDialog = false
            this.setWidgetProps('progressProps',{max:this.progressMax,min:this.progressMin,type:this.progressTypeVal})
            e.stopPropagation()
        },
        addLinkUrl() {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let modelInfo = graph.getModel().getValue(cell)
            modelInfo.setAttribute('link',JSON.stringify({url:this.linkUrl}))
            graph.getModel().setValue(cell, modelInfo)
        },
        getCellInfo() {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let cellInfo = graph.getModel().getValue(cell)
            return cellInfo
        },
        setWidgetProps(widgetProp,props) {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let cellInfo = graph.getModel().getValue(cell)
            if (!mxUtils.isNode(cellInfo)) {
                var doc = mxUtils.createXmlDocument()
                var obj = doc.createElement('object')
                obj.setAttribute('label', cellInfo || '')
                cellInfo = obj
            }
            let attrObj = this.getWidgetProps(widgetProp)
            let newAttr = JSON.stringify(Object.assign({},attrObj,props))
            cellInfo.setAttribute(widgetProp,newAttr)
            graph.getModel().setValue(cell, cellInfo)
        },
        setModeInfoStates(states) {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let modelInfo = graph.getModel().getValue(cell)
            if (!mxUtils.isNode(modelInfo)) {
                var doc = mxUtils.createXmlDocument()
                var obj = doc.createElement('object')
                obj.setAttribute('label', modelInfo || '')
                modelInfo = obj
            }
            modelInfo.setAttribute('statesInfo', JSON.stringify(states))
            graph.getModel().setValue(cell, modelInfo)
        },
        getWidgetProps(widgetProp) {
            let cellInfo = this.getCellInfo()
            if (!mxUtils.isNode(cellInfo)) {
                var doc = mxUtils.createXmlDocument()
                var obj = doc.createElement('object')
                obj.setAttribute('label', cellInfo || '')
                cellInfo = obj
            }
            let attr = cellInfo.getAttribute(widgetProp)
            let attrObj = null
            if(attr) {
                attrObj = JSON.parse(attr)
            }
            return attrObj
        },
        dblclickHandle(e) {
            let graph = this.myEditorUi.editor.graph
            let localImage
            return new Promise(function(resolve, reject) {
                var fr = new FileReader()
                fr.onload = (function(file) {
                    resolve(file)
                    this.removeImageRadio()
                })(e.target.files[0])
                fr.onerror = function() {
                    reject(this.$t('uploadFailed'))
                };
                fr.readAsDataURL(e.target.files[0])
            }).then((res) => {
                localImage = res
                // 更换图片
                let select = null;
                let cells = graph.getSelectionCells();
                let updateImg = function(newValue) {
                    let prefix = 'getechFileSystem/'
                    let newValueCell = prefix + newValue.picPath
                    graph.getModel().beginUpdate()
                    try {
                        graph.setCellStyles(mxConstants.STYLE_IMAGE, (newValueCell.length > 0) ? newValueCell : null, cells);
                    }
                    finally {
                        graph.getModel().endUpdate()
                    }
                    if (select != null) {
                        graph.setSelectionCells(select)
                        graph.scrollCellToVisible(select[0])
                    }
                }
                if (localImage) {
                    var formData = new FormData();
                    formData.append('file', localImage);
                    formData.append('materialLibraryId', '');
                    this.myEditorUi.editor.uploadFile(this.myEditorUi, 'api/iot-cds/sources/material', 'POST', formData, function(res) {
                        updateImg(res)
                    })
                } 
            }).catch((meg) => {
                console.log(meg)
            })
        },
        checkMenu(val) {
            this.setWidgetProps('menuCellProps',{'check':val})
        },
        setMarkLineFun() {
            bindChartProps.series[0].markLine.data.splice(0)
            this.markLineList.forEach((item)=>{
                bindChartProps.series[0].markLine.data.push({
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
            let yAxisMax = Math.max(...markValArr,...bindChartProps.series[0].data)
            bindChartProps.yAxis.max = yAxisMax
            cellEchart.setOption(bindChartProps)
            this.setWidgetProps("chartProps",bindChartProps)
        },
        addMark() {//折线chart 添加标线
            this.isAddMark = true
            this.editMarkLine = null
            this.markName = `${this.$t('marker')}${this.markLineList.length + 1}`
        },
        pickChartBorderColor() {//chart mark-line
            this.myEditorUi.pickColor(this.borderColor,color=>{
                this.borderColorChart = color
            })
        },
        changeChartBorderLine(d,e) {
            this.borderLineClsChart = d
            this.showBorderLineChart = false
            e.stopPropagation()
        },
        changeChartBorderLineBold(d,e) {
            this.borderLineBoldTextChart = d
            this.showBorderLineBoldchart = false
            e.stopPropagation()
        },
        cancel() {
            this.isAddMark = false
        },
        hideBorderLineChart() {
            this.showBorderLineChart = false
        },
        submit() {
            if(this.editMarkLine) {
                this.markLineList.splice(this.editMarkLineIndex,1)
            }
            this.markLineList.push(
                {
                    markName:this.markName,
                    markValue:this.markValue,
                    borderColor:this.borderColorChart,
                    borderLineCls:this.borderLineClsChart,
                    borderLineBoldText:this.borderLineBoldTextChart,
                }
            )
            this.setMarkLineFun()
            this.isAddMark = false
        },
        hideBorderLineBoldChart() {
            this.showBorderLineBold = false
        },
        delMark(d,index,evet) {
            evet.stopPropagation()
            sureDialog(this.myEditorUi,`${this.$t('sureDel')} ${d.markName}`,()=>{
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
            this.borderColorChart = item.borderColor
            this.borderLineClsChart = item.borderLineCls
            this.borderLineBoldTextChart = item.borderLineBoldText
        },
        chooseLegend() {
            bindChartProps.legend.show = this.chartLegend
            cellEchart.setOption(bindChartProps)
            this.setWidgetProps("chartProps",bindChartProps)
            this.initLegendChoose()
        },
        pickStyleColor() {
            this.myEditorUi.pickColor(this.styleColorBg,color=>{
                this.styleColorBg = color
                let obj = {color:color}
                bindChartProps.yAxis.splitLine.lineStyle = obj
                bindChartProps.yAxis.axisLine.lineStyle = obj
                bindChartProps.yAxis.axisTick.lineStyle = obj
                bindChartProps.xAxis.axisLabel.lineStyle = obj
                bindChartProps.xAxis.axisLine.lineStyle = obj
                bindChartProps.xAxis.axisTick.lineStyle = obj
                bindChartProps.xAxis.axisLabel.lineStyle = obj
                bindChartProps.legend.textStyle = obj
                cellEchart.setOption(bindChartProps)
                this.setWidgetProps("chartProps",bindChartProps)
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
            tempLegend.mType = d.type
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
                    break
                case 3:
                    tempLegend.x = 'left'
                    tempLegend.y = 'middle'
                    tempLegend.orient = 'vertical'
                    bindChartProps.grid.left = 60
                    bindChartProps.grid.right = 30
                    break
                case 4:
                    tempLegend.x = 'right'
                    tempLegend.y = 'middle'
                    tempLegend.orient = 'vertical'
                    bindChartProps.grid.right = 60
                    bindChartProps.grid.left = 30
                    break
            }
            bindChartProps.legend = Object.assign(bindChartProps.legend,tempLegend)
            this.showLegendChoose = false
            cellEchart.setOption(bindChartProps)
            this.setWidgetProps("chartProps",bindChartProps)
            e.stopPropagation()
        },
        initLegendChoose() {
            let mType = bindChartProps.legend.mType || 1
            this.legendChooseText = this.legendChooseList[mType - 1].text
        },
        hideLegendChooseFun() {
            this.showLegendChoose = false
        },
        arcSizeChange(val) {
            let graph = this.myEditorUi.editor.graph
            let model = graph.getModel()
            let cell = graph.getSelectionCell()
            let style = mxUtils.setStyle(model.getStyle(cell), 'arcSize', Math.round(val * 100))
            model.setStyle(cell, style)
        }
    }
};
</script>

<style lang="less" scoped>
.stylePage {
    padding:0 4px 40px;
    overflow: auto;
    height:100%;
    margin-bottom:40px;
    input{
        outline: none;
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
      cursor: pointer;
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
      cursor: pointer;
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
        cursor: pointer;
        background:url('../../../assets/images/rightsidebar/left1.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
        &.selected{
          background:url('../../../assets/images/rightsidebar/left2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
      .center{
        width: 33.333%;
        cursor: pointer;
        background:url('../../../assets/images/rightsidebar/center1.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
        &.selected{
          background:url('../../../assets/images/rightsidebar/center2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
      .right{
        width: 33.333%;
        cursor: pointer;
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
        cursor: pointer;
        background:url('../../../assets/images/rightsidebar/top1.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
        &.selected{
          background:url('../../../assets/images/rightsidebar/top2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
      .mid{
        width: 33.333%;
        cursor: pointer;
        background:url('../../../assets/images/rightsidebar/middle1.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
        &.selected{
          background:url('../../../assets/images/rightsidebar/middle2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
      .bottom{
        width: 33.333%;
        cursor: pointer;
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
    .arcSize-rectangle{
      margin-top:10px;
      /deep/.ivu-slider-wrap{
        background:#D4D4D4;
        margin:6px 0;
      }
    }
}
</style>

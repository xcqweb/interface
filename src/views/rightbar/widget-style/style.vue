<template>
  <div
    class="dialogPage"
    style="padding:0 4px;"
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
    <div style="display:flex;margin-top:4px;">
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
    <div>
      <div class="item-title">
        选中
      </div>
      <i-switch
        v-model="select"
        size="small"
        @on-change="changeSelect"
      />
    </div>
    <div class="titleSet">
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
    <div>
      <div class="item-title">
        外观
      </div>
      <div>
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
          边框
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
                <div :class="d" />
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
              style="height:200px;overflow:auto;"
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
      <div>
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
              @click="changeBorderLine(d,$event)"
            >
              <div :class="d" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mxEvent,mxConstants,mxEventObject} from '../../../services/mxGlobal'
let newFontColor,newBgColor,newBorderColor,name
let alignArr = [mxConstants.ALIGN_LEFT,mxConstants.ALIGN_CENTER,mxConstants.ALIGN_RIGHT]
let valignArr = [mxConstants.ALIGN_TOP,mxConstants.ALIGN_MIDDLE,mxConstants.ALIGN_BOTTOM]

export default {
    data() {
        return {
            showFont:false,
            shapeName:'',
            fontColor:'#333333',
            fontText:12,
            alignIndex1:2,
            showBorderLine:false,
            alignIndex2:2,
            isSetBold:false,
            showBorderLineBold:false,
            select:true,
            bgColor:'#277AE0',
            borderColor:'#277AE0',
            borderLineList:[],
            borderLineCls:'',
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
            arrowClsList:['arrow-empty'],
            arrowCls:'arrow-empty',
        }
    },
    computed: {
        widgetName: {
            get() {
                return this.$store.state.main.widgetInfo.widgetName
                
            },
            set(val) {
                name = val
            }
        },
        positionSize() {
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
        this.shapeName = this.$store.state.main.widgetInfo.shapeInfo.shape
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
        changeSelect(status) {
            console.log(status)
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
            var shapeName = graph.view.getState(graph.getSelectionCell()).style.shape;
            let ss = shapeName === 'tableBox' || shapeName === 'menulist' ? graph.getSelectionCells().concat(graph.getSelectionCell().children) : graph.getSelectionCells();
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
            let cells = graph.getSelectionCells()
            let bold = 0
            if(this.isSetBold) {
                bold = 1
            }
            graph.setCellStyles('fontStyle', bold, graph.getSelectionCells());
            this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', ['fontStyle'],'values', [bold], 'cells',cells));
        },
        hideFont() {
            this.showFont = false
        },
        pickFontColor() {
            this.myEditorUi.pickColor(newFontColor || 'none',color=>{
                newFontColor = color  
                this.fontColor = color
                let graph = this.myEditorUi.editor.graph
                graph.setCellStyles('fontColor', color, graph.getSelectionCells());
                this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', ['fontColor'],'values', [color], 'cells', graph.getSelectionCells()));
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
                graph.setCellStyles('strokeColor', color, graph.getSelectionCells());
                this.myEditorUi.fireEvent(new mxEventObject('styleChanged', 'keys', ['strokeColor'],'values', [color], 'cells', graph.getSelectionCells()));
            });
        },
        hideBorderLine() {
            this.showBorderLine = false
        },
        changeBorderLine(d,e) {
            this.borderLineCls = d
            this.showBorderLine = false;
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
      content:'无'
    }
}
</style>

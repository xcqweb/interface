<template>
  <div
    class="dialogPage"
    style="padding:0 4px;"
  >
    <p style="text-align:center;margin:10px;font-size:14px;">
      弹窗样式
    </p>
    <p style="margin-top:1px;">
      弹框描述
    </p>
    <textarea
      v-model="dialogDesc"
      rows="3"
      maxlength="50"
      @blur="descChange"
    />
    <div class="item-title">
      弹框尺寸
    </div>
    <div style="display:flex;margin-top:4px;">
      <div
        class="item-container"
      >
        <span style="color:#797979;margin:0 6px;">宽</span>
        <input
          v-model="dialogWidth"
          v-number="0"
          @keyup.enter="changeScaleInput"
          @blur="changeScaleInput"
        >
      </div>
      <div
        class="item-container"
        style="margin-left:10px;"
      >
        <span style="color:#797979;margin:0 6px;">高</span>
        <input
          v-model="dialogHeight"
          v-number="0"
          @keyup.enter="changeScaleInput"
          @blur="changeScaleInput"
        > 
      </div>
    </div>
    <div class="titleSet">
      <div class="item-title">
        标题文本
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
            <img src="../../assets/images/menu/down_ic.png">
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
            style="width:50%" 
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
    <div
      class="item-title"
    >
      标题填充
    </div>
    <div
      class="item-container"
      style="position:relative;"
      :style="{backgroundColor:bgColor}"
      @click="pickColor"
    />
    <div
      class="dialog-title-m"
    />
  </div>
</template>
<script>
import {mxClient} from '../../services/mxGlobal'

let alignArr = ['left','center','right']
let valignArr = [],dialogStyle
export default {
    data() {
        return {
            dialogDesc:"",
            showFont:false,
            dialogHeight: 400,
            dialogWidth: 600,
            fontText:12,
            bgColor:'#fff',
            fontColor:'#333333',
            alignIndex1:2,
            alignIndex2:2,
            canvasOffsetTop:0,
            canvasOffsetLeft:0,
            fontList:[ 12,  13, 14, 15,  16, 17, 18, 19, 20],
        }
    },
    created() {
    },
    mounted() {
        window.onresize = ()=>{
            this.centerCanvas()
        }
        this.initPage()
    },
    beforeDestory() {
        // console.log("beforeDestory--不执性--why--")
    },
    destroyed() {
        let dialogTitleEle = document.querySelector('.dialog-title-m')
        dialogTitleEle.parentNode.removeChild(dialogTitleEle)
    },
    methods: {
        initPage() {
            mxClient.IS_ADD_IMG = false
            let graph = this.myEditorUi.editor.graph
            let editor = this.myEditorUi.editor
            dialogStyle = editor.pages[editor.currentPage].style
            this.dialogWidth = graph.pageFormat.width || 600
            this.dialogHeight = graph.pageFormat.height || 400
            this.fontText = parseInt(dialogStyle.fontSize || 12)
            this.fontColor = dialogStyle.color
            this.bgColor = dialogStyle.bgColor
            this.alignIndex1 = alignArr.indexOf(dialogStyle.textAlign) + 1 || 2
            this.alignIndex2 = valignArr.indexOf(parseInt(dialogStyle.lineHeight)) + 1 || 2
            setTimeout(() => {
                this.changeScaleInput()

                let graph = this.myEditorUi.editor.graph
                let con = graph.container
                let dialogTitleEle = document.querySelector('.dialog-title-m')
                dialogTitleEle.innerHTML = editor.pages[editor.currentPage].title
                dialogTitleEle.parentNode.removeChild(dialogTitleEle)
                con.appendChild(dialogTitleEle)
                this.dialogDesc = editor.pages[editor.currentPage].desc
            },50)
        },
        descChange() {
            let editor = this.myEditorUi.editor
            editor.pages[editor.currentPage].desc = this.dialogDesc
        },
        changeFont(d,e) {
            this.fontText = d
            this.showFont = false;
            let dialogStyleTemp = {
                fontSize:`${this.fontText}px`,
            }
            this.commitStyleFun(dialogStyleTemp)
            e.stopPropagation()
        },
        commitStyleFun(param) {
            dialogStyle = Object.assign({},dialogStyle,param)
            let editor = this.myEditorUi.editor
            let el = document.querySelector(".dialog-title-m")
            let keys = Object.keys(dialogStyle)
            el.style.cssText = " "//清空之前的标题style
            for(let i = 0;i < keys.length;i++) {//更改title dom节点位置后，vue的:style失效，采用原生的方式
                el.style[keys[i]] = dialogStyle[keys[i]]
            }
            editor.pages[editor.currentPage].style = dialogStyle
        },
        centerCanvas() {//居中画布
            let graph = this.myEditorUi.editor.graph
            let con = graph.container
            let conWidth = con.clientWidth
            let conHeight = con.clientHeight
            let {clientWidth,clientHeight} = con.children[1] //svg
            let canvasView = con.children[0]//画布
            this.canvasOffsetTop = canvasView.offsetTop
            this.canvasOffsetLeft = canvasView.offsetLeft
            con.scrollLeft = (clientWidth - conWidth) / 2
            con.scrollTop = (clientHeight - conHeight - 36) / 2
            let dialogStyleTemp = {
                top:`${this.canvasOffsetTop - 36}px`,
                left:`${this.canvasOffsetLeft}px`,
                width:`${this.dialogWidth}px`,
            }
            this.commitStyleFun(dialogStyleTemp)
        },
        changeAlignIndex(type,index) {
            valignArr = [this.fontText + 5,36,36 * 2 - this.fontText - 10]
            if(type == 1) {
                this.alignIndex1 = index
            }else{
                this.alignIndex2 = index
            }
            let dialogStyleTemp = {
                textAlign:`${alignArr[this.alignIndex1 - 1]}`,
                lineHeight:`${valignArr[this.alignIndex2 - 1]}px`,
            }
            this.commitStyleFun(dialogStyleTemp)
        },
        changeScaleInput() {
            this.myEditorUi.setPageFormat({
                height: this.dialogHeight,
                width: this.dialogWidth,
                x: 0,
                y: 0
            }, true)
            this.centerCanvas()
        },
        hideFont() {
            this.showFont = false
        },
        pickColor() {
            this.myEditorUi.pickColor(this.bgColor || 'none',color=>{
                this.bgColor = color
                let dialogStyleTemp = {
                    background:`${this.bgColor}`,
                }
                this.commitStyleFun(dialogStyleTemp)
            });
        },
        pickFontColor() {
            this.myEditorUi.pickColor(this.fontColor || 'none',color=>{
                this.fontColor = color
                let dialogStyleTemp = {
                    color:`${this.fontColor}`,
                }
                this.commitStyleFun(dialogStyleTemp)
            });
        }
    }
};
</script>

<style lang="less" scoped>
.dialogPage {
    textarea{
        resize:none;
        border:1px solid rgba(212,212,212,1);
        border-radius:2px;
        width:100%;
    }
    input{
        outline: none;
        border:none;
        width:100%;
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
      width:50%;
      height:100%;
      background: #000;
      border-radius: 2px;
      border:1px solid rgba(212,212,212,1);
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
        background:url('../../assets/images/rightsidebar/left1.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
        &.selected{
          background:url('../../assets/images/rightsidebar/left2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
      .center{
        width: 33.333%;
        background:url('../../assets/images/rightsidebar/center1.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
        &.selected{
          background:url('../../assets/images/rightsidebar/center2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
      .right{
        width: 33.333%;
        background:url('../../assets/images/rightsidebar/right1.png') no-repeat center center;
        &.selected{
          background:url('../../assets/images/rightsidebar/right2.png') no-repeat center center;
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
        background:url('../../assets/images/rightsidebar/top1.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
        &.selected{
          background:url('../../assets/images/rightsidebar/top2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
      .mid{
        width: 33.333%;
        background:url('../../assets/images/rightsidebar/middle1.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
        &.selected{
          background:url('../../assets/images/rightsidebar/middle2.png') no-repeat center center;
          background-color:#277AE0
        }
      }
      .bottom{
        width: 33.333%;
        background:url('../../assets/images/rightsidebar/bottom1.png') no-repeat center center;
        &.selected{
          background:url('../../assets/images/rightsidebar/bottom2.png') no-repeat center center;
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
}
</style>
<style lang="less">
.dialog-title-m{
    position: relative;
    top:72px;
    left:208px;
    height:36px;
    line-height:36px;
    width: calc(100% - 208px - 250px);
    text-align:center;
    display: inline-block;
    vertical-align: top;
    background:#E2E1E2;
    border:1px solid rgba(204,204,204,1);
    border-radius:4px 4px 0px 0px;
    z-index: 1;
    overflow: hidden;
}
</style>


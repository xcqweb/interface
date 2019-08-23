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
          @keyup.enter="changeScaleInput"
        >
      </div>
      <div
        class="item-container"
        style="margin-left:10px;"
      >
        <span style="color:#797979;margin:0 6px;">高</span>
        <input
          v-model="dialogHeight"
          @keyup.enter="changeScaleInput"
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
      :style="{backgroundColor:bgColor,backgroundImage:bgImage}"
      @click="pickColor"
    />
    <div
      v-if="$store.state.main.type===1"
      class="dialog-title-m"
      :style="$store.state.main.dialogTitleStyle.style"
    >
      {{ titleName }}
    </div>
  </div>
</template>
<script>
let newBackgroundColor,newFontColor
let observe
let alignArr = ['left','center','right']
let valignArr = []
export default {
    data() {
        return {
            dialogDesc:"",
            showFont:false,
            titleName:'弹窗标题',
            dialogHeight: 400,
            dialogWidth: 600,
            fontText:12,
            bgColor:'#fff',
            fontColor:'#333333',
            bgImage:'',
            alignIndex1:2,
            alignIndex2:2,
            canvasOffsetTop:0,
            canvasOffsetLeft:0,
            dialogStyle:{},
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
        }
    },
    created() {
    },
    mounted() {
        this.dialogStyle = this.$store.state.main.dialogTitleStyle.style
        this.dialogWidth = this.$store.state.main.dialogTitleStyle.size.width || 600
        this.dialogHeight = this.$store.state.main.dialogTitleStyle.size.height || 400
        this.fontText = parseInt(this.dialogStyle.fontSize || 12)
        this.fontColor = this.dialogStyle.color
        this.bgColor = this.dialogStyle.bgColor
        this.alignIndex1 = alignArr.indexOf(this.dialogStyle.textAlign) + 1 || 2
        this.alignIndex2 = valignArr.indexOf(parseInt(this.dialogStyle.lineHeight)) + 1 || 2
        let editor = this.myEditorUi.editor
        setTimeout(() => {
            this.changeScaleInput()
            this.dialogDesc = editor.pages[editor.currentPage].desc
            this.titleName =  editor.pages[editor.currentPage].title
        },50)
    },
    destroyed() {
        let dialogTitleEle = document.querySelector('.dialog-title-m')
        dialogTitleEle.parentNode.removeChild(dialogTitleEle)
        observe.disconnect()
    },
    methods: {
        descChange() {
            let editor = this.myEditorUi.editor
            editor.pages[editor.currentPage].desc = this.dialogDesc
        },
        changeFont(d,e) {
            this.fontText = d
            this.showFont = false;
            let dialogStyle = {
                fontSize:`${this.fontText}px`,
            }
            this.commitStyleFun(dialogStyle)
            e.stopPropagation()
        },
        commitStyleFun(dialogStyle) {
            this.dialogStyle = Object.assign({},this.dialogStyle,dialogStyle)
            let obj = {style:this.dialogStyle,size:{width:this.dialogWidth,height:this.dialogHeight}}
            this.$store.commit('dialogTitleStyleDeal',obj) 
        },
        changeAlignIndex(type,index) {
            valignArr = [this.fontText + 5,36,36 * 2 - this.fontText - 10]
            if(type == 1) {
                this.alignIndex1 = index
            }else{
                this.alignIndex2 = index
            }
            let dialogStyle = {
                textAlign:`${alignArr[this.alignIndex1 - 1]}`,
                lineHeight:`${valignArr[this.alignIndex2 - 1]}px`,
            }
            this.commitStyleFun(dialogStyle)
        },
        changeScaleInput() {
            this.myEditorUi.setPageFormat({
                height: this.dialogHeight,
                width: this.dialogWidth,
                x: 0,
                y: 0
            }, true)
            let graph = this.myEditorUi.editor.graph
            let con = graph.container
            let dialogTitleEle = document.querySelector('.dialog-title-m')
            dialogTitleEle.parentNode.removeChild(dialogTitleEle)
            con.appendChild(dialogTitleEle)
            let conWidth = con.clientWidth
            let conHeight = con.clientHeight
            let {clientWidth,clientHeight} = con.children[1] //svg
            let canvasView = con.children[0]//画布
            this.canvasOffsetTop = canvasView.offsetTop
            this.canvasOffsetLeft = canvasView.offsetLeft
            con.scrollLeft = (clientWidth - conWidth) / 2
            con.scrollTop = (clientHeight - conHeight - 36) / 2
            let scheduledAnimationFrame = false
            con.addEventListener('scroll', () => {
                if (scheduledAnimationFrame) { //防止 requestAnimationFrame 执行周期内，scroll多次触发造成requestAnimationFrame多次执行
                    return 
                }
                scheduledAnimationFrame = true
                requestAnimationFrame(()=>{//节流
                    let dialogStyle = {
                        top:`${this.canvasOffsetTop - 36}px`,
                        left:`${this.canvasOffsetLeft}px`,
                        width:`${this.dialogWidth}px`,
                    }
                    this.commitStyleFun(dialogStyle)
                    this.$nextTick(()=>{
                        scheduledAnimationFrame = false//执行完操作后 重置
                    })
                    observe = new MutationObserver(()=> {
                        canvasView.style.width = `${this.dialogWidth}px`
                        canvasView.style.height = `${this.dialogHeight}px`
                    })
                    observe.observe(canvasView,{attributeFilter: ['style'], subtree: false})
                })
            })
        },
        hideFont() {
            this.showFont = false
        },
        pickColor() {
            this.myEditorUi.pickColor(newBackgroundColor || 'none',color=>{
                newBackgroundColor = color  
                this.bgColor = color
                let dialogStyle = {
                    background:`${this.bgColor}`,
                }
                this.commitStyleFun(dialogStyle)
            });
        },
        pickFontColor() {
            this.myEditorUi.pickColor(newFontColor || 'none',color=>{
                newFontColor = color  
                this.fontColor = color
                let dialogStyle = {
                    color:`${this.fontColor}`,
                }
                this.commitStyleFun(dialogStyle)
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


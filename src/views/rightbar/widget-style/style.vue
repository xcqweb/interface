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
    >
    <div class="item-line" />
    <div style="display:flex;margin-top:4px;">
      <div
        class="item-container"
      >
        <span style="color:#797979;margin:0 6px;">X</span>
        <input
          v-model="dialogWidth"
          style="border-left:none;border-right:none;"
          @keyup.enter="changePosition"
        >
      </div>
      <div
        class="item-container"
        style="margin-left:10px;"
      >
        <span style="color:#797979;margin:0 6px;">Y</span>
        <input
          v-model="dialogHeight"
          style="border-left:none;border-right:none;"
          @keyup.enter="changePosition"
        > 
      </div>
    </div>
    <div style="display:flex;margin-top:2px;">
      <div
        class="item-container"
      >
        <span style="color:#797979;margin:0 6px;">宽</span>
        <input
          v-model="dialogWidth"
          style="border-left:none;border-right:none;"
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
          style="border-left:none;border-right:none;"
          @keyup.enter="changeScaleInput"
        > 
      </div>
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
  </div>
</template>
<script>
let newFontColor
export default {
    data() {
        return {
            widgetName:"",
            showFont:false,
            dialogHeight: 400,
            dialogWidth: 600,
            fontText:12,
            fontColor:'#333333',
            alignIndex1:0,
            alignIndex2:0,
            isSetBold:false,
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
    created() {},
    mounted() {
    },
    methods: {
        changeFont(d,e) {
            this.fontText = d
            this.showFont = false;
            e.stopPropagation()
        },
        changeAlignIndex(type,index) {
            if(type == 1) {
                this.alignIndex1 = index
            }else{
                this.alignIndex2 = index
            }
        },
        setBold() {
            this.isSetBold = !this.isSetBold
        },
        changeScaleInput() {
           
        },
        changePosition() {

        },
        hideFont() {
            this.showFont = false
        },
        pickFontColor() {
            this.myEditorUi.pickColor(newFontColor || 'none',color=>{
                newFontColor = color  
                this.fontColor = color
            });
        }
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
      height:100%;
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
}
</style>

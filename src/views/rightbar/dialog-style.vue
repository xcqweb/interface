<template>
  <div
    class="dialogPage"
    style="padding:0 4px;"
  >
    <p style="text-align:center;margin:10px;font-size:14px;">
      弹窗样式
    </p>
    <p style="margin-top:15px;">
      弹框描述
    </p>
    <textarea
      v-model="pageDesc"
      rows="3"
    />
    <div class="item-title">
      弹框尺寸
    </div>
    <div style="display:flex;margin-top:4px;">
      <div
        class="item-container"
      >
        <span style="color:#797979;margin-right:6px;">宽</span>
        <input
          v-model="solidWidth"
        >
      </div>
      <div
        class="item-container"
        style="margin-left:10px;"
      >
        <span style="color:#797979;margin-right:6px;">高</span>
        <input
          v-model="solidHeight"
          @keyup.enter="changeScaleInput"
        >
      </div>
    </div>
    <div class="titleSet">
      <div class="titleText">
        标题文本
      </div>
      <div class="titleCon">
        <div class="itemLine">
          <div
            v-clickOutSide="hideScale"
            class="item-container fontSet"
            style="justify-content:space-between;position:relative;"
            @click="showScale=true"
          >
            {{ scaleText }}
            <img src="../../assets/images/menu/down_ic.png">
            <ul
              v-if="showScale"
              class="scale-dialog"
              @mouseleave="showScale=false"
              @blur="showScale=false"
            >
              <li
                v-for="(d,index) in scaleList"
                :key="index"
                @click="changeScale(d,$event)"
              >
                {{ d }}
              </li>
            </ul>
          </div>
          <div class="setBold" />
          <div class="setColor" />
        </div>
        <div class="itemLine">
          <div class="setLevel">
            <div class="left" />
            <div class="center" />
            <div class="right" />
          </div>
          <div class="setVertical">
            <div class="top" />
            <div class="mid" />
            <div class="bottom" />
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
    >
      <div
        v-if="showColor"
        class="color-dialog"
      >
        color pick
      </div>
    </div>
  </div>
</template>
<script>
let newBackgroundColor
export default {
    data() {
        return {
            pageDesc:"",
            showScale:false,
            showColor:false,
            solidHeight: 768,
            solidWidth: 1366, // 需求 宽度固定1366 不可修改
            scaleText:12,
            bgColor:'#fff',
            bgImage:'',
            scaleList:[
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
        changeScale(d,e) {
            this.showScale = false;
            e.stopPropagation()
        },
        hideScale() {
            this.showScale = false
        },
        pickColor() {
            this.myEditorUi.pickColor(newBackgroundColor || 'none',color=>{
                newBackgroundColor = color
                this.updateBackgroundColor()
            });
        },
    }
};
</script>

<style lang="less">
.dialogPage {
    width: 210px;
    font-size:12px;
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
    .scale-dialog{
        position:absolute;
        left:0;
        top:24px;
        z-index:22;
        background:#f5f5f5;
        width:100%;
        padding:6px 0;
        border:1px solid rgba(204,204,204,1);
        box-shadow:0px 3px 8px 0px rgba(0, 0, 0, 0.2);
        opacity:0.98;
        border-radius:0px 0px 2px 2px;
    }
    .item-title{
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
        padding:0 6px;
    }
    .titleSet{
      margin-top: 10px;
    }
    .titleText{
      margin-bottom: 4px;
    }
    .fontSet{
      width: 50%;
      margin-right: 5px;
    }
    .itemLine{
      display: flex;
      height: 24px;
      &:nth-child(2){
        margin-top: 5px;
      }
    }
    .setBold{
      width: 25%;
      background:url('../../assets/images/rightsidebar/B2_ic.png') no-repeat center center;
      margin-right: 5px;
      border:1px solid rgba(212,212,212,1);
      border-radius: 2px;
      background-color: #fff;
    }
    .setColor{
      width:25%;
      background: #000;
      border-radius: 2px;
      border:1px solid rgba(212,212,212,1);
    }
    .setLevel{
      width: 50%;
      border:1px solid rgba(212,212,212,1);
      margin-right: 3px;
      height: 24px;
      display: flex;
      border-radius:2px;
      background: #fff;
      .left{
        width: 33.333%;
        background:url('../../assets/images/rightsidebar/B2_ic.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
      }
      .center{
        width: 33.333%;
        background:url('../../assets/images/rightsidebar/center2_ic.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
      }
      .right{
        width: 33.333%;
        background:url('../../assets/images/rightsidebar/left2_ic.png') no-repeat center center;
      }
    }
    .setVertical{
      width: 50%;
      border:1px solid rgba(212,212,212,1);
      margin-right: 3px;
      height: 24px;
      display: flex;
      border-radius:2px;
      background: #fff;
      .top{
        width: 33.333%;
        background:url('../../assets/images/rightsidebar/B2_ic.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
      }
      .mid{
        width: 33.333%;
        background:url('../../assets/images/rightsidebar/centervertically2_ic.png') no-repeat center center;
        border-right:1px solid rgba(212,212,212,1);
      }
      .bottom{
        width: 33.333%;
        background:url('../../assets/images/rightsidebar/bottomalign2_ic.png') no-repeat center center;
      }
    }
    .setVertical{
      width: 50%;
      border:1px solid rgba(212,212,212,1);
      margin-left: 3px;
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

<template>
  <div
    class="geSidebarContainer geFormatContainer"
    style="padding:0 4px;"
  >
    <p style="text-align:center;margin:10px;font-size:14px;">
      页面样式
    </p>
    <p style="margin-top:15px;">
      页面描述
    </p>
    <textarea
      v-model="pageDesc"
      rows="3"
    />
    <div class="item-title">
      页面尺寸
    </div>
    <div
      v-clickOutSide="hideScale"
      class="item-container"
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
    <div style="display:flex;margin-top:4px;">
      <div
        class="item-container"
      >
        <span style="color:#797979;margin-right:6px;">宽</span>
        <input value="1280">
      </div>
      <div
        class="item-container"
        style="margin-left:10px;"
      >
        <span style="color:#797979;margin-right:6px;">高</span>
        <input value="800">
      </div>
    </div>
    <div
      class="item-title"
    >
      背景颜色
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
    <div
      class="item-container"
      style="justify-content:center;height:90px;margin-top:4px;"
      @click="pickImg"
    >
      <div style="text-align:center;">
        <img src="../../assets/images/rightsidebar/bg_ic_widget.png">
        <div>选择背景图案</div>
      </div>
    </div>
  </div>
</template>
<script>
import {mxRectangle} from '../../services/mxGlobal'
import {ChangePageSetup} from '../../services/editor/Init'
let newBackgroundColor
export default {
    data() {
        return {
            pageDesc:"",
            showScale:false,
            showColor:false,
            scaleText:'1280*800',
            bgColor:'#fff',
            bgImage:'',
            scaleList:[
                '1920*1080',
                '1440*900',
                '1280*800',
                '1336*768',
                '1336*768',
                '1024*768',
                '2560*1600',
            ],
        }
    },
    created() {},
    mounted() {
    },
    methods: {
        init() {
            let myEditor = this.myEditorUi.editor
            let graph = myEditor.graph
            newBackgroundColor = graph.background
        },
        changeScale(d,e) {
            let myEditor = this.myEditorUi.editor
            let graph = myEditor.graph
            this.scaleText = d
            this.showScale = false
            let arr = d.split("*")
            let pageFormat = new mxRectangle(0, 0, parseInt(arr[0]),  parseInt(arr[1]))
            let change = new ChangePageSetup(this.myEditorUi, null, null, pageFormat);
            change.ignoreColor = true;
            change.ignoreImage = true;
            graph.model.execute(change);
            e.stopPropagation()
        },
        pickColor() {
            this.myEditorUi.pickColor(newBackgroundColor || 'none',color=>{
                newBackgroundColor = color
                this.updateBackgroundColor()
            });
        },
        updateBackgroundColor()  {
            this.bgColor = newBackgroundColor
            this.myEditorUi.setBackgroundColor(this.bgColor)
        },
        pickImg() {
            
        },
        hideScale() {
            this.showScale = false
        },
    }
};
</script>

<style lang="less">
.geRightBarContainer {
    align-items: flex-end;
    textarea{
        resize:none;
        border:1px solid rgba(212,212,212,1);
        border-radius:2px;width:100%;
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
        padding:0 6px;
    }
    .color-dialog{
        position:absolute;
        left:0;
        top:24px;
        border:solid 1px red;
    }
}
</style>

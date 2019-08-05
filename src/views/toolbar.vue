<template>
  <div class="geToolbarContainer">
    <div class="geToolbar geToolbar1">
      <div class="tab">
        <div
          class="item page-tab"
          :class="{'selected':tab==1}"
          @click="changeTab(1)"
        >
          <img src="../assets/images/menu/page1_ic.png">
        </div>
        <div
          class="item data-tab"
          :class="{'selected':tab==2}"
          style="border-left:0;"
          @click="changeTab(2)"
        >
          <img src="../assets/images/menu/datasource2_ic.png">
        </div>
      </div>
    </div>
    <div class="geToolbar geToolbar2">
      <a
        href="javascript:void(0);"
        ondragstart="return false;"
        class="geButton"
        title="放大"
        @click.stop.prevent="zoom('in')"
      >
        <div class="geSprite geSprite-zoomin" />
      </a>
      <a
        ref="elScale"
        href="javascript:void(0);"
        class="geLabel"
        title="缩放 (Alt+Mousewheel)"
        style="white-space: nowrap; position: relative; overflow: hidden; width: 50px;"
        @click.stop.prevent="showScale('in')"
      >
        {{ scaleText }}
        <img
          border="0"
          style="position: absolute; right: 1px; top: 5px;"
          :src="dropDownImg"
          valign="middle"
        >
      </a>
      <a
        href="javascript:void(0);"
        class="geButton"
        title="缩小"
        @click.stop.prevent="zoom('out')"
      >
        <div class="geSprite geSprite-zoomout" />
      </a>
      <a
        href="javascript:void(0);"
        class="geButton"
        title="全屏 (F11)"
        @click.stop.prevent="fullscreen('out')"
      >
        <div class="geSprite geSprite-fullscreen" />
      </a>
    </div>
    <ScaleView
      v-if="isShowScale"
      @changeScale="changeScale"
      @hideScale="hideScale"
    />
  </div>
</template>
<script>
import {mxUtils} from '../services/mxGlobal'
import ScaleView from './scale-view'
export default{
    components:{
        ScaleView,
    },
    props:['dropDownImg'],
    data() {
        return {
            tab:1,
            scaleText:"100%",
            isShowScale:false,
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        changeTab(index) {
            this.tab = index
        },
        zoom(type) {
            let myEditor = this.myEditorUi.editor
            let graph = myEditor.graph
            if(type === 'in') {
                graph.zoomIn();
            }else{
                graph.zoomOut(); 
            }
        },
        init() {
          
        },
        fullscreen() {
            mxUtils.fullScreen()
        },
        updateZoom() {
            this.scaleText = Math.round(this.myEditorUi.editor.graph.view.scale * 100) + '%'
        },
        showScale() {
            this.isShowScale = true
        },
        hideScale() {
            this.isShowScale = false
        },
        changeScale(scale) {
            this.myEditorUi.editor.graph.zoomTo(scale)
            this.isShowScale = false
        }
    },      
}
</script>

<style scoped lang="less">

</style>

<style lang="less">
.geToolbar1{
  .tab{
    display:flex;
    justify-content:center;
    padding-top:3px;
  }
  .item{
    width:48px;
    height:24px;
    border-radius:2px 0px 0px 2px;
    border:1px solid rgba(202,201,202,1);
    background:rgba(255,255,255,1);
    text-align:center;
    position: relative;
    &.selected{
      background:rgba(61,145,247,1);
      border:1px solid rgba(202,201,202,1);
    }
    img{
      position: absolute;
      top:50%; 
      left:50%;
      transform: translate(-50%,-50%);
    }
  }
  .page-tab::after {
    content: "页面";
    position: relative;
    font-size: 12px;
    top:24px;
  }
   .data-tab::after {
    content: "数据源";
    position: relative;
    font-size: 12px;
    top:24px;
  }
}
  
</style>

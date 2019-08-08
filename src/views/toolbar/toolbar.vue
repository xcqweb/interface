<template>
  <div class="geToolbarContainer">
    <div class="geToolbar geToolbar1">
      <div class="tab">
        <div
          class="item page-tab"
          :class="{'selected':tab==1}"
          @click="changeTab(1)"
        >
          <img src="../../assets/images/menu/page1_ic.png">
        </div>
        <div
          class="item data-tab"
          :class="{'selected':tab==2}"
          style="border-left:0;"
          @click="changeTab(2)"
        >
          <img src="../../assets/images/menu/datasource2_ic.png">
        </div>
      </div>
    </div>
    <div
      class="geToolbar geToolbar2"
      style="margin-left:-7.1%;"
    >
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
        style="white-space: nowrap; position: relative; overflow: hidden; width: 50px;text-align:center;"
        @click.stop.prevent="isShowScale = true"
      >
        {{ scaleText }}
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
    <div class="geToolbar geToolbar3">
      <a
        ref="undo"
        href="javascript:void(0);"
        class="geButton"
        title="撤销 (Ctrl+Z)"
        @click.stop.prevent="addAction('undo')"
      >
        <div class="geSprite geSprite-undo" />
      </a>
      <a
        ref="redo"
        href="javascript:void(0);"
        class="geButton"
        style="margin-left:12px;"
        title="重做 (Ctrl+Y)"
        @click.stop.prevent="addAction('redo')"
      >
        <div class="geSprite geSprite-redo" />
      </a> 
    </div>
    <div class="geToolbar geToolbar4">
      <a
        href="javascript:void(0);"
        class="geButton"
        style="width:48px;display:flex;align-items:center;justify-content:center;"
        :title="alignText"
        @click="dealAlign(alignCls)"
        @mouseover.stop.prevent="showAlignDialog=true"
      >
        <div
          class="geSprite"
          :class="alignCls"
        />
        <img src="../../assets/images/menu/down_ic.png">
      </a>
      <a
        href="javascript:void(0);"
        class="geButton"
        title="移至最前 (Ctrl+Shift+F)"
        style="margin-left:12px;"
        @click.stop.prevent="addAction('toFront')"
      >
        <div class="geSprite geSprite-tofront" />
      </a>
      <a
        href="javascript:void(0);"
        ondragstart="return false;"
        class="geButton"
        title="移至最后 (Ctrl+Shift+B)"
        style="margin-left:12px;"
        @click.stop.prevent="addAction('toBack')"
      >
        <div class="geSprite geSprite-toback" />
      </a>
      <div class="geToolbar geToolbar5">
        <a
          href="javascript:void(0);"
          class="geButton"
          title="组合 (Ctrl+G)"
          @click.stop.prevent="addAction('group')"
        >
          <div class="geSprite geSprite-group" />
        </a>
        <a
          href="javascript:void(0);"
          class="geButton"
          title="取消组合 (Ctrl+Shift+U)"
          style="margin-left:12px;"
          @click.stop.prevent="addAction('ungroup')"
        >
          <div class="geSprite geSprite-ungroup" />
        </a>
      </div>
      <div class="geToolbar geToolbar6">
        <a
          href="javascript:void(0);"
          class="geButton"
          title="素材库"
          @click.stop.prevent="materialLab"
        >
          <div class="geSprite geSprite-material" />
        </a>
        <a
          href="javascript:void(0);"
          class="geButton"
          title="保存 (Ctrl+S)"
          style="margin-left:12px;"
          @click.stop.prevent="save"
        >
          <div class="geSprite geSprite-save" />
        </a>
        <a
          href="javascript:void(0);"
          class="geButton"
          title="预览 (Ctrl+Shift+L)"
          style="margin-left:12px;"
          @click.stop.prevent="preview"
        >
          <div class="geSprite geSprite-preview" />
        </a>
      </div>
    </div>
    <ScaleView
      v-if="isShowScale"
      @changeScale="changeScale"
      @hideScale="isShowScale = false"
    />
    <AlignDialog
      v-if="showAlignDialog"
      @changeAlign="changeAlign"
      @hideDialog="showAlignDialog=false"
    />
  </div>
</template>
<script>
import {mxUtils,mxConstants} from '../../services/mxGlobal'
import ScaleView from './scale-view'
import AlignDialog from './align-dialog'
import {PreviewDialog} from '../../services/editor/Dialogs'
import router from '../../router'
export default{
    components:{
        ScaleView,AlignDialog,
    },
    data() {
        return {
            tab:1,
            scaleText:"100%",
            isShowScale:false,
            showAlignDialog:false,
            alignCls:'geSprite-left-align',
            alignText:'左对齐',
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
            console.log(this.myEditorUi)
            let myEditor = this.myEditorUi.editor
            let graph = myEditor.graph
            if(type === 'in') {
                graph.zoomIn();
            }else{
                graph.zoomOut(); 
            }
        },
        init() {
            let keys = [
                'undo','redo'
            ]
            keys.forEach(key=>{
                let action = this.myEditorUi.actions.get(key);
                let elt = this.$refs[key]
                this.myEditorUi.toolbar.initElement(elt)
                if (action != null)  {
                    elt.setEnabled(action.enabled)
                    action.addListener('stateChanged',()=>{
                        elt.setEnabled(action.enabled)
                    })
                }
            })
        },
        fullscreen() {
            mxUtils.fullScreen()
        },
        updateZoom() {
            this.scaleText = Math.round(this.myEditorUi.editor.graph.view.scale * 100) + '%'
        },
        changeScale(scale) {
            this.myEditorUi.editor.graph.zoomTo(scale)
            this.isShowScale = false
        },
        addAction(key) {
            let action = this.myEditorUi.actions.get(key);
            action.funct()
        },
        changeAlign(d) {
            this.alignCls = d.cls
            this.alignText = d.text
            this.dealAlign(d.cls)
            this.showAlignDialog = false
        },
        dealAlign(cls) {
            let graph = this.myEditorUi.editor.graph
            switch(cls) {
                case 'geSprite-left-align':
                    graph.alignCells(mxConstants.ALIGN_LEFT)
                    break;
                case 'geSprite-right-align':
                    graph.alignCells(mxConstants.ALIGN_RIGHT)
                    break;
                case 'geSprite-top-align':
                    graph.alignCells(mxConstants.ALIGN_TOP)
                    break;
                case 'geSprite-bottom-align':
                    graph.alignCells(mxConstants.ALIGN_BOTTOM)
                    break;
                case 'geSprite-vertical-center':
                    graph.alignCells(mxConstants.ALIGN_CENTER)
                    break;
                case 'geSprite-horizon-center':
                    graph.alignCells(mxConstants.ALIGN_MIDDLE)
                    break;
                case 'geSprite-vertical-align':
                    graph.distributeCells(false)
                    break;
                case 'geSprite-horizon-align':
                    graph.distributeCells(true)
                    break;
            }
        },
        materialLab() {

        },
        save() {
            this.myEditorUi.saveFile(true);
        },
        preview() {
            let ui = this.myEditorUi
            var dlg = new PreviewDialog(ui, function(id) {
                let page = router.resolve({
                    path: "/interface_preview",
                    query: {
                        id: id
                    }
                });
                window.open(page.href, '_blank');
            })
            ui.showDialog(dlg.container, 410, 160, true, false, null, null, '预览');
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

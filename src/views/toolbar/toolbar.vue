<template>
  <div
    class="geToolbarContainer"
    style="height:72px;left:208px;width:calc(100% - 208px);border-left:1px solid #ccc;"
  >
    <div
      class="geToolbar geToolbar2"
    >
      <a
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        title="放大"
        @click.stop.prevent="zoom('in')"
      >
        <div class="geSprite geSprite-zoomin" />
      </a>
      <a
        ref="elScale"
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geLabel"
        title="缩放 (Alt+Mousewheel)"
        style="white-space: nowrap; position: relative; overflow: hidden; width: 50px;text-align:center;"
        @click.stop.prevent="isShowScale = true"
      >
        {{ scaleText }}
      </a>
      <a
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        title="缩小"
        @click.stop.prevent="zoom('out')"
      >
        <div class="geSprite geSprite-zoomout" />
      </a>
      <a
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
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
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        title="撤销 (Ctrl+Z)"
      >
        <div class="geSprite geSprite-undo" />
      </a>
      <a
        ref="redo"
        href="javascript:void(0);"
        class="del_use_flag_terry geButton"
        style="margin-left:12px;"
        title="重做 (Ctrl+Y)"
      >
        <div class="geSprite geSprite-redo" />
      </a> 
    </div>
    <div class="geToolbar geToolbar4">
      <a
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        style="width:48px;display:flex;align-items:center;justify-content:center;"
        :title="alignText"
        @click="dealAlign(alignCls)"
        @mouseover.stop.prevent="showAlignDialog=true"
      >
        <div
          class="geSprite geSprite-align"
          :class="alignCls"
        />
        <img src="../../assets/images/menu/down_ic.png">
      </a>
      <a
        ref="toFront"
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        title="移至最前 (Ctrl+Shift+F)"
        style="margin-left:12px;"
      >
        <div class="geSprite geSprite-tofront" />
      </a>
      <a
        ref="toBack"
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        title="移至最后 (Ctrl+Shift+B)"
        style="margin-left:12px;"
      >
        <div class="geSprite geSprite-toback" />
      </a>
    </div>
    <div class="geToolbar geToolbar5">
      <a
        ref="group"
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        title="组合 (Ctrl+G)"
      >
        <div class="geSprite geSprite-group" />
      </a>
      <a
        ref="ungroup"
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        title="取消组合 (Ctrl+Shift+U)"
        style="margin-left:12px;"
      >
        <div class="geSprite geSprite-ungroup" />
      </a>
    </div>
    <div class="geToolbar geToolbar6">
      <a
        href="javascript:void(0);"
        ondragstart="return false;"
        class="geButton"
        title="素材库"
        @click.stop.prevent="materialLab"
      >
        <div class="geSprite geSprite-material" />
      </a>
      <a
        href="javascript:void(0);"
        ondragstart="return false;"
        class="geButton"
        title="保存 (Ctrl+S)"
        style="margin-left:12px;"
        @click.stop.prevent="save"
      >
        <div class="geSprite geSprite-save" />
      </a>
      <a
        ref="previewapply"
        href="javascript:void(0);"
        ondragstart="return false;"
        class="geButton"
        title="预览 (Ctrl+Shift+L)"
        style="margin-left:12px;"
      >
        <div class="geSprite geSprite-preview" />
      </a>
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
    <MaterialRoom
      v-if="ifshowmarerial" 
      ref="materialroom"
      @triggerCancel="triggerCancel" 
    />
  </div>
</template>
<script>
import {mxUtils,mxConstants,mxEventSource} from '../../services/mxGlobal'
import ScaleView from './scale-view'
import AlignDialog from './align-dialog'
import MaterialRoom from '../materialroom/materialroom'
import VueEvent from '../../services/VueEvent.js'
export default{
    components:{
        ScaleView,AlignDialog,MaterialRoom
    },
    data() {
        return {
            scaleText:"100%",
            isShowScale:false,
            showAlignDialog:false,
            alignCls:'geSprite-left-align',
            alignText:'左对齐',
            ifshowmarerial: false
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
            this.$nextTick(() => {
                let keys = [
                    'undo', 'redo', 'toFront', 'toBack', 'group', 'ungroup', 'previewapply'
                ]
                keys.forEach(key=>{
                    let action = this.myEditorUi.actions.get(key);
                    let elt = this.$refs[key]
                    this.myEditorUi.toolbar.initElement(elt)
                    this.myEditorUi.toolbar.addClickHandler(elt, action.funct);
                    elt.setEnabled(action.enabled);
                    action.addListener('stateChanged', function() {
                        elt.setEnabled(action.enabled);
                    });
                    // if (action != null)  {
                    //     elt.setEnabled(action.enabled)
                    //     action.addListener('stateChanged',()=>{
                    //         elt.setEnabled(action.enabled)
                    //     })
                    // }
                })
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
            mxEventSource.call(this.myEditorUi.editor.graph)
            let action = this.myEditorUi.actions.get(key)
            mxEventSource.call(this.myEditorUi.editor.graph)
            action.funct()
            mxEventSource.call(this.myEditorUi.editor.graph)
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
                    graph.alignCells(mxConstants.ALIGN_MIDDLE)
                    break;
                case 'geSprite-horizon-center':
                    graph.alignCells(mxConstants.ALIGN_CENTER)
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
            this.ifshowmarerial = true
            this.$nextTick(() => {
                this.$refs.materialroom.init()
            })
        },
        triggerCancel() {
            this.ifshowmarerial = false
            VueEvent.$emit('select-nodetype') // 兄弟组件传值 改变节点类型 晴空指派方式
        },
        save() {
            this.myEditorUi.saveFile(true)
        },
    },      
}
</script>

<style scoped lang="less">

</style>

<style lang="less">
  
</style>

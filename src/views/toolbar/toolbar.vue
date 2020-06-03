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
        :title="$t('toolbar.zoomIn')"
        :class="{'mxDisabled':$store.state.main.type == 1}"
        @click.stop.prevent="zoom('in')"
      >
        <div class="geSprite geSprite-zoomin" />
      </a>
      <a
        ref="elScale"
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geLabel"
        :title="$t('toolbar.zoomInAndOut')"
        :class="{'mxDisabled':$store.state.main.type == 1}"
        style="white-space: nowrap; position: relative; overflow: hidden; width: 50px;text-align:center;"
        @click.stop.prevent="isShowScale = true && $store.state.main.type !== 1"
      >
        {{ scaleText }}
      </a>
      <a
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        :title="$t('toolbar.zoomOut')"
        :class="{'mxDisabled':$store.state.main.type == 1}"
        @click.stop.prevent="zoom('out')"
      >
        <div class="geSprite geSprite-zoomout" />
      </a>
      <a
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        :title="$t('toolbar.fullScreen')"
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
        :title="$t('toolbar.undoTitle')"
      >
        <div class="geSprite geSprite-undo" />
      </a>
      <a
        ref="redo"
        href="javascript:void(0);"
        class="del_use_flag_terry geButton"
        style="margin-left:12px;"
        :title="$t('toolbar.redoTitle')"
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
        :title="$t('toolbar.topTitle')"
        style="margin-left:12px;"
      >
        <div class="geSprite geSprite-tofront" />
      </a>
      <a
        ref="toBack"
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        :title="$t('toolbar.bottomTitle')"
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
        :title="$t('toolbar.groupTitle')"
      >
        <div class="geSprite geSprite-group" />
      </a>
      <a
        ref="ungroup"
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        :title="$t('toolbar.ungroupTitle')"
        style="margin-left:12px;"
      >
        <div class="geSprite geSprite-ungroup" />
      </a>
    </div>
    <div class="geToolbar geToolbar6">
      <a
        ref="lock"
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        :title="$t('toolbar.lock')"
      >
        <div
          class="geSprite geSprite-lock"
        />
      </a>
      <a
        ref="unlock"
        href="javascript:void(0);"
        ondragstart="return false;"
        class="del_use_flag_terry geButton"
        style="margin-left:12px;"
        :title="$t('toolbar.unlock')"
      >
        <div
          class="geSprite geSprite-unlock"
        />
      </a>
    </div>
    <div class="geToolbar geToolbar7">
      <a
        href="javascript:void(0);"
        ondragstart="return false;"
        class="geButton"
        :title="$t('materialLibrary')"
        @click.stop.prevent="materialLab"
      >
        <div class="geSprite geSprite-material" />
      </a>
      <a
        href="javascript:void(0);"
        ondragstart="return false;"
        class="geButton"
        :title="$t('toolbar.saveTitle')"
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
        :title="$t('toolbar.previewTitle')"
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
      ifshowmarerial: false
    }
  },
  computed: {
    lock() {
      return this.$store.state.main.widgetInfo.lock
    },
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
      if(this.$store.state.main.type == 1) {
        return
      }
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
        let keys = ['undo', 'redo', 'toFront', 'toBack', 'group', 'ungroup', 'previewapply','lock','unlock']
        keys.forEach(key=>{
          let action = this.myEditorUi.actions.get(key)
          let elt = this.$refs[key]
          this.myEditorUi.toolbar.initElement(elt)
          this.myEditorUi.toolbar.addClickHandler(elt, action.funct)
          elt.setEnabled(action.enabled)
          action.addListener('stateChanged', function() {
            elt.setEnabled(action.enabled)
          })
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
      if(this.$store.state.main.type == 1) {
        return
      }
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
      this.dealAlign(d.cls)
      this.showAlignDialog = false
    },
    dealAlign(cls) {
      let graph = this.myEditorUi.editor.graph
      let cells = graph.getSelectionCells()
      let flag = true
      for(let i = 0;i < cells.length;i++) {
        if(cells[i].style.indexOf('shape=tableBox') != -1) {
          flag = false
          break
        }
      }
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
          flag && graph.distributeCells(false)
          break;
        case 'geSprite-horizon-align':
          flag && graph.distributeCells(true)
          break;
      }
    },
    materialLab() {
      this.ifshowmarerial = true
      this.$nextTick(() => {
        this.$refs.materialroom.init()
      })
    },
    triggerCancel(data) {
      this.ifshowmarerial = false
      if(data === true) {
        VueEvent.$emit('select-nodetype')
      }
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

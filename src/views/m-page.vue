<template>
  <div class="geEditor">
    <Toolbar
      ref="toolbar"
    />
    <LeftSideBar
      ref="leftsidebar"
    />
    <RightBar
      ref="rightbar"
    />     
    <FooterBar v-if="isInited" />
  </div>
</template>

<script>
//mxgraph editor

import '../services/editor/Init'
import '../services/editor/EditorUi'
import '../services/editor/Editor'
import '../services/editor/Sidebar'
import '../services/editor/Graph'
import '../services/editor/Format'
import '../services/editor/Shapes'
import '../services/editor/Actions'
import '../services/editor/Menus'
import '../services/editor/Toolbar'
import '../services/editor/Dialogs'

import {Editor,EditorUi,mxEvent,mxUtils,mxResources} from '../services/mxGlobal'
import Toolbar from './toolbar/toolbar'
import LeftSideBar from './left-sidebar/left-sidebar'
import RightBar from './rightbar/rightbar'
import FooterBar from './footerbar/index'
import Vue from 'vue'
let timer = null
export default {
  components:{
    LeftSideBar,
    Toolbar,
    RightBar,
    FooterBar,
  },
  data() {
    return{
      isPage:true,
      isInited:false,
    }
  },
  created() {
    mxUtils.getAll([mxResources.getSpecialBundle(window.RESOURCES_PATH,window.mxLanguage), window.PREFIX_PATH + '/static/default.xml'],xhr=> {
      mxResources.parse(xhr[0].getText())
      // 默认配置
      var themes = new Object()
      themes[window.Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement()
      // 正常实例化
      let myEditor = new Editor(false, themes)
      let myEditorUi = new EditorUi(myEditor,document.querySelector(".geEditor"))
      myEditorUi.editor.InitEditor(myEditorUi).then(res => {
        const page = {
          width: 1366,
          height: 768
        }
        const dialog = {
          width: 600,
          height: 400
        }
        // 编辑
        if (res[1]) {
          const editData = res[1]
          // pc默认1366*768，mobile默认360*640
          if (!editData.lengthWidth) {
            myEditorUi.isOldApply = true
            if (editData.appType === 1) {
              editData.lengthWidth = '360*640'
            } else {
              editData.lengthWidth = '1366*768'
            }
          }
          const lengthWidth = editData.lengthWidth.split('*')
          page.width = lengthWidth[0] * 1
          page.height = lengthWidth[1] * 1
          if (editData.appType === 1) {
            // 移动端应用，弹窗页面的宽度跟页面宽度一样
            dialog.width = parseInt(page.width * 2 / 3)
            dialog.height = parseInt(page.height * 2 / 3)
          }
          myEditor.defaultXml[0] = myEditor.createPageXml(page.width, page.height)
          myEditor.defaultXml[1] = myEditor.createPageXml(dialog.width, dialog.height)
          if (editData.content) {
            const content = JSON.parse(editData.content)
            myEditorUi.editor.pages = content.pages
            myEditorUi.editor.pagesRank = content.rank
          }else{
            myEditor.pages.pageid_1.title = `${this.$t('page')}1`
            myEditor.pages.pageid_2.title = `${this.$t('popup')}1`
            if (!myEditor.pages.pageid_1.xml) {
              myEditor.pages.pageid_1.xml = myEditor.defaultXml[0]
            }
            if (!myEditor.pages.pageid_2.xml) {
              myEditor.pages.pageid_2.xml = myEditor.defaultXml[1]
            }
          }
          myEditorUi.editor.setFilename(editData.studioName)
          myEditorUi.editor.setApplyId(editData.studioId)
          myEditorUi.editor.setAppType(editData.appType)
          myEditorUi.editor.setDescribe(editData.descript)
          let pageArr = myEditorUi.editor.pagesRank['normal']
          if(pageArr && pageArr.length) {
            myEditorUi.editor.setCurrentPage(pageArr[0])
          }
          if(editData.theme) {
            myEditorUi.theme = JSON.parse(editData.theme)
          }else{
            myEditorUi.theme = null
          }
          document.title = `组态工具-${editData.studioName}`
        }else{//本地开发刚开始是新建的应用，没有应用id（该分支主要是开发时候用)
          myEditor.defaultXml[0] = myEditor.createPageXml(1366,768)
          myEditor.defaultXml[1] = myEditor.createPageXml(600,400)
        }
        Vue.prototype.myEditorUi = myEditorUi
        this.init()
        let timer = setTimeout(()=>{
          this.myEditorUi.editor.undoManager.clear() // 首次进入页面，setGraphXml 触发了 graphModel的undoManager,这里清空下
          clearTimeout(timer)
          timer = null
        },30)
        this.isInited = true
      })
    })
  },
  mounted() {
  },
  destoryed() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  },
  methods: {
    init() {
      let graph = this.myEditorUi.editor.graph
      graph.view.addListener(mxEvent.EVENT_SCALE, this.updateZoom);
      this.myEditorUi.editor.addListener('resetGraphView', this.updateZoom);
      this.$refs.toolbar.init();
      this.$refs.leftsidebar.init();
      this.$refs.rightbar.init()
      this.myEditorUi.initDiagramConWidth = this.myEditorUi.diagramContainer.offsetWidth
      timer = setInterval(()=> {
        this.myEditorUi.saveFile(true,true)
      },1000 * 60 * 1)//1分钟自动保存一次
    },
    updateZoom() {
      this.$refs.toolbar.updateZoom()
    },
  }
};
</script>

 

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
    <FooterBar
      ref="footbar"
      :bind-datas="bindDatas"
    />
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

import {Graph,Editor,EditorUi,mxEvent,mxUtils,mxResources} from '../services/mxGlobal'
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
            bindDatas: [],
            isInited:false,
        }
    },
    created() {
        mxUtils.getAll(['../static/resources/grapheditor.txt', '../static/default.xml'],xhr=> {
            mxResources.parse(xhr[0].getText())
            // 默认配置
            var themes = new Object()
            themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement()
            // 正常实例化
            let myEditor = new Editor(false, themes)
            let myEditorUi = new EditorUi(myEditor,document.querySelector(".geEditor"))
            myEditorUi.editor.InitEditor(myEditorUi).then(res => {
                // 编辑
                if (res[1]) {
                    var editData = res[1]
                    var content = JSON.parse(editData.content)
                    myEditorUi.editor.pages = content.pages
                    myEditorUi.editor.pagesRank = content.rank
                    myEditorUi.editor.setFilename(editData.studioName)
                    myEditorUi.editor.setApplyId(editData.studioId)
                    myEditorUi.editor.setDescribe(editData.descript)
                }
                Vue.prototype.myEditorUi = myEditorUi
                this.init()
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
            this.myEditorUi.editor.graph.view.addListener(mxEvent.EVENT_SCALE, this.updateZoom);
            this.myEditorUi.editor.graph.addListener(mxEvent.CLICK, this.selectCell,false);
            this.myEditorUi.editor.addListener('resetGraphView', this.updateZoom);
            this.$refs.toolbar.init();
            this.$refs.leftsidebar.init();
            this.$refs.rightbar.init()
            this.$refs.footbar.init();
            timer = setInterval(()=> {
                this.myEditorUi.saveFile(true,true)
            },1000 * 60 * 3)//3分钟自动保存一次
        },
        updateZoom() {
            this.$refs.toolbar.updateZoom();
        },
        selectCell() {
            this.bindDatas = []
            let cells = this.myEditorUi.editor.graph.getSelectionCells();
            if (cells.length > 1) {
                return;
            }
            for (let i = 0; i < cells.length; i++) {
                let val = (cells[i].value && cells[i].value.attributes && cells[i].value.attributes.bindData) ? JSON.parse(cells[i].value.attributes.bindData.value) : ''
                if (val) {
                    this.bindDatas.push(val)
                }
            }
        },
    }
};
</script>

 

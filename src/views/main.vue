<template>
  <div class="container">
    <Toolbar
      ref="toolbar"
    />
    <LeftSideBar ref="leftsidebar" />
    <RightBar />
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

import {Graph,Editor,EditorUi,mxEvent} from '../services/mxGlobal'
import Toolbar from './toolbar/toolbar'
import LeftSideBar from './left-sidebar/left-sidebar'
import RightBar from './rightBar/rightbar'
import FooterBar from './footerbar/index'
import Vue from 'vue'
export default {
    components:{
        LeftSideBar,
        Toolbar,
        RightBar,
        FooterBar,
    },
    data() {
        return{
            bindDatas: []
        }
    },
    created() {
        window.mxUtils.getAll(['../static/resources/grapheditor.txt', '../static/default.xml'],xhr=> {
            window.mxResources.parse(xhr[0].getText());
            // 默认配置
            var themes = new Object();
            themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();
            // 正常实例化
            let myEditor = new Editor(false, themes);
            let myEditorUi = new EditorUi(myEditor,document.querySelector("#app"));
            Vue.prototype.myEditorUi = myEditorUi
            myEditorUi.editor.InitEditor(myEditorUi)
            this.init()
            console.dir(this.myEditorUi)
        })
    },
    mounted() {
        
    },
    methods: {
        init() {
            this.myEditorUi.editor.graph.view.addListener(mxEvent.EVENT_SCALE, this.updateZoom);
            this.myEditorUi.editor.graph.addListener(mxEvent.CLICK, this.selectCell,false);
            this.myEditorUi.editor.addListener('resetGraphView', this.updateZoom);
            this.$refs.toolbar.init();
            this.$refs.leftsidebar.init();
            this.$refs.footbar.init();
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
                // console.dir(cells[i].value && cells[i].value.attributes && cells[i].value.attributes.bindData);  
            }
        },
    }
};
</script>

<style scoped lang="less">

</style>

<style lang="less">
.container{
    position: relative;
    height: 100%;
}
</style>

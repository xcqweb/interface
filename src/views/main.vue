<template>
  <div>
    <Toolbar
      ref="toolbar"
      :drop-down-img="dropDownImg"
    />
    <RightBar />
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
import Toolbar from './toolbar'
import RightBar from './rightBar'
import Vue from 'vue'
export default {
    components:{
        Toolbar,
        RightBar
    },
    data() {
        return{
            dropDownImg:"",
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
        })
    },
    mounted() {
    },
    methods: {
        init() {
            this.dropDownImg = this.myEditorUi.toolbar.dropdownImage
            this.myEditorUi.editor.graph.view.addListener(mxEvent.EVENT_SCALE, this.updateZoom);
            this.myEditorUi.editor.addListener('resetGraphView', this.updateZoom);
            this.$refs.toolbar.init();
        },
        updateZoom() {
            this.$refs.toolbar.updateZoom();
        }
    }
};
</script>

<style scoped lang="less">

</style>

<style lang="less">
#app{
  font-size:14px;
  font-family:MicrosoftYaHei;
  position: relative;
  height:100%;
}
</style>

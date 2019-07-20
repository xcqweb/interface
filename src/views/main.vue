<template>
  <div />
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

export default {
    data() {
        return{
            
        }
    },
    mounted() {
        window.mxUtils.getAll(['../static/resources/grapheditor.txt', '../static/default.xml'], function(xhr) {
            window.mxResources.parse(xhr[0].getText());
            // 默认配置
            var themes = new Object();
            themes[window.Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();
            // 正常实例化
            var editorUi = new window.EditorUi(new window.Editor(false, themes),document.querySelector("#app"));
            editorUi.editor.InitEditor(editorUi);
        })
    },
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

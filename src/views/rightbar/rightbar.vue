<template>
  <div
    class="geSidebarContainer geRightBarContainer"
    style="top:72px;right:0;"
  >
    <div class="rightbarShortcut">
      <div
        ref="shortCutWrapper"
        class="geSidebar"
        style="touch-action: none;"
      />
    </div>
    <div class="geSidebarContainer geFormatContainer">
      <PageStyle
        v-show="$store.state.main.type===0 && !showWidgetStyle"
        ref="pageStyle"
      />
      <DialogStyle v-show="$store.state.main.type===1 && !showWidgetStyle" />
      <WidgetStyleMain v-show="showWidgetStyle" />
    </div>
  </div>
</template>
<script>
import {mxCell,mxGeometry} from '../../services/mxGlobal'
import PageStyle from './page-style'
import DialogStyle from './dialog-style'
import WidgetStyleMain from './widget-style-main'

let shortCutWidgets
export default {
    components:{PageStyle,DialogStyle,WidgetStyleMain},
    data() {
        return {
            showWidgetStyle:false,
        }
    },
    created() {},
    mounted() {
    },
    methods: {
        init() {
            let that = this.myEditorUi.sidebar
            let graph = this.myEditorUi.editor.graph
            let ele = this.$refs.shortCutWrapper
            shortCutWidgets = [
                // 文字
                that.createVertexTemplateEntry(
                    "shape=text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;image=/static/stencils/basic/image.png",
                    40,
                    20,
                    // 类似链接一样设置
                    '<span style="display:table-cell;vertical-align: middle;word-break:break-word;line-height:1;">text</span>',
                    "文字"
                ),
                // 矩形
                that.createVertexTemplateEntry(
                    "rounded=0;shape=rectangle;whiteSpace=wrap;html=1;",
                    120,
                    60,
                    "",
                    "矩形",
                    null,
                    null,
                    "矩形"
                ),
                //直线
                that.createEdgeTemplateEntry('shape=beeline;endArrow=none;html=1;', 50, 0, '', '直线', null, ''),
                // 按钮
                that.createVertexTemplateEntry('shape=button;html=1;strokeColor=#000;fillColor=none;overflow=fill', 70, 40, '<button class="buttonTag" style="box-sizing:content-box;background:transparent;">BUTTON</button>', '按钮'),
                //表格,通过矩形拼接
                that.addEntry('tableBox', function() {
                    var cell = new mxCell('', new mxGeometry(0, 0, 300, 90), 'shape=tableBox;group');
                    cell.vertex = true;
                    for (let i = 0; i < 9; i++) {
                        let line = parseInt(i / 3);
                        let xNum = i % 3;
                        let symbol = new mxCell(i < 3 ? 'Column ' + (i + 1) : '', new mxGeometry(xNum * 100, 30 * line, 100, 30), 'shape=tableCell;strokeColor=#000000;html=1;whiteSpace=wrap;');
                        symbol.vertex = true;
                        cell.insert(symbol);
                    }
                    return that.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, '表格');
                }),
                // 图片
                that.createVertexTemplateEntry('shape=image;image;html=1;labelBackgroundColor=#ffffff;image=/static/stencils/basic/image.png', that.defaultImageWidth, that.defaultImageHeight, '', '图片'),
            ]
            for (let i = 0; i < shortCutWidgets.length; i++) {
                ele.appendChild(shortCutWidgets[i](ele));
            }
            this.myEditorUi.format.refresh = ()=>{
                this.showWidgetStyle = !(graph.isSelectionEmpty() || graph.getSelectionCount() > 1)
            }
            this.myEditorUi.format.refresh()
            this.$refs.pageStyle.init()
        },
    }
};
</script>

<style lang="less">
.geRightBarContainer {
    align-items: flex-end;
    .rightbarShortcut {
        font-size: 12px;
        position: absolute;
        box-sizing: border-box;
        top: 0;
        left: 0;
        height: 100%;
        width: 40px;
        border-right: 1px solid #ccc;
        border-left: 1px solid #ccc;
        .geSidebar{
            padding: 0;
        }
        a{
            padding: 0 !important;
            width: auto !important;
            height: 45px !important;
            background-size:22px 22px;
            background-position: top center;
            svg{
                height: 21px !important;
            }
        }
    }
}
</style>

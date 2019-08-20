<template>
  <div
    id="preview_c"
    style="height: 100%;overflow: scroll;"
  />
</template>

<script> 

let rank,pages
export default {
    data() {
        return{
            pageId:"",
            currentPage:"",
        }
    },
    mounted() {
        this.init();
    },
    methods:{
        async init() {
            let ids = /id=(.+?)$/.exec(location.search);
            let id;
            if (ids) {
                // 查看应用
                id = ids[1];
            }
            this.requestUtil.get('/api/image/host').then(res=>{
                // 文件服务器地址
                window.fileSystem = res.host;
            })
           
            let applyInfo = await this.requestUtil.get(`/api/viewtool/${id}`);
            let {content} = applyInfo
            if(content) {
                content = JSON.parse(content)
                pages = content.pages
                rank = content.rank
                this.pageId = rank.normal[0]
                this.currentPage = pages[this.pageId]
            }

            /*  let model = new window.mxGraphModel();
            let graph = new window.mxGraph(document.querySelector("#preview_c"), model);

            var node = window.mxUtils.parseXml(this.currentPage.xml);
            let decoder = new window.mxCodec();
            decoder.decode(node.documentElement, graph.getModel)

            graph.getModel().beginUpdate(); */

            var container = document.getElementById("preview_c");
            //设置背景样式
            //container.style.background = 'url(../static/images/default/grid.gif)';        
            container.style.height = "300px";
            container.style.padding = "20px";
            //创建一个画板
            var graph = new window.mxGraph(container);
            graph.setCellsEditable(false); 
            console.log(this.currentPage.xml)
            var doc = window.mxUtils.parseXml(`<mxGraphModel dx="868" dy="452" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="3300" pageHeight="4681" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="66yXgANq4Rs35wKDr7wg-14" value="2233" style="rounded=0;whiteSpace=wrap;html=1;dashed=1;gradientColor=#ffffff;" vertex="1" parent="1">
      <mxGeometry x="350" y="110" width="120" height="60" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>
`);
            var codec = new window.mxCodec(doc);
            console.log(codec.decode(doc.documentElement, graph.getModel()));

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
.main-contianer{
  display:flex;
  position: relative;
  height:100%;
} 
</style>

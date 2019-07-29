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
            content = JSON.parse(content)
            console.log(content)
            pages = content.pages
            rank = content.rank
            this.pageId = rank.normal[0]
            this.currentPage = pages[this.pageId]

            /*  let model = new window.mxGraphModel();
            let graph = new window.mxGraph(document.querySelector("#preview_c"), model);

            var node = window.mxUtils.parseXml(this.currentPage.xml);
            let decoder = new window.mxCodec();
            decoder.decode(node.documentElement, graph.getModel)

            graph.getModel().beginUpdate(); */

            var container = document.getElementById("preview_c");
            //设置背景样式
            container.style.background = 'url(../static/images/default/grid.gif)';        
            container.style.height = "300px";
            container.style.padding = "20px";
            //创建一个画板
            var graph = new window.mxGraph(container);
            
            var doc = window.mxUtils.parseXml(this.currentPage.xml);
            console.log(doc.firstChild)
            let a = doc.firstChild
            console.dir(a)
            var codec = new window.mxCodec(doc);
            codec.decode(doc.documentElement, graph.getModel());

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

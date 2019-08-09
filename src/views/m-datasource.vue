<template>
  <div class="data-top">
    <div class="tool-bar">
      <button>导入数据源</button>
      <button>绑定数据源</button>
    </div>
    <div class="data-main">
      <div class="data-tab">
        <div v-if="isData">
          数据源 <!--引入数据源vue组件-->
        </div>

        <div v-if="!isData">
          数据模型 <!--引入数据模型vue组件-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default{
    data() {
        return {
            tab:1,
            isData:true,
        }
    },
    mounted() {
    },
    methods: {
        
    },      
}
</script>

<style scoped lang="less">
.data-top{
    position: relative;
    width:calc(100% - 208px);
    height:100%;
}
.tool-bar{
    position: relative;
    left:208px;
    padding-left:60px;
    height:72px;
    display:flex;
    align-items: center;
    background: linear-gradient(0deg,rgba(216,216,216,1) 0%,rgba(228,227,228,1) 100%);
    border-left: 1px solid rgb(204, 204, 204);
}
.data-main{
    position: relative;
    width:100%;
}
</style>

<style lang="less">
   
</style>

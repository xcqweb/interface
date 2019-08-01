<template>
  <div
    style="height: 100%;overflow: scroll;"
  >
    <!-- 内容主体 -->
    <div id="gePreview" />
    <!-- 跟随内容浮窗 -->
    <div id="formatLayer" />
    <!-- 弹窗页面 -->
    <div id="geDialogs" />
  </div>
</template>

<script> 
import preview from '../services/preview'
export default {
    data() {
        return{

        }
    },
    mounted() {
        this.$nextTick(()=>{
            preview.mainProcess.init()
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
.main-contianer{
  display:flex;
  position: relative;
  height:100%;
} 
</style>

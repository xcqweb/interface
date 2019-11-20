<template>
  <div
    style="height: 100%;overflow:auto;background:#000;"
  >
    <!-- 内容主体 -->
    <div id="gePreview">
      <div
        id="gePreviewCon"
        style="width:100%;height:100%;"
      />
      <div class="gePreviewMenu" />
      <div
        class="gePreviewMenuIcon"
        title="菜单"
      />
    </div>
    <!-- 弹窗页面 -->
    <div id="geDialogs" />
    <!-- 跟随内容浮窗 -->
    <div id="formatLayer" />
  </div>
</template>

<script> 
import preview from '../services/preview/'
export default {
    data() {
        return{

        }
    },
    mounted() {
        this.$nextTick(()=>{
            preview.mainProcess.init()
            history.pushState(null, null, document.URL)
            window.addEventListener('popstate', ()=> {
                history.pushState(null, null, document.URL)
            })
        })
    },
};
</script>

<style scoped lang="less">
 
</style>

<style lang="less">
#formatLayer{
  pointer-events:none;
}
</style>

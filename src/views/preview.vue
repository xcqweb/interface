<template>
  <div
    style="height: 100%;overflow: scroll;"
  >
    <!-- 内容主体 -->
    <div id="gePreview" />
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
        console.log(88)
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
</style>

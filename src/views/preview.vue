<template>
  <div
    style="height: 100%;overflow: scroll;"
  >
    <!-- 内容主体 -->
    <div id="gePreview" />
    <!-- 弹窗页面 -->
    <div id="geDialogs" />
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
</style>

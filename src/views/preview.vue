<template>
  <div class="gePreview_bg">
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
    <!-- 提示modal -->
    <Modal
      v-model="visible"
      class="custom-modal"
      :title="$t('tooltips')"
      :width="460"
      :mask-closable="false"
    >
      <p
        style="padding: 20px;"
      >
        确定要执行此操作吗？
      </p>
      <div slot="footer">
        <Button
          size="small"
          style="width: 72px; height: 30px;"
          @click="visible=false"
        >
          {{ $t('cancel') }}
        </Button>
        <Button
          type="primary"
          size="small"
          style="width: 72px; height: 30px;"
          @click="confirm"
        >
          {{ $t('confirm') }}
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script> 
import preview from '../services/preview/'
import {Modal, Button} from 'iview'
export default {
  components: {
    Modal,
    Button,
  },
  data() {
    return {
      visible:true,
    }
  },
  mounted() {
    this.$nextTick(()=>{
      preview.mainProcess.init(this)
      history.pushState(null, null, document.URL)
      this.stateListener = ()=> {//防止预览界面可以点击浏览器回退键
        history.pushState(null, null, document.URL)
      }
      window.addEventListener('popstate',this.stateListener )
    })
  },
  destroyed() {
    window.removeEventListener('popstate',this.stateListener )
  },
  methods:{
    confirm() {
      this.visible = false
    }
  }
};
</script>

<style scoped lang="less">
 
</style>

<style lang="less">
#formatLayer{
  pointer-events:none;
}
</style>

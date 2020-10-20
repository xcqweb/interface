<template>
  <Modal
    v-model="visible"
    class="devices-modal custom-modal"
    title="传递参数"
    :width="960"
    :mask-closable="false"
  >
    阿斯顿发圣诞
    <!-- 按钮 -->
    <div slot="footer">
      <Button
        @click="cancel"
      >
        {{ $t('cancel') }}
      </Button>
      <Button
        type="primary"
        @click="submit"
      >
        {{ $t('confirm') }}
      </Button>
    </div>
  </Modal>
</template>

<script>
import {Modal, Button} from 'iview'

export default {
  components: {
    Modal,
    Button
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {
    cancel() {
      this.$emit("update:visible",false)
    },
    submit() {
       
    },
  },
};
</script>

<style lang="less">
 
</style>
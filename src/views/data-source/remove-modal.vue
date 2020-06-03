<template>
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
      {{ content }}
    </p>
    <div slot="footer">
      <Button
        size="small"
        style="width: 72px; height: 30px;"
        @click="cancel"
      >
        {{ $t('cancel') }}
      </Button>
      <Button
        type="primary"
        size="small"
        style="width: 72px; height: 30px;"
        :loading="loading"
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
    Button,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      if (!val) {
        this.$emit('input', val);
      }
    },
  },
  mounted() {
    this.visible = this.value;
  },
  methods: {
    submit() {
      this.cancel();
      this.$emit('callback');
    },
    cancel() {
      this.visible = false;
    },
  },
};
</script>
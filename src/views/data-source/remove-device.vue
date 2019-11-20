<template>
  <modal
    v-model="visible"
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
  </modal>
</template>

<script>
import {Modal, Button, Message} from 'iview'

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
        data: {
            type: Array,
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
            const params = {
                ids: this.data,
            };
            this.requestUtil.post('api/iot-cds/cds/delConfigDevice', params).then(() => {
                Message.success(this.$t('dataSource.removeDeviceSuccessfully'));
                this.cancel();
                this.$emit('callback');
            });
        },
        cancel() {
            this.visible = false;
        },
    },
};
</script>
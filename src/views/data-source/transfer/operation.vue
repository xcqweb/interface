<template>
  <div :class="prefixCls + '-operation'">
    <Button
      type="primary"
      size="small"
      :disabled="!rightActive"
      @click.native="moveToLeft"
    >
      <Icon type="ios-arrow-back" />
      <span>{{ operations[0] }}</span>
    </Button>
    <Button
      type="primary"
      size="small"
      :disabled="!leftActive"
      @click.native="moveToRight"
    >
      <span>{{ operations[1] }}</span>
      <Icon type="ios-arrow-forward" />
    </Button>
  </div>
</template>
<script>
import {Button, Icon} from 'iview'

export default {
    components: {
        Button,
        Icon,
    },
    props: {
        prefixCls: String,
        operations: Array,
        leftActive: Boolean,
        rightActive: Boolean,
    },
    methods: {
        moveToLeft() {
            this.$parent.moveTo('left');
        },
        moveToRight() {
            this.$parent.moveTo('right');
        },
    },
};
</script>
<template>
  <div :class="prefixCls">
    <Input
      v-model.trim="currentQuery"
      size="small"
      :icon="icon"
      :placeholder="placeholder"
      @on-click="handleClick"
    />
  </div>
</template>
<script>
import {Input} from 'iview'

export default {
  components: {
    Input,
  },
  props: {
    prefixCls: String,
    placeholder: String,
    query: String,
  },
  data() {
    return {
      currentQuery: this.query
    };
  },
  computed: {
    icon() {
      return this.query === '' ? 'ios-search' : 'ios-close-circle';
    },
  },
  watch: {
    query(val) {
      this.currentQuery = val;
    },
    currentQuery(val) {
      this.$emit('on-query-change', val);
    },
  },
  methods: {
    handleClick() {
      if (this.currentQuery === '') {
        return;
      }
      this.currentQuery = '';
      this.$emit('on-query-clear');
    },
  },
};
</script>
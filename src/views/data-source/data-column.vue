<template>
  <div
    :style="{width: width ? width + 'px' : ''}"
  >
    <div
      class="data-column flex-column"
    >
      <div
        v-if="title"
        class="data-column-title"
      >
        {{ title }}
      </div>
      <div
        v-if="$slots && $slots.header"
        class="data-column-header"
      >
        <slot name="header" />
      </div>
      <div class="data-column-body flex-full-item">
        <slot />
      </div>
      <div
        v-if="$slots && $slots.footer"
        class="data-column-footer"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
import columnCommon from './js/column-common';

export default {
    mixins: [columnCommon],
};
</script>

<style lang="less">
.data-column {
  background-color: #fff;
  border: 1px solid #D4D4D4;
  border-radius: 4px;
}

.data-column-title,
.data-column-footer {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 0;
    font-size: 0;
    border-top-width: 1px;
    border-top-style: solid;
  }
}

.data-column-title {
  height: 36px;
  padding: 0 12px;
  line-height: 36px;
  background: linear-gradient(0deg,rgba(216,216,216,1) 0%,rgba(228,227,228,1) 100%);
  
  &::before {
    bottom: 0;
    border-top-color: #ccc;
  }
}

.data-column-footer {
  padding-top: 6px;
  padding-bottom: 6px;
  display: flex;
  align-items: center;

  &::before {
    top: 0;
    border-top-color: #D4D4D4;
  }
}
</style>
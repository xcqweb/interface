<template>
  <data-column
    :title="title"
    :width="width"
  >
    <!-- 数据列表 -->
    <ul
      v-if="data && data.length > 0"
      class="device-data-list"
    >
      <li
        v-for="(item, index) in data"
        :key="index"
        :class="{active: showActive && activeIndex === index}"
        style="cursor: pointer"
        @click="handleClick(item, index)"
      >
        {{ getValue(item, prop) }}
      </li>
    </ul>
    <no-data v-else />
  </data-column>
</template>

<script>
import deviceCommon from './js/device-common'

export default {
  mixins: [deviceCommon],
};
</script>

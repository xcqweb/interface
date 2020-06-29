<template>
  <data-column
    :title="title"
    :width="width"
  >
    <div
      v-if="searchFlag"
      class="device-data-list"
    >
      <Input
        v-model.trim="searchText"
        size="small"
        placeholder="请输入搜索内容"
      />
    </div>
    <!-- 数据列表 -->
    <ul
      v-if="data && data.length > 0"
      class="device-data-list"
    >
      <li
        v-for="(item, index) in data"
        v-show="(!searchText || item[prop].toUpperCase().includes(searchText.toUpperCase()))"
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
import {Input} from 'iview'
export default {
  components: {
    Input
  },
  mixins: [deviceCommon]
};
</script>

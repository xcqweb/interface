<template>
  <data-column
    :title="title"
    :width="width"
  >
    <div
      slot="header"
      class="addmodel-btn"
    >
      <a href="javascript:;">
        {{ $t('dataSource.addModel') }}
      </a>
    </div>
    <!-- 数据列表 -->
    <ul
      v-if="data && data.length > 0"
      class="device-data-list"
    >
      <li
        v-for="(item, index) in data"
        :key="index"
        :class="{active: showActive && activeIndex === index}"
        @click="handleClick(item, index)"
      >
        {{ getValue(item, prop) }}
      </li>
    </ul>
    <no-data
      v-else
      :margin-top="-36"
    />
  </data-column>
</template>

<script>
import NoData from './nodata';
import DataColumn from './data-column'
import columnCommon from './js/column-common'

export default {
    components: {
        NoData,
        DataColumn,
    },
    mixins: [columnCommon],
    data() {
        return {
            data: [],
        };
    },
};
</script>

<template>
  <div
    :class="classes"
    :style="style"
  >
    <div
      :class="prefixCls + '-header'"
    >
      <span
        :class="prefixCls + '-header-title'"
      >
        {{ title }}
      </span>
      <span :class="prefixCls + '-header-count'">{{ count }}</span>
    </div>
    <div :class="bodyClasses">
      <div
        v-if="filterable"
        :class="prefixCls + '-body-search-wrapper'"
      >
        <Search
          :prefix-cls="prefixCls + '-search'"
          :query="query"
          :placeholder="filterPlaceholder"
          @on-query-clear="handleQueryClear"
          @on-query-change="handleQueryChange"
        />
      </div>
      <checkbox-group
        :value="checkedKeys"
        style="height: 100%;"
        @on-change="handleCheckboxChange"
      >
        <ul :class="prefixCls + '-content'">
          <li
            v-for="(item, index) in filterData"
            :key="index"
            :class="itemClasses(item)"
            @click.prevent="select(item)"
          >
            <checkbox
              :label="item.key"
              :disabled="item.disabled"
              @click.native.stop
            >
              <span :title="showLabel(item)">
                {{ showLabel(item) }}
              </span>
            </checkbox>
          </li>
          <li :class="prefixCls + '-content-not-found'">
            {{ notFoundText }}
          </li>
        </ul>
      </checkbox-group>
    </div>
    <div
      v-if="showFooter"
      :class="prefixCls + '-footer'"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import Search from './search';
import {CheckboxGroup, Checkbox} from 'iview';

export default {
  components: {
    Search,
    CheckboxGroup,
    Checkbox ,
  },
  props: {
    prefixCls: String,
    data: Array,
    renderFormat: Function,
    checkedKeys: Array,
    listStyle: Object,
    title: [String, Number],
    filterable: Boolean,
    filterPlaceholder: String,
    filterMethod: Function,
    notFoundText: String,
    validKeysCount: Number,
    multiple: Boolean,
  },
  data() {
    return {
      showItems: [],
      query: '',
      showFooter: true,
            
    };
  },
  computed: {
    classes() {
      return [
        `${this.prefixCls}`,
        {
          [`${this.prefixCls}-with-footer`]: this.showFooter
        }
      ];
    },
    bodyClasses() {
      return [
        `${this.prefixCls}-body`,
        {
          [`${this.prefixCls}-body-with-search`]: this.filterable,
          [`${this.prefixCls}-body-with-footer`]: this.showFooter
        }
      ];
    },
    count() {
      const validKeysCount = this.validKeysCount;
      return (validKeysCount > 0 ? `${validKeysCount}/` : '') + `${this.filterData.length}`;
    },
    filterData() {
      return this.showItems.filter(item => this.filterMethod(item, this.query));
    },
    style() {
      const style = Object.assign({}, this.listStyle || {}, {width: '100%'});
      return style;
    },
  },
  watch: {
    data() {
      this.updateFilteredData();
    },
  },
  created() {
    this.updateFilteredData();
  },
  mounted() {
    this.showFooter = this.$slots.default !== undefined;
  },
  methods: {
    itemClasses(item) {
      return [
        `${this.prefixCls}-content-item`,
        {
          [`${this.prefixCls}-content-item-disabled`]: item.disabled
        }
      ];
    },
    showLabel(item) {
      return this.renderFormat(item);
    },
    select(item) {
      if (item.disabled) {
        return;
      }
      const includes = this.checkedKeys.includes(item.key);
      this.$emit('on-checked-keys-change', includes ? [] : [item.key]);
    },
    updateFilteredData() {
      this.showItems = this.data;
    },
    handleQueryClear() {
      this.query = '';
    },
    handleQueryChange(val) {
      this.query = val;
    },
    handleCheckboxChange(data) {
      this.$emit('on-checked-keys-change', data.splice(data.length - 1, 1));
    }
  },
};
</script>
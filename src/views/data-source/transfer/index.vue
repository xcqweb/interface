<template>
  <div class="ivu-transfer">
    <template v-if="multiple">
      <list
        ref="left"
        :prefix-cls="prefixCls + '-list'"
        :data="leftData"
        :render-format="leftRenderFormat"
        :checked-keys="leftCheckedKeys"
        :valid-keys-count="leftValidKeysCount"
        :list-style="listStyle"
        :title="localeTitles[0]"
        :filterable="filterable"
        :filter-placeholder="localeFilterPlaceholder"
        :filter-method="leftFilterMethod"
        :not-found-text="notFoundText"
        @on-checked-keys-change="handleLeftCheckedKeysChange"
      />
      <operation
        :prefix-cls="prefixCls"
        :operations="operations"
        :left-active="leftValidKeysCount > 0"
        :right-active="rightValidKeysCount > 0"
      />
      <list
        ref="right"
        :prefix-cls="prefixCls + '-list'"
        :data="rightData"
        :render-format="rightRenderFormat"
        :checked-keys="rightCheckedKeys"
        :valid-keys-count="rightValidKeysCount"
        :list-style="listStyle"
        :title="localeTitles[1]"
        :filterable="filterable"
        :filter-placeholder="localeFilterPlaceholder"
        :filter-method="rightFilterMethod"
        :not-found-text="notFoundText"
        @on-checked-keys-change="handleRightCheckedKeysChange"
      />
    </template>
    <template v-else>
      <single-list
        :prefix-cls="prefixCls + '-list'"
        :data="data"
        :render-format="leftRenderFormat"
        :checked-keys="singleCheckedKeys"
        :valid-keys-count="leftValidKeysCount"
        :list-style="listStyle"
        :title="localeTitles[0]"
        :filterable="filterable"
        :filter-placeholder="localeFilterPlaceholder"
        :filter-method="leftFilterMethod"
        :not-found-text="notFoundText"
        @on-checked-keys-change="handleSingleCheckedKeysChange"
      />
    </template>
  </div>
</template>

<script>
import List from './list'
import SingleList from './single-list'
import Operation from './operation'

export default {
  components: {
    List,
    SingleList,
    Operation,
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    leftRenderFormat: {
      type: Function,
      default(item) {
        return item.label || item.key;
      }
    },
    rightRenderFormat: {
      type: Function,
      default(item) {
        return item.label || item.key;
      }
    },
    targetKeys: {
      type: Array,
      default() {
        return [];
      }
    },
    selectedKeys: {
      type: Array,
      default() {
        return [];
      }
    },
    listStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    titles: {
      type: Array
    },
    operations: {
      type: Array,
      default() {
        return [];
      }
    },
    filterable: {
      type: Boolean,
      default: false
    },
    filterPlaceholder: {
      type: String
    },
    leftFilterMethod: {
      type: Function,
      default(data, query) {
        const type = ('label' in data) ? 'label' : 'key';
        return (data[type].toLowerCase()).indexOf(query.toLowerCase()) > -1;
      }
    },
    rightFilterMethod: {
      type: Function,
      default(data, query) {
        const type = ('label' in data) ? 'label' : 'key';
        return (data[type].toLowerCase()).indexOf(query.toLowerCase()) > -1;
      }
    },
    notFoundText: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      prefixCls: 'ivu-transfer',
      leftData: [],
      rightData: [],
      leftCheckedKeys: [],
      rightCheckedKeys: [],
      singleCheckedKeys: [],
    };
  },
  computed: {
    leftValidKeysCount() {
      return this.getValidKeys('left').length;
    },
    rightValidKeysCount() {
      return this.getValidKeys('right').length;
    },
    localeFilterPlaceholder() {
      if (this.filterPlaceholder === undefined) {
        return this.$t('dataSource.enterParameterName');
      } else {
        return this.filterPlaceholder;
      }
    },
    localeNotFoundText() {
      if (this.notFoundText === undefined) {
        return this.$t('noData');
      } else {
        return this.notFoundText;
      }
    },
    localeTitles() {
      if (this.titles === undefined) {
        return [this.$t('dataSource.parameters'), this.$t('dataSource.selectedParameters')];
      } else {
        return this.titles;
      }
    }
  },
  watch: {
    targetKeys() {
      this.splitData(false);
    },
    data() {
      this.splitData(false);
    },
    multiple() {
      this.splitData(true);
    },
  },
  mounted() {
    this.splitData(true);
  },
  methods: {
    getValidKeys(direction) {
      return this[`${direction}Data`].filter(data => !data.disabled && this[`${direction}CheckedKeys`].indexOf(data.key) > -1).map(data => data.key);
    },
    splitData(init = false) {
      if (!this.multiple) {
        const len = this.targetKeys.length;
        this.singleCheckedKeys = len > 0 ? [this.targetKeys[len - 1]] : [];
        return;
      }
      this.leftData = [...this.data];
      this.rightData = [];
      if (this.targetKeys.length > 0) {
        this.targetKeys.forEach((targetKey) => {
          const filteredData = this.leftData.filter((data, index) => {
            if (data.key === targetKey) {
              this.leftData.splice(index, 1);
              return true;
            }
            return false;
          });
          if (filteredData && filteredData.length > 0) {
            this.rightData.push(filteredData[0]);
          }
        });
      }
      if (init) {
        this.splitSelectedKey();
      }
    },
    splitSelectedKey() {
      const selectedKeys = this.selectedKeys;
      if (selectedKeys.length > 0) {
        this.leftCheckedKeys = this.leftData.filter(data => selectedKeys.indexOf(data.key) > -1).map(data => data.key);
        this.rightCheckedKeys = this.rightData.filter(data => selectedKeys.indexOf(data.key) > -1).map(data => data.key);
      }
    },
    moveTo(direction) {
      const targetKeys = this.targetKeys;
      const opposite = direction === 'left' ? 'right' : 'left';
      const moveKeys = this.getValidKeys(opposite);
      const newTargetKeys = direction === 'right' ? moveKeys.concat(targetKeys) : targetKeys.filter(targetKey => !moveKeys.some(checkedKey => targetKey === checkedKey));
      this.$refs[opposite].toggleSelectAll(false);
      this.$emit('on-change', newTargetKeys, direction, moveKeys);
    },
    handleLeftCheckedKeysChange(keys) {
      this.leftCheckedKeys = keys;
      this.handleCheckedKeys();
    },
    handleRightCheckedKeysChange(keys) {
      this.rightCheckedKeys = keys;
      this.handleCheckedKeys();
    },
    handleCheckedKeys() {
      const sourceSelectedKeys = this.getValidKeys('left');
      const targetSelectedKeys = this.getValidKeys('right');
      this.$emit('on-selected-change', sourceSelectedKeys, targetSelectedKeys);
    },
    handleSingleCheckedKeysChange(keys) {
      this.singleCheckedKeys = keys;
      this.$emit('on-change', keys);
    },
  },
};
</script>
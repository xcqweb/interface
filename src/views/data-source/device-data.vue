<template>
  <data-column
    :title="title"
    :width="width"
  >
    <!-- 数据列表 -->
    <checkbox-group
      v-if="data && data.length > 0"
      v-model="selected"
      @on-change="handleCheckboxGroupChange"
    >
      <ul class="device-data-list">
        <li
          v-for="(item, index) in data"
          :key="index"
          :class="{active: showActive && activeIndex === index}"
          @click="handleClick(item, index)"
        >
          <checkbox
            :label="getValue(item, trueProp)"
            :true-value="getValue(item, trueProp)"
            @click.native.stop
          >
            {{ '' }}
          </checkbox>
          <Tooltip 
            v-if="item.deviceId"
            placement="right" 
            theme="light"
            class="tooltip-width-inner"
            transfer
          >
            <div slot="content">
              <p 
                style="line-height: 22px;text-align:left;white-space:normal"
              >
                设备名称:{{ item.deviceName }}
              </p>
              <p
                style="line-height: 22px;text-align:left;white-space:normal"
              >
                设备编号:{{ item.serialNumber }}
              </p>
              <p
                style="line-height: 22px;text-align:left;white-space:normal"
              >
                设备位置: {{ item.locationNamePath }}
              </p>
            </div>
            <span>{{ getValue(item, prop) }}</span>
          </Tooltip>
          <span v-if="!item.deviceId">{{ getValue(item, prop) }}</span>
        </li>
      </ul>
    </checkbox-group>
    <no-data v-else />
    <!-- 底部操作栏 -->
    <div slot="footer">
      <checkbox
        style="margin-left: 13px;"
        :indeterminate="indeterminate"
        :value="checkAll"
        :disabled="!data.length"
        @click.prevent.native="handleCheckAll"
      />
      <Button
        size="small"
        :disabled="!selected.length"
        @click="handleRemove"
      >
        {{ $t('remove') }}
      </Button>
    </div>
  </data-column>
</template>

<script>
import {CheckboxGroup, Checkbox, Button, Tooltip} from 'iview'
import deviceCommon from './js/device-common'

export default {
  components: {
    CheckboxGroup,
    Checkbox,
    Button,
    Tooltip,
  },
  mixins: [deviceCommon],
  props: {
    // checkbox true-value
    trueProp: {
      type: String,
    },
  },
  data() {
    return {
      selected: [],
      indeterminate: false,
      checkAll: false,
    };
  },
  watch: {
    data() {
      this.reset();
    },
  },
  methods: {
    handleCheckboxGroupChange(data) {
      const len = data.length;
      if (len === this.data.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (len > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        const selected = [];
        this.data.forEach(item => {
          selected.push(this.getValue(item, this.trueProp));
        });
        this.selected = selected;
      } else {
        this.selected = [];
      }
    },
    handleRemove() {
      this.$emit('remove', this.selected);
    },
    reset() {
      this.selected = [];
      this.indeterminate = false,
      this.checkAll = false;
    },
  },
};
</script>

<style lang="less">
.device-data {
  .ivu-checkbox-inner {
    width: 12px;
    height: 12px;
  }
}
.tooltip-width-inner{
  .ivu-tooltip-popper {
    .ivu-tooltip-inner-with-width{
      white-space: normal !important
    }
  }
}
</style>
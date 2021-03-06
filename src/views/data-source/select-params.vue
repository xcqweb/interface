<template>
  <Modal
    v-model="visible"
    class="devices-modal custom-modal"
    :title="title"
    :width="960"
    :mask-closable="false"
  >
    <!-- 搜索条件栏 -->
    <div
      v-show="fromText === 0"
      class="search-area"
    >
      <div class="params-item">
        <label>{{ $t('dataSource.parameterType') }}</label>
        <Cascader
          v-model="params"
          style="width: 180px;"
          :data="items"
          :not-found-text="$t('noData')"
          :clearable="false"
          change-on-select
          filterable
          transfer
        />
      </div>
    </div>
    <!-- 穿梭框 -->
    <transfer
      ref="transfer"
      class="params-transfer"
      :data="transferData"
      :target-keys="selectedItems"
      :list-style="listStyle"
      :left-render-format="leftRender"
      :right-render-format="rightRender"
      :left-filter-method="leftFilterMethod"
      :multiple="multiple"
      style="margin-top: 10px;"
      filterable
      @on-change="handleTransferChange"
    />
    <!-- 按钮 -->
    <div slot="footer">
      <Button
        size="small"
        @click="cancel"
      >
        {{ $t('cancel') }}
      </Button>
      <Button
        type="primary"
        size="small"
        @click="submit"
      >
        {{ $t('confirm') }}
      </Button>
    </div>
  </Modal>
</template>

<script>
import {Modal, Button, Cascader, Message} from 'iview'
import Transfer from './transfer/index'
import paramsCommon from './js/params-common'

export default {
  components: {
    Modal,
    Button,
    Cascader,
    Transfer,
  },
  mixins: [paramsCommon],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    // 是否可多选
    multiple: {
      type: Boolean,
      default: true,
    },
    selectedKeys: {
      type: Array,
    },
    fromText: {
      type: Number,
    },
    appId: {
      type: String,
    }
  },
  data() {
    return {
      visible: false,
      currentModelId: '',
      currentDeviceId: '',
      selectedItems: [],
      params: [],
      listStyle: {
        width: '45%',
        height: '390px',
        backgroundColor: '#fff',
      },
      deviceParamsData: null,
      virtualParamsData: null,
      applyParamsData: null,
    };
  },
  computed: {
    transferData() {
      const data = [];
      if (this.fromText === 0) {
        if (this.deviceParamsData && this.deviceParamsData.length > 0) {
          data.push(...this.deviceParamsData);
        }
        if (this.virtualParamsData && this.virtualParamsData.length > 0) {
          data.push(...this.virtualParamsData);
        }
      } else {
        if (this.applyParamsData && this.applyParamsData.length > 0) {
          data.push(...this.applyParamsData);
        }
      }
      return data;
    },
  },
  watch: {
    value() {
      this.setVisible();
    },
    visible(val) {
      if (!val) {
        this.$emit('input', val);
        this.selectedItems = [];
        this.setParams();
      }
    },
    items() {
      this.setParams();
    },
  },
  mounted() {
    this.currentModelId = this.deviceModelId || sessionStorage.getItem('modelId');
    this.setVisible();
  },
  methods: {
    getDeviceParamsCallback(res) {
      let data = null;
      if (res && res.length > 0) {
        data = {
          label: this.$t('dataSource.deviceParameter'),
          value: 'device',
          children: [],
        };
        const obj = {};
        res.forEach(item => {
          item.type = 'device'
          item.key = [item.type, item.partId, item.paramId].join('/');
          item.label = item.paramName;
          let tree;
          if (obj[item.partId]) {
            tree = obj[item.partId];
          } else {
            tree = {
              label: item.partName,
              value: item.partId,
            };
            obj[item.partId] = tree;
            data.children.push(tree);
          }
        });
      }
      this.deviceParams = data;
      this.deviceParamsData = res;
    },
    getVirtualParamsCallback(res) {
      let data = null;
      if (res && res.length > 0) {
        data = {
          label: this.$t('dataSource.virtualParamter'),
          value: 'virtual',
        };
        res.forEach(item => {
          item.type = 'virtual';
          item.key = [item.type, item.paramId].join('/');
          item.label = item.paramName;
        });
      }
      this.virtualParams = data;
      this.virtualParamsData = res;
    },
    getApplyParamsCallback(res) {
      let data = res.returnObj || []
      const newData = data.map((item) => {
        return {
          type: 'virtual',
          key: item.paramId,
          label: item.paramName,
          paramName: item.paramName,
        }
      });
      this.applyParamsData = newData
    },
    cancel() {
      this.visible = false;
    },
    submit() {
      if (this.selectedItems && this.selectedItems.length > 0) {
        const data = [];
        this.transferData.forEach(item => {
          if (this.selectedItems.includes(item.key)) {
            data.push(item);
          }
        });
        this.cancel();
        this.$emit('callback', data, this.selectedItems);
      } else {
        Message.error(this.$t('dataSource.atLeaseSelectOneItem'));
      }
    },
    leftRender(item) {
      if (this.params.length > 1) {
        return item.label;
      } else {
        return this.rightRender(item);
      }
    },
    rightRender(item) {
      let displayName = ''
      if(item.displayName) {
        displayName = `(${item.displayName})`
      }
      if (item.type === 'device') {
        return item.partName + ' / ' + item.label + displayName
      } else {
        return item.label + displayName
      }
    },
    leftFilterMethod(data, query) {
      let include = query ? (data.paramName.toLowerCase().includes(query.toLowerCase()) || (data.displayName && data.displayName.toLowerCase().includes(query.toLowerCase()))) : true;
      if (this.params[0] === 'device') {
        include = include && data.type === 'device';
        if (this.params[1]) {
          include = include && data.partId === this.params[1];
        }
      } else if (this.params[0] === 'virtual') {
        include = include && data.type === 'virtual';
      } 
      return include;
    },
    handleTransferChange(newTargetKeys) {
      this.selectedItems = newTargetKeys;
    },
    setVisible() {
      this.visible = this.value;
      if (this.visible) {
        this.currentModelId = this.deviceModelId;
        this.currentDeviceId = this.deviceId;
        if (this.fromText === 0) {
          this.getData();
        } else {
          this.getApplyData(this.fromText);
        }
        if (this.selectedKeys && this.selectedKeys.length > 0) {
          this.selectedItems.push(...this.selectedKeys);
        }
      }
    },
    setParams() {
      this.params = this.items && this.items.length > 0 ? [this.items[0].value] : [];
    },
  },
};
</script>

<style lang="less">
.params-transfer {
    .ivu-transfer-list-content-item {
        padding: 7px 8px;
        text-overflow: inherit;
    }
    
    .ivu-checkbox-wrapper {
        margin-right: 0;
    }
}
</style>
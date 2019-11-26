<template>
  <Modal
    v-model="visible"
    class="devices-modal custom-modal"
    :title="title"
    :width="720"
    :mask-closable="false"
  >
    <!-- 搜索条件栏 -->
    <div class="search-area">
      <div class="params-item">
        <label>{{ $t('dataSource.parameterType') }}</label>
        <Cascader
          v-model="params"
          style="width: 180px;"
          :data="items"
          :not-found-text="$t('noData')"
          filterable
          transfer
        />
      </div>
    </div>
    <!-- 穿梭框 -->
    <transfer
      ref="transfer"
      :data="transferData"
      :target-keys="selectedItems"
      :list-style="listStyle"
      :left-render-format="leftRender"
      :right-render-format="rightRender"
      :left-filter-method="leftFilterMethod"
      style="margin-top: 10px;"
      filterable
      @on-change="handleTransferChange"
    />
    <!-- 按钮 -->
    <div slot="footer">
      <Button
        @click="cancel"
      >
        {{ $t('cancel') }}
      </Button>
      <Button
        type="primary"
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
            default: false,
        },
        selectedKeys: {
            type: Array,
        },
    },
    data() {
        return {
            visible: false,
            currentModelId: '',
            selectedItems: [],
            params: [],
            listStyle: {
                width: '300px',
                height: '390px',
                backgroundColor: '#fff',
            },
            deviceParamsData: null,
            virtualParamsData: null,
        };
    },
    computed: {
        transferData() {
            const data = [];
            if (this.deviceParamsData && this.deviceParamsData.length > 0) {
                data.push(...this.deviceParamsData);
            }
            if (this.virtualParamsData && this.virtualParamsData.length > 0) {
                data.push(...this.virtualParamsData);
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
                this.params = [];
            }
        },
    },
    mounted() {
        this.currentModelId = this.deviceModelId;
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
            if (this.params.length > 0) {
                return item.label;
            } else {
                return this.rightRender(item);
            }
        },
        rightRender(item) {
            if (item.type === 'device') {
                return this.$t('dataSource.deviceParameter') + ' / ' + item.partName + ' / ' + item.label;
            } else {
                return this.$t('dataSource.virtualParamter') + ' / ' + item.label;
            }
        },
        leftFilterMethod(data, query) {
            let include = query ? data.paramName.includes(query) : true;
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
                if (this.currentModelId !== this.deviceModelId) {
                    this.currentModelId = this.deviceModelId;
                    this.getData();
                }
                if (this.selectedKeys && this.selectedKeys.length > 0) {
                    this.selectedItems.push(...this.selectedKeys);
                }
            }
        }
    },
};
</script>

<style>

</style>
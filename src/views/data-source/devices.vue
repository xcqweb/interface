<template>
  <Modal
    v-model="visible"
    class="devices-modal"
    :title="$t('importDataSource')"
    :width="720"
    :mask-closable="false"
  >
    <!-- 搜索条件栏 -->
    <div class="search-area">
      <div class="params-item">
        <label>{{ $t('dataSource.deviceType') }}</label>
        <Cascader
          v-model="deviceParams"
          style="width: 180px;"
          :data="deviceTypeOptions"
          :load-data="getDeviceModel"
          :not-found-text="$t('noData')"
          filterable
          transfer
          @on-change="search"
        />
      </div>
      <div class="params-item">
        <Input
          v-model.trim="keyword"
          style="width: 180px;"
          :placeholder="$t('dataSource.enterDeviceNameToSearch')"
          @keyup.native.enter="search()"
        />
      </div>
      <div class="params-item">
        <Button
          type="primary"
          @click="search()"
        >
          {{ $t('search') }}
        </Button>
        <Button
          @click="reset"
        >
          {{ $t('reset') }}
        </Button>
      </div>
    </div>
    <!-- 表格 -->
    <Table
      ref="table"
      :class="{'is-single': !multiple}"
      :data="tableData"
      :columns="columns"
      :height="374"
      :no-data-text="$t('noData')"
      @on-select="handleSelection"
      @on-select-cancel="handleSelectionCancel"
      @on-select-all="handleSelectAll"
      @on-select-all-cancel="handleSelectAll"
      @on-row-click="handleRowClick"
    />
    <!-- 分页 -->
    <Page
      :total="total"
      :current="params.current"
      :page-size="params.size"
      show-sizer
      show-elevator
      show-total
      @on-change="handlePageChange"
      @on-page-size-change="handlePageSizeChange"
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
        :loading="loading"
        @click="submit"
      >
        {{ $t('confirm') }}
      </Button>
    </div>
  </Modal>
</template>

<script>
import {Modal, Button, Cascader, Table, Page, Input, Message} from 'iview'

export default {
    components: {
        Modal,
        Button,
        Cascader,
        Input,
        Table,
        Page,
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        // 是否可多选
        multiple: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            visible: false,
            deviceTypeOptions: [],
            deviceParams: [],
            total: 0,
            keyword: '',
            params: {
                size: 10,
                current: 1,
                deviceName: '',
                deviceTypeId: '',
                deviceModelId: '',
            },
            columns: [
                {
                    type: 'selection',
                    width: 40,
                    align: 'center',
                },
                {
                    key: 'deviceName',
                    width: 220,
                    title: this.$t('dataSource.deviceName'),
                    tooltip: true,
                },
                {
                    key: 'deviceTypeName',
                    width: 206,
                    title: this.$t('dataSource.deviceType'),
                    tooltip: true,
                },
                {
                    key: 'deviceModelName',
                    width: 204,
                    title: this.$t('dataSource.deviceModel'),
                    tooltip: true,
                },
            ],
            tableData: [],
            selectedItems: [],
            loading: false,
        };
    },
    watch: {
        value(val) {
            this.visible = val;
        },
        visible(val) {
            if (!val) {
                this.$emit('input', val);
                this.reset(false);
                this.selectedItems = [];
                this.tableData = [];
                this.total = 0;
                this.params.current = 1;
            }
        },
    },
    mounted() {
        this.visible = this.value;
    },
    created() {
        this.getDeviceTypes();
    },
    methods: {
        search(value) {
            value = value || this.deviceParams;
            this.params.deviceName = this.keyword || '';
            this.params.deviceTypeId = value[0] || '';
            this.params.deviceModelId = value[1] || '';
            this.handlePageChange(1);
        },
        getDevices() {
            this.requestUtil.get('api/device/device/page', this.params).then(res => {
                if (res.records && res.records.length > 0) {
                    res.records.forEach((item, index) => {
                        item.index = index;
                    });
                }
                this.tableData = res.records || [];
                this.total = res.total || 0;
                this.selectedItems = [];
            });
        },
        getDeviceTypes() {
            this.requestUtil.get('api/device/deviceType/select').then(data => {
                let options = [];
                if (data && data.length > 0) {
                    data.forEach(item => {
                        options.push({
                            value: item.deviceTypeId,
                            label: item.deviceTypeName,
                            children: [],
                            loading: false,
                        });
                    });
                }
                this.deviceTypeOptions = options;
            });
        },
        reset(autoLoad = true) {
            this.keyword = '';
            this.deviceParams = [];
            if (autoLoad) {
                this.search();
            }
        },
        getDeviceModel(item, callback) {
            item.loading = true;
            const params = {
                deviceTypeId: item.value,
            };
            
            this.requestUtil.get('api/device/deviceModel/select', params).then(data => {
                let options = [];
                if (data && data.length) {
                    data.forEach(item => {
                        options.push({
                            value: item.deviceModelId,
                            label: item.deviceModelName,
                        });
                    });
                } else {
                    options.push({
                        value: '',
                        label: this.$t('noData'),
                        disabled: true,
                    });
                }
                item.children = options;
                item.loading = false;
                callback();
            });
        },
        handlePageChange(pageIndex) {
            this.params.current = pageIndex;
            this.getDevices();
        },
        handlePageSizeChange(pageSize) {
            this.params.size = pageSize;
            this.search();
        },
        handleRowClick(row, index) {
            if (row._disabled) {
                return;
            }
            this.$refs.table.toggleSelect(index);
        },
        handleSelection(selection, row) {
            // 只能单选时，把其他选项取消
            if (!this.multiple) {
                selection.forEach(item => {
                    if (item.index !== row.index) {
                        this.handleRowClick(item, item.index);
                    }
                });
                this.selectedItems = [row];
            } else {
                this.selectedItems = selection;
            }
        },
        handleSelectionCancel(selection) {
            if (!this.multiple) {
                this.selectedItems = [];
            } else {
                this.selectedItems = selection;
            }
        },
        handleSelectAll(selection) {
            this.selectedItems = selection;
        },
        cancel() {
            this.visible = false;
        },
        submit() {
            if (!this.selectedItems.length) {
                this.$Message.error(this.$t('dataSource.atLeaseSelectOneDevice'));
                return;
            }
            this.loading = true;
            const list = [];
            const studioId = this.myEditorUi.editor.getApplyId() || window.sessionStorage.getItem('applyId');
            this.selectedItems.forEach(item => {
                list.push({
                    studioId,
                    deviceId: item.deviceId,
                    deviceModelId: item.deviceModelId,
                    deviceTypeId: item.deviceTypeId,
                });
            });
            this.requestUtil.post('api/iot-cds/cds/configDevice', {list}).then(() => {
                this.loading = false;
                this.visible = false;
                Message.success(this.$t('dataSource.importSuccessfully'));
                this.$emit('callback');
            }).catch(() => {
                this.loading = false;
            });
        },
    },
};
</script>

<style lang="less">
.devices-modal {
  .ivu-modal-body {
    padding: 10px 24px;
  }

  .ivu-table-wrapper {
    margin: 10px 0;
    border-radius: 2px;
  }

  .ivu-table {
    th {
      height: 34px;
      color: #ccc;
      font-weight: normal;
      background:linear-gradient(0deg,rgba(216,216,216,1) 0%,rgba(228,227,228,1) 100%);
    }

    td {
      height: 34px;
    }
  }

  .ivu-table-cell {
    padding: 0 10px;
  }
  
  .is-single {
    .ivu-table-header {
      .ivu-checkbox {
          display: none;
      }
    }
  }
}
</style>
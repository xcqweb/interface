<template>
  <Modal
    v-model="visible"
    class="devices-modal import-source-model custom-modal"
    :title="$t('importDataSource')"
    :width="modelWidth"
    :mask-closable="false"
  >
    <!-- tab切换按钮 -->
    <ul class="datasource-menu">
      <li
        :class="{'active': dataType === 0}"
        @click="handleTabClick(0)"
      >
        {{ $t('device') }}
      </li>
      <li
        :class="{'active': dataType === 1}"
        @click="handleTabClick(1)"
      >
        {{ $t('predictionApply') }}
      </li>
      <li
        :class="{'active': dataType === 2}"
        @click="handleTabClick(2)"
      >
        {{ $t('statisticApply') }}
      </li>
    </ul>
    <!--主体内容-->
    <div class="datasource-body flex-full-item">
      <!-- 导入设备 -->
      <importDevice
        v-show="dataType === 0"
        ref="importDevice"
        :visible="visible"
        :data="deviceData"
        @chooseDeviceData="chooseDeviceData"
        @getStaticDataFun="staAppDataListFun"
        @getApplyDataFun="getApplyDataFun"
      />
      <!-- 导入预测应用 -->
      <Transfer
        v-show="dataType === 1"
        ref="predictionApp"
        :data="preAppDataList"
        :target-keys="targetPreAppList"
        :titles="['应用列表', '已选应用']"
        :list-style="listStyle"
        filterable
        @on-change="targetPreAppChange"
      />
      <!-- 导入统计应用 -->
      <Transfer
        v-show="dataType === 2"
        ref="predictionApp"
        :data="staAppDataList"
        :target-keys="targetStaAppList"
        :titles="['应用列表', '已选应用']"
        :list-style="listStyle"
        filterable
        @on-change="targetStaAppChange"
      />
    </div>
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
import {Modal, Button, Message, Transfer} from 'iview'
import importDevice from './importDevice'
export default {
  components: {
    Modal,
    Button,
    importDevice,
    Transfer,
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
      pageParams: {
        current: 1,
        size: 10,
      },
      params: {
        studioId: '',
        deviceName: '',
        deviceTypeId: '',
        deviceModelId: '',
      },
      deviceData: [],
      loading: false,

      dataType: 0,
      modelWidth: 950,
      listStyle: {
        width: '421px',
        height: '378px',
        backgroundColor: '#fff',
      },
      preAppDataList: [],
      targetPreAppList: [],
      staAppDataList: [],
      targetStaAppList:[],
      studioId: '',
      selectDeviceList: []
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      if (!val) {
        this.$emit('input', val);
      }
    },
  },
  created() {
    this.studioId = this.myEditorUi.editor.getApplyId() || window.sessionStorage.getItem('applyId');
  },
  methods: {
    getApplyDataFun(data) {
      this.preAppDataList = data
    },
    staAppDataListFun(data) {
      this.staAppDataList = data
    },
    /*
    * type: 1 预测应用
    * type: 2 统计应用
    */
    getApplyDataList(type) {
      const params = {
        studioId: this.studioId,
        type,
      }
      this.requestUtil.post(this.urls.newImportApp.url, params).then((res) => {
        const data = res.returnObj || []
        if (type === 1) {
          this.preAppDataList = data.map((item) => {
            return {
              key: item.appId,
              label: item.appName,
            }
          })
        } else if (type === 2) {
          this.staAppDataList = data.map((item) => {
            return {
              key: item.appId,
              label: item.appName,
            }
          })
        }
      })
    },
    targetPreAppChange(data) {
      this.targetPreAppList = data
    },
    targetStaAppChange(data) {
      this.targetStaAppList = data
    },
    handleTabClick(index) {
      this.dataType = index;
    },
    getDeviceTypes() {
      const params = {}
      params.parentId = ''
      this.requestUtil.get(this.urls.newDeviceTypeList.url, params).then(res => {
        const curData = res.data || [];
        if ( curData.length > 0 ) {
          curData.forEach( el =>{
            el.title = el.deviceTypeName;
            if ( el.hasChild === true ) {
              el.children = [];
              el.loading = false;
              el.expand = true;
            } else {
              el.expand = true;
            }
            curData[0].selected = true;
          });
          this.curNodeData = curData[0];
          this.treeData = curData;
          if ( curData[0].hasChild && curData[0].deviceTypeId && curData[0].level === 1 ) {
            this.requestUtil.get(this.urls.newDeviceTypeList.url, {parentId: curData[0].deviceTypeId}).then( re => {
              const curRedData = re.data || [];
              curRedData.forEach( el => {
                el.title = el.deviceTypeName;
                if ( el.hasChild === true ) {
                  el.children = [];
                  el.loading = false;
                  el.expand = false;
                } else {
                  el.expand = true;
                }
              });
              this.$set(this.treeData[0], 'children', curRedData);
              console.log(this.treeData[0])
            });
          }
        }
        // let options = [];
        // if (data && data.length > 0) {
        //     data.forEach(item => {
        //         options.push({
        //             value: item.deviceTypeId,
        //             label: item.deviceTypeName,
        //             children: [],
        //             loading: false,
        //         });
        //     });
        // }
        // this.deviceTypeOptions = options;
      }).catch(() => {});
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
    chooseDeviceData(data) {
      this.selectDeviceList = data
    },
    cancel() {
      this.visible = false;
      this.targetPreAppList = [];
      this.targetStaAppList = [];
    },
    submit() {

      // if (!this.selectedItems.length) {
      //     Message.error(this.$t('dataSource.atLeaseSelectOneDevice'));
      //     return;
      // }
      // this.loading = true;
      // const list = [];
      // const studioId = this.myEditorUi.editor.getApplyId() || window.sessionStorage.getItem('applyId');
      // const list = !this.selectDeviceList.length ? [] : this.selectDeviceList.map(item => {
      //   return {
      //     deviceId: item.id,
      //     deviceModelId: item.deviceModelId,
      //     deviceTypeId: item.deviceTypeId,
      //     studioId: this.studioId,
      //   }
      // });
      // this.requestUtil.post('api/iot-cds/cds/configDevice', {list}).then(() => {
      //   this.loading = false;
      //   this.visible = false;
      //   Message.success(this.$t('dataSource.importSuccessfully'));
      //   this.$emit('callback');
      // }).catch(() => {
      //   this.loading = false;
      // });
      // const allAppIds = [...this.targetPreAppList, ...this.targetStaAppList];
      if (!this.selectDeviceList.length && !this.targetPreAppList.length && !this.targetStaAppList.length) {
        Message.error(this.$t('dataSource.atLeaseSelectOneDevice'));
        return;
      }
      const targetPreAppList = this.targetPreAppList.map((item) => {
        return {
          studioId: this.studioId,
          appId: item,
          type: 1,
        }
      })
      const targetStaAppList = this.targetStaAppList.map((item) => {
        return {
          studioId: this.studioId,
          appId: item,
          type: 2,
        }
      })
      const appDataSources = [...targetPreAppList, ...targetStaAppList];
      const studioDevs = !this.selectDeviceList.length ? [] : this.selectDeviceList.map(item => {
        return {
          deviceId: item.id,
          deviceModelId: item.deviceModelId,
          deviceTypeId: item.deviceTypeId,
          studioId: this.studioId,
        }
      });
      const params = {
        appDataSources,
        studioDevs,
      }
      this.requestUtil.post(this.urls.newImportDsApi.url, params).then(() => {
        this.loading = false;
        this.visible = false;
        this.targetPreAppList = [];
        this.targetStaAppList = [];
        Message.success(this.$t('dataSource.importSuccessfully'));
        this.$emit('callback');
      }).catch(() => {
        this.loading = false;
      });

    },
  },
};
</script>

<style lang="less" scoped>
.import-source-model {
  /deep/.ivu-modal-content {
        background: #fff;
        .ivu-modal-body {
            padding: 10px 24px;
            height: 440px;
        }
  }
  .datasource-menu {
    height: 32px;
    background: none;
    border: none;
    user-select: none;
    > li {
        float: left;
        width: 66px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        transition: all .3s;
        background: #fff;
        border: 1px solid #D4D4D4;
        cursor: pointer;
        &.active {
            color: #fff;
            background-color: #3D91F7;
            border: 1px solid #3D91F7;
        }
    }
    > li:first-child{
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
        border-right: none;
    }
    > li:last-child{
       border-top-right-radius: 2px;
       border-bottom-right-radius: 2px; 
       border-left: none;
    }
  }
  .datasource-body {
    padding: 10px 0;
    height: calc(100% - 22px);
    /deep/.deviceModel-data {
        .data-column-title {
            height: 24px !important;
            line-height: 24px !important;
            color: #252525;
        }
        .data-column-body{
            background: #ffffff;
        }
    }
    /deep/.ivu-transfer{
        .ivu-transfer-list{
            padding-top: 24px;
        }
        .ivu-transfer-list-header {
            height: 24px;
            line-height: 24px;
            padding: 0 10px;
            background: linear-gradient(0deg, #d8d8d8 0%, #e4e3e4 100%);
            border-radius: 4px 4px 0 0;
        }
    }
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
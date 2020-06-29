<template>
  <div class="device-data-wrap flex-row">
    <!-- 设备分类 -> 设备类型 -->
    <div class="device-clase-wrap">
      <device-list
        class="deviceModel-data"
        :title="$t('dataSource.deviceType')"
        :width="200"
        :data="deviceTypeData"
        :search-flag="searchFlag"
        prop="deviceTypeName"
        @click="handleTypeClick"
        @chooseData="chooseData"
      />
    </div>
    <!-- 设备型号 -->
    <device-list
      class="deviceModel-data"
      :title="$t('dataSource.deviceModel')"
      :width="200"
      :data="deviceModelData"
      :search-flag="searchFlag"
      prop="deviceModelName"
      @click="handleModelClick"
    />
    <!-- 参数穿梭框 -->
    <page-transfer
      ref="chooseDevice"
      class="device-import-wrap"
      left-title="全部"
      right-title="已选"
      input-holder="请输入搜索内容"
      :api-methods="apiMethods"
      :deal-data="dealData"
      :else-params="elseParams"
      keyword="deviceName"
      params-str="deviceModelId"
      page-size-params="size"
      current-page-params="current"
      :visible.sync="visible"
      :select-datas="deviceTypesBk"
      @chooseData="chooseData"
    />
  </div>
</template>

<script>
import DeviceList from './device-list'
import PageTransfer from '@/components/page-transfer/index.vue'
import DatasourceStore from './js/datasource-store'
import VueEvent from "../../services/VueEvent.js";

export default {
  components: {
    DeviceList,
    PageTransfer,
  },
  mixins: [DatasourceStore],
  props: ['visible'],
  data() {
    return {
      pageIndex: 1,
      pageSize: 10000,
      editModelView: '',
      editModel: null,
      showForm: false,
      apiMethods: `${this.urls.newImportDeviceList.url}?current=1&size=10000`,
      elseParams: {},
      deviceTypesBk: [],
      chooseDeviceList: [],
      treeData: [],
      curNodeData: {},
      deviceModelData: [],
      deviceTypeData: [],
      studioId: '',
      preAppDataList: [],
      staAppDataList: [],
      searchFlag: true,
    };
  },
  async created() {
    this.studioId = this.myEditorUi.editor.getApplyId() || window.sessionStorage.getItem('applyId');
    // console.log(this.model)
  },
  mounted() {
    let that = this
    VueEvent.$off("getImportData")
    VueEvent.$on("getImportData", async() => {
      that.studioId = that.myEditorUi.editor.getApplyId() || window.sessionStorage.getItem('applyId');
      that.deviceTypesBk = [];
      await this.getDeviceTypes(); // 电子
      that.getApplyDataList(1);
      that.getApplyDataList(2); // 华星去掉
    });
  },

  methods: {
    getDeviceTypes() {
      this.requestUtil.get('api/device/deviceType/select').then(data => {
        if (data.length > 0) {
          this.deviceTypeData = data.map((item) => {
            return {
              deviceTypeId: item.deviceTypeId,
              deviceTypeName: item.deviceTypeName,
            }
          });
          this.curNodeData.deviceTypeId = this.deviceTypeData[0].deviceTypeId;
          this.getDeviceTemplateData();
        }
      });
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
      this.requestUtil.post(this.urls.newAppDataList.url, params).then((res) => {
        const data = res.returnObj || []
        if (type === 1) {
          this.preAppDataList = data.map((item) => {
            return {
              key: item.appId,
              label: item.appName,
            }
          })
          this.$emit('getApplyDataFun', this.preAppDataList)
        } else if (type === 2) {
          this.staAppDataList = data.map((item) => {
            return {
              key: item.appId,
              label: item.appName,
            }
          })
          this.$emit('getStaticDataFun', this.staAppDataList)
        }
        
      })
    },
    getDeviceTemplateData() {
      let deviceTypeId = this.curNodeData ? this.curNodeData.deviceTypeId : ''
      console.log(deviceTypeId)
      this.model.deviceTypeId = deviceTypeId;
      const params = {
        deviceTypeId,
        deviceModelName: '',
      }
      this.requestUtil.get(this.urls.newDeviceModelList.url, params).then(res => {
        this.deviceModelData = res.map((item) => {
          return {
            deviceModelId: item.deviceModelId,
            deviceModelName: item.deviceModelName,
          }
        })
        if (this.deviceModelData.length) {
          this.getDeviceList(this.deviceModelData[0]);
        } else {
          this.getDeviceList({deviceModelId: ''});
        }
      })
    },
    getDeviceList(data) {
      let deviceTypeId = this.curNodeData ? this.curNodeData.deviceTypeId : ''
      this.elseParams = {
        deviceModelId: data.deviceModelId,
        deviceTypeId,
        studioId: this.studioId,
      }
    },
    loadData(item, callback) {
      this.requestUtil.get(this.urls.newDeviceTypeList.url, {parentId: item.deviceTypeId}).then( re => {
        const curRedData = re.data || [];
        curRedData.forEach( el =>{
          el.title = el.deviceTypeName;
          if ( el.hasChild === true ) {
            el.children = [];
            el.loading = false;
            el.expand = false;
          }else {
            el.expand = true;
          }
        });
        callback(curRedData);
      });
    },
    renderContent(h, {node, data}) {
      return h('span', {
        class: data.selected ? 'span1 ivu-tree-title ivu-tree-title-selected' : 'span1 ivu-tree-title',
        style: {
          display: 'inline-block',
          width: '100%'
        },
        on: {
          click: () => {
            if ( !data.selected ) {
              this.curNodeData = data;
              this.getDeviceTemplateData();
              this.$refs.tree.handleSelect(node.nodeKey); // 手动选择树节点
            }
          }
        }
      }, [
        h('span', {
          class: 'span2',
        },[
          h('Icon', {
            props: {
              type: 'ios-paper-outline'
            },
            style: {
              marginRight: '8px',
            }
          }),
          h('span', data.title)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '20px'
          }
        }, [
          h('span', {
            class: 'spanShow' + data.nodeKey,
          }, data.modelNum || 0)
        ])
      ]);
    },
    dealData(item) {
      return {
        id:item.deviceId,
        name:item.deviceName,
        deviceTypeId: item.deviceTypeId,
        deviceModelId: item.deviceModelId,
        serialNumber: item.serialNumber,
        locationNamePath: item.locationNamePath,
      }
    },
    chooseData(data) {
      this.chooseDeviceList = JSON.parse(JSON.stringify(data))
      this.$emit('chooseDeviceData', this.chooseDeviceList)
    },
    handleTypeClick(item) {
      this.model.deviceTypeId = item.deviceTypeId
      this.curNodeData.deviceTypeId = item.deviceTypeId
      this.getDeviceTemplateData()
    },
    handleModelClick(item) {
      this.model.deviceModelId = item.deviceModelId;
      this.elseParams.deviceModelId = item.deviceModelId;
    },
    handleEditModel(model = null) {
      this.editModel = model;
      if (model) {
        this.editModelView = 'edit-model';
      }
    },
  },
};
</script>
<style lang="less">
.device-data-wrap {
  .device-clase-wrap{
    width: 200px;
    height: 378px;
    margin-right: 12px;
    overflow-x: hidden;
    overflow-y: auto;
    border: 1px solid #DCE5E8;
    border-radius: 4px 4px 0 0;
    background: #fff;
    .span2 {
        vertical-align: middle;
        display: inline-block;
        width: calc(100% - 55px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
  }
}
.deviceModel-data {
    height: 100%;
    .data-column-body {
        .device-data-list {
            li {
                cursor: pointer;
            }
        }
    }
}
</style>
<style lang="less">
.addmodel-btn {
  padding: 5px 10px;
  line-height: 26px;

  > a {
    display: inline-block;
    padding-left: 16px;
    color: #252525;
    background-repeat: no-repeat;
    background-position: left center;
    background-image: url('../../assets/images/leftsidebar/addpage.png');
    background-size: 16px auto;
  }
}
</style>

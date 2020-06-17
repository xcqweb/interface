<template>
  <div class="device-data-wrap flex-row">
    <!-- 设备分类 -> 设备类型 -->
    <div class="device-clase-wrap">
      <Tree 
        ref="tree" 
        :data="treeData" 
        :render="renderContent" 
        :load-data="loadData"
      />
    </div>
    <!-- 设备型号 -->
    <device-list
      class="deviceModel-data"
      :title="$t('dataSource.deviceModel')"
      :width="200"
      :data="deviceModelData"
      prop="deviceModelName"
      @click="handleTypeClick"
    />
    <!-- 参数穿梭框 -->
    <page-transfer
      ref="chooseDevice"
      left-title="全部"
      right-title="已选"
      input-holder="请输入设备名称"
      :api-methods="apiMethods"
      :deal-data="dealData"
      :else-params="elseParams"
      keyword="deviceName"
      params-str="deviceModelId"
      page-size-params="size"
      current-page-params="index"
      :visible.sync="visible"
      :select-datas="deviceTypesBk"
      @chooseData="chooseData"
    />
  </div>
</template>

<script>
import {Tree} from 'iview';
import DeviceList from './device-list'
import PageTransfer from '@/components/page-transfer/index.vue'
import DatasourceStore from './js/datasource-store'
import VueEvent from "../../services/VueEvent.js";

export default {
  components: {
    DeviceList,
    PageTransfer,
    Tree,
  },
  mixins: [DatasourceStore],
  data() {
    return {
      pageIndex: 1,
      pageSize: 10000,
      editModelView: '',
      editModel: null,
      showForm: false,
      apiMethods: `${this.urls.newImportDeviceList.url}`,
      elseParams: {},
      visible: false,
      deviceTypesBk: [],
      chooseDeviceList: [],
      treeData: [],
      curNodeData: null,
      deviceModelData: [],
      studioId: '',
    };
  },
  async created() {
    this.studioId = window.sessionStorage.getItem('applyId');
    // await this.getDeviceTypes();
    // this.getDeviceTemplateData(); // 获取型号
  },
  mounted() {
    let that = this
    VueEvent.$off("getImportData")
    VueEvent.$on("getImportData", async() => {
      console.log(123);
      that.studioId = that.myEditorUi.editor.getApplyId() || window.sessionStorage.getItem('applyId');
      that.deviceTypesBk = [];
      await this.getDeviceTypes(); // 电子
      that.getDeviceTemplateData(); // 获取型号
    });
  },

  methods: {
    getDeviceTypes() {
      const params = {}
      params.parentId = ''
      this.requestUtil.get(this.urls.newDeviceTypeList.url, {parentId: ''}).then(res => {
        const curData = res || [];
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
              const curRedData = re || [];
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
      }).catch(() => {});
    },
    getDeviceTemplateData() {
      let deviceTypeId = this.curNodeData ? this.curNodeData.deviceTypeId : ''
      if ( this.curNodeData && this.curNodeData.level === 1 ) {
        deviceTypeId = ''
      }
      this.model.deviceTypeId = deviceTypeId;
      const params = {
        deviceTypeId,
        deviceModelName: '',
        size: this.pageSize,
        current: this.pageIndex,
      }
      this.requestUtil.get(this.urls.newDeviceTemplateLIST.url, params).then(res => {
        this.deviceModelData = res.records.map((item) => {
          return {
            deviceModelId: item.deviceModelId,
            deviceModelName: item.deviceModelName,
          }
        })
        if (this.deviceModelData.length) {
          this.getDeviceList(this.deviceModelData[0]);
        }
                
      })
    },
    getDeviceList(data) {
      let deviceTypeId = this.curNodeData ? this.curNodeData.deviceTypeId : ''
      this.$set(this.elseParams, 'deviceModelId', data.deviceModelId)
      this.$set(this.elseParams, 'deviceTypeId', deviceTypeId)
      this.$set(this.elseParams, 'studioId', this.studioId)
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
      }
    },
    chooseData(data) {
      this.chooseDeviceList = JSON.parse(JSON.stringify(data));
      this.$emit('chooseDeviceData', this.chooseDeviceList)
    },
    handleTypeClick(item) {
      this.model.deviceModelId = item.deviceModelId;
      this.$set(this.elseParams, 'deviceModelId', item.deviceModelId);
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

<template>
  <div class="newfooter-wraper">
    <div>
      <div class="title-tabs">
        <div class="Collapse-title-wrap">
          <div class="Collapse-title-left">
            <Tabs
              type="card"
              :animated="false"
              @on-click="switchTabHandle"
            >
              <TabPane 
                v-if="!$store.state.main.isTemplateApply" 
                :label="$t(dataSourceName[0])"
              />
              <TabPane
                :label="$t(dataSourceName[1])"
              />

              <TabPane :label="$t(dataSourceName[2])" />
            </Tabs>
          </div>
          <div
            v-if="tabsNum == 1 && deviceModelId && footerContent && ifShowDataFlag || tabsNum ==0 && $store.state.main.isTemplateApply && footerContent && ifShowDataFlag"
            style="margin-right:20px;cursor:pointer;"
            @click="addParam"
          >
            <span class="icon-add" />{{ $t("footBar.addParam") }}
          </div>
          <div
            class="Collapse-title-right"
            :class="ifShowArrow ? 'collapse-active' : ''"
            @click="ifShowArrow = !ifShowArrow"
          >
            <img src="../../assets/images/footer/foot-collapse.png">
          </div>
        </div>
      </div>
      <div
        v-show="ifShowArrow"
        class="footer-content"
      >
        <div v-if="footerContent">
          <!--数据源-->
          <div
            v-show="tabsNum === 0 && !$store.state.main.isTemplateApply"
            class="footer-common dataSourceList"
          >
            <template>
              <Table
                border
                :columns="tablTitles"
                :data="dataSourceList"
                :max-height="heightlen"
              >
                <template
                  slot="actions"
                  slot-scope="{ row, index }"
                >
                  <span
                    class="icon-delete"
                    @click.stop.prevent="deleteFooterHandle(row, index)"
                  />
                </template>
              </Table>
            </template>
          </div>
          <!--数据显示-->
          <div
            v-show="tabsNum === 1 && ifShowDataFlag && dataSourceList.length || tabsNum == 0 && $store.state.main.isTemplateApply && ifShowDataFlag"
            class="footer-common dataDisplayList"
          >
            <Table
              border
              class="dataShowHide"
              :columns="tabParamTitles"
              :data="paramOutterList"
              :max-height="heightlen"
            >
              <template
                slot="paramType"
                slot-scope="{ row }"
              >
                {{
                  row.paramType == "device"
                    ? $t("footBar.deviceParam")
                    : $t("footBar.virtualParam")
                }}
              </template>
              <template
                slot="paramShow"
                slot-scope="{ row }"
              >
                <Checkbox
                  v-model="row.type"
                  @on-change="val => paramDefaultChange(val, row.key)"
                >
                  {{ $t("footBar.defaultDisplay") }}
                </Checkbox>
              </template>
              <template
                slot="actions"
                slot-scope="{ index }"
              >
                <span
                  v-show="paramOutterList.length"
                  class="icon-delete"
                  @click.stop.prevent="removeParamHandle(index)"
                />
              </template>
            </Table>
          </div>
          <!--状态模型-->
          <div
            v-show="tabsNum === 2 || tabsNum==1 && $store.state.main.isTemplateApply"
            class="footer-common stateList"
          >
            <div
              v-if="stateList && stateList.length > 1 && cellsCount == 1"
              class="footerTabs2Ul"
            >
              <template v-for="(item, index) in stateList">
                <div
                  v-if="item.id != 'state_0'"
                  :key="index"
                >
                  <div class="footerTabs2-list-wrap">
                    <span class="footerTabs2-list-top">{{ item.name }}</span>
                    <span class="footerTabs2-list-content">
                      <Select
                        v-model="modelVals[index]"
                        style="width:240px;height:24px;line-height:24px;"
                        :clearable="true"
                        @on-change="val => modelSelectChange(val, index)"
                        @on-clear="clearStateBtn(index)"
                      >
                        <Option
                          v-for="(d, i) in modelList"
                          :key="i"
                          :value="i"
                        >
                          {{ d.modelName }}
                        </Option>
                      </Select>
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <NoData
          v-if="
            !footerContent ||
              (tabsNum === 2 && cellsCount != 1) ||
              (tabsNum === 2 && cellsCount == 1 && stateList.length <= 1) ||
              (tabsNum === 1 && (!ifShowDataFlag || !dataSourceList.length))
          "
          :text="$t(nodata)"
        />
      </div>
    </div>
    <SelectParams
      v-model="visible"
      :title="$t('footBar.addParam')"
      :device-model-id="deviceModelId"
      :device-id="deviceId"
      :multiple="multiple"
      @callback="addParamDone"
    />
  </div>
</template>

<script>
import {Tabs, TabPane, Table, Select, Option, Checkbox,Message} from "iview";
import {mxUtils} from "../../services/mxGlobal";
import NoData from "../data-source/nodata";
import VueEvent from "../../services/VueEvent.js";

import {sureDialog} from "../../services/Utils";
const allShapes = [
  "image",
  "userimage",
  "tableCell",
  "rectangle",
  "ellipse",
  "light",
  "progress",
  "lineChart",
  "gaugeChart",
  'triangle',
  'pentagram'
]; //可以绑定数据的控件
const supportDataShow = [
  "rectangle",
  "ellipse",
  "tableCell",
  "progress",
  "lineChart",
  "gaugeChart",
  'triangle',
  'pentagram'
]; // 支持显示参数
export default {
  components: {
    Tabs,
    TabPane,
    Table,
    Select,
    Option,
    NoData,
    Checkbox,
    SelectParams: resolve => {
      return require(["../data-source/select-params"], resolve);
    }
  },
  data() {
    return {
      visible: false,
      multiple:true,
      value1: "1",
      dataSourceName: [
        "dataSources",
        "footBar.dataDisplay",
        "footBar.stateModel"
      ],
      singleParamShow: ["progress", "lineChart", "gaugeChart"],
      ifShowArrow: false,
      tabsNum: 0,
      deviceModelId: null,
      deviceId: null,
      nodata: "noData",
      tablTitles: [
        {
          title: this.$t("deviceName"),
          key: "deviceName"
        },
        {
          title: this.$t("deviceType"),
          key: "typeName"
        },
        {
          title: this.$t("deviceModal"),
          key: "modelName"
        },
        {
          title: this.$t("operation"),
          width: "160",
          slot: "actions",
          key: "actions"
        }
      ],
      dataSourceList: [],
      heightlen: "190",
      paramOutterList: [],
      stateList: [],
      modelList: [],
      footerContent: false,
      modelVals: [], //状态列表下的每个模型列表当前的v-model
      isInitFlag: false,
      ifShowDataFlag: true, // 判断是否显示数据显示tab
      tabParamTitles: [
        {
          title: this.$t("footBar.paramName"),
          key: "paramName"
        },
        {
          title: this.$t("footBar.paramType"),
          slot: "paramType",
          key: "paramType"
        },
        {
          title: this.$t("footBar.belongPart"),
          key: "partName"
        },
        {
          title: this.$t("footBar.defaultDisplay"),
          slot: "paramShow"
        },
        {
          title: this.$t("operation"),
          width: "160",
          slot: "actions"
        }
      ]
    };
  },
  computed: {
    shapeName() {
      let shape = null
      let shapeInfo = this.$store.state.main.widgetInfo.shapeInfo
      if (shapeInfo) {
        shape = shapeInfo.shape
      }
      return shape
    },
    footerModelUpdata() {
      return this.$store.state.main.footerModelUpdata
    },
    cellsCount() {
      return this.$store.state.main.widgetInfo.cellsCount
    },
  },
  watch: {
    ifShowArrow(val) {
      this.dealFootbarHeight(val)
    },
    footerModelUpdata(val) {
      if (val) {
        this.isInitFlag = false
        this.initData()
        this.$store.commit("footerModelUpdata", false)
      }
    },
    shapeName(val) {
      if(val == 'progress') {
        this.multiple = false
      }
    }
  },
  mounted() {
    if (this.footerContent) {
      this.initData()
    }
    VueEvent.$off("rightBarTabSwitch")
    VueEvent.$off("isShowFootBar")
    VueEvent.$off("emitDataSourceFooter")
    VueEvent.$on("isShowFootBar", ({show, isUp}) => {
      this.isInitFlag = false;
      this.footerContentHandle(show);
      if (show) {
        this.initData()
      }
      if (isUp) {
        this.ifShowArrow = isUp
      }
    });
    VueEvent.$on("rightBarTabSwitch", () => {
      this.ifShowArrow = false;
      // 隐藏右键菜单 防止到数据源页面 还会有
      document.getElementById("pageContextMenu")
        ? (document.getElementById("pageContextMenu").style.display = "none")
        : null;
    });
    // 绑定数据源
    VueEvent.$on("emitDataSourceFooter", value => {
      this.setCellModelInfo("bindData", {dataSource: value})
      if (this.shapeName === "lineChart") {
        this.dealDeviceParamIds()
      }
      if (this.ifShowArrow) {
        this.isInitFlag = false;
        this.initData();
      }
    });
  },
  methods: {
    initData() {
      if (this.isInitFlag) {
        return;
      }
      //初始化状态列表
      let tempStateList = this.getCellModelInfo("statesInfo")
      if (tempStateList) {
        this.stateList = tempStateList
      } else {
        this.stateList = []
      }
      this.dataSourceList = []
      this.initDataSource() //初始化数据源列表
      this.initModelList() //初始化模型列表
      this.initParamsList() //初始化参数列表
      this.isInitFlag = true
    },
    dealFootbarHeight(val) {
      if (val) {
        this.myEditorUi.footerHeight = 226
      } else {
        this.myEditorUi.footerHeight = 26
      }
      if (this.$store.state.main.type === 1) {
        VueEvent.$emit("refreshDialogTitle")
      }
      this.myEditorUi.refresh()
    },
    // 初始化数据源数据
    initDataSource() {
      let startBindData = this.getCellModelInfo("bindData")
      if (startBindData && startBindData.dataSource) {
        console.log(startBindData)
        let deviceNameChild = startBindData.dataSource.deviceNameChild
        this.deviceModelId = startBindData.dataSource.deviceModel.id
        this.dataSourceList = []
        if (deviceNameChild && !Array.isArray(deviceNameChild)) {
          deviceNameChild = [deviceNameChild]
        }
        if(deviceNameChild) {
          deviceNameChild.forEach(item => {
            let obj = {}
            obj.typeName = startBindData.dataSource.deviceTypeChild.name
            obj.deviceName = item.name
            obj.deviceId = item.id
            obj.modelName = startBindData.dataSource.deviceModel.name
            this.dataSourceList.push(obj)
          })
        }
      } else {
        this.deviceModelId = null
        this.dataSourceList = []
      }
    },
    initModelList() {
      //模型列表
      this.modelVals.splice(0);
      if (this.deviceModelId) {
        let objData = {
          studioId: sessionStorage.getItem("applyId"),
          deviceModelId: this.deviceModelId
        };
        if (!objData.deviceModelId) {
          return;
        }
        console.log('entry')
        this.requestUtil.post(this.urls.getModelList.url, objData).then(res => {
          if (res.returnObj) {
            this.modelList = res.returnObj
            this.dealStateListInit()
          }
        });
      } else {
        this.modelList = []
        this.stateList = []
      }
    },
    dealStateListInit() {
      this.stateList = this.getCellModelInfo("statesInfo") || []
      this.stateList.forEach((item, index) => {
        if (item.modelFormInfo) {
          //如果状态绑定的有公式，就选中该项公式
          let modelIndex = this.modelList.findIndex(model => {
            return item.modelFormInfo == model.sourceId
          });
          if (modelIndex != -1) {
            this.$set(this.modelVals, index, modelIndex)
          }
        }
      })
    },
    initParamsList() {
      let tempObj = this.getCellModelInfo("bindData")
      if (tempObj && tempObj.params) {
        this.paramOutterList = tempObj.params
      } else {
        this.paramOutterList = []
      }
    },
    addParam() {
      let startBindData = this.getCellModelInfo("bindData")
      if(this.$store.state.main.isTemplateApply) {
        this.deviceModelId = sessionStorage.getItem('modelId')
        let temp = {dataSource:{}}
        temp.dataSource.deviceModel = {id:this.deviceModelId,name:'-'}
        this.setCellModelInfo("bindData",temp)
      } else {
        let deviceNameChild = startBindData.dataSource.deviceNameChild
        if (!Array.isArray(deviceNameChild)) {
          deviceNameChild = [deviceNameChild]
        }
        this.deviceId = deviceNameChild[0].id          
      }
      this.visible = true
    },
    addParamDone(data) {
      let isFirstCheck = false
      if (this.paramOutterList && !this.paramOutterList.length) {
        isFirstCheck = true
      }
      let allKeys = []
      this.paramOutterList.forEach(item => {
        allKeys.push(item.key)
      })
      data.forEach(item => {
        if (!allKeys.includes(item.key)) {
          let tempObj = {
            paramName: item.paramName,
            paramId: item.paramId,
            paramType: item.type,
            partName: item.partName,
            key: item.key,
            partId:item.partId,
            transportSourceId: item.transportSourceId,
            deviceParamId: item.deviceParamId,
            type: false
          }
          if(this.multiple) {
            this.paramOutterList.push(tempObj)
          }else{
            this.paramOutterList = [tempObj]
          }
        }
      })
      if (isFirstCheck) {
        this.paramOutterList[0].type = true
      }
      if (this.shapeName === "lineChart") {
        this.dealDeviceParamIds()
      }
      let tempObj = this.getCellModelInfo("bindData")
      tempObj.params = this.paramOutterList
      this.setCellModelInfo("bindData", tempObj)
    },
    dealDeviceParamIds() {
      let generateParams = []
      let startBindData = this.getCellModelInfo("bindData")
      let devices = startBindData.dataSource.deviceNameChild
      if(!Array.isArray(devices)) {
        devices = [devices]
      }
      devices.forEach(device => {
        this.paramOutterList.forEach(p => {
          generateParams.push({
            paramType: p.paramType == 'device' ? 0 : 1,
            deviceId: device.id,
            partId: p.partId,
            paramId: p.paramId
          })
        })
      })
      if(!generateParams.length) {
        return
      }
      this.requestUtil.post(this.urls.deviceParamGenerate.url,generateParams).then((res)=>{
        let resParam = [],maps = new Map()
        res.forEach(item=>{
          let tempArr = []
          if (maps.has(item.deviceId)) {
            tempArr =  maps.get(item.deviceId)
            tempArr.push(item.deviceParamId)
            maps.set(item.deviceId,Array.from(new Set(tempArr)))
          }else{
            maps.set(item.deviceId, [item.deviceParamId])
          }
        })
        for (let key of maps.keys()) {
          resParam.push({
            deviceId:key,
            params:maps.get(key)
          })
        }
        if(resParam.length) {
          let tempObj = this.getCellModelInfo("bindData")
          tempObj.subParams = resParam
          this.setCellModelInfo("bindData", tempObj)
        }
      })
    },
    removeParamHandle(index) {
      sureDialog(
        this.myEditorUi,
        this.$t("footBar.sureDelCurrentParam"),
        () => {
          this.paramOutterList.splice(index, 1)
          let tempObj = this.getCellModelInfo("bindData")
          tempObj.params = this.paramOutterList
          this.setCellModelInfo("bindData", tempObj)
          if (this.shapeName === "lineChart") {
            this.dealDeviceParamIds()
          }
        }
      );
    },
    paramDefaultChange(val, key) {
      this.paramOutterList.forEach(item => {
        if (item.key == key) {
          item.type = !item.type 
        } else {
          item.type = false
        }
      })
      if(this.shapeName.includes('Chart')) {
        let flag = true
        for(let i = 0;i < this.paramOutterList.length;i++) {
          if(this.paramOutterList[i].type === true) {
            flag = false
          }
        }
        if(flag) {
          Message.warning(`${this.$t('rightBar.atLeastChooseOneParam')}`)
          return
        }
      }
      let tempObj = this.getCellModelInfo("bindData")
      tempObj.params = this.paramOutterList;
      this.setCellModelInfo("bindData", tempObj)
    },
    modelSelectChange(modelIndex, stateIndex) {
      //将模型公式绑定在对应的状态上
      if (!modelIndex && modelIndex !== 0) {
        return;
      }
      let currentModel = this.modelList[modelIndex];
      this.stateList[stateIndex].modelFormInfo = currentModel.sourceId;
      this.setCellModelInfo("statesInfo", [...this.stateList]);
    },
    clearStateBtn(pos) {
      let tempStateList = this.getCellModelInfo("statesInfo")
      for(let i = 0;i < tempStateList.length;i++) {
        if(i === pos) {
          tempStateList[i].modelFormInfo = null
          break
        }
      }
      this.setCellModelInfo("statesInfo", tempStateList)
      this.dealStateListInit()
    },
    footerContentHandle(show) {
      if (show) {
        if (supportDataShow.includes(this.shapeName)) {
          // 数据显示tab 是否展示
          this.ifShowDataFlag = true;
        } else {
          this.ifShowDataFlag = false;
        }
        if (allShapes.includes(this.shapeName)) {
          this.footerContent = true;
        } else {
          this.footerContent = false;
        }
      } else {
        this.footerContent = false;
      }
    },
    switchTabHandle(type) {
      this.tabsNum = +type;
      if (!this.ifShowArrow) {
        this.ifShowArrow = true;
      }
    },
    deleteFooterHandle(data, index) {
      let startBindData = this.getCellModelInfo("bindData")
      sureDialog(
        this.myEditorUi,
        `${this.$t("footBar.sureDelDataSources")}-${data.deviceName}?`,
        () => {
          if(this.dataSourceList.length === 1) {
            startBindData = null
            this.clearStateModel() //清空状态里面的模型
            this.dataSourceList = []
            this.paramsList = []
            this.stateList = []
            this.modelList = []
            this.deviceModelId = null
          }else{
            let devices = startBindData.dataSource.deviceNameChild
            let resDevices = devices.filter(item=>{
              if(this.dataSourceList[index].deviceId) {
                return item.id != this.dataSourceList[index].deviceId
              }
              return item.name != this.dataSourceList[index].deviceName
            })
            startBindData.dataSource.deviceNameChild = resDevices
            if (this.shapeName === "lineChart") {
              this.dealDeviceParamIds()
            }
          }
          this.setCellModelInfo("bindData", startBindData)
          this.dataSourceList.splice(index, 1)
        }
      );
    },
    clearStateModel() {
      let tempStateList = this.getCellModelInfo("statesInfo") || [];
      tempStateList.forEach(item => {
        if (item.modelFormInfo) {
          item.modelFormInfo = null;
        }
      });
      this.setCellModelInfo("statesInfo", tempStateList);
    },
    getCellModelInfo(key, cell) {
      let graph = this.myEditorUi.editor.graph;
      if (!cell) {
        cell = graph.getSelectionCell();
      }
      let modelInfo = graph.getModel().getValue(cell);
      let bindData = null;
      if (!mxUtils.isNode(modelInfo)) {
        let doc = mxUtils.createXmlDocument();
        let obj = doc.createElement("object");
        obj.setAttribute("label", modelInfo || "");
        modelInfo = obj;
      }
      if (modelInfo) {
        let bindAttr = modelInfo.getAttribute(key);
        if (bindAttr) {
          bindData = JSON.parse(bindAttr);
        }
      }
      return bindData;
    },
    setCellModelInfo(key, data, cell) {
      let graph = this.myEditorUi.editor.graph;
      if (!cell) {
        cell = graph.getSelectionCell();
      }
      let modelInfo = graph.getModel().getValue(cell);
      if (!mxUtils.isNode(modelInfo)) {
        let doc = mxUtils.createXmlDocument();
        let obj = doc.createElement("object");
        obj.setAttribute("label", modelInfo || "");
        modelInfo = obj;
      }
      modelInfo.setAttribute(key, JSON.stringify(data));
      graph.getModel().setValue(cell, modelInfo);
      if (key == "statesInfo") {
        VueEvent.$emit("refreshStates");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.newfooter-wraper {
  position: absolute;
  left: 209px;
  right: 250px;
  bottom: 0;
  z-index: 100;
  background: #fff;
  .icon-add {
    width: 20px;
    height: 20px;
    background: url("../../assets/images/leftsidebar/addpage.png") no-repeat
      center center;
    background-size: 16px 16px;
    display: inline-block;
    cursor: pointer;
    vertical-align: middle;
  }
  .Collapse-title-wrap {
    background: #f2f2f2;
    width: 100%;
    display: flex;
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    border-right: 1px solid rgb(204, 204, 204);
    .Collapse-title-left {
      flex: 1;
    }
    .Collapse-title-right {
      width: 25px;
      height: 24px;
      line-height: 24px;
      cursor: pointer;
      img {
        display: block;
        height: 16px;
        width: 16px;
        margin: 4px auto;
      }
      &.collapse-active {
        transform: rotate(180deg);
      }
    }
    /deep/.ivu-tabs {
      .ivu-tabs-nav {
        height: 24px;
        overflow: hidden;
      }
      height: 24px;
      .ivu-tabs-tab {
        height: 24px;
        line-height: 24px;
        padding: 0px 16px;
        margin-right: 0px;
        border: none;
      }
    }
  }
  .footer-content {
    height: 200px;
    background: #f2f2f2;
    border-right: 1px solid rgb(204, 204, 204);
    .footer-common {
      padding: 5px;
      .ivu-table-wrapper {
        border-right: none;
        overflow: visible;
        /deep/.ivu-table-header {
          height: 24px;
          line-height: 24px;
          th {
            height: 24px;
            background: #ffffff;
            border-right: none;
            color: #252525;
            font-weight: 400;
          }
        }
        /deep/.ivu-table-tbody {
          tr {
            td {
              height: 24px;
              border-right: none;
              background: #f2f2f2;
            }
            &.ivu-table-row-hover {
              td {
                background: #d9e6f6;
              }
            }
          }
        }
        /deep/.ivu-table-tip {
          td {
            background: #f2f2f2;
          }
        }
      }
      .icon-delete {
        width: 20px;
        height: 20px;
        background: url("../../assets/images/datasource/delete.png") no-repeat
          center center;
        background-size: 16px 16px;
        display: inline-block;
        cursor: pointer;
        vertical-align: middle;
      }
      /deep/.ivu-select {
        .ivu-select-selection {
          height: 24px;
        }
        .ivu-select-placeholder {
          height: 24px;
          line-height: 24px;
        }
        .ivu-select-input {
          height: 24px;
          line-height: 24px;
        }
        .ivu-select-selected-value {
          height: 24px;
          line-height: 22px;
        }
        .ivu-select-dropdown {
          .ivu-select-dropdown-list {
            .ivu-select-item {
              padding: 0 16px 0;
              margin-bottom: 0;
            }
          }
        }
      }
      /deep/.ivu-table {
        &::before {
          height: 0px;
        }
        &::after {
          width: 0px;
        }
      }
      .footerTabs2Ul {
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        div {
          flex: 1;
          margin-bottom: 10px;
          .footerTabs2-list-wrap {
            display: flex;
            height: 44px;
            flex-direction: column;
            .footerTabs2-list-top {
              height: 20px;
              padding-left: 4px;
            }
            .footerTabs2-list-content {
              flex: 1;
            }
          }
        }
      }
      &.dataDisplayList {
        .dataShowHide {
          /deep/.ivu-table {
            /deep/.ivu-table-body {
              .ivu-table-tbody {
                tr {
                  height: 35px;
                }
                /deep/.ivu-checkbox-inner {
                  &:after {
                    top: 2px !important;
                    left: 5px !important;
                  }
                }
              }
            }
          }
        }
      }
    }
    .no-data-wrap {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .no-data {
        margin-top: 0px;
      }
    }
  }
}
</style>

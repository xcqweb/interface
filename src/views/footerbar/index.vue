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
                :label="$t(dataSourceName[0])"
              />
              <TabPane
                :label="$t(dataSourceName[1])"
              />
              <TabPane
                :label="$t(dataSourceName[2])"
              />
            </Tabs>
          </div>
          <div
            v-if="tabsNum==1 && deviceModelId && footerContent"
            style="margin-right:20px;cursor:pointer;"
            @click="addParam"
          >
            <span class="icon-add" />{{ $t('footBar.addParam') }}
          </div>
          <div 
            class="Collapse-title-right"
            :class="ifShowArrow ? 'collapse-active' : ''"
            @click="ifShowArrow=!ifShowArrow"
          >
            <img src="../../assets/images/footer/foot-collapse.png">
          </div>
        </div>
      </div>
      <div 
        v-show="ifShowArrow"
        class="footer-content"
      >
        <div 
          v-if="footerContent"
        >
          <!--数据源-->
          <div
            v-show="tabsNum === 0"
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
                    @click.stop.prevent="deleteFooterHandle(row,index)"
                  />
                </template>
              </Table>
            </template>
          </div>
          <!--数据显示-->
          <div
            v-show="tabsNum === 1 && ifShowDataFlag && dataSourceList.length"
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
                slot-scope="{row}"
              >
                {{ row.paramType == 'device' ? $t('footBar.deviceParam') : $('footBar.virtualParam') }}
              </template>
              <template
                slot="paramShow"
                slot-scope="{row}"
              >
                <Checkbox
                  v-if="!singleParamShow.includes(shapeName)"
                  v-model="row.type"
                  @on-change="val=>paramDefaultChange(val,row.paramId)"
                >
                  {{ $t('footBar.defaultDisplay') }}
                </Checkbox>
                <Checkbox
                  v-else
                  :value="true"
                  disabled
                />
              </template>
              <template
                slot="actions"
                slot-scope="{index}" 
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
            v-show="tabsNum === 2"
            class="footer-common stateList"
          >
            <div
              v-if="stateList && stateList.length > 1 && cellsCount==1"
              class="footerTabs2Ul"
            >
              <template v-for="(item,index) in stateList">
                <div
                  v-if="item.id!='state_0'"
                  :key="index"
                >
                  <div
                    class="footerTabs2-list-wrap"
                  >
                    <span class="footerTabs2-list-top">{{ item.name }}</span>
                    <span class="footerTabs2-list-content">
                      <Select
                        v-model="modelVals[index]"
                        style="width:240px;height:24px;line-height:24px;"
                        :clearable="true"
                        @on-change="(val)=>modelSelectChange(val,index)"
                        @on-clear="clearStateBtn(index)"
                      > 
                        <Option 
                          v-for="(d,i) in modelList" 
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
          v-if="!footerContent || (tabsNum === 2 && cellsCount!=1 || tabsNum === 2 && cellsCount==1 && stateList.length <= 1) || (tabsNum === 1 && (!ifShowDataFlag || !dataSourceList.length))"
          :text="$t(nodata)"
        />
      </div>
    </div>
    <SelectParams
      v-model="visible"
      :title="$t('addParam')"
      :device-model-id="deviceModelId"
      :device-id="deviceId"
      :multiple="multiple"
      @callback="addParamDone"
    />
  </div>
</template>

<script>
import {Tabs,TabPane, Table,Select, Option, Message,Checkbox} from 'iview'
import {mxUtils} from '../../services/mxGlobal'
import NoData from '../data-source/nodata'
import VueEvent from '../../services/VueEvent.js'

import {sureDialog} from '../../services/Utils'
const allShapes = ['image','userimage','tableCell','rectangle','ellipse','light','progress','lineChart','gaugeChart','tableBox'] //可以绑定数据的控件
const supportDataShow = ['rectangle','ellipse','tableCell','progress','lineChart', 'gaugeChart']// 支持显示参数
export default {
    components:{
        Tabs,
        TabPane,
        Table,
        Select,
        Option,
        NoData,
        Checkbox,
        SelectParams: (resolve) => {
            return require(['../data-source/select-params'], resolve)
        },
    },
    data() {
        return {
            visible:false,
            value1: '1',
            dataSourceName:['dataSources','footBar.dataDisplay','footBar.stateModel'],
            singleParamShow:['progress','lineChart', 'gaugeChart'],
            ifShowArrow: false,
            tabsNum: 0,
            deviceModelId:null,
            deviceId:null,
            nodata: 'noData',
            multiple:true,
            tablTitles:[
                {
                    title: this.$t('deviceName'),
                    key: 'deviceName'
                },
                {
                    title: this.$t('deviceType'),
                    key: 'typeName'
                },
                {
                    title: this.$t('deviceModal'),
                    key: 'modelName'
                },
                {
                    title: this.$t('operation'),
                    width: '160',
                    slot: 'actions',
                    key: 'actions',
                }
            ],
            dataSourceList: [],
            heightlen: '190',
            paramOutterList: [],
            stateList:[],
            modelList:[],
            footerContent: false,
            modelVals:[],//状态列表下的每个模型列表当前的v-model
            isInitFlag: false,
            ifShowDataFlag: true, // 判断是否显示数据显示tab
            tabParamTitles:[
                {
                    title: this.$t('footBar.paramName'),
                    key: 'paramName',
                },
                {
                    title:this.$t('footBar.paramType'),
                    slot: 'paramType',
                    key:'paramType',
                },
                {
                    title:this.$t('footBar.belongPart'),
                    key: 'partName'
                },
                {
                    title: this.$t('footBar.defaultDisplay'),
                    slot: 'paramShow'
                },
                {
                    title: this.$t('operation'),
                    width: '160',
                    slot: 'actions',
                },
            ],
        }
    },
    computed: {
        shapeName() {
            let shape = null
            let shapeInfo = this.$store.state.main.widgetInfo.shapeInfo
            if(shapeInfo) {
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
        selectedKeys() {
            let res = []
            this.paramOutterList.forEach(item=>{
                res.push(item.key)
            })
            return res
        }
    },
    watch:{
        ifShowArrow(val) {
            this.dealFootbarHeight(val)
        },
        footerModelUpdata(val) {
            if (val) {
                this.isInitFlag = false
                this.initData()
                this.$store.commit('footerModelUpdata', false)
            }
        }
    },
    mounted() {
        if(this.footerContent) {
            this.initData()
        }
        window.onresize = ()=>{
            if(this.ifShowArrow) {
                this.ifShowArrow = false
            }
        }
        VueEvent.$off('rightBarTabSwitch')
        VueEvent.$off('isShowFootBar')
        VueEvent.$off('emitDataSourceFooter')
        VueEvent.$on('isShowFootBar', ({show,isUp}) => {
            this.isInitFlag = false
            this.footerContentHandle(show)
            if(show) {
                this.initData()
            }
            if (isUp) {
                this.ifShowArrow = isUp
            }
        })
        VueEvent.$on('rightBarTabSwitch',() => {
            this.ifShowArrow = false
            // 隐藏右键菜单 防止到数据源页面 还会有
            document.getElementById('pageContextMenu') ?  document.getElementById('pageContextMenu').style.display = 'none' : null
        })
        // 绑定数据源
        VueEvent.$on('emitDataSourceFooter', (value) => {
            // 拿到之前绑定的 bindData
            let startBindData = this.getCellModelInfo('bindData')
            if (!startBindData || !startBindData.dataSource) {
                this.setCellModelInfo('bindData',{dataSource:value})
                if (this.ifShowArrow) {
                    this.isInitFlag = false
                    this.initData()
                }
            } else {
                if (this.checkDetDataModel(startBindData, value)) { // 不存在重复的
                    startBindData.dataSource.deviceNameChild = value.deviceNameChild
                    startBindData.dataSource.deviceTypeChild = value.deviceTypeChild
                    startBindData.dataSource.deviceModel = value.deviceModel
                    this.setCellModelInfo('bindData',startBindData)
                    if (this.ifShowArrow) {
                        this.isInitFlag = false
                        this.initData()
                    }
                } 
            }
        })
    },
    methods:{
        initData() {
            if (this.isInitFlag) {
                return
            }
            //初始化状态列表
            let tempStateList = this.getCellModelInfo("statesInfo")
            if(tempStateList) {
                this.stateList = tempStateList
            }else{
                this.stateList = []
            }
            this.dataSourceList = []
            this.initDataSource()//初始化数据源列表
            this.initModelList()//初始化模型列表
            this.initParamsList()//初始化参数列表
            this.isInitFlag = true
           
        },
        dealFootbarHeight(val) {
            let graph = this.myEditorUi.editor.graph
            let el = document.querySelector(".geDiagramContainer.geDiagramBackdrop")
            let wh = document.documentElement.clientHeight
            let dialogTitleEle = document.querySelector('.dialog-title-m')
            let dialogTop = 0
            if(dialogTitleEle) {
                dialogTop = dialogTitleEle.offsetTop
            }
            if(val) {
                el.style.height = wh - 72 - 226 + 'px'
                if(dialogTitleEle) {
                    dialogTitleEle.style.top = dialogTop - 200 + 'px'
                }
            }else{
                el.style.height = wh - 72 - 26 + 'px'
                if(dialogTitleEle) {
                    dialogTitleEle.style.top = dialogTop + 200 + 'px'
                }
            }
            graph.refresh()
        },
        // 初始化数据源数据
        initDataSource() {
            let startBindData = this.getCellModelInfo('bindData')
            if (startBindData && startBindData.dataSource) {
                let deviceNameChild = startBindData.dataSource.deviceNameChild
                this.deviceModelId  = startBindData.dataSource.deviceModel.id
                this.deviceId = deviceNameChild.id
                this.dataSourceList = []
                let obj = {}
                obj.typeName = startBindData.dataSource.deviceTypeChild.name 
                obj.deviceName = deviceNameChild.name
                obj.modelName = startBindData.dataSource.deviceModel.name 
                this.dataSourceList.push(obj)
            } else {
                this.deviceModelId = null
                this.dataSourceList = []
            }
        },
        initModelList() {
            //模型列表
            this.modelVals.splice(0)
            if(this.deviceModelId) {
                let objData = {
                    studioId: sessionStorage.getItem("applyId"),
                    deviceModelId:this.deviceModelId
                }
                this.requestUtil.post(this.urls.getModelList.url, objData).then((res) => {
                    if(res.returnObj) {
                        this.modelList = res.returnObj
                        this.stateList.forEach((item,index)=>{
                            if(item.modelFormInfo) {//如果状态绑定的有公式，就选中该项公式
                                let modelIndex = this.modelList.findIndex((model)=>{
                                    return item.modelFormInfo == model.sourceId
                                })
                                if(modelIndex != -1) {
                                    this.$set(this.modelVals,index,modelIndex)
                                }
                            }
                        })
                    }
                })
            }else{
                this.modelList = []
                this.stateList = []
            }
        },
        initParamsList() {
            let tempObj = this.getCellModelInfo('bindData')
            if(tempObj && tempObj.params) {
                this.paramOutterList = tempObj.params
            }else{
                this.paramOutterList = []
            }
        },
        addParam() {
            this.visible = true
            if(this.singleParamShow.includes(this.shapeName)) {
                this.multiple = false
            }else{
                this.multiple = true
            }
        },
        addParamDone(data) {
            let isFirstCheck = false
            if(this.paramOutterList && !this.paramOutterList.length) {
                isFirstCheck = true
            }
            data.forEach((item)=>{
                this.paramOutterList.push({
                    paramName:item.paramName,
                    paramId:item.paramId,
                    paramType:item.type,
                    partName:item.partName,
                    key:item.key,
                    transportSourceId:item.transportSourceId,
                    deviceParamId:item.deviceParamId,
                    type:false,
                })
            })
            if(isFirstCheck) {
                this.paramOutterList[0].type = true
            }
            let tempObj = this.getCellModelInfo('bindData')
            tempObj.params = this.paramOutterList
            this.setCellModelInfo('bindData',tempObj)
        },
        removeParamHandle(index) {
            sureDialog(this.myEditorUi,this.$t('footBar.sureDelCurrentParam'),()=>{
                this.paramOutterList.splice(index,1)
                let tempObj = this.getCellModelInfo('bindData')
                tempObj.params = this.paramOutterList
                this.setCellModelInfo('bindData',tempObj)
            })
        },
        paramDefaultChange(val,paramId) {
            this.paramOutterList.forEach(item=>{
                if(item.paramId == paramId) {
                    item.type = true
                }else{
                    item.type = false
                }
            })
            let tempObj = this.getCellModelInfo('bindData')
            tempObj.params = this.paramOutterList
            this.setCellModelInfo('bindData',tempObj)
        },
        modelSelectChange(modelIndex,stateIndex) {
            //将模型公式绑定在对应的状态上
            if(!modelIndex && modelIndex !== 0) {
                return
            }
            let currentModel = this.modelList[modelIndex]
            this.stateList[stateIndex].modelFormInfo = currentModel.sourceId
            this.setCellModelInfo('statesInfo',[...this.stateList])
        },
        clearStateBtn(pos) {
            let tempStateList = this.getCellModelInfo("statesInfo")
            tempStateList.forEach((item,index)=>{
                if(index == pos) {
                    item.modelFormInfo = null
                }
                return
            })
            this.setCellModelInfo('statesInfo',tempStateList)
        },
        footerContentHandle(show) {
            if (show) {
                if (supportDataShow.includes(this.shapeName)) { // 数据显示tab 是否展示
                    this.ifShowDataFlag = true
                } else {
                    this.ifShowDataFlag = false
                }
                if(allShapes.includes(this.shapeName)) {
                    this.footerContent = true
                }else{
                    this.footerContent = false
                }
            } else {
                this.footerContent = false
            }
        },
        switchTabHandle(type) {
            this.tabsNum = +type
            if(!this.ifShowArrow) {
                this.ifShowArrow = true
            }
        },
        deleteFooterHandle(data, index) {
            let startBindData = this.getCellModelInfo('bindData')
            sureDialog(this.myEditorUi,`${this.$t('footBar.sureDelDataSources')}-${data.name}?`,()=>{
                this.dataSourceList.splice(index, 1)
                startBindData = null
                this.clearStateModel()//清空状态里面的模型
                this.dataSourceList = []
                this.paramsList = []
                this.stateList = []
                this.modelList = []
                this.deviceModelId = null
                this.setCellModelInfo('bindData',startBindData)
            })
        },
        clearStateModel() {
            let tempStateList = this.getCellModelInfo("statesInfo") || []
            tempStateList.forEach((item)=>{
                if(item.modelFormInfo) {
                    item.modelFormInfo = null
                }
            })
            this.setCellModelInfo('statesInfo',tempStateList)
        },
        checkDetDataModel(oldValue, newValue) {
            let oldDeviceNameChild = oldValue.dataSource.deviceNameChild || []
            let newDeviceNameChild = newValue.deviceNameChild || []
            for(let i = 0; i <= oldDeviceNameChild.length - 1; i++) {
                for(let j = 0; j <= newDeviceNameChild.length - 1; j++) {
                    if (oldDeviceNameChild[i].id === newDeviceNameChild[j].id) {
                        Message.warning(this.$t('notAllowMultiplyBind'))
                        return false
                    }
                }
            }
            return true
        },
        getCellModelInfo(key,cell) {
            let graph = this.myEditorUi.editor.graph
            if(!cell) {
                cell = graph.getSelectionCell()
            }
            let modelInfo = graph.getModel().getValue(cell)
            let bindData = null
            if (!mxUtils.isNode(modelInfo)) {
                let doc = mxUtils.createXmlDocument()
                let obj = doc.createElement('object')
                obj.setAttribute('label', modelInfo || '')
                modelInfo = obj
            }
            if(modelInfo) {
                let bindAttr = modelInfo.getAttribute(key)
                if(bindAttr) {
                    bindData = JSON.parse(bindAttr)
                }
            }
            return bindData
        },
        setCellModelInfo(key,data,cell) {
            let graph = this.myEditorUi.editor.graph
            if(!cell) {
                cell = graph.getSelectionCell()
            }
            let modelInfo = graph.getModel().getValue(cell)
            if (!mxUtils.isNode(modelInfo)) {
                let doc = mxUtils.createXmlDocument()
                let obj = doc.createElement('object')
                obj.setAttribute('label', modelInfo || '')
                modelInfo = obj
            }
            modelInfo.setAttribute(key, JSON.stringify(data))
            graph.getModel().setValue(cell, modelInfo)
            if(key == 'statesInfo') {
                VueEvent.$emit('refreshStates')
            }
        },
    }
}
</script>

<style lang="less" scoped>
.newfooter-wraper {
  width: calc(100% - 458px);
  position: absolute;
  left: 209px;
  bottom: 0;
  z-index: 100;
  background: #fff;
  .icon-add{
    width:20px;
    height: 20px;
    background: url('../../assets/images/leftsidebar/addpage.png') no-repeat center center;
    background-size:16px 16px;
    display: inline-block;
    cursor: pointer;
    vertical-align: middle;
  }
  .Collapse-title-wrap{
    background: #F2F2F2;
    width:100%;
    display: flex;
    border-top:1px solid #CCCCCC;
    border-bottom: 1px solid #CCCCCC;
    border-right:1px solid rgb(204, 204, 204);
    .Collapse-title-left{
      flex: 1;
    }
    .Collapse-title-right{
      width: 25px;
      height:24px;
      line-height: 24px;
      cursor: pointer;
      img {
        display: block;
        height:16px;
        width:16px;
        margin:4px auto;
      }
      &.collapse-active{
        transform: rotate(180deg);
      }
    }
    /deep/.ivu-tabs{
      .ivu-tabs-nav{
        height:24px;
        overflow: hidden;
      }
      height:24px;
      .ivu-tabs-tab{
        height:24px;
        line-height: 24px;
        padding:0px 16px;
        margin-right:0px;
        border:none;
      }
    }
  }
  .footer-content{
    height:200px;
    background:#F2F2F2;
    border-right:1px solid rgb(204, 204, 204);
    .footer-common{
      padding: 5px;
      .ivu-table-wrapper{
        border-right:none;
        overflow: visible;
        /deep/.ivu-table-header{
          height:24px;
          line-height: 24px;
          th{
            height:24px;
            background:#ffffff;
            border-right:none;
            color:#252525;
            font-weight: 400;
          }
        }
        /deep/.ivu-table-tbody{
          tr {
            td{
              height: 24px;
              border-right:none;
              background: #F2F2F2;
            }
            &.ivu-table-row-hover{
              td{
                background:#D9E6F6
              }
            }
          }
          
        }
        /deep/.ivu-table-tip{
          td{
            background:#F2F2F2
          }
        }
      }
      .icon-delete{
        width:20px;
        height: 20px;
        background: url('../../assets/images/datasource/delete.png') no-repeat center center;
        background-size:16px 16px;
        display: inline-block;
        cursor: pointer;
        vertical-align: middle;
      }
      /deep/.ivu-select{
        .ivu-select-selection{
          height:24px;
        }
        .ivu-select-placeholder{
          height:24px;
          line-height:24px;
        }
        .ivu-select-input{
          height:24px;
          line-height:24px;
        }
        .ivu-select-selected-value{
            height:24px;
            line-height:22px;
        }
        .ivu-select-dropdown{
          .ivu-select-dropdown-list{
            .ivu-select-item{
              padding: 0 16px 0;
              margin-bottom:0;
            }
          }
        }
      }
      /deep/.ivu-table{
        &::before{
          height:0px
        }
        &::after{
          width:0px
        }
      }
      .footerTabs2Ul{
        display: flex;
        flex-wrap:wrap;
        overflow: auto;
        div {
          flex:1;
          margin-bottom:10px;
          .footerTabs2-list-wrap{
            display: flex;
            height:44px;
            flex-direction: column;
            .footerTabs2-list-top{
              height:20px;
              padding-left:4px;
            }
            .footerTabs2-list-content{
              flex:1
            }
          }
        }
      }
      &.dataDisplayList{
        .dataShowHide {
          /deep/.ivu-table {
            /deep/.ivu-table-body {
              .ivu-table-tbody{
                  tr {
                    height:35px
                  }
                  /deep/.ivu-checkbox-inner{
                    &:after{
                      top:2px !important;
                      left:5px !important;
                    }
                  }
              }
            }
          }
        }
      }
    }
    .no-data-wrap{
      height:100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .no-data{
        margin-top:0px;
      }
    }
  }
}
</style>



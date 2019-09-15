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
                :label="dataSourceName[0]"
              />
              <TabPane
                :label="dataSourceName[1]"
              />
              <TabPane
                :label="dataSourceName[2]"
              />
            </Tabs>
          </div>
          <div 
            class="Collapse-title-right"
            :class="ifShowArrow ? 'collapse-active' : ''"
            @click="ifShowArrow=!ifShowArrow"
          />
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
            <ul class="dataDisplayListUl">
              <li 
                v-for="(item, index) in paramOutterList"
                :key="index"
              >
                <div>
                  <span>
                    <Select
                      v-model="item.model"
                      style="width:240px;height:24px;line-height:24px;"
                      @on-change="val=>paramSelectChange(val,index)"
                    >
                      <Option 
                        v-for="d in paramsList" 
                        :key="d.paramId" 
                        :value="d.paramId"
                      >
                        {{ d.paramName }}
                      </Option>
                    </Select>
                  </span>
                  <span>
                    <Button
                      v-if="index === 0 && paramOutterList.length!==paramsList.length"
                      size="small"
                      :disabled="ifCanAddParamFlag"
                      class="condition-icon condition-add-icon"
                      @click.stop.prevent="addParamHandle()"
                    >
                      {{ buttonText[0] }}
                    </Button>
                    <Button
                      v-if="paramOutterList.length > 1"
                      size="small"
                      class="condition-icon condition-delete-icon"
                      @click.stop.prevent="removeParamHandle(item.id,index)"
                    >
                      {{ buttonText[1] }}
                    </Button>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <!--状态模型-->
          <div
            v-show="tabsNum === 2"
            class="footer-common stateList"
          >
            <ul class="footerTabs2Ul">
              <li 
                v-for="(item,index) in stateList"
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
              </li>
            </ul>
          </div>
        </div>
        <div
          v-if="!footerContent || (tabsNum === 2&&stateList.length===0) || (tabsNum === 1 && (!ifShowDataFlag || !dataSourceList.length))"
          class="no-data-wrap"
        >
          <NoData
            :text="nodata"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Tabs,TabPane, Table,Select, Option, Button, Message} from 'iview'
import {mxUtils} from '../../services/mxGlobal'
import NoData from '../datasource/nodata'
import VueEvent from '../../services/VueEvent.js'

import {sureDialog} from '../../services/Utils'
const allShapes = ['image','userimage','tableCell','rectangle','ellipse','tableCell','light','progress','lineChart','gaugeChart']
// 支持显示参数
const SupportDataShow = ['rectangle','ellipse','tableCell','progress','lineChart', 'gaugeChart']
// 支持单个数据显示参数
const singleDataShow = ['progress','lineChart', 'gaugeChart']
let deviceTypeId = null
export default {
    components:{
        Tabs,
        TabPane,
        Table,
        Select,
        Option,
        Button,
        NoData
    },
    data() {
        return {
            value1: '1',
            dataSourceName:['数据源','数据显示','状态模型'],
            buttonText:['添加参数', '删除'],
            ifShowArrow: false,
            tabsNum: 0,
            nodata: '暂无数据',
            tablTitles:[
                {
                    title: '数据源',
                    key: 'name'
                },
                {
                    title: '类型',
                    key: 'typeName'
                },
                {
                    title: '名称',
                    key: 'deviceName'
                },
                {
                    title: '操作',
                    width: '80',
                    slot: 'actions',
                    key: 'actions',
                }
            ],
            dataSourceList: [],
            heightlen: '190',
            paramsList: [],
            paramOutterList: [{id:new Date().getTime(),model:""}],
            stateList:[],
            modelList:[],
            selectEle: false,
            footerContent: false,
            modelVals:[],//状态列表下的每个模型列表当前的v-model
            isInitFlag: false,
            ifShowDataFlag: true, // 判断是否显示数据显示tab
            ifCanAddParamFlag: true,
        }
    },
    watch:{
        ifShowArrow(val) {
            let el = document.querySelector(".geDiagramContainer.geDiagramBackdrop")
            let wh = document.documentElement.clientHeight
            if(val) {
                el.style.height = wh - 72 - 226 + 'px'
            }else{
                el.style.height = wh - 72 - 26 + 'px'
                console.log(el.style.height)
            }
        }
    },
    mounted() {
        if(this.footerContent) {
            this.initData()
        }
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
        VueEvent.$on('rightBarTabSwitch',()=>{
            this.ifShowArrow = false
        })
        // 绑定数据源
        VueEvent.$on('emitDataSourceFooter', (value) => {
            // 拿到之前绑定的 bindData
            let startBindData = this.getCellModelInfo('bindData')
            if (!startBindData) {
                this.setCellModelInfo('bindData',{dataSource:value})
                if (this.ifShowArrow) {
                    this.isInitFlag = false
                    this.initData()
                }
            } else {
                if (this.checkDetDataModel(startBindData, value)) { // 不存在重复的
                    let deviceNameChild = startBindData.dataSource.deviceNameChild || []
                    startBindData.dataSource.deviceNameChild = [...deviceNameChild,...value.deviceNameChild]
                    startBindData.dataSource.dataSourceChild = value.dataSourceChild
                    startBindData.dataSource.deviceTypeChild = value.deviceTypeChild
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
            this.initDataSource()//初始化数据源列表
            this.initModelList()//初始化模型列表
            this.initParamsList()//初始化参数列表
            this.isInitFlag = true
           
        },
        // 初始化数据源数据
        initDataSource() {
            let startBindData = this.getCellModelInfo('bindData')
            if (startBindData && startBindData.dataSource) {
                let deviceNameChild = startBindData.dataSource.deviceNameChild || []
                deviceTypeId = startBindData.dataSource.deviceTypeChild ? startBindData.dataSource.deviceTypeChild.id : '' //拿到deviceTypeId暂存全局
                this.dataSourceList = []
                deviceNameChild.forEach((item) => {
                    let obj = {}
                    obj.name = startBindData.dataSource.dataSourceChild.name
                    obj.typeName = startBindData.dataSource.deviceTypeChild.name 
                    obj.deviceName = item.name
                    this.dataSourceList.push(obj)
                })
            } else {
                this.dataSourceList = []
            }
        },
        initModelList() {
            //模型列表
            this.modelVals.splice(0)
            if(deviceTypeId) {
                let objData = {
                    studioId: sessionStorage.getItem("applyId"),
                    deviceTypeId:deviceTypeId
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
            if(deviceTypeId) {
                let param = {
                    studioId:sessionStorage.getItem("applyId"),
                    deviceTypeId: deviceTypeId,
                    type:1
                }
                this.requestUtil.post(this.urls.deviceParamList.url, param).then((res) => {
                    this.paramsList = res.records
                })
            }else{
                this.paramsList = []
            }
            if(tempObj && tempObj.params) {
                let bindParamsList = tempObj.params
                this.paramOutterList = new Array(bindParamsList.length)
                bindParamsList.forEach((item,index)=>{
                    this.$set(this.paramOutterList,index,{id:item.id,model:item.paramId})
                })
            }else{
                this.paramOutterList = [{id:new Date().getTime(),model:""}]
            }
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
                let graph = this.myEditorUi.editor.graph
                let cell = graph.getSelectionCell()
                let state = graph.view.getState(cell)
                let shapeName = state.style.shape
                if (singleDataShow.includes(shapeName)) { // flag 增加参数按钮显示
                    this.ifCanAddParamFlag = true
                } else {
                    this.ifCanAddParamFlag = false
                }
                if (SupportDataShow.includes(shapeName)) { // flag 是否数据显示
                    this.ifShowDataFlag = true
                } else {
                    this.ifShowDataFlag = false
                }
                if(allShapes.includes(shapeName)) { // 底部内容显示
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
            let newDataSource = JSON.parse(JSON.stringify(this.dataSourceList))
            sureDialog(this.myEditorUi,`确定要删除数据源-${data.name}吗`,()=>{
                this.dataSourceList.splice(index, 1)
                let objArr = startBindData.dataSource.deviceNameChild
                let deleteEle = newDataSource[index].deviceName
                let resIndex = objArr.findIndex((item)=>{
                    return item.name == deleteEle
                })
                if(resIndex != -1) {
                    objArr.splice(resIndex,1)
                    if (!objArr.length) { // 清空了数据源 要把数据显示和状态模型都清空
                        startBindData = null
                        this.clearStateModel()//清空状态里面的模型
                        this.dataSourceList = []
                        this.paramsList = []
                        this.stateList = []
                        this.modelList = []
                    } else {
                        startBindData.dataSource.deviceNameChild = objArr
                    }
                }
                this.setCellModelInfo('bindData',startBindData)
            })
        },
        clearStateModel() {
            let tempStateList = this.getCellModelInfo("statesInfo")
            tempStateList.forEach((item)=>{
                if(item.modelFormInfo) {
                    item.modelFormInfo = null
                }
            })
            this.setCellModelInfo('statesInfo',tempStateList)
        },
        addParamHandle() {
            this.paramOutterList.unshift({id:new Date().getTime(),model:""})
        },
        removeParamHandle(id,index) {
            this.paramOutterList.splice(index , 1)
            let tempObj = this.getCellModelInfo('bindData')
            let list = [ ]
            if(tempObj && tempObj.params) {
                list = tempObj.params
            }
            if(list.length) {
                let resIndex = list.findIndex((item)=>{
                    return item.id == id
                })
                if(resIndex != -1) {
                    list.splice(resIndex,1)
                    tempObj.params = list
                    this.setCellModelInfo('bindData',tempObj)
                }
            }
        },
        paramSelectChange(val,index) {
            if(!val) {
                return
            }
            let tempObj = this.getCellModelInfo('bindData')
            let list = []
            if(tempObj && tempObj.params) {
                list = tempObj.params
            } 
            let targetParam = this.paramsList.find((item)=>{
                return item.paramId == val
            })
            let obj = {
                paramId:targetParam.paramId,
                paramName:targetParam.paramName,
                id:this.paramOutterList[index].id
            }
            let resIndex = list.findIndex((item)=>{
                return item.id == this.paramOutterList[index].id
            })
            if(resIndex != -1) {
                list[resIndex] = obj
            }else{
                list.unshift(obj)
            }
            if(!tempObj) {
                tempObj = { }
            }
            if(list.length) {
                tempObj.params = list
                this.setCellModelInfo('bindData',tempObj)
            }
        },
        checkDetDataModel(oldValue, newValue) {
            let oldDeviceNameChild = oldValue.dataSource.deviceNameChild || []
            let newDeviceNameChild = newValue.deviceNameChild || []
            for(let i = 0; i <= oldDeviceNameChild.length - 1; i++) {
                for(let j = 0; j <= newDeviceNameChild.length - 1; j++) {
                    if (oldDeviceNameChild[i].id === newDeviceNameChild[j].id) {
                        Message.success(`不允许重复绑定`)
                        return false
                    }
                }
            }
            return true
        },
        getCellModelInfo(key) {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
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
        setCellModelInfo(key,data) {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let modelInfo = graph.getModel().getValue(cell)
            if (!mxUtils.isNode(modelInfo)) {
                let doc = mxUtils.createXmlDocument()
                let obj = doc.createElement('object')
                obj.setAttribute('label', modelInfo || '')
                modelInfo = obj
            }
            modelInfo.setAttribute(key, JSON.stringify(data))
            graph.getModel().setValue(cell, modelInfo)
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
  .Collapse-title-wrap{
    background: #F2F2F2;
    width:100%;
    display: flex;
    border-top:1px solid #CCCCCC;
    border-bottom: 1px solid #CCCCCC;
    .Collapse-title-left{
      flex: 1;
    }
    .Collapse-title-right{
      width: 50px;
      height:24px;
      line-height: 24px;
      padding-right:10px;
      background: url("../../assets/images/footer/foot-collapse.png") no-repeat right center;
      background-size:16px 16px;
      border-right:1px solid rgb(204, 204, 204);
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
        // border: none;
        border-right:none;
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
      .dataDisplayListUl{
        li{
          margin-bottom:5px;
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
        li {
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


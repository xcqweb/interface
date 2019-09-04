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
      <VerticalToggle>
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
              v-show="tabsNum === 1"
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
                        v-model="paramVals[index]"
                        style="width:240px;height:24px;line-height:24px;"
                        @on-change="(val)=>paramSelectChange(val,index)"
                      >
                        <Option 
                          v-for="(d,i) in paramsList" 
                          :key="i" 
                          :value="i"
                        >
                          {{ item.name }}
                        </Option>
                      </Select>
                    </span>
                    <span>
                      <Button
                        v-if="index === 0"
                        size="small"
                        class="condition-icon condition-add-icon"
                        @click.stop.prevent="addParamHandle(index)"
                      >
                        {{ buttonText[0] }}
                      </Button>
                      <Button
                        v-if="paramOutterList.length > 1"
                        size="small"
                        class="condition-icon condition-delete-icon"
                        @click.stop.prevent="removeParamHandle(index)"
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
                        @on-change="(val)=>modelSelectChange(val,index)"
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
            v-if="!footerContent || tabsNum === 2&&stateList.length===0"
            class="no-data-wrap"
          >
            <NoData
              :text="nodata"
            />
          </div>
        </div>
      </VerticalToggle>
    </div>
  </div>
</template>

<script>
import {Tabs,TabPane, Table,Select, Option, Button, Message} from 'iview'
import {mxUtils} from '../../services/mxGlobal'
import NoData from '../datasource/nodata'
import VerticalToggle from './vertical-toggle.js'
import VueEvent from '../../services/VueEvent.js'

import {sureDialog} from '../../services/Utils'
const allShapes = ['image','userimage','tableCell','rectangle','ellipse','tableCell','light','progress','lineChart','gaugeChart']
let deviceTypeId = null
export default {
    components:{
        Tabs,
        TabPane,
        Table,
        VerticalToggle,
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
            paramOutterList: [''],
            stateList:[],
            modelList:[],
            selectEle: false,
            footerContent: false,
            modelVals:[],//状态列表下的每个模型列表当前的v-model
            paramVals:[],//参数列表，每个参数input当前的v-model
        }
    },
    watch: {
        ifShowArrow(val) {
            if(val) {
                this.initData()
            }
        }
    },
    mounted() {
        VueEvent.$on('isShowFootBar', ({show,isUp}) => {
            this.footerContentHandle(show)
            this.ifShowArrow = !!isUp
        })
        // 绑定数据源
        VueEvent.$on('emitDataSourceFooter', (value) => {
            // 拿到之前绑定的 bindData2
            let startBindData = this.getCellModelInfo('bindData2')
            if (!startBindData) {
                this.setCellModelInfo('bindData2',{dataSource:value})
            } else {
                if (this.checkDetDataModel(startBindData, value)) { // 不存在重复的
                    let deviceNameChild = startBindData.dataSource.deviceNameChild
                    startBindData.dataSource.deviceNameChild = [...deviceNameChild,...value.deviceNameChild]
                    this.setCellModelInfo('bindData2',startBindData)
                }
            }
        })
    },
    methods:{
        initData() {
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
           
        },
        // 初始化数据源数据
        initDataSource() {
            let startBindData2 = this.getCellModelInfo('bindData2')
            if (startBindData2 && startBindData2.dataSource) {
                let deviceNameChild = startBindData2.dataSource.deviceNameChild
                deviceTypeId = startBindData2.dataSource.deviceTypeChild.id//拿到deviceTypeId暂存全局
                this.dataSourceList = []
                deviceNameChild.forEach((item) => {
                    let obj = {}
                    obj.name = startBindData2.dataSource.dataSourceChild.name
                    obj.typeName = startBindData2.dataSource.deviceTypeChild.name 
                    obj.deviceName = item.name
                    this.dataSourceList.push(obj)
                })
            }
        },
        initModelList() {
            //模型列表
            if(deviceTypeId) {
                let objData = {
                    studioId: sessionStorage.getItem("applyId"),
                    deviceTypeId:deviceTypeId
                }
                this.requestUtil.post(this.urls.getModelList.url, objData).then((res) => {
                    if(res.returnObj) {
                        this.modelList = res.returnObj
                        this.stateList.forEach((item)=>{
                            if(item.modelFormInfo) {//如果状态绑定的有公式，就选中该项公式
                                let modelIndex = this.modelList.findIndex((model)=>{
                                    return item.modelFormInfo.sourceId == model.sourceId
                                })
                                if(modelIndex != -1) {
                                    this.$set(this.modelVals,modelIndex,modelIndex)
                                }
                            }
                        })
                    }
                })
            }else{
                this.modelList = []
            }
        },
        initParamsList() {
            let tempObj = this.getCellModelInfo('bindData2')
            if(deviceTypeId) {
                let param = {
                    studioId:sessionStorage.getItem("applyId"),
                    deviceTypeId: deviceTypeId
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
                    this.$set(this.paramVals,index,item.index)
                })
            }
        },
        modelSelectChange(modelIndex,stateIndex) {
            //将模型公式绑定在对应的状态上
            let currentModel = this.modelList[modelIndex]
            this.stateList[stateIndex].modelFormInfo = currentModel
            this.setCellModelInfo('statesInfo',[...this.stateList])
        },
        footerContentHandle(show) {
            if (show) {
                let graph = this.myEditorUi.editor.graph
                let cell = graph.getSelectionCell()
                let state = graph.view.getState(cell)
                let shapeName = state.style.shape
                if(allShapes.includes(shapeName)) {
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
            let startBindData2 = this.getCellModelInfo('bindData2')
            let newDataSource = JSON.parse(JSON.stringify(this.dataSource))
            sureDialog(this.myEditorUi,`确定要删除数据源-${data.name}吗`,()=>{
                this.dataSource.splice(index, 1)
                let objArr = startBindData2.dataSource.deviceNameChild || []
                let deleteEle = newDataSource[index].deviceName || ''
                let resIndex = objArr.findIndex((item)=>{
                    return item.name == deleteEle
                })
                if(resIndex != -1) {
                    objArr.splice(resIndex,1)
                    startBindData2.dataSource.deviceNameChild = objArr
                }
                this.setCellModelInfo('bindData2',startBindData2)
            })
        },
        addParamHandle() {
            this.paramOutterList.unshift('')
        },
        removeParamHandle(index) {
            this.paramOutterList.splice(index , 1)
            let tempObj = this.getCellModelInfo('bindData2')
            let list = [ ]
            if(tempObj) {
                list = tempObj.params
            }
            if(list.length) {
                let res = list.findIndex((item)=>{
                    return item.index == index
                })
                if(res != -1) {
                    list.splice(index,1)
                    tempObj.params = list
                    this.setCellModelInfo('bindData2',tempObj)
                }
            }
        },
        paramSelectChange(val,index) {
            let tempObj = this.getCellModelInfo('bindData2')
            let list = [ ]
            if(tempObj) {
                list = tempObj.params
            }
            list.push({
                id:this.paramsList[val].paramId,
                name:this.paramsList[val].paramName,
                index:index
            })
            if(!tempObj) {
                tempObj = { }
            }
            tempObj.parmas = list
            this.setCellModelInfo('bindData2',tempObj)
        },
        checkDetDataModel(oldValue, newValue) {
            let oldDeviceNameChild = oldValue.dataSource.deviceNameChild 
            let newDeviceNameChild = newValue.deviceNameChild
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
      /deep/.ivu-select-dropdown-list{
          .ivu-select-item{
            padding: 0 16px 0;
          }
      }
      /deep/.ivu-select-selection{
        height:26px;
        /deep/.ivu-select-selected-value{
          height:24px;
          line-height:24px;
        }
        /deep/ .ivu-select-placeholder{
          height:24px;
          line-height:24px;
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


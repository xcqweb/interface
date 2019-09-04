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
            @click="clickHandle()"
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
              v-show="TabsNumber === 0"
              class="footer-common dataSourceList"
            >
              <template>
                <Table
                  border
                  :columns="columns7"
                  :data="dataSource"
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
              v-show="TabsNumber === 1"
              class="footer-common dataDisplayList"
            > 
              <ul class="dataDisplayListUl">
                <li 
                  v-for="(items, index) in paramsListArr"
                  :key="index"
                >
                  <div>
                    <span>
                      <Select
                        v-model="items.paramsSelect"
                        style="width:240px;height:24px;line-height:24px;"
                      >
                        <Option 
                          v-for="item in ParamsSelectList" 
                          :key="item.value" 
                          :value="item.value"
                        >
                          {{ item.label }}
                        </Option>
                      </Select>
                    </span>
                    <span>
                      <Button
                        v-if="index === 0"
                        size="small"
                        class="condition-icon condition-add-icon"
                        @click.stop.prevent="adddataHandle(index)"
                      >
                        {{ buttonText[0] }}
                      </Button>
                      <Button
                        v-if="paramsListArr.length > 1"
                        size="small"
                        class="condition-icon condition-delete-icon"
                        @click.stop.prevent="removedataHandle(index)"
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
              v-show="TabsNumber === 2"
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
            v-if="!footerContent || TabsNumber === 2&&stateList.length===0"
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
import NoData from '../datasource/nodata'
import VerticalToggle from './vertical-toggle.js'
import VueEvent from '../../services/VueEvent.js'
import {sureDialog} from '../../services/Utils'
let bindObj = null,isInitModelList = false
const allShapes = ['image','userimage','tableBox','rectangle','ellipse','tableCell','light','progress','lineChart','gaugeChart']
// const dataSourceForm = 'IOT平台'
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
            TabsNumber: 0,
            nodata: '暂无数据',
            columns7:[
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
            dataSource: [],
            heightlen: '190',
            ParamsSelect: '',
            ParamsSelectList: [],
            paramsListArr: [
                {
                    paramsSelect: ''
                }
            ],
            stateList:[],
            modelList:[],
            selectEle: false,
            footerContent: false,
            modelVals:[],//状态列表下的每个模型列表当前的v-model
        }
    },
    mounted() {
        VueEvent.$on('isShowFootBar', ({show,isUp}) => {
            if(isUp) {
                this.ifShowArrow = true
            }
            this.init(show)
            this.footerContentHandle(show)
        })
        // 绑定数据源
        VueEvent.$on('emitDataSourceFooter', (value) => {
            // 出始拿到 bindData2
            let startBindData = this.getCellModelInfo('bindData2')
            let objData = {dataSource:value}
            if (!startBindData) {
                this.setCellModelInfo('bindData2',objData)
            } else {
                if (this.checkDetDataModel(startBindData, value)) { // 不存在重复的
                    this.newSetDataModel(startBindData, value)
                } else {
                    return false
                }
            }
            this.getTableData(false,value)
            bindObj = value
            this.initModelList()
            Message.success('绑定成功')
        })
    },
    methods:{
        init(bool) {
            let tempStateList = this.getCellModelInfo("statesInfo")
            if(tempStateList) {
                this.stateList = tempStateList
            }else{
                this.stateList = []
            }
            this.initModelList()
            this.initDataSource(bool)
        },
        initModelList() {
            //模型列表
            if(isInitModelList) {
                return
            }
            let deviceTypeId = null
            if(bindObj) {
                deviceTypeId = bindObj.deviceTypeChild.id
            }else{
                deviceTypeId = this.findByBind()
            }
            if(deviceTypeId) {
                let objData = {
                    studioId: sessionStorage.getItem("applyId"),
                    deviceTypeId:deviceTypeId
                }
                this.requestUtil.post(this.urls.getModelList.url, objData).then((res) => {
                    if(res.returnObj) {
                        this.modelList = res.returnObj
                        isInitModelList = true
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
        // 初始化数据源数据
        initDataSource(bool) {
            if (bool) {
                let startBindData2 = this.getCellModelInfo('bindData2')
                if (startBindData2 && startBindData2.dataSource) {
                    this.getTableData(true,startBindData2.dataSource)
                }else{
                    this.dataSource = []
                }
            }
        },
        findByBind() {
            let res = null
            for(let i = 0;i < this.stateList.length;i++) {
                if(this.stateList[i].modelFormInfo) {
                    res = this.stateList[i].modelFormInfo.deviceTypeId
                    break
                }
            }
            return res
        },
        modelSelectChange(modelIndex,stateIndex) {
            //将模型公式绑定在对应的状态上
            let currentModel = this.modelList[modelIndex]
            this.stateList[stateIndex].modelFormInfo = currentModel
            this.setCellModelInfo('statesInfo',[...this.stateList])
        },
        clickHandle() {
            this.ifShowArrow = !this.ifShowArrow
        },
        footerContentHandle(data) {
            if (data) {
                let graph = this.myEditorUi.editor.graph
                let cell = graph.getSelectionCell()
                let state = graph.view.getState(cell)
                let shapeName = state.style.shape
                console.log(shapeName)
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
            this.TabsNumber = +type
            if(!this.ifShowArrow) {
                this.ifShowArrow = true
            }
            if(this.TabsNumber == 2) {
                this.initModelList()
            }
        },
        deleteFooterHandle(data, index) {
            let startBindData2 = this.getCellModelInfo('bindData2')
            let newDataSource = JSON.parse(JSON.stringify(this.dataSource))
            sureDialog(this.myEditorUi,`确定要删除数据源-${data.name}吗`,()=>{
                this.dataSource.splice(index, 1)
                let objArr = startBindData2.dataSource.deviceNameChild || []
                let deleteEle = newDataSource[index].deviceName || ''
                let newObjArr = []
                let objData = {}
                objData.dataSource = {}
                objArr.forEach((item) => {
                    if (item.name !== deleteEle) {
                        newObjArr.push(item)
                    }
                })
                objData.dataSource.dataSourceChild = startBindData2.dataSource.dataSourceChild
                objData.dataSource.deviceNameChild = newObjArr
                objData.dataSource.deviceTypeChild = startBindData2.dataSource.deviceTypeChild
                this.setCellModelInfo('bindData2',objData)
            })
        },
        adddataHandle() {
            this.paramsListArr.unshift({
                paramsSelect: ''
            })
        },
        removedataHandle(index) {
            this.paramsListArr.splice(index , 1)
        },
        getCellModelInfo(key) {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let modelInfo = graph.getModel().getValue(cell)
            console.log(modelInfo)
            let bindData = null
            if(modelInfo) {
                let bindAttr = modelInfo.getAttribute(key)
                if(bindAttr) {
                    bindData = JSON.parse(bindAttr)
                }
            }
            return bindData
        },
        /*
          @bool : 是否清空dataSource
        */
        getTableData(bool,data) {
            if (bool) {
                this.dataSource = []
            }
            if (data.deviceNameChild && data.deviceNameChild.length) {
                data.deviceNameChild.forEach((item) => {
                    let obj = {}
                    obj.name = data.dataSourceChild.name || ''
                    obj.typeName = data.deviceTypeChild.name || ''
                    obj.deviceName = item.name || ''
                    this.dataSource.push(obj)
                })
            }
        },
        checkDetDataModel(oldValue, newValue) {
            let oldDeviceNameChild = oldValue.dataSource.deviceNameChild 
            let newDeviceNameChild = newValue.deviceNameChild
            let flag = ''
            for(let i = 0; i <= oldDeviceNameChild.length - 1; i++) {
                for(let j = 0; j <= newDeviceNameChild.length - 1; j++) {
                    if (oldDeviceNameChild[i].id === newDeviceNameChild[j].id) {
                        Message.success(`不允许重复绑定`)
                        flag = false
                        return false
                    }
                }
            }
            flag = true
            return flag
        },
        newSetDataModel(oldValue, newValue) {
            let obj = {},objData = {}
            obj.dataSourceChild = oldValue.dataSource.dataSourceChild
            obj.deviceTypeChild = oldValue.dataSource.deviceTypeChild
            obj.deviceNameChild = [...oldValue.dataSource.deviceNameChild, ...newValue.deviceNameChild]
            objData.dataSource = obj
            this.setCellModelInfo('bindData2',objData)
        },
        setCellModelInfo(key,data) {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let modelInfo = graph.getModel().getValue(cell)
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

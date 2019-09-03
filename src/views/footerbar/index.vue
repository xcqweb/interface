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
            @click="clickHandle($event, )"
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
                  v-for="(items, index) in modelSelectArr"
                  :key="index"
                >
                  <div class="footerTabs2-list-wrap">
                    <span class="footerTabs2-list-top">状态{{ index + 1 }}</span>
                    <span class="footerTabs2-list-content">
                      <Select
                        v-model="items.modelSelect"
                        style="width:240px;height:24px;line-height:24px;"
                      > 
                        <Option 
                          v-for="item in ModelSelectList" 
                          :key="item.value" 
                          :value="item.value"
                        >
                          {{ item.label }}
                        </Option>
                      </Select>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-else
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
import {Tabs,TabPane, Table,Select, Option, Button} from 'iview'
import NoData from '../datasource/nodata'
import VerticalToggle from './vertical-toggle.js'
import VueEvent from '../../services/VueEvent.js'
const FirbiddArr = ['image','userimage','tableBox','rectangle','ellipse','tableCell','light','progress','lineChart','gaugeChart']
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
            dataSource: [
                // {
                //     name: dataSourceForm,
                //     typeName: '123',
                //     deviceName: 'New York No. 1 Lake Park'
                // },
                // {
                //     name: dataSourceForm,
                //     typeName: '123',
                //     deviceName: 'London No. 1 Lake Park'
                // },
                // {
                //     name: dataSourceForm,
                //     typeName: '123',
                //     deviceName: 'Sydney No. 1 Lake Park'
                // }
            ],
            heightlen: '190',
            ParamsSelect: '',
            ParamsSelectList: [
                {
                    value: '1',
                    label:'terry'
                }
            ],
            paramsListArr: [
                {
                    paramsSelect: ''
                }
            ],
            modelSelectArr:[
                {
                    modelSelect: '1'
                },
                {
                    modelSelect: '2'
                },
                {
                    modelSelect: '2'
                },
                {
                    modelSelect: '2'
                },
                {
                    modelSelect: '2'
                }
            ],
            ModelSelectList:[
                {
                    value: '1',
                    label:'terry'
                }
            ],
            selectEle: false,
            footerContent: false,
            showWidgetStyle: false
        }
    },
    mounted() {
        let _that = this
        VueEvent.$on('clickFooterHandle', () => {
            _that.clickHandle('',true)
        })
        VueEvent.$on('websoketSelectElemnt', (value) => {
            _that.footerContentHandle(value)
        })
    },
    methods:{
        init() {
        },
        clickHandle(evt,bool) {
            if (bool) {
                this.ifShowArrow = true
            } else {
                this.ifShowArrow = !this.ifShowArrow
            }
        },
        footerContentHandle(data) {
            if (data) {
                if (!this.footerContent) {
                    let graph = this.myEditorUi.editor.graph
                    let cell = graph.getSelectionCell();
                    let state = graph.view.getState(cell);
                    let shapeName = state.style.shape
                    if(FirbiddArr.includes(shapeName)) {
                        this.footerContent = true
                    }
                }
            } else {
                this.footerContent = false
            }
        },
        switchTabHandle(type) {
            this.TabsNumber = +type
        },
        deleteFooterHandle(data, index) {
            console.log(data, index)
        },
        adddataHandle() {
            this.paramsListArr.unshift({
                paramsSelect: ''
            })
        },
        removedataHandle(index) {
            this.paramsListArr.splice(index , 1)
        }

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
        li {
          flex:1;
          margin-bottom:5px;
          .footerTabs2-list-wrap{
            display: flex;
            height:44px;
            flex-direction: column;
            .footerTabs2-list-top{
              height:20px;
              padding-left:8px;
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

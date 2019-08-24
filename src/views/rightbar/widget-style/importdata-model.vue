<template>
  <div class="inport-model">
    <Modal
      v-model="showdatasoures"
      width="660px"
      class="left-sidebar-model"
      :title="datasouresAlertName"
      :mask-closable="false"
      @on-cancel="cancel"
    >
      <div class="content-top">
        <div class="content-top-common contnt-top-form1">
          <Form
            :label-width="50"
            :model="formValidate"
          >
            <FormItem
              :label="dataName"
            >
              <DataSourceSelect
                :datalist="deviceNameArr"
                :modelvalue="modelvalue2"
              />
            </FormItem>
          </Form>
        </div>
        <div class="content-top-common contnt-top-form2">
          <Form
            :label-width="58"
            :model="formValidate"
          >
            <FormItem
              :label="deviceType"
            >
              <DataSourceSelect
                :datalist="deviceNameArr"
                :modelvalue="modelvalue2"
              />
            </FormItem>
          </Form>
        </div>
        <div class="content-top-common contnt-top-form3">
          <Button 
            type="primary"
            size="small"
          >
            {{ selectText }}
          </Button>
          <Button
            small
            size="small"
            @click.stop.prevent="resetHandle"
          >
            {{ resetText }}
          </Button>
        </div>
      </div>
      <div class="content-wrap">
        <div class="content-common content-left">
          <div class="content-common-top">
            <Input
              :placeholder="placeTextArr[0]"
              suffix="ios-search"
            />
          </div>
          <div class="content-common-center">
            <div
              v-if="paramsNameList.length"
            >
              <CheckboxGroup
                v-model="paramsNameListArr"
                class="devicename-listUl"
                @on-change="checked => checkAllGroupChange(checked, 1)"
              >
                <Checkbox
                  v-for="(item, index) in paramsNameList"
                  :key="index"
                  :label="item.id"
                  size="small"
                >
                  <span>{{ item.name }}</span>
                </Checkbox>
              </CheckboxGroup>
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
          <div class="content-common-botton">
            <div class="data-botton-left">
              <Checkbox
                :disabled="!paramsNameList.length"
                :indeterminate="indeterminateArr[1]"
                size="small"
                :value="checkAllArr[1]"
                @click.prevent.native="handleCheckAll(1)"
              >
                全选
              </Checkbox>
            </div>
            <div class="data-botton-right">
              <template v-if="paramsNameList.length">
                <Page 
                  :current="1" 
                  :total="50" 
                  simple
                />
              </template>
            </div>
          </div>
        </div>
        <div class="content-common content-right">
          <div class="content-common-top">
            <Input 
              :placeholder="placeTextArr[1]"
              suffix="ios-search"
            />
          </div>
          <div class="content-common-center">
            <div
              v-if="deviceNameList.length"
            >
              <CheckboxGroup
                v-model="deviceNameListArr"
                class="devicename-listUl"
                @on-change="checked => checkAllGroupChange(checked, 2)"
              >
                <Checkbox
                  v-for="(item, index) in deviceNameList"
                  :key="index"
                  :label="item.id"
                  size="small"
                >
                  <span>{{ item.name }}</span>
                </Checkbox>
              </CheckboxGroup>
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
          <div class="content-common-botton">
            <div class="data-botton-left">
              <Checkbox
                :disabled="!deviceNameList.length"
                :indeterminate="indeterminateArr[2]"
                size="small"
                :value="checkAllArr[2]"
                @click.prevent.native="handleCheckAll(2)"
              >
                全选
              </Checkbox>
            </div>
            <div class="data-botton-right">
              <template v-if="deviceNameList.length">
                <Page 
                  :current="1" 
                  :total="50" 
                  simple
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template> 
<script>
import {Modal, Form,FormItem, Button,Checkbox,CheckboxGroup, Page, Input} from 'iview'
import DataSourceSelect from './dataSource-select'
import NoData from './nodata'
export default{
    components: {
        Modal,
        Form,
        FormItem,
        DataSourceSelect,
        Button,
        Input,
        Checkbox,
        CheckboxGroup,
        NoData,
        Page
    },
    data() {
        return {
            showdatasoures: true,
            datasouresAlertName: '导入数据源',
            placeTextArr: ['输入参数名称', '输入设备名称'],
            derectionArr: ['right', 'right'],
            dataName: '数据源',
            deviceType: '设备类型',
            dataNameArr: [
                {
                    value: '1',
                    label: 'IOT平台'
                }
            ],
            deviceNameArr:[
                {
                    value: '1',
                    label: '深圳'
                }
            ],
            modelvalue1:'1',
            modelvalue2:'1',
            formValidate: {
                datasource: ''
            },
            selectText: '搜索',
            resetText: '重置',
            paramsNameList:[
                {
                    name: 'fkafkfks342-y',
                    id:'321312'
                },
                {
                    name: 'etwiyweuwe-y',
                    id:'855345'
                }
            ],
            deviceNameList:[],
            paramsNameListArr: [],
            deviceNameListArr: [],
            indeterminateArr: ['',false, false],
            checkAllArr: ['',false, false],
            nodata:'暂无数据',
        }
    },
    created() {
    },
    methods: {
        cancel() {
            this.$emit('triggerCancel')
        },
        handleCheckAll(number) {
            if (this.indeterminateArr[number]) {
                this.checkAllArr[number] = false;
            } else {
                this.checkAllArr[number] = !this.checkAllArr[number];
            }
            this.indeterminateArr[number] = false;
            let dataArr = number === 1 ? this.paramsNameList : this.deviceNameList
            if (this.checkAllArr[number]) {
                dataArr.forEach((item) => {
                    if (number === 1) {
                        this.paramsNameListArr.push(item.id)
                    } else {
                        this.deviceNameListArr.push(item.id)
                    }
                })
            } else {
                if (number === 1) {
                    this.paramsNameListArr = [];
                } else {
                    this.deviceNameListArr = [];
                }
                
            }
        },
        checkAllGroupChange(data, number) {
            let deviceNameListLen = (number === 1 ? this.paramsNameList.length : this.deviceNameList.length)
            if (data.length === deviceNameListLen) {
                this.indeterminateArr[number] = false;
                this.checkAllArr[number] = true;
            }  else {
                this.indeterminateArr[number] = false;
                this.checkAllArr[number] = false;
            }
            
        },
        resetHandle() {
            this.paramsNameList = []
            this.deviceNameList = []
        }
    }
}
</script>
<style lang="less" scoped>
  .left-sidebar-model{
    /deep/.ivu-modal{
            /deep/.ivu-modal-content{
                background-color:#f5f5f5 !important;
                .ivu-modal-header{
                    height: 36px;
                    padding:0;
                    /deep/.ivu-modal-header-inner{
                        text-align: center;
                        height: 36px;
                        line-height: 36px;
                        color:#252525;
                        font-size: 12px;
                        background: linear-gradient(0deg,#d8d8d8,#e4e3e4);
                        font-weight: normal;
                        border-top-left-radius: 6px;
                        border-top-right-radius: 6px;
                    }
                }
                .ivu-modal-body{
                  padding: 0 24px;
                  height:350px;
                  display:flex;
                  flex-direction: column;
                  .content-top{
                    height: 48px;
                    display:flex;
                    .content-top-common{
                      padding-top:7px;
                      width:218px;
                      .ivu-form{
                        height:34px;
                        .ivu-form-item{
                          margin-bottom:0;
                        }
                        .ivu-form-item-label{
                          padding-right:0;
                          text-align: left;
                        }
                      }
                      &.contnt-top-form2{
                        margin-left:10px;
                      }
                      &.contnt-top-form3{
                        padding-top: 11px;
                        padding-left:10px;
                      }
                    }
                  }
                  .content-wrap{
                    // height:280px;
                    flex:1;
                    display:flex;
                    justify-content: space-between;
                    .content-common{
                      width:300px;
                      border:1px solid #D4D4D4;
                      border-radius: 2px;
                      background:#fff;
                      padding: 10px 0 0;
                      display: flex;
                      flex-direction: column;
                      .content-common-top{
                        height:24px;
                        padding: 0 10px 0;
                        .ivu-input-suffix{
                          .ivu-icon{
                            line-height:24px;
                          }
                        }
                        .ivu-input {
                          height:24px;
                        }
                      }
                      .content-common-center{
                        flex:1;
                        padding: 8px 10px 0;
                        .devicename-listUl{
                          label{
                            display:block;
                            width:100%;
                          }
                        }
                        .no-data-wrap{
                          height:100%;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                        }
                      }
                      .content-common-botton{
                        height:25px;
                        // padding: 0px 10px 0;
                        border-top:1px solid #D4D4D4;
                        display:flex;
                        .data-botton-left{
                          width:80px;
                          padding-left: 10px;
                          padding-top:2px;
                        }
                        .data-botton-right{
                          flex:1;
                          text-align: right;
                          padding-right:5px;
                          .ivu-page-simple-pager{
                            input {
                              height:20px;
                              padding: 5px 0px;
                              margin:0;
                            }
                          }
                        }
                      }
                    }
                  }
                }
                .ivu-modal-close{
                    position: absolute;
                    top:10px;
                    width:16px;
                    height:16px;
                    background: url(../../../assets/images/default/closeDialog.png) no-repeat center center;
                    background-size: 16px 16px;
                    .ivu-icon{
                        display:none;
                    }
                }
                .ivu-modal-footer{
                  padding: 10px 18px;
                  border-top: none
                }
            }
        }
  }
</style>
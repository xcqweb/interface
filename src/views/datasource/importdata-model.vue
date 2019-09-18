<template>
  <div class="inport-model">
    <Modal
      ref="model"
      v-model="showdatasoures"
      width="660px"
      class="importdata-model"
      :title="datasouresAlertName"
      :mask-closable="false"
      @on-cancel="cancelHandle"
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
              <Select
                v-model="modelvalue1"
                style="height:24px"
              >
                <Option 
                  v-for="(item, index) in dataNameArr"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <div class="content-top-common contnt-top-form2">
          <Form
            :label-width="58"
          >
            <FormItem
              :label="deviceType"
            >
              <Select
                v-model="modelvalue2"
                style="height:24px"
                filterable
                :clearable="ifclearSelect"
                @on-change="deviceTypeChange"
              >
                <Option 
                  v-for="(item, index) in deviceNameArr"
                  :key="index"
                  :value="item.typeId"
                  :label="item.typeName"
                />
              </Select>
            </FormItem>
          </Form>
        </div>
        <div class="content-top-common contnt-top-form3">
          <Button 
            type="primary"
            size="small"
            style="height:24px"
            @click.stop.prevent="selectDeviceType"
          >
            {{ titleText[0] }}
          </Button>
          <Button
            small
            size="small"
            style="height:24px"
            @click.stop.prevent="resetHandle"
          >
            {{ titleText[1] }}
          </Button>
        </div>
      </div>
      <div class="content-wrap">
        <div class="content-common content-left">
          <div class="content-common-top">
            <Input
              v-model="inputParamName"
              class="inputParamName"
              :placeholder="placeTextArr[0]"
              suffix="ios-search"
              @on-focus="focusHandle"
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
                  :label="item.paramId"
                  size="small"
                >
                  <span>{{ item.paramName }}</span>
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
                {{ selectAll }}
              </Checkbox>
            </div>
            <div class="data-botton-right">
              <template v-if="paramsNameList.length">
                <Page 
                  :current="PAGE_CURREN"
                  :page-size="PAGE_SIZE"
                  :total="paramNumber"
                  simple
                  @on-change="paramPageChangeHandle"
                />
              </template>
            </div>
          </div>
        </div>
        <div class="content-common content-right">
          <div class="content-common-top">
            <Input 
              v-model="inputDeviceName"
              :placeholder="placeTextArr[1]"
              class="inputDeviceName"
              suffix="ios-search"
              @on-focus="focusHandle"
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
                  :label="item.deviceId"
                  size="small"
                >
                  <span>{{ item.deviceName }}</span>
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
                {{ selectAll }}
              </Checkbox>
            </div>
            <div class="data-botton-right">
              <template v-if="deviceNameList.length">
                <Page 
                  :current="PAGE_CURREN"
                  :page-size="PAGE_SIZE"
                  :total="deviceNumber"
                  simple
                  @on-change="devicePageChangeHandle"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button
          size="small"
          style="height:28px;width:84px"
          @click.stop.prevent="cancelHandle"
        >
          {{ titleText[2] }}
        </Button> 
        <Button
          type="primary"
          size="small"
          style="height:28px;width:84px"
          :loading="loading"
          @click.stop.prevent="saveHandle"
        >
          {{ titleText[3] }}
        </Button> 
      </div>
    </Modal>
  </div>
</template> 
<script>
import {Modal, Form,FormItem, Button,Checkbox,CheckboxGroup, Page, Input, Select,Option, Message} from 'iview'
// import DataSourceSelect from './dataSource-select'
import NoData from './nodata'
import {Promise} from 'q';
export default{
    components: {
        Modal,
        Form,
        FormItem,
        Button,
        Input,
        Checkbox,
        CheckboxGroup,
        NoData,
        Page,
        Select,
        Option
    },
    data() {
        return {
            showdatasoures: true,
            datasouresAlertName: '导入数据源',
            placeTextArr: ['输入参数名称', '输入设备名称'],
            titleText:['搜索', '重置', '取消', '确认'],
            derectionArr: ['right', 'right'],
            dataName: '数据源',
            deviceType: '设备类型',
            selectAll: '全选',
            dataNameArr: [
                {
                    value: '1',
                    label: 'IOT平台'
                }
            ],
            deviceNameArr:[],
            modelvalue1:'1',
            modelvalue2:'',
            formValidate: {
                datasource: ''
            },
            paramsNameList:[],
            deviceNameList:[],
            paramsNameListArr: [],
            deviceNameListArr: [],
            indeterminateArr: ['',false, false],
            checkAllArr: ['',false, false],
            nodata:'暂无数据',
            PAGE_CURREN: 1,
            PAGE_SIZE: 10,
            inputParamName: '',
            inputDeviceName: '',
            loading: false,
            paramIdArr: [],
            deviceIdArr: [],
            ifclearSelect: true,
            deviceNumber: '',
            paramNumber: '',
            paramsPageCurrent: 1,
            devicePageCurrent: 1
        }
    },
    created() {
    },
    mounted() {
        this.init();
        let InputEle1 = document.querySelector('.inputParamName input')
        let InputEle2 = document.querySelector('.inputDeviceName input')
        InputEle1.oninput = this.debounce(this.InputSelectHandle, 1000 , 1)
        InputEle2.oninput = this.debounce(this.InputSelectHandle, 1000, 2)
    },
    methods: {
        // 拿到设备类型列表
        init() {
            this.requestUtil.get(this.urls.devicetypelist.url).then((res) => {
                this.deviceNameArr = res.returnObj || []
            }).catch(() => {
                Message.error('系统繁忙，请稍后再试试')
                return false
            })
        },
        // 取消事件
        cancelHandle() {
            this.$emit('triggerCancel')
        },
        saveHandle() {
            if (!this.modelvalue2) {
                Message.warning(`请选择设备类型`)
                return
            }
            if (!this.deviceIdArr.length && !this.paramIdArr.length) {
                Message.warning(`请勾选参数名或者设备名称`)
                return false
            }
            let studioId = sessionStorage.getItem("applyId") || ''
            let objData = {
                studioId,
                deviceTypeId: this.modelvalue2,
                deviceIds: this.deviceIdArr,
                paramIds: this.paramIdArr
            }
            this.loading = true
            this.requestUtil.post(this.urls.importDataSource.url,objData).then((res) => {
                if (res.code === '0') {
                    Message.success(`导入${this.dataName}成功`)
                    this.loading = false
                    this.$emit('saveHandleToUpdata')
                    this.$emit('triggerCancel')
                    return false
                }
                
            }).catch(() => {
                this.loading = false
                Message.error('系统繁忙，请稍后再试')
                return false
            })

        },
        handleCheckAll(number) {
            console.log(this.indeterminateArr[number])
            if (this.indeterminateArr[number]) {
                this.checkAllArr[number] = false;
            } else {
                this.checkAllArr[number] = !this.checkAllArr[number];
            }
            this.indeterminateArr[number] = false;
            let dataArr = number === 1 ? this.paramsNameList : this.deviceNameList
            console.log(dataArr)
            if (this.checkAllArr[number]) {
                dataArr.forEach((item) => {
                    if (number === 1) {
                        this.paramsNameListArr.push(item.paramId)
                    } else {
                        this.deviceNameListArr.push(item.deviceId)
                    }
                })
            } else {
                if (number === 1) {
                    this.paramsNameListArr = [];
                } else {
                    this.deviceNameListArr = [];
                }
            }
            this.paramIdArr = this.paramsNameListArr
            this.deviceIdArr = this.deviceNameListArr
            console.log()
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
            if (+number === 1) {
                this.paramIdArr = data
            } else if(+number === 2) {
                this.deviceIdArr = data
            }
        },
        focusHandle() {
            if (!this.modelvalue2) {
                Message.warning(`请选择设备类型`)
            } 
        },
        InputSelectHandle(value, type) {
            if (!this.modelvalue2) {
                Message.warning(`请选择设备类型`)
            } else {
                let objData = {
                    deviceTypeId : this.modelvalue2,
                    studioId: sessionStorage.getItem("applyId") || '',
                    type: 0,
                    size:this.PAGE_SIZE,
                    current:this.PAGE_CURREN
                }
                if (+type === 1) {
                    objData.paramName = value.trim()
                }
                if (+type === 2) {
                    objData.deviceName = value.trim()
                }
                console.log(objData)
                let newUrl = +type === 1 ? this.urls.deviceParamList.url : this.urls.deviceEquipList.url
                this.requestUtil.post(newUrl,objData).then((res) => {
                    if (+type === 1) {
                        this.paramsNameList = res.records || []
                    } else {
                        this.deviceNameList = res.records || []
                    }
                })
            }
        },
        debounce(handle, deLay, type) {
            var timer = null
            return function() {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    handle.call(this, this.value, type)
                }, deLay);
            }
        },
        // 搜素事件
        async selectDeviceType() {
            if (!this.modelvalue2) {
                Message.warning(`${this.deviceType}不能为空`)
            } else { // 搜素
                let objData = {
                    deviceTypeId: this.modelvalue2,
                    current:this.PAGE_CURREN,
                    size:this.PAGE_SIZE,
                    studioId: sessionStorage.getItem("applyId") || '',
                    type: 0
                }
                const [pramsName, deviceName] = await Promise.all([
                    this.requestUtil.post(this.urls.deviceParamList.url, objData),
                    this.requestUtil.post(this.urls.deviceEquipList.url, objData)
                ])
                this.paramsNameList = pramsName.records || []
                this.paramNumber = pramsName.total || 10
                this.deviceNameList = deviceName.records || []
                this.deviceNumber = deviceName.total || 10
            }
        },
        deviceTypeChange() {
            this.paramsNameList = []
            this.deviceNameList = []
        },
        // 重置事件
        resetHandle() {
            this.paramsNameList = []
            this.deviceNameList = []
            this.modelvalue2 = ''
        },
        // 参数名称
        paramPageChangeHandle(value) {
            console.log(value)
            // this.paramsPageCurrent = value
            this.pageChangeHandle(value, 1)
        },
        // 翻页设备名称
        devicePageChangeHandle(value) {
            // this.devicePageCurrent = value
            this.pageChangeHandle(value, 2)
        },
        pageChangeHandle(value, type) {
            let objData = {
                deviceTypeId: this.modelvalue2,
                current:value,
                size:this.PAGE_SIZE,
                studioId: sessionStorage.getItem("applyId") || '',
                type: 0
            }
            let NewUrl = type === 1 ? this.urls.deviceParamList.url : this.urls.deviceEquipList.url
            this.requestUtil.post(NewUrl, objData).then((res) => {
                if (type === 1) {
                    this.paramsNameList = res.records || []
                } else {
                    this.deviceNameList = res.records || []
                }
            })
        }
    }
}
</script>
<style lang="less">
  .importdata-model{
    .ivu-modal-wrap{
      .ivu-modal{
        .ivu-modal-content{
            background-color:#f5f5f5 !important;
            .ivu-modal-header{
                height: 36px;
                padding:0;
                .ivu-modal-header-inner{
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
                    padding-top: 12px;
                    padding-left:10px;
                  }
                }
              }
              .content-wrap{
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
                background: url(../../assets/images/default/closeDialog.png) no-repeat center center;
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
    .ivu-select{
      .ivu-select-selection{
        height:24px;
      }
      .ivu-select-input{
        height:22px;
      }
      .ivu-select-placeholder{
        height:24px;
      }
      .ivu-select-selected-value{
          height:24px;
          line-height:22px;
      }
      .ivu-select-dropdown{
        .ivu-select-dropdown-list{
          .ivu-select-item{
            padding: 0 16px 0;
          }
        }
      }
    }
    .ivu-checkbox-small{
      .ivu-checkbox-checked{
        .ivu-checkbox-inner::after{
          left:4px;
        }
      }
    }
  }

</style>
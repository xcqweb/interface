<template>
  <div class="data-sources">
    <div class="data-sources-top">
      <div
        class="data-sources-listname"
        style="height:auto;padding-top:5px;"
      >
        <span>
          {{ dataName }}
        </span>
      </div>
      <div>
        <Select
          v-model="modelvalue1"
          :clearable="ifclearSelect"
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
      </div>
      <div class="data-sources-listname">
        <span>
          {{ deviceType }}
        </span>
      </div>
      <div>
        <Select
          v-model="modelvalue2"
          style="height:24px"
          @on-change="deviceTypeHandle"
        >
          <Option 
            v-for="(item, index) in deviceNameArr"
            :key="index"
            :value="item.deviceTypeId"
          >
            {{ item.deviceTypeName }}
          </Option>
        </Select>
      </div>
      <div class="data-sources-listname">
        <span>
          {{ deviceName }}
        </span>
      </div>
    </div>
    <div class="data-sources-center">
      <div class="devicename-input-wrap">
        <Input 
          :placetext="placeText"
          class="inputDeviceName"
          :derection="derection"
        />
      </div>
      <div
        class="devicename-list-wrap"
      >
        <div
          v-if="deviceNameList.length"
        >
          <CheckboxGroup
            v-model="deviceNameListArr"
            class="devicename-listUl"
            @on-change="checkAllGroupChange"
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
      <div class="devicename-page-wrap">
        <template v-if="deviceNameList.length">
          <Page 
            :current="PAGE_CURRENT" 
            :page-size="PAGE_SIZE"
            :total="deviceListTotal"
            simple
            @on-change="PageChangeHandle"
          />
        </template>
      </div>
    </div>
    <div class="data-sources-bottom">
      <Button 
        type="primary"
        long
        :disabled="!deviceIdArr.length"
        @click.stop.prevent="bindDeviceNameHandle"
      >
        {{ buttonName }}
      </Button>
    </div>
  </div>
</template>

<script>
import Input from '../../datasource/input-select'
import VueEvent from '../../../services/VueEvent.js'
import NoData from '../../datasource/nodata'
import {Button,Page,Checkbox,Message,Select,Option, CheckboxGroup} from 'iview'
const singleDeviceName = ['image','userimage','tableBox','rectangle','ellipse','light','progress','gaugeChart']
const DataSourceID = {
    id: '123',
    name:'IOT平台'
}
export default{
    components: {
        Button,
        Input,
        Page,
        Checkbox,
        Select,
        Option,
        NoData,
        CheckboxGroup
    },
    data() {
        return {
            dataName: '数据源',
            deviceType: '设备类型',
            deviceName: '设备名称',
            placeText: '搜索设备名称',
            derection: 'right',
            nodata: '暂无数据',
            dataNameArr: [
                {
                    value: '1',
                    label: 'IOT平台'
                }
            ],
            deviceNameArr:[],
            deviceNameList:[],
            single: false,
            buttonName: '绑定',
            modelvalue1:'1',
            modelvalue2:'',
            ifclearSelect:true,
            deviceNamePageNumber: 1,
            deviceListTotal:10,
            studioIdNew:'',
            deviceNameListArr:[],
            deviceIdArr:[],
            shapeName: null,
            PAGE_CURRENT: 1,
            PAGE_SIZE: 10,
        }
    },
    mounted() {
        this.studioIdNew = sessionStorage.getItem("applyId") || ''
        let InputEle1 = document.querySelector('.inputDeviceName input');
        InputEle1.oninput = this.debounce(this.InputSelectHandle, 1000)
        this.init()
    },
    methods: {
        init() {
            this.shapeName = this.$store.state.main.widgetInfo.shapeInfo.shape
            let objData = {
                studioId:this.studioIdNew
            }
            this.requestUtil.get(this.urls.hasImportDeviceType.url,objData).then((res) => {
                this.deviceNameArr = res || []
                if (this.deviceNameArr.length) {
                    this.modelvalue2 = this.deviceNameArr[0].deviceTypeId
                    let objDataNew = {
                        studioId:this.studioIdNew,
                        deviceTypeId: this.deviceNameArr[0].deviceTypeId,
                        size:this.PAGE_SIZE,
                        current:this.PAGE_CURRENT,
                        type: 1
                    }
                    return Promise.all([
                        this.requestUtil.post(this.urls.deviceEquipList.url, objDataNew)
                    ]).catch(() => {
                        Message.error('系统繁忙，请稍后再试')
                        return false
                    })
                } else {
                    this.deviceNameList = []
                    return [[]]
                }
            }).then((res) => {
                const [firstDeviceNameList] = res
                this.deviceNameList = firstDeviceNameList.records || []
                this.deviceListTotal = firstDeviceNameList.total || 10
            }).catch(() => {
                Message.error('系统繁忙，请稍后再试试')
                return false
            })
        },
        checkAllGroupChange(data) {
            this.deviceIdArr = data
        },
        deviceTypeHandle(data) {
            // 清空之前勾选的
            this.deviceNameListArr = []
            this.deviceIdArr = []
            let objData = {
                studioId:this.studioIdNew,
                deviceTypeId: data,
                size:this.PAGE_SIZE,
                current:this.PAGE_CURRENT,
                type: 1
            }
            this.requestUtil.post(this.urls.deviceEquipList.url, objData).then((res) => {
                this.deviceNameList = res.records || []
                this.deviceListTotal = res.total || 10
            }).catch(() => {
                Message.error('系统繁忙，请稍后再试')
                return false
            })
        },
        bindDeviceNameHandle() {
            let startBindData = this.getCellModelInfo('bindData')
            if (singleDeviceName.includes(this.shapeName) && this.deviceIdArr.length > 1) { // 绑定单个
                Message.warning('此控件不允许绑定多个设备名称')
                return false
            }  
            if (singleDeviceName.includes(this.shapeName) && startBindData && startBindData.dataSource && startBindData.dataSource.deviceNameChild) {                    
                Message.warning('此控件已经绑定设备名称')
                return false
            }
            if (startBindData && startBindData.dataSource) {
                let deviceTypeData = startBindData.dataSource.deviceTypeChild || {}
                if (deviceTypeData.id && deviceTypeData.id !== this.modelvalue2) {
                    Message.warning('此控件不允许绑定多个设备类型')
                    return false
                }
            }
            // 组装数据 绑定
            let DeviceIndex = null
            let deviceNameIndex = null
            this.deviceNameArr.forEach((item, index) => {
                if (item.deviceTypeId === this.modelvalue2) {
                    DeviceIndex = index
                }
            })
            let objData = {}
            objData.dataSourceChild = DataSourceID
            objData.deviceTypeChild = {
                id: this.deviceNameArr[DeviceIndex].deviceTypeId,
                name: this.deviceNameArr[DeviceIndex].deviceTypeName || ''
            }
            // deviceNameChild
            objData.deviceNameChild = []
            this.deviceIdArr.forEach((items, key) => {
                this.deviceNameList.forEach((item, index) => {
                    if (item.deviceId === items) {
                        deviceNameIndex = index
                    }
                }) 
                objData.deviceNameChild[key] = {}
                objData.deviceNameChild[key].id = items
                objData.deviceNameChild[key].name = this.deviceNameList[deviceNameIndex].deviceName || ''
            })
            console.log(objData)
            if (objData) {
                VueEvent.$emit('emitDataSourceFooter', objData)
                this.deviceNameListArr = []
                this.deviceIdArr = []
            }
        },
        getCellModelInfo(key) {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let modelInfo = graph.getModel().getValue(cell)
            let bindData = null
            if(modelInfo) {
                let bindAttr = modelInfo.getAttribute(key)
                if(bindAttr) {
                    bindData = JSON.parse(bindAttr)
                }
            }
            return bindData
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
        InputSelectHandle(value) {
            if (!this.modelvalue2) {
                Message.warning(`请选择设备类型`)
            } else {
                let objData = {
                    deviceTypeId : this.modelvalue2,
                    deviceName: value.trim(),
                    studioId: this.studioIdNew,
                    type: 1,
                    size:this.PAGE_SIZE,
                    current:this.PAGE_CURRENT,
                }
                this.requestUtil.post(this.urls.deviceEquipList.url,objData).then((res) => {
                    this.deviceNameList = res.records || []
                })
            }
        },
        PageChangeHandle(value) {
            let objData = {
                deviceTypeId: this.modelvalue2,
                studioId: this.studioIdNew,
                current: value,
                size:this.PAGE_SIZE,
                type:1
            }
            this.PageChangeAjax(objData)
        },
        PageChangeAjax(objData) {
            this.requestUtil.post(this.urls.deviceEquipList.url, objData).then((res) => {
                this.deviceNameList = res.records || []
            }).catch(() => {
                Message.error('系统繁忙，请稍后再试')
                return false
            })
        }
    },      
}
</script>

<style scoped lang="less">
  .data-sources{
    padding:5px;
    display: flex;
    flex-direction: column;
    height:100%;
    .data-sources-top{
      height: 156px;
      .data-sources-listname{
        height:36px;
        color:11px;
        display: flex;
        align-items: flex-end;
      }
    }
    .data-sources-center{
      flex:1;
      background: #ffffff;
      border:1px solid #d4d4d4;
      border-radius: 2px;
      padding:5px;
      display: flex;
      flex-direction: column;
      .devicename-input-wrap{
        height:24px;
      }
      .devicename-list-wrap{
        background: #fff;
        flex:1;
        .devicename-listUl{
          label{
            width:100%
          }
          padding: 5px 0;
          li{
            height:26px;
            display: flex;
            align-items: center;
          }
        }
      }
      .devicename-page-wrap{
        height:24px;
        text-align: center;
      }
    }
    .data-sources-bottom{
      height:100px;
      padding-top:12px;
      button{
        height:24px;
        line-height: 20px;
        padding:0;
        span{
          display: inline-block;
          height:24px;
        }
      }
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
            line-height:24px;
        }
        .ivu-select-dropdown{
          .ivu-select-dropdown-list{
            .ivu-select-item{
              padding: 0 16px 0;
            }
          }
        }
    }
    .no-data-wrap{
          height:100%;
          display: flex;
          justify-content: center;
          align-items: center;
    }
    /deep/.ivu-checkbox-inner{
      &:after{
        top:2px !important;
        left:5px !important;
      }
    }
  }
</style>

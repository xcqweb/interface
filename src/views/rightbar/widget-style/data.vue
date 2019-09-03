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
          :clearable="ifclearSelect"
          style="height:24px"
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
              :label="item"
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
            :current="1" 
            :page-size="deviceNamePageNumber"
            :total="deviceListTotal" 
            simple
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
import NoData from '../../datasource/nodata'
import {Button,Page,Checkbox,Message,Select,Option, CheckboxGroup} from 'iview'
const singleDeviceName = ['image','userimage','tableBox','rectangle','ellipse','light','progress']
// const multipleDeviceName = ['lineChart','gaugeChart']
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
            placeText: '搜素设备名称',
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
            shapeName: null
        }
    },
    mounted() {
        this.studioIdNew = sessionStorage.getItem("applyId") || ''
        this.init()
    },
    methods: {
        init() {
            this.shapeName = this.$store.state.main.widgetInfo.shapeInfo.shape
            console.log(this.shapeName)
            let objData = {
                studioId:this.studioIdNew
            }
            this.requestUtil.get(this.urls.hasImportDeviceType.url,objData).then((res) => {
                this.deviceNameArr = res || []
                if (this.deviceNameArr.length) {
                    this.modelvalue2 = this.deviceNameArr[0].deviceTypeId
                    let objDataNew = {
                        studioId:this.studioIdNew,
                        deviceTypeId: this.deviceNameArr[0].deviceTypeId
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
            console.log(this.deviceIdArr)
        },
        bindDeviceNameHandle() {
            if (singleDeviceName.includes(this.shapeName) && this.deviceIdArr.length > 1) { // 绑定单个
                Message.warning('此控件不允许绑定多个设备名称')
                return false
            }
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

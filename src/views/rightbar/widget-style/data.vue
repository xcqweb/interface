<template>
  <div class="data-sources">
    <div class="data-sources-top">
      <div class="data-sources-listname">
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
        <ul
          v-if="deviceNameList.length"
          class="devicename-listUl"
        >
          <li 
            v-for="(item, index) in deviceNameList"
            :key="index"
          >
            <Checkbox
              size="small"
            >
              {{ item.name }}
            </Checkbox>
          </li>
        </ul>
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
      >
        {{ buttonName }}
      </Button>
    </div>
  </div>
</template>

<script>
import Input from '../../datasource/input-select'
import NoData from '../../datasource/nodata'
import {Button,Page,Checkbox,Message,Select,Option} from 'iview'
export default{
    components: {
        Button,
        Input,
        Page,
        Checkbox,
        Select,
        Option,
        NoData
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
            deviceListTotal:10
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let objData = {
                studioId:sessionStorage.getItem("applyId") || ''
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
                        this.requestUtil.post(this.urls.deviceParamList.url, objDataNew)
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
            /deep/.ivu-checkbox-checked {
                .ivu-checkbox-inner::after{
                  top:2px !important;
                  left:4px !important;
                }
            }
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
        line-height: 22px;
        padding:0;
        span{
          display: inline-block;
          height:24px;
          line-height: 22px;
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
  }
</style>

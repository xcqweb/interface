<template>
  <div class="data-sources">
    <div>
      <div
        class="data-sources-listname"
      >
        <span>
          {{ $t('deviceType') }}
        </span>
      </div>
      <div>
        <Select
          v-model="model.deviceTypeId"
          style="height:24px"
        >
          <Option
            v-for="(item) in typeData"
            :key="item.deviceTypeId"
            :value="item.deviceTypeId"
          >
            {{ item.deviceTypeName }}
          </Option>
        </Select>
      </div>
      <div class="data-sources-listname">
        <span>
          {{ $t('deviceModal') }}
        </span>
      </div>
      <div>
        <Select
          v-model="model.deviceModelId"
          style="height:24px"
        >
          <Option 
            v-for="(item) in modelData"
            :key="item.deviceModelId"
            :value="item.deviceModelId"
          >
            {{ item.deviceModelName }}
          </Option>
        </Select>
      </div>
      <div class="data-sources-listname">
        <span>
          {{ $t('deviceName') }}
        </span>
      </div>
    </div>
    <div class="data-sources-center">
      <div class="devicename-input-wrap">
        <Input
          v-model.trim="dName"
          size="small"
          :placeholder="$t('searchDeviceName')"
        />
      </div>
      <div
        class="devicename-list-wrap"
      >
        <div
          v-if="deviceData.length"
        >
          <CheckboxGroup
            v-model="checkModelArr"
            class="devicename-listUl"
            @on-change="checkAllGroupChange"
          >
            <Checkbox
              v-for="(item) in deviceData"
              v-show="!dName || item.deviceName.toUpperCase().includes(dName.toUpperCase())"
              :key="item.deviceId"
              :label="item.deviceId"
              size="small"
            >
              <span 
                :title="item.deviceName" 
                style="display:inline-block;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;"
              >
                {{ item.deviceName }}
              </span>
            </Checkbox>
          </CheckboxGroup>
        </div>
        <NoData
          v-else
          :text="$t('noData')"
        />
      </div> 
    </div>
    <div class="data-sources-bottom">
      <Button 
        type="primary"
        style="cursor: pointer;"
        long
        :disabled="!checkModelArr.length"
        @click.stop.prevent="bindDeviceNameHandle"
      >
        {{ $t('rightBar.bindText') }}
      </Button>
    </div>
  </div>
</template>

<script>
import VueEvent from '../../../services/VueEvent.js'
import NoData from '../../data-source/nodata'
import DatasourceStore from '../../data-source/js/datasource-store'
import {Button,Checkbox,Message,Select,Option, CheckboxGroup,Input} from 'iview'

const singleDeviceName = ['image','userimage','tableCell','rectangle','ellipse','light','progress','gaugeChart','triangle','pentagram']
//lineChart 多设备 多参数 gaugeChart 单设备 多参数
export default{
    components: {
        Button,
        Checkbox,
        Select,
        Option,
        NoData,
        CheckboxGroup,
        Input
    },
    mixins: [DatasourceStore],
    data() {
        return {
            dName:"",
            checkModelArr:[],
            bindData:null,
        }
    },
    computed: {
        shapeName() {
            return this.$store.state.main.widgetInfo.shapeInfo.shape
        },
    },
    watch: {
        'model.deviceTypeId'() {
            this.dName = '';
        },
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.getStudioDeviceData()
            this.bindData =  this.getCellModelInfo('bindData')
            if(this.bindData && this.bindData.dataSource) {
                this.model.deviceModelId = this.bindData.dataSource.deviceTypeChild.id
                let bindDeviceNames = this.bindData.dataSource.deviceNameChild
                if(Array.isArray(bindDeviceNames)) {
                    bindDeviceNames.forEach(item=>{
                        this.checkModelArr.push(item.id)
                    })
                }else{
                    this.checkModelArr.splice(0)
                    if(bindDeviceNames.id) {
                        this.checkModelArr.push(bindDeviceNames.id)
                    }
                }
            }
        },
        bindDeviceNameHandle() {
            this.bindData = this.getCellModelInfo('bindData')
            if (singleDeviceName.includes(this.shapeName) && this.checkModelArr.length > 1) { // 绑定单个
                Message.warning(`${this.$t('rightBar.multiplyBindDevice')}`)
                // 清空勾选
                this.checkModelArr = []
                return
            }  
            if (singleDeviceName.includes(this.shapeName) && this.bindData && this.bindData.dataSource) {                    
                Message.warning(`${this.$t('rightBar.hasBindDevice')}`)
                this.checkModelArr = []
                return
            }
            //组装数据 绑定
            let objData = {}
            objData.deviceTypeChild = {
                id: this.model.deviceTypeId,
                name: this.typeData[this.typeData.findIndex(item=>{return item.deviceTypeId == this.model.deviceTypeId})].deviceTypeName
            }
            objData.deviceModel = {
                id: this.model.deviceModelId,
                name: this.modelData[this.modelData.findIndex(item=>{return item.deviceModelId == this.model.deviceModelId})].deviceModelName
            }
            if(this.shapeName === 'lineChart') {
                objData.deviceNameChild = []
                if(this.bindData && this.bindData.deviceModel) {
                    if(this.model.deviceModelId != this.bindData.deviceModel.id) {
                        Message.warning(`${this.$t('rightBar.notAllowBindMyltiplyDeviceModel')}`)
                    }else{
                        let deviceNameChildTemp = this.bindData.deviceNameChild
                        if(!Array.isArray(deviceNameChildTemp)) {
                            objData.deviceNameChild.push(deviceNameChildTemp)
                        }
                    }
                }
                let tempArr = []
                this.checkModelArr.forEach((item) => {
                    tempArr.push({id:item,name:this.deviceData[this.deviceData.findIndex(d=>{return d.deviceId == item})].deviceName})
                })
                objData.deviceNameChild = objData.deviceNameChild.concat(tempArr)
            }else{
                objData.deviceNameChild = {}
                this.checkModelArr.forEach((item) => {
                    objData.deviceNameChild = {id:item,name:this.deviceData[this.deviceData.findIndex(d=>{return d.deviceId == item})].deviceName}
                })
            }
            if (objData) {
                VueEvent.$emit('emitDataSourceFooter', objData)
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
        checkAllGroupChange(data) {
            this.checkModelArr = data
        }
    },      
}
</script>

<style scoped lang="less">
  .data-sources{
    padding:0 4px 4px;
    display: flex;
    flex-direction: column;
    height:100%;
    .data-sources-listname{
      margin-top:10px;
      display: flex;
      align-items: flex-end;
    }
    .data-sources-center{
      height:calc(100% - 100px);
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
        height:100%;
        overflow-y: auto;
        overflow-x:hidden;
        .devicename-listUl{
          label{
            width:100%;
            /deep/.ivu-checkbox{
              vertical-align: top;
              .ivu-checkbox-inner{
                top:3px;
              }
            }
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

<template>
  <div class="data-sources">
    <div>
      <div class="data-sources-listname">
        <span>
          应用名称
        </span>
      </div>
    </div>
    <div class="data-sources-center">
      <div class="devicename-input-wrap">
        <Input
          v-model.trim="dName"
          size="small"
          :placeholder="$t('searchApplyName')"
        />
      </div>
      <div
        class="devicename-list-wrap"
      >
        <div
          v-if="predData.length"
        >
          <CheckboxGroup
            v-model="checkModelArr"
            class="devicename-listUl"
            @on-change="checkAllGroupChange"
          >
            <Checkbox
              v-for="(item) in predData"
              v-show="!dName || item.appName.toUpperCase().includes(dName.toUpperCase())"
              :key="item.appId"
              :label="item.appId"
              size="small"
            >
              <span 
                :title="item.appName" 
                style="display:inline-block;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;"
              >
                {{ item.appName }}
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
    <!-- footer -->
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
import VueEvent from '../../../../services/VueEvent.js'
import NoData from '../../../data-source/nodata'
import DatasourceStore from '../../../data-source/js/datasource-store'
import {Button,Checkbox,Message,CheckboxGroup,Input} from 'iview'

const singleDeviceName = ['image','userimage','tableCell','rectangle','ellipse','light','progress','gaugeChart','triangle','pentagram']
//lineChart 多设备 多参数 gaugeChart 单设备 多参数
export default{
  components: {
    Button,
    Checkbox,
    NoData,
    CheckboxGroup,
    Input,
  },
  mixins: [DatasourceStore],
  data() {
    return {
      dName:"",
      checkModelArr:[],
      bindData:null,
      typeTab: 1,
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
    changeTab(index) {
      this.typeTab = index
    },
    selectChange() {
      this.checkModelArr = []
    },
    init() {
      this.getPredictionData()
      this.bindData =  this.getCellModelInfo('bindData')
      if(this.bindData && this.bindData.dataSource && this.bindData.dataSource.type === 1) {
        let bindDeviceNames = this.bindData.dataSource.deviceNameChild
        this.applyObj.forecastId = bindDeviceNames.id
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
      // 注意要兼容就应用 没有type
      console.log(this.bindData)
      if (this.bindData && this.bindData.dataSource && (this.bindData.dataSource.type === 0 || this.bindData.dataSource.type === 2 || this.bindData.dataSource.type)) {
        Message.warning(`${this.$t('rightBar.onlyOneTypeDatas')}`)
        this.checkModelArr = []
        return
      }
      if (singleDeviceName.includes(this.shapeName) && this.checkModelArr.length > 1) { // 绑定单个参数
        Message.warning(`${this.$t('rightBar.multiplyBindDevice')}`)
        // 清空勾选
        this.checkModelArr = []
        return
      }
      // 已经绑定数据源
      if (singleDeviceName.includes(this.shapeName) && this.bindData && this.bindData.dataSource) {                    
        Message.warning(`${this.$t('rightBar.hasBindDevice')}`)
        this.checkModelArr = []
        return
      }
      /*
      * 组装数据 绑定
      * objData = {
      *   deviceNameChild: {
      *       id: appId,
      *       name: appName
      *   },
      *   type: 1, // 预测应用
      * }
      */
      let objData = {
        type: 1,
      }
      if(this.shapeName === 'lineChart') {
        objData.deviceNameChild = []
        if(this.bindData && this.bindData.dataSource.deviceNameChild) {
          // 处理多个参数
          let deviceNameChildTemp = this.bindData.dataSource.deviceNameChild
          if(!Array.isArray(deviceNameChildTemp)) {
            objData.deviceNameChild.push(deviceNameChildTemp)
          }
        }
        let tempArr = []
        this.checkModelArr.forEach((item) => {
          tempArr.push({id:item,name:this.predData.find(d=>{return d.appId == item}).appName})
        })
        objData.deviceNameChild = objData.deviceNameChild.concat(tempArr)
      }else{
        objData.deviceNameChild = {}
        this.checkModelArr.forEach((item) => {
          objData.deviceNameChild = {id:item,name:this.predData.find(d=>{return d.appId == item}).appName}
        })
      }
      if (objData) {
        VueEvent.$emit('emitDataSourceFooter', objData)
        Message.success(`${this.$t('rightBar.bindSuccess')}`)
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
      height:calc(100% - 208px);
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
        max-height:calc(100% - 24px);
        overflow-y: auto;
        overflow-x:hidden;
        .devicename-listUl{
          label{
            width:100%;
            /deep/.ivu-checkbox{
              vertical-align: top;
              .ivu-checkbox-inner{
                top:1px !important;
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
        top:1px !important;
        left:4px !important;
      }
    }
    /deep/.data-source-tab {
      position: relative;
      .source-tab-common{
        display: flex;
        height:26px;
        line-height:24px;
        background:#fff;
        border:1px solid rgba(212,212,212,1);
        border-radius:2px 0px 0px 2px;
        .source-tab{
          flex:1;
          text-align:center;
          cursor: pointer;
          &.selected{
            background:rgba(61,145,247,1);
            border:1px solid rgba(39,122,224,1);
            color:#fff;
          }
        }
      }
    }
  }
</style>

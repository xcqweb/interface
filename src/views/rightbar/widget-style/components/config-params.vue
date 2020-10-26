<template>
  <Modal
    v-model="modalShow"
    class="config-con custom-modal"
    title="传递参数"
    :width="960"
    :mask-closable="false"
  >
    <div
      class="icon-wrap-add"
      @click="addRow"
    >
      <span class="icon-add" />新增一行
    </div>
    <Table
      border
      :columns="columns"
      :data="tableData"
      :max-height="200"
      class="cus-table"
    />
    <!-- 按钮 -->
    <div slot="footer">
      <Button
        @click="cancel"
      >
        {{ $t('cancel') }}
      </Button>
      <Button
        type="primary"
        @click="submit"
      >
        {{ $t('confirm') }}
      </Button>
    </div>
    <SelectParams
      v-model="visible"
      title="选择设备参数"
      :device-model-id="deviceModelId"
      :device-id="deviceId"
      :multiple="false"
      :from-text="0"
      @callback="addParamDone"
    />
  </Modal>
</template>

<script>
import {Modal, Button,Table,Message} from 'iview'
import {mxUtils} from "../../../../services/mxGlobal"
import {timeArr} from '../../../../constants/config-param-time'
const initData = {
  paramIdentify:'',
  paramType:'',
  configParamType:'',
  targetParam:'',
}
export default {
  components: {
    Modal,
    Button,
    Table,
    SelectParams: resolve => {
      return require(["../../../data-source/select-params"], resolve)
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modalShow:false,
      modifyData:{...initData},
      tableData:[{...initData}],
      deviceModelId:'',
      deviceId:'',
      visible:false,
      editIndex:-1,
      columns:[
        {
          title:'参数标识',
          key:'paramIdentify',
          width:120,
          ellipsis:true,
          tooltip:true,
          render: (h, {row, index}) => {
            let edit
            if (this.editIndex === index) {
              this.modifyData.paramIdentify = this.modifyData.paramIdentify || row.paramIdentify
              edit = h('i-input', {
                props: {
                  value: row.paramIdentify,
                  placeholder:'请输入参数标识',
                  size:'small',
                },
                on: {
                  input: (val) => {
                    this.modifyData.paramIdentify = val
                  }
                }
              })
            } else {
              edit = row.paramIdentify
            }
            return h('div', [edit])
          }
        },
        {
          title:'参数类型',
          key:'paramType',
          width:180,
          ellipsis:true,
          tooltip:true,
          render: (h, {row, index}) => {
            let edit
            if (this.editIndex === index) {
              this.modifyData.paramType = this.modifyData.paramType || this.findArrValue(this.paramTypeList,row.paramType)
              edit = h('i-select', {
                props: {
                  value: this.modifyData.paramType,
                  placeholder:'请选择参数类型',
                  size:'small',
                },
                on: {
                  'on-change': (val) => {
                    this.modifyData.paramType = val
                    this.dealParamType(val)
                  }
                }
              },
              this.paramTypeList.map((item)=>{  
                return h('i-option', {  
                  props: {value: item.value}  
                }, item.label)
              }) 
              )
            } else {
              edit = row.paramType
            }
            return h('div', [edit])
          }
        },
        {
          title:'传参分类',
          key:'configParamType',
          width:180,
          ellipsis:true,
          tooltip:true,
          render: (h, {row, index}) => {
            let edit
            if (this.editIndex === index) {
              this.modifyData.configParamType = this.modifyData.configParamType || this.findArrValue(this.configParamTypeList,row.configParamType)
              edit = h('i-select', {
                props: {
                  value: this.modifyData.configParamType,
                  placeholder:'请选择传参分类',
                  size:'small',
                },
                on: {
                  'on-change': (val) => {
                    this.modifyData.configParamType = val
                    this.dealTarget()
                  }
                }
              },
              this.configParamTypeList.map((item)=>{  
                return h('i-option', {  
                  props: {value: item.value}  
                }, item.label)
              }) 
              )
            } else {
              edit = row.configParamType
            }
            return h('div', [edit])
          }
        },
        {
          title:'目标项目',
          key:'targetParam',
          ellipsis:true,
          tooltip:true,
          render: (h, {row, index}) => {
            let edit,arr = []
            if (this.editIndex === index) {
              this.modifyData.targetParam = this.modifyData.targetParam || row.targetParam
              const selectArr = ['devicePart','time','deviceProperty']
              if (selectArr.includes(this.modifyData.paramType)) {// 下拉框
                if(this.modifyData.paramType == 'time') {
                  arr = this.timeList
                } else if(this.modifyData.paramType == 'deviceProperty') {
                  arr = this.propertyList
                } else {
                  arr = this.partList.map(item=>{
                    return {
                      label:item.partId,
                      value:item.partId,
                    }
                  })
                  if(this.modifyData.configParamType == 'value') {
                    arr = this.partList.map(item=>{
                      return {
                        label:item.partName,
                        value:item.partName,
                      }
                    })
                  }
                }
                edit = h('i-select', {
                  props: {
                    value: this.modifyData.targetParam,
                    placeholder:'传参分类',
                    size:'small',
                  },
                  on: {
                    'on-change': (val) => {
                      this.modifyData.targetParam = val
                    }
                  }
                },
                arr.map((item)=>{  
                  return h('i-option', {  
                    props: {value: item.value}  
                  }, item.label)
                }) 
                )
              } else if(this.modifyData.paramType == 'deviceParam') {// 弹窗选择设备参数
                edit = h('div',{
                  style:{
                    cursor:'pointer'
                  },
                  on:{
                    click: () => {
                      this.addParam()
                    }
                  },
                },[
                  this.modifyData.targetParam || '选择设备参数',
                  h('i',{
                    style:{
                      fontSize:'20px'
                    },
                    attrs:{
                      class:'ivu-icon ivu-icon-ios-arrow-forward'
                    }
                  })
                ])
              } else {// 纯文本
                edit = this.modifyData.targetParam
              }
            } else {
              edit = row.targetParam
            }
            return h('div', [edit])
          }
        },
        {
          title:'操作',
          key:'operate',
          width:72,
          align:'center',
          render: (h, {row, index}) => {
            let edit
            if(this.editIndex == index) {// 编辑状态
              edit = [
                h('i',{
                  class: 'table-icon icon-save',
                  attrs: {
                    title: '保存',
                  },
                  on: {
                    click: () => {
                      this.saveRow()
                    },
                  },
                })
              ]
            } else {
              edit = [
                h('i',{
                  class: 'table-icon icon-edit',
                  attrs: {
                    title: '编辑',
                  },
                  on: {
                    click: () => {
                      this.editRow(index)
                    },
                  },
                })
              ]
            }
            edit.push(
              h('i',{
                class: 'table-icon icon-del',
                attrs: {
                  title: '删除',
                },
                on: {
                  click: () => {
                    this.delRow(row,index)
                  },
                },
              })
            )
            return h('div',edit)
          }
        }
      ],
      paramTypeList:[
        {label:'设备类型',value:'deviceType'},
        {label:'设备型号',value:'deviceModel'},
        {label:'设备',value:'device'},
        {label:'设备编号',value:'deviceNo'},
        {label:'设备位置',value:'deviceLocation'},
        {label:'设备参数',value:'deviceParam'},
        {label:'设备部件',value:'devicePart'},
        {label:'设备属性',value:'deviceProperty'},
        {label:'时间',value:'time'},
      ],
      timeList:timeArr,
      configParamTypeList:[
        {label:'项目id',value:'id'},
        {label:'项目值',value:'value'}
      ],
      propertyList:[ ],
      partList:[],
      startBindData:null
    }
  },
  watch: {
    value: {
      handler(val) {
        this.modalShow = val
        if(val) {
          this.init()
        }
      }
    },
    modalShow(val) {
      this.$emit('input', val)
    }
  },
  created() {
    const params = {studioId: sessionStorage.getItem('applyId')}
    this.$store.dispatch('loadStudioDevices', params)
    this.startBindData = this.getCellModelInfo("bindData")
    if(!this.startBindData) {
      return
    }
    let deviceNameChild = this.startBindData.dataSource.deviceNameChild
    if (!Array.isArray(deviceNameChild)) {
      deviceNameChild = [deviceNameChild]
    }
    this.deviceId = deviceNameChild[0].id  
    this.deviceModelId = this.startBindData.dataSource.deviceModel.id || ''
    // 获取设备属性
    this.requestUtil.get(`${this.urls.getDeviceTypeProperty.url}${this.startBindData.dataSource.deviceTypeChild.id}`).then(res => {
      if (res.configDtoList && res.configDtoList.length) {
        this.propertyList = res.configDtoList.map(item=>{
          return {
            label:item.attributeName,
            value:item.attributeName
          }
        })
      }
    })
    // 获取设备型号下的部件
    this.requestUtil.get(`${this.urls.deviceModelParts.url}${this.deviceModelId}`).then(res=>{
      if(res) {
        this.partList = res
      }
    })
  },
  methods: {
    saveRow() {
      if(!this.modifyData.paramIdentify) {
        Message.warning('参数标识不能为空')
        return
      }
      if(!this.modifyData.paramType) {
        Message.warning('参数类型不能为空')
        return
      }
      if(!this.modifyData.configParamType) {
        Message.warning('传参分类不能为空')
        return
      }
      if(!this.modifyData.targetParam) {
        Message.warning('目标项目不能为空')
        return
      }
      const listRes = this.tableData.map(item=>item.paramIdentify)
      const resArr = listRes.filter(item=>item === this.modifyData.paramIdentify)
      if(resArr.length > 1) {
        Message.warning('参数标识不能重复')
        return
      }
      let resObj = {...this.modifyData}
      resObj.paramType = this.findArrLable(this.paramTypeList,resObj.paramType)
      resObj.configParamType = this.findArrLable(this.configParamTypeList,resObj.configParamType)
      this.tableData.splice(this.editIndex,1,resObj)
      this.setCellModelInfo('configParams',[...this.tableData])// 保存数据
      this.editIndex = -1
      this.modifyData = {...initData}
    },
    findArrLable(arr,target) {
      const res = arr.find(item=>item.value == target)
      return res.label
    },
    findArrValue(arr,target) {
      if(!target) {
        return ''
      }
      const res = arr.find(item=>item.label == target)
      return res.value
    },
    editRow(index) {
      this.editIndex = index
    },
    delRow(row,index) {
      this.tableData.splice(index,1)
      if(this.editIndex != index) {
        this.setCellModelInfo('configParams',[...this.tableData])// 保存数据
      } else {
        this.editIndex = -1
        this.modifyData = {...initData}
      }
    },
    dealParamType(val) {
      if(val == 'deviceProperty' || val == 'deviceNo' || val == 'time') {
        this.configParamTypeList = [
          {label:'项目值',value:'value'},
        ]
        this.modifyData.configParamType = 'value'
      } else if(val == 'deviceLocation') {
        this.configParamTypeList = [
          {label:'项目值',value:'value'},
          {label:'项目id和值',value:'id@value'},
        ]
        this.modifyData.configParamType = 'value'
      } else {
        this.configParamTypeList = [
          {label:'项目id',value:'id'},
          {label:'项目值',value:'value'},
        ]
        this.modifyData.configParamType = 'id'
      }
      this.dealTarget()
    },
    dealTarget() {
      if(!this.modifyData.configParamType || !this.modifyData.paramType) {
        return
      }
      let deviceNameChild = this.startBindData.dataSource.deviceNameChild
      if (!Array.isArray(deviceNameChild)) {
        deviceNameChild = [deviceNameChild]
      }
      const arr = this.$store.state.datasource.deviceObj[this.startBindData.dataSource.deviceModel.id]
      const res = arr.find(item=>item.deviceId == deviceNameChild[0].id)
      if(this.modifyData.paramType != 'deviceParam') {
        this.modifyData.targetParam = ''
        this.deviceDataCache = null
      } else {
        if(!this.deviceDataCache) {
          this.modifyData.targetParam = ''
        } 
      }
      switch(this.modifyData.paramType) {
        case 'deviceType':
          if(this.modifyData.configParamType == 'id') {
            this.modifyData.targetParam = this.startBindData.dataSource.deviceTypeChild.id
          } else {
            this.modifyData.targetParam = this.startBindData.dataSource.deviceTypeChild.name
          }
          break
        case 'deviceModel':
          if(this.modifyData.configParamType == 'id') {
            this.modifyData.targetParam = this.startBindData.dataSource.deviceModel.id
          } else {
            this.modifyData.targetParam = this.startBindData.dataSource.deviceModel.name
          }
          break
        case 'device':
          if(this.modifyData.configParamType == 'id') {
            this.modifyData.targetParam = deviceNameChild[0].id
          } else {
            this.modifyData.targetParam = deviceNameChild[0].name
          }
          break
        case 'deviceNo':
          this.modifyData.targetParam = res.serialNumber
          break
        case 'deviceLocation':
          if(this.modifyData.configParamType == 'value') {
            this.modifyData.targetParam = res.locationNamePath
          } else {
            this.modifyData.targetParam = `${res.locationId}@${res.locationNamePath}`
          }
          break
        case 'deviceParam':
          if(this.deviceDataCache) {
            this.dealDevciceTargeParam(this.deviceDataCache)
          }
          break
      }
    },
    init() {
      let configParams = this.getCellModelInfo("configParams")
      let startBindData = this.getCellModelInfo("bindData")
      if(configParams && startBindData) {
        this.tableData = configParams
      } else {
        this.editIndex = 0
      }
    },
    cancel() {
      this.$emit('input', false)
    },
    submit() {
      if(this.editIndex != -1) {
        Message.warning(`有数据未保存`)
        return
      }
      this.cancel()
    },
    addParam() {
      this.visible = true
    },
    addParamDone(data) {
      this.deviceDataCache = data
      this.dealDevciceTargeParam(data)
    },
    dealDevciceTargeParam(data) {
      if(this.modifyData.configParamType == 'id') {
        this.modifyData.targetParam = data[0].paramId
      } else {
        this.modifyData.targetParamId = data[0].deviceParamId
        if(data[0].displayName) {
          this.modifyData.targetParam = `${data[0].paramName}(${data[0].displayName})`
        } else {
          this.modifyData.targetParam = data[0].paramName
        }
      }
    },
    addRow() {
      if(this.editIndex != -1) {
        Message.warning(`请先保存数据`)
        return
      }
      this.tableData.push({...initData})
      this.modifyData = {...initData}
      this.editIndex = this.tableData.length - 1
    },
    getCellModelInfo(key, cell) {
      let graph = this.myEditorUi.editor.graph;
      if (!cell) {
        cell = graph.getSelectionCell();
      }
      let modelInfo = graph.getModel().getValue(cell);
      let bindData = null;
      if (!mxUtils.isNode(modelInfo)) {
        let doc = mxUtils.createXmlDocument();
        let obj = doc.createElement("object");
        obj.setAttribute("label", modelInfo || "");
        modelInfo = obj;
      }
      if (modelInfo) {
        let bindAttr = modelInfo.getAttribute(key);
        if (bindAttr) {
          bindData = JSON.parse(bindAttr);
        }
      }
      return bindData;
    },
    setCellModelInfo(key, data, cell) {
      let graph = this.myEditorUi.editor.graph;
      if (!cell) {
        cell = graph.getSelectionCell();
      }
      let modelInfo = graph.getModel().getValue(cell);
      if (!mxUtils.isNode(modelInfo)) {
        let doc = mxUtils.createXmlDocument();
        let obj = doc.createElement("object");
        obj.setAttribute("label", modelInfo || "");
        modelInfo = obj;
      }
      modelInfo.setAttribute(key, JSON.stringify(data));
      graph.getModel().setValue(cell, modelInfo);
     
    },
  },
};
</script>

<style lang="less">
 
</style>
<style lang="less" scoped>
  .icon-add {
    width: 20px;
    height: 20px;
    background: url("../../../../assets/images/leftsidebar/addpage.png") no-repeat center center;
    background-size: 16px 16px;
    display: inline-block;
    cursor: pointer;
    vertical-align: middle;
  }
  .cus-table{
    margin-top:15px;
    &.ivu-table-wrapper {
      border-right: none;
      overflow: visible;
      /deep/.ivu-table-header {
        th {
          height: 24px;
          border-right: none;
          color: #252525;
          font-weight: 400;
          .ivu-table-cell{
            vertical-align: sub;
          }
        }
      }
      /deep/.ivu-table-tbody {
        tr {
          td {
            height: 28px;
            border-right: none;
            background: #f2f2f2;
          }
          &.ivu-table-row-hover {
            td {
              background: #d9e6f6;
            }
          }
        }
      }
    }
  }
  .icon-wrap-add{
    cursor: pointer;
    width: 76px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    border: 1px solid #C4C4C4;
    border-radius: 2px;
  }
  .config-con{
    /deep/.table-icon{
      width:16px;
      height: 16px;
      cursor: pointer;
      &.icon-save{
        display: inline-block;
        background:url('~@/assets/images/rightsidebar/icon-op-save.png');
        background-size:cover;
      }
      &.icon-edit{
        display: inline-block;
        background:url('~@/assets/images/rightsidebar/icon-op-edit.png');
        background-size:cover;
      }
      &.icon-del{
        display: inline-block;
        background:url('~@/assets/images/rightsidebar/icon-op-del.png');
        background-size:cover;
        margin-left:6px;
      }
    }
    /deep/.ivu-table-cell {
      padding-left: 6px;
      padding-right: 6px;
    }
  }
</style>
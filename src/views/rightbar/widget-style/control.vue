<template>
  <div class="control-con">
    控制指令
    <Select
      v-model="control"
      style="height:24px"
      clearable
      @on-change="selectChange"
      @on-clear="clearFun"
    >
      <Option
        v-for="item in controlList"
        :key="item.commandTemplateId"
        :value="item.commandTemplateId"
      >
        {{ item.commandName }}
      </Option>
    </Select>
    <div class="item-line" />
    <div
      style="display:flex;justify-content:space-between;align-items:center;"
    >
      {{ $t('opPwd') }}
      <i-switch
        v-model="opPwd"
        size="small"
        @on-change="choosePwd"
      />
    </div>
    <input
      v-if="opPwd"
      v-model="pwd"
      :placeholder="$t('plsInputOpPwd')"
      style="width:100%;margin-top:4px;"
      :maxlength="20"
      @keyup.enter="changePwd"
      @blur="changePwd"
    >
  </div>
</template>

<script>
import {Select,Option} from 'iview'
import {mxUtils} from "../../../services/mxGlobal"
import {tipDialog} from '../../../services/Utils'
export default{
  components: {
    Select,
    Option,
  },
  data() {
    return {
      control:'',
      controlList:[],
      opPwd:false,
      pwd:'',
    }
  },
  created() {
    let bindData = this.getCellModelInfo('bindData')
    if(!bindData || !bindData.dataSource) {
      tipDialog(this.myEditorUi,'请先绑定设备')
      return
    }
    let deviceModelId = bindData.dataSource.deviceTypeChild.id
    this.requestUtil.get(`${this.urls.commandTemplate.url}${deviceModelId}`).then(res =>{
      this.controlList = res
      let target = this.getCellModelInfo('commandInfo') || {}
      if(target.data) {
        this.control = target.data.commandTemplateId
      }
      if(target.isPwd == 1) {
        this.opPwd = true
      }
    })
  },
  mounted() {
    
  },
  methods: {
    selectChange() {
      let target = this.getCellModelInfo('commandInfo') || {}
      target.data = this.controlList.find(item=>item.commandTemplateId == this.control)
      this.setCellModelInfo('commandInfo',target)
    },
    clearFun() {
      this.opPwd = false
      this.setCellModelInfo('commandInfo',null)
    },
    choosePwd() {
      if(!this.opPwd) {
        this.pwd = ''
      }
      let target = this.getCellModelInfo('commandInfo') || {}
      target.isPwd =  this.opPwd === true ? 1 : 0
      this.setCellModelInfo('commandInfo',target)
    },
    changePwd() {
      if(!this.opPwd) {
        return
      }
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
      let graph = this.myEditorUi.editor.graph
      if (!cell) {
        cell = graph.getSelectionCell()
      }
      let modelInfo = graph.getModel().getValue(cell)
      if (!mxUtils.isNode(modelInfo)) {
        let doc = mxUtils.createXmlDocument()
        let obj = doc.createElement("object")
        obj.setAttribute("label", modelInfo || "")
        modelInfo = obj
      }
      modelInfo.setAttribute(key, JSON.stringify(data))
      graph.getModel().setValue(cell, modelInfo)
    }
  }
}
</script>

<style scoped lang="less">
 .control-con{
  height:100%;
  padding:0 4px;
  margin-top:10px;
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
  .item-line{
    margin:10px 0;
    background:#ccc;
    height:1px;
  }
  input{
      outline: none;
      width:100%;
      height:24px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(212,212,212,1);
      border-radius:2px;
      padding:0 4px;
  }
 }
</style>

<style lang="less">

</style>

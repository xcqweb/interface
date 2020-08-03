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
        :key="item.functionId"
        :value="item.functionId"
      >
        {{ item.functionName }}
      </Option>
    </Select>
    <div class="item-line" />
    <!-- 操作确认 -->
    <div
      style="display:flex;justify-content:space-between;align-items:center;"
    >
      {{ $t('opConfirm') }}
      <i-switch
        v-model="opConfirm"
        size="small"
      />
    </div>
    <!-- 操作密码 -->
    <div
      style="display:flex;justify-content:space-between;align-items:center;display:none;"
    >
      {{ $t('opPwd') }}
      <i-switch
        v-model="opPwd"
        size="small"
      />
    </div>
    <input
      v-if="opPwd"
      v-model="pwd"
      :placeholder="$t('plsInputOpPwd')"
      style="width:100%;margin-top:4px;"
      :maxlength="20"
    >
    <div style="display:flex;justify-content:space-between;margin-top:10px;">
      <button
        class="mutual-btn"
        @click="back()"
      >
        {{ $t('cancel') }}
      </button>
      <button
        class="mutual-btn selected"
        @click="submit()"
      >
        {{ $t('submit') }}
      </button>
    </div>
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
  props:['currentEditItem'],
  data() {
    return {
      control:'',
      controlList:[],
      opPwd:false,
      pwd:'',
      opConfirm:false,
    }
  },
  created() {
    this.commandData = {}
    this.bindData = this.getCellModelInfo('bindData')
    if( (!this.bindData || !this.bindData.dataSource) && !this.$store.state.main.isTemplateApply) {
      return
    }
    this.deviceModelId = this.bindData.dataSource.deviceModel.id
    if (this.$store.state.main.isTemplateApply) {
      this.deviceModelId = sessionStorage.getItem('modelId')
    }
    this.requestUtil.get(`${this.urls.commandTemplate.url}${this.deviceModelId}`).then(res =>{
      if(res && res.length) {
        this.controlList = res
        this.control = res[0].functionId
        this.selectChange()
      }
    })
    let graph = this.myEditorUi.editor.graph;
    let currentCell = graph.getSelectionCell()
    this.paletteId = currentCell.id
    this.initDefaultData()
  },
  methods: {
    back() {
      this.$emit("submitMutual")
    },
    initDefaultData() {
      let actions = this.getCellModelInfo("actionsInfo")
      if (!actions) {
        return
      }
      const res = actions.find(item=>item.mutualType == 5)
      if(res) {
        this.hasBindCommand = true
        this.isPwd = res.data.isPwd === 1 ? true : false
        this.isTip = res.data.isTip === 1 ? true : false
        this.opConfirm = this.isTip
        this.pwd = res.data.pwd
        if(res.data.detail) {
          this.control = res.data.detail.functionId;
        }
      }
      
    },
    submit() {
      if(this.hasBindCommand && !this.currentEditItem) {
        tipDialog(this.myEditorUi,this.$t('rightBar.hasBindCommand'))
        return
      }
      if(!this.control) {
        tipDialog(this.myEditorUi,'请选择控制指令')
        return
      }
      this.commandData.isTip =  this.opConfirm === true ? 1 : 0
      this.commandData.isPwd =  this.opPwd === true ? 1 : 0
      this.commandData.pwd = this.pwd
      this.$emit("submitMutual",{
        "mutualType":5, //指令
        "id":this.paletteId,
        "innerType":"palette",
        "mouseEvent":"click",
        "effectAction":"send", //下发指令
        "commandData":this.commandData,
        "isEdit":this.currentEditItem ? true : false,
      })
    },
    selectChange() {
      this.commandData.detail = {
        deviceModelId:this.deviceModelId,
        functionId: this.control,
      }
    },
    clearFun() {
      this.opPwd = false
      this.$emit('clearComand')
    },
    choosePwd() {
      if(!this.opPwd) {
        this.pwd = ''
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

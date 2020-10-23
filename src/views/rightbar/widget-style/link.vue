<template>
  <div class="openLink">
    <p style="margin-bottom: 2px;margin-top:10px;">
      {{ $t('rightBar.linkAddress') }}
    </p>
    <Input
      v-model="openlinkUrl"
      type="textarea"
      placeholder="请输入链接地址"
      style="padding:0 4px;"
      :autosize="{minRows: 1, maxRows: 6 }"
    />
    <div class="openLinkTarget">
      <span>新窗口打开: </span>
      <RadioGroup v-model="isOpenNewWindow">
        <Radio label="_blank">
          <span>是</span>
        </Radio>
        <Radio label="_self">
          <span>否</span>
        </Radio>
      </RadioGroup>
    </div>
    <div class="item-line" />
    <div class="openLinkTarget">
      <span>传递参数:&nbsp;&nbsp;&nbsp;</span>
      <RadioGroup v-model="openConfig">
        <Radio label="1">
          <span>是</span>
        </Radio>
        <Radio label="0">
          <span>否</span>
        </Radio>
      </RadioGroup>
    </div>
    <button
      v-if="openConfig==1"
      class="mutual-btn config-btn"
      @click="configParam()"
    >
      配置
    </button>
    <div class="item-line" />
    <div style="display:flex;justify-content:space-between;margin-top:20px;">
      <button
        class="mutual-btn"
        @click="hide()"
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
    <config-params
      v-model="visible"
    />
  </div>
</template>
<script>
import {tipDialog} from '../../../services/Utils'
import {RadioGroup, Message, Radio,Input} from 'iview'
import {mxUtils} from "../../../services/mxGlobal"
export default{
  components:{
    RadioGroup, Radio,Input,
    ConfigParams: resolve => {
      return require(["./components/config-params"], resolve);
    }
  },
  props:['currentPageWidgets','bindActions'],
  data() {
    return {
      openlinkUrl: '',
      isEdit: false,
      isOpenNewWindow: '_blank',
      openConfig:'0',// 传递参数
      visible:false,
    }
  },
  created() {
    let configParams = this.getCellModelInfo("configParams")
    if(configParams) {
      this.openConfig = "1"
    }
  },
  methods: {
    initData() {
      this.openlinkUrl = ''
      this.isEdit = false
    },
    inputCurrent(data) {
      this.openlinkUrl = data.id;
      if (data.type === 4) {
        this.isOpenNewWindow = data.target ? data.target : this.isOpenNewWindow;
      }
      this.isEdit = true
    },
    submit() {
      if (!this.openlinkUrl.trim()) {
        tipDialog(this.myEditorUi,`${this.$t("rightBar.pleaseInputOpenLink")}`)
        return
      }
      if (this.bindActions.length) {
        tipDialog(this.myEditorUi,`${this.$t("rightBar.pageHasBindOpenLinkEvents")}`)
        return
      } 
      //isOpenNewWindow 是否新窗口打开 1是 0否
      this.$emit("submitMutual",{mutualType:4,id:this.openlinkUrl, innerType:'openLink',isEdit:this.isEdit, target: this.isOpenNewWindow})
    },
    hide() {
      this.$emit("submitMutual")
    },
    configParam() {
      let startBindData = this.getCellModelInfo("bindData")
      if(!startBindData) {
        Message.warning(`请先绑定设备`)
        return
      }
      this.visible = true
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
}
</script>
<style scoped lang="less">
.openLink {
    input{
        outline: none;
        width:100%;
        height:24px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(212,212,212,1);
        border-radius:2px;
    }
    .openLinkTarget{
      margin-top: 6px;
      padding-left: 2px;
      display: flex;
      align-items: center;
      &>span{
        margin-right: 12px;
      }
    }
    /deep/.ivu-radio-inner{
      width: 12px;
      height: 12px;
    }
}
.item-line{
  margin:6px 0;
  background:#ccc;
  height:1px;
}
.config-btn{
  margin: 6px 0 10px 3px;
  width:48px;
}
</style>
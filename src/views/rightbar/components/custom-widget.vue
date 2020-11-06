<template>
  <Modal
    v-model="modalShow"
    class="custom-modal"
    title="添加组件"
    :width="540"
    :styles="{top: '-160px!important'}"
    :mask-closable="false"
  >
    <div class="item">
      <label class="required">组件名称：</label>
      <Input
        v-model="widgetName"
        size="small"
        placeholder="请输入组件名称"
      />
    </div>
    <div class="item">
      <label class="required">组件库：</label>
      <Select
        v-model="libName"
        size="small"
        placeholder="选择组件库"
        transfer
      >
        <Option
          v-for="item in libList"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </Select>
    </div>
    <div class="item">
      <label>保留组件状态：</label>
      <Checkbox 
        v-model="keepWidgetState"
      />
    </div>
    <!-- 按钮 -->
    <div slot="footer">
      <Button
        size="small"
        @click="cancel"
      >
        {{ $t('cancel') }}
      </Button>
      <Button
        type="primary"
        size="small"
        :disabled="!widgetName || !libName"
        @click="submit"
      >
        {{ $t('submit') }}
      </Button>
    </div>
  </Modal>
</template>

<script>
import {Modal, Button,Input,Select,Option,Checkbox} from 'iview'
import {mxUtils} from '../../../services/mxGlobal'
export default {
  components: {
    Modal,
    Button,
    Input,
    Select,
    Option,
    Checkbox,
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
      widgetName:'',
      libName:'',
      libList:[],
      keepWidgetState:true,
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
    this.loadLib()
  },
  methods: {
    init() {
      this.widgetName = ''
      this.libName = ''
      this.keepWidgetState = true
    },
    loadLib() {
      this.requestUtil.get(this.urls.materialList.url).then((res) => {
        if(res.records && res.records.length) {
          this.libList = res.records.map(item=>{
            return {
              label:item.libraryName,
              value:item.materialLibraryId
            }
          })
        }
      })
    },
    cancel() {
      this.$emit('input', false)
    },
    dealCells(cells) {
      cells.forEach(item=>{
        this.setCellModelInfo('bindData',null,item)
        this.setCellModelInfo('actionsInfo',null,item)
        if(!this.keepWidgetState) {
          this.setCellModelInfo('statesInfo',null,item)
        }
        if(item.getChildCount()) {
          this.dealCells(item.children)
        }
      })
    },
    submit() {
      let graph = this.myEditorUi.editor.graph
      this.dealCells(graph.getSelectionCells()) // 清除控件的绑定的数据、交互
      let selectionCells = graph.getSelectionCells()
      // 获取当前选中的组件的缩略图
      let svgImgStr = graph.getSvg(null, null, null, null, null, false, true, null)// 压缩减少数据量后再上传保存
      let node = graph.encodeCells(selectionCells)
      let nodeStr = graph.compress(mxUtils.getXml(node)) // 将节点转为字符串提交
      console.log(nodeStr,svgImgStr)
      this.cancel()
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
 .item{
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  label{
    width:90px;
    &.required {
      &:before {
        content: "*";
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 14px;
        color: #ed4014;
      }
    }
  }
 }
</style>
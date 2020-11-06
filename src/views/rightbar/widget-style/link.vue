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
  </div>
</template>
<script>
import {tipDialog} from '../../../services/Utils'
import {RadioGroup, Radio,Input} from 'iview'
export default{
  components:{
    RadioGroup, Radio,Input
  },
  props:['currentPageWidgets','bindActions'],
  data() {
    return {
      openlinkUrl: '',
      isEdit: false,
      isOpenNewWindow: '_blank',
    }
  },
  created() {
    
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
  },
}
</script>
<style scoped lang="less">
.openLink {
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
</style>
<template>
  <div class="openLink">
    <p style="margin-bottom: 2px;margin-top:10px;">
      {{ $t('rightBar.linkAddress') }}
    </p>
    <input
      v-model="openlinkUrl"
      placeholder="请输入链接地址"
      style="padding:0 4px;"
    >
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
export default{
  props:['currentPageWidgets','bindActions'],
  data() {
    return {
      openlinkUrl: '',
      isEdit: false,
    }
  },
  methods: {
    initData() {
      this.openlinkUrl = ''
      this.isEdit = false
    },
    inputCurrent(data) {
      this.openlinkUrl = data.id;
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
      this.$emit("submitMutual",{mutualType:4,id:this.openlinkUrl, innerType:'openLink',isEdit:!!this.currentEditItem})
    },
    hide() {
      this.$emit("submitMutual")
    }
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
}
</style>
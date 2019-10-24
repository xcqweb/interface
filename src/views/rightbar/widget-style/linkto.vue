<template>
  <div style="height:100%;">
    <div
      style="height:60%;"
    >
      <p style="margin-bottom: 2px;margin-top:10px;">
        {{ $t('rightBar.choosePage') }}
      </p>
      <ul class="widget-con">
        <li
          v-for="(item,index) in pages"
          :key="index"
          :class="{'selected':item.selected}"
          @click="checkPage(item)"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
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
import {tipDialog} from '../../../services/Utils'
export default{
    props:['pages','bindActions','currentEditItem'],
    data() {
        return {
            currentItem:null,
        }
    },
    mounted() {
        
    },
    methods: {
        back() {
            this.$emit("submitMutual")
        },
        submit() {
            let flag = false,flag2 = false
            for(let i = 0;i < this.pages.length;i++) {
                if(this.pages[i].selected) {
                    flag = true
                    break
                }
            }
            if(!flag) {
                tipDialog(this.myEditorUi,`${this.$t('rightBar.choosePageToLink')}`)
                return
            } 
            if(!this.currentItem) {
                this.currentItem = this.currentEditItem  //编辑传过来的
            }
            for(let i = 0;i < this.bindActions.length;i++) {
                if(this.currentItem.id == this.bindActions[i].link) {
                    flag2 = true
                    break
                }
            }
            if(flag2) {
                tipDialog(this.myEditorUi,`${this.$t("pageHasBindLinkEvents")}`)
                return
            } 
            this.$emit("submitMutual",{mutualType:1,id:this.currentItem.id,innerType:'page'})
        },
        checkPage(item) {
            this.currentItem = item
            this.pages.forEach(d=>{
                d.selected = false
            })
            item.selected = true
        }
    },      
}
</script>

<style scoped lang="less">
.widget-con{
  height:93%;
  background:rgba(255,255,255,1);
  border:1px solid rgba(212,212,212,1);
  border-radius:2px;
  overflow:auto;
  li{
    height:24px;
    padding:0 4px;
    line-height:24px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    &.selected{
      background:rgba(61,145,247,1);
      border:1px solid rgba(39,122,224,1);
      color:#fff;
    }
  }
}
</style>

<style lang="less">
 
</style>

<template>
  <div style="height:100%;">
    <p style="margin-bottom: 2px;margin-top:10px;">
      {{ $t("object") }}
    </p>
    <div class="type-tab-con">
      <div
        class="type-tab"
        :class="{'selected':typeTab==1}"
        style="border-top-left-radius:2px;border-bottom-left-radius:2px;"
        @click="changeTab(1)"
      >
        {{ $t("popup") }}
      </div>
      <div
        class="type-tab"
        style="border-top-right-radius:2px;border-bottom-right-radius:2px;"
        :class="{'selected':typeTab==2}"
        @click="changeTab(2)"
      >
        {{ $t("widget") }}
      </div>
    </div>
    <div style="height:100%;">
      <div
        v-show="typeTab==1"
        style="height:60%;"
      >
        <p style="margin-bottom: 2px;margin-top:10px;">
          {{ $t("rightBar.choosePopup") }}
        </p>
        <ul class="widget-con">
          <li
            v-for="(item,index) in dialogs"
            :key="index"
            :class="{'selected':item.selected}"
            @click="checkDialog(item)"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>
      <div
        v-show="typeTab==2"
        style="height:60%;"
      >
        <p style="margin-bottom: 2px;margin-top:10px;">
          {{ $t("rightBar.chooseWidget") }}
        </p>
        <ul class="widget-con">
          <li
            v-for="(item,index) in currentPageWidgets"
            :key="index"
            :class="{'selected':item.selected}"
            @click="checkWidget(item)"
          >
            {{ item.titleType }}
          </li>
        </ul>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:10px;">
        <button
          class="mutual-btn"
          @click="hide(typeTab)"
        >
          {{ $t("cancel") }}
        </button>
        <button
          class="mutual-btn selected"
          @click="submit(typeTab)"
        >
          {{ $t("submit") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {tipDialog} from '../../../services/Utils'
export default{
    props:['dialogs','currentPageWidgets','currentEditItem','bindActions','typeTab'],
    data() {
        return {
            
        }
    },
    mounted() {
    
    },
    methods: {
        changeTab(index) {
            this.$emit("modifyTypeTab",index)
            if(index === 1) {
                this.currentPageWidgets.forEach(d=>{
                    d.selected = false
                })
            }else{
                this.dialogs.forEach(d=>{
                    d.selected = false
                })
            }
        },
        hide() {
            this.$emit("submitMutual")
        },
        submit(typeTab) {
            let currentItem,innerType,flag = false,flag2 = false,tempList,tipText
            if(typeTab == 1) {
                currentItem = this.currentDialogItem
                innerType = 'page'
                tempList = this.dialogs
                tipText = `${this.$t("popup")}`
            }else{
                currentItem = this.currentWidgetItem
                innerType = 'palette'
                tempList = this.currentPageWidgets
                tipText = `${this.$t("control")}`
            }
            for(let i = 0;i < tempList.length;i++) {
                if(tempList[i].selected) {
                    flag = true
                    break
                }
            }
            if(!flag) {
                tipDialog(this.myEditorUi,`${this.$t("rightBar.chooseToSet")} ${tipText}`)
                return
            } 
            if(!currentItem) {
                currentItem = this.currentEditItem  //编辑传过来的
            }
            for(let i = 0;i < this.bindActions.length;i++) {
                if(currentItem.id == this.bindActions[i].link && this.bindActions[i].mutualType == 2) {
                    flag2 = true
                    break
                }
            }
            if(flag2) {
                tipDialog(this.myEditorUi,`${this.$t("thisText")} ${tipText} ${this.$t("rightBar.hasBindVisibleOrHideEvent")}`)
                return
            } 
            this.$emit("submitMutual",{mutualType:2,id:currentItem.id,hide:currentItem.hide,innerType:innerType,isEdit:!!this.currentEditItem})
        },
        checkDialog(item) {
            this.currentDialogItem = item
            this.dialogs.forEach(d=>{
                d.selected = false
            })
            item.selected = true
        },
        checkWidget(item) {
            this.currentWidgetItem = item
            this.currentPageWidgets.forEach(d=>{
                d.selected = false
            })
            item.selected = true
        }
    },      
}
</script>

<style scoped lang="less">
.title{
  margin-top:10px;
  display:flex;
  align-items:center;
  margin-left:2px;
}
.type-tab-con{
  display: flex;
  height:26px;
  line-height:23px;
  background:#fff;
  border:1px solid rgba(212,212,212,1);
  border-radius:2px 0px 0px 2px;
  .type-tab{
    flex:1;
    text-align:center;
    &.selected{
      background:rgba(61,145,247,1);
      border:1px solid rgba(39,122,224,1);
      color:#fff;
    }
  }
}
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

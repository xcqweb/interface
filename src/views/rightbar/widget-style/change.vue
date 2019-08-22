<template>
  <div style="height:100%;">
    <div
      style="height:42%;"
    >
      <p style="margin-bottom: 2px;margin-top:10px;">
        选择组件
      </p>
      <ul class="widget-con">
        <li
          v-for="(item,index) in currentPageWidgets"
          :key="index"
          :class="{'selected':item.selected}"
          @click="checkWidget(item)"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div
      style="height:25%;"
    >
      <p style="margin-bottom: 2px;margin-top:10px;">
        选择状态
      </p>
      <ul
        class="widget-con"
        style="height:84%;"
      >
        <li
          v-for="item in states"
          :key="item.id"
          :class="{'selected':item.check}"
          @click="checkState(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:10px;">
      <button
        class="mutual-btn"
        @click="hide()"
      >
        取消
      </button>
      <button
        class="mutual-btn selected"
        @click="submit()"
      >
        提交
      </button>
    </div>
  </div>
</template>

<script>
import {tipDialog} from '../../../services/Utils'
let currentStateItem,currentWidgetItem
export default{
    props:['currentPageWidgets','currentEditItem','bindActions'],
    data() {
        return {
            
        }
    },
    computed: {
        states: {
            get:function() {
                return this.$store.state.main.states
            }
        }
    },
    mounted() {
        if(!this.states.length) {
            let states = [{
                "id":'state_0',
                "name":"默认",
                "desc":'默认',
                'animateCls':'',
                "style":{
                    background:this.$store.state.main.widgetInfo.bgColor,
                    borderColor:this.$store.state.main.widgetInfo.borderColor,
                    color:this.$store.state.main.widgetInfo.color
                }, 
                'check':false
            }]
            this.$store.commit('refreshState',states)
        }
    },
    methods: {
        hide() {
            this.$emit("submitMutual")
        },
        submit() {
            let sameFlag = false
            if(this.states && this.states.length && this.states[0].check) {//选中的默认的 不提交添加切换状态的事件
                this.$emit("submitMutual")
                return
            }
            if(!currentWidgetItem) {
                tipDialog(this.myEditorUi,`请选择要切换状态的控件`)
                return
            }
            for(let i = 0;i < this.bindActions.length;i++) {
                if(currentWidgetItem.id == this.bindActions[i].link && currentStateItem.id == this.bindActions[i].stateId) {
                    sameFlag = true
                    break
                }
            }
            if(sameFlag) {
                tipDialog(this.myEditorUi,`该控件已经绑定了${currentStateItem.name}状态`)
                return
            } 
            this.$emit("submitMutual",{mutualType:3,id:currentWidgetItem.id,stateId:currentStateItem.id,innerType:"palette"})
        },
        checkWidget(item) {
            currentWidgetItem = item
            this.$set(this.states[0],'check',true)
            this.currentPageWidgets.forEach(d=>{
                d.selected = false
            })
            item.selected = true
        },
        checkState(item) {
            currentStateItem = item
            this.states.forEach((d)=>{
                if(d.id == item.id) {
                    d.check = true
                }else{
                    d.check = false
                }
            })
        },
    },      
}
</script>

<style scoped lang="less">
.widget-con{
  height:91%;
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

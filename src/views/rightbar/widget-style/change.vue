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
      v-if="isWidgetClick"
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
import {mxUtils} from '../../../services/mxGlobal'
let cells,graph
let currentStateItem,currentWidgetItem
export default{
    props:['currentPageWidgets','bindActions'],
    data() {
        return {
            isWidgetClick:false,
            states:[]
        }
    },
    mounted() {
        graph = this.myEditorUi.editor.graph
        cells = graph.getModel().cells
    },
    methods: {
        addInit() {
            this.isWidgetClick = false
            this.currentPageWidgets.forEach(d=>{
                d.selected = false
            })
            currentWidgetItem = null
            currentStateItem = null
        },
        checkCurrent(currentEditItem) { //当前控件和状态选中
            this.isWidgetClick = true
            this.currentPageWidgets.forEach(d=>{
                if(d.id == currentEditItem.id) {
                    d.selected = true
                    currentWidgetItem = d
                }else{
                    d.selected = false
                }
            })
            this.states = this.getWidgetStatesById(currentWidgetItem.id)
            console.log(currentEditItem)
            this.states.forEach((d)=>{
                if(d.id == currentEditItem.stateId) {
                    d.check = true
                    currentStateItem = d
                }else{
                    d.check = false
                }
            })
        },
        hide() {
            this.$emit("submitMutual")
        },
        submit() {
            let sameFlag = false
            if(!currentWidgetItem) {
                tipDialog(this.myEditorUi,`请选择要切换状态的控件`)
                return
            }
            if(!currentStateItem) {
                tipDialog(this.myEditorUi,`请选择要绑定的状态`)
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
            this.$emit("submitMutual",{mutualType:3,id:currentWidgetItem.id,innerType:"palette",stateInfo:currentStateItem})
        },
        checkWidget(item) {
            currentWidgetItem = item
            this.isWidgetClick = true
            this.currentPageWidgets.forEach(d=>{
                d.selected = false
            })
            item.selected = true 
            this.states = this.getWidgetStatesById(item.id)
            if(!currentStateItem) {
                this.states.forEach(item=>{
                    item.check = false
                })
            }
        },
        getWidgetStatesById(id) {
            let states = []
            let cell = cells[id]
            let modelInfo = graph.getModel().getValue(cell)
            if (!mxUtils.isNode(modelInfo)) {
                var doc = mxUtils.createXmlDocument();
                var obj = doc.createElement('object');
                obj.setAttribute('label', modelInfo || '');
                modelInfo = obj;
            }
            let statesAttr = modelInfo.getAttribute('statesInfo')
            if(statesAttr) {
                states = JSON.parse(statesAttr)
            }
            if(!states.length) {
                states = [{
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
            }
            return states
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
            this.saveWidgetModeState()
        },
        saveWidgetModeState() {//将状态设定信息保存在对应的控件的model中
            let cell = cells[currentWidgetItem.id]
            let modelInfo = graph.getModel().getValue(cell)
            if (!mxUtils.isNode(modelInfo)) {
                var doc = mxUtils.createXmlDocument();
                var obj = doc.createElement('object');
                obj.setAttribute('label', modelInfo || '');
                modelInfo = obj;
            }
            modelInfo.setAttribute('statesInfo', JSON.stringify(this.states))
            graph.getModel().setValue(cell, modelInfo)
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

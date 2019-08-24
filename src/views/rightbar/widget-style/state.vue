<template>
  <div style="padding:0 4px;">
    <div
      class="title"
      @click="addStateFun"
    >
      <img src="../../../assets/images/rightsidebar/plus_ic.png"> 添加状态
    </div>
    <template
      v-for="(state,index) in states"
    >
      <div
        v-if="state.id!='state_0'"
        :key="state.name"
        class="event-item"
        @click="editStateFun(state)"
      >
        <div style="display:flex;justify-content:space-between;">
          {{ state.name }}
          <img
            src="../../../assets/images/rightsidebar/dele_ic.png"
            @click="removeState(state,index,$event)"
          >
        </div>
        <div>
          描述：{{ state.desc || '暂无描述' }}
        </div>
        <ul style="display:flex;align-items:center;">
          填充
          <li
            class="rect"
            :style="{background:state.style.background || '#ECEFF4'}"
          />
          <span style="margin-left:15px;">边框</span>
          <li
            class="rect"
            :style="{background:state.style.borderColor || '#7D7D7D'}"
          />
          <span style="margin-left:15px;">文本</span>
          <li
            class="rect"
            :style="{background:state.style.color || '#252525'}"
          />
        </ul>
      </div>
    </template>
    <StateDialog
      v-if="isAdd"
      :edit-state="editState"
      @closeStateDialog="closeStateDialog"
    />
  </div>
</template>

<script>
import StateDialog from './state-dialog'
import {sureDialog} from '../../../services/Utils'
import {mxUtils} from '../../../services/mxGlobal'
export default{
    components:{StateDialog},
    data() {
        return {
            isAdd:false,
            states:[],
            editState:null,
        }
    },
    mounted() {
        this.initStates()
    },

    methods: {
        addStateFun() {
            this.editState = null
            this.isAdd = true
        },
        closeStateDialog(data) {
            this.isAdd = false
            if(!data) {
                return
            }
            let state = {
                "id":'',
                "name":data.name,
                "desc":data.desc,
                "style":data.style,
                'animateCls':data.animateCls,
                'check':false
            }
            if(data.id) {
                state.id = data.id
            }
            this.setStateInfos(state)
        },
        initStates() {
            let graph = this.myEditorUi.editor.graph
            let states = this.getStates(graph)
            if(states.length) {
                this.setStates(states)
            }
        },
        setStates(states) {
            this.states = states
        },
        getStates(graph) {
            let cell = graph.getSelectionCell()
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
            return states
        },
        setStateInfos(state) {//是否要重置列表
            let graph = this.myEditorUi.editor.graph
            let states = this.getStates(graph)
            if(!state.id) {
                state.id = `state_${states.length}`
                states.push(state)
            }else{
                for(let i = 0;i < states.length;i++) {
                    if(states[i].id == state.id) {
                        states[i] = state
                        break
                    }
                }
            }
            this.setStates(states)//重置state列表
            this.setModeInfoStates(states)
            return states
        },
        setModeInfoStates(states) {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let modelInfo = graph.getModel().getValue(cell)
            modelInfo.setAttribute('statesInfo', JSON.stringify(states))
            graph.getModel().setValue(cell, modelInfo)
        },
        removeState(state,index,evet) {
            evet.stopPropagation()
            sureDialog(this.myEditorUi,`确定要删除${state.name}吗`,()=>{
                let graph = this.myEditorUi.editor.graph
                this.states.splice(index,1)
                let states = this.getStates(graph)
                for(let i = 0;i < states.length;i++) {
                    if(states[i].id === state.id) {
                        states.splice(i,1)
                        break;
                    }
                }
                this.setModeInfoStates(states)
            })
        },
        editStateFun(state) {
            this.editState = state
            this.isAdd = true
        },
    },      
}
</script>

<style scoped lang="less">
.title{
  margin-top:10px;
  display:flex;
  align-items:center;
}
.event-item{
  margin-top:10px;
  padding:4px;
  border:1px solid rgba(212,212,212,1);
  border-radius:2px;
}
.rect{
  width:12px;
  height:12px;
  border:1px solid rgba(225,225,225,1);
  border-radius:2px;
  margin-left:2px;
}
</style>

<style lang="less">
  
</style>

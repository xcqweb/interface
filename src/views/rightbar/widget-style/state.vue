<template>
  <div style="padding:0 4px;">
    <div
      class="title"
      @click="isAdd=true"
    >
      <img src="../../../assets/images/rightsidebar/plus_ic.png"> 添加状态
    </div>
    <div
      v-for="(state,index) in states"
      :key="index"
      class="event-item"
      @click="editState(state)"
    >
      <div style="display:flex;justify-content:space-between;">
        {{ state.name }}
        <img
          v-if="state.id!='state_0'"
          src="../../../assets/images/rightsidebar/dele_ic.png"
          @click="removeEvent(e,index,$event)"
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
    <StateDialog
      v-if="isAdd"
      @closeStateDialog="closeStateDialog"
    />
  </div>
</template>

<script>
import StateDialog from './state-dialog'
export default{
    components:{StateDialog},
    data() {
        return {
            isAdd:false,
            states:[],
        }
    },
    mounted() {
        this.initStates()
    },
    methods: {
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
                'animateCls':'',
                'check':false
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
            this.states = []
            states.forEach(item=>{
                this.states.push({
                    name:item.name,
                    desc:item.desc,
                    style:item.style,
                    id:item.id
                })
            })
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
                'check':true
            }]
            let modelInfo = graph.getModel().getValue(cell)
            let statesAttr = modelInfo.getAttribute('statesInfo')
            if(statesAttr) {
                states = JSON.parse(statesAttr)
            }
            return states
        },
        setStateInfos(state) {
            let graph = this.myEditorUi.editor.graph
            let states = this.getStates(graph)
            let lastStateId = + states[states.length - 1].id.split("_")[1]
            state.id = ++lastStateId
            states.push(state)
            this.setStates(states)//重置state列表
            this.setModeInfoStates(states)
            console.log(state,"--state--")
            return states
        },
        setModeInfoStates(states) {
            let graph = this.myEditorUi.editor.graph
            let cell = graph.getSelectionCell()
            let modelInfo = graph.getModel().getValue(cell)
            modelInfo.setAttribute('statesInfo', JSON.stringify(states))
            graph.getModel().setValue(cell, modelInfo)
        },
        editState() {

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

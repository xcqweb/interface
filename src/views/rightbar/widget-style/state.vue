<template>
  <div style="padding:0 4px;">
    <div
      v-if="shapeName!=='light'"
      class="title"
      @click="addStateFun"
    >
      <img src="../../../assets/images/rightsidebar/plus_ic.png"> {{ $t('rightBar.addState') }}
    </div>
    <template
      v-for="(state,index) in states"
    >
      <div
        v-if="state.id!='state_0'"
        :key="index"
        class="event-item"
        @click="editStateFun(state)"
      >
        <div style="display:flex;justify-content:space-between;">
          {{ state.name }}
          <img
            v-if="shapeName!=='light'"
            style="cursor:pointer;"
            src="../../../assets/images/rightsidebar/dele_ic.png"
            @click="removeState(state,index,$event)"
          >
        </div>
        <div>
          {{ $t("describe") }}：{{ state.desc || $t("noDescribe") }}
        </div>
        <ul style="display:flex;align-items:center;">
          <template v-if="!picList.includes(shapeName)">
            <span>{{ $t("fill") }}</span>
            <li
              class="rect"
              :style="{background:state.style.background || '#fff'}"
            />
          </template>
          <template v-if="state.imgInfo">
            <span>{{ $t("image") }}</span>
            <img
              :src="state.imgInfo.url"
              style="height:32px;margin:4px 0 0 4px;max-width:108px"
            >
          </template>
          <template v-if="shapeName!='light'">
            <span :style="{marginLeft:picList.includes(shapeName) && !state.imgInfo ? 0 : '15px'}">{{ $t("border") }}</span>
            <li
              class="rect"
              :style="{background:!state.style.borderColor || state.style.borderColor=='none' ? defalutImg : state.style.borderColor}"
            />
          </template>
          <template v-if="!picList.includes(shapeName) && shapeName!='light'">
            <span style="margin-left:15px;">
              {{ $t("text") }}
            </span>
            <li
              class="rect"
              :style="{background:state.style.color || '#fff'}"
            />
          </template>
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
import {mxUtils,Dialog} from '../../../services/mxGlobal'
 
//import {syncWidget} from '../../../services/sync-widgets'
export default{
  components:{StateDialog},
  data() {
    return {
      isAdd:false,
      states:[],
      editState:null,
      shapeName:'',
      picList:['image','userimage','light'],
      defalutImg:`url(${Dialog.prototype.noColorImage})`
    }
  },
  computed:{
    footerModelUpdata() {
      return this.$store.state.main.footerModelUpdata
    }
  },
  watch: {
    'states.length': {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && oldVal !== 0) {
          this.$store.commit('footerModelUpdata', true)
        }
      }
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
        'imgInfo':data.imgInfo,
        'check':false
      }
      if(data.id) {
        state.id = data.id
        if(data.modelFormInfo) {
          state.modelFormInfo = data.modelFormInfo
        }
        //syncWidget(this.myEditorUi,'state',state)
      }
      this.setStateInfos(state)
    },
    initStates() {
      let graph = this.myEditorUi.editor.graph
      let states = this.getStates(graph)
      if(states.length) {
        this.setStates(states)
      }
      this.shapeName = this.$store.state.main.widgetInfo.shapeInfo.shape
    },
    setStates(states) {
      states.forEach(item=>{
        if(item.imgInfo) {
          item.imgInfo.url = item.imgInfo.url.replace(/getechFileSystem\//, window.fileSystem)
        }
      })
      this.states = states
    },
    getStates(graph) {
      let cell = graph.getSelectionCell()
      let tempBorderColor = this.$store.state.main.widgetInfo.borderColor
      let tempBackground = this.$store.state.main.widgetInfo.bgColor
      if(this.picList.includes(this.shapeName)) {
        tempBorderColor = 'none'
        tempBackground = 'transparent'
      }
      let statesTemp = [{
        "id":'state_0',
        "name":this.$t("defaultText"),
        "desc":this.$t("defaultText"),
        'animateCls':'',
        "style":{
          background:tempBackground,
          borderColor:tempBorderColor,
          color:this.$store.state.main.widgetInfo.color
        }, 
        'check':false
      }]
      let states = [ ]
      let modelInfo = graph.getModel().getValue(cell)
      if (!mxUtils.isNode(modelInfo)) {
        var doc = mxUtils.createXmlDocument()
        var obj = doc.createElement('object')
        obj.setAttribute('label', modelInfo || '')
        modelInfo = obj
      }
      let statesAttr = modelInfo.getAttribute('statesInfo')
      if(statesAttr) {
        states = JSON.parse(statesAttr)
        states[0] = statesTemp[0]
      }else{
        states = statesTemp
      }
      return states
    },
    setStateInfos(state) {
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
      const cloneStates = JSON.parse(JSON.stringify(states)) // 修复setStates改变imgInfo.url 真实路径问题
      this.setStates(cloneStates)//重置state列表
      this.setModeInfoStates(states) 
      return states
    },
    setModeInfoStates(states) {
      let graph = this.myEditorUi.editor.graph
      let cell = graph.getSelectionCell()
      let modelInfo = graph.getModel().getValue(cell)
      if (!mxUtils.isNode(modelInfo)) {
        var doc = mxUtils.createXmlDocument()
        var obj = doc.createElement('object')
        obj.setAttribute('label', modelInfo || '')
        modelInfo = obj
      }
      modelInfo.setAttribute('statesInfo', JSON.stringify(states))
      graph.getModel().setValue(cell, modelInfo)
    },
    removeState(state,index,evet) {
      evet.stopPropagation()
      sureDialog(this.myEditorUi,`${this.$t("sureDel")}${state.name}?`,()=>{
        let graph = this.myEditorUi.editor.graph
        let states = this.getStates(graph)
        this.states.splice(index,1)
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
      //需要重新从model获取state，防止该状态绑定模型后，直接点编辑，未拿到模型信息
      if(this.shapeName !== 'light') {
        this.editState = state
        this.isAdd = true
      }
    },
  },      
}
</script>

<style scoped lang="less">
.title{
  margin-top:10px;
  display:flex;
  align-items:center;
  cursor: pointer;
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

<template>
  <div style="height:100%;">
    <div
      v-show="!isEdit"
      style="padding:0 4px;"
    >
      <div
        class="title"
        @click="addEvents"
      >
        <img src="../../../assets/images/rightsidebar/plus_ic.png"> {{ $t('rightBar.addClickEvent') }}
      </div>
      <div
        v-for="(e,index) in events"
        :key="index"
        class="event-item"
        @click="editEvent(e)"
      >
        <div style="width:20px;">
          {{ index+1 }}
        </div>
        <div
          style="flex:1;"
        >
          <div>{{ $t("rightBar.eventTypes") }}-{{ mutualTypes[e.type-1] }}</div>
          <div>
            {{ e.title }}<span v-if="e.type==3">-{{ e.stateName }}</span>
          </div>
        </div>
        <div
          style="display:flex;align-items:flex-start;"
          @click="removeEvent(e,index,$event)"
        >
          <img src="../../../assets/images/rightsidebar/dele_ic.png">
        </div>
      </div>
    </div>
    <div
      v-show="isEdit"
      style="padding:10px 4px;height:100%;"
    >
      <p style="margin-bottom: 2px;">
        {{ $t("type") }}
      </p>
      <div class="type-tab-con">
        <div
          class="type-tab"
          :class="{'selected':typeTab==1}"
          style="border-top-left-radius:2px;border-bottom-left-radius:2px;"
          @click="changeTab(1)"
        >
          {{ $t("link") }}
        </div>
        <div
          class="type-tab"
          :class="{'selected':typeTab==2}"
          @click="changeTab(2)"
        >
          {{ $t("rightBar.visibleOrHide") }}
        </div>
        <div
          class="type-tab"
          :class="{'selected':typeTab==3}"
          @click="changeTab(3)"
        >
          {{ $t("rightBar.change") }}
        </div>
        <!-- 链接 -->
        <div
          class="type-tab"
          style="border-top-right-radius:2px;border-bottom-right-radius:2px;"
          :class="{'selected':typeTab==4}"
          @click="changeTab(4)"
        >
          {{ $t("rightBar.link") }}
        </div>
        <div
          class="type-tab"
          style="border-top-right-radius:2px;border-bottom-right-radius:2px;"
          :class="{'selected':typeTab==5}"
          @click="changeTab(5)"
        >
          {{ $t("controlS") }}
        </div>
      </div>
      <LinkTo
        v-if="typeTab===1"
        :pages="pages"
        :bind-actions="bindActions"
        :current-edit-item="currentEditItem"
        @submitMutual="editEventDone"
      />
      <Visible
        v-show="typeTab===2"
        :dialogs="dialogs"
        :bind-actions="bindActions"
        :current-page-widgets="currentPageWidgets"
        :current-edit-item="currentEditItem"
        :type-tab="visibleTypeTab"
        @submitMutual="editEventDone"
        @modifyTypeTab="modifyTypeTab"
      />
      <Change
        v-show="typeTab===3"
        ref="change"
        :bind-actions="bindActions"
        :current-page-widgets="currentPageWidgets"
        @submitMutual="editEventDone"
      />
      <openLink
        v-show="typeTab===4"
        ref="link"
        :bind-actions="bindActions"
        :current-edit-item="currentEditItem"
        @submitMutual="editEventDone"
      />
      <Control
        v-show="typeTab===5"
        ref="control"
        :current-edit-item="currentEditItem"
        @submitMutual="editEventDone"
        @clearComand="clearComand"
      />
    </div>
  </div>
</template>

<script>
import LinkTo from './linkto'
import Visible from './visible'
import Change from './change'
import openLink from './link'
import Control from './control'
import {sureDialog} from '../../../services/Utils'
import {mxUtils} from '../../../services/mxGlobal'
import VueEvent from '../../../services/VueEvent.js'
// 不显示节点的名称
let forbiddenShape = ['menuCell', 'tableCell', 'label']
export default{
  components:{LinkTo,Visible,Change,Control,openLink},
  data() {
    return {
      isEdit:false,
      typeTab:1,
      mutualTypes:[this.$t('link'),this.$t('rightBar.visibleOrHide'),this.$t('rightBar.change'),'链接',this.$t('rightBar.link'),this.$t('controlS')],
      events:[],
      pages:[],//页面
      bindActions:[],
      currentEditItem:null,//Link组件当前页面名称列表选中项
      currentPageWidgets:[],//当前页面控件
      dialogs:[],//弹窗
      visibleTypeTab:1,//显隐的 弹窗 or 组件
    }
  },
  mounted() {
    this.init()
    VueEvent.$off('refreshAction')
    VueEvent.$on('refreshAction',()=>{
      this.init()
    })
  },
  methods: {
    init() {
      this.pages = []
      this.dialogs = []
      let pagesAll = this.myEditorUi.editor.pages
      this.myEditorUi.editor.pagesRank['normal'].forEach(id=>{
        this.pages.push({
          id:id,
          title:pagesAll[id].title,
          selected:false,
        })
      })
      this.myEditorUi.editor.pagesRank['dialog'].forEach(id=>{
        this.dialogs.push({
          id:id,
          title:pagesAll[id].title,
          selected:false,
          hide:true,
        })
      })
      let graph = this.myEditorUi.editor.graph
      let cells = graph.getModel().cells
      this.currentPageWidgets = []
      for (let key in cells) {
        if (cells[key].id != '0' && cells[key].id != '1') {
          let state = graph.view.getState(cells[key])
          let info = state.style.shape
          if (forbiddenShape.indexOf(info) != -1) {
            continue
          }
          let title = this.getCellInfo(graph,'palettename', cells[key])
          let hide = this.getCellInfo(graph,'hide', cells[key])
          if(!hide) {
            hide = false
          }else{
            hide = true
          }
          this.currentPageWidgets.push({
            id:cells[key].id,
            title:title,
            hide:hide,
            selected:false,
          })
        }
      }
      this.initActions()
    },
    getCellInfo(graph,key, cell) {
      let cellInfo = graph.getModel().getValue(cell)
      return cellInfo && cellInfo.attributes && cellInfo.attributes[key] && cellInfo.attributes[key].nodeValue
    },
    modifyTypeTab(index) {
      this.visibleTypeTab = index
    },
    addEvents() {
      this.pages.forEach(item=>{
        if(item.selected) {
          item.selected = false
        }
      })
      let graph = this.myEditorUi.editor.graph
      this.bindActions = this.getActions(graph)
      this.isEdit = true
      if(this.typeTab == 3) {
        this.$refs.change.addInit()
      } else if (this.typeTab == 4) {
        this.$refs.init.initData()
      }
    },
    changeTab(index,changeEditFlag) {
      this.typeTab = index
      if(index == 3 && !changeEditFlag) { // 显/隐
        this.$refs.change.addInit()
      }
    },
    clearComand() {
      let graph = this.myEditorUi.editor.graph
      const actions = this.getActions(graph)
      const res = actions.find(item=>item.mutualType == 5)
      if(res) {
        this.removeActions(res.id,null) // 移除指令
      }
    },
    editEventDone(data) {
      this.isEdit = false
      if(!data) {
        return
      }
      let action = {
        "type":"in",
        "link":"",
        "mutualType":1,//交互类型
        "innerType":"page",
        "mouseEvent":"click",
        "effectAction":"open"
      }
      action.mutualType = data.mutualType
      action.innerType = data.innerType
      action.link = data.id
      if(data.mutualType == 2) {
        let hide = 'hide'
        if(data.hide) {
          hide = 'show'
        }
        action.effectAction = hide
      }else if(data.mutualType == 3) {
        action.effectAction = 'change'
        action.stateInfo = data.stateInfo
      } else if(data.mutualType == 4) {
        action.target = data.target
      } else if(data.mutualType == 5) {
        action.data = data.commandData
        action.effectAction = data.effectAction
      }
      this.setActionInfos(action,data.isEdit)
    },
    initActions() {
      let graph = this.myEditorUi.editor.graph
      let actions = this.getActions(graph)
      if(actions.length) {
        this.setEvents(actions)
      }
    },
    setEvents(actionsInfo) {
      this.events.splice(0)
      let oldLen = actionsInfo.length
      for(let i = 0;i < oldLen;i++) {
        let item = actionsInfo[i]
        let title = this.findTitle(item)
        if(title) {
          let tempObj = {
            type:item.mutualType,
            title:title,
            innerType:item.innerType,
            id:item.link//控件或者页面或者弹窗ID
          }
          if(item.mutualType === 4) {
            tempObj.target = item.target
          }
          if(item.mutualType == 5) {// 指令
            tempObj.title = ''
          }
          if(item.stateInfo) {
            tempObj.stateName = item.stateInfo.name
            tempObj.stateId = item.stateInfo.id
          }
          this.events.push(tempObj)
        } else {//表示绑定交互的页面或弹窗或控件已被删除
          actionsInfo.splice(i,1)
        }
      }
      //判断是否有移除action，如果有，要设置到节点model中去
      if(actionsInfo.length != oldLen) {
        this.setModeInfoActions(actionsInfo)
      }
    },
    findTitle(item) {
      if (item.mutualType === 4) { // 链接
        return '链接'
      }  
      let tempList = this.pages
      if(item.mutualType > 1) {
        if(item.innerType == 'palette') {
          tempList = this.currentPageWidgets
        }else{
          tempList = this.dialogs
        }
      }
      let res = tempList.find(d=>{
        return d.id == item.link
      })
      let title = ""
      if(res) {
        title = res.title
      }
      return title
    },
    getActions(graph) {
      let actions = []
      let cell = graph.getSelectionCell()
      let modelInfo = graph.getModel().getValue(cell)
      if (!mxUtils.isNode(modelInfo)) {
        var doc = mxUtils.createXmlDocument();
        var obj = doc.createElement('object');
        obj.setAttribute('label', modelInfo || '');
        modelInfo = obj;
      }
      let actionsAttr = modelInfo.getAttribute('actionsInfo')
      if(actionsAttr) {
        actions = JSON.parse(actionsAttr)
      }
      return actions
    },
    setActionInfos(action,isEdit) {
      let graph = this.myEditorUi.editor.graph
      let actions = this.getActions(graph)
      let sameFlag = false
      for(let i = 0;i < actions.length;i++) {//同一个控件只能绑定弹窗或者页面的一个交互事件
        if(actions[i].innerType == 'page' && action.mutualType == actions[i].mutualType) {
          actions[i] = action
          sameFlag = true
          break
        }
      }
      if(isEdit) {
        let res = actions.findIndex(item=>{
          return item.mutualType == action.mutualType
        })
        if(res != -1) {
          actions[res] = action
        }
      }
      if(!sameFlag && !isEdit) {
        actions.push(action)
      }
      this.setEvents(actions)//重置event列表
      this.setModeInfoActions(actions)
      return actions
    },
    setModeInfoActions(actions) {
      let graph = this.myEditorUi.editor.graph
      let cell = graph.getSelectionCell()
      let modelInfo = graph.getModel().getValue(cell)
      if (!mxUtils.isNode(modelInfo)) {
        var doc = mxUtils.createXmlDocument();
        var obj = doc.createElement('object');
        obj.setAttribute('label', modelInfo || '');
        modelInfo = obj;
      }
      modelInfo.setAttribute('actionsInfo', JSON.stringify(actions))
      graph.getModel().setValue(cell, modelInfo)
    },
    removeEvent(event,index,evet) {
      evet.stopPropagation()
      sureDialog(this.myEditorUi,`${this.$t("rightBar.sureToDelActions")}${index + 1}`,()=>{
        this.events.splice(index,1)
        let {id,stateInfo} = event
        this.removeActions(id,stateInfo)//控件或者页面id
      },)
    },
    removeActions(id,stateInfo) {
      let graph = this.myEditorUi.editor.graph
      let actions = this.getActions(graph)
      for(let i = 0;i < actions.length;i++) {
        if(actions[i].link === id) {
          actions.splice(i,1)
          break;
        }
      }
      if(stateInfo) { //删除交互为状态('切换') 时候，将绑定的状态置为false
        let graph = this.myEditorUi.editor.graph
        let states = this.getStates(graph)
        for(let i = 0;i < states.length;i++) {
          if(states[i].id === stateInfo.stateId) {
            states[i].check = false
            break;
          }
        }
        this.setModeInfoStates(states)//存入当前节点信息中
      }
      this.setModeInfoActions(actions)
    },
    setModeInfoStates(states) {
      let graph = this.myEditorUi.editor.graph
      let cell = graph.getSelectionCell()
      let modelInfo = graph.getModel().getValue(cell)
      modelInfo.setAttribute('statesInfo', JSON.stringify(states))
      graph.getModel().setValue(cell, modelInfo)
    },
    editEvent(e) {
      let tempList = this.pages
      if (e.type !== 4) {
        if(e.type == 1) {
          tempList = this.pages
        }else  if(e.type == 2 || e.type == 5) {
          if(e.innerType == 'palette') {
            tempList = this.currentPageWidgets
            this.visibleTypeTab = 2
          }else{
            tempList = this.dialogs
            this.visibleTypeTab = 1
          }
          if(e.type == 5) {
            this.$refs.control.initDefaultData(e)
          }
        }else if(e.type == 3) {
          this.$refs.change.checkCurrent(e)
        }
        this.isEdit = true
        tempList.forEach(item=>{
          if(item.id === e.id) {
            this.currentEditItem = item
            item.selected = true
          }else{
            item.selected = false
          }
        })
      } else { // 链接 不用处理
        this.isEdit = true
        this.$refs.link.inputCurrent(e)
      }
      if(e.type == 3) {
        this.changeTab(e.type,true)
      }else {
        this.changeTab(e.type)
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
    cursor: pointer;
    &.selected{
      background:rgba(61,145,247,1);
      border:1px solid rgba(39,122,224,1);
      color:#fff;
    }
  }
}
.event-item{
  margin-top:10px;
  display:flex;
  padding:4px;
  border:1px solid rgba(212,212,212,1);
  border-radius:2px;
}
</style>

<style lang="less">
  
</style>

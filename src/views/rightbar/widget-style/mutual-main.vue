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
        <img src="../../../assets/images/rightsidebar/plus_ic.png"> 添加点击事件
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
          <div>事件类型-{{ mutualTypes[e.type-1] }}</div>
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
        类型
      </p>
      <div class="type-tab-con">
        <div
          class="type-tab"
          :class="{'selected':typeTab==1}"
          style="border-top-left-radius:2px;border-bottom-left-radius:2px;"
          @click="changeTab(1)"
        >
          跳转
        </div>
        <div
          class="type-tab"
          :class="{'selected':typeTab==2}"
          @click="changeTab(2)"
        >
          显/隐
        </div>
        <div
          class="type-tab"
          style="border-top-right-radius:2px;border-bottom-right-radius:2px;"
          :class="{'selected':typeTab==3}"
          @click="changeTab(3)"
        >
          切换
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
    </div>
  </div>
</template>

<script>
import LinkTo from './linkto'
import Visible from './visible'
import Change from './change'
import {sureDialog} from '../../../services/Utils'
import {mxUtils} from '../../../services/mxGlobal'
import VueEvent from '../../../services/VueEvent.js'
// 不显示节点的名称
let forbiddenShape = ['menuCell', 'tableCell', 'label']
export default{
    components:{LinkTo,Visible,Change},
    data() {
        return {
            isEdit:false,
            typeTab:1,
            mutualTypes:['跳转','显隐','切换'],
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
            let values = Object.values(this.myEditorUi.editor.pages)
            let pagesVal = values.filter(item=>{
                return item.type === 'normal'
            })
            let dialogVal = values.filter(item=>{
                return item.type === 'dialog'
            })
            this.pages = pagesVal.map(item=>{
                return {
                    id:item.id,
                    title:item.title,
                    selected:false,
                }
            })
            this.dialogs = dialogVal.map(item=>{
                return {
                    id:item.id,
                    title:item.title,
                    selected:false,
                    hide:true,
                }
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
                    let titleType = `${title}(${this.myEditorUi.editor.palettesInfo[info].name})` 
                    this.currentPageWidgets.push({
                        id:cells[key].id,
                        title:title,
                        titleType:titleType,
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
        },
        changeTab(index) {
            this.typeTab = index
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
            }
            this.setActionInfos(action)
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
                    if(item.stateInfo) {
                        tempObj.stateName = item.stateInfo.name
                        tempObj.stateId = item.stateInfo.stateId
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
        setActionInfos(action) {
            let graph = this.myEditorUi.editor.graph
            let actions = this.getActions(graph)
            let sameFlag = false
            for(let i = 0;i < actions.length;i++) {//同一个控件只能帮忙弹窗或者页面的一个交互事件
                if(actions[i].innerType == 'page' && action.mutualType == actions[i].mutualType) {
                    actions[i] = action
                    sameFlag = true
                    break;
                }
            }
            if(!sameFlag) {
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
            modelInfo.setAttribute('actionsInfo', JSON.stringify(actions))
            graph.getModel().setValue(cell, modelInfo)
        },
        removeEvent(event,index,evet) {
            evet.stopPropagation()
            sureDialog(this.myEditorUi,`确定要删除交互事件${index + 1}吗`,()=>{
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
            if(stateInfo) { //删除交互为状态切换时候，将绑定的状态置为false
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
            if(e.type == 2) {
                if(e.innerType == 'palette') {
                    tempList = this.currentPageWidgets
                    this.visibleTypeTab = 2
                }else{
                    tempList = this.dialogs
                    this.visibleTypeTab = 1
                }
                tempList.forEach(item=>{
                    if(item.id === e.id) {
                        this.currentEditItem = item
                        item.selected = true
                    }else{
                        item.selected = false
                    }
                })
            }else if(e.type == 3) {
                this.$refs.change.checkCurrent(e)
            }
            this.isEdit = true
            this.changeTab(e.type)
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

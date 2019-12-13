<template>
  <div
    class="geSidebarContainer"
  >
    <div
      class="left-geSidebarContainer"
    >
      <Tabs 
        type="card" 
        :animated="false"
        @on-click="tabsSwitch"
      >
        <TabPane
          :label="$t('page')" 
          class="normalPages commonPages"
        >
          <div 
            class="leftSidebar-addicon" 
            @click="addPageType(1)"
          >
            {{ $t('leftBar.addPage') }}
          </div>
          <ul>
            <li
              v-for="(d,index) in pages"
              :key="d.id"
              :class="{'hover':index == pageIndex || isShowPopMenu&&index==hoverIndex[typeTab-1]}"
              @click="checkPage(index)"
            >
              <span
                v-if="!d.isEdit"
                class="page-menu-name"
                @dblclick="popReanme($event,index)"
              >
                {{ d.title }}
              </span>
              <input
                v-if="d.isEdit"
                v-model="d.title"
                v-focus
                maxlength="20"
                class="editPageInput"
                style="width:100%;"
                @blur="saveName($event,index,d.title)"
                @keyup.enter="saveName($event,index,d.title)"
              >
              <span
                v-if="!d.isEdit"
                class="right-icon-dolt" 
                @mousemove="menuPopupShow($event,index)"
                @mouseenter="menuPopupShow($event,index)"
                @mouseout="menuMouseoutDeal($event)"
              />
            </li>
          </ul>
        </TabPane>
        <TabPane 
          :label="$t('popup')" 
          class="dialogPages commonPages"
        >
          <div 
            class="leftSidebar-addicon"
            @click="addPageType(2)"
          >
            {{ $t('leftBar.addPopup') }}
          </div>
          <ul>
            <li
              v-for="(d,index) in dialogs"
              :key="d.id"
              :class="index == dialogIndex || isShowPopMenu&&index==hoverIndex[typeTab-1] ? 'hover' : ''"
              @click="checkDialog(index)"
            >
              <span
                v-if="!d.isEdit"
                class="page-menu-name"
                @dblclick="popReanme($event,index)"
              >
                {{ d.title }}
              </span>
              <input
                v-if="d.isEdit"
                v-model="d.title"
                v-focus
                maxlength="20"
                class="editPageInput"
                style="width:100%;"
                @blur="saveName($event,index,d.title)"
                @keyup.enter="saveName($event,index,d.title)"
              >
              <span
                class="right-icon-dolt"
                @mousemove="menuPopupShow($event,index)"
                @mouseenter="menuPopupShow($event,index)"
                @mouseout="menuMouseoutDeal($event)"
              />
            </li>
          </ul>
        </TabPane>
      </Tabs>
      <Modal
        v-model="modelshow"
        class="left-sidebar-model"
        width="60vw"
        :title="alertTitleName"
        @on-ok="templateToPage"
      >
        <ul
          class="left-sidebar-list"
        >
          <li
            v-for="(item,index) in templates" 
            :key="index" 
            @click="eventClickList(index)"
          >
            <span 
              :class="templateIndex==index ? 'left-side-listactive' : ''"
            >
              <template v-if="index === 0">
                <span />
              </template>
              <!--eslint-disable-->
              <template v-if="index >= 1">
                <span 
                  style="display:flex;justify-content:center;align-items:center"
                  v-html="item.picUrl"
                >
                </span>
              </template>
            </span>
            <label>{{ $t(item.name) }}</label>
          </li>
        </ul>
      </Modal>
    </div>
    <div class="geSidebarContainer-bottom" />
    <ul
        v-if="isShowPopMenu"
        :style="popMenuStyle"
        @mouseleave="menuPopupHide"
        class="materialModelMenu"
      >
       <li class="pop-menu rename" @click="copyPage">
          {{typeTab ==1 ? $t('copyPage') : $t('copyPopup')}}
        </li>
        <li class="pop-menu delete" @click="addTemplateFun">
          {{$t('addTemplate')}}
        </li>
        <li class="pop-menu delete" @click="setHome" v-if="typeTab==1 && hoverIndex[typeTab-1]!=0">
          {{$t('setHome')}}
        </li>
        <li class="pop-menu rename" @click="popReanme">
          {{$t('rename')}}
        </li>
        <li class="pop-menu delete" @click="popDel" v-if="typeTab==1&&pages.length>1 || typeTab==2&&dialogs.length>1">
          {{$t('delete')}}
        </li>
      </ul>
  </div>
</template>
<script>
import {mxUtils} from '../../services/mxGlobal'
import {tipDialog, sureDialog} from '../../services/Utils'
import {Tabs, TabPane, Modal} from 'iview'
const addPageTypeName = ['leftBar.addPage','leftBar.addPopup']
import VueEvent from '../../services/VueEvent.js'
let pageTypeArr = ['normal','dialog']
export default {
    components: {
        Tabs,
        TabPane,
        Modal,
    },
    data() {
        return {
            modelshow: false,
            alertTitleName:'',
            typeTab:1,
            templateIndex:0,
            pageIndex:0,
            dialogIndex:0,
            templates:[],
            pages:[],
            dialogs:[],
            isShowPopMenu:false,
            popMenuStyle:{left:'202px',top:'70px'},
            hoverIndex:[-1,-1],
        }
    },
    mounted() {
        VueEvent.$off('select-nodetype')
        VueEvent.$on('select-nodetype', function() {
            this.myEditorUi.sidebar.init('nowload')
        })
    },
    methods: {
        init() {
            this.myEditorUi.sidebar.init()
            this.getPages()
            this.checkPage(0,true)
        },
        getPages() {
            let pagesRank = this.myEditorUi.editor.pagesRank
            this.getpagesDeal(this.pages, pagesRank.normal)
            this.getpagesDeal(this.dialogs, pagesRank.dialog)
        },
        getpagesDeal(resList,targetList) {
            resList.splice(0)
            let allPages = this.myEditorUi.editor.pages
            for (let key of targetList) {
                let temp = allPages[key]
                if(temp) {
                    temp.isEdit = false
                    temp.bkTitle = temp.title
                    resList.push(temp)
                }
            }
        },
        changeCurrentPage(list,index,flag) {
            if(!flag ) {//不需要设置当前页面信息
                this.myEditorUi.editor.setXml()
            }
            let id = list[index].id
            let xml = list[index].xml
            if(!xml) {
                xml = this.myEditorUi.editor.defaultXml[this.typeTab - 1]
            }
            this.myEditorUi.editor.currentPage = id
            let doc = mxUtils.parseXml(xml)
            this.myEditorUi.editor.setGraphXml(doc.documentElement)
            VueEvent.$emit('refreshCurrentPage',  this.typeTab)
        },
        checkPage(index,flag) {
            this.pageIndex = index
            this.changeCurrentPage(this.pages,index,flag)
        },
        checkDialog(index,flag) {
            this.dialogIndex = index
            this.changeCurrentPage(this.dialogs,index,flag)
        },
        tabsSwitch(type) {
            // 1 页面 2 弹窗
            if(type + 1 == this.typeTab) {
                return
            }
            this.typeTab = type + 1
            if(this.typeTab == 1) {
                this.checkPage(this.pageIndex)
            }else{
                this.checkDialog(this.dialogIndex)
            }
        },
        addPageType(type) {
            this.myEditorUi.editor.setXml()//保存当页面信息
            this.modelshow = true
            this.alertTitleName = this.$t(addPageTypeName[type - 1])
            let params = {'type': pageTypeArr[type - 1]}
            this.templates = [{'name': 'leftBar.emptyPage',picUrl: '',content: '',pageTemplateId: ''}]
            this.requestUtil.get(this.urls.addTemplate.url, params).then((res) => {
                let data = res.records || []
                data.forEach(item => {
                    let obj = {
                        name: item.name,
                        picUrl: item.picUrl,
                        pageTemplateId: item.pageTemplateId,
                        content:item.content
                    } 
                    this.templates.push(obj)
                })
            })
        },
        eventClickList(index) {
            if(index == this.templateIndex) {
                return
            }
            this.templateIndex = index
        },
        getPageIdMax() {
            let idMax = 1
            for (let id in this.myEditorUi.editor.pages) {//所有页面中的id的最大值
                const idTemp = parseInt(id.match(/^pageid_([0-9]+)/)[1])
                if(idMax < idTemp) {
                    idMax = idTemp
                }
            }
            idMax = 'pageid_' + (idMax + 1)
            return idMax
        },
        templateToPage() {
            let maxLen = this.typeTab == 1 ? this.pages.length : this.dialogs.length
            let titleText = `${this.typeTab == 1 ? this.$t('page') : this.$t('popup')}${maxLen + 1}`
            let page
            let xml
            if (this.templateIndex == 0) {
                xml = this.myEditorUi.editor.defaultXml[this.typeTab - 1]
            } else { // 弹窗和页面模版
                let content = this.templates[this.templateIndex].content
                xml = JSON.parse(content).xml
            }
            page = {
                id:"",
                title: titleText,
                xml,
                style:{},
                type: this.typeTab == 2 ? 'dialog' : 'normal'
            }
            this.dealNewPage(page)
        },
        dealNewPage(page) {
            page.id = this.getPageIdMax()
            this.myEditorUi.editor.pages[page.id] = page
            this.myEditorUi.editor.pagesRank[page.type].push(page.id)
            this.getPages()
            if(this.typeTab == 1) {
                this.checkPage(this.pages.length - 1)
            }else{
                this.checkDialog(this.dialogs.length - 1)
            }
        },
        menuPopupHide() {
            this.isShowPopMenu = false
        },
        copyPage() {
            let currentPage = this.getCurrPageOrDialog()
            let type =  pageTypeArr[this.typeTab - 1]
            let page = {
                title: `${currentPage.title}_${this.$t('copyP')}`,
                xml:currentPage.xml,
                id:'',
                style:{},
                type,
            }
            this.dealNewPage(page)
            this.menuPopupHide()
        },
        getCurrPageOrDialog() {
            let targetLists = this.typeTab == 1 ? this.pages : this.dialogs
            return targetLists[this.hoverIndex[this.typeTab - 1]]
        },
        addTemplateFun() {
            this.myEditorUi.editor.setXml()
            const svgImage =  this.myEditorUi.sidebar.getSvgImage()
            const svgImagePic = svgImage.outerHTML
            if (svgImagePic) {
                let currentPage = this.getCurrPageOrDialog()
                let params = {
                    content: JSON.stringify(currentPage),
                    pic: svgImagePic,
                    type: pageTypeArr[this.typeTab - 1]
                }
                this.requestUtil.post(this.urls.addTemplate.url, params).then((res) => {
                    if (res.picUrl) {
                        tipDialog(this.myEditorUi, `${this.$t('addSuccess')}`)
                    }
                })
            }
        },
        setHome() {
            let tmepType = pageTypeArr[this.typeTab - 1]
            let tempIndex = this.hoverIndex[this.typeTab - 1]
            let tempVal = this.myEditorUi.editor.pagesRank[tmepType][tempIndex]
            this.myEditorUi.editor.pagesRank[tmepType].splice(tempIndex, 1)
            this.myEditorUi.editor.pagesRank[tmepType].unshift(tempVal)
            
            let tempPage = this.pages[tempIndex]//更新视图页面
            this.pages.splice(tempIndex,1)
            this.pages.unshift(tempPage)
            this.menuPopupHide()
        },
        dealIsEdit(evt,index,flag) {
            if(!index && index !== 0) {
                index = this.hoverIndex[this.typeTab - 1]
            }
            if(this.typeTab == 1) {
                this.$set(this.pages[index],"isEdit",flag)
            }else{
                this.$set(this.dialogs[index],"isEdit",flag)
            }
        },
        popReanme(evt,index) {
            this.dealIsEdit(evt,index,true)
            this.menuPopupHide()
        },
        saveName(evt,index,title) {
            this.dealIsEdit(evt,index,false)
            if(!title || !title.trim()) {
                if(this.typeTab == 1) {
                    this.$set(this.pages[index],'title',this.pages[index].bkTitle)
                    tipDialog(this.myEditorUi, this.$t("pageNameCanNotEmpty"))
                }else{
                    this.$set(this.dialogs[index],'title',this.dialogs[index].bkTitle)
                    tipDialog(this.myEditorUi, this.$t("popupNameCanNotEmpty"))
                }
                return
            }
            if(this.typeTab == 2) {
                $(".dialog-title-m").html(title)
                VueEvent.$emit('refreshAction')
            }
        },
        delCurrentDal(index,list) {
            let resIndex = -1
            let tempIndex = this.hoverIndex[this.typeTab - 1]
            if(index == tempIndex) {//处理删除当前选中项后，设置当前页的问题
                if(index == list.length - 1) {
                    resIndex = 0
                }else{
                    resIndex = index
                }
            }
            list.splice(tempIndex,1)
            if(resIndex != -1) {
                this.myEditorUi.editor.currentPage = list[resIndex].id
                if(this.typeTab == 1) {
                    this.checkPage(resIndex,true)
                }else{
                    this.checkDialog(resIndex,true)
                }
            }
        },
        popDel() {
            sureDialog(this.myEditorUi, `${this.$t('sureDel')} ?`, () => {
                let type = pageTypeArr[this.typeTab - 1]
                let currentPage = this.getCurrPageOrDialog()
                let targetIndex = this.myEditorUi.editor.pagesRank[type].indexOf(currentPage.id)
                this.myEditorUi.editor.pagesRank[type].splice(targetIndex,1)
                delete this.myEditorUi.editor.pages[currentPage.id]
                if(this.typeTab == 1) {
                    this.delCurrentDal(this.pageIndex,this.pages)
                }else{
                    this.delCurrentDal(this.dialogIndex,this.dialogs)
                }
            })
        },
        menuPopupShow(evt,index) {
            this.hoverIndex[this.typeTab - 1] = index
            this.isShowPopMenu = true
            let el = document.querySelector(".normalPages ")
            this.popMenuStyle.top = `${evt.target.offsetTop - el.scrollTop}px`
            this.popMenuStyle.left = `${evt.target.offsetLeft + 20}px`
        },
        menuMouseoutDeal(evt) {
            let target = evt.toElement || evt.relatedTarget
            if(target.className != 'materialModelMenu' && !target.className.includes('pop-menu')) {
                this.menuPopupHide()
            }
        },
    }
}
</script>
<style lang="less" scoped>
    .geSidebarContainer{
        height:calc(100% - 72px); 
        top:72px;
        width:208px;
        display:flex;
        flex-direction: column;
        z-index:3;
        .geSidebarContainer-bottom{
            flex:1;
            overflow-y: auto;
        }
        .left-geSidebarContainer{
            border-bottom: solid 1px #ccc;
            /deep/.ivu-tabs{
                height:100%;
                .ivu-tabs-content{
                    height:100% !important;
                    .commonPages {
                        height:40vh;
                        overflow-y: auto;
                        padding:0 6px;
                        .leftSidebar-addicon{
                            width:100%;
                            height: 24px;
                            background: url(../../assets/images/leftsidebar/addpage.png) no-repeat left center;
                            background-size: 16px 16px;
                            padding-left:18px;
                            line-height: 24px;
                            font-size: 11px;
                            color:#797979;
                            cursor: pointer;
                        }
                    }
                }
            }
            /deep/.ivu-tabs-nav{
                width:100% !important;
                .ivu-tabs-tab{
                    width:50%;
                    padding:0 !important;
                    border-radius: 0 !important;
                    margin-right:0 !important;
                    height: 32px;
                    line-height: 32px;
                    background: #fff;
                    border:none;
                    border-top:none;
                    text-align: center;
                    &.ivu-tabs-tab-active{
                        background: #F2F2F2;
                        color:#252525;
                        border:none;
                    }
                }
                .ivu-tabs-tab:active {
                color:#252525 !important;
                }
            }
            li{
              height:24px;
              line-height: 24px;
              padding-left:18px;
              display: flex;
              background-size:16px 16px;
              cursor: pointer;
              &:not(:first-child){
                background:url(../../assets/images/material/page2_ic.png) no-repeat left center;
              }
              &:first-child{
                background:url(../../assets/images/leftsidebar/homepage.png) no-repeat left center;
              }
              &:hover,&.hover{
                  &:not(:first-child){
                    background:#3d91f7 url(../../assets/images/material/page1_ic.png) no-repeat left center;
                  }
                  &:first-child{
                    background:#3d91f7 url(../../assets/images/leftsidebar/homepageactive.png) no-repeat left center;
                  }
                  color:#fff;
                  .right-icon-dolt{
                      display: block;
                  }
              }
          }
        }
        .page-menu-name{
            flex:1;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .right-icon-dolt{
            display: none;
            float:right;
            width:20px;
            height:24px;
            background: url('../../assets/images/leftsidebar/more1_ic.png') no-repeat left center;
            background-size:16px 16px;
            position: relative;
            z-index:100
        }
    }
</style>
<style lang="less">
.left-sidebar-model{
    height:100%;
    .ivu-modal-wrap{
        .ivu-modal{
            .ivu-modal-content{
                background-color:#f5f5f5 !important;
                .ivu-modal-header{
                    height: 36px;
                    padding:0;
                    .ivu-modal-header-inner{
                        text-align: center;
                        height: 36px;
                        line-height: 36px;
                        color:#252525;
                        font-size: 12px;
                        background: linear-gradient(0deg,#d8d8d8,#e4e3e4);
                        font-weight: normal;
                        border-top-left-radius: 6px;
                        border-top-right-radius: 6px;
                    }
                }
                .ivu-modal-body{
                    overflow-y: auto;
                    .left-sidebar-list{
                        height:50vh;
                        overflow-y: scroll;
                        &>li{
                            width:120px;
                            height: 110px;
                            float:left;
                            margin-right:10px;
                            &>span{
                                display: inline-block;
                                width:120px;
                                height: 80px;
                                background:#ffffff;
                                padding:5px;
                                box-sizing: border-box;
                                box-shadow:darkgrey 1px 1px 5px 1px;
                                overflow: hidden;
                                &.left-side-listactive{
                                    padding:3px;
                                    border:2px solid #3D91F7
                                }
                                &>span{
                                    display: inline-block;
                                    width:100%;
                                    height: 100%;
                                }
                            }
                            &>label{
                                display: inline-block;
                                width:120px;
                                height:20px;
                                text-align: center;
                                line-height: 20px;
                                font-size: 12px;
                                color:#252525;
                            }
                        }
                    }
                }
                .ivu-modal-close{
                    position: absolute;
                    top:10px;
                    width:16px;
                    height:16px;
                    background: url(../../assets/images/default/closeDialog.png) no-repeat center center;
                    background-size: 16px 16px;
                    .ivu-icon{
                        display:none;
                    }
                }
                .ivu-modal-footer{
                    border-top:none;
                }
            }
        }
    }
}
.materialModelMenu{
  position: absolute;
  width:115px;
  background: #F5F5F5;
  color:#252525;
  border:1px solid #CCCCCC;
  border-radius: 2px;
  z-index: 999999;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  li{
    height: 24px;
    font-size: 14px;
    padding: 0 15px;
    cursor: pointer;
    line-height: 24px;
    &:hover{
      background: #3d91f7;
      color:#fff;
    }
  }
}
.editPageInput{
  border:none;
  outline: none;
  background:#fff;
  padding-left:5px;
  height:24px;
  line-height: 24px;
  width:120px;
}
</style>



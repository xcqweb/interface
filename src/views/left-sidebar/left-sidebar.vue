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
        </TabPane>
      </Tabs>
      <div>
        <Modal
          v-model="modelshow"
          class="left-sidebar-model"
          :title="alertTitleName"
          @on-ok="save"
          @on-cancel="cancel"
        >
          <ul
            class="left-sidebar-list"
          >
            <li
              v-for="(item,index) in alertContent" 
              :key="index" 
            >
              <span 
                :class="index === isactive ? 'left-side-listactive' : ''"
                @click="eventClickList(index)"
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
    </div>
    <div class="geSidebarContainer-bottom" />
    <div class="geSidebarContainer-bottom2" />
  </div>
</template>
<script>
import {Tabs, TabPane, Modal} from 'iview'
const addPageTypeName = ['leftBar.addPage','leftBar.addPopup']
import VueEvent from '../../services/VueEvent.js'
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
            alertContent:[],
            pageModal: [],
            alertModal:[],
            isactive: 0,
            ifclickHander:0,
            nomralType: 0
        }
    },
    created() {
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
            this.$nextTick(() => {
                $("#normalPages li:first-child .spanli").click()
            })
        },
        tabsSwitch(type) {
            // 0 页面 1 弹窗
            this.nomralType = type
            this.myEditorUi.sidebar.tabsSwitch(type)
            this.checkHasCurrent(type)
        },
        addPageType(type) {
            // 1添加页面 2添加弹窗
            this.myEditorUi.editor.setXml();
            this.modelshow = true
            this.alertTitleName = this.$t(addPageTypeName[type])
            let data = {
                'type': +type === 1 ? 'normal' : 'dialog'
            }
            this.pageModal = [{'name': 'leftBar.emptyPage',picUrl: '',content: '',pageTemplateId: ''}]
            this.alertModal = [{'name': 'leftBar.emptyPopup',picUrl: '',content: '',pageTemplateId:''}]
            this.requestUtil.get(this.urls.addTemplate.url, data).then((res) => {
                let data = res.records || []
                data.forEach(item => {
                    let obj = {
                        name: item.name,
                        picUrl: item.picUrl,
                        pageTemplateId: item.pageTemplateId,
                        content:item.content
                    } 
                    if (type === 1) {
                        this.pageModal.push(obj)
                    } else if (type === 2) {
                        this.alertModal.push(obj)
                    }
                })
                if (type === 1) {
                    this.alertContent = this.pageModal
                } else if (type === 2) {
                    this.alertContent = this.alertModal
                }
            })
            
        },
        eventClickList(index) {
            this.isactive = index
        },
        save() {
            this.alertAddPage(this.nomralType,this.isactive)
        },
        cancel() {

        },
        checkHasCurrent(type) {
            this.$nextTick(() => {
                if (+type === 0) {
                    $(".normalPages").scrollTop(0)
                    $('#normalPages >li:first-child .spanli').click()
                } else if (+type === 1) {
                    $(".dialogPages").scrollTop(0)
                    $('#dialogPages >li:first-child .spanli').click()
                }
            })
        },
        alertAddPage(typePage, listNumber) {
            const pagesRank = this.myEditorUi.editor.pagesRank
            const pages = this.myEditorUi.editor.pages
            let nameArr = []
            let namebefore = ''
            if (+typePage === 0) {
                namebefore = this.$t('page')
                nameArr = [...pagesRank.normal]
            } 
            if (+typePage === 1) {
                namebefore = this.$t('popup')
                nameArr = [...pagesRank.dialog]
            }
            let nameMax = nameArr.length
            let titleText = `${namebefore}${nameMax + 1}`
            let page = null
            let id = 1;
            for (let pageid in pages) {
                const idNum = parseInt(pageid.match(/^pageid_([0-9]+)/)[1]);
                id < idNum && (id = idNum);
            }
            id = 'pageid_' + (id + 1);
            if (+listNumber === 0) {
                let xml = this.myEditorUi.editor.defaultXml[typePage];
                page = {
                    id,
                    title: titleText,
                    xml,
                    style:{},
                    type: typePage === 1 ? 'dialog' : 'normal'
                };
            } else { // 弹窗和页面模版
                let content = +typePage === 0 ? this.pageModal[listNumber].content : this.alertModal[listNumber].content;
                let xml = JSON.parse(content).xml
                page = {
                    id,
                    title: titleText,
                    xml,
                    style:{},
                    type: typePage === 1 ? 'dialog' : 'normal'
                };
            }
            let _li = document.createElement('li');
            // _li.setAttribute('data-pageid', id);
            _li.setAttribute('data-pageid', id);
            _li.innerHTML = `<span class="spanli" style="flex:1;width:150px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap">${titleText}</span><span class="right-icon-dolt"></span>`;
            this.myEditorUi.editor.pages[id] = page
            if (+typePage === 0) {
                $("#normalPages").append(_li);
            }
            if (+typePage === 1) {
                $("#dialogPages").append(_li);
            }
            this.myEditorUi.editor.pagesRank[page.type].push(id);
            if (+typePage === 0) {
                $("#normalPages li:last-child .spanli").click();
            }
            if (+typePage === 1) {
                $("#dialogPages li:last-child .spanli").click();
            }
        }
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
        .geSidebarContainer-bottom{
            flex:1;
            overflow-y: auto;
        }
        .geSidebarContainer-bottom2{
            height:30px;
        }
        .left-geSidebarContainer{
            border-bottom: solid 1px #ccc;
            /deep/.ivu-tabs{
                height:100%;
                .ivu-tabs-content{
                    height:100% !important;
                    // padding:0 6px;
                    .commonPages {
                        height:180px;
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
                        .pageList>li{
                            height:24px;
                            line-height: 24px;
                            padding-left:18px;
                            display: flex;
                            background:url(../../assets/images/material/page2_ic.png) no-repeat left center;
                            background-size:16px 16px;
                            cursor: pointer;
                            &.currentPage{
                                color:#fff;
                                background: #3d91f7 url(../../assets/images/material/page1_ic.png) no-repeat left center;
                                background-size:16px 16px;
                                &.left-sidebar-homepage{
                                background: #3d91f7 url(../../assets/images/leftsidebar/homepageactive.png) no-repeat left center;
                                }
                                .right-icon-dolt{
                                    display: block
                                }
                            }
                            #editPageInput{
                                height: 25px;
                                border:none;
                            }
                            &.left-sidebar-homepage{
                                background: url(../../assets/images/leftsidebar/homepage.png) no-repeat left center;
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
                            &:hover{
                                color:#fff;
                                background: #3d91f7 url(../../assets/images/material/page1_ic.png) no-repeat left center;
                                background-size:16px 16px;
                                .right-icon-dolt{
                                    display: block
                                }
                                &.left-sidebar-homepage{
                                background: #3d91f7 url(../../assets/images/leftsidebar/homepageactive.png) no-repeat left center;
                                }
                                #editPageInput{
                                    height: 25px;
                                    border:none;
                                }
                            }
                        }
                        #dialogPages>li{
                            background:url('../../assets/images/leftsidebar/popup2_ic.png') no-repeat left center;
                            background-size:16px 16px;
                            &.currentPage{
                                color:#fff;
                                background-color:#3d91f7;
                                background: #3d91f7 url('../../assets/images/leftsidebar/popup1_ic.png') no-repeat left center;
                                background-size:16px 16px;
                            }
                            &:hover{
                                color:#fff;
                                background: #3d91f7 url('../../assets/images/leftsidebar/popup1_ic.png') no-repeat left center;
                                background-size:16px 16px;
                                #editPageInput{
                                    height: 25px;
                                    border:none;
                                }
                            }
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
        }
    }
</style>
<style lang="less">
body{
    .left-sidebar-model{
        height:100%;
        .ivu-modal-wrap{
            .ivu-modal{
                .ivu-modal-content{
                    width:600px;
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
                        height: 300px !important;
                        overflow-y: auto;
                        .left-sidebar-list{
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
}
</style>



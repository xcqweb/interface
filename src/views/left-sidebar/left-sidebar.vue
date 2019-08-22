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
          label="页面" 
          class="normalPages commonPages"
        >
          <div 
            class="leftSidebar-addicon" 
            @click="addPageType(1)"
          >
            添加页面
          </div>
        </TabPane>
        <TabPane 
          label="弹窗" 
          class="dialogPages commonPages"
        >
          <div 
            class="leftSidebar-addicon"
            @click="addPageType(2)"
          >
            添加弹窗
          </div>
        </TabPane>
      </Tabs>
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
              <template v-if="index >= 1">
                <span 
                  style="display:flex;justify-content:center;align-items:center"
                >
                  <img 
                    style="max-width:118px;max-height:70px"
                    :src="item.picUrl"
                  >
                </span>
              </template>
            </span>
            <label>{{ item.name }} </label>
          </li>
        </ul>
      </Modal>
    </div>
    <div class="geSidebarContainer-bottom" />
    <div class="geSidebarContainer-bottom2" />
  </div>
</template>
<script>
import {Tabs, TabPane, Modal} from 'iview'
// import {addPageDialog} from '../editor/Dialogs'
const addPageTypeName = ['','添加页面','添加弹窗']
// const addPageModal = ['',['空白页面','模版1'],['空白页面','模版1']]
import VueEvent from '../../services/VueEvent.js'
export default {
    components: {
        Tabs,
        TabPane,
        Modal,
        // addPageDialog
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
        VueEvent.$on('select-nodetype', function() {
            this.myEditorUi.sidebar.init('nowload');
        })
    },
    methods: {
        init() {
            this.myEditorUi.sidebar.init();
            setTimeout(() => {
                $("#normalPages li:first-child .spanli").click();
            })
        },
        tabsSwitch(type) {
            // 0 页面 1 弹窗
            this.nomralType = type
            this.myEditorUi.sidebar.tabsSwitch(type)
            this.$store.dispatch('pageTabIndex',type)
            this.checkHasCurrent(type)
        },
        addPageType(type) {
            // 1添加页面 2添加弹窗
            this.modelshow = true
            this.alertTitleName = addPageTypeName[type]
            let data = {
                'type': +type === 1 ? 'normal' : 'dialog'
            }
            this.pageModal = [{'name': '空白页面',picUrl: '',content: '',pageTemplateId: ''}]
            this.alertModal = [{'name': '空白弹窗',picUrl: '',content: '',pageTemplateId:''}]
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
            })
            if (type === 1) {
                this.alertContent = this.pageModal
            } else if (type === 2) {
                this.alertContent = this.alertModal
            }
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
                    $('#normalPages >li:first-child .spanli').click()
                } else if (+type === 1) {
                    $('#dialogPages >li:first-child .spanli').click()
                }
            })
        },
        alertAddPage(typePage, listNumber) {
            const pagesRank = this.myEditorUi.editor.pagesRank
            let targetArr = [...pagesRank.normal]
            let namebefore = ''
            if (+typePage === 0) {
                namebefore = `页面`
            } 
            if (+typePage === 1) {
                namebefore = `弹窗`
            }
            let getMax = targetArr.length
            let id = `pageid_${getMax + 1}`
            let titleText = `${namebefore}${getMax + 1}`
            let page = null
            if (+listNumber === 0) {
                let xml = this.myEditorUi.editor.defaultXml;
                page = {
                    title: titleText,
                    xml,
                    id,
                    type: typePage === 1 ? 'dialog' : 'normal'
                };
            } else {
                let content = +typePage === 0 ? this.pageModal[listNumber].content : this.alertModal[listNumber].content;
                let xml = JSON.parse(content).xml
                page = {
                    title: titleText,
                    xml,
                    id,
                    type: typePage === 1 ? 'dialog' : 'normal'
                };
            }
            let _li = document.createElement('li');
            _li.setAttribute('data-pageid', id);
            _li.innerHTML = `<span class="spanli" style="flex:1;width:150px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap">${titleText}</span><span class="right-icon-dolt"></span>`;
            let changeRank = this.myEditorUi.editor.pagesRank[page.type];
            this.myEditorUi.editor.pages[id] = page
            // 根据类型插入列表
            changeRank.push(id);
            if (+typePage === 0) {
                $("#normalPages").append(_li);
            }
            if (+typePage === 1) {
                $("#dialogPages").append(_li);
            }
            this.myEditorUi.editor.pagesRank[page.type] = [].concat(changeRank);
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
    }
    .left-geSidebarContainer{
        .ivu-tabs{
            // overflow: auto;
            height:100%;
            /deep/.ivu-tabs-content{
                height:100% !important;
                // overflow: auto;
                padding:0 6px;
                .commonPages {
                    height:180px;
                    overflow-y: auto
                }
                .leftSidebar-addicon{
                    width:100%;
                    height: 24px;
                    background: url(../../assets/images/leftsidebar/addpage.png) no-repeat left center;
                    background-size: 16px 16px;
                    padding-left:18px;
                    line-height: 24px;
                    font-size: 11px;
                    color:#797979;
                }
                /deep/.pageList>li{
                    height:24px;
                    line-height: 24px;
                    padding-left:18px;
                    display: flex;
                    background:url(../../assets/images/material/page1_ic.png) no-repeat left center;
                    background-size:16px 16px;
                    &.currentPage{
                        color:#fff;
                        background: #3d91f7 url(../../assets/images/material/page1_ic.png) no-repeat left center;
                        background-size:16px 16px;
                        &.left-sidebar-homepage{
                        background: #3d91f7 url(../../assets/images/leftsidebar/homepageactive.png) no-repeat left center;
                        }
                        #editPageInput{
                            height: 25px;
                            border:none;
                        }
                    }
                    &.left-sidebar-homepage{
                        background: url(../../assets/images/leftsidebar/homepage.png) no-repeat left center;
                    }
                    .right-icon-dolt{
                        display: block;
                        float:right;
                        width:20px;
                        height:24px;
                        background: url('../../assets/images/leftsidebar/more1_ic.png') no-repeat left center;
                        background-size:16px 16px;
                        position: relative;
                        z-index:100
                    }
                }
                #dialogPages>li{
                    background:url('../../assets/images/leftsidebar/popup2_ic .png') no-repeat left center;
                    background-size:16px 16px;
                    &.currentPage{
                        color:#fff;
                        background-color:#3d91f7;
                        background: #3d91f7 url('../../assets/images/leftsidebar/popup2_ic .png') no-repeat left center;
                        background-size:16px 16px;
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
                border:none !important;
                margin-right:0 !important;
                height: 32px;
                line-height: 32px;
                background: #F2F2F2;
                text-align: center;
                &.ivu-tabs-tab-active{
                    border-color:#fff !important;
                    background: #fff;
                }
            }
        }
    }
    .left-sidebar-model{
        /deep/.ivu-modal{
            // top: 0px;
            // transform: translateY(-50%);
            // top:50%;
            /deep/.ivu-modal-content{
                width:600px;
                background-color:#f5f5f5 !important;
                .ivu-modal-header{
                    height: 36px;
                    padding:0;
                    /deep/.ivu-modal-header-inner{
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
                                &.left-side-listactive{
                                    padding:3px;
                                    border:2px solid #3D91F7
                                }
                                &>span{
                                    display: inline-block;
                                    width:100%;
                                    height: 100%;
                                    // background:#acacac
                                }
                            }
                            &>label{
                                display: inline-block;
                                width:120px;
                                height:30px;
                                text-align: center;
                                line-height: 30px;
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
    
</style>



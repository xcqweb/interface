<template>
  <div
    class="geSidebarContainer"
    style="height:calc(100% - 72px); top:72px;width:208px;"
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
          v-for="(item,index) in alertContent" 
          :key="index" 
          class="left-sidebar-list"
        >
          <li>
            <span 
              :class="index === isactive ? 'left-side-listactive' : ''"
              @click="eventClickList(index)"
            >
              <template v-if="index === 0">
                <span>0</span>
              </template>
              <template v-if="index >= 1">
                <span>123</span>
              </template>
            </span>
            <label>{{ item }} </label>
          </li>
        </ul>
      </Modal>
    </div>
  </div>
</template>
<script>
import {Tabs, TabPane, Modal} from 'iview'
// import {addPageDialog} from '../editor/Dialogs'
const addPageTypeName = ['','添加页面','添加弹窗']
const addPageModal = ['',['空白页面','模版1'],['空白页面','模版1']]
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
            alertContent:'',
            isactive: 0,
            ifclickHander:0,
            nomralType: 0
        }
    },
    created() {
    },
    mounted() {

    },
    methods: {
        init() {
            //this.myEditorUi.sidebar.init();
        },
        tabsSwitch(type) {
            // 0 页面 1 弹窗
            this.nomralType = type
            this.myEditorUi.sidebar.tabsSwitch(type)
        },
        addPageType(type) {
            // 1添加页面 2添加弹窗
            this.modelshow = true
            this.alertTitleName = addPageTypeName[type]
            this.alertContent = addPageModal[type]
        },
        eventClickList(index) {
            this.isactive = index
        },
        save() {
            this.alertAddPage(this.nomralType)
        },
        cancel() {

        },
        alertAddPage(typePage) {
            console.log(typePage)
            console.log(this.myEditorUi.editor.pages)
            console.log(this.myEditorUi.editor.pagesRank)
            // const pages = this.myEditorUi.editor.pages
            const pagesRank = this.myEditorUi.editor.pagesRank
            var xml = this.myEditorUi.editor.defaultXml;
            let targetArr = [...pagesRank.normal, ...pagesRank.dialog]
            let numtarget = []
            targetArr.forEach((item) => {
                var _r = item.split('_')
                numtarget.push(_r[1])
            })
            var getMax = Math.max.apply(null, numtarget)
            var id = `pageid_${getMax + 1}`
            let titleText = `页面${getMax + 1}`
            let page = {
                title: titleText,
                xml,
                id,
                type: typePage === 1 ? 'dialog' : 'normal'
            };
            let _li = document.createElement('li');
            // let resPage = this.myEditorUi.editor.addPage(page);
            _li.setAttribute('data-pageid', id);
            _li.innerHTML = `<span>${titleText}</span><span class="right-icon-dolt"></span>`;
            let changeRank = this.myEditorUi.editor.pagesRank[page.type];
            // 根据类型插入列表
            changeRank.push(id);
            if (+typePage === 0) {
                $("#normalPages").append(_li);
            }
            if (+typePage === 1) {
                $("#dialogPages").append(_li);
            }
            this.myEditorUi.editor.pagesRank[page.type] = [].concat(changeRank);
            _li.click()
        }
    }
}
</script>
<style lang="less" scoped>
    .left-geSidebarContainer{
        height:278px;
        overflow: hidden;
        .ivu-tabs{
            overflow: hidden;
            height:100%;
            /deep/.ivu-tabs-content{
                height:100% !important;
                overflow: auto;
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
                }
                /deep/.pageList>li{
                    height:24px;
                    line-height: 24px;
                    padding-left:18px;
                    background:url(../../assets/images/leftsidebar/homepage.png) no-repeat left center;
                    background-size:16px 16px;
                    &.currentPage{
                        color:#fff;
                        background-color:#3d91f7;
                        background: #3d91f7 url(../../assets/images/leftsidebar/homepageactive.png) no-repeat left center;
                        background-size:16px 16px;
                        #editPageInput{
                            height: 25px;
                            border:none;
                        }
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
                    min-height: 300px !important;
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



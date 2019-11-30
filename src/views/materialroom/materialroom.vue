<template>
  <div
    class="materialroom"
    style="position: absolute;"
  >
    <Modal
      v-model="showmarerial"
      width="70vw"
      class="materialroom-model"
      :title="$t(materialAlertName)"
      :mask-closable="false"
      @on-cancel="cancel"
    >
      <div class="materialtabs">
        <Tabs
          type="card"
          :animated="false"
          @on-click="tabsSwitch"
        >
          <!--组件库-->
          <TabPane 
            :label="$t('shapeLibrary')"
          >
            <div class="assembly-wrapper commom-wrapper">
              <div class="assembly-left materialtabs-left">
                <div
                  class="assembly-seach-wrapper"
                >
                  <input 
                    v-model="keyWidget" 
                    type="text"
                    :placeholder="$t('materialRoom.searchShapeName')"
                    class="assembly-seach-icon"
                    @input="searchWidget"
                  >
                  <div
                    v-show="!keyWidget"
                    class="addassembly"
                    @click="addassemblyFn"
                  >
                    {{ $t('addShapes') }}
                  </div>
                  <div
                    v-show="!keyWidget"
                    class="left-max-height"
                  >
                    <ul
                      class="assembly-list"
                    >
                      <li
                        v-for="(item,index) in assemblyArrayName"
                        :key="index"
                        class="assembly-icon"
                        :class="{'left-side-listactive':index === isActive,'hover': popUpType==1&&isShowPopMenu&&index==hoverIndex}"
                        @click="selectAssemblyList(index, item.materialLibraryId)"
                        @dblclick="dblRename(index)"
                      >
                        <span
                          v-if="!item.isEdit"
                          class="left-assembly-left"
                        >
                          {{ $t(item.name) }}
                        </span>
                        <input
                          v-if="item.isEdit"
                          v-model="item.model"
                          v-focus
                          class="editPageInput"
                          @blur="saveLayoutName(index)"
                        >
                        <span 
                          v-if="index >= 3 && !item.isEdit" 
                          class="right-spots" 
                          @mousemove="menuPopupShow($event,index)"
                          @mouseenter="menuPopupShow($event,index)"
                          @mouseout="menuMouseoutDeal($event)"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="assembly-right materialtabs-right">
                <ul
                  v-if="arrListTables.length"
                  class="assembly-right-wrapper"
                >
                  <li 
                    v-for="(item, index) in arrListTables"
                    :key="item.materialId || index"
                    class="user-uploadimage"
                  >
                    <div>
                      <span
                        v-if="item.model"
                        :style="'background:url(' + (item.image) + ') no-repeat center center;'"
                        @mouseenter="menuPopupHide"
                      />
                      <span
                        v-else 
                        :style="'background:url(' + (DIR_+item.image) + ') no-repeat center center;'"
                      />
                      <label
                        v-if="item.model"
                        class="right-spots-assemly"
                        @click="renameWidget($event,index)"
                      />
                    </div>
                    <span
                      style="display:block;width:98px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center;"
                    >
                      <span
                        v-if="!item.isEdit"
                        class="left-assembly-left"
                        :title="item.name"
                        @mouseenter="menuPopupHide"
                        @dblclick="dblRenameWidget(index)"
                      >
                        {{ $t(item.name) }}
                      </span>
                      <input
                        v-if="item.isEdit"
                        v-model="item.model"
                        v-focus
                        class="editPageInput"
                        style="width:100%;"
                        @blur="saveWidgetName(index)"
                      >
                    </span>
                  </li>
                </ul>
                <div
                  v-else
                  class="right-nodata"
                >
                  <span>
                    {{ $t(nodata) }}
                  </span>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane
            :label="$t('materialRoom.templateLibs')" 
          >
            <div class="material-wrapper commom-wrapper">
              <div class="material-left materialtabs-left">
                <ul
                  class="material-list"
                >
                  <li
                    v-for="(item,index) in materialArrayName"
                    :key="index"
                    class="material-icon left-page-icon"
                    :class="index === isActive2 ? 'left-side-listactive' : ''"
                    @click="selectMaterialList(index)"
                  > 
                    {{ $t(item) }}
                  </li>
                </ul>
              </div>
              <div class="material-right materialtabs-right">
                <ul
                  v-if="materials.length"
                  class="material-right-wrapper"
                >
                  <li
                    v-for="(item,index) in materials"
                    :key="item.pageTemplateId"
                    class="user-uploadimage"
                  >
                    <div>
                      <!--eslint-disable-->
                        <span
                          style="display:flex;justify-content:center;align-items:center"
                          @mouseenter="menuPopupHide"
                          v-html="item.picUrl"
                        />
                        <label 
                          class="right-spots-assemly" 
                           @click="renameTemplate($event,index)"
                        />
                      </div>
                      <span
                        v-if="!item.isEdit"
                        @dblclick="dblRenameTemplate(index)"
                        @mouseenter="menuPopupHide"
                        :title="item.name"
                        style="width:98px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center;cursor:pointer;"
                      >
                        {{ item.name }}
                      </span>
                       <input
                        v-if="item.isEdit"
                        v-model="item.model"
                        v-focus
                        class="editPageInput"
                        style="width:100%;"
                        @blur="saveTemplateName(index)"
                      >
                    </li>
                  </ul>
                  <div
                    v-else
                    class="right-nodata"
                  >
                    <span>
                      {{ $t(nodata) }}
                    </span>
                  </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div class="materialtabs-footer">
        <template v-if="isActive >= 2 && tabNumber === 0">
          <span>
            <Upload 
              action="api/iot-cds/sources/material"
              :show-upload-list="false"
              :with-credentials="true"
              :headers="headers"
              :format="['jpg', 'svg', 'png', 'gif']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :on-error="uploadErr"
              :on-success="uploadSucc"
              :data="uploadData"
            >
              <Button type="primary">{{ $t(madeltext[1]) }}</Button>
            </Upload>
          </span>
        </template>
      </div>
       <ul
        v-if="isShowPopMenu"
        :style="popMenuStyle"
        @mouseleave="menuPopupHide"
        class="materialModelMenu"
      >
        <li class="pop-menu rename" @click="popReanme">
          {{$t('rename')}}
        </li>
        <li class="pop-menu delete" @click="popDel">
          {{$t('delete')}}
        </li>
      </ul>
    </Modal>
  </div>
</template>
<script>
import {Tabs,TabPane,Modal, Upload, Message, Button} from 'iview'
import {getCookie,setCookie,sureDialog} from '../../services/Utils'
let backMaterialLit = [],needRefreshLeft = false
const ROOT_LEN = 1 // 新增组件时计算长度使用
export default {
    components: {
        Tabs,
        TabPane,
        Modal,
        Upload,
        Button,
    },
    data() {
        return {
            materialAlertName: 'materialLibrary',
            showmarerial: true,
            madeltext: ['cancel',this.$t('materialRoom.uploadWidget')],
            assemblyArrayName: [
                {
                    name: 'generalShape',
                    materialLibraryId: '1'
                },
                {
                    name: 'chartShape',
                    materialLibraryId: '2'
                }
            ],
            materialArrayName: ['pageTemplate', 'popupTemplate'],
            uploadData:{},
            DIR_: `../../../static/stencils/basic/`,
            baseAssembly: [
                {image:'text.svg', name :'text'},
                {image:'rectangle.svg',name :'rectangle'},
                {image:'ellipse.svg',name : 'circle'},
                {image:'line.svg', name :'beeline'},
                {image:'button.png', name :'button'},
                {image:'menulist.png',name :'menu'},
                {image:'tableBox.svg', name :'table'},
                {image:'image.svg', name :'image'},
                {image:'linkTag.svg',name : 'Link'},
                {image:'light.svg', name :'light'},
                {image:'progress.svg', name :'progressBar'},
                {image:'pipeline1.svg', name :'pipeline1'},
                {image:'pipeline2.svg',name :'pipeline2'},
                {image:'pipeline3.svg',name :'pipeline3'}
            ],
            tablesAssembly: [
                {image:'lineChart.svg',name :'trend'},
                {image:'gaugeChart.svg',name :'dashboard'}
            ],
            arrListTables: [],
            arrListTableIndex:-1,
            isActive: 0,
            isActive2: -1,
            tabNumber: 0,
            materials: [],
            nodata: 'noData',
            headers:{
                'Authorization': `Bearer ${getCookie('token')}`
            },
            isShowPopMenu:false,
            popUpType:1,
            popMenuStyle:{left:'126px',top:0},
            hoverIndex:-1,
            keyWidget:"",
            templateIndex:0,
            materialAll:[],
        }
    },
    created() {
    },
    mounted() {
        this.arrListTables = this.baseAssembly
        backMaterialLit = JSON.parse(JSON.stringify(this.arrListTables))
        this.uploadurl = this.urls.materialList.url
        this.getAllMaterail()
    },
    methods: {
        getAllMaterail() {
            let res = []
            this.requestUtil.get(this.urls.materialRightList.url).then(data=>{
                if(data) {
                    data.forEach(item=>{
                        res.push({
                            name: item.descript,
                            image: item.picUrl,
                            isEdit:false,
                            model:item.descript,
                            materialId: item.materialId
                        })
                    })
                    this.materialAll = [...this.baseAssembly,...this.tablesAssembly,...res]
                }
            })
        },
        init() {
            this.requestUtil.get(this.urls.materialList.url).then((res) => {
                let data = res.records || []
                data.forEach((item) => {
                    let obj = {
                        name: item.libraryName,
                        materialLibraryId: item.materialLibraryId,
                        isEdit:false,
                        model:item.libraryName,
                    }
                    this.assemblyArrayName.push(obj)
                })
            })
        },
        searchWidget() {
            let keyword = this.keyWidget.trim()
            if(keyword) {
                this.arrListTables = this.materialAll.filter(item=>{
                    return this.$t(`${item.name}`).includes(keyword)
                })
            }else{
                this.arrListTables = backMaterialLit
            }
        },
        menuPopupShow(evt,index) {
            this.popUpType = 1 //组件库
            this.hoverIndex = index
            this.isShowPopMenu = true
            let el = document.querySelector(".left-max-height")
            this.popMenuStyle.top = `${evt.target.offsetTop + 35 - el.scrollTop}px`
        },
        menuPopupHide() {
            this.isShowPopMenu = false
        },
        menuMouseoutDeal(evt) {
            let target = evt.toElement || evt.relatedTarget
            if(target.className != 'materialModelMenu' && !target.className.includes('pop-menu')) {
                this.menuPopupHide()
            }
        },
        popReanme() {
            if(this.popUpType == 1) {
                this.$set(this.assemblyArrayName[this.hoverIndex],'isEdit',true)
            }else if(this.popUpType == 2) {
                this.$set(this.arrListTables[this.arrListTableIndex],'isEdit',true)
            }else if(this.popUpType == 3) {
                this.$set(this.materials[this.templateIndex],'isEdit',true)
            }
            this.menuPopupHide()
        },
        popDel() {
            if(this.popUpType == 1) {
                let materialLibraryId = this.assemblyArrayName[this.hoverIndex].materialLibraryId
                sureDialog(this.myEditorUi,`${this.$t('sureDel')}${this.$t('widgetLib')}-${this.assemblyArrayName[this.hoverIndex].model}`,()=>{
                    this.requestUtil.delete(this.urls.materialList.url + `/${materialLibraryId}`).then(res=>{
                        if(res.code == 0) {
                            this.assemblyArrayName.splice(this.hoverIndex,1)
                            Message.info(this.$t('deleteSuccessfully'))
                        }
                    })
                })
            }else if(this.popUpType == 2 ) {
                let materialId = this.arrListTables[this.arrListTableIndex].materialId
                sureDialog(this.myEditorUi,`${this.$t('sureDel')}${this.$t('widget')}-${this.arrListTables[this.arrListTableIndex].model}`,()=>{
                    this.requestUtil.delete(this.urls.materialRightList.url + `/${materialId}`).then(res=>{
                        if(res.code == 0) {
                            this.arrListTables.splice(this.arrListTableIndex,1)
                            Message.info(this.$t('deleteSuccessfully'))
                        }
                    })
                })
            }else if(this.popUpType == 3 ) {
                let pageTemplateId = this.materials[this.templateIndex].pageTemplateId
                sureDialog(this.myEditorUi,`${this.$t('sureDel')}${this.$t('template')}-${this.materials[this.templateIndex].model}`,()=>{
                    this.requestUtil.delete(this.urls.addTemplate.url + `/${pageTemplateId}`).then(res=>{
                        if(res.code == 0) {
                            this.materials.splice(this.templateIndex,1)
                            Message.info(this.$t('deleteSuccessfully'))
                        }
                    })
                })
            }
        },
        saveLayoutName(index) {
            if(this.assemblyArrayName[index].name === this.assemblyArrayName[index].model) {
                this.$set(this.assemblyArrayName[index],'isEdit',false)
                return
            }
            
            let data = {
                materialLibraryId:this.assemblyArrayName[index].materialLibraryId,
                libraryName:this.assemblyArrayName[index].model
            }
            this.requestUtil.put(this.urls.materialList.url,data).then(res=>{
                if(res.libraryName) {
                    needRefreshLeft = true
                    this.$set(this.assemblyArrayName[index],'name',res.libraryName)
                    Message.info(this.$t('modifySuccessfully'))
                    this.$set(this.assemblyArrayName[index],'isEdit',false)//会触发blur事件
                }
            })
        },
        dblRename(index) {
            if(index > 2) {
                this.$set(this.assemblyArrayName[index],'isEdit',true)
            }
        },
        cancel() {
            this.$emit('triggerCancel',needRefreshLeft)
            needRefreshLeft = false//重置
        },
        renameWidget(evt,index) {
            this.arrListTableIndex = index
            this.popUpType = 2 //右侧组件
            this.isShowPopMenu = true
            let el = document.querySelector(".assembly-right.materialtabs-right")
            let con = evt.target.parentElement
            this.popMenuStyle.left = `${evt.target.offsetLeft + con.offsetLeft + 30}px`
            this.popMenuStyle.top = `${evt.target.offsetTop + con.offsetTop - el.scrollTop + 44}px`
        },
        saveWidgetName(index) {
            if(this.arrListTables[index].name === this.arrListTables[index].model) {
                this.$set(this.arrListTables[index],'isEdit',false)
                return
            }
            let data = {
                materialId:this.arrListTables[index].materialId,
                descript:this.arrListTables[index].model
            }
            this.requestUtil.put(this.urls.materialRightList.url,data).then(res=>{
                if(res.descript) {
                    this.$set(this.arrListTables[index],'name',res.descript)
                    Message.info(this.$t('modifySuccessfully'))
                    needRefreshLeft = true
                    this.$set(this.arrListTables[index],'isEdit',false)//会触发blur事件
                }
            })
        },
        dblRenameWidget(index) {
            this.popUpType = 2 //右侧组件
            this.$set(this.arrListTables[index],'isEdit',true)
        },
        renameTemplate(evt,index) {
            this.templateIndex = index
            this.popUpType = 3 //右侧模板
            this.isShowPopMenu = true
            let el = document.querySelector(".material-right-wrapper")
            let con = evt.target.parentElement
            this.popMenuStyle.left = `${evt.target.offsetLeft + con.offsetLeft + 30}px`
            this.popMenuStyle.top = `${evt.target.offsetTop + con.offsetTop - el.scrollTop + 44}px`
        },
        saveTemplateName(index) {
            if(this.materials[index].name === this.materials[index].model) {
                this.$set(this.materials[index],'isEdit',false)
                return
            }
            let data = {
                pageTemplateId:this.materials[index].pageTemplateId,
                name:this.materials[index].model
            }
            this.requestUtil.put(this.urls.addTemplate.url,data).then(res=>{
                if(res.name) {
                    this.$set(this.materials[index],'name',res.name)
                    Message.info(this.$t('modifySuccessfully'))
                    needRefreshLeft = true
                    this.$set(this.materials[index],'isEdit',false)//会触发blur事件
                }
            })
        },
        dblRenameTemplate(index) {
            this.popUpType = 3 //右侧模板
            this.$set(this.materials[index],'isEdit',true)
        },
        selectAssemblyList(index, materialLibraryId) {
            if(index == this.isActive) {
                return
            }
            this.isActive = index
            if (index >= 2) {
                this.arrListTables = []
                this.uploadData = {
                    materialLibraryId: materialLibraryId
                }
                this.requestUtil.get(this.urls.materialList.url + `/${materialLibraryId}`).then((res) => {
                    let data = res.materialList
                    data.forEach((item) => {
                        let obj = {
                            name: item.descript,
                            image: item.picUrl,
                            isEdit:false,
                            model:item.descript,
                            materialId: item.materialId
                        }
                        this.arrListTables.push(obj)
                    })
                })
            }else{
                if(index === 0) {
                    this.arrListTables = this.baseAssembly
                }else{
                    this.arrListTables = this.tablesAssembly
                }
            }
            backMaterialLit = JSON.parse(JSON.stringify(this.arrListTables))
        },
        selectMaterialList(index) {
            if(index == this.isActive2) {
                return
            }
            this.isActive2 = index
            let data = {type:'normal'}
            if(index == 1) {
                data.type = 'dialog'
            }
            this.materials = []
            this.requestUtil.get(this.urls.addTemplate.url,data).then((res) => {
                let data = res.records || []
                data.forEach((item) => {
                    let obj = {
                        picUrl: item.picUrl,
                        pageTemplateId: item.pageTemplateId,
                        name: item.name,
                        isEdit:false,
                        model:item.name,
                        type:item.type,
                    }
                    this.materials.push(obj)
                })
            })
        },
        tabsSwitch(type) {
            this.tabNumber = type
            if(this.tabNumber === 1) { // 默认是页面模版
                this.selectMaterialList(0)
            }
        },
        addassemblyFn() {
            // 新增
            let num = this.assemblyArrayName.length - ROOT_LEN
            let name = `新建组件库${num}`
            let data = {
                libraryName: name,
                descript:'',
                libraryType: 1
            }
            this.requestUtil.post(this.urls.materialList.url, data).then((res) => {
                needRefreshLeft = true
                this.assemblyArrayName.push({name: name,materialLibraryId: res.materialLibraryId,isEdit:true,model:name})
                this.selectAssemblyList(num + ROOT_LEN,res.materialLibraryId)
            })
        },
        uploadSucc(res) {
            needRefreshLeft = true
            let addpicObj = {
                image:res.picUrl,
                name: res.descript,
                isEdit:false,
                model:res.descript,
                materialId: res.materialId
            }
            this.arrListTables.push(addpicObj)
            Message.info(this.$t('uploadSuccessfully'))
        },
        uploadErr(res,file,fileList) {
            if(res.status == 418) {
                let refreshToken = getCookie('refreshToken')
                this.requestUtil.post('/api/auth/refreshToken', {refreshToken}).then(res => {
                    setCookie('token', res.token)
                    setCookie('refreshToken', res.refreshToken)
                    let formData = new FormData()
                    formData.append('file', fileList)
                    formData.append('materialLibraryId', this.uploadData.materialLibraryId)
                    this.myEditorUi.editor.uploadFile(this.myEditorUi, this.urls.materialRightList.url, 'POST', formData, (data)=>{
                        this.uploadSucc(data)
                    })
                })
                return
            }
        },
        handleFormatError() {
            setTimeout ( () => {
                Message.warning(this.$t('materialRoom.imageFormatRequirement'))
            }, 1000);
        },
        handleMaxSize() {
            setTimeout ( () => {
                Message.warning(this.$t('materialRoom.imageSizeRequirement'))
            }, 1000);
        },
    }
}
</script>
<style lang="less">
    .materialroom-model{
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
                      padding: 0;
                      .materialtabs{
                          position: relative;
                          height:60vh;
                          .ivu-tabs {
                              padding:0px;
                              display:flex;
                              height: 100%;
                              flex-direction:column;
                              .ivu-tabs-bar{
                                  height: 38px;
                                  background: #d8d8d8;
                                  margin-bottom:0px;
                                  .ivu-tabs-nav-container{
                                      padding-left:30px;
                                      .ivu-tabs-nav{
                                          height: 24px;
                                          .ivu-tabs-ink-bar{
                                              display:none;
                                          }
                                          .ivu-tabs-tab{
                                              height: 24px;
                                              line-height: 24px;
                                              font-size: 12px;
                                              text-align: center;
                                              background: #fff;
                                              border:none;
                                              margin-right:0;
                                              border-radius: 0;
                                              padding:0;
                                              width:80px;
                                              &.ivu-tabs-tab-active{
                                                  background: #3D91F7;
                                                  color:#fff;
                                              }
                                          }
                                      }
                                      
                                  }
                              }
                              .ivu-tabs-content{
                                  flex:1;
                                  height:100%;
                                  .ivu-tabs-tabpane{
                                      height:100%;
                                      .commom-wrapper{
                                          display: flex;
                                          height: 100%;
                                          .materialtabs-left{
                                              width:150px;
                                              box-sizing: border-box;
                                              border-right:1px solid #ccc;
                                              padding:5px;
                                              .assembly-seach-wrapper{
                                                  box-sizing: border-box;
                                                  display: flex;
                                                  height:100%;
                                                  flex-direction: column;
                                                  .assembly-seach-icon{
                                                      padding:0 16px 0 5px;
                                                      width:100%;
                                                      font-size: 12px;
                                                      box-sizing: border-box;
                                                      border:1px solid #d4d4d4;
                                                      border-radius: 2px;
                                                      background: #fff url("../../assets/images/material/searchicon.png") no-repeat right center;
                                                      background-size:16px 16px;
                                                  }
                                                  .addassembly{
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
                                                  .left-max-height{
                                                    height: calc(100% - 72px);
                                                    overflow-y: auto;
                                                    .assembly-list{
                                                        .assembly-icon{
                                                            width:100%;
                                                            height: 24px;
                                                            background: url(../../assets/images/material/subassembly2_ic.png) no-repeat left center;
                                                            background-size: 16px 16px;
                                                            padding-left:18px;
                                                            line-height: 24px;
                                                            font-size: 12px;
                                                            color:#252525;
                                                            cursor: pointer;
                                                            display: flex;
                                                            &:hover,&.hover{
                                                               color:#fff;
                                                               background: url(../../assets/images/material/subassembly2_ic_check.png) no-repeat left center;
                                                               background-color: #277AE0;
                                                                .right-spots{
                                                                  background: url('../../assets/images/leftsidebar/more1_ic.png') no-repeat center center;
                                                                  background-size:16px 16px;
                                                                   visibility: visible;
                                                                }
                                                            }
                                                            .left-assembly-left{
                                                              width:100px;
                                                              overflow:hidden;
                                                              text-overflow:ellipsis;
                                                              white-space: nowrap;
                                                              flex:1;
                                                              display:block;
                                                            }
                                                            &.left-side-listactive{
                                                                color:#fff;
                                                                background: url(../../assets/images/material/subassembly2_ic_check.png) no-repeat left center;
                                                                background-color: #277AE0;
                                                                .right-spots{
                                                                  background: url('../../assets/images/leftsidebar/more1_ic.png') no-repeat center center;
                                                                  background-size:16px 16px;
                                                                  visibility: visible;
                                                                }
                                                            }
                                                            &>.right-spots{
                                                                display:block;
                                                                width:24px;
                                                                height:24px;
                                                                visibility: hidden;
                                                                background: url(../../assets/images/material/more2_ic.png) no-repeat center center;
                                                                background-size: 16px 16px;
                                                                position: relative;
                                                            }
                                                        }
                                                    }
                                                  }
                                              }
                                              .material-list {
                                                 li{
                                                   cursor: pointer;
                                                 }
                                                  &>li:first-child{
                                                      &.material-icon{
                                                          width:100%;
                                                          height: 24px;
                                                          padding-left:18px;
                                                          line-height: 24px;
                                                          font-size: 12px;
                                                          color:#252525;
                                                          &.left-page-icon {
                                                              background: url(../../assets/images/material/page2_ic.png) no-repeat left center;
                                                              background-size: 16px 16px;
                                                          }
                                                          &.left-side-listactive{
                                                              background: #277AE0 url(../../assets/images/material/page1_ic.png) no-repeat left center;
                                                              color:#fff;
                                                          }
                                                      }
                                                  }
                                                  &>li:last-child{
                                                    &.material-icon{
                                                          width:100%;
                                                          height: 24px;
                                                          padding-left:18px;
                                                          line-height: 24px;
                                                          font-size: 12px;
                                                          color:#252525;
                                                          &.left-page-icon {
                                                              background: url(../../assets/images/material/popup2_ic.png) no-repeat left center;
                                                              background-size: 16px 16px;
                                                          }
                                                          &.left-side-listactive{
                                                              background: #277AE0 url(../../assets/images/leftsidebar/popup1_ic.png) no-repeat left center;
                                                              color:#fff;
                                                          }
                                                      }
                                                  }
                                              }
                                              
                                          }
                                          .materialtabs-right{
                                              flex:1;
                                              padding:5px;
                                              overflow-y: auto;
                                              .right-nodata{
                                                  height:100%;
                                                  text-align: center;
                                                  display:flex;
                                                  justify-content: center;
                                                  align-items: center;
                                                  color:#acacac;
                                              }
                                              .assembly-right-wrapper{
                                                  display: flex;
                                                  flex-wrap:wrap;
                                                  overflow-y:auto; 
                                                  max-height: 100%;
                                                  &>li{
                                                      width:100px;
                                                      height:130px; 
                                                      margin-right: 10px;
                                                      &>div{
                                                          width:100px;
                                                          height: 100px;
                                                          border:1px solid #E1E1E1;
                                                          display: flex;
                                                          justify-content: center;
                                                          align-items: center; 
                                                          &>span{
                                                              display: block;
                                                              width:72px;
                                                              height: 72px;
                                                          }
                                                      }
                                                      &>span{
                                                          display: block;
                                                          width:100px;
                                                          height: 30px;
                                                          text-align: center;
                                                          line-height: 30px;
                                                          color: #252525;
                                                          display:flex;
                                                          justify-content: center;
                                                          .left-assembly-left{
                                                            width:100px;
                                                            overflow:hidden;
                                                            text-overflow:ellipsis;
                                                            white-space: nowrap;
                                                            flex:1;
                                                            display:block;
                                                            cursor: pointer;
                                                          }
                                                      }
                                                  }
                                                  &>li.user-uploadimage{
                                                    width:100px;
                                                    height:130px;
                                                    &>div{
                                                        width:100px;
                                                        height: 100px;
                                                        border:1px solid #E1E1E1;
                                                        display: flex;
                                                        justify-content: center;
                                                        align-items: center; 
                                                        position: relative;
                                                        &>span{
                                                            display: block;
                                                            width:72px;
                                                            height: 72px;
                                                        }
                                                        .right-spots-assemly{
                                                          display: block;
                                                          width:30px;
                                                          height:20px;
                                                          background: url(../../assets/images/material/more2_ic.png) no-repeat right center;
                                                          background-size: 16px 16px;
                                                          position: absolute;
                                                          right:0;
                                                          bottom:0;
                                                          cursor: pointer;
                                                        }
                                                      }
                                                      &>span{
                                                          display: flex;
                                                          width:100px;
                                                          height: 30px;
                                                          text-align: center;
                                                          line-height: 30px;
                                                          color: #252525;
                                                      }
                                                  }
                                              }
                                              .material-right-wrapper{
                                                  display: flex;
                                                  flex-wrap:wrap;
                                                  overflow-y:auto; 
                                                  &>li{
                                                      width:100px;
                                                      height:130px;
                                                      margin-right:5px;
                                                      &>div{
                                                          width:100px;
                                                          height: 100px;
                                                          border:1px solid #E1E1E1;
                                                          display: flex;
                                                          justify-content: center;
                                                          align-items: center; 
                                                          &>span{
                                                              display: block;
                                                              width:72px;
                                                              height: 72px;
                                                              // border: 1px dashed #E1E1E1;
                                                          }
                                                      }
                                                      &>span{
                                                          display: block;
                                                          width:100px;
                                                          height: 30px;
                                                          text-align: center;
                                                          line-height: 30px;
                                                          color: #252525;
                                                      }
                                                  }
                                                  &>li.user-uploadimage{
                                                    &>div{
                                                        width:100px;
                                                        height: 100px;
                                                        border:1px solid #E1E1E1;
                                                        display: flex;
                                                        justify-content: center;
                                                        align-items: center; 
                                                        position: relative;
                                                        &>span{
                                                            display: block;
                                                            width:720px;
                                                            height: 72px;
                                                            overflow: hidden;
                                                        }
                                                        .right-spots-assemly{
                                                          display: block;
                                                          width:30px;
                                                          height:20px;
                                                          background: url(../../assets/images/material/more2_ic.png) no-repeat right center;
                                                          background-size: 16px 16px;
                                                          position: absolute;
                                                          right:0;
                                                          bottom:0;
                                                          cursor: pointer;
                                                        }
                                                      }
                                                      &>span{
                                                          display: block;
                                                          width:100px;
                                                          height: 30px;
                                                          text-align: center;
                                                          line-height: 30px;
                                                          color: #252525;
                                                      }
                                                  }
                                              }
                                          }
                                      }
                                  }
                              }
                          }
                      }
                      .materialtabs-footer{
                          border-top: 1px solid #e8eaec;
                          height:76px;
                          padding-right:24px;
                          padding-top:24px;
                          &>span{
                            float:right;
                          }
                      }
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
                      display:none;
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



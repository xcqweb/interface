<template>
  <div class="materialroom">
    <Modal
      v-model="showmarerial"
      width="720px"
      class="left-sidebar-model"
      :title="materialAlertName"
      :mask-closable="false"
      @on-cancel="cancel"
    >
      <div class="materialtabs">
        <Tabs
          type="card"
          :animated="false"
          @on-click="tabsSwitch"
        >
          <TabPane 
            label="组件库"
          >
            <div class="assembly-wrapper commom-wrapper">
              <div class="assembly-left materialtabs-left">
                <div class="assembly-seach-wrapper">
                  <input 
                    type="text" 
                    placeholder="搜索组件名称" 
                    class="assembly-seach-icon"
                  >
                  <div
                    class="addassembly"
                    @click="addassemblyFn"
                  >
                    新增组件库
                  </div>
                  <ul
                    v-for="(item,index) in assemblyArrayName"
                    :key="index"
                    class="assembly-list"
                  >
                    <li
                      class="assembly-icon"
                      :class="index === isactive ? 'left-side-listactive' : ''"
                      @click="selectAssemblyList(index, item.materialLibraryId)"
                    >
                      <span>{{ item.name }}</span>
                      <span 
                        v-if="index >= 3" 
                        class="right-spots" 
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <div class="assembly-right materialtabs-right">
                <ul class="assembly-right-wrapper">
                  <template v-if="isactive >= 2">
                    <li 
                      v-for="(item, index) in arrListTables"
                      :key="index"
                      class="user-uploadimage"
                    >
                      <div>
                        <span :style="'background:url(' + (item.image) + ') no-repeat center center;background-size:120px 60px;'" />
                        <label
                          class="right-spots-assemly"
                          @click="MiddassemblyListHandle($event,POSITION_RIGHT,index, item.materialId)" 
                        />
                      </div>
                      <span
                        style="width:136px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center"
                        :class="index === isactive3 ? 'right-list-listactive' : ''"
                      >
                        {{ item.name }}
                      </span>
                    </li>
                  </template>
                  <template v-else>
                    <li
                      v-for="(item, key) in arrListTables"
                      :key="key"
                    >
                      <div>
                        <span :style="'background:url(' + (DIR_ + key) + ') no-repeat center center;background-size:30px 30px;'" />
                        <label class="right-spots-assemly" />
                      </div>
                      <span>
                        {{ item }}
                      </span>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </TabPane>
          <TabPane
            label="模版库" 
          >
            <div class="material-wrapper commom-wrapper">
              <div class="material-left materialtabs-left">
                <ul
                  v-for="(item,index) in materialArrayName"
                  :key="index"
                  class="material-list"
                >
                  <li
                    v-if="index === 0"
                    class="material-icon left-page-icon"
                    :class="index === isactive2 ? 'left-side-listactive' : ''"
                    @click="selectMaterialList(0)"
                  >
                    {{ item }}
                  </li>
                  <li 
                    v-if="index === 1"
                    class="material-icon left-alert-icon"
                    :class="index === isactive2 ? 'left-side-listactive' : ''"
                    @click="selectMaterialList(1)"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div class="material-right materialtabs-right">
                <template
                  v-if="isactive2 === 0"
                >
                  <ul
                    class="material-right-wrapper"
                  >
                    <li
                      v-for="(item, index) in pageMaterial"
                      :key="index"
                      class="user-uploadimage"
                    >
                      <div>
                        <span style="display:flex;justify-content:center;align-items:center">
                          <img
                            style="max-width:120px;max-height:100px"
                            :src="item.picUrl" 
                          >
                        </span>
                        <label 
                          class="right-spots-assemly" 
                          @click="MiddassemblyListHandle($event,POSITION_RIGHT,index, item.pageTemplateId)"
                        />
                      </div>
                      <span
                        style="width:136px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center"
                        :class="index === isactive3 ? 'right-list-listactive' : ''"
                      >
                        {{ item.name }}
                      </span>
                    </li>
                  </ul>
                </template>
                <template
                  v-if="isactive2 === 1"
                >
                  <ul
                    class="material-right-wrapper"
                  >
                    <li
                      v-for="(item, index) in alertMaterial"
                      :key="index"
                      class="user-uploadimage"
                    >
                      <div>
                        <span style="display:flex;justify-content:center;align-items:center">
                          <img
                            style="max-width:120px;max-height:100px"
                            :src="item.picUrl" 
                          >
                        </span>
                        <label 
                          class="right-spots-assemly" 
                          @click="MiddassemblyListHandle($event,POSITION_RIGHT,index, item.pageTemplateId)"
                        />
                      </div>
                      <span
                        style="width:136px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center"
                        :class="index === isactive3 ? 'right-list-listactive' : ''"
                      >
                        {{ item.name }}
                      </span>
                    </li>
                  </ul>
                </template>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div class="materialtabs-footer">
        <template v-if="isactive <= 1 || tabNumeber === 1">
          <span>
            <!-- <Button @click="cancel">
              {{ madeltext[0] }}
            </Button> -->
          </span>
        </template>
        <template v-if="isactive >= 2 && tabNumeber === 0">
          <span>
            <Upload 
              action="api/iot-cds/sources/material"
              :show-upload-list="false" 
              :format="['jpg', 'svg', 'png', 'gif']"
              :max-size="500"
              :on-format-error="handleFormatError"
              :on-error="uploadErr"
              :on-success="uploadSucc" 
              :data="uploadData"
            >
              <Button type="primary">{{ madeltext[1] }}</Button>
            </Upload>
          </span>
        </template>
      </div>
    </Modal>
  </div>
</template>
<script>
import {Tabs,TabPane,Modal, Upload, Message, Button} from 'iview'
// import {tipDialog} from '../../services/Utils'
const ROOT_LEN = 2 // 新增组件时计算长度使用
export default {
    components: {
        Tabs,
        TabPane,
        Modal,
        Upload,
        Button
    },
    data() {
        return {
            materialAlertName: '素材库',
            showmarerial: true,
            madeltext: ['取消', '上传组件'],
            showOktext: true,
            assemblyArrayName: [
                {
                    name: '基本组件',
                    materialLibraryId: '1'
                },
                {
                    name: '图表组件',
                    materialLibraryId: '2'
                },
                {
                    name: 'layout组件',
                    materialLibraryId: 'e76e6a1b18e493472bc869d835811711'
                }
            ],
            materialArrayName: ['页面模版', '弹窗模版'],
            uploadData:{},
            DIR_: `../../../static/stencils/basic/`,
            // bacPicUrl: `http://10.74.20.26:8009/`,
            baseAssembly: {
                'rectangle.png': '矩形',
                'button.png': '按钮',
                'menulist.png': '菜单',
                'multipleCheck.png': '复选框',
                'singleCheck.png': '单选',
                'image.png': '图片',
                'select.png': '下拉列表',
                'table.png': '表格',
                'primitive.png': '图元',
                'endarrow.png': '箭头',
                'line.png': '直线',
                'curve.png': '曲线',
                'linkTag.png': 'Link',
                'text.png': '文字',
                'light.png': '指示灯',
                'progress.png': '进度条',
                'pipeline1.png': '管道1',
                'pipeline2.png': '管道2'
            },
            tablesAssembly: {
                'lineChart.png': '趋势图',
                'gaugeChart.png': '仪表盘'
            },
            arrListTables: [],
            emptyArray: [],
            isactive: 0,
            isactive2: 0,
            isactive3: null,
            tabNumeber: 0,
            renderIndex: 0,
            modelleftmenus: {
                'rename': '重命名',
                'delete': '删除'
            },
            modelrightmenus: {
                'rename': '重命名',
                'delete': '删除'
            },
            POSITION_LEFT: 'left',
            POSITION_RIGHT: 'right',
            ismouseenter: false,
            allMaterial: [],
            pageMaterial: [],
            alertMaterial: []
        }
    },
    created() {
    },
    mounted() {
        this.arrListTables = this.baseAssembly
        this.uploadurl = this.urls.materialList.url
    },
    methods: {
        init() {
            this.requestUtil.get(this.urls.materialList.url).then((res) => {
                let data = res.records
                data.forEach((item) => {
                    let obj = {
                        name: item.libraryName,
                        materialLibraryId: item.materialLibraryId
                    }
                    this.assemblyArrayName.push(obj)
                })
            })
            let oInp = document.querySelector('.assembly-seach-icon')
            oInp.oninput = this.debounce(this.selectMaterial, 1000)
        },
        cancel() {
            this.$emit('triggerCancel')
        },
        selectAssemblyList(index, materialLibraryId) {
            this.emptyArray = []
            if (index >= 2) {
                // 获取组件库id 上传组件时候要用
                this.uploadData = {
                    materialLibraryId: materialLibraryId
                }
                this.requestUtil.get(this.urls.materialList.url + `/${materialLibraryId}`).then((res) => {
                    let data = res.materialList
                    data.forEach((item) => {
                        let obj = {
                            name: item.descript,
                            image: item.picUrl,
                            materialId: item.materialId
                        }
                        this.emptyArray.push(obj)
                    })
                })
            }
            this.arrListTables = index === 0 ? this.baseAssembly : (index === 1 ? this.tablesAssembly : this.emptyArray)
            this.isactive = index
            this.addListHandle(index)
        },
        addListHandle(index) {
            let newMouse = this.mounseHandle()
            this.$nextTick(() => {
                const assemblyListEl = document.querySelector('.left-side-listactive .right-spots')
                if (assemblyListEl) {
                    newMouse(assemblyListEl,'mouseover',(event) => {
                        this.assemblyListHandle(event, this.POSITION_LEFT,index)
                        $('.left-side-listactive .right-spots').css({'pointer-events': 'none'})
                    }, false)
                }
            })
        },
        selectMaterialList(index) {
            this.isactive2 = index
            this.getSelectMaterial(this.isactive2)
        },
        getSelectMaterial(index) {
            let data = ''
            if (+index === 0) {
                data = {
                    type: 'normal'
                }
            } else if(+index === 1) {
                data = {
                    type: 'dialog'
                }
            }
            if ((this.pageMaterial.length && +index === 0) || (this.alertMaterial.length && +index === 1)) {
                return false
            }
            this.requestUtil.get(this.urls.addTemplate.url,data).then((res) => {
                let data = res.records || []
                console.log(data)
                data.forEach((item) => {
                    let obj = {
                        picUrl: item.picUrl,
                        pageTemplateId: item.pageTemplateId,
                        name: item.name
                    }
                    if (+index === 0) {
                        this.pageMaterial.push(obj)
                    } else if (+index === 1) {
                        this.alertMaterial.push(obj)
                    }
                })
            })
        },
        tabsSwitch(type) {
            this.tabNumeber = type
            if(this.tabNumeber === 1) { // 默认是页面模版
                this.getSelectMaterial(0)
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
                this.assemblyArrayName.push({name: name,materialLibraryId: res.materialLibraryId})
                this.selectAssemblyList(num + ROOT_LEN)
            })
        },
        debounce(handle, deLay) {
            var timer = null
            // 触发 拿到组件
            this.requestUtil.get(this.urls.materialRightList.url).then((res) => {
                console.log('素材列表',res)
            })
            return function() {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    console.log(this)
                    handle.call(this, this.value)
                }, deLay);
            }
        },
        selectMaterial(value) {
            if (value !== '') {
                console.log(66)
            } 
        },
        uploadSucc(res) {
            // this.emptyArray = []
            let addpicObj = {
                image:res.picUrl,
                name: res.descript,
                materialId: res.materialId
            }
            this.emptyArray.push(addpicObj)
            this.arrListTables = this.emptyArray
            Message.info('上传成功')
        },
        uploadErr() {
            setTimeout ( () => {
                Message.info('上传失败')
            }, 5000);
        },
        handleFormatError() {
            setTimeout ( () => {
                Message.warning('图片格式不符合要求,只允许上传后缀名为"jpg", "svg", "png", "gif"的图片')
            }, 1000);
        },
        handleMaxSize() {
            setTimeout ( () => {
                Message.warning('图片大小不符合要求,每个文件大小不超过 2M(2048kb)')
            }, 1000);
        },
        mounseHandle() {
            if(window.addEventListener) { // 对浏览器兼容的判断
                return function(el, type, fn, capture) {
                    el.addEventListener(type, fn, capture)
                }
            } else if(window.attachEvent) {
                return function(el, type, fn, capture) {
                    el.attachEvent(type, fn, capture)
                }
            }
        },
        MiddassemblyListHandle(evt,type,index,materialId) {
            this.isactive3 = index
            console.log(materialId)
            this.assemblyListHandle(evt,type,index,materialId)
        },
        assemblyListHandle(evt, type,index, materialId) {
            evt.preventDefault();
            evt.stopPropagation()
            var menulist = document.createElement('ul')
            if (document.querySelector('#materialModelMenu')) {
                document.querySelector('#materialModelMenu').remove()
            }
            menulist.id = 'materialModelMenu';
            for (var key in this.modelleftmenus) {
                var menu = document.createElement('li')
                menu.innerText = this.modelleftmenus[key]
                menu.className = key
                menu.setAttribute('data-type', key)
                menulist.appendChild(menu)
            }
            const wrapperElent = document.querySelector('.materialtabs')
            wrapperElent.appendChild(menulist)
            menulist.style.left = evt.clientX + 'px';
            menulist.style.top = evt.clientY + 'px';
            let newMousHandele = this.mounseHandle()
            // 点击文档document 隐藏
            this.documentClick(newMousHandele)
            this.liClickHandle(newMousHandele ,menulist, type, index, materialId)
        },
        documentClick(fn) {
            fn(document,'click', (evt) => {
                if (evt.target.parentNode && evt.target.parentNode.id !== 'materialModelMenu' && evt.target.className !== 'right-spots') {
                    this.hideMaterialModelMenu();
                }
            });
        },
        liClickHandle(fn, el, type,index, materialId) {
            fn(el, 'click',(evt) => {
                evt.stopPropagation()
                let target = evt.target;
                let actionType = target.getAttribute('data-type')
                let element = ''
                if (type === this.POSITION_RIGHT) {
                    if (this.tabNumeber === 0) {
                        element = document.querySelector('.assembly-right-wrapper .right-list-listactive')
                    } else {
                        element = document.querySelector('.material-right-wrapper .right-list-listactive')
                    }
                } else if (type === this.POSITION_LEFT) {
                    element = document.querySelector('.assembly-list>li.left-side-listactive')
                }
                switch(actionType) {
                    case 'rename':
                        this.renameHandle(element,actionType,type,index,materialId)
                        break;
                    case 'delete':
                        this.deleteHandle(element, actionType, type,index, materialId)
                        break;
                    default:
                        console.log('操作出错啦！')
                        break;
                }
            })
        },
        hideMaterialModelMenu() {
            $('.left-side-listactive .right-spots').css({'pointer-events': 'auto'})
            $('#materialModelMenu').hide()
        },
        renameHandle(ele, actionType, type,index, materialId) {
            console.log(ele)
            console.log(actionType)
            console.log(type)
            console.log(index)
            console.log(materialId)
            let editInput = document.createElement('input');
            editInput.id = 'editPageInput'
            let oldVal = ele.innerText
            editInput.value = oldVal
            ele.innerText = ''
            ele.appendChild(editInput)
            editInput.focus()
            let saveFn = () => {
                let name = editInput.value.trim()
                document.body.removeEventListener('click', saveFn)
                if (!name) {
                    Message.warning('页面名称不能为空')
                    ele.innerHTML = `<span>${oldVal}</span><span class="right-spots"></span>`
                } else if (name.length > 20) {
                    Message.warning('页面名称不能超过20个字符');
                    ele.innerHTML = `<span>${oldVal}</span><span class="right-spots"></span>`
                } else {
                    ele.innerHTML = `<span>${name}</span><span class="right-spots"></span>`
                    if (name !== oldVal) {
                        // console.log('重新命名请求接口')
                        if (this.tabNumeber === 0) {
                            let data = {
                                materialLibraryId:this.uploadData.materialLibraryId ? this.uploadData.materialLibraryId : '' ,
                                libraryName: name,
                            }
                            this.requestUtil.put(this.urls.materialList.url,data).then((res) => {
                                if (res.libraryName) {
                                    Message.info('修改成功')
                                }
                            })
                        } else if (this.tabNumeber === 1) {
                            let data = {
                                pageTemplateId:materialId,
                                name: name
                            }
                            this.requestUtil.put(this.urls.addTemplate.url,data).then((res) => {
                                if (res.name) {
                                    Message.info('修改成功')
                                }
                            })
                        }
                        
                    }
                }
                this.addListHandle()
            }
            let newMousHandele = this.mounseHandle()
            newMousHandele(document.body, 'click', saveFn)
            newMousHandele(editInput, 'click', function(e) {
                if (e.stopPropagation) {
                    e.stopPropagation()
                } else {
                    e.cancelBubble = true
                }
            }, true)
            newMousHandele(editInput, 'keydown', function(e) {
                if (e.keyCode === 13) {
                    saveFn()
                }
            })
            this.hideMaterialModelMenu()
        },
        deleteHandle(ele, actionType, type,index, materialId) {
            let materialLibraryId = this.uploadData.materialLibraryId
            if (+this.tabNumeber === 0) {
                if (type === this.POSITION_LEFT) {
                    this.requestUtil.delete(this.urls.materialList.url + `/${materialLibraryId}`).then((res) => {
                        if (res.code === '0') {
                            this.assemblyArrayName.splice(index ,1)
                        }
                    })
                } else if (type === this.POSITION_RIGHT) {
                    this.requestUtil.delete(this.urls.materialRightList.url + `/${materialId}`,).then((res) => {
                        if (this.arrListTables[index].materialId === materialId && res.code === '0') {
                            this.arrListTables.splice(index,1)
                        }
                    })
                }
            } else if (+this.tabNumeber === 1) {
                this.requestUtil.delete(this.urls.addTemplate.url + `/${materialId}`,).then((res) => {
                    if (res.code === '0') {
                        // tipDialog(this.myEditorUi,`删除成功`)
                        Message.warning('删除成功')
                        if (+this.isactive2 === 1) {
                            this.alertMaterial.splice(index, 1)
                        } else if(+this.isactive2 === 0) {
                            this.pageMaterial.splice(index, 1)
                        }
                    }
                })
            }
            
            this.hideMaterialModelMenu()
        },
        deleteOneAssemly(evt) {
            console.log(evt)
        }
    }
    
}
</script>
<style lang="less" scoped>
    .left-sidebar-model{
        /deep/.ivu-modal{
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
                    padding: 0;
                    .materialtabs{
                        position: relative;
                        .ivu-tabs {
                            padding:0px;
                            display:flex;
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
                                .ivu-tabs-tabpane{
                                    height:100%;
                                    .commom-wrapper{
                                        display: flex;
                                        height: 100%;
                                        .materialtabs-left{
                                            width:150px;
                                            box-sizing: border-box;
                                            border-right:1px solid #ccc;
                                            padding:2px 5px;
                                            .assembly-seach-wrapper{
                                                box-sizing: border-box;
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
                                                        &.left-side-listactive{
                                                            background-color: #277AE0;
                                                            color:#fff;
                                                            .right-spots{
                                                                background: url('../../assets/images/leftsidebar/more1_ic.png') no-repeat center center;
                                                                background-size:16px 16px;
                                                            }
                                                            #editPageInput{
                                                              border:none;
                                                              height:25px;
                                                              width:100%;
                                                            }
                                                        }
                                                        &>.right-spots{
                                                            display:block;
                                                            width:24px;
                                                            height:24px;
                                                            background: url(../../assets/images/material/more2_ic.png) no-repeat center center;
                                                            background-size: 16px 16px;
                                                            float:right;
                                                            position: relative;
                                                        }
                                                    }
                                                }
                                            }
                                            .material-list {
                                                &>li{
                                                    &.material-icon{
                                                        width:100%;
                                                        height: 24px;
                                                        padding-left:18px;
                                                        line-height: 24px;
                                                        font-size: 12px;
                                                        color:#252525;
                                                        &.left-page-icon {
                                                            background: url(../../assets/images/material/page1_ic.png) no-repeat left center;
                                                            background-size: 16px 16px;
                                                        }
                                                        &.left-alert-icon {
                                                            background: url(../../assets/images/material/popup2_ic.png) no-repeat left center;
                                                            background-size: 16px 16px;
                                                        }
                                                        &.left-side-listactive{
                                                            background-color: #277AE0;
                                                            color:#fff;
                                                        }
                                                    }
                                                }
                                            }
                                            
                                        }
                                        .materialtabs-right{
                                            flex:1;
                                            padding:4px 2px 2px;
                                            height: 300px;
                                            overflow-y: auto;
                                            .assembly-right-wrapper{
                                                display: flex;
                                                flex-wrap:wrap;
                                                overflow-y:auto; 
                                                &>li{
                                                    width:60px;
                                                    height:80px;
                                                    margin-right:2px;
                                                    &>div{
                                                        width:60px;
                                                        height: 60px;
                                                        border:1px solid #E1E1E1;
                                                        display: flex;
                                                        justify-content: center;
                                                        align-items: center; 
                                                        &>span{
                                                            display: block;
                                                            width:36px;
                                                            height: 36px;
                                                            border: 1px dashed #E1E1E1;
                                                        }
                                                    }
                                                    &>span{
                                                        display: block;
                                                        width:60px;
                                                        height: 20px;
                                                        text-align: center;
                                                        line-height: 20px;
                                                        color: #252525;
                                                    }
                                                }
                                                &>li.user-uploadimage{
                                                  width:138px;
                                                  height:158px;
                                                  margin-right:2px;
                                                  &>div{
                                                      width:138px;
                                                      height: 138px;
                                                      border:1px solid #E1E1E1;
                                                      display: flex;
                                                      justify-content: center;
                                                      align-items: center; 
                                                      position: relative;
                                                      &>span{
                                                          display: block;
                                                          width:120px;
                                                          height: 100px;
                                                          border: 1px dashed #E1E1E1;
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
                                                        width:138px;
                                                        height: 20px;
                                                        text-align: center;
                                                        line-height: 20px;
                                                        color: #252525;
                                                        &.right-list-listactive{
                                                          &>#editPageInput{
                                                            border:none;
                                                            height:20px;
                                                            text-align: center
                                                          }
                                                        }
                                                    }
                                                }
                                            }
                                            .material-right-wrapper{
                                                display: flex;
                                                flex-wrap:wrap;
                                                overflow-y:auto; 
                                                &>li{
                                                    width:138px;
                                                    height:158px;
                                                    margin-right:2px;
                                                    &>div{
                                                        width:138px;
                                                        height: 138px;
                                                        border:1px solid #E1E1E1;
                                                        display: flex;
                                                        justify-content: center;
                                                        align-items: center; 
                                                        &>span{
                                                            display: block;
                                                            width:120px;
                                                            height: 120px;
                                                            border: 1px dashed #E1E1E1;
                                                        }
                                                    }
                                                    &>span{
                                                        display: block;
                                                        width:138px;
                                                        height: 20px;
                                                        text-align: center;
                                                        line-height: 20px;
                                                        color: #252525;
                                                    }
                                                }
                                                &>li.user-uploadimage{
                                                  // width:138px;
                                                  // height:158px;
                                                  // margin-right:2px;
                                                  &>div{
                                                      width:138px;
                                                      height: 138px;
                                                      border:1px solid #E1E1E1;
                                                      display: flex;
                                                      justify-content: center;
                                                      align-items: center; 
                                                      position: relative;
                                                      &>span{
                                                          display: block;
                                                          width:120px;
                                                          height: 100px;
                                                          border: 1px dashed #E1E1E1;
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
                                                        width:138px;
                                                        height: 20px;
                                                        text-align: center;
                                                        line-height: 20px;
                                                        color: #252525;
                                                        &.right-list-listactive{
                                                          &>#editPageInput{
                                                            border:none;
                                                            height:20px;
                                                            text-align: center
                                                          }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        #materialModelMenu{
                            width:115px;
                            background: #F5F5F5;
                            color:#252525;
                            border:1px solid #CCCCCC;
                            position: fixed;
                            border-radius: 2px;
                            z-index: 999999;
                            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
                            li{
                                height: 24px;
                                font-size: 14px;
                                padding: 0 15px;
                                cursor: default;
                                line-height: 24px;
                                &:hover{
                                  background: #3d91f7;
                                  color:#fff;
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
</style>



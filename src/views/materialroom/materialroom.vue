<template>
  <div class="materialroom">
    <Modal
      v-model="showmarerial"
      width="720px"
      class="materialroom-model"
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
          <!--组件库-->
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
                    v-if="leftshowIf"
                    class="addassembly"
                    @click="addassemblyFn"
                  >
                    新增组件库
                  </div>
                  <template
                    v-if="leftshowIf"
                  >
                    <div class="left-max-height">
                      <ul
                        class="assembly-list"
                      >
                        <li
                          v-for="(item,index) in assemblyArrayName"
                          :key="index"
                          class="assembly-icon"
                          :class="index === isactive ? 'left-side-listactive' : ''"
                          @click="selectAssemblyList($event,index, item.materialLibraryId)"
                        >
                          <span class="left-assembly-left">{{ item.name }}</span>
                          <span 
                            v-if="index >= 3" 
                            class="right-spots" 
                          />
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </div>
              <div class="assembly-right materialtabs-right">
                <ul
                  v-if="arrListTables.length"
                  class="assembly-right-wrapper"
                >
                  <template v-if="!ifselectFrom">
                    <template v-if="+isactive >= 2">
                      <li 
                        v-for="(item, index) in arrListTables"
                        :key="item.materialId"
                        class="user-uploadimage"
                      >
                        <div>
                          <span :style="'background:url(' + (item.image) + ') no-repeat center center;background-size:100px 60px;'" />
                          <label
                            class="right-spots-assemly"
                            @click="MiddassemblyListHandle($event,POSITION_RIGHT,index, item.materialId)" 
                          />
                        </div>
                        <span
                          style="display:block;width:98px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center"
                          :class="index === isactive3 ? 'right-list-listactive' : ''"
                        >
                          <span
                            class="left-assembly-left"
                          >
                            {{ item.name }}
                          </span>
                          <span class="right-spots" />
                        </span>
                      </li>
                    </template>
                    <template v-else>
                      <li
                        v-for="(item) in arrListTables"
                        :key="item.materialId"
                      >
                        <div>
                          <span 
                            class="right-background-size" 
                            :style="'background:url(' + (DIR_ + item.image) + ') no-repeat center center;'" 
                          />
                          <label class="right-spots-assemly" />
                        </div>
                        <span>
                          {{ item.name }}
                        </span>
                      </li>
                    </template>
                  </template>
                  <template v-else>
                    <template 
                      v-if="newArr.length"
                    >
                      <li 
                        v-for="(item, index) in newArr"
                        :key="index"
                      >
                        <div>
                          <span :style="'background:url(' + (DIR_ + item.image) + ') no-repeat center center;background-size:60px 60px;'" />
                          <label class="right-spots-assemly" />
                        </div>
                        <span>
                          {{ item.name }}
                        </span>
                      </li>
                    </template>
                    <template 
                      v-if="newArr2.length"
                    >
                      <li 
                        v-for="(item, index) in newArr2"
                        :key="index"
                        class="user-uploadimage"
                      >
                        <div>
                          <span :style="'background:url(' + (item.image) + ') no-repeat center center;background-size:100px 60px;'" />
                          <label
                            class="right-spots-assemly"
                            @click="MiddassemblyListHandle($event,POSITION_RIGHT,index, item.materialId)" 
                          />
                        </div>
                        <span
                          style="display:block;width:98px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center"
                          :class="index === isactive3 ? 'right-list-listactive' : ''"
                        >
                          <span
                            class="left-assembly-left"
                          >
                            {{ item.name }}
                          </span>
                          <span class="right-spots" />
                        </span>
                      </li>
                    </template>
                  </template>
                </ul>
                <div
                  v-else
                  class="right-nodata"
                >
                  <span>
                    {{ nodata }}
                  </span>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane
            label="模版库" 
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
                    :class="index === isactive2 ? 'left-side-listactive' : ''"
                    @click="selectMaterialList(index)"
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
                    v-if="pageMaterial.length"
                    class="material-right-wrapper"
                  >
                    <li
                      v-for="(item, index) in pageMaterial"
                      :key="item.pageTemplateId"
                      class="user-uploadimage"
                    >
                      <div>
                        <span
                          style="display:flex;justify-content:center;align-items:center"
                          v-html="item.picUrl"
                        />
                        <label 
                          class="right-spots-assemly" 
                          @click="MiddassemblyListHandle($event,POSITION_RIGHT,index, item.pageTemplateId)"
                        />
                      </div>
                      <span
                        style="width:98px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center"
                        :class="index === isactive3 ? 'right-list-listactive' : ''"
                      >
                        {{ item.name }}
                      </span>
                    </li>
                  </ul>
                  <div
                    v-else
                    class="right-nodata"
                  >
                    <span>
                      {{ nodata }}
                    </span>
                  </div>
                </template>
                <template
                  v-if="isactive2 === 1"
                >
                  <ul
                    v-if="alertMaterial.length"
                    class="material-right-wrapper"
                  >
                    <li
                      v-for="(item, index) in alertMaterial"
                      :key="item.pageTemplateId"
                      class="user-uploadimage"
                    >
                      <div>
                        <span 
                          style="display:flex;justify-content:center;align-items:center"
                          v-html="item.picUrl"
                        />
                        <label 
                          class="right-spots-assemly" 
                          @click="MiddassemblyListHandle($event,POSITION_RIGHT,index, item.pageTemplateId)"
                        />
                      </div>
                      <span
                        style="width:98px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center"
                        :class="index === isactive3 ? 'right-list-listactive' : ''"
                      >
                        {{ item.name }}
                      </span>
                    </li>
                  </ul>
                  <div 
                    v-else
                    class="right-nodata"
                  >
                    <span>
                      {{ nodata }}
                    </span>
                  </div>
                </template>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div class="materialtabs-footer">
        <template v-if="isactive >= 2 && tabNumeber === 0">
          <span>
            <Upload 
              action="api/iot-cds/sources/material"
              :show-upload-list="false"
              :with-credentials="true"
              :headers="headers"
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
import {sureDialog, getCookie,setCookie} from '../../services/Utils'
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
            baseAssembly: [
                {image:'text.svg', name :'文字'},
                {image:'rectangle.svg',name :'矩形'},
                {image:'ellipse.svg',name : '椭圆'},
                {image:'line.svg', name :'直线'},
                {image:'button.png', name :'按钮'},
                {image:'menulist.png',name :'菜单'},
                {image:'tableBox.svg', name :'表格'},
                {image:'image.svg', name :'图片'},
                {image:'linkTag.svg',name : 'Link'},
                {image:'light.svg', name :'指示灯'},
                {image:'progress.svg', name :'进度条'},
                {image:'pipeline1.svg', name :'管道1'},
                {image:'pipeline2.svg',name :'管道2'},
                {image:'pipeline3.svg',name :'管道3'}
            ],
            tablesAssembly: [
                {image:'lineChart.svg',name :'趋势图'},
                {image:'gaugeChart.svg',name :'仪表盘'}
            ],
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
            alertMaterial: [],
            nodata: '暂无数据',
            leftshowIf: true, // 搜索素材 展示左侧素材库列表
            ifselectFrom: false, // 是否来自搜索
            userMaterialAll: [],
            newArr: [],
            newArr2: [],
            headers:{
                'Authorization': `Bearer ${getCookie('token')}`
            }
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
                let data = res.records || []
                data.forEach((item) => {
                    let obj = {
                        name: item.libraryName,
                        materialLibraryId: item.materialLibraryId
                    }
                    this.assemblyArrayName.push(obj)
                })
            }).catch(() => {
                Message.error('系统繁忙，请稍后再试试')
                return false
            })
            let oInp = document.querySelector('.assembly-seach-icon')
            oInp.oninput = this.debounce(this.selectMaterial, 1000)
        },
        cancel() {
            this.$emit('triggerCancel')

        },
        selectAssemblyList(evt,index, materialLibraryId) {
            let target = null
            if (!evt) {
                target = 'auto'
            } else {
                target = evt.target.parentElement.className
            }
            if (!target.includes('left-side-listactive') || target === 'auto') {
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
                    }).catch(() => {
                        Message.error('系统繁忙，请稍后再试试')
                        return false
                    })
                }
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
            }).catch(() => {
                Message.error('系统繁忙，请稍后再试试')
                return false
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
                this.selectAssemblyList('',num + ROOT_LEN,res.materialLibraryId)
            })
        },
        debounce(handle, deLay) {
            var timer = null
            // 触发 拿到组件
            this.requestUtil.get(this.urls.materialRightList.url).then((res) => {
                let data = res || []
                data.forEach((item) => {
                    let obj = {
                        name: item.descript,
                        image: item.picUrl,
                        materialId: item.materialId
                    }
                    this.userMaterialAll.push(obj)
                })
            }).catch(() => {
                Message.error('系统繁忙，请稍后再试试')
                return false
            })
            return function() {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    handle.call(this, this.value)
                }, deLay);
            }
        },
        selectMaterial(value) {
            this.newArr = []
            this.newArr2 = []
            let basicArr = [...this.baseAssembly, ...this.tablesAssembly]
            let userArr = this.userMaterialAll || []
            if (value !== '') {
                this.leftshowIf = false
                this.ifselectFrom = true
                basicArr.forEach(item => {
                    if(item.name.includes(value.trim())) {
                        this.newArr.push(item)
                    }
                })
                userArr.forEach(item => {
                    if(item.name.includes(value.trim())) {
                        this.newArr2.push(item)
                    }
                })
            } else {
                this.newArr = []
                this.newArr2 = []
                this.leftshowIf = true
                this.ifselectFrom = false
            }
        },
        uploadSucc(res) {
            let addpicObj = {
                image:res.picUrl,
                name: res.descript,
                materialId: res.materialId
            }
            this.emptyArray.push(addpicObj)
            this.arrListTables = this.emptyArray
            Message.info('上传成功')
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
            setTimeout ( () => {
                Message.info('上传失败')
            }, 500);
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
                        break;
                }
            })
        },
        hideMaterialModelMenu() {
            $('.left-side-listactive .right-spots').css({'pointer-events': 'auto'})
            $('#materialModelMenu').hide()
        },
        /*
          @tabNumeber 0组件库; 1模版库
          @type left素材库列表 right右侧素材列表
        */
        renameHandle(ele, actionType, type,index, materialId) {
            let editInput = document.createElement('input');
            editInput.id = 'editPageInput'
            let oldVal = ele.innerText
            editInput.value = oldVal
            ele.innerText = ''
            ele.appendChild(editInput)
            editInput.onfocus = function() {
                this.select()
            }
            editInput.focus()
            let saveFn = () => {
                let name = editInput.value.trim()
                document.body.removeEventListener('click', saveFn)
                if (!name) {
                    ele.innerHTML = `<span class="left-assembly-left">${oldVal}</span><span class="right-spots"></span>`
                    Message.warning('页面名称不能为空')
                } else if (name.length > 20) {
                    ele.innerHTML = `<span class="left-assembly-left">${oldVal}</span><span class="right-spots"></span>`
                    Message.warning('页面名称不能超过20个字符');
                } else {
                    if (name !== oldVal) {
                        if (this.tabNumeber === 0) {
                            let data1 = {
                                materialLibraryId:this.uploadData.materialLibraryId ? this.uploadData.materialLibraryId : '' ,
                                libraryName: name,
                            }
                            let data2 = {
                                materialId:materialId || '',
                                descript: name,
                            }
                            if (type === 'left') {
                                this.requestUtil.put(this.urls.materialList.url,data1).then((res) => {
                                    if (res.libraryName) {
                                        Message.info('修改成功')
                                        ele.innerHTML = `<span class="left-assembly-left">${name}</span><span class="right-spots"></span>`
                                    }
                                }).catch(() => {
                                    ele.innerHTML = `<span class="left-assembly-left">${oldVal}</span><span class="right-spots"></span>`
                                    Message.error('修改失败')
                                    return false
                                })
                            } else if (type === 'right') {
                                this.requestUtil.put(this.urls.materialRightList.url,data2).then((res) => {
                                    if (res.descript) {
                                        Message.info('修改成功')
                                        ele.innerHTML = `<span class="left-assembly-left">${name}</span><span class="right-spots"></span>`
                                    }
                                }).catch(() => {
                                    ele.innerHTML = `<span class="left-assembly-left">${oldVal}</span><span class="right-spots"></span>`
                                    Message.error('修改失败')
                                    return false
                                })
                                
                            }
                        } else if (this.tabNumeber === 1) {
                            let data = {
                                pageTemplateId:materialId,
                                name: name
                            }
                            this.requestUtil.put(this.urls.addTemplate.url,data).then((res) => {
                                if (res.name) {
                                    Message.info('修改成功')
                                    ele.innerHTML = `<span class="left-assembly-left">${name}</span><span class="right-spots"></span>`
                                }
                            }).catch(() => {
                                ele.innerHTML = `<span class="left-assembly-left">${oldVal}</span><span class="right-spots"></span>`
                                Message.error('修改失败')
                                return false
                            })
                        }
                    }else {
                        ele.innerHTML = `<span class="left-assembly-left">${oldVal}</span><span class="right-spots"></span>`
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
                            sureDialog(this.myEditorUi, `确定要删除组件库-${ele.innerText}吗`, () => {
                                this.assemblyArrayName.splice(index ,1)
                                let lastLen = this.assemblyArrayName.length - 1
                                let materialLibraryid = this.assemblyArrayName[lastLen].materialLibraryId
                                this.selectAssemblyList('',lastLen,materialLibraryid)
                                Message.warning('删除成功')
                            })
                        }
                    }).catch(() => {
                        Message.warning('删除失败')
                    })
                } else if (type === this.POSITION_RIGHT) {
                    this.requestUtil.delete(this.urls.materialRightList.url + `/${materialId}`,).then((res) => {
                        if (this.arrListTables[index].materialId === materialId && res.code === '0') {
                            sureDialog(this.myEditorUi, `确定要删除组件-${ele.innerText}吗`, () => {
                                this.arrListTables.splice(index,1)
                                Message.warning('删除成功')
                            })
                        }
                    }).catch(() => {
                        Message.warning('删除失败')
                        return false
                    })
                }
            } else if (+this.tabNumeber === 1) {
                this.requestUtil.delete(this.urls.addTemplate.url + `/${materialId}`,).then((res) => {
                    let textDelete = +this.isactive2 === 1 ? '弹窗模版' : '页面模版'
                    if (res.code === '0') {
                        sureDialog(this.myEditorUi, `确定要删除${textDelete}-${ele.innerText}吗`, () => {
                            if (+this.isactive2 === 1) {
                                this.alertMaterial.splice(index, 1)
                            } else if(+this.isactive2 === 0) {
                                this.pageMaterial.splice(index, 1)
                            }
                            Message.warning('删除成功')
                        })
                    }
                }).catch(() => {
                    Message.warning('删除失败')
                })
            }
            
            this.hideMaterialModelMenu()
        },
    }
    
}
</script>
<style lang="less">
body{
    .materialroom-model{
        .ivu-modal-wrap{
          .ivu-modal{
              .ivu-modal-content{
                  width:700px;
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
                                              padding:5px;
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
                                                  .left-max-height{
                                                    height:240px;
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
                                                            .left-assembly-left{
                                                              width:100px;
                                                              overflow:hidden;
                                                              text-overflow:ellipsis;
                                                              white-space: nowrap;
                                                              flex:1;
                                                              display:block;
                                                            }
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
                                                                // float:right;
                                                                position: relative;
                                                            }
                                                        }
                                                    }
                                                  }
                                              }
                                              .material-list {
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
                                              height: 300px;
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
                                                          }
                                                      }
                                                  }
                                                  &>li.user-uploadimage{
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
                                                        position: relative;
                                                        &>span{
                                                            display: block;
                                                            width:72px;
                                                            height: 72px;
                                                            // border: 1px dashed #E1E1E1;
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
                                                          &.right-list-listactive{
                                                            &>#editPageInput{
                                                              border:none;
                                                              height:30px;
                                                              text-align: center;
                                                              width:100%;
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
                                                          &.right-list-listactive{
                                                            &>#editPageInput{
                                                              border:none;
                                                              height:30px;
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
    }
}
</style>



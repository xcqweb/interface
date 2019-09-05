<template>
  <div class="datamodel-right-wrap">
    <!--设备类型-->
    <dataRightColum
      :title="titleArr[0]"
      :widthlen="widthlenArr[0]"
      :showtitle="showtitleArr[0]"
    >
      <div class="dataSource-right-content">
        <ul
          v-if="deviceTypeArr.length"
          class="deviceType-ullist"
        >
          <li
            v-for="(item, index) in deviceTypeArr"
            :key="index"
            class="deviceType"
            :class="numberlistIndex === index ? 'currentList' : ''"
          >
            <span 
              class="deviceType-left"
              @click="clickDeviceTypeListHandle($event,item.deviceTypeId, index)"
            >
              {{ item.deviceTypeName }}
            </span>
          </li>
        </ul>
        <div 
          v-else
          class="no-data-wrap"
        >
          <NoData
            :text="nodata"
          />
        </div>
      </div>
    </dataRightColum>
    <!--模型列表-->
    <dataRightColum
      :title="titleArr[1]"
      :widthlen="widthlenArr[1]"
      :showtitle="showtitleArr[1]"
    >
      <div 
        class="dataSource-right-content"
      >
        <div class="dataSource-addModel add-condition">
          <span 
            @click.stop.prevent="addModelHandle"
          >
            {{ addModelText }}
          </span>
        </div>
        <div class="addMolel-List">
          <ul id="addModelLisetWaper">
            <li
              v-for="(item, index) in ModelNameArr"
              :key="item.sourceId"
              :class="modelNumber === index ? 'currentModelList' : ''"
              @click.stop.prevent="clickModelHandle($event,item.sourceId, item.modelName,item.formula,item.descript,index)"
              @mouseenter="MouseEnterHandle($event, index)"
              @mousemove="MouseMoveHandle($event, index)"
            >
              {{ item.modelName }}
            </li>
          </ul>
        </div>
      </div>
    </dataRightColum>
    <!--描述侧-->
    <dataRightColum
      v-show="ModelNameArr.length" 
      :title="titleArr[2]"
      :widthlen="widthlenArr[2]"
      :showtitle="showtitleArr[2]"
    >
      <div
        class="dataSource-right-content"
        style="padding-top:0px;display:flex;flex-direction: column"
      >
        <div class="dataSource-title">
          {{ descript }}
        </div>
        <div class="textare-wrap">
          <Input
            v-model="textareValue"
            :disabled="isediting" 
            type="textarea" 
            :placeholder="descriptText"
            :autosize="{maxRows: 3,minRows: 3}" 
          />
        </div>
        <div class="dataSource-title">
          {{ condition }}
        </div>
        <div class="dataSource-conditioncontent-wrap">
          <div class="dataSource-condition-content">
            <div class="add-condition">
              <span
                @click.stop.prevent="addConditionHandle"
              >
                {{ addConditionText }}
              </span>
            </div>
            <div class="add-condition-list wrapper">
              <div 
                v-if="alldata.data.length > 1"
                class="addConlistLeft left" 
              >
                <div
                  class="left-center"
                >
                  <div class="left-div1">
                    <span 
                      :style="{marginTop: `${(alldata.data[0].length * tdheight) / 2 + (heightLen / 2) - 15}px`}"
                      class="span-wrap"
                    >
                      <span class="span-wrap-span1 span-wrap-select">
                        <Select 
                          v-model="conditionLogicalSelect" 
                          style="width:64px;height:24px;line-height:24px;"
                          :disabled="isediting"
                          @on-change="conditionLogicalSelectHandle"
                        >
                          <Option 
                            v-for="item in conditionLogical" 
                            :key="item.value" 
                            :value="item.value"
                          >
                            {{ item.label }}
                          </Option>
                        </Select>
                      </span>
                    </span>
                  </div>
                  <div class="left-div2">
                    <span
                      :style="{marginTop: `${(alldata.data[0].length * tdheight) / 2 + (heightLen / 2)}px`}"
                    />
                  </div>
                  <div class="left-div3">
                    <span
                      :style="{height: alldata.data.length === 1 ? `1px` : `${heightLen}px`, marginTop: `${(alldata.data[0].length * tdheight) / 2}px`}"
                    />
                  </div>
                  <div class="left-div4">
                    <span
                      v-for="(item, key) in alldata.data"
                      :key="key"
                      :style="{height: alldata.data.length > 1 ? `${item.length * tdheight}px` : `${alldata.data[0].length * tdheight}`}"
                    >
                      <label />
                    </span>
                  </div>
                </div>
              </div>
              <div class="addConlistRight right-wrapper">
                <div
                  v-for="(data, key) in alldata.data"
                  :key="key"
                  class="right-wrap"
                >
                  <div
                    class="center"
                    :style="{'height': `${data.length * tdheight}px`}"
                  >
                    <div class="div1">
                      <span class="span-wrap span-wrap-common">
                        <span class="span-wrap-span1">
                          <span class="delete-number">{{ key + 1 }}</span>
                          <span 
                            v-if="alldata.data.length > 1"
                            class="delete-icon" 
                          />
                        </span>
                        <span 
                          v-if="data.length > 1"
                          class="span-wrap-span2"
                        >
                          And
                        </span>
                      </span>
                    </div>
                    <div class="div4">
                      <span />
                    </div>
                    <div class="div2">
                      <span
                        :style="{height: `${data.length * tdheight - tdheight}px`}"
                      />
                    </div>
                    <div
                      v-if="data.length"
                      class="div3"
                    >
                      <span
                        v-for="(item,index) in data"
                        :key="index"
                      >
                        <label />
                      </span>
                    </div>
                  </div>
                  <div class="right">
                    <Table 
                      ref="thirdTable"
                      border 
                      :columns="columns" 
                      :data="data" 
                      :show-header="false"
                    >
                      <template 
                        slot="one" 
                        slot-scope="{ row, index }"
                      >
                        <Select
                          v-model="row.paramName" 
                          style="width:120px;"
                          :disabled="isediting"
                          @on-change="treeSelectParamHandle(row.paramName,index, key)"
                        >
                          <Option 
                            v-for="item in conditionSignList" 
                            :key="item.paramId" 
                            :value="item.paramId"
                          >
                            {{ item.paramName }}
                          </Option>
                        </Select>
                      </template>
                      <template
                        slot="two" 
                        slot-scope="{ row, index}"
                      >
                        <Select
                          v-model="row.logical" 
                          style="width:80px;"
                          :disabled="isediting"
                          @on-change="treeSelectLogicalHandle(row.logical,index, key)"
                        >
                          <Option 
                            v-for="item in LogicalSignList" 
                            :key="item.value" 
                            :value="item.value"
                          >
                            {{ item.label }}
                          </Option>
                        </Select>
                      </template>
                      <template 
                        slot="three" 
                        slot-scope="{ row, index}"
                      >
                        <div 
                          v-if="row.logical === '1' || row.logical === '2' "
                          class="input-wrap-two"
                        >
                          <Input
                            v-model="row.minValue"
                            class="input-twp-left"
                            :disabled="isediting"
                            @on-blur="treeMinvalueHandle(row.minValue, index, key)"
                          />
                          <span style="width:10px;text-align:center;">-</span>
                          <Input
                            v-model="row.maxValue"
                            class="input-twp-right" 
                            :disabled="isediting"
                            @on-blur="treeMaxvalueHandle(row.maxValue, index, key)"
                          />
                        </div>
                        <div
                          v-else
                          class="input-wrap"
                        >
                          <Input
                            v-model="row.fixedValue"
                            placeholder="请输入"
                            :disabled="isediting"
                            @on-blur="treeFixedvalueHandle(row.fixedValue, index, key)"
                          />
                        </div>
                      </template>
                      <template 
                        slot="flour" 
                        slot-scope="{index}"
                      >
                        <Button
                          v-if="index === 0"
                          size="small"
                          class="condition-icon condition-add-icon"
                          :disabled="isediting"
                          @click.stop.prevent="adddata(key,index)"
                        >
                          添加
                        </Button>
                        <Button
                          v-if="data.length > 1"
                          size="small"
                          class="condition-icon condition-delete-icon"
                          :disabled="isediting"
                          @click.stop.prevent="removedata(key, index)"
                        >
                          删除
                        </Button>
                      </template>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dataSource-condition-bottom">
          <Button
            type="primary"
            size="small"
            @click.stop.prevent="saveModelHandle"
          >
            {{ saveModelText }}
          </Button>
        </div>
      </div>
    </dataRightColum>
    <SuspensionList
      v-if="ifShowSuspension"
      :datalist="SuspensionListName"
      :style="{left: LeftWidth, top: TopHeight}"
      @ChildMouseLeaveHandle="ChildMouseLeaveHandle"
      @renameHandle="renameModelHandle"
      @deleteHandle="deleteModelHandle"
      @clickHandleList="clickHandleList"
    />
  </div>
</template>

<script>
import dataRightColum from './data-rightcolum'
import SuspensionList from './suspensionList'
import VueEvent from '../../services/VueEvent.js'
import NoData from './nodata'
import {Input, Button, Table, Select,Option, Message} from 'iview'
const defaultValue = {
    paramName: '',
    logical: '',
    fixedValue: '',
    minValue: '',
    maxValue: '',
}
export default {
    components: {
        dataRightColum,
        SuspensionList,
        Input,
        Button,
        Table,
        Select,
        Option,
        NoData
    },
    props:{
        numberlistindex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            titleArr:['设备类型','模型列表',''],
            widthlenArr: [200,200,652],
            showtitleArr: [true, true, false],
            descript: '描述',
            descriptText: '描述内容',
            textareValue: '',
            condition: '条件',
            saveModelText:'编辑模型',
            addConditionText: '添加条件',
            addModelText: '添加模型',
            ModelNameArr:[],
            heightLen: null,
            nodata: '暂无数据',
            numberlistIndex: 0,
            modelNumber: 0,
            deviceTypeArr:[],
            currentDeviceTypeId:'',
            currenModelId:'',
            currenModelName:'',
            alldata: {
                conditionLogic: '',
                data: [
                    [
                        {
                            paramName: '',
                            logical: '',
                            minValue: '',
                            maxValue: '',
                            fixedValue: ''
                        },
                    ]
                ]
            },
            columns: [
                {
                    title: '第一列',
                    width: 125,
                    slot: 'one'
                },
                {
                    title: '逻辑',
                    width: 85,
                    slot: 'two'
                },
                {
                    title: '区间值',
                    width: 130,
                    slot: 'three'
                },
                {
                    title: '操作',
                    width:80,
                    slot: 'flour'
                }
            ],
            tdheight: 30,
            conditionLogicalSelect: '',
            conditionLogical:[
                {
                    value: '1',
                    label: 'And'
                },
                {
                    value: '2',
                    label: 'Or'
                }
            ],
            conditionSignList:[],
            LogicalSignList: [
                {
                    value: '1',
                    label: '介于'
                },
                {
                    value: '2',
                    label: '未介于'
                },
                {
                    value: '3',
                    label: '等于'
                },
                {
                    value: '4',
                    label: '不等于'
                },
                {
                    value: '5',
                    label: '大于'
                },
                {
                    value: '6',
                    label: '小于'
                },
                {
                    value: '7',
                    label: '大于等于'
                },
                {
                    value: '8',
                    label: '小于等于'
                }
            ],
            isediting: true,
            studioIdNew:'',
            SuspensionListName: [
                {
                    id: '1',
                    name: '重命名'
                },
                {
                    id: '2',
                    name: '删除'
                }
            ],
            ifShowSuspension: false,
            currentMouseIndex: 0,
            LeftWidth: 0,
            TopHeight:0
        }
    },
    watch: {
        'alldata.data': {
            deep: true,
            handler: function(newV) {
                if (Array.isArray(newV)) {
                    let maxlen = newV.length
                    this.heightLen = 0
                    newV.forEach((item, index) => {
                        if (maxlen <= 2) {
                            this.heightLen += (item.length * this.tdheight) / 2
                        } else {
                            if (index === 0 || index === maxlen - 1) {
                                this.heightLen += (item.length * this.tdheight) / 2
                            } else {
                                this.heightLen += (item.length * this.tdheight)
                            }
                        }
                    })
                }
            }
        },
        numberlistindex(value) {
            this.numberlistIndex = value
            let deviceId = this.deviceTypeArr[this.numberlistIndex].deviceTypeId
            this.currentDeviceTypeId = deviceId
            this.getModelInit(deviceId)
        }
    },
    created() {
        this.studioIdNew = sessionStorage.getItem("applyId") || ''
    },
    mounted() {
        this.numberlistIndex = this.numberlistindex
        this.heightLen = 0
        this.alldata.data.forEach((item) => {
            this.heightLen += (item.length * this.tdheight) / 2
        })
        let _that = this
        VueEvent.$on('StartDeviceTypeArr', function(value) {
            _that.deviceTypeArr = value
            if (_that.deviceTypeArr.length) {
                let deviceId = _that.deviceTypeArr[_that.numberlistIndex].deviceTypeId
                _that.currentDeviceTypeId = deviceId // 拿到最新的
                _that.getModelInit(deviceId)
            }
        })
        VueEvent.$on('StartparamsNameArr', function(value) {
            _that.conditionSignList = value
        })
    },
    methods: {
        // 模型列表
        getModelInit(deviceid) {
            let objData = {
                studioId: this.studioIdNew,
                deviceTypeId:deviceid
            }
            this.requestUtil.post(this.urls.getModelList.url, objData).then((res) => {
                this.ModelNameArr = res.returnObj || []
                if (this.ModelNameArr.length) {
                    this.clickModelHandle('', this.ModelNameArr[0].sourceId, this.ModelNameArr[0].modelName,this.ModelNameArr[0].formula,this.ModelNameArr[0].descript, 0)
                }
            }).catch(() => {
                Message.error('系统繁忙，请稍后再试')
                return false
            })
        },
        // 获取参数列表 modelId设备id
        getParamList(modelId) {
            let objData = {
                studioId:sessionStorage.getItem("applyId") || '',
                deviceTypeId: modelId,
                type:1
            }
            this.requestUtil.post(this.urls.deviceParamList.url, objData).then((res) => {
                this.conditionSignList = res.records
            })
        },
        saveModelHandle() {
            if (this.isediting) {
                this.saveModelText = `保存模型`
                this.isediting = false
            } else {
                this.saveModelText = `编辑模型`
                if (this.treeCheckRule(this.alldata.data)) {
                    // 组装数据  保存模型 
                    let objData = {}
                    objData.studioId = this.studioIdNew
                    objData.deviceTypeId = this.currentDeviceTypeId
                    objData.viewContent = ''
                    objData.descript = this.textareValue
                    objData.sourceId = this.currenModelId
                    objData.modelName = this.currenModelName
                    objData.formula = JSON.stringify(this.alldata)
                    this.requestUtil.put(this.urls.addModelList.url,objData).then((res) => {
                        if (res.sourceId) {
                            Message.success('保存模型成功')
                            this.isediting = true
                        }
                    }).catch(() => {
                        Message.error('系统繁忙，请稍后再试！')
                        return false
                    })
                    
                }
            }
        },
        addConditionHandle() {
            if (this.isediting) {
                Message.warning('非编辑状态，不能添加条件')
                return false
            }
            this.alldata.data.push([
                {
                    paramName: '',
                    logical: '',
                    minValue: '',
                    maxValue: '',
                    fixedValue: ''
                }
            ])
        },
        conditionLogicalSelectHandle(data) {
            this.alldata.conditionLogic = data
        },
        addModelHandle() {
            if (!this.isediting) {
                Message.warning('您还有未保存的模型')
                return false
            }
            if (!this.currentDeviceTypeId) {
                Message.warning('您未选中设备类型')
                return false
            }
            let num = this.ModelNameArr.length + 1
            let name = `新建模型${num}`
            let objData = {
                studioId: this.studioIdNew,
                deviceTypeId: this.currentDeviceTypeId,
                formula: '',
                viewContent: '',
                descript: '',
                modelName: name
            }
            this.requestUtil.post(this.urls.addModelList.url, objData).then((res) => {
                Message.success('添加模型成功')
                this.ModelNameArr.push(res)
                this.clickModelHandle('', res.sourceId, res.modelName,res.formula,res.descript,this.ModelNameArr.length - 1)
                return false
            }).catch(() => {
                Message.error('系统繁忙，请稍后再试')
                return false
            })
        },
        removedata(key, index) {
            if (this.alldata.data[key].length) {
                this.alldata.data[key].splice(index, 1)
            }  
        },
        adddata(key) {
            let newDefaultValue = JSON.parse(JSON.stringify(defaultValue))
            this.alldata.data[key].unshift(newDefaultValue)
        },
        clickDeviceTypeListHandle(evt, modelId, index) {
            this.numberlistIndex = index
            this.currentDeviceTypeId = modelId
            let liCLassName = evt.target.parentNode.className || 'can'
            if (!liCLassName.includes('currentList')) {
                VueEvent.$emit('clickChangeParamList', index, modelId)
            }
        },
        // 渲染最右侧表格
        clickModelHandle(evt, modelId, modelName,formula,descript,index) {
            let data = formula ? JSON.parse(formula) : {conditionLogic: '',data:[[{paramName: '',logical:'',minValue:'',maxValue:'',fixedValue:''}]]}
            this.alldata.data = data.data
            this.alldata.conditionLogic = data.conditionLogic || ''
            this.textareValue = descript || ''
            this.modelNumber = index
            this.currenModelId = modelId
            this.currenModelName = modelName
            this.conditionLogicalSelect = data.conditionLogic || ''
        },
        MouseEnterHandle(evt,index) {
            evt.stopPropagation()
            let widthLen = evt.target.offsetLeft + evt.target.offsetWidth - 20
            if (evt.clientX >= widthLen) {
                this.ifShowSuspension = true
                this.currentMouseIndex = index
                let classnameList = evt.target.className
                if (!classnameList.includes('currentModelList')) {
                    evt.target.className += classnameList ? ' currentModelList' : 'currentModelList'
                }
                let LIArr = evt.target.parentNode.children
                for(var i = 0; i < LIArr.length; i++) {
                    if (i !== this.modelNumber && i !== index) {
                        LIArr[i].className = ''
                    }
                }
                this.LeftWidth = evt.target.offsetLeft + evt.target.offsetWidth - 116 / 2 + 'px';
                this.TopHeight = evt.target.offsetTop + (evt.target.offsetHeight / 1.5) + 'px';
            } else {
                let LIArr = evt.target.parentNode.children
                for(var j = 0; j < LIArr.length; j++) {
                    if (j !== this.modelNumber && j !== index) {
                        LIArr[j].className = ''
                    }
                }
            }
        },
        MouseMoveHandle(evt, index) {
            let widthLen = evt.target.offsetLeft + evt.target.offsetWidth - 20
            let HeightLen = evt.target.offsetTop  + 2
            this.currentMouseIndex = index
            if (evt.clientX >= widthLen && evt.clientX <= widthLen + 18) {
                this.ifShowSuspension = true
                let classnameList = evt.target.className
                if (!classnameList.includes('currentModelList')) {
                    evt.target.className += classnameList ? ' currentModelList' : 'currentModelList'
                }
                let LIArr = evt.target.parentNode.children
                for(var i = 0; i < LIArr.length; i++) {
                    if (i !== this.modelNumber && i !== index) {
                        LIArr[i].className = ''
                    }
                }
                this.LeftWidth = evt.target.offsetLeft + evt.target.offsetWidth - 116 / 2 + 'px';
                this.TopHeight = evt.target.offsetTop + (evt.target.offsetHeight / 1.5) + 'px';
            }else {
                if (this.modelNumber !== this.currentMouseIndex) {
                    evt.target.className = ''
                }
                this.ifShowSuspension = false
            }
            if (evt.clientY < HeightLen) {
                if (this.modelNumber !== this.currentMouseIndex) {
                    evt.target.className = ''
                }
                this.ifShowSuspension = false
            }
        },
        ChildMouseLeaveHandle() {
            if (this.currentMouseIndex !== this.modelNumber) {
                let liArrEle = document.querySelectorAll('#addModelLisetWaper li')[this.currentMouseIndex]
                liArrEle.className = ''
            }
            this.ifShowSuspension = false
        },
        clickHandleList() {
            // this.ifShowSuspension = false
        },
        renameModelHandle() {
            let ele = document.querySelectorAll('#addModelLisetWaper li')[this.currentMouseIndex]
            let editInput = document.createElement('input');
            editInput.id = 'editPageInput'
            let oldVal = ele.innerText
            editInput.value = oldVal
            ele.innerText = ''
            ele.appendChild(editInput)
            editInput.focus()
            let newMousHandele = this.mounseHandle()
            newMousHandele(editInput, 'blur', () => {
                this.saveEditRename(editInput,ele,oldVal)
            })
        },
        // 删除模型
        deleteModelHandle() {
            this.requestUtil.delete(`${this.urls.addModelList.url}/${this.ModelNameArr[this.currentMouseIndex].sourceId}`).then(() => {
                if (this.modelNumber === this.currentMouseIndex) {
                    let index = this.currentMouseIndex
                    let _len = this.ModelNameArr.length - 1
                    if (this.ModelNameArr.length) {
                        if (this.currentMouseIndex === _len) {
                            this.clickModelHandle('', this.ModelNameArr[_len].sourceId, this.ModelNameArr[_len].modelName,this.ModelNameArr[_len].formula,this.ModelNameArr[_len].descript, _len)
                        } else {
                            this.clickModelHandle('', this.ModelNameArr[index].sourceId, this.ModelNameArr[index].modelName,this.ModelNameArr[index].formula,this.ModelNameArr[index].descript, _len)
                        }
                    }
                } else {
                    this.ModelNameArr.splice(this.currentMouseIndex, 1)
                }
            })
        },
        saveEditRename(editInput, ele, oldVal) {
            let name = editInput.value.trim()
            document.body.removeEventListener('click', () => {
                this.saveEditRename(editInput,ele,oldVal)
            })
            if (!name || name.length > 20 || name === oldVal) {
                ele.innerHTML = `${oldVal}`
                if (!name) {Message.error(`名称不能为空`)}
                if (name.length > 20) {Message.error(`名称不能超过20个字符`)}
            } else {
                // 请求接口
                let objData = {}
                objData.studioId = this.studioIdNew
                objData.deviceTypeId = this.currentDeviceTypeId
                objData.viewContent = ''
                objData.descript = this.textareValue
                objData.sourceId = this.currenModelId
                objData.modelName = name
                objData.formula = this.ModelNameArr[this.currentMouseIndex].formula
                this.requestUtil.put(this.urls.addModelList.url,objData).then((res) => {
                    if (res.sourceId) {
                        Message.success(`修改成功`)
                        ele.innerHTML = `${name}`
                        // 如果重命名的 和当前选中的 相同 则重置名字
                        if (this.modelNumber === this.currentMouseIndex) {
                            this.currenModelName = name
                        }
                    }
                }).catch(() => {
                    Message.success(`系统繁忙， 请稍后再试`)
                    ele.innerHTML = `${name}`
                })
            }
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
        // 双向触发数据更新
        treeSelectParamHandle(value, index, key) {
            this.alldata.data[key][index].paramName = value
            this.ModelNameArr[this.currentMouseIndex].formula = JSON.stringify(this.alldata)
        },
        treeSelectLogicalHandle(value, index, key) {
            this.alldata.data[key][index].logical = value
            this.ModelNameArr[this.currentMouseIndex].formula = JSON.stringify(this.alldata)
        },
        treeMinvalueHandle(value, index,key) {
            this.alldata.data[key][index].minValue = value
            this.alldata.data[key][index].fixedValue = ''
            this.ModelNameArr[this.currentMouseIndex].formula = JSON.stringify(this.alldata)
        },
        treeMaxvalueHandle(value, index,key) {
            this.alldata.data[key][index].maxValue = value
            this.alldata.data[key][index].fixedValue = ''
            this.ModelNameArr[this.currentMouseIndex].formula = JSON.stringify(this.alldata)
        },
        treeFixedvalueHandle(value, index,key) {
            this.alldata.data[key][index].fixedValue = value
            this.alldata.data[key][index].maxValue = ''
            this.alldata.data[key][index].minValue = ''
            this.ModelNameArr[this.currentMouseIndex].formula = JSON.stringify(this.alldata)
        },
        // 保存模型校验
        treeCheckRule(data) {
            let treeData = data || []
            let result = null
            let logicalTypeArr = ['1','2']
            let conditionSelect = this.conditionLogicalSelect || '' 
            if (data.length > 1) {
                if (!conditionSelect) {
                    Message.warning(`第一列不能为空`)
                    result = false
                    return
                }
            }
            for (let i = 0; i <= treeData.length - 1 ; i++) {
                for(let j = 0; j <= treeData[i].length - 1 ; j++) {
                    // treeData[i][j].conditionLogic = conditionSelect
                    if (!treeData[i][j].paramName) {
                        Message.warning(`条件${i + 1}第${j + 1}行参数不能为空`)
                        result = false
                        return 
                    }
                    if (!treeData[i][j].logical) {
                        Message.warning(`条件${i + 1}第${j + 1}行条件不能为空`)
                        result = false
                        return 
                    }
                    if (logicalTypeArr.includes(treeData[i][j].logical)) {
                        if (!treeData[i][j].minValue) { // 
                            Message.warning(`条件${i + 1}第${j + 1}行区间最小值不能为空`)
                            result = false
                            return 
                        }
                        if (!treeData[i][j].maxValue) {
                            Message.warning(`条件${i + 1}第${j + 1}行区间最大值不能为空`)
                            result = false
                            return 
                        }
                    } else {
                        if (!treeData[i][j].fixedValue) { // 
                            Message.warning(`条件${i + 1}第${j + 1}行值不能为空`)
                            result = false
                            return 
                        }
                    }
                }
            }
            result = true
            return result
        }
    }
}
</script>
<style lang="less" scoped>
.datamodel-right-wrap{
    height:100%;
    display:flex;
    .dataSource-right-content{
      .deviceType-ullist{
        li{
          height:24px;
          line-height: 24px;
          padding-left: 10px;
          padding-right:5px;
          display: flex;
          .deviceType-left{
            cursor: pointer;
            flex:1;
          }
          &.currentList{
            color:#ffffff;
            background-color: #3D91F7;
            .delete-icon{
              background:url('../../assets/images/datasource/delete2.png') no-repeat center center;
            }
          }
        }
      }
      .dataSource-title{
        height:36px;
        line-height: 4;
        padding-left:10px;
      }
      .textare-wrap{
        height:77px;
        padding:10px 10px 0;
      }
      .dataSource-conditioncontent-wrap{
        flex:1;
        padding:10px 10px 0;
        .dataSource-condition-content{
          height:100%;
          // height: calc(100vh - 246px);
          overflow-y: auto;
          border: 1px dashed #D4D4D4;
          border-radius: 2px;
          padding: 10px;
          display:flex;
          flex-direction: column;
        }
      }
      .dataSource-condition-bottom{
        height: 60px;
        padding:0 10px;
        text-align: right;
        padding-top:16px;
      }
      .add-condition{
        height:24px;
        width: 80px;
        span{
          display:block;
          padding-left: 16px;
          height:24px;
          line-height: 22px;
          box-sizing: border-box;
          background:url('../../assets/images/leftsidebar/addpage.png') no-repeat left center;
          background-size: 16px 16px; 
          border:1px solid #CCCCCC;
          border-radius: 2px;
          cursor: pointer;
        }
        &.dataSource-addModel{
          width: 90px;
          padding-left: 10px;
          span{
            border:none;
            line-height: 24px;
          }
        }
      }
      .add-condition-list{
        flex:1;
        padding-top:10px;
      }
      .addMolel-List{
        li{
          height:24px;
          line-height: 24px;
          padding-left: 10px;
          padding-right:5px;
          display: flex;
          /deep/#editPageInput{
            width:90% !important;
            border:none;
            height:25px;
            width:100%;
          }
          &.currentModelList{
            color:#ffffff;
            background-color: #3D91F7;
            background-size:16px 16px;
            background:#3D91F7 url('../../assets/images/leftsidebar/more1_ic.png') no-repeat right center;
          }
          &:hover{
            color:#ffffff;
            background-size:16px 16px;
            background:#3D91F7 url('../../assets/images/leftsidebar/more1_ic.png') no-repeat right center;
          }
        }
      }
      .no-data-wrap{
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
}
.wrapper{
    display:flex;
  }
  .left{
    width:85px;
    display: flex;
    /deep/ .ivu-select-placeholder{
      height:24px;
      line-height:24px;
    }
  }
  .right-wrapper{
    flex:1;
    // float:left;
  }
  .right-wrap{
    display: flex;
  }
  .center{
    width: 100px;
    display: flex
  }
  .div1{
    width:80px;
    display:flex;
    justify-content: flex-start;
    align-items: center;
  }
  .div2{
    height:100%;
    width:1px;
    display:flex;
    justify-content: center;
    align-items: center;
  }
  .div2 span{
    display: block;
    width:1.5px;
    background:#acacac;
  }
  .span-wrap{
    width:64px;
    height:26px;
    display: flex;
    .span-wrap-span1{
      flex:1;
      border:1px solid #d4d4d4;
      border-radius: 2px;
      background: #f5f5f5;
      height:24px;
      line-height: 24px;
      display: flex;
      text-align: center;
      &.span-wrap-select{
        border:none;
        background: none;
        justify-content: center;
        align-items: center;
        /deep/.ivu-select-selection{
          height:26px;
          /deep/.ivu-select-selected-value{
            height:24px;
            line-height:24px;
          }
        }
      }
      .delete-number{
        flex:1;
      }
      .delete-icon{
        width:16px;
        background: url('../../assets/images/datasource/delete.png') no-repeat center center;
        background-size:16px 16px;
        cursor: pointer;
      }
    }
    .span-wrap-span2{
      width:30px;
      text-align: center;
      line-height:24px;
    }
    &.span-wrap-common{
      width:80px;
    }
  }
  .div3{
    flex:1;
    display:flex;
    flex-direction: column;
    margin-left:-1px;
  }
  .div3>span{
    height:48px;
    flex:1;
    display: flex;
    justify-content:center;
    align-items: center;
  }
  .div3>span label{
    display: inline-block;
    /* margin-top:24px; */
    height:0px;
    border-top:1.5px solid #acacac;
    width:100%;
    /* margin-top:-4px; */
    /* background: #acacac; */
  }
  .div4{
    width: 10px;
    justify-content: center;
    align-items: center;
    display:flex;
  }
  .div4 span{
    display: block;
    width:100%;
    height:1.5px;
    /* margin-top:-4px; */
    background: #acacac;
  }
  .ivu-input[disabled]{
      color:#515a6e !important;
  }
  .right{
    flex:1;
    .ivu-table-wrapper{
      border:none;
      overflow: visible;
    }
    /deep/.ivu-select-selection{
      height:26px;
      /deep/.ivu-select-selected-value{
        height:24px;
        line-height:24px;
      }
      /deep/ .ivu-select-placeholder{
        height:24px;
        line-height:24px;
      }
    }
    /deep/.ivu-table{
      &::before{
        height:0px
      }
      &::after{
        width:0px
      }
      /deep/.ivu-table-row{
        height:30px;
        td{
          height:30px;
          border:none;
          .ivu-table-cell{
            height:26px;
            padding-left:0;
            padding-right:0;
          }
        }
      }
    }
    .input-wrap-two {
      width:calc(100% - 5px);
      height:24px;
      line-height: 24px;
      display: flex;
      .input-twp-left{
        flex:1;
        /deep/.ivu-input{
          height:26px;
          line-height: 26px;
          padding: 4px 2px;
        }
      }
      .input-twp-right{
        flex:1;
        /deep/.ivu-input{
          height:26px;
          line-height: 26px;
          padding: 4px 2px;
        }
      }
    }
    .input-wrap{
      width:calc(100% - 5px);
      height:24px;
      line-height: 24px;
      /deep/.ivu-input{
        height:25px;
        line-height: 25px;
      }
    }
    .condition-icon{
      width:36px;
      padding:0;
      font-size:12px;
      height:26px;
      line-height: 22px;
      // height:24px;
      // display:inline-block;
      // background-size:16px 16px;
      // cursor: pointer;
      // &.condition-add-icon{
      //   background:url('../../assets/images/leftsidebar/addpage.png') no-repeat center center;
      // }
      // &.condition-delete-icon{
      //   background:url('../../assets/images/datasource/delete.png') no-repeat center center;
      // }
    }
  }
  .left-center{
    flex:1;
    display: flex;
  }
  .left-div1{
    width:64px;
  }
  .left-div2{
    width:10px;
  }
  .left-div2 span{
    display: block;
    width:100%;
    height:1.5px;
    background: #acacac;
  }
  .left-div3{
    width: 1px;
    height:100%;
  }
  .left-div3>span{
    width:1px;
    height:100%;
    display: block;
    background: #acacac;
    /* margin-top:-13px; */
  }
  .left-div4{
    flex:1;
    display: flex;
    flex-direction: column;
  }
  .left-div4>span{
    /* flex:1; */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .left-div4>span>label{
    display: inline-block;
    height:1.5px;
    width:100%;
    /* margin-top:-4px; */
    background: #acacac;
  }
</style>
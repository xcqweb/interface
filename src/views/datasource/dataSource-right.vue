<template>
  <div class="dataSource-right-wrap">
    <!--设备类型-->
    <dataRightColum
      :title="titleArr[0]"
      :widthlen="widthlenArr[0]"
    >
      <div 
        class="dataSource-right-content"
        style="display:flex;flex-direction:column"
      > 
        <!-- <div 
          v-if="!deviceTypeArr.length" 
          style="height:32px" 
        /> -->
        <div style="flex:1">
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
                @click="clickDeviceTypeListHandle($event,index, item.deviceTypeId)"
              >
                {{ item.deviceTypeName }}
              </span>
              <span 
                class="delete-icon" 
                @click="deleteDeviceType(index, item.deviceTypeId, item.deviceTypeName, 3)" 
              />
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
        <!-- <div style="height:72px;" /> -->
      </div>
    </dataRightColum>
    <!--参数列表-->
    <dataRightColum
      :title="titleArr[1]"
      :widthlen="widthlenArr[1]"
    >
      <div class="dataSource-right-content">
        <div class="dataSource-right-top">
          <Input
            v-model="inputParamName"
            class="inputParamName"
            :placeholder="placeTextArr[0]"
            suffix="ios-search"
          />
        </div>
        <div class="dataSource-right-center">
          <div
            v-if="paramsNameList.length"
          >
            <CheckboxGroup
              v-model="paramsNameListArr"
              class="devicename-listUl"
              @on-change="checked => checkAllGroupChange(checked, 1)"
            >
              <Checkbox
                v-for="(item, index) in paramsNameList"
                :key="index"
                :label="item.paramId"
                size="small"
              >
                <span>{{ item.paramName }}</span>
                <span 
                  class="datasource-delete-icon"
                  @click.stop.prevent="deleteParamHandle(item.paramId, item.paramName,index,1)"
                />
              </Checkbox>
            </CheckboxGroup>
          </div>
          <div 
            v-else
            class="no-data-wrap"
          >
            <NoData
              :text="nodata"
            />
          </div>
        </div>
        <div class="dataSource-right-bottom">
          <template v-if="paramsNameList.length">
            <Page 
              :current="1" 
              :total="paramListTotal" 
              simple
            />
          </template>
        </div>
        <div class="dataSource-right-bom">
          <div class="dataSource-right-bomleft">
            <Checkbox
              :disabled="!paramsNameList.length"
              :indeterminate="indeterminateArr[1]"
              size="small"
              :value="checkAllArr[1]"
              @click.prevent.native="handleCheckAll(1)"
            >
              {{ selectAll }}
            </Checkbox>
          </div>
          <div class="dataSource-right-bomright">
            <Button
              size="small"
              :disabled="!paramsNameList.length"
              @click.prevent.native="deleteAll(1)"
            >
              {{ alldelete }}
            </Button>
          </div>
        </div>
      </div>
    </dataRightColum>
    <!--设备列表-->
    <dataRightColum
      :title="titleArr[2]"
      :widthlen="widthlenArr[2]"
    >
      <div class="dataSource-right-content">
        <div class="dataSource-right-top">
          <Input 
            v-model="inputDeviceName"
            class="inputDeviceName"
            :placeholder="placeTextArr[1]"
            suffix="ios-search"
          />
        </div>
        <div class="dataSource-right-center">
          <div
            v-if="deviceNameList.length"
          >
            <CheckboxGroup
              v-model="deviceNameListArr"
              class="devicename-listUl"
              @on-change="checked => checkAllGroupChange(checked, 2)"
            >
              <Checkbox
                v-for="(item, index) in deviceNameList"
                :key="index"
                :label="item.deviceId"
                size="small"
              >
                <span>{{ item.deviceName }}</span>
                <span 
                  class="datasource-delete-icon"
                  @click.stop.prevent="deleteDeviceHandle(item.deviceId, item.deviceName,index,2)"
                />
              </Checkbox>
            </CheckboxGroup>
          </div>
          <div
            v-else
            class="no-data-wrap"
          >
            <NoData
              :text="nodata"
            />
          </div>
        </div>
        <div class="dataSource-right-bottom">
          <template v-if="deviceNameList.length">
            <Page 
              :current="1" 
              :total="deviceListTotal" 
              simple
            />
          </template>
        </div>
        <div class="dataSource-right-bom">
          <div class="dataSource-right-bomleft">
            <Checkbox
              :disabled="!deviceNameList.length"
              :indeterminate="indeterminateArr[2]"
              size="small"
              :value="checkAllArr[2]"
              @click.prevent.native="handleCheckAll(2)"
            >
              {{ selectAll }}
            </Checkbox>
          </div>
          <div class="dataSource-right-bomright">
            <Button
              size="small"
              :disabled="!deviceNameList.length"
              @click.prevent.native="deleteAll(2)"
            >
              {{ alldelete }}
            </Button>
          </div>
        </div>
      </div>
    </dataRightColum>
    <Modal
      v-model="modalParam.ifShow"
      :title="modalParam.titleText"
      class="left-sidebar-model2"
      width="408px"
      :mask-closable="false"
    >
      <div class="content">
        {{ deleteName }}
      </div>
      <div slot="footer">
        <Button
          size="small"
          style="height:28px;width:84px"
          @click.stop.prevent="cancelHandle"
        >
          {{ buttonText[0] }}
        </Button> 
        <Button
          type="primary"
          size="small"
          style="height:28px;width:84px"
          @click.stop.prevent="saveHandle"
        >
          {{ buttonText[1] }}
        </Button> 
      </div>
    </Modal> 
  </div>
</template>

<script>
import dataRightColum from './data-rightcolum'
import VueEvent from '../../services/VueEvent.js'
import NoData from './nodata'
import {Input, Page,Checkbox,CheckboxGroup, Button,Message, Modal} from 'iview'
import {Promise} from 'q';
export default {
    components: {
        dataRightColum,
        Input,
        Page,
        NoData,
        Checkbox,
        CheckboxGroup,
        Button,
        Modal
    },
    data() {
        return {
            titleArr:['设备类型','参数列表','设备列表'],
            widthlenArr: [200,300,300],
            placeTextArr: ['输入参数名', '输入设备名称'],
            derectionArr: ['right','right'],
            buttonText: ['取消','确认'],
            dataNameArr: [
                {
                    value: '1',
                    label: 'IOT平台'
                }
            ],
            deviceNameArr:[ // 设备名
                {
                    value: '1',
                    label: '深圳'
                }
            ],
            deviceTypeArr: [],
            paramsNameList:[],
            deviceNameList:[],
            paramsNameListArr: [],
            deviceNameListArr: [],
            indeterminateArr: ['',false, false],
            checkAllArr: ['',false, false],
            nodata:'暂无数据',
            alldelete: '批量删除',
            selectAll: '全选',
            numberlistIndex: 0,
            paramListTotal: 10,
            deviceListTotal: 10,
            studioIdNew: null,
            modalParam: {
                titleText: '删除',
                ifShow: false,
                type: null,
                deleteAll: false
            },
            ParamObjData: {},
            DeviceObjData: {},
            paramIdArr: [],
            deviceIdArr: [],
            deleteName: '',
            inputDeviceName:'',
            inputParamName:'',
            currentDeviceTypeId: ''
        }
    },
    mounted() {
        this.studioIdNew = sessionStorage.getItem("applyId") || ''
        this.$nextTick(() => {
            let InputEle1 = document.querySelector('.inputParamName input');
            let InputEle2 = document.querySelector('.inputDeviceName input')
            InputEle1.oninput = this.debounce(this.InputSelectHandle, 1000 , 1)
            InputEle2.oninput = this.debounce(this.InputSelectHandle, 1000, 2)
        })
        let _that = this
        VueEvent.$on('clickChangeParamList', function(index, deviceTypeId) {
            _that.clickDeviceTypeListHandle('', index,deviceTypeId)
        })
    },
    methods: {
        initData() {
            let objData = {
                studioId:this.studioIdNew
            }
            // 默认取第一条数据的参数和名称
            this.requestUtil.get(this.urls.hasImportDeviceType.url,objData).then((res) => {
                this.deviceTypeArr = res || []
                // 设备类型
                VueEvent.$emit('StartDeviceTypeArr', this.deviceTypeArr)
                this.$emit('dataSourceShow',this.deviceTypeArr)
                this.$emit('nowClickNumber',this.numberlistIndex )
                if (this.deviceTypeArr.length) {
                    let objDataNew = {
                        studioId:this.studioIdNew,
                        deviceTypeId: this.deviceTypeArr[0].deviceTypeId
                    }
                    this.currentDeviceTypeId = objDataNew.deviceTypeId
                    return Promise.all([
                        this.requestUtil.post(this.urls.deviceParamList.url, objDataNew),
                        this.requestUtil.post(this.urls.deviceEquipList.url, objDataNew)
                    ]).catch(() => {
                        Message.error('系统繁忙，请稍后再试')
                        return false
                    })
                } else {
                    this.paramsNameList = []
                    this.deviceNameList = []
                    return [[], []]
                }
            }).then((res) => {
                const [firstParamNameList, firstDeviceNameList] = res
                this.paramsNameList = firstParamNameList.records || []
                VueEvent.$emit('StartparamsNameArr', this.paramsNameList)
                this.deviceNameList = firstDeviceNameList.records || []
                this.paramListTotal = firstParamNameList.total || 10
                this.deviceListTotal = firstDeviceNameList.total || 10
            }).catch(() => {
                Message.error('系统繁忙，请稍后再试试')
                return false
            })
        },
        async clickDeviceTypeListHandle(evt, index,deviceTypeId) {
            this.numberlistIndex = index
            this.$emit('nowClickNumber',this.numberlistIndex)
            this.currentDeviceTypeId = deviceTypeId // 用于搜素
            let classNameStr
            if (evt) {
                classNameStr = evt.target.parentNode.className
            }
            if (!evt || !classNameStr.includes('currentList')) {
                let objDataNew = {
                    studioId:this.studioIdNew,
                    deviceTypeId: deviceTypeId
                }
                const [ParamNameList, DeviceNameList] = await Promise.all([
                    this.requestUtil.post(this.urls.deviceParamList.url, objDataNew),
                    this.requestUtil.post(this.urls.deviceEquipList.url, objDataNew)
                ]).catch(() => {
                    Message.error('系统繁忙，请稍后再试')
                    return false
                })
                this.paramsNameList = ParamNameList.records || []
                this.deviceNameList = DeviceNameList.records || []
                this.paramListTotal = ParamNameList.total || 10
                this.deviceListTotal = DeviceNameList.total || 10
                VueEvent.$emit('StartparamsNameArr', this.paramsNameList)
            }
        },
        handleCheckAll(number) {
            if (this.indeterminateArr[number]) {
                this.checkAllArr[number] = false;
            } else {
                this.checkAllArr[number] = !this.checkAllArr[number];
            }
            this.indeterminateArr[number] = false;
            let dataArr = number === 1 ? this.paramsNameList : this.deviceNameList
            if (this.checkAllArr[number]) {
                dataArr.forEach((item) => {
                    if (number === 1) {
                        this.paramsNameListArr.push(item.paramId)
                    } else {
                        this.deviceNameListArr.push(item.deviceId)
                    }
                })
            } else {
                if (number === 1) {
                    this.paramsNameListArr = [];
                } else {
                    this.deviceNameListArr = [];
                }
            
            }
            this.paramIdArr = this.paramsNameListArr
            this.deviceIdArr = this.deviceNameListArr
        },
        debounce(handle, deLay, type) {
            var timer = null
            return function() {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    handle.call(this, this.value, type)
                }, deLay);
            }
        },
        // 选择够中的
        checkAllGroupChange(data, number) {
            let deviceNameListLen = (number === 1 ? this.paramsNameList.length : this.deviceNameList.length)
            if (data.length === deviceNameListLen) {
                this.indeterminateArr[number] = false;
                this.checkAllArr[number] = true;
            }  else {
                this.indeterminateArr[number] = false;
                this.checkAllArr[number] = false;
            }
            if (+number === 1) {
                this.paramIdArr = data
            } else if(+number === 2) {
                this.deviceIdArr = data
            }
            this.modalParam = {
                titleText: '删除',
                ifShow: false,
                index: null,
                type: +number,
                deleteAll: false
            }
          
        },
        // 删除设备类型
        deleteDeviceType(index, deviceTypeId, deviceTypeName , type) {
            this.modalParam = {
                titleText: '删除',
                ifShow: true,
                index: index,
                type: type,
                deleteAll:false
            }
            this.ParamObjData = {deviceTypeId}
            this.deleteName = `确定要删除设备类型-${deviceTypeName}`
        },
        // 删除参数
        deleteParamHandle(paramIds,paramName,index,type) {
            this.modalParam = {
                titleText: '删除',
                ifShow: true,
                index: index,
                type: type,
                deleteAll:false
            }
            let paramIdsArr = []
            paramIdsArr.push(paramIds)
            let objData = {
                studioId: this.studioIdNew,
                paramIds: paramIdsArr
            }
            this.deleteName = `确定要删除参数-${paramName}`
            this.ParamObjData = objData
        },
        // 删除设备
        deleteDeviceHandle(deviceIds,deviceName, index,type) {
            this.modalParam = {
                titleText: '删除',
                ifShow: true,
                index: index,
                type: type,
                deleteAll:false
            }
            let deviceIdsArr = []
            deviceIdsArr.push(deviceIds)
            let objData = {
                studioId: this.studioIdNew,
                deviceIds: deviceIdsArr
            }
            this.deleteName = `确定要删除设备-${deviceName}吗`
            this.DeviceObjData = objData
        },
        // 1 批量删除参数 2 批量删除设备
        deleteAll(type) {
            this.modalParam = {
                titleText: '删除',
                ifShow: true,
                index: null,
                type: type,
                deleteAll:true
            }
            this.deleteName = `确定要批量删除选择的${type === 1 ? '参数名称' : '设备名称'}`   
        },
        cancelHandle() {
            this.modalParam = {
                titleText: '删除',
                ifShow: false,
                index: null,
                type: null,
                deleteAll: false
            }
        },
        saveHandle() {
            let type = +this.modalParam.type
            let index = this.modalParam.index
            let ObjData = null // 传的参数
            // 批量删除 需要有勾选
            if (this.modalParam.deleteAll) { // 批量删除
                if (+type === 1) {
                    ObjData = {paramIds: this.paramIdArr, studioId: this.studioIdNew}
                    if (!this.paramIdArr.length) {
                        Message.warning('您还未勾选需要删除的参数列表')
                        return false
                    }
                } else if (+type === 2) {
                    ObjData = {deviceIds: this.deviceIdArr,studioId: this.studioIdNew}
                    if (!this.deviceIdArr.length) {
                        Message.warning('您还未勾选需要删除的设备列表')
                        return false
                    }
                }
            } else { // 单个删除
                if (type === 1) {
                    ObjData = this.ParamObjData
                } else if (type === 2) {
                    ObjData = this.DeviceObjData
                } else if (type === 3) {
                    ObjData = this.ParamObjData.deviceTypeId
                }
            }
            if (type === 1) {
                this.requestUtil.post(this.urls.deleteParamList.url, ObjData).then((res) => {
                    if (res.code === '0') {
                        Message.success('删除成功')
                        if (this.modalParam.deleteAll) {
                            let paramsNameListNew = JSON.parse(JSON.stringify(this.paramsNameList))
                            this.paramsNameList = this.handleData(this.paramIdArr ,paramsNameListNew)
                        } else {
                            this.paramsNameList.splice(index,1)
                        }
                        this.cancelHandle()
                    }
                }).catch(() => {
                    Message.sucess('系统繁忙，请稍后再试试')
                    return false
                })
            } else if (type === 2) {
                this.requestUtil.post(this.urls.deleteDeviceList.url,ObjData).then((res) => {
                    if (res.code === '0') {
                        Message.success('删除成功')
                        if (this.modalParam.deleteAll) {
                            let deviceNameListNew = JSON.parse(JSON.stringify(this.deviceNameList))
                            this.deviceNameList = this.handleData(this.deviceIdArr ,deviceNameListNew)
                        } else {
                            this.deviceNameList.splice(index,1)
                        }
                        this.cancelHandle()
                    }
                }).catch(() => {
                    Message.error('系统繁忙，请稍后再试试')
                    return false
                })
            } else if (type === 3) { // 删除设备类型
                this.requestUtil.delete(`${this.urls.deleteDeviceType.url}/${ObjData}`).then((res) => {
                    if (res.code === '0') {
                        Message.success('删除成功')
                        let deviceTypeArrNew = JSON.parse(JSON.stringify(this.deviceTypeArr))
                        this.deviceTypeArr.splice(index,1)
                        if (this.deviceTypeArr.length) {
                            // 选中下一个
                            if (index === deviceTypeArrNew.length - 1) {
                                this.clickDeviceTypeListHandle('', this.deviceTypeArr.length - 1, this.deviceTypeArr[this.deviceTypeArr.length - 1].deviceTypeId)
                            } else {
                                this.clickDeviceTypeListHandle('', index, this.deviceTypeArr[index].deviceTypeId)
                            }
                        } else {
                            this.paramsNameList = []
                            this.deviceNameList = []
                        }
                        this.cancelHandle()
                    }
                }).catch(() => {
                    Message.error('系统繁忙，请稍后再试试')
                    return false
                })
            }
        },
        handleData(arr1, arr2) {
            let data = (function(arr1,arr2) {
                let r = [];
                (function fn(arr1, arr2) {
                    let l = arr1.shift() // 获取第一个元素 改变原数组
                    let newarr2 = [];
                    arr2.forEach(function(f) {
                        newarr2.push(f.deviceId);
                    });
                    if (newarr2.includes(l)) {
                        let _index = newarr2.findIndex(item => item === l )
                        arr2.splice(_index,1)
                    }
                    if (arr1.length) {
                        fn(arr1, arr2)
                    } else {
                        r = arr2.slice()
                        return
                    }
                })(arr1, arr2)
                return r
            })(arr1, arr2)
            return data
        },
        InputSelectHandle(value, type) {
            let objData = {
                deviceTypeId : this.currentDeviceTypeId || '',
                studioId: this.studioIdNew
            }
            if (+type === 1) {
                objData.paramName = value.trim()
            }
            if (+type === 2) {
                objData.deviceName = value.trim()
            }
            let newUrl = +type === 1 ? this.urls.deviceParamList.url : this.urls.deviceEquipList.url
            this.requestUtil.post(newUrl,objData).then((res) => {
                if (+type === 1) {
                    this.paramsNameList = res.records || []
                } else {
                    this.deviceNameList = res.records || []
                }
            })
        },
    }
}
</script>
<style lang="less" scoped>
.dataSource-right-wrap{
    height:100%;
    display:flex;
    .dataSource-right-content{
      display: flex;
      flex-direction: column;
      .no-data-wrap{
          height:100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
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
          .delete-icon{
            width:20px;
            background:url('../../assets/images/datasource/delete.png') no-repeat center center;
            background-size:16px 16px;
            cursor: pointer;
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
      .dataSource-right-top {
        height:30px;
        padding: 0 10px 0;
      }
      .dataSource-right-center {
        flex:1;
        padding: 0 10px 0;
        .devicename-listUl{
          label{
            height:24px;
            line-height: 24px;
            display:block;
            width:100%;
            .datasource-delete-icon{
              display: block;
              width:24px;
              height:24px;
              background:url('../../assets/images/datasource/delete.png') no-repeat center center;
              background-size:16px 16px;
              float:right;
              cursor: pointer;
            }
          }
        }
      }
      .dataSource-right-bottom {
        height:40px;
        text-align: center;
        line-height: 40px;
        padding: 0 10px 0;
      }
      .dataSource-right-bom{
        height:37px;
        border-top:1px solid #D4D4D4;
        display:flex;
        .dataSource-right-bomleft{
          width:80px;
          padding-left: 10px;
          padding-top:8px;
        }
        .dataSource-right-bomright{
          flex:1;
          text-align: right;
          padding:5px 5px 0 0;
          .ivu-page-simple-pager{
            input {
              height:20px;
              padding: 5px 0px;
              margin:0;
            }
          }
        }
      }
      /deep/.ivu-input-suffix{
        .ivu-icon{
          line-height:24px;
        }
      }
      /deep/.ivu-input {
        height:24px;
      }
      /deep/.ivu-checkbox-inner{
        &:after{
          top:2px !important;
          left:5px !important;
        }
      }
    }
}
.left-sidebar-model2{
  /deep/.ivu-modal{
    /deep/.ivu-modal-content{
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
          padding: 10px 18px;
          border-top: none
        }
    }
  }
}
</style>
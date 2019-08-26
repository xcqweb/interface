<template>
  <div class="dataSource-right-wrap">
    <dataRightColum
      :title="titleArr[0]"
      :widthlen="widthlenArr[0]"
    >
      <div class="dataSource-right-content">
        1
      </div>
    </dataRightColum>
    <dataRightColum
      :title="titleArr[1]"
      :widthlen="widthlenArr[1]"
    >
      <div class="dataSource-right-content">
        <div class="dataSource-right-top">
          <Input 
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
                :label="item.id"
                size="small"
              >
                <span>{{ item.name }}</span>
                <span 
                  class="datasource-delete-icon"
                  @click.stop.prevent="deleteParamHandle"
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
          <template>
            <Page 
              :current="1" 
              :total="50" 
              simple
            />
          </template>
        </div>
      </div>
    </dataRightColum>
    <dataRightColum
      :title="titleArr[2]"
      :widthlen="widthlenArr[2]"
    >
      <div class="dataSource-right-content">
        <div class="dataSource-right-top">
          <Input 
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
                :label="item.id"
                size="small"
              >
                <span>{{ item.name }}</span>
                <span 
                  class="datasource-delete-icon"
                  @click.stop.prevent="deleteDeviceHandle"
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
              :total="50" 
              simple
            />
          </template>
        </div>
      </div>
    </dataRightColum>
  </div>
</template>

<script>
import dataRightColum from './data-rightcolum'
import NoData from './nodata'
import {Input, Page,Checkbox,CheckboxGroup} from 'iview'
export default {
    components: {
        dataRightColum,
        Input,
        Page,
        NoData,
        Checkbox,
        CheckboxGroup
    },
    data() {
        return {
            titleArr:['设备类型','参数列表','设备列表'],
            widthlenArr: [200,300,300],
            placeTextArr: ['输入参数名', '输入设备名称'],
            derectionArr: ['right','right'],
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
            paramsNameList:[ // 参数
                {
                    name: 'fkafkfks342-y',
                    id:'321312'
                },
                {
                    name: 'etwiyweuwe-y',
                    id:'855345'
                }
            ],
            deviceNameList:[],
            paramsNameListArr: [],
            deviceNameListArr: [],
            indeterminateArr: ['',false, false],
            checkAllArr: ['',false, false],
            nodata:'暂无数据',
        }
    },
    methods: {
        
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
                        this.paramsNameListArr.push(item.id)
                    } else {
                        this.deviceNameListArr.push(item.id)
                    }
                })
            } else {
                if (number === 1) {
                    this.paramsNameListArr = [];
                } else {
                    this.deviceNameListArr = [];
                }
            
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
          
        },
        // 删除参数
        deleteParamHandle() {
            console.log('删除参数')
        },
        // 删除设备
        deleteDeviceHandle() {
            console.log('删除设备')
        }
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
      .dataSource-right-top {
        height:30px;
      }
      .dataSource-right-center {
        flex:1;
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
              background:url('../../../assets/images/datasource/delete.png') no-repeat center center;
              background-size:16px 16px;
              float:right;
              cursor: pointer;
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
      .dataSource-right-bottom {
        height:40px;
        text-align: center;
        line-height: 40px;
      }
      /deep/.ivu-input-suffix{
        .ivu-icon{
          line-height:24px;
        }
      }
      /deep/.ivu-input {
        height:24px;
      }
    }
}
</style>
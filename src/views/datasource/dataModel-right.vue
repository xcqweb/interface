<template>
  <div class="datamodel-right-wrap">
    <dataRightColum
      :title="titleArr[0]"
      :widthlen="widthlenArr[0]"
      :showtitle="showtitleArr[0]"
    >
      <div class="dataSource-right-content">
        4
      </div>
    </dataRightColum>
    <dataRightColum
      :title="titleArr[1]"
      :widthlen="widthlenArr[1]"
      :showtitle="showtitleArr[1]"
    >
      <div class="dataSource-right-content">
        <div class="dataSource-addModel add-condition">
          <span 
            @click.stop.prevent="addModelHandle"
          >
            {{ addModelText }}
          </span>
        </div>
      </div>
    </dataRightColum>
    <dataRightColum
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
                          v-model="conditionSign" 
                          style="width:64px;height:24px;line-height:24px;"
                          :disabled="isediting"
                        >
                          <Option 
                            v-for="item in conditionSignList" 
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
                          <span class="delete-icon" />
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
                        slot-scope="{ row }"
                      >
                        <Select
                          v-model="row.paramName" 
                          style="width:120px;"
                          :disabled="isediting"
                        >
                          <Option 
                            v-for="item in conditionSignList" 
                            :key="item.value" 
                            :value="item.value"
                          >
                            {{ item.label }}
                          </Option>
                        </Select>
                      </template>
                      <template 
                        slot="two" 
                        slot-scope="{ row }"
                      >
                        <Select
                          v-model="row.logical" 
                          style="width:80px;"
                          :disabled="isediting"
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
                        slot-scope="{ row }"
                      >
                        <div 
                          v-if="row.logical === '1' || row.logical === '2' "
                          class="input-wrap-two"
                        >
                          <Input
                            v-model="row.minValue"
                            class="input-twp-left"
                            :disabled="isediting"
                          />
                          <span style="width:10px;text-align:center;">-</span>
                          <Input
                            v-model="row.maxValue"
                            class="input-twp-right" 
                            :disabled="isediting"
                          />
                        </div>
                        <div
                          v-else
                          class="input-wrap"
                        >
                          <Input
                            v-model="row.fixedValue"
                            placeholder="请输入..."
                            :disabled="isediting"
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
                          @click.stop.prevent="adddata(key)"
                        >
                          添加
                        </Button>
                        <Button
                          size="small"
                          class="condition-icon condition-delete-icon"
                          :disabled="isediting"
                          @click.stop.prevent="removedata(key)"
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
  </div>
</template>

<script>
import dataRightColum from './data-rightcolum'
import {Input, Button, Table, Select,Option} from 'iview'
const defaultValue = {
    paramName: '',
    logical: '',
    fixedValue: ''
}
export default {
    components: {
        dataRightColum,
        Input,
        Button,
        Table,
        Select,
        Option
    },
    data() {
        return {
            titleArr:['设备类型','参数列表',''],
            widthlenArr: [200,200,652],
            showtitleArr: [true, true, false],
            descript: '描述',
            descriptText: '描述内容',
            textareValue: '',
            condition: '条件',
            saveModelText:'保存模型',
            addConditionText: '添加条件',
            addModelText: '添加模型',
            heightLen: null,
            alldata: {
                data: [
                    [
                        {
                            paramName: '1',
                            logical: '1'
                        },
                        {
                            paramName: '2',
                            logical: '3'
                        }
                    ],
                    [
                        {
                            paramName: '3',
                            logical: '4'
                        },
                        {
                            paramName: '4',
                            logical: '4'
                        },
                        {
                            paramName: '5',
                            logical: '5'
                        }
                    ]
                ]
            },
            columns: [
                {
                    title: '参数1',
                    width: 125,
                    slot: 'one'
                },
                {
                    title: '参数2',
                    width: 85,
                    slot: 'two'
                },
                {
                    title: '参数3',
                    slot: 'three'
                },
                {
                    title: '参数4',
                    width:80,
                    slot: 'flour'
                }
            ],
            tdheight: 30,
            conditionSign: '1',
            conditionSignList:[
                {
                    value: '1',
                    label: 'And'
                },
                {
                    value: '2',
                    label: 'Or'
                },
                {
                    value: '3',
                    label: 'Or'
                },
                {
                    value: '4',
                    label: 'Or'
                },
                {
                    value: '5',
                    label: 'Or'
                }
            ],
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
            isediting: true
        }
    },
    watch: {
        'alldata.data': {
            deep: true,
            handler: function(newV) {
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
                console.log(this.heightLen)
            }
        }
    },
    mounted() {
        this.heightLen = 0
        this.alldata.data.forEach((item) => {
            this.heightLen += (item.length * this.tdheight) / 2
        })
    },
    methods: {
        saveModelHandle() {
            console.log('保存为模型')
        },
        addConditionHandle() {
            console.log('添加条件')
            this.alldata.data.push([
                {
                    paramName: '3',
                    logical: '3'
                }
            ])
        },
        addModelHandle() {
            console.log('添加模型')
        },
        removedata(key) {
            this.alldata.data[key].shift()
            if (!this.alldata.data[key].length) {
                this.alldata.data.splice(key, 1)
            }
        },
        adddata(key) {
            this.alldata.data[key].push(defaultValue)
        }
    }
}
</script>
<style lang="less" scoped>
.datamodel-right-wrap{
    height:100%;
    display:flex;
    .dataSource-right-content{
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
    }
}
.wrapper{
    display:flex;
  }
  .left{
    width:85px;
    display: flex;
    /* background:red; */
  }
  .right-wrapper{
    flex:1;
    /* background:#acacac */
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
<template>
  <div class="data-sources">
    <div class="data-sources-top">
      <div
        class="data-sources-listname"
        style="height:auto;padding-top:5px;"
      >
        <span>
          {{ dataName }}
        </span>
      </div>
      <DataSource
        :datalist="dataNameArr"
        :modelvalue="modelvalue1"
      />
      <div class="data-sources-listname">
        <span>
          {{ deviceType }}
        </span>
      </div>
      <DataSource
        :datalist="deviceNameArr"
        :modelvalue="modelvalue2"
      />
      <div class="data-sources-listname">
        <span>
          {{ deviceName }}
        </span>
      </div>
    </div>
    <div class="data-sources-center">
      <div class="devicename-input-wrap">
        <Input 
          :placetext="placeText"
          :derection="derection"
        />
      </div>
      <div
        class="devicename-list-wrap"
      >
        <ul
          v-if="deviceNameList.length"
          class="devicename-listUl"
        >
          <li 
            v-for="(item, index) in deviceNameList"
            :key="index"
          >
            <Checkbox
              size="small"
            >
              {{ item.name }}
            </Checkbox>
          </li>
        </ul>
        <div v-else>
          {{ nodata }}
        </div>
      </div> 
      <div class="devicename-page-wrap">
        <template>
          <Page 
            :current="1" 
            :total="50" 
            simple
          />
        </template>
      </div>
    </div>
    <div class="data-sources-bottom">
      <Button 
        type="primary"
        long
      >
        {{ buttonName }}
      </Button>
    </div>
  </div>
</template>

<script>
import DataSource from '../../datasource/dataSource-select'
import Input from '../../datasource/input-select'
import {Button, Page, Checkbox} from 'iview'
export default{
    components: {
        DataSource,
        Button,
        Input,
        Page,
        Checkbox
    },
    data() {
        return {
            dataName: '数据源',
            deviceType: '设备类型',
            deviceName: '设备名称',
            placeText: '搜素设备名称',
            derection: 'right',
            nodata: '暂无数据',
            dataNameArr: [
                {
                    value: '1',
                    label: 'IOT平台'
                }
            ],
            deviceNameArr:[
                {
                    value: '1',
                    label: '深圳'
                }
            ],
            deviceNameList:[
                {
                    name: 'fkafkfks342-y',
                    id:'321312'
                },
                {
                    name: 'etwiyweuwe-y',
                    id:'855345'
                }
            ],
            single: false,
            buttonName: '绑定',
            modelvalue1:'1',
            modelvalue2:'1'
        }
    },
    mounted() {
    },
    methods: {
        
    },      
}
</script>

<style scoped lang="less">
  .data-sources{
    padding:5px;
    display: flex;
    flex-direction: column;
    height:100%;
    .data-sources-top{
      height: 156px;
      .data-sources-listname{
        height:36px;
        color:11px;
        display: flex;
        align-items: flex-end;
      }
    }
    .data-sources-center{
      flex:1;
      background: #ffffff;
      border:1px solid #d4d4d4;
      border-radius: 2px;
      padding:5px;
      display: flex;
      flex-direction: column;
      .devicename-input-wrap{
        height:24px;
      }
      .devicename-list-wrap{
        background: #fff;
        flex:1;
        .devicename-listUl{
          padding: 5px 0;
          li{
            height:26px;
            display: flex;
            align-items: center;
            /deep/.ivu-checkbox-checked {
                .ivu-checkbox-inner::after{
                  top:2px !important;
                  left:4px !important;
                }
            }
          }
        }
      }
      .devicename-page-wrap{
        height:24px;
        text-align: center;
      }
    }
    .data-sources-bottom{
      height:100px;
      padding-top:12px;
      button{
        height:24px;
        line-height: 22px;
        padding:0;
        span{
          display: inline-block;
          height:24px;
          line-height: 22px;
        }
      }
    }
  }
</style>

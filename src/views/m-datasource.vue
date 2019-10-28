<template>
  <div
    class="data-top"
  >
    <div class="tool-bar">
      <span class="tool-bar-left" />
      <!--导入数据源-->
      <span class="datasour-icon-wrap">
        <span 
          v-show="dataType === 1" 
          class="datasour-icon-content"
          @click.stop.prevent="importDataHander"
        >
          <span class="import-datasour-icon" />
          <span class="import-data-text">{{ $t(importdataSource) }}</span>
        </span>
      </span>
    </div>
    <div class="data-main">
      <div class="data-main-left">
        <Tabs
          type="card" 
          :animated="false"
          @on-click="tabsSwitchData"
        >
          <TabPane
            :label="$t(dataSource)"
            :disabled="!modelEditing"
          >
            <ul
              v-if="dataSourceList.length && deviceTypeArr.length"
              class="dataSources-ullist"
            >
              <li
                v-for="(item, index) in dataSourceList"
                :key="index"
                class="dataSource currentList"
              >
                <span class="dataSources-left">{{ $t(item.name) }}</span>
                <!-- <span 
                    class="delete-icon"
                    @click.stop.prevent="deleteDataSource" 
                  /> -->
              </li>
            </ul>
            <div 
              v-else
              class="no-data-wrap"
            >
              <NoData
                :text="$t(nodata)"
              />
            </div>
          </TabPane>
          <TabPane
            :label="$t(datamodel)"
          >
            <ul
              v-if="dataSourceList.length && deviceTypeArr.length"
              class="dataSources-ullist"
            >
              <li
                v-for="(item, index) in dataSourceList"
                :key="index"
                class="dataSource currentList"
              >
                <span class="dataSources-left">{{ $t(item.name) }}</span>
              </li>
            </ul>
            <div 
              v-else
              class="no-data-wrap"
            >
              <NoData
                :text="$t(nodata)"
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div class="data-main-right">
        <div
          v-show="+dataType === 1"
          class="dataSource-right"
        >
          <DataSourceRight
            ref="datasourceright"
            @dataSourceShow="dataSourceShow"
            @nowClickNumber="nowClickNumber"
          />
        </div>
        <div
          v-show="+dataType === 2"
          class="datamodel-right"
        >
          <DataModelRight
            ref="dataModelRightEle"
            :numberlistindex="numberlistIndex"
          />
        </div>
      </div>
    </div>
    <DataDataModal
      v-if="ifShowImportData"
      ref="importdataModel"
      @saveHandleToUpdata="getDeviceType(2)"
      @triggerCancel="triggerCancel"
    />
  </div>
</template>

<script>
import {Tabs, TabPane} from 'iview'
import DataSourceRight from './datasource/dataSource-right'
import DataModelRight from './datasource/dataModel-right'
import DataDataModal from './datasource/importdata-model'
import NoData from './datasource/nodata'
export default{
    components:{
        Tabs,
        TabPane,
        DataModelRight,
        DataSourceRight,
        DataDataModal,
        NoData
    },
    data() {
        return {
            tab:1,
            dataSource: 'dataSources',
            datamodel: 'dataModel',
            importdataSource: 'importDataSource',
            numberlistIndex: 0,
            deviceTypeArr: [],
            nodata: 'noData',
            dataType: 1, // dataType 数据源 2: 数据模型
            ifShowImportData: false,
            dataSourceList: [
                {
                    name: 'iotPlatform',
                    id: '1233'
                }
            ],
        }
    },
    computed:{
        modelEditing() {
            return this.$store.state.main.modelEditing
        }
    },
    mounted() {
    },
    methods: {
        getDataSource() { // 获取数据源

        },
        tabsSwitchData(index) {
            this.dataType = +index + 1
        },
        importDataHander() {
            this.ifShowImportData = true
        },
        triggerCancel() {
            this.ifShowImportData = false
        },
        getDeviceType(type) { // 两个地方去更新
            // type 1 : 初始进来 2 点击导入数据源进入
            this.$refs.datasourceright.initData(type)
            
        },
        deleteDataSource() {

        },
        nowClickNumber(value) {
            this.numberlistIndex = value
        },
        dataSourceShow(value) {
            this.deviceTypeArr = value
        }
    },      
}
</script>

<style scoped lang="less">
.data-top{
    // position: relative;
    // width:calc(100% - 208px);
    height:100%;
    display:flex;
    flex-direction: column;
}
.tool-bar{
    // position: relative;
    // left:208px;
    // padding-right:60px;
    height:72px;
    display:flex;
    background: linear-gradient(0deg,rgba(216,216,216,1) 0%,rgba(228,227,228,1) 100%);
    border-left: 1px solid rgb(204, 204, 204);
    .tool-bar-left{
      width:208px;
    }
    .datasour-icon-wrap{
      flex:1;
      display:flex;
      justify-content: flex-end;
      align-items: center;
      border-left:1px solid #cccccc;
      .datasour-icon-content{
        padding-right:60px;
        cursor: pointer;
        .import-datasour-icon{
          display: block;
          width:48px;
          height:24px;
          margin:0 auto;
          border:1px solid #CCCCCC;
          background:#fff url('../assets/images/datasource/importdataso.png') no-repeat center center;
          background-size: 16px 16px;
        }
        .import-data-text{
          font-size:11px;
          font-family:Microsoft YaHei;
          color:rgba(37,37,37,1)
        }
      }
      
    }
    
}
.data-main{
    height:100%;
    flex:1;
    display: flex;
    .data-main-left{
      width:208px;
      background:#F2F2F2;
      .ivu-tabs{
        height:100%;
        /deep/.ivu-tabs-content{
          height:calc(100% - 48px);
          .ivu-tabs-tabpane{
            height:100%;
          }
        }
      }
      .no-data-wrap{
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      /deep/.ivu-tabs-nav{
        width:100% !important;
        .ivu-tabs-tab{
            width:50%;
            padding:0 !important;
            border-radius: 0 !important;
            margin-right:0 !important;
            height: 32px;
            line-height: 32px;
            background: #fff;
            border:none;
            border-top:none;
            text-align: center;
            &.ivu-tabs-tab-active{
                background: #F2F2F2;
                color:#252525;
                border:none;
            }
        }
        .ivu-tabs-ink-bar{
          background:none; 
        }
        .ivu-tabs-tab:active {
            color:#252525 !important;
        }
      }
      .dataSources-ullist{
        li{
          height:24px;
          line-height: 24px;
          padding-left: 10px;
          padding-right:5px;
          display: flex;
          background-color: #3D91F7;
          .dataSources-left{
            flex:1;
          }
          .delete-icon{
            width:20px;
            background:url('../assets/images/datasource/delete.png') no-repeat center center;
            background-size:16px 16px;
            cursor: pointer;
          }
          &.currentList{
            color:#ffffff;
            .delete-icon{
              background:url('../assets/images/datasource/delete2.png') no-repeat center center;
            }
          }
        }
      }
    }
    .data-main-right{
      flex:1;
      background: #f5f5f5;
      border-left: 1px solid #CCCCCC;
      padding:10px;
      .dataSource-right{
        height:100%;
      }
      .datamodel-right{
        height:100%;
      }
    }
}
</style>

<style lang="less">
   
</style>

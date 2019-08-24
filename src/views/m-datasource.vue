<template>
  <div class="data-top">
    <div class="tool-bar">
      <span class="tool-bar-left" />
      <span class="datasour-icon-wrap">
        <span 
          v-show="dataType === 1" 
          class="datasour-icon-content"
          @click.stop.prevent="importDataHander"
        >
          <span class="import-datasour-icon" />
          <span class="import-data-text">{{ importdataSource }}</span>
        </span>
      </span>
    </div>
    <div class="data-main">
      <div class="data-main-left">
        <Tabs
          @on-click="tabsSwitchData"
        >
          <TabPane
            :label="dataSource"
          />
          <TabPane
            :label="datamodel"
          />
        </Tabs>
      </div>
      <div class="data-main-right">
        <div
          v-if="+dataType === 1"
          class="dataSource-right"
        >
          <DataSourceRight />
        </div>
        <div
          v-else
          class="datamodel-right"
        >
          <DataModelRight />
        </div>
      </div>
    </div>
    <DataDataModal
      v-if="ifShowImportData"
      ref="importdataModel"
      @triggerCancel="triggerCancel" 
    />
  </div>
</template>

<script>
import {Tabs, TabPane} from 'iview'
import DataSourceRight from './rightbar/widget-style/dataSource-right'
import DataModelRight from './rightbar/widget-style/dataModel-right'
import DataDataModal from './rightbar/widget-style/importdata-model'
export default{
    components:{
        Tabs,
        TabPane,
        DataModelRight,
        DataSourceRight,
        DataDataModal
    },
    data() {
        return {
            tab:1,
            dataSource:'数据源',
            datamodel: '数据模型',
            importdataSource:'导入数据源',
            dataType: 1, // dataType 数据源 2: 数据模型
            ifShowImportData: false
        }
    },
    mounted() {
    },
    methods: {
        tabsSwitchData(index) {
            this.dataType = +index + 1
        },
        importDataHander() {
            this.ifShowImportData = true
        },
        triggerCancel() {
            this.ifShowImportData = false
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
      width:208px
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

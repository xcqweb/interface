<template>
  <div class="data-sources">
    <!-- 数据源 tab -->
    <div 
      class="data-source-tab"
      style="padding:10px 4px 4px;"
    >
      <span>
        {{ $t('dataSources') }}
      </span>
      <ul class="source-tab-common">
        <li 
          class="source-tab" 
          :class="{'selected':typeTab===1}"
          style="border-top-left-radius:2px;border-bottom-left-radius:2px;"
          @click="changeTab(1)"
        >
          {{ $t('device') }}
        </li>
        <li 
          class="source-tab"
          :class="{'selected':typeTab===2}"
          @click="changeTab(2)"
        >
          {{ $t('predictionApply') }}
        </li>
        <li 
          class="source-tab"
          :class="{'selected':typeTab===3}"
          @click="changeTab(3)"
        >
          {{ $t('statisticApply') }}
        </li>
      </ul>
    </div>
    <!-- content -->
    <DsDevice
      v-if="typeTab===1"
    />
    <DsPrediction
      v-if="typeTab===2"
    />
    <DsStatis
      v-if="typeTab===3"
    />
  </div>
</template>

<script>
import DatasourceStore from '../../data-source/js/datasource-store'
import DsDevice from './components/deviceDs'
import DsPrediction from './components/preditionDs'
import DsStatis from './components/statisDs'

// const singleDeviceName = ['image','userimage','tableCell','rectangle','ellipse','light','progress','gaugeChart','triangle','pentagram']
//lineChart 多设备 多参数 gaugeChart 单设备 多参数
export default{
  components: {
    DsDevice,
    DsPrediction,
    DsStatis,
  },
  mixins: [DatasourceStore],
  data() {
    return {
      typeTab: 1,
    }
  },
  methods: {
    changeTab(index) {
      this.typeTab = index
    },
  },      
}
</script>

<style scoped lang="less">
  .data-sources{
    padding:0 4px 4px;
    display: flex;
    flex-direction: column;
    height:100%;
    .data-sources-listname{
      margin-top:10px;
      display: flex;
      align-items: flex-end;
    }
    .data-sources-center{
      height:calc(100% - 208px);
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
        height:100%;
        max-height:calc(100% - 24px);
        overflow-y: auto;
        overflow-x:hidden;
        .devicename-listUl{
          label{
            width:100%;
            /deep/.ivu-checkbox{
              vertical-align: top;
              .ivu-checkbox-inner{
                top:3px;
              }
            }
          }
          padding: 5px 0;
          li{
            height:26px;
            display: flex;
            align-items: center;
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
        line-height: 20px;
        padding:0;
        span{
          display: inline-block;
          height:24px;
        }
      }
    }
    /deep/.ivu-select{
        .ivu-select-selection{
          height:24px;
        }
        .ivu-select-placeholder{
          height:24px;
          line-height:24px;
        }
        .ivu-select-selected-value{
            height:24px;
            line-height:24px;
        }
        .ivu-select-dropdown{
          .ivu-select-dropdown-list{
            .ivu-select-item{
              padding: 0 16px 0;
            }
          }
        }
    }
    .no-data-wrap{
          height:100%;
          display: flex;
          justify-content: center;
          align-items: center;
    }
    /deep/.ivu-checkbox-inner{
      &:after{
        top:1px !important;
        left:4px !important;
      }
    }
    /deep/.data-source-tab {
      position: relative;
      .source-tab-common{
        display: flex;
        height:26px;
        line-height:24px;
        background:#fff;
        border:1px solid rgba(212,212,212,1);
        border-radius:2px 0px 0px 2px;
        .source-tab{
          flex:1;
          text-align:center;
          cursor: pointer;
          &.selected{
            background:rgba(61,145,247,1);
            border:1px solid rgba(39,122,224,1);
            color:#fff;
          }
        }
      }
    }
  }
</style>

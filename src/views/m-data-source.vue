<template>
  <div
    class="datasource-wrap flex-column"
  >
    <!-- toolbar/导入数据源 -->
    <div
      class="datasource-toolbar"
    >
      <!--导入数据源-->
      <a
        v-show="dataType === 0 && !$store.state.main.isTemplateApply"
        class="import-datasource-btn"
        href="javascript:;"
        @click="devicesVisible = true"
      >
        <i />
        {{ $t('importDataSource') }}
      </a>
    </div>
    <!--- menu/数据源、数据模型 -->
    <ul class="datasource-menu">
      <li
        :class="{'active': dataType === 0}"
        @click="handleTabClick(0)"
      >
        {{ $t('device') }}
      </li>
      <li
        :class="{'active': dataType === 1}"
        @click="handleTabClick(1)"
      >
        {{ $t('predictionApply') }}
      </li>
      <li
        :class="{'active': dataType === 2}"
        @click="handleTabClick(2)"
      >
        {{ $t('statisticApply') }}
      </li>
    </ul>
    <!--主体内容-->
    <div class="datasource-body flex-full-item">
      <!-- 数据源 -->
      <datasource
        v-show="dataType === 0"
        :reload-data="deviceDataChange"
      />
      <!-- 预测应用 统计应用 -->
      <component
        :is="modelComponent"
        v-show="dataType !== 0"
      />
    </div>
    <!-- 导入数据源弹窗 -->
    <importDataSource
      v-if="!$store.state.main.isTemplateApply"
      ref="devices"
      v-model="devicesVisible"
      :visible-import="devicesVisible"
      multiple
      @callback="devicesCallback"
    />
  </div>
</template>

<script>
import Devices from './data-source/devices'
import importDataSource from './data-source/importdataSource'
import Datasource from './data-source/datasource'
import Datamodel from './data-source/datamodel'
import PredictionApp from './data-source/predictonApp'
import StatisticApp from './data-source/statisticApp'
import editingModel from './data-source/js/editing-model'

export default{
  components:{
    Devices,
    Datasource,
    // Datamodel: resolve => require(['./data-source/datamodel'], resolve),
    Datamodel,
    PredictionApp,
    StatisticApp,
    importDataSource,
  },
  mixins: [editingModel],
  data() {
    return {
      // 0: 数据源 1: 数据模型
      dataType: 0,
      deviceDataChange: false,
      devicesVisible: false,
      modelComponent: ''
    }
  },
  methods: {
    importDataHander() {
      this.devicesVisible = true
    },
    triggerCancel() {
      this.devicesVisible = false
    },
    handleTabClick(index) {
      if (this.dataType === index) {
        return;
      }
      if (this.canGoOn()) {
        this.dataType = index;
        if (index === 1) {
          this.modelComponent = 'datamodel';
        }
      }
    },
    devicesCallback() {
      this.deviceDataChange = !this.deviceDataChange;
    },
  },
}
</script>

<style lang="less">
/* 重置iview弹窗样式 */
.custom-modal {
  .ivu-modal-header {
    padding: 0;
  }
  .ivu-modal-header-inner {
    display: block;
    height: 36px;
    line-height: 36px;
    color: #252525;
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    background: linear-gradient(0deg,#d8d8d8,#e4e3e4);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  .ivu-modal-close {
    position: absolute;
    top: 10px !important;
    width: 16px;
    height: 16px;
    background-image: url('../assets/images/default/closeDialog.png');
    background-size: cover;
  }
  .ivu-modal-content {
    background-color: #f5f5f5;
  }
  .ivu-modal {
    top: 0 !important;
    height: 100%;
    overflow: hidden;
  }
  .ivu-modal-content {
    top: 50%;
    transform: translateY(-50%);
  }
}

.ivu-checkbox-focus {
	box-shadow: none;
}

.flex-row,
.flex-column {
  height: 100%;
  display: flex;
  overflow: hidden;
}

.flex-column {
  flex-direction: column;
}

.flex-full-item {
  height: 100%;
  flex: 1;
  overflow: auto;
}

.datasource-wrap {
  background-color: #F9F9F9;
}

.datasource-toolbar {
  height: 72px;
  margin-left: 208px;
  background: linear-gradient(0deg,rgba(216,216,216,1) 0%,rgba(228,227,228,1) 100%);
  border-left: 1px solid #ccc;
}

.import-datasource-btn {
  float: right;
  margin-top: 13px;
  margin-right: 60px;
  color: #252525;
  font-size: 12px !important;
  text-align: center;

  > i {
    display: block;
    width: 48px;
    height: 24px;
    margin: 0 auto 3px;
    border: 1px solid #ccc;
    background:#fff url('../assets/images/datasource/importdataso.png') no-repeat center;
  }
}

.datasource-menu {
  height: 32px;
  background: rgba(242,242,242,1);
  border-bottom: 1px solid #ccc;

  > li {
    float: left;
    width: 102px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    transition: all .3s;
    cursor: pointer;
    
    &.active {
      color: #fff;
      background-color: #3D91F7;
    }
  }
}

.datasource-body {
  padding: 12px;
}

.datasource-content {
  height: 100%;
}

.device-data-wrap {
  height: 100%;
}

.device-data {
  float: left;
  height: 100%;

  + .device-data {
    margin-left: 12px;
  }
}

.device-data-list {
  padding: 5px 6px;

  > li {
    padding: 0 6px;
    height: 24px;
    line-height: 24px;
    border: 1px solid transparent;
    border-radius: 2px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    & + li {
      margin-top: 1px;
    }

    &.active {
      border-color: #C3CAD4;
      background: rgba(226,234,245,1);
    }

    > span {
      cursor: default;
    }
  }

  .ivu-checkbox-wrapper {
    float: left;
    margin-right: 4px;
    margin-top: -1px;
  }
}
</style>

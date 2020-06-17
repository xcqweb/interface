<template>
  <div class="device-data-wrap">
    <!-- 设备类型 -->
    <device-data
      class="device-data"
      :title="$t('dataSource.applyList')"
      :width="200"
      :data="predData"
      prop="appName"
      true-prop="appId"
      @click="handleTypeClick"
      @remove="handleTypeRemove"
    />
    <!-- 参数列表 -->
    <device-list
      class="device-data"
      :title="$t('dataSource.parameters')"
      :width="300"
      :data="preParamData"
      prop="appName"
      true-prop="appId"
      @click="handleTypeClick2"
      @remove="handleTypeRemove"
    />
    <!-- 移除确认弹窗 -->
    <component
      :is="removeView"
      v-model="removeVisible"
      :content="removeContent"
      :data="removeData"
      @callback="removeCallback"
    />
  </div>
</template>

<script>
import {Message} from 'iview'
import DeviceData from './device-data'
import DeviceList from './device-list'
import DeviceParams from './device-params'
import DatasourceStore from './js/datasource-store'
import removeCommon from './js/remove-common'

export default {
  components: {
    DeviceData,
    DeviceParams,
    DeviceList,
  },
  mixins: [DatasourceStore, removeCommon],
  props: {
    reloadData: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      paramData: [],
      preParamData: [],
    };
  },
  watch: {
    reloadData() {
      this.getPredictionData();
    },
  },
  mounted() {
    console.log(this.applyObj.forecastId)
    this.getPredictionData();
    this.getApplyParamsData();
  },
  methods: {
    handleTypeClick(item) {
      this.model.deviceTypeId = item.deviceTypeId;
    },
    handleTypeClick2(item) {
      this.applyObj.forecastId = item.forecastId;
    },
    getApplyParamsData() {
      const params = {
        appId: this.applyObj.forecastId,
        type: 1,
      }
      this.requestUtil.post(this.urls.newApplyParams.url, params).then(res => {
        console.log(res)
      })
    },
    handleTypeRemove(items) {
      const ids = [];
      items.forEach(type => {
        if (this.modelObj[type]) {
          const modelData = this.modelObj[type];
          modelData.forEach(model => {
            if (this.deviceObj[model.deviceModelId]) {
              const deviceData = this.deviceObj[model.deviceModelId];
              deviceData.forEach(device => {
                ids.push(device.id);
              })
            }
          });
        }
      });
      this.removeData = ids;
      this.removeContent = this.$t('dataSource.confirmToRemoveDeviceType');
      this.showRemoveModal();
    },
    handleModelRemove(items) {
      const ids = [];
      items.forEach(model => {
        if (this.deviceObj[model]) {
          const deviceData = this.deviceObj[model];
          deviceData.forEach(device => {
            ids.push(device.id);
          })
        }
      });
      this.removeData = ids;
      this.removeContent = this.$t('dataSource.confirmToRemoveDeviceModel');
      this.showRemoveModal();
    },
    handleDeviceRemove(items) {
      this.removeData = items;
      this.removeContent = this.$t('dataSource.confirmToRemoveDevice');
      this.showRemoveModal();
    },
    removeCallback() {
      const params = {
        ids: this.removeData,
      };
      this.requestUtil.post(this.urls.deleteDeviceList.url, params).then(() => {
        Message.success(this.$t('dataSource.removeDeviceSuccessfully'));
        this.getPredictionData();
      });
    },
  },
};
</script>
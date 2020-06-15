<template>
  <div class="device-data-wrap">
    <!-- 设备类型 -->
    <device-data
      class="device-data"
      :title="$t('dataSource.deviceType')"
      :width="200"
      :data="typeData"
      prop="deviceTypeName"
      true-prop="deviceTypeId"
      @click="handleTypeClick"
      @remove="handleTypeRemove"
    />
    <!-- 设备型号 -->
    <device-data
      class="device-data"
      :title="$t('dataSource.deviceModel')"
      :width="200"
      :data="modelData"
      prop="deviceModelName"
      true-prop="deviceModelId"
      @click="handleModelClick"
      @remove="handleModelRemove"
    />
    <!-- 参数列表 -->
    <device-params
      class="device-data"
      :title="$t('dataSource.parameters')"
      :width="300"
      :device-model-id="model.deviceModelId"
    />
    <!-- 设备列表 -->
    <device-data
      class="device-data"
      :title="$t('dataSource.devices')"
      :width="200"
      :data="deviceData"
      :show-active="false"
      prop="deviceName"
      true-prop="id"
      @remove="handleDeviceRemove"
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
import DeviceParams from './device-params'
import DatasourceStore from './js/datasource-store'
import removeCommon from './js/remove-common'

export default {
  components: {
    DeviceData,
    DeviceParams,
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
    };
  },
  watch: {
    reloadData() {
      this.getStudioDeviceData();
      this.getPredictionData();
    },
  },
  mounted() {
    this.getStudioDeviceData();
    this.getPredictionData();
    console.log(this.model);
  },
  methods: {
    handleTypeClick(item) {
      this.model.deviceTypeId = item.deviceTypeId;
    },
    handleModelClick(item) {
      this.model.deviceModelId = item.deviceModelId;
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
        console.log(56)
        this.getStudioDeviceData();
        this.getPredictionData();
      });
    },
  },
};
</script>
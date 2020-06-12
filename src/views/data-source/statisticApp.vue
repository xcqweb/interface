<template>
  <div class="device-data-wrap">
    <!-- 应用列表 -->
    <device-list
      class="device-data"
      :title="$t('dataSource.applyList')"
      :width="200"
      :data="statiData"
      prop="appName"
      true-prop="appId"
      @click="handleTypeClick"
      @remove="handleTypeRemove"
    />
    <!-- 参数列表 -->
    <device-params
      class="device-data"
      :title="$t('dataSource.parameters')"
      :width="300"
      :device-model-id="model.deviceModelId"
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
import DeviceList from './device-list'
import DeviceData from './device-data'
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
    };
  },
  watch: {
    reloadData() {
      this.getStatisticData();
    },
  },
  mounted() {
    this.getStatisticData();
  },
  methods: {
    handleTypeClick(item) {
      this.applyObj.appId = item.appId;
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
        this.getStatisticData();
      });
    },
  },
};
</script>
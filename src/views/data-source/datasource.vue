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
      v-model="visible"
      :content="content"
      :data="removeData"
      @callback="getStudioDeviceData"
    />
  </div>
</template>

<script>
import {Modal} from 'iview'
import DeviceData from './device-data'
import DeviceParams from './device-params'
import DatasourceStore from './js/datasource-store'

export default {
    components: {
        Modal,
        DeviceData,
        DeviceParams,
        RemoveDevice: (resolve) => {
            return require(['./remove-device'], resolve);
        },
    },
    mixins: [DatasourceStore],
    props: {
        reloadData: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            paramData: [],
            // 移除操作确认属性
            visible: false,
            removeView: '',
            removeData: [],
            content: '',
        };
    },
    watch: {
        reloadData() {
            this.getStudioDeviceData();
        },
    },
    mounted() {
        this.getStudioDeviceData();
    },
    methods: {
        handleTypeClick(item) {
            this.model.deviceTypeId = item.deviceTypeId;
        },
        handleModelClick(item) {
            this.model.deviceModelId = item.deviceModelId;
        },
        showRemoveModal() {
            this.removeView = 'remove-device';
            this.visible = true;
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
            this.content = this.$t('dataSource.confirmToRemoveDeviceType');
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
            this.content = this.$t('dataSource.confirmToRemoveDeviceModel');
            this.showRemoveModal();
        },
        handleDeviceRemove(items) {
            this.removeData = items;
            this.content = this.$t('dataSource.confirmToRemoveDevice');
            this.showRemoveModal();
        }
    },
};
</script>
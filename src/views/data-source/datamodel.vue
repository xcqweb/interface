<template>
  <div class="device-data-wrap flex-row">
    <!-- 设备类型 -->
    <device-list
      class="device-data"
      :title="$t('dataSource.deviceType')"
      :width="200"
      :data="typeData"
      prop="deviceTypeName"
      @click="handleTypeClick"
    />
    <!-- 设备型号 -->
    <device-list
      class="device-data"
      :title="$t('dataSource.deviceModel')"
      :width="200"
      :data="modelData"
      prop="deviceModelName"
      @click="handleModelClick"
    />
    <!-- 模型列表 -->
    <model-list
      class="device-data"
      :title="$t('dataSource.models')"
      :width="200"
    />
    <!-- 编辑模型 -->
    <edit-model
      class="device-data flex-full-item"
      :device-model-id="model.deviceModelId"
    />
  </div>
</template>

<script>
import DeviceList from './device-list'
import ModelList from './model-list'
import EditModel from './edit-model'
import DatasourceStore from './js/datasource-store'

export default {
    components: {
        DeviceList,
        ModelList,
        EditModel,
    },
    mixins: [DatasourceStore],
    methods: {
        handleTypeClick(item) {
            this.model.deviceTypeId = item.deviceTypeId;
        },
        handleModelClick(item) {
            this.model.deviceModelId = item.deviceModelId;
        },
    }
};
</script>

<style lang="less">
.addmodel-btn {
  padding: 5px 10px;
  line-height: 26px;

  > a {
    display: inline-block;
    padding-left: 16px;
    color: #252525;
    background-repeat: no-repeat;
    background-position: left center;
    background-image: url('../../assets/images/leftsidebar/addpage.png');
    background-size: 16px auto;
  }
}
</style>

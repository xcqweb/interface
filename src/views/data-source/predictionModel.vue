<template>
  <div class="device-data-wrap flex-row">
    <!-- 应用列表 -->
    <device-list
      class="device-data"
      :title="$t('dataSource.applyList')"
      :width="200"
      :data="predData"
      prop="appName"
      true-prop="appId"
      @click="handleTypeClick"
    />
    <!-- 模型列表 -->
    <model-list
      v-model="showForm"
      class="device-data"
      :title="$t('dataSource.models')"
      :from-text="1"
      :width="200"
      :device-model-id="applyObj.forecastId"
      @on-edit="handleEditModel"
    />
    <!-- 编辑模型 -->
    <component
      :is="editModelView"
      v-show="editModel"
      ref="edit"
      v-model="showForm"
      :data="editModel"
      :from-text="1"
      class="device-data flex-full-item"
      :device-model-id="model.deviceModelId"
      :app-id="applyObj.forecastId"
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
  data() {
    return {
      editModelView: '',
      editModel: null,
      showForm: false,
    };
  },
  watch: {
    predData(val) {
      console.log(val)
      if (val.length) {
        this.applyObj.forecastId = val[0].appId
      }
    },
  },
  methods: {
    handleTypeClick(item) {
      this.applyObj.forecastId = item.appId;
    },
    handleEditModel(model = null) {
      this.editModel = model;
      if (model) {
        this.editModelView = 'edit-model';
      }
    },
  },
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

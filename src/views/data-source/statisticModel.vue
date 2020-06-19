<template>
  <div class="device-data-wrap flex-row">
    <!-- 设备类型 -->
    <device-list
      v-if="!$store.state.main.isTemplateApply"
      class="device-data"
      :title="$t('dataSource.applyList')"
      :width="200"
      :data="statiData"
      prop="appName"
      @click="handleTypeClick"
    />
    <!-- 模型列表 -->
    <model-list
      v-model="showForm"
      class="device-data"
      :title="$t('dataSource.models')"
      :width="200"
      :from-text="2"
      :device-model-id="applyObj.appId"
      @on-edit="handleEditModel"
    />
    <!-- 编辑模型 -->
    <component
      :is="editModelView"
      v-show="editModel"
      ref="edit"
      v-model="showForm"
      :data="editModel"
      :from-text="2"
      class="device-data flex-full-item"
      :device-model-id="model.deviceModelId"
      :app-id="applyObj.appId"
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
    statiData(val) {
      if (val.length) {
        this.applyObj.appId = val[0].appId
      }
    },
  },
  methods: {
    handleTypeClick(item) {
      this.applyObj.appId = item.appId;
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

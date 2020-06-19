<template>
  <div class="device-data-wrap">
    <!-- 应用列表 -->
    <device-data
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
    <device-list
      class="device-data"
      :title="$t('dataSource.parameters')"
      :width="300"
      :data="statiParamData"
      prop="paramName"
      true-prop="paramId"
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
      statiParamData: [],
    };
  },
  watch: {
    reloadData() {
      this.getStatisticData();
    },
    statiData(val) {
      if (val.length) {
        this.applyObj.appId = val[0].appId
        this.getApplyParamsData()
      }
    },
  },
  async mounted() {
    await this.getStatisticData();
  },
  methods: {
    handleTypeClick(item) {
      this.applyObj.appId = item.appId;
      this.getApplyParamsData()
    },
    getApplyParamsData() {
      if (!this.statiData.length) {return}
      const params = {
        appId: this.applyObj.appId || this.statiData[0].appId,
        type: 2,
      }
      if (!params.appId) {
        return
      }
      this.requestUtil.post(this.urls.newApplyParams.url, params).then(res => {
        this.statiParamData = res.returnObj || []
      })
    },
    handleTypeRemove(items) {
      const ids = [];
      items.forEach(type => {
        ids.push(type);
      });
      this.removeData = ids;
      this.removeContent = this.$t('dataSource.confirmToRemoveApply');
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
        Message.success(this.$t('dataSource.removeApplySuccessfully'));
        this.getStatisticData();
      });
    },
  },
};
</script>
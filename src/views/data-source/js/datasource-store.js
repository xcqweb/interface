export default {
  data() {
    return {
      model: {
        deviceTypeId: '',
        deviceModelId: '',
      },
      modelObj: {},
      deviceObj: {},
      studioId: '',
      applyObj: {
        forecastId: '', // 预测
        appId: '', // 统计
      },
    };
  },
  computed: {
    typeData() {
      const typeData = this.$store.state.datasource.typeData;
      if (typeData.length > 0) {
        const type = typeData[0];
        this.model.deviceTypeId = type.deviceTypeId;
      } else {
        this.model.deviceTypeId = '';
      }
      return typeData;
    },
    modelData() {
      const key = this.model.deviceTypeId;
      this.modelObj = this.$store.state.datasource.modelObj || {};
      const model = key && this.modelObj[key] ? this.modelObj[key] : [];
      if (model.length > 0) {
        this.model.deviceModelId = model[0].deviceModelId;
      } else {
        this.model.deviceModelId = '';
      }
      return model;
    },
    deviceData() {
      const key = this.model.deviceModelId;
      this.deviceObj = this.$store.state.datasource.deviceObj || {};
      return key && this.deviceObj[key] ? this.deviceObj[key] : [];
    },
    predData() {
      const predData = this.$store.state.datasource.predData;
      if (predData.length > 0) {
        const type = predData[0];
        this.applyObj.forecastId = type.appId;
      } else {
        this.applyObj.forecastId = '';
      }
      return predData;
    },
    statiData() {
      const statiData = this.$store.state.datasource.statiData;
      if (statiData.length > 0) {
        const type = statiData[0];
        this.applyObj.appId = type.appId;
      } else {
        this.applyObj.appId = '';
      }
      return statiData;
    }
  },
  created() {
    this.studioId = window.sessionStorage.getItem('applyId')
  },
  methods: {
    getStudioDeviceData() {
      if (!this.studioId) {
        return;
      }
      const params = {
        studioId: this.studioId,
      };
      this.$store.dispatch('loadStudioDevices', params);
    },
    getPredictionData() { // 预测应用
      if (!this.studioId) {
        return;
      }
      const params = {
        studioId: this.studioId,
        type: 1,
      };
      this.$store.dispatch('loadStudioPredictionApp', params);
    },
    getStatisticData() { // 统计应用
      if (!this.studioId) {
        return;
      }
      const params = {
        studioId: this.studioId,
        type: 2,
      };
      this.$store.dispatch('loadStudioStatisticApp', params);
    }
  },
};

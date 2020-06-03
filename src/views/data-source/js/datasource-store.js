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
  },
  created() {
    this.studioId = this.myEditorUi.editor.getApplyId() || window.sessionStorage.getItem('applyId');
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
    }
  },
};

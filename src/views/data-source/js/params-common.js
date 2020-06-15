export default {
  props: {
    deviceModelId: {
      type: String,
      default: '',
    },
    deviceId: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      deviceParams: null,
      virtualParams: null,
    };
  },
  computed: {
    items() {
      const items = [];
      if (this.deviceParams) {
        items.push(this.deviceParams);
      }
      if (this.virtualParams) {
        items.push(this.virtualParams);
      }
      console.log(items)
      return items;
    },
  },
  methods: {
    getData() {
      this.deviceParams = null;
      this.virtualParams = null;
      const params = {
        deviceModelId: this.deviceModelId || sessionStorage.getItem('modelId'),
      };
      if (!params.deviceModelId || params.deviceModelId === 'null') {
        return;
      }
      if(this.deviceId) {
        params.deviceId = this.deviceId
      }
      this.getDeviceParams(params);
      this.getVirtualParams(params);
    },
    getDeviceParams(params) {
      this.requestUtil.get(this.urls.normalParam.url, params).then(res => {
        if (this.getDeviceParamsCallback) {
          this.getDeviceParamsCallback(res);
        }
      });
    },
    getVirtualParams(params) {
      this.requestUtil.get(this.urls.fictitiousParam.url, params).then(res => {
        if (this.getVirtualParamsCallback) {
          this.getVirtualParamsCallback(res);
        }
      });
    },
  },
}
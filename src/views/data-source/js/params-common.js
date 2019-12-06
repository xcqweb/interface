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
            return items;
        },
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.deviceParams = null;
            this.virtualParams = null;
            if (!this.deviceModelId) {
                return;
            }
            const params = {
                deviceModelId: this.deviceModelId,
            };
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
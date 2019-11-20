export default {
    props: {
        deviceModelId: {
            type: String,
            default: '',
        },
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
    watch: {
        deviceModelId() {
            this.getData();
        },
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            if (!this.deviceModelId) {
                this.deviceParams = null;
                this.virtualParams = null;
                return;
            }
            const params = {
                deviceModelId: this.deviceModelId,
            };
            this.getDeviceParams(params);
            this.getVirtualParams(params);
        },
        getDeviceParams(params) {
            this.requestUtil.get('api/device/deviceModel/param/normal/select', params).then(res => {
                if (this.getDeviceParamsCallback) {
                    this.getDeviceParamsCallback(res);
                }
            });
        },
        getVirtualParams(params) {
            this.requestUtil.get('api/device/deviceModel/param/fictitious/select', params).then(res => {
                if (this.getVirtualParamsCallback) {
                    this.getVirtualParamsCallback(res);
                }
            });
        },
    },
}
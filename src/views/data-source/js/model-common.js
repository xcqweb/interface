export default {
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        deviceModelId: {
            type: String,
        },
    },
    data() {
        return {
            currentValue: false,
            studioId: ''
        };
    },
    watch: {
        value(val) {
            this.currentValue = val;
        },
        currentValue(val) {
            this.$emit('input', val);
        },
    },
    created() {
        this.studioId = this.myEditorUi.editor.getApplyId() || window.sessionStorage.getItem('applyId');
        this.currentValue = this.value;
    },
}
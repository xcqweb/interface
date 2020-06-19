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
      showForm: false,
      studioId: ''
    };
  },
  watch: {
    value(val) {
      this.showForm = val;
      this.$store.commit('modelEditing', val);
    },
    showForm(val) {
      this.$emit('input', val);
    },
  },
  created() {
    this.studioId = window.sessionStorage.getItem('applyId');
    this.showForm = this.value;
  },
}

import RemoveModal from '@/views/data-source/remove-modal'

export default {
  components: {
    // RemoveModal: (resolve) => {
    //     return require(['@/views/data-source/remove-modal'], resolve);
    // },
    RemoveModal,
  },
  data() {
    return {
      // 移除操作确认属性
      removeVisible: false,
      removeView: '',
      removeData: null,
      removeContent: '',
    };
  },
  methods: {
    showRemoveModal() {
      this.removeView = 'remove-modal';
      this.removeVisible = true;
    },
  },
};

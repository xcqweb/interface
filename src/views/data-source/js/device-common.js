import NoData from '../nodata';
import DataColumn from '../data-column'
import columnCommon from './column-common'
import editingModel from './editing-model'

export default {
  components: {
    NoData,
    DataColumn,
  },
  mixins: [columnCommon, editingModel],
  props: {
    // checkbox label
    prop: {
      type: String,
    },
    data: {
      type: Array,
      required: true,
    },
    showActive: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      activeIndex: -1,
    };
  },
  watch: {
    data(val) {
      this.activeIndex = val && val.length > 0 ? 0 : -1;
    },
  },
  created() {
    if (this.data && this.data.length > 0) {
      this.activeIndex = 0;
    }
  },
  methods: {
    handleClick(item, index) {
      if (this.activeIndex === index) {
        return;
      }
      if (this.canGoOn()) {
        this.activeIndex = index;
        this.$emit('click', item);
      }
    },
    getValue(item, key) {
      const type = typeof item;
      if (type === 'string') {
        return item;
      } else if (type === 'object') {
        if (key) {
          return item[key];
        }
      }
      return '';
    },
  },
};

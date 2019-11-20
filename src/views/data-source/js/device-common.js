import NoData from '../nodata';
import DataColumn from '../data-column'
import columnCommon from './column-common'

export default {
    components: {
        NoData,
        DataColumn,
    },
    mixins: [columnCommon],
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
            activeIndex: 0,
        };
    },
    methods: {
        handleClick(item, index) {
            this.activeIndex = index;
            this.$emit('click', item);
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

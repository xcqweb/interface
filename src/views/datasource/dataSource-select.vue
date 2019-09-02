<template>
  <div 
    class="datasource-select"
  >
    <Select 
      v-model="modelvalue" 
      style="height:24px"
    >
      <Option 
        v-for="(item, index) in datalist"
        :key="index"
        :value="item.value"
      >
        {{ item.label }}
      </Option>
    </Select>
  </div>
</template>

<script>
import {Select,Option} from 'iview'
export default {
    components: {
        Select,
        Option
    },
    props: {
        datalist:{
            type: Array,
            default: () => []
        },
        modelvalue: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
        }
    },
    mounted() {
    },
    methods: {
    }
}
</script>
<style lang="less" scoped>
.datasource-select{
  /deep/.ivu-select-selection{
    height:24px;
    .ivu-select-placeholder{
      height:24px;
      line-height:24px;
    }
    .ivu-select-selected-value{
        height:24px;
        line-height:24px;
      }
  }
  .ivu-select-dropdown{
    .ivu-select-dropdown-list{
      .ivu-select-item{
        padding: 0 16px 0;
      }
    }
  }
}
</style>
<template>
  <div 
    class="datasource-select"
  >
    <Select 
      :model.sync="modelValue" 
      style="width:168px;height:24px"
    >
      <Option 
        v-for="(item, index) in dataSource"
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
    data() {
        return {
            dataSource: [
                {
                    value: '1',
                    label: '北京市'
                }
            ],
            modelValue: '1'
        }
    }
}
</script>
<style lang=" less" scoped>

</style>
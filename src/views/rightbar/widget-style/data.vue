<template>
  <div class="data-sources">
    <div>{{ dataName }}</div>
    <DataSource />
  </div>
</template>

<script>
import DataSource from './dataSource-select'
export default{
    components: {
        DataSource
    },
    data() {
        return {
            dataName: `数据源`
        }
    },
    mounted() {
    },
    methods: {
        
    },      
}
</script>

<style scoped lang="less">

</style>

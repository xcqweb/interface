<template>
  <div class="no-data">
    {{ text }}
  </div>
</template>
<script>
export default{
    props: {
        text: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
        }
    }
}
</script>
<style lang="less" scoped>
.no-data {
    width: 56px;
    padding-top:46px;
    margin-top:-46px;
    background: url("../../assets/images/datasource/nodata.png") no-repeat center top;
    background-size: 56px 42px;
}
</style>
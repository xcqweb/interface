<template>
  <div class="no-data-wrap">
    <div
      class="no-data"
      :style="style"
    >
      {{ $t(text) }}
    </div>
  </div>
</template>

<script>
export default{
    props: {
        text: {
            type: String,
            default: 'noData'
        },
        marginTop: {
            type: Number,
        },
    },
    computed: {
        style() {
            if (this.marginTop !== undefined) {
                const marginTop = this.marginTop - 46 + 'px';
                return {marginTop};
            }
            return '';
        },
    },
}
</script>

<style lang="less">
.no-data-wrap{
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.no-data {
    width: 62px;
    padding-top: 46px;
    margin-top: -46px;
    text-align: center;
    background: url("../../assets/images/datasource/nodata.png") no-repeat center top;
    background-size: 56px 42px;
}
</style>
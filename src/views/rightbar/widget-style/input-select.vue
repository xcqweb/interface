<template>
  <div class="input-common">
    <input 
      type="text" 
      :placeholder="placetext"
      class="input-icon"
      :class="derection === 'left' ? 'input-left-icon':'input-right-icon'"
    >
  </div>
</template>

<script>
export default {
    props: {
        placetext:{
            type: String,
            default: ''
        },
        derection: {
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
.input-common{
    .input-icon{
        width:100%;
        height:24px;
        line-height: 24px;
        font-size: 12px;
        box-sizing: border-box;
        border:1px solid #d4d4d4;
        border-radius: 2px;
        background-size:16px 16px;
        background-image: url("../../../assets/images/material/searchicon.png");
        background-color: #fff;
        background-repeat: no-repeat;
    }
    .input-left-icon{
        padding:2px 5px 2px 20px;
        background-position: left center;
    }
    .input-right-icon{
        padding:2px 20px 2px 5px;
        background-position: right center;
    }
}
</style>
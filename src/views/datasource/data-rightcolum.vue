<template>
  <div 
    class="data-rightcolum"
    :style="{width:`${widthlen}px`}"
  >
    <div 
      class="data-colum-wrap"
      :style="{width:`${widthlen}px`}"
    >
      <div 
        v-if="showtitle" 
        class="data-colum-title"
      >
        {{ title }}
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
    props: {
        title:{
            type: String,
            default: ''
        },
        widthlen: {
            type: Number,
            default: 100
        },
        showtitle: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            
        }
    }
}
</script>
<style lang="less" scoped>
.data-rightcolum{
    height:100%;
    margin-right:10px;
    .data-colum-wrap{
        display:flex;
        height: 100%;
        flex-direction: column;
        border:1px solid #D4D4D4;
        box-sizing: border-box;
        border-radius: 4px  4px 0px 0px;
        .data-colum-title{
            height:36px;
            width:100%;
            padding-left:10px;
            line-height:36px;
            border-bottom:1px solid #CCCCCC;
            background:linear-gradient(0deg,rgba(216,216,216,1) 0%,rgba(228,227,228,1) 100%);
            // border-radius: 4px  4px 0px 0px
        }
        .dataSource-right-content{
            flex:1;
            background: #fff;
            padding: 10px 0 0;
        }
    }
}
</style>
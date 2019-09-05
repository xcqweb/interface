<template>
  <div class="suspensionList">
    <div class="suspensionList-content">
      <ul 
        v-if="datalist.length"
        @mouseleave="mouseLeaveHandle"
      >
        <li 
          v-for="(item, index) in datalist"
          :key="item.id"
          :class="numberIndex === 0 ? 'currentList' : ''"
          @click="clickHandle(item.id, index)"
          @mouseleave="mouseLeaveHandle"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default{
    props:{
        datalist: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            numberIndex: 0
        }
    },
    methods: {
        clickHandle(id) {
            console.log(id)
            switch(+id) {
                case 1:
                    this.$emit('renameHandle')
                    break;
                case 2:
                    this.$emit('deleteHandle')
                    break;
                default:
                    break;
            }
            this.$nextTick(() => {
                this.$emit('clickHandleList')
            })
        },
        mouseLeaveHandle() {
            this.$emit('ChildMouseLeaveHandle')
        }
    }
}
</script>
<style lang="less" scoped>
    .suspensionList{
        // padding:5px 0;
        width:116px;
        position: fixed;
        border-radius: 2px;
        z-index:9999999;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
        color:#252525;
        background:#F5F5F5;
        li{
            height: 24px;
            font-size: 14px;
            padding: 0 15px;
            cursor: default;
            line-height: 24px;
            &:hover{
                background: #3d91f7;
                color:#fff;
            }
        }
    }
</style>
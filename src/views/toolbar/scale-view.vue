<template>
  <div
    class="mxPopupMenu geToolbarMenu"
    style="display: inline; z-index:22; left:18%; top: 71px;"
    @mouseleave="hideScale($event)"
    @blur="hideScale($event)"
  >
    <table class="mxPopupMenu">
      <tbody>
        <tr
          v-for="(d,index) in scaleSizes"
          :key="index"
          :class="{'mxPopupMenuItem':classTtype[index]==1,'mxPopupMenuItemHover':classTtype[index]==2}"
          @click="changeScale(d)"
          @mouseover="changeActive(2,index)"
          @mouseout="changeActive(1,index)"
        >
          <td
            class="mxPopupMenuItem"
            align="left"
          >
            {{ d*100 }}%
          </td>
          <td
            class="mxPopupMenuItem"
            style="text-align: right; padding-right: 15px;"
          />
        </tr> 
      </tbody>
    </table>
  </div>
</template>

<script>
export default{
    data() {
        return {
            scaleSizes:[0.25, 0.5, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4],
            classTtype:[],
        }
    },
    created() {
        this.classTtype = new Array(this.scaleSizes.length).fill(1)
    },
    mounted() {
        const component = this.$mount();
        document.querySelector('body').appendChild(component.$el)
    },
    methods: {
        changeActive(type,index) {
            this.classTtype = new Array(this.scaleSizes.length).fill(1)
            this.$set(this.classTtype,index,type)
        },
        changeScale(d) {
            this.$emit("changeScale",d)
        },
        hideScale(event) {
            this.$emit("hideScale")
            event.stopPropagation();
        }
    },      
}
</script>

<style scoped lang="less">

</style>

<style lang="less">
  
</style>

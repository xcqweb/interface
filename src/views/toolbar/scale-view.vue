<template>
  <div
    v-clickOutSide="hideScale"
    class="mxPopupMenu geToolbarMenu"
    style="display: inline; z-index:22; left:12.7%; top:40px;"
    @blur="hideScale()"
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
      scaleSizes:[0.25, 0.5,0.8, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4],
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
    hideScale() {
      this.$emit("hideScale")
    }
  },      
}
</script>

<style scoped lang="less">

</style>

<style lang="less">
  
</style>

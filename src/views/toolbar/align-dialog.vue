<template>
  <div
    v-clickOutSide="hideDialog"
    class="mxPopupMenu geToolbarMenu"
    style="display: inline; z-index:22; left:49.9%; top: 38px;"
    @mouseleave="hideDialog()"
    @blur="hideDialog()"
  >
    <table class="mxPopupMenu">
      <tbody>
        <tr
          v-for="(d,index) in alignList"
          :key="index"
          :class="{'mxPopupMenuItem':classTtype[index]==1,'mxPopupMenuItemHover':classTtype[index]==2}"
          @click="changeAlign(d)"
          @mouseover="changeActive(2,index)"
          @mouseout="changeActive(1,index)"
        >
          <td
            class="mxPopupMenuItem"
            :class="d.cls"
          />
          <td
            class="mxPopupMenuItem"
            style="padding-left:5px;font-size:12px;"
          >
            {{ d.text }}
          </td>
        </tr> 
      </tbody>
    </table>
  </div>
</template>

<script>
export default{
    data() {
        return {
            alignList:[
                {cls:'geSprite-left-align',text:'左对齐'},
                {cls:'geSprite-right-align',text:'右对齐'},
                {cls:'geSprite-top-align',text:'上对齐'},
                {cls:'geSprite-bottom-align',text:'下对齐'},
                {cls:'geSprite-vertical-center',text:'垂直居中对齐'},
                {cls:'geSprite-horizon-center',text:'水平居中对齐'},
                {cls:'geSprite-vertical-align',text:'垂直等间距'},
                {cls:'geSprite-horizon-align',text:'水平等间距'},
            ],
            classTtype:[],
        }
    },
    created() {
        this.classTtype = new Array(this.alignList.length).fill(1)
    },
    mounted() {
        const component = this.$mount();
        document.querySelector('body').appendChild(component.$el)
    },
    methods: {
        changeActive(type,index) {
            this.classTtype = new Array(this.alignList.length).fill(1)
            this.$set(this.classTtype,index,type)
        },
        changeAlign(d) {
            this.$emit("changeAlign",d)
        },
        hideDialog() {
            this.$emit("hideDialog")
        }
    },      
}
</script>

<style scoped lang="less">

</style>

<style lang="less">
  
</style>

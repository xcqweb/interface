<template>
  <div
    v-clickOutSide="hideDialog"
    class="mxPopupMenu geToolbarMenu"
    style="display: inline; z-index:22; left:43.6%; top: 40px;"
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
                {cls:'geSprite-left-align',text:this.$t('alignLeft')},
                {cls:'geSprite-right-align',text:this.$t('alignRight')},
                {cls:'geSprite-top-align',text:this.$t('alignTop')},
                {cls:'geSprite-bottom-align',text:this.$t('alignBottom')},
                {cls:'geSprite-vertical-center',text:this.$t('alignVerticalCenter')},
                {cls:'geSprite-horizon-center',text:this.$t('alignHorizonCenter')},
                {cls:'geSprite-vertical-align',text:this.$t('alignVerticalSpace')},
                {cls:'geSprite-horizon-align',text:this.$t('alignHorizonSpace')},
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

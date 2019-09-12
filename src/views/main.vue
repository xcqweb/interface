<template>
  <div class="m-contianer">
    <div class="tab">
      <div
        class="item page-tab"
        :class="{'selected':tab==1}"
        @click="changeTab(1)"
      >
        <img :src="[require(`../assets/images/menu//page${tab}_ic.png`)]">
      </div>
      <div
        class="item data-tab"
        :class="{'selected':tab==2}"
        style="border-left:0;"
        @click="changeTab(2)"
      >
        <img :src="[require(`../assets/images/menu/datasource${3-tab}_ic.png`)]">
      </div>
    </div>
    <MPage v-show="isPage" />
    <MDataS 
      v-if="!isPage" 
      ref="dataSourceTab" 
    />
  </div>
</template>

<script>
import MPage from './m-page'
import MDataS from './m-datasource'
const alertTip = '您还有未保存的模型,请先保存'
import VueEvent from '../services/VueEvent.js'
import {Message} from 'iview'
export default {
    components:{
        MPage,MDataS
    },
    data() {
        return{
            tab:1,
            isPage:true,
            bindDatas: [],
            tabShow: true
        }
    },
    computed:{
        modelEditing() {
            return this.$store.state.main.modelEditing
        }
    },
    created() {
        
    },
    mounted() {
        
    },
    beforeDestroy() {
        VueEvent.$off('rightBarTabSwitch')
    },
    methods: {
        changeTab(index) {
            if (!this.modelEditing && index === 1) {
                Message.warning(alertTip)
                return false
            }
            this.tab = index
            this.isPage = this.tab == 1
            if (index === 2 && this.tabShow) {
                this.$nextTick(() => {
                    VueEvent.$emit('rightBarTabSwitch')
                    this.$refs.dataSourceTab.getDeviceType()
                    this.tabShow = false
                })
            } else if (index === 1) {
                this.tabShow = true
            }
        },
    }
};
</script>

<style scoped lang="less">
.m-contianer{
    height:100%;
    position: relative;
}
.tab{
    width:208px;
    position:absolute;
    background: linear-gradient(0deg,rgba(216,216,216,1) 0%,rgba(228,227,228,1) 100%);
    display:flex;
    justify-content:center;
    z-index:33;
    height:72px;
    align-items:center;
    padding-bottom:18px;
    
  .item{
    width:48px;
    height:24px;
    border-radius:2px 0px 0px 2px;
    border:1px solid rgba(202,201,202,1);
    background:rgba(255,255,255,1);
    text-align:center;
    position: relative;
    &.selected{
      background:rgba(61,145,247,1);
      border:1px solid rgba(202,201,202,1);
    }
    img{
      position: absolute;
      top:50%; 
      left:50%;
      transform: translate(-50%,-50%);
    }
  }
  .page-tab::after {
    content: "页面";
    position: relative;
    font-size: 12px;
    top:24px;
  }
   .data-tab::after {
    content: "数据源";
    position: relative;
    font-size: 12px;
    top:24px;
  }
}
</style>

<style lang="less">
 
</style>

<template>
  <div class="m-contianer">
    <div class="tab">
      <div
        class="item page-tab"
        :class="{'selected':tab==1}"
        @click="changeTab(1)"
      >
        <img :src="[tab==1 ? require(`../assets/images/menu/page1_ic.png`) : require(`../assets/images/menu/page2_ic.png`)]">
      </div>
      <div
        v-if="!$store.state.main.isTemplateApply"
        class="item data-tab"
        :class="{'selected':tab==2}"
        style="border-left:0;"
        @click="changeTab(2)"
      >
        <img :src="[tab==2 ? require(`../assets/images/menu/datasource1_ic.png`) : require(`../assets/images/menu/datasource2_ic.png`)]">
      </div>
      <div
        class="item model-tab"
        :class="{'selected':tab==3}"
        style="border-left:0;"
        @click="changeTab(3)"
      >
        <img :src="[tab==3 ? require(`../assets/images/menu/model1_ic.png`) : require(`../assets/images/menu/model2_ic.png`)]">
      </div>
    </div>
    <MPage v-show="tab==1" />
    <MDataS 
      v-if="tab==2"
    />
    <MModel 
      v-if="tab==3"
    />
  </div>
</template>

<script>
import MPage from './m-page'
import MDataS from './m-data-source'
import MModel from './m-model'
import editingModel from './data-source/js/editing-model'
import VueEvent from '../services/VueEvent.js'
export default {
  components:{
    MPage,MDataS,MModel
  },
  mixins: [editingModel],
  data() {
    return{
      tab:1,
      bindDatas: [],
      tabShow: true
    }
  },
  methods: {
    changeTab(index) {
      if (!this.canGoOn() && (index === 1 || index === 2)) {
        return false
      }
      this.tab = index
      if (index === 2 && this.tabShow) {
        this.$nextTick(() => {
          VueEvent.$emit('rightBarTabSwitch')
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
    cursor: pointer;
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
}
</style>

<style lang="less">
 
</style>


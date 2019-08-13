<template>
  <div style="height:100%;">
    <div class="tab-container">
      <div
        class="tab"
        :class="{'selected':tab==1}"
        @click="changeTab(1)"
      >
        样式
      </div>
      <div
        class="tab"
        :class="{'selected':tab==2}"
        @click="changeTab(2)"
      >
        状态
      </div>
      <div
        class="tab"
        :class="{'selected':tab==3}"
        @click="changeTab(3)"
      >
        交互
      </div>
      <div
        class="tab"
        :class="{'selected':tab==4}"
        @click="changeTab(4)"
      >
        数据
      </div>
    </div>
    <Style
      v-show="tab==1"
    />
    <State
      v-show="tab==2"
    />
    <MutualMain
      v-show="tab==3"
    />
    <Data v-show="tab==4" />
  </div>
</template>

<script>
import Style from './widget-style/style'
import MutualMain from './widget-style/mutual-main'
import State from './widget-style/state'
import Data from './widget-style/data'
export default{
    components:{Style,MutualMain,State,Data},
    data() {
        return {
            tab:1,
        }
    },
    mounted() {
    },
    methods: {
        changeTab(index) {
            this.tab = index
        }
    },      
}
</script>

<style scoped lang="less">
.tab-container{
    height:32px;
    display: flex;
    line-height:32px;
    background:#F2F2F2;
    .tab{
        flex:1;
        border-right:1px solid #CCC;
        border-bottom:1px solid #CCC;
        font-weight:400;
        color:#252525;
        text-align:center;
        background:#fff;
        &.selected{
          background:#F2F2F2;
          border-bottom:none;
        }
    }

}

</style>

<style lang="less">
  
</style>

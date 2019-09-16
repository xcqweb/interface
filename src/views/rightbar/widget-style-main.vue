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
        v-if="stateList.includes(shapeName)"
        class="tab"
        :class="{'selected':tab==2}"
        @click="changeTab(2)"
      >
        状态
      </div>
      <div
        v-if="actionList.includes(shapeName)"
        class="tab"
        :class="{'selected':tab==3}"
        @click="changeTab(3)"
      >
        交互
      </div>
      <div
        v-if="dataList.includes(shapeName)"
        class="tab"
        :class="{'selected':tab==4}"
        @click="changeTab(4)"
      >
        数据
      </div>
    </div>
    <Style
      v-show="tab==1"
      :key="refresh+1"
    />
    <State
      v-if="tab==2 && stateList.includes(shapeName)"
      ref="stateRef"
      :key="refresh+2"
    />
    <MutualMain
      v-if="tab==3 && actionList.includes(shapeName)"
      :key="refresh+3"
    />
    <Data v-if="tab==4 && dataList.includes(shapeName)" />
  </div>
</template>

<script>
import Style from './widget-style/style'
import MutualMain from './widget-style/mutual-main'
import State from './widget-style/state'
import Data from './widget-style/data'
import VueEvent from '../../services/VueEvent.js'
export default{
    components:{Style,MutualMain,State,Data},
    data() {
        return {
            tab:1,
            refresh:0,//切换控件刷新子组件
            stateList:['rectangle','image','userimage','tableCell','light','ellipse'],
            actionList:['menuCell','rectangle','image','userimage','button','ellipse','text','tableCell'],
            dataList:['image','userimage','rectangle','ellipse','tableCell','light','progress','lineChart','gaugeChart'],
        }
    },
    computed: {
        shapeName() {
            return this.$store.state.main.widgetInfo.shapeInfo.shape
        },
        rand() {
            return this.$store.state.main.rand
        }
    },
    watch: {
        rand() {
            this.refresh = this.rand
        },
    },
    mounted() {
        VueEvent.$off('rightBarTabSwitch')
        VueEvent.$on('rightBarTabSwitch',()=>{
            this.changeTab(1)
        })
    },
    methods: {
        changeTab(index) {
            this.tab = index
            if (this.tab === 4) {
                VueEvent.$emit('isShowFootBar',{show:true,isUp:true})
            }
        },
    },      
}
</script>

<style scoped lang="less">
.tab-container{
    height:32px;
    display: flex;
    line-height:32px;
    font-size:14px;
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

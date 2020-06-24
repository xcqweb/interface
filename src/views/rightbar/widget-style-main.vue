<template>
  <div style="height:100%;">
    <div class="tab-container">
      <div
        class="tab"
        :class="{'selected':tab==1}"
        @click="changeTab(1)"
      >
        {{ $t('style') }}
      </div>
      <div
        v-if="stateList.includes(shapeName) && cellsCount==1"
        class="tab"
        :class="{'selected':tab==2}"
        @click="changeTab(2)"
      >
        {{ $t('state') }}
      </div>
      <div
        v-if="actionList.includes(shapeName) && cellsCount==1"
        class="tab"
        :class="{'selected':tab==3}"
        @click="changeTab(3)"
      >
        {{ $t('action') }}
      </div>
      <div
        v-if="shapeName.includes('buttonSwitch') && cellsCount==1"
        class="tab"
        :class="{'selected':tab==4}"
        @click="changeTab(4)"
      >
        {{ $t('controlS') }}
      </div>
      <div
        v-if="dataList.includes(shapeName) && isShowDataTab"
        class="tab"
        :class="{'selected':tab==5}"
        @click="changeTab(5)"
      >
        {{ $t('data') }}
      </div>
    </div>
    <Style
      v-show="tab==1"
      :key="refresh+1"
    />
    <State
      v-if="tab==2 && stateList.includes(shapeName)"
      :key="refresh+2"
    />
    <MutualMain
      v-if="tab==3 && actionList.includes(shapeName)"
      :key="refresh+3"
    />
    <Control 
      v-if="tab==4 && shapeName.includes('buttonSwitch')"
      :key="refresh+4"
    />
    <Data v-if="tab==5 && dataList.includes(shapeName)" />
  </div>
</template>

<script>
import Style from './widget-style/style'
import MutualMain from './widget-style/mutual-main'
import State from './widget-style/state'
import Data from './widget-style/data'
import Control from './widget-style/control'
import VueEvent from '../../services/VueEvent.js'
export default{
  components:{Style,MutualMain,State,Data,Control},
  data() {
    return {
      tab:1,
      refresh:0,//切换控件刷新子组件
      stateList:['rectangle','image','userimage','tableCell','light','ellipse','triangle','pentagram'],
      actionList:['menuCell','rectangle','image','userimage','button','ellipse','text','tableCell','triangle','pentagram'],
      dataList:['image','userimage','rectangle','ellipse','tableCell','light','progress','lineChart','gaugeChart','triangle','pentagram','buttonSwitch'],
      isShowDataTab:true,
    }
  },
  computed: {
    shapeName() {
      return this.$store.state.main.widgetInfo.shapeInfo.shape
    },
    rand() {
      return this.$store.state.main.rand
    },
    cellsCount() {
      return this.$store.state.main.widgetInfo.cellsCount
    },
  },
  watch: {
    rand() {
      this.refresh = this.rand
    },
    shapeName(val) {
      if(!this.stateList.includes(val) && this.tab == 2 || !this.actionList.includes(val) && this.tab == 3 || !this.dataList.includes(val) && this.tab == 5 || !this.shapeName.includes('buttonSwitch') && this.tab == 4) {
        this.tab = 1
      }
    },
  },
  created() {
    let graph = this.myEditorUi.editor.graph
    let cells = graph.getSelectionCells()
    if(cells.length > 1) {
      this.isShowDataTab = false
    }
    /*  for(let i = 0;i < cells.length;i++) { //批量绑定数据源的
            if(i < cells.length - 1 && this.getCellShapeName(cells[i]) != this.getCellShapeName(cells[i + 1])) {
                this.isShowDataTab = false
                break
            }
        } */
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
      if (this.tab === 5) {
        VueEvent.$emit('isShowFootBar',{show:true,isUp:true})
      }
    },
    getCellShapeName(cell) {
      let graph = this.myEditorUi.editor.graph
      let shapeName = ''
      let cellState = graph.view.getState(cell)
      if(cellState) {
        shapeName =  cellState.style.shape
      }
      return shapeName
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
        cursor: pointer;
        &.selected{
          background:#F2F2F2;
          border-bottom:none;
        }
    }

}

</style>

<style lang="less">
  
</style>

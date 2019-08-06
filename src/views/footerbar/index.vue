<template>
  <div
    v-clickOutSide="close"
    class="geFootbarContainer"
    :style="{bottom:bottom+'px'}"
  >
    <div
      class="collapse-menu"
      @click="toggle"
      :style="{transform: rotate}"
    />
    <ul class="tab">
      <li 
        :class="{active:componentId === 'DataSource'}"
        @click="componentId='DataSource'"
      >
        数据源
      </li>
      <li 
        :class="{active:componentId === 'ShowData'}"
        @click="componentId='ShowData'"
      >
        数据显示
      </li>
      <li 
        :class="{active:componentId === 'ModelState'}"
        @click="componentId='ModelState'"
      >
        状态模型
      </li>
      <p class="clearFix" />
    </ul>
    <keep-alive>
      <component :is="componentId" />
    </keep-alive>
  </div>
</template>

<script>
import conponents from './components'
const BOTTOM = -75
export default {
    components: {...conponents},
    props: {
        bindDatas: {
            type: Array
        }
    },
    data() {
        return {
            activeTab: 1,
            bottom: BOTTOM,
            componentId: 'DataSource'
        };
    },
    computed: {
        rotate() {
            return this.bottom === 0 ? `rotateZ(180deg)` : `rotateZ(0)`
        }
    },
    methods: {
        close() {
            this.bottom = BOTTOM
        },
        tabHandler(e) {
            console.log(e.target);
        },
        toggle() {
            this.bottom === 0 ? (this.bottom = BOTTOM) : (this.bottom = 0)
        }
    }
};
</script>

<style lang="less" scoped>
.geFootbarContainer {
  width: calc(100% - 402px);
  height: 100px;
  position: absolute;
  left: 180px;
  bottom: 0;
  z-index: 100;
  background: #fff;
  transition: all 0.36s;
  .collapse-menu {
    width: 16px;
    height: 16px;
    background-image: url("../../assets/images/footer/foot-collapse.png");
    background-repeat: no-repeat;
    background-size: contain;
    position: absolute;
    right: 2px;
    top: 5px;
    cursor: pointer;
  }
  .tab {
    border-bottom: 1px solid rgba(204, 204, 204, 1);
    border-top: 1px solid rgba(204, 204, 204, 1);
    border-right: 1px solid rgba(204, 204, 204, 1);
    display: flex;
    align-items: center;
    user-select: none;
    background: rgba(242, 242, 242, 1);
    & > li {
      width: 72px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(37, 37, 37, 1);
      float: left;
      background-color: #fff;
      border-right: 1px solid rgba(204, 204, 204, 1);
      border-left: 1px solid rgba(204, 204, 204, 1);
      cursor: pointer;
    }
    & > li:nth-child(2) {
      border-right: none;
      border-left: none;
    }
    .active {
      background-color: #f2f2f2;
    }
  }
}
</style>

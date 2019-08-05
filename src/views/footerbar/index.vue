<template>
  <div
    v-clickOutSide="close"
    class="geFootbarContainer"
    :style="{bottom:bottom+'px'}"
  >
    <div
      class="collapse-menu"
      @click="toggle"
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
import {clickOutSide} from '@/directives/directive'
import conponents from './components'
export default {
    directives: {
        "clickOutSide" : clickOutSide
    },
    components: {...conponents},
    data() {
        return {
            activeTab: 1,
            bottom: -100,
            componentId: 'DataSource'
        };
    },
    methods: {
        close() {
            this.bottom = -100
        },
        tabHandler(e) {
            console.log(e.target);
        },
        toggle() {
            this.bottom === -25 ? (this.bottom = -100) : (this.bottom = -25);
        }
    }
};
</script>

<style lang="less" scoped>
.geFootbarContainer {
  width: 100%;
  height: 100px;
  position: absolute;
  bottom: -24px;
  z-index: 100;
  background: rgba(242, 242, 242, 1);
  border: 1px solid rgba(204, 204, 204, 1);
  transition: all 0.36s;
  .collapse-menu {
    width: 16px;
    height: 16px;
    background-image: url("../../assets/images/footer/foot-collapse.png");
    background-repeat: no-repeat;
    background-size: contain;
    position: absolute;
    right: 0;
    top: 4px;
    border: 1px dashed rgba(204, 204, 204, 1);
    cursor: pointer;
  }
  .tab {
    border-bottom: 1px solid rgba(204, 204, 204, 1);
    display: flex;
    align-items: center;
    user-select: none;
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

<template>
  <div
    v-clickOutSide="close"
    class="geFootbarContainer"
  >
    <div
      class="collapse-menu"
      :style="{transform: rotate}"
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
    <component
      :is="componentId"
      v-if="showFoot"
      style="height:75px;"
    />
  </div>
</template>

<script>
import conponents from './components'
export default {
    components: {...conponents},
    data() {
        return {
            componentId: 'DataSource',
            showFoot:false,
        };
    },
    computed: {
        rotate() {
            return this.showFoot ? `rotateZ(180deg)` : `rotateZ(0)`
        }
    },
    mounted() {
       
    },
    methods: {
        close() {
            this.showFoot = false
        },
        toggle() {
            this.showFoot = !this.showFoot
        }
    }
};
</script>

<style lang="less" scoped>
.geFootbarContainer {
  position: absolute;
  left: 208px;
  right:250px;
  bottom: 0;
  z-index: 100;
  background: #fff;
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

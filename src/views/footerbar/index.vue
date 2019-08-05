<template>
  <div
    class="geFootbarContainer"
    :style="{bottom:bottom+'px'}"
  >
    <div
      class="collapse-menu"
      @click="toggle"
    />
    <ul class="tab">
      <li 
        :class="{active:activeTab === 1}"
        @click="activeTab=1"
      >
        数据源
      </li>
      <li 
        :class="{active:activeTab === 2}"
        @click="activeTab=2"
      >
        数据显示
      </li>
      <li 
        :class="{active:activeTab === 3}"
        @click="activeTab=3"
      >
        状态模型
      </li>
      <p class="clearFix" />
    </ul>
    <div 
      v-show="activeTab === 1"
      class="content" 
    >
      wwww1
    </div>
    <div 
      v-show="activeTab === 2"
      class="content" 
    >
      wwww2
    </div>
    <div 
      v-show="activeTab === 3"
      class="content" 
    >
      wwww3
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            isCollapse: false,
            activeTab: 1,
            bottom: -75
        };
    },
    methods: {
        tabHandler(e) {
            console.log(e.target);
        },
        toggle() {
            this.bottom === 0 ? (this.bottom = -75) : (this.bottom = 0);
        }
    }
};
</script>

<style lang="less" scoped>
.geFootbarContainer {
  width: 100%;
  height: 100px;
  position: absolute;
  bottom: 0;
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

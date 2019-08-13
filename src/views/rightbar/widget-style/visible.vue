<template>
  <div style="height:100%;">
    <p style="margin-bottom: 2px;margin-top:10px;">
      对象
    </p>
    <div class="type-tab-con">
      <div
        class="type-tab"
        :class="{'selected':typeTab==1}"
        style="border-top-left-radius:2px;border-bottom-left-radius:2px;"
        @click="changeTab(1)"
      >
        弹窗
      </div>
      <div
        class="type-tab"
        style="border-top-right-radius:2px;border-bottom-right-radius:2px;"
        :class="{'selected':typeTab==2}"
        @click="changeTab(2)"
      >
        组件
      </div>
    </div>
    <div style="height:100%;">
      <div
        v-show="typeTab==1"
        style="height:60%;"
      >
        <p style="margin-bottom: 2px;margin-top:10px;">
          选择弹窗
        </p>
        <ul class="widget-con">
          <li class="selected">
            弹窗1
          </li>
          <li>弹窗2</li>
          <li>弹窗3</li>
        </ul>
      </div>
      <div
        v-show="typeTab==2"
        style="height:60%;"
      >
        <p style="margin-bottom: 2px;margin-top:10px;">
          选择组件
        </p>
        <ul class="widget-con">
          <li class="selected">
            组件1
          </li>
          <li>组件2</li>
          <li>组件3</li>
        </ul>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:10px;">
        <button
          class="mutual-btn"
          @click="del(typeTab)"
        >
          删除
        </button>
        <button
          class="mutual-btn selected"
          @click="submit(typeTab)"
        >
          提交
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default{
    data() {
        return {
            typeTab:1,
        }
    },
    mounted() {
    },
    methods: {
        changeTab(index) {
            this.typeTab = index
        },
        del(typeTab) {
            console.log(typeTab)
        },
        submit(typeTab) {
            console.log(typeTab)
            this.$emit("submitMutual",1)
        }
    },      
}
</script>

<style scoped lang="less">
.title{
  margin-top:10px;
  display:flex;
  align-items:center;
  margin-left:2px;
}
.type-tab-con{
  display: flex;
  height:26px;
  line-height:23px;
  background:#fff;
  border:1px solid rgba(212,212,212,1);
  border-radius:2px 0px 0px 2px;
  .type-tab{
    flex:1;
    text-align:center;
    &.selected{
      background:rgba(61,145,247,1);
      border:1px solid rgba(39,122,224,1);
      color:#fff;
    }
  }
}
.widget-con{
  height:93%;
  background:rgba(255,255,255,1);
  border:1px solid rgba(212,212,212,1);
  border-radius:2px;
  overflow:auto;
  li{
    height:24px;
    padding:0 4px;
    line-height:24px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    &.selected{
      background:rgba(61,145,247,1);
      border:1px solid rgba(39,122,224,1);
    }
  }
}
</style>

<style lang="less">

</style>

<template>
  <div style="height:100%;">
    <div
      style="height:42%;"
    >
      <p style="margin-bottom: 2px;margin-top:10px;">
        选择组件
      </p>
      <ul class="widget-con">
        <li
          v-for="(item,index) in currentPageWidgets"
          :key="index"
          :class="{'selected':item.selected}"
          @click="checkWidget(item)"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div
      style="height:25%;"
    >
      <p style="margin-bottom: 2px;margin-top:10px;">
        选择状态
      </p>
      <ul
        class="widget-con"
        style="height:84%;"
      >
        <li class="selected">
          默认
        </li>
        <li>状态1</li>
        <li>状态2</li>
      </ul>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:10px;">
      <button
        class="mutual-btn"
        @click="hide()"
      >
        取消
      </button>
      <button
        class="mutual-btn selected"
        @click="submit()"
      >
        提交
      </button>
    </div>
  </div>
</template>

<script>
export default{
    props:['currentPageWidgets','currentEditItem','bindActions'],
    data() {
        return {
        }
    },
    mounted() {
    },
    methods: {
        hide() {
            this.$emit("submitMutual")
        },
        submit() {
            this.$emit("submitMutual")
        },
        checkWidget(item) {
            this.currentWidgetItem = item
            this.currentPageWidgets.forEach(d=>{
                d.selected = false
            })
            item.selected = true
        }
    },      
}
</script>

<style scoped lang="less">
.widget-con{
  height:91%;
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
      color:#fff;
    }
  }
}
</style>

<style lang="less">
 
</style>

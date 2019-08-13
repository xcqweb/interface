<template>
  <div style="height:100%;">
    <div
      style="height:60%;"
    >
      <p style="margin-bottom: 2px;margin-top:10px;">
        选择页面
      </p>
      <ul class="widget-con">
        <li class="selected">
          页面1
        </li>
        <li>页面2</li>
        <li>页面3</li>
      </ul>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:10px;">
      <button
        class="mutual-btn"
        @click="del()"
      >
        删除
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
    data() {
        return {
        }
    },
    mounted() {
    },
    methods: {
        del() {
        },
        submit() {
            this.$emit("submitMutual",1)
        }
    },      
}
</script>

<style scoped lang="less">
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

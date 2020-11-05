<template>
  <div
    id="app"
    :class="langCss"
  >
    <keep-alive>
      <router-view
        v-if="$route.meta.keepAlive"
      />
    </keep-alive>
    <router-view
      v-if="!$route.meta.keepAlive"
    />
  </div>
</template>

<script>  
export default {
  data() {
    return{
      langCss:''
    }
  },
  beforeCreate() {
    let {search} = window.location
    if(search.includes("preview=1")) {
      let split1 = search.split("&")
      let split2 = split1[1].split("=")
      this.$router.push({
        path: window.PREFIX_PATH + "/interface_preview",
        query: {
          id: split2[1]
        }
      })
    }
  },
  mounted() {
    if(this.$i18n.locale == 'zh') {
      this.langCss = ''
      document.title = "组态工具"
    }else{
      this.langCss = this.$i18n.locale
      document.title = "Getech Interface Tool"
    }
    if(this.langCss) {
      document.body.classList.add(this.langCss)
    }
  },
};
</script>

<style scoped lang="less">
 
</style>

<style lang="less">
#app{
  font-size:14px;
  font-family:MicrosoftYaHei;
  position: absolute;
  width:100%;
  height:100%;
}
/* 重置iview弹窗样式 */
.custom-modal {
  .ivu-modal-header {
    padding: 0;
  }
  .ivu-modal-header-inner {
    display: block;
    height: 36px;
    line-height: 36px;
    color: #252525;
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    background: linear-gradient(0deg,#d8d8d8,#e4e3e4);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  .ivu-modal-close {
    position: absolute;
    top: 10px !important;
    width: 16px;
    height: 16px;
    background-image: url('./assets/images/default/closeDialog.png');
    background-size: cover;
    i::before{
      content:''
    }
  }
  .ivu-modal-content {
    background-color: #f5f5f5;
  }
  .ivu-modal {
    top: 0 !important;
    height: 100%;
    overflow: hidden;
  }
  .ivu-modal-content {
    top: 50%;
    transform: translateY(-50%);
  }
  &.no-footer{
    .ivu-modal-footer{
      display: none;
    }
  }
}
</style>

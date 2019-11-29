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
                path: "/interface_preview",
                query: {
                    id: split2[1]
                }
            })
        }
    },
    mounted() {
        if(this.$i18n.locale == 'zh') {
            this.langCss = ''
            document.title = "格创东智界面工具"
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
</style>

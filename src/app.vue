<template>
  <div id="app">
    <!-- <p @click="$i18n.locale === 'en' ? ($i18n.locale='zh') : (($i18n.locale='en'))">切换语言</p> -->
    <!-- <p>{{$t('lang')}}</p> -->
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

    },
};
</script>

<style scoped lang="less">
 
</style>

<style lang="less">
#app{
  font-size:14px;
  font-family:MicrosoftYaHei;
  position: relative;
  height:100%;
}
</style>

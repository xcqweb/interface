<template>
  <div id="app">
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
        console.log(search)
        if(search.includes("preview=1")) {
            let split1 = search.split("&")
            let split2 = split1[1].split("=")
            this.$router.push({
                path: "/preview",
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

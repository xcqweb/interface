<template>
  <div style="height:100%;">
    <div
      v-show="!isEdit"
      style="padding:0 4px;"
    >
      <div
        class="title"
        @click="addEvents"
      >
        <img src="../../../assets/images/rightsidebar/plus_ic.png"> 添加点击事件
      </div>
      <div class="event-item">
        <div style="width:20px;">
          1
        </div>
        <div style="flex:1;">
          <div>事件类型-跳转</div>
          <div>页面2</div>
        </div>
        <div style="display:flex;align-items:flex-end;">
          <img src="../../../assets/images/rightsidebar/dele_ic.png">
        </div>
      </div>
    </div>
    <div
      v-show="isEdit"
      style="padding:10px 4px;height:100%;"
    >
      <p style="margin-bottom: 2px;">
        类型
      </p>
      <div class="type-tab-con">
        <div
          class="type-tab"
          :class="{'selected':typeTab==1}"
          style="border-top-left-radius:2px;border-bottom-left-radius:2px;"
          @click="changeTab(1)"
        >
          跳转
        </div>
        <div
          class="type-tab"
          :class="{'selected':typeTab==2}"
          @click="changeTab(2)"
        >
          显/隐
        </div>
        <div
          class="type-tab"
          style="border-top-right-radius:2px;border-bottom-right-radius:2px;"
          :class="{'selected':typeTab==3}"
          @click="changeTab(3)"
        >
          切换
        </div>
      </div>
      <LinkTo
        v-show="typeTab===1"
        @submitMutual="editEventDone"
      />
      <Visible
        v-show="typeTab===2"
        @submitMutual="editEventDone"
      />
      <Change
        v-show="typeTab===3"
        @submitMutual="editEventDone"
      />
    </div>
  </div>
</template>

<script>
import LinkTo from './LinkTo'
import Visible from './Visible'
import Change from './Change'
export default{
    components:{LinkTo,Visible,Change},
    data() {
        return {
            isEdit:false,
            typeTab:1,
        }
    },
    mounted() {
    },
    methods: {
        addEvents() {
            this.isEdit = true
        },
        changeTab(index) {
            this.typeTab = index
        },
        editEventDone() {
            this.isEdit = false
        }
    },      
}
</script>

<style scoped lang="less">
.title{
  margin-top:10px;
  display:flex;
  align-items:center;
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
.event-item{
  margin-top:10px;
  display:flex;
  padding:4px;
  border:1px solid rgba(212,212,212,1);
  border-radius:2px;
}
</style>

<style lang="less">
  
</style>

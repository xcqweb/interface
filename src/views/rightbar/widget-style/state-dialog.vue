<template>
  <div class="state-dialog-el-con">
    <div
      class="background"
    />
    <div
      class="geDialog"
      style="width:640px; left:calc(50% - 320px);top:20%; z-index: 10005;"
    >
      <p
        class="geDialogTitle"
        @click="hideState"
      >
        {{ $t("rightBar.addState") }}
      </p>
      <div
        class="geDialogInfo"
        style="overflow-y: auto;"
      >
        <div style="display:flex; padding:14px 16px 0;">
          <div style="flex:3">
            <div class="state-con">
              <div
                v-if="picList.includes(shapeName)"
                class="image"
                :class="animateCls"
              />
              <div
                v-if="!picList.includes(shapeName)"
                class="text"
                :class="animateCls"
              >
                {{ $t("text") }}
              </div>
            </div>
            <i-checkbox
              v-model="animateCheck"
              style="width:100%;text-align:center;margin-top:8px;"
              @on-change="changeAnimate"
            >
              {{ $t("rightBar.attachBlink") }}
            </i-checkbox>
          </div>
          <div
            style="flex:5"
            class="state-desc"
          >
            <div style="text-align:left;">
              <p>{{ $t('rightBar.stateName') }}</p>
              <input v-model="stateName">
              <p style="margin-top:10px;">
                {{ $t("describe") }}
              </p>
              <textarea v-model="stateDesc" />
            </div>
          </div>
          <div
            style="flex:5"
            class="style-container"
          >
            <div class="type-tab-con">
              <div
                v-if="picList.includes(shapeName)"
                class="type-tab"
                style="border-top-right-radius:2px;border-bottom-right-radius:2px;"
                :class="{'selected':typeTab==4}"
                @click="changeTab(4)"
              >
                {{ $t("image") }}
              </div>
              <div
                v-if="!picList.includes(shapeName)"
                class="type-tab"
                :class="{'selected':typeTab==1}"
                style="border-top-left-radius:2px;border-bottom-left-radius:2px;"
                @click="changeTab(1)"
              >
                {{ $t("fill") }}
              </div>
              <div
                class="type-tab"
                :class="{'selected':typeTab==2}"
                @click="changeTab(2)"
              >
                {{ $t("border") }}
              </div>
              <div
                v-if="!picList.includes(shapeName)"
                class="type-tab"
                style="border-top-right-radius:2px;border-bottom-right-radius:2px;"
                :class="{'selected':typeTab==3}"
                @click="changeTab(3)"
              >
                {{ $t("text") }}
              </div>
            </div>
            <div
              v-show="typeTab!=4"
              class="state-color-con"
            />
            <div
              v-if="typeTab == 4"
              class="image-con"
              @click="setPic"
            >
              <div
                style="text-align:center;"
                :style="bgPicStyle"
              >
                <img
                  :src="bgPic"
                  :style="bgPicStyle"
                  style="width:100%;"
                >
                <div v-show="isShowBgText">
                  {{ $t('choosePic') }}
                </div>
                <input
                  ref="chooseImg"
                  style="display:none;"
                  type="file"
                  @change="fileChange"
                >
              </div>
            </div>
          </div>
        </div>
        <div
          class="btnContent"
          style="padding-bottom: 16px;padding-right: 16px;"
        >
          <button
            class="geBtn"
            style="margin-right:50px;"
            @click="hideState"
          >
            {{ $t('cancel') }}
          </button><button
            class="geBtn gePrimaryBtn"
            @click="submitState"
          >
            {{ $t('submit') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ColorDialog} from '../../../services/editor/Dialogs'
import {tipDialog} from '../../../services/Utils'
let style = {'background':'#ffffff','borderColor':'#000000','color':'#000000'},inputs
let tabArr = ['background','borderColor','color'],editStateTemp,localImage
export default{
  props:['editState'],
  data() {
    return {
      stateName:"",
      stateDesc:"",
      typeTab:1,
      animateCls:'',
      animateCheck:false,
      shapeName:'',
      picList:['image','userimage'],
      bgPic:require('../../../assets/images/rightsidebar/bg_ic_widget.png'),
      isShowBgText:true,
      bgPicStyle:{height:'auto'}
    }
  },
  mounted() {
    style = {'background':'#ffffff','borderColor':'#000000','color':'#000000'}
    const component = this.$mount()
    document.querySelector('body').appendChild(component.$el)
    this.shapeName = this.$store.state.main.widgetInfo.shapeInfo.shape
    if (this.picList.includes(this.shapeName)) {
      style.borderColor = "none"
      style.background = 'transparent'
      this.typeTab = 4
    }
    if(this.editState) {
      editStateTemp = JSON.parse(JSON.stringify(this.editState))//深拷贝 
      this.stateName = editStateTemp.name
      this.animateCls = editStateTemp.animateCls
      this.animateCheck = this.animateCls != ''
      this.stateDesc = editStateTemp.desc
      if(this.stateDesc == `${this.$t("noDescribe")}`) {
        this.stateDesc = ''
      }
      style = editStateTemp.style
      if(editStateTemp.imgInfo) {
        this.setBg(editStateTemp.imgInfo.url)
      }
    }else{
      let graph = this.myEditorUi.editor.graph
      let states = this.$parent.getStates(graph)
      let index = states.length
      this.stateName = `${this.$t("state")}${index}`
    }
    this.$nextTick(()=>{
      let dlg = new ColorDialog(this.myEditorUi,style.background, null,null,false)
      let el = document.querySelector(".state-color-con")
      if(el) {
        el.appendChild(dlg.container)
        inputs = $(".state-color-con").find("input")
        let defaultColorEls =  $(".state-color-con").find('center')
        let changeStyleDeal = (value)=>{
          style[tabArr[this.typeTab - 1]] = value
          $(inputs[1]).val(value)
          $(inputs[0]).css('background',value)
        }
        defaultColorEls.on("click","li",(event)=>{
          let target = $(event.target)
          changeStyleDeal(target.css('background-color'))
        })
        $(inputs[1]).change((e)=>{
          changeStyleDeal(e.target.value)
        })
      }
    })
  },  
  methods: {
    changeTab(index) {
      this.typeTab = index
      if(index != 4) {
        let value = style[tabArr[this.typeTab - 1]]
        $(inputs[1]).val(value)
        $(inputs[0]).css('background',value)
      }
    },
    hideState() {
      this.$emit("closeStateDialog")
    },
    submitState() {
      let data = {
        name:this.stateName,
        desc:this.stateDesc,
        style:Object.assign({},style),
        animateCls:this.animateCls,
      }
      if(editStateTemp) {
        data = Object.assign(editStateTemp,data)
      }
      if(localImage) {
        let formData = new FormData()
        formData.append('file', localImage)
        formData.append('materialLibraryId',"");
        this.myEditorUi.editor.uploadFile(this.myEditorUi, `${this.urls.materialRightList.url}`, 'POST', formData, (res)=> {
          data.imgInfo = {
            url:`getechFileSystem/${res.picPath}`,
            width:res.picWidth,
            height:res.picHeight
          }
          this.$emit("closeStateDialog",data)
        })
      }else{
        this.$emit("closeStateDialog",data)
      }
      localImage = null
      editStateTemp = null//置空，防止下次编辑时候干扰列表信息
    },
    changeAnimate(status) {
      if(status) {
        this.animateCls = 'animate-blink'
      }else{
        this.animateCls = ''
      }
    },
    setPic() {
      this.$refs.chooseImg.click()
    },
    fileChange(e) {
      if(e.target.files && e.target.files.length) {
        if (e.target.files[0].size >= 2 * 1024 * 1024) {
          tipDialog(this.myEditorUi,`${this.$t('rightBar.bgPicNotOver2M')}`)
          return false
        }
        // 预览图片
        let reader = new FileReader()
        localImage = e.target.files[0]
        reader.readAsDataURL(localImage)
        reader.onload = evt => this.setBg(evt.target.result)
      }
    },
    setBg(url) {
      url = url.replace(/getechFileSystem\//, window.fileSystem)
      this.bgPic = url
      this.bgPicStyle = {height:'98px'}
      this.isShowBgText = false
    },
  },      
}
</script>

<style scoped lang="less">
.state-dialog-el-con{
  height:100%;
}
.state-con{
  height:80px;
  display:flex;
  justify-content:center;
  align-items:center;
  border:1px solid rgba(218,218,218,1);
  opacity:0.98;
  border-radius:2px;
  .text{
    height:56px;
    width:56px;
    line-height:56px;
    text-align:center;
    background:rgba(236,239,244,1);
    border:1px solid rgba(125,125,125,1);
  }
  .image{
    height:56px;
    width:56px;
    background:url('../../../assets/images/menu/rightBar/bg_ic2x.png') no-repeat center center;
    background-size:contain;
  }
}
.image-con{
  width:100%;
  height:98px;
  margin-top:6px;
  border-radius: 2px;
  display:flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dadada;
}
.state-desc{
  height:235px;
  border:1px solid rgba(225,225,225,1);
  border-radius:2px;
  text-align:center;
  padding:10px;
  margin:0 10px;
  input{
    height:24px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(212,212,212,1);
    border-radius:2px;
    width:100%;
  }
  textarea{
    width: 100%;
    height:78px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(212,212,212,1);
    border-radius:2px;
    resize:none;
  }
}
.style-container{
  height:235px;
  border:1px solid rgba(225,225,225,1);
  border-radius:2px;
  padding:10px;
  .type-tab-con{
    display: flex;
    height:26px;
    line-height:23px;
    background:#fff;
    border:1px solid rgba(212,212,212,1);
    border-radius:2px 0px 0px 2px;
    .type-tab{
      cursor: pointer;
      flex:1;
      text-align:center;
      &.selected{
        background:rgba(61,145,247,1);
        border:1px solid rgba(39,122,224,1);
        color:#fff;
      }
    }
  }
}
</style>

<style lang="less">
  
</style>

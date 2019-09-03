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
        添加状态
      </p>
      <div
        class="geDialogInfo"
        style="overflow-y: auto;"
      >
        <div style="display:flex; padding:14px 16px 0;">
          <div style="flex:3">
            <div class="state-con">
              <div
                v-if="shapeName!='image'"
                class="text"
                :class="animateCls"
              >
                文本
              </div>
              <div
                v-if="shapeName=='image'"
                class="image"
                :class="animateCls"
              />
            </div>
            <i-checkbox
              v-model="animateCheck"
              style="width:100%;text-align:center;margin-top:8px;"
              @on-change="changeAnimate"
            >
              触发时闪烁
            </i-checkbox>
          </div>
          <div
            style="flex:5"
            class="state-desc"
          >
            <div style="text-align:left;">
              <p>状态名称</p>
              <input v-model="stateName">
              <p style="margin-top:10px;">
                描述
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
                图片
              </div>
              <div
                v-if="!picList.includes(shapeName)"
                class="type-tab"
                :class="{'selected':typeTab==1}"
                style="border-top-left-radius:2px;border-bottom-left-radius:2px;"
                @click="changeTab(1)"
              >
                填充
              </div>
              <div
                class="type-tab"
                :class="{'selected':typeTab==2}"
                @click="changeTab(2)"
              >
                边框
              </div>
              <div
                v-if="!picList.includes(shapeName)"
                class="type-tab"
                style="border-top-right-radius:2px;border-bottom-right-radius:2px;"
                :class="{'selected':typeTab==3}"
                @click="changeTab(3)"
              >
                文本
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
              <div style="text-align:center;">
                <img
                  :src="bgPic"
                  :style="bgPicStyle"
                  style="width:100%;"
                >
                <div v-show="isShowBgText">
                  选择图片
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
            @click="hideState"
          >
            取消
          </button><button
            class="geBtn gePrimaryBtn"
            @click="submitState"
          >
            提交
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
            picList:['image','light'],
            bgPic:require('../../../assets/images/rightsidebar/bg_ic_widget.png'),
            isShowBgText:true,
            bgPicStyle:{height:'auto'}
        }
    },
    mounted() {
        const component = this.$mount();
        document.querySelector('body').appendChild(component.$el)
        this.shapeName = this.$store.state.main.widgetInfo.shapeInfo.shape
        if (this.shapeName == 'image') {
            this.typeTab = 4
        }
        if(this.editState) {
            editStateTemp = JSON.parse(JSON.stringify(this.editState))//深拷贝 
            this.stateName = editStateTemp.name
            this.animateCls = editStateTemp.animateCls
            this.animateCheck = this.animateCls != ''
            this.stateDesc = editStateTemp.desc
            if(this.stateDesc == '暂无描述') {
                this.stateDesc = ''
            }
            style = editStateTemp.style
        }else{
            let graph = this.myEditorUi.editor.graph
            let states = this.$parent.getStates(graph)
            let index = states.length
            this.stateName = `状态${index}`
        }
        this.$nextTick(()=>{
            let dlg = new ColorDialog(this.myEditorUi,style.background, null,null,false)
            let el = document.querySelector(".state-color-con")
            if(el) {
                el.appendChild(dlg.container)
                setTimeout(()=>{
                    inputs = $(".state-color-con").find("input")
                    $(inputs[1]).change((e)=>{
                        let {value} = e.target
                        style[tabArr[this.typeTab - 1]] = value
                        $(inputs[1]).val(value)
                        $(inputs[0]).css('background',value)
                    })
                },1000)
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
                data.id = editStateTemp.id
            }
            if(localImage) {
                let formData = new FormData()
                formData.append('file', localImage)
                formData.append('materialLibraryId',"");
                this.myEditorUi.editor.uploadFile(this.myEditorUi, this.urls.materialRightList.url, 'POST', formData, (res)=> {
                    data.imgInfo = {
                        url:res.picUrl,
                        width:res.picWidth,
                        height:res.picHeight
                    }
                    this.$emit("closeStateDialog",data)
                })
            }else{
                this.$emit("closeStateDialog",data)
            }
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
                    tipDialog(this.myEditorUi,`背景图片大小不得超过2M`)
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
            this.bgPic = url
            this.bgPicStyle = {height:'94px'}
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
    background:url('../../../assets/images/menu/rightbar/bg_ic2x.png') no-repeat center center;
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

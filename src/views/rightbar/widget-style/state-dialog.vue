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
                class="text"
                :class="animateCls"
              >
                文本
              </div>
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
                class="type-tab"
                style="border-top-right-radius:2px;border-bottom-right-radius:2px;"
                :class="{'selected':typeTab==3}"
                @click="changeTab(3)"
              >
                文本
              </div>
            </div>
            <div class="state-color-con" />
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
let style = {'background':'#ffffff','borderColor':'#000000','color':'#000000'},inputs
let tabArr = ['background','borderColor','color'],editStateTemp
export default{
    props:['editState'],
    data() {
        return {
            stateName:"",
            stateDesc:"",
            typeTab:1,
            animateCls:'',
            animateCheck:false,
        }
    },
    mounted() {
        const component = this.$mount();
        document.querySelector('body').appendChild(component.$el)
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
            document.querySelector(".state-color-con").appendChild(dlg.container)
            setTimeout(()=>{
                inputs = $(".state-color-con").find("input")
                $(inputs[1]).change((e)=>{
                    let {value} = e.target
                    style[tabArr[this.typeTab - 1]] = value
                    $(inputs[1]).val(value)
                    $(inputs[0]).css('background',value)
                })
            },1000)
        })
    },  
    methods: {
        changeTab(index) {
            this.typeTab = index
            let value = style[tabArr[this.typeTab - 1]]
            $(inputs[1]).val(value)
            $(inputs[0]).css('background',value)
        },
        hideState() {
            this.$emit("closeStateDialog")
        },
        submitState() {
            let data = {
                name:this.stateName,
                desc:this.stateDesc,
                style:style,
                animateCls:this.animateCls,
            }
            if(editStateTemp) {
                data.id = editStateTemp.id
            }
            this.$emit("closeStateDialog",data)
            editStateTemp = null//置空，防止下次编辑时候干扰列表信息
        },
        changeAnimate(status) {
            if(status) {
                this.animateCls = 'animate-blink'
            }else{
                this.animateCls = ''
            }
        }
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
    margin: 0 2px;
    width: calc(100% - 9px);
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

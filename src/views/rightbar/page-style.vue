<template>
  <div
    class="page-cls"
  >
    <p style="text-align:center;margin:10px;font-size:14px;">
      {{ $t('page') }}{{ $t('style') }}
    </p>
    <p style="margin-top:10px;">
      {{ $t('page') }}{{ $t('describe') }}
    </p>
    <textarea
      v-model="pageDesc"
      maxlength="50"
      rows="3"
    />
    <div class="item-title">
      {{ $t('page') }}{{ $t('size') }}
    </div>
    <div style="display:flex;">
      <div
        class="item-container solidWidth"
      >
        <span style="color:#797979;margin-right:6px;">{{ $t('width') }}</span>
        <input
          v-model="solidWidth"
          disabled
        >
      </div>
      <div
        class="item-container"
        style="margin-left:10px;"
      >
        <span style="color:#797979;margin-right:6px;">{{ $t('height') }}</span>
        <input
          v-model="solidHeight"
          v-number="0"
          @keyup.enter="changeScaleInput"
          @blur="changeScaleInput"
        >
      </div>
    </div>
    <div
      class="item-title"
    >
      {{ $t('rightBar.bgColor') }}
    </div>
    <div
      class="item-container"
      style="position:relative;margin-bottom:4px;"
      :style="{background:bgColor}"
      @click="pickColor"
    />
    <div
      class="item-container setBackgroundImg"
      style="height:98px;position:relative;padding:0;margin-top:6px;justify-content:center;"
      ondragstart="return false;"
      @click="setBackgroundImg"
    >
      <div
        :style="bgPicStyle"
      >
        <img
          :src="bgPic"
          :style="bgPicStyle"
          style="width:100%;"
        >
        <div v-show="isShowBgText">
          {{ $t('choose') }}{{ $t('rightBar.bgImage') }}
        </div>
        <input
          ref="chooseImg"
          style="display:none;"
          type="file"
          accept="image/jpg,image/png,image/jpeg,image/gif,image/svg"
          @change="fileChange"
        >
      </div>
      <span 
        v-if="deleteShowFlag"
        class="delete-icon-top"
        style="position:absolute;right:0;top:0;width:20px;height:20px;display:block"
        @click.stop.prevent="deleteBgImgHandle"
      />
    </div>
  </div>
</template>
<script>
import {mxClient,Dialog} from '../../services/mxGlobal'
import {tipDialog, sureDialog} from '../../services/Utils'
let localImage
export default {
    data() {
        return {
            pageDesc:"",
            solidHeight: 768,
            solidWidth: 1366,
            bgColor:'#fff',
            bgPic:require('../../assets/images/rightsidebar/bg_ic_widget.png'),
            isShowBgText:true,
            bgPicStyle:{height:'auto'},
            deleteShowFlag: false
        }
    },
    created() {
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let editor = this.myEditorUi.editor
            let graph = editor.graph
            this.bgColor = graph.background
            let pageStyle = editor.pages[editor.currentPage].style
            if(pageStyle) {
                let bgUrl = editor.pages[editor.currentPage].style.backgroundUrl
                if(bgUrl && bgUrl !== 'none') {
                    this.changeBg(bgUrl)
                }else{
                    mxClient.IS_ADD_IMG = false
                }
            }else {
                mxClient.IS_ADD_IMG = false
            }
            let {width,height} = graph.pageFormat
            this.solidWidth = width
            this.solidHeight = height
            this.myEditorUi.setPageFormat({height:height,width:width,x:0,Y:0},true)
        },
        centerCanvas() {//居中画布
            let graph = this.myEditorUi.editor.graph
            this.$nextTick(()=>{
                graph.center(true,true,0.5,0.5)
            })
        },
        changeScaleInput() {
            this.myEditorUi.setPageFormat(
                {
                    height: this.solidHeight,
                    width: this.solidWidth,
                    x: 0,
                    y: 0
                },
                true
            )
            this.centerCanvas()
        },
        setBackgroundImg() {
            this.$refs.chooseImg.click()
        },
        deleteBgImgHandle() {
            sureDialog(this.myEditorUi,`${this.$t('rightBar.sureDelBgPic')}`,()=>{
                let editor = this.myEditorUi.editor
                editor.pages[editor.currentPage].style.backgroundUrl = ''
                this.bgPic = require('../../assets/images/rightsidebar/bg_ic_widget.png');
                mxClient.IS_ADD_IMG = false
                this.isShowBgText = true
                this.bgPicStyle = {height:'auto'}
                this.deleteShowFlag = false
                this.myEditorUi.editor.graph.view.validateBackground()
            },)
        },
        changeBg(url) {
            url = url.replace(/getechFileSystem\//, window.fileSystem)
            mxClient.IS_ADD_IMG = true
            mxClient.IS_ADD_IMG_SRC = url
            this.bgPic = url
            // 添加删除按钮
            if (this.bgPic) {
                this.deleteShowFlag = true
                this.isShowBgText = false
                this.bgPicStyle = {height:'98px'}
            }            
            this.myEditorUi.editor.graph.view.validateBackground()
        },
        setBg(url) {
            this.changeBg(url)
            let editor = this.myEditorUi.editor
            //上传背景图片

            let formData = new FormData()
            formData.append('file', localImage)
            formData.append('materialLibraryId',"");
            this.myEditorUi.editor.uploadFile(this.myEditorUi, this.urls.materialRightList.url, 'POST', formData, function(res) {
                let pageStyle = editor.pages[editor.currentPage].style
                if(!pageStyle) {
                    editor.pages[editor.currentPage].style = { }
                }
                editor.pages[editor.currentPage].style.backgroundUrl = `getechFileSystem/${res.picPath}`
                this.myEditorUi.graph.setBackgroundImage(`getechFileSystem/${res.picPath}`)
            })
        },
        fileChange(e) {
            if(e.target.files && e.target.files.length) {
                let file = e.target.files[0]
                if (file.size >= 5 * 1024 * 1024) {
                    tipDialog(this.myEditorUi,`${this.$t('rightBar.bgPicNotOver5M')}`)
                    return
                }
                let  fileTypes = ['jpg','png','jpeg','gif','bmp','svg']
                let typeFlag = false
                for(let i = 0;i < fileTypes.length;i++) {
                    if(file.type.includes(fileTypes[i])) {
                        typeFlag = true
                        break
                    }
                }
                if(!typeFlag) {
                    tipDialog(this.myEditorUi,`${this.$t('rightBar.pleaseChoosePic')}`)
                    return
                }
                
                // 预览图片
                let reader = new FileReader()
                localImage = e.target.files[0]
                reader.readAsDataURL(localImage)
                reader.onload = evt => this.setBg(evt.target.result)
            }
        },
        pickColor() {
            this.myEditorUi.pickColor(this.bgColor || 'none',color=>{
                this.updateBackgroundColor(color)
            });
        },
        updateBackgroundColor(color)  {
            if(color == 'none') {

                this.bgColor = `url(${Dialog.prototype.noColorImage})`
            }else{
                this.bgColor = color
            }
            this.myEditorUi.setBackgroundColor(this.bgColor)
        },
    }
};
</script>

<style lang="less" scoped>
.page-cls {
    padding:0 4px;
    textarea{
        resize:none;
        border:1px solid rgba(212,212,212,1);
        border-radius:2px;width:100%;
    }
    input{
        outline: none;
        border:none;
        width:100%;
    }
    li{
        padding:3px 6px;
    }
    li:hover{
        background:#3D91F7;
        color:#fff;
    }
    .scale-dialog{
        position:absolute;
        left:0;
        top:24px;
        z-index:22;
        background:#f5f5f5;
        width:100%;
        padding:6px 0;
        border:1px solid rgba(204,204,204,1);
        box-shadow:0px 3px 8px 0px rgba(0, 0, 0, 0.2);
        opacity:0.98;
        border-radius:0px 0px 2px 2px;
    }
    .item-title{
        border-top:solid 1px #ccc;
        padding-top:6px;
        margin-top:6px;
    }
    .item-container{
        width:100%;
        height:24px;
        display: flex;
        align-items:center;
        background:rgba(255,255,255,1);
        border:1px solid rgba(212,212,212,1);
        border-radius:2px;
        font-weight:400;
        color:rgba(37,37,37,1);
        padding:0 6px;
        .delete-icon-top{
          background:url('../../assets/images/rightsidebar/deletepic_ic.png') no-repeat center center;
          background-size:16px 16px;
        }
    }
    .solidWidth {
        background: #f2f2f2;
        input {
            background: #f2f2f2;
            color: #797979;
        }
    }
    .setBackgroundImg {
        cursor: pointer;
    }
    .color-dialog{
        position:absolute;
        left:0;
        top:24px;
        border:solid 1px red;
    }
}
</style>

<template>
  <div class="materialroom">
    <Modal
      v-model="showmarerial"
      width="720px"
      class="left-sidebar-model"
      :title="materialAlertName"
      @on-cancel="cancel"
    >
      <div class="materialtabs">
        <Tabs
          type="card"
          :animated="false"
        >
          <TabPane 
            label="组件库"
          >
            <div class="assembly-wrapper commom-wrapper">
              <div class="assembly-left materialtabs-left">
                <div class="assembly-seach-wrapper">
                  <input 
                    type="text" 
                    placeholder="搜索组件名称" 
                    class="assembly-seach-icon"
                  >
                  <div
                    class="addassembly"
                    @click="addassemblyFn"
                  >
                    新增组件库
                  </div>
                  <ul
                    v-for="(item,index) in assemblyArrayName"
                    :key="index"
                    class="assembly-list"
                  >
                    <li
                      class="assembly-icon"
                      :class="index === isactive ? 'left-side-listactive' : ''"
                      @click="selectAssemblyList(index)"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="assembly-right materialtabs-right">
                <!-- <ul
                  v-show="isactive === 0"
                  id="baseAssemblyList"
                  class="assembly-right-wrapper"
                />
                <ul
                  v-show="isactive === 1"
                  id="tableAssemblyList"
                  class="assembly-right-wrapper"
                /> -->
              </div>
            </div>
          </TabPane>
          <TabPane
            label="模版库" 
          >
            <div class="material-wrapper commom-wrapper">
              <div class="material-left materialtabs-left">
                <ul
                  v-for="(item,index) in materialArrayName"
                  :key="index"
                  class="material-list"
                >
                  <li
                    v-if="index === 0"
                    class="material-icon left-page-icon"
                    :class="index === isactive2 ? 'left-side-listactive' : ''"
                    @click="selectMaterialList(0)"
                  >
                    {{ item }}
                  </li>
                  <li 
                    v-if="index === 1"
                    class="material-icon left-alert-icon"
                    :class="index === isactive2 ? 'left-side-listactive' : ''"
                    @click="selectMaterialList(1)"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div class="material-right materialtabs-right">
                <ul 
                  v-if="isactive2 === 0"
                  class="material-right-wrapper"
                >
                  <li>
                    <div>
                      <span />
                    </div>
                    <span>
                      页面模版1
                    </span>
                  </li>
                  <li>
                    <div>
                      <span />
                    </div>
                    <span>
                      页面模版1
                    </span>
                  </li>
                </ul>
                <ul 
                  v-if="isactive2 === 1"
                  class="material-right-wrapper"
                >
                  <li>
                    <div>
                      <span />
                    </div>
                    <span>
                      弹窗模版1
                    </span>
                  </li>
                  <li>
                    <div>
                      <span />
                    </div>
                    <span>
                      弹窗模版2
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  </div>
</template>
<script>
import {Tabs,TabPane,Modal} from 'iview'
const DIR_ = `../../../static/stencils/`;
export default {
    components: {
        Tabs,
        TabPane,
        Modal
    },
    data() {
        return {
            materialAlertName: '素材库',
            showmarerial: true,
            oktext: '添加在页面',
            assemblyArrayName: ['基本组件', '图表组件', 'layout组件', '自定义组件'],
            materialArrayName: ['页面模版', '弹窗模版'],
            baseAssembly: {
                'rectangle': '矩形',
                'button': '按钮',
                'menulist': '菜单',
                'multipleCheck': '复选框',
                'singleCheck': '单选',
                'image': '图片',
                'select': '下拉列表',
                'table': '表格',
                'primitive': '图元',
                'endarrow': '箭头',
                'line': '直线',
                'curve': '曲线',
                'linkTag': 'Link',
                'text': '文字',
                'light': '指示灯',
                'progress': '进度条',
                'pipeline1': '管道1',
                'pipeline2': '管道2'
            },
            tablesAssembly: {
                'trendchart': '趋势图',
                'dashboard': '仪表盘'
            },
            isactive: 0,
            isactive2: 0,
            renderIndex: 0,
            // html1: '',
            // html2: '',
        }
    },
    mounted() {
        const commonAssemblyListEl = document.querySelector('.assembly-right');
        let arrList = this.baseAssembly
        let html1 = ''
        html1 += `<ul class="assembly-right-wrapper">`
        for(var key in arrList) {
            html1 += `<li><div><span style="background:url(${DIR_}basic/${key}.png) no-repeat center center; background-size:30px 30px;"></span></div><span>${arrList[key]}</span></li>`
        }
        html1 += `</ul>`
        commonAssemblyListEl.innerHTML = html1
    },
    methods: {
        cancel() {
            this.$emit('triggerCancel')
        },
        selectAssemblyList(index) {
            if (this.renderIndex != index) {
                let commonAssemblyListEl = document.querySelector('.assembly-right');
                let arrListTables = index === 0 ? this.baseAssembly : (index === 1 ? this.tablesAssembly : [])
                let html2 = ''
                let pathbase = ''
                this.isactive = index
                this.renderIndex = index
                commonAssemblyListEl.innerHTML = ''
                if (index === 0) {
                    pathbase = `basic`
                } else {
                    pathbase = `tables`
                }
                html2 += `<ul class="assembly-right-wrapper">`
                for(var key2 in arrListTables) {
                    html2 += `<li><div><span style="background:url(${DIR_}${pathbase}/${key2}.png) no-repeat center center; background-size:30px 30px;"></span></div><span>${arrListTables[key2]}</span></li>`
                }
                html2 += `</ul>`
                commonAssemblyListEl.innerHTML = html2
            }
        },
        selectMaterialList(index) {
            this.isactive2 = index
        },
        addassemblyFn() {
            // 新增
            // this.assemblyArrayName
            let num = this.assemblyArrayName.length - 3
            let name = `新建组件库${num}`
            this.assemblyArrayName.push(name)
        }
    }
    
}
</script>
<style lang="less" scoped>
    .left-sidebar-model{
        /deep/.ivu-modal{
            // top: 0px;
            // transform: translateY(-50%);
            // top:50%;
            /deep/.ivu-modal-content{
                width:600px;
                background-color:#f5f5f5 !important;
                .ivu-modal-header{
                    height: 36px;
                    padding:0;
                    /deep/.ivu-modal-header-inner{
                        text-align: center;
                        height: 36px;
                        line-height: 36px;
                        color:#252525;
                        font-size: 12px;
                        background: linear-gradient(0deg,#d8d8d8,#e4e3e4);
                        font-weight: normal;
                        border-top-left-radius: 6px;
                        border-top-right-radius: 6px;
                    }
                }
                .ivu-modal-body{
                    padding: 0;
                    .materialtabs{
                        .ivu-tabs {
                            padding:0px;
                            height: 300px;
                            display:flex;
                            flex-direction:column;
                            .ivu-tabs-bar{
                                height: 38px;
                                background: #d8d8d8;
                                margin-bottom:0px;
                                .ivu-tabs-nav-container{
                                    padding-left:30px;
                                    .ivu-tabs-nav{
                                        height: 24px;
                                        .ivu-tabs-ink-bar{
                                            display:none;
                                        }
                                        .ivu-tabs-tab{
                                            height: 24px;
                                            line-height: 24px;
                                            font-size: 12px;
                                            text-align: center;
                                            background: #fff;
                                            border:none;
                                            margin-right:0;
                                            border-radius: 0;
                                            padding:0;
                                            width:80px;
                                            &.ivu-tabs-tab-active{
                                                background: #3D91F7;
                                                color:#fff;
                                            }
                                        }
                                    }
                                    
                                }
                            }
                            .ivu-tabs-content{
                                flex:1;
                                .ivu-tabs-tabpane{
                                    height:100%;
                                    .commom-wrapper{
                                        display: flex;
                                        height: 100%;
                                        .materialtabs-left{
                                            width:150px;
                                            box-sizing: border-box;
                                            border-right:1px solid #ccc;
                                            padding:2px 5px;
                                            .assembly-seach-wrapper{
                                                box-sizing: border-box;
                                                .assembly-seach-icon{
                                                    padding:0 16px 0 5px;
                                                    width:100%;
                                                    font-size: 12px;
                                                    box-sizing: border-box;
                                                    border:1px solid #d4d4d4;
                                                    border-radius: 2px;
                                                    background: #fff url("../../assets/images/material/searchicon.png") no-repeat right center;
                                                    background-size:16px 16px;
                                                }
                                                .addassembly{
                                                    width:100%;
                                                    height: 24px;
                                                    background: url(../../assets/images/leftsidebar/addpage.png) no-repeat left center;
                                                    background-size: 16px 16px;
                                                    padding-left:18px;
                                                    line-height: 24px;
                                                    font-size: 11px;
                                                    color:#797979;
                                                }
                                                .assembly-list{
                                                    .assembly-icon{
                                                        width:100%;
                                                        height: 24px;
                                                        background: url(../../assets/images/material/subassembly2_ic.png) no-repeat left center;
                                                        background-size: 16px 16px;
                                                        padding-left:18px;
                                                        line-height: 24px;
                                                        font-size: 12px;
                                                        color:#252525;
                                                        &.left-side-listactive{
                                                            background-color: #277AE0;
                                                            color:#fff;
                                                        }
                                                    }
                                                }
                                            }
                                            .material-list {
                                                &>li{
                                                    &.material-icon{
                                                        width:100%;
                                                        height: 24px;
                                                        padding-left:18px;
                                                        line-height: 24px;
                                                        font-size: 12px;
                                                        color:#252525;
                                                        &.left-page-icon {
                                                            background: url(../../assets/images/material/page1_ic.png) no-repeat left center;
                                                            background-size: 16px 16px;
                                                        }
                                                        &.left-alert-icon {
                                                            background: url(../../assets/images/material/popup2_ic.png) no-repeat left center;
                                                            background-size: 16px 16px;
                                                        }
                                                        &.left-side-listactive{
                                                            background-color: #277AE0;
                                                            color:#fff;
                                                        }
                                                    }
                                                }
                                            }
                                            
                                        }
                                        .materialtabs-right{
                                            flex:1;
                                            padding:4px 2px 2px;
                                            .assembly-right-wrapper{
                                                display: flex;
                                                flex-wrap:wrap;
                                                &>li{
                                                    width:60px;
                                                    height:80px;
                                                    margin-right:2px;
                                                    // border:1px solid #E1E1E1;
                                                    // display: flex;
                                                    // justify-content: center;
                                                    // align-items: center;
                                                    &>div{
                                                        width:60px;
                                                        height: 60px;
                                                        border:1px solid #E1E1E1;
                                                        display: flex;
                                                        justify-content: center;
                                                        align-items: center; 
                                                        &>span{
                                                            display: block;
                                                            width:36px;
                                                            height: 36px;
                                                            border: 1px dashed #E1E1E1;
                                                        }
                                                    }
                                                    &>span{
                                                        display: block;
                                                        width:60px;
                                                        height: 20px;
                                                        text-align: center;
                                                        line-height: 20px;
                                                        color: #252525;
                                                    }
                                                }
                                            }
                                            .material-right-wrapper{
                                                display: flex;
                                                flex-wrap:wrap;
                                                &>li{
                                                    width:138px;
                                                    height:158px;
                                                    margin-right:2px;
                                                    &>div{
                                                        width:138px;
                                                        height: 138px;
                                                        border:1px solid #E1E1E1;
                                                        display: flex;
                                                        justify-content: center;
                                                        align-items: center; 
                                                        &>span{
                                                            display: block;
                                                            width:120px;
                                                            height: 120px;
                                                            border: 1px dashed #E1E1E1;
                                                        }
                                                    }
                                                    &>span{
                                                        display: block;
                                                        width:138px;
                                                        height: 20px;
                                                        text-align: center;
                                                        line-height: 20px;
                                                        color: #252525;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .left-sidebar-list{
                        &>li{
                            width:120px;
                            height: 110px;
                            float:left;
                            margin-right:10px;
                            &>span{
                                display: inline-block;
                                width:120px;
                                height: 80px;
                                background:#ffffff;
                                padding:5px;
                                box-sizing: border-box;
                                box-shadow:darkgrey 1px 1px 5px 1px;
                                &.left-side-listactive{
                                    padding:3px;
                                    border:2px solid #3D91F7
                                }
                                &>span{
                                    display: inline-block;
                                    width:100%;
                                    height: 100%;
                                    // background:#acacac
                                }
                            }
                            &>label{
                                display: inline-block;
                                width:120px;
                                height:30px;
                                text-align: center;
                                line-height: 30px;
                                font-size: 12px;
                                color:#252525;
                            }
                        }
                    }
                }
                .ivu-modal-close{
                    position: absolute;
                    top:10px;
                    width:16px;
                    height:16px;
                    background: url(../../assets/images/default/closeDialog.png) no-repeat center center;
                    background-size: 16px 16px;
                    .ivu-icon{
                        display:none;
                    }
                }
                .ivu-modal-footer{
                    // height: 76px;
                    padding: 25px 18px 25px 18px
                }
            }
        }
    }
</style>



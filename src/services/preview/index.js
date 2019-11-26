import {geAjax} from './util'
import {getCookie} from '../Utils'
import PreviewPage from './render-page'
import horwheel from "horwheel";

/**
 * 执行渲染主函数
 */
const menuHeight = 40,menuWidth = 180
const menuStyles = [
    {fontColor: '#fff', bgColor: '#161D21', 'checkColor':'#454A4D'},
    {fontColor: '#fff', bgColor: '#4672A5', 'checkColor': '#385B84'},
    {fontColor: '#fff', bgColor: '#2E6F1D', 'checkColor': '#255917'},
    {fontColor: '#333', bgColor: '#D9D9D9', 'checkColor': '#AEAEAE'},
]
class Main {
    constructor() {
        // 应用的页面信息
        this.previewPage = null
        // 当前页面
        this.pageId = null
        this.evEchartsInit = null
        this.fileSystem = null
    }

    // 初始化
    async init() {
        //自定义事件，echart dom 渲染后，通知初始化echarts
        this.evEchartsInit = document.createEvent('CustomEvent')
        this.evEchartsInit.initCustomEvent('initEcharts', false, true, null)
        let gePreview = document.getElementById('gePreview')
        let idArr = /id=(.+?)$/.exec(location.search)
        let id = ''
        if (idArr) {
            // 查看应用
            id = idArr[1]
        }
        if (!id) {
            return
        }
        const host = await geAjax('/api/console/host/imageHost', 'GET')
        this.fileSystem = host.imageHost
        let applyInfo = await geAjax(`/api/iot-cds/cds/configurationDesignStudioForPreview/${id}`, 'GET')
        if (!applyInfo) {
            return
        }
        let token = getCookie('token')
        let refreshToken = getCookie('refreshToken')
        if ((!token || !refreshToken) && applyInfo.status === 0) { //未登录且应用未发布的情况下
            let notPublishImg = '../../../static/images/apply_not_publish.png'
            gePreview.style.height = "80vh"
            gePreview.style.width = "80vw"
            gePreview.style.background = `url('${notPublishImg}') center center no-repeat`
            gePreview.style.backgroundSize = "contain"
            return
        }
        document.getElementsByTagName('title')[0].innerHTML = applyInfo.studioName
        // 设置默认页面
        this.previewPage = new PreviewPage(applyInfo, this, gePreview)
        this.changePage(this.previewPage.pagesRank.normal[0])
        //初始化菜单
        this.initMenus(applyInfo)
    }
    //切换页面
    changePage(pageId) {
        this.pageId = pageId
        // 渲染页面
        this.renderNormal()
    }
    // 判断页面类型
    getPageType(id) {
        if (this.previewPage.pagesRank.normal.indexOf(id) !== -1) {
            return 'normal'
        } 
        if (this.previewPage.pagesRank.dialog.indexOf(id) !== -1) {
            return 'dialog'
        }
        return null
    }
    // 渲染普通页面
    renderNormal() {
        let pageContent = this.previewPage.content[this.pageId]
        this.previewPage.parsePage(pageContent,this.fileSystem)
        document.dispatchEvent(this.evEchartsInit)
    }

    // 渲染弹窗
    renderDialog(id) {
        let pageContent = this.previewPage.content[id];
        this.previewPage.parsePage(pageContent,this.fileSystem)
        document.dispatchEvent(this.evEchartsInit)
    }

    initMenus({content,theme}) {
        let parseContent = JSON.parse(content)
        let parseTheme = null
        if(theme) {
            parseTheme = JSON.parse(theme)
        }
        let pageRankNormal = parseContent.rank.normal
        if (!parseTheme || pageRankNormal.length == 1 || parseTheme.status == 0) {
            //只有一个页面，不渲染菜单 老应用未编辑过的没有theme字段，不渲染菜单 重新编辑过的老应用或者新增的应用，选择不启用菜单，则不渲染
            return;
        }
        let pages = {}
        pageRankNormal.forEach(item=>{
            pages[item] = parseContent.pages[item].title
        })
        let menuStyle = menuStyles[parseTheme.style - 1]
        let menuCon = $(".gePreviewMenu")
        menuCon.data('check',1)
        let menuIcon = $(".gePreviewMenuIcon")
        let menuUl = $("<ul>")
        menuCon.css({background: menuStyle.bgColor})
        if(parseTheme.position == 1) {
            menuCon.css({
                width: `${menuWidth}px`,
            })
            menuUl.css({
                position: 'absolute',
                left: '0',
                top: '0',
                right: '-14px',
                bottom: '0',
                height:'100%',
                overflowY: 'scroll',
            })
        }else{
            menuCon.css({
                height: `${menuHeight}px`,
                textAlign: 'center',
            })
            menuUl.css({
                overflowX: 'scroll',
                overflowY:'hidden',
                whiteSpace: 'nowrap',
            })
        } 
        let _that = this
        for(let key in pages) {
            let menuLi = $("<li>")
            menuLi.addClass('preview-menu-check')
            $(menuLi).on('click',function() {
                $(this).css('background', menuStyle.checkColor).siblings().css('background','unset')
                _that.changePage(key)
            })
            menuLi.css({
                color: menuStyle.fontColor,
                width: `${menuWidth - 20}px`,
                height: `${menuHeight}px`,
                display: 'inline-block',
                lineHeight: `${menuHeight}px`,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
            })
            if(parseTheme.position == 1) {
                menuLi.css({padding: '0 10px'})
            }
            menuLi.html(`${pages[key]}`)
            menuLi.attr('title',pages[key])
            menuUl.append(menuLi)
        }
        menuCon.append(menuUl)
        let mouseDeal = function(el) {
            $(el).mousedown(e=> {
                let left = parseInt($(el).scrollLeft())
                let downx = e.pageX
                $(el).mousemove("mousemove", evt=> {
                    let endx = evt.pageX - downx + left
                    $(el).scrollLeft(endx)
                })
            })
            $(document.body).mouseup(()=> {
                $(el).unbind("mousemove")
            })
        }
        $(() => {
            $(".preview-menu-check:eq(0)").click()
            menuCon.css('left', `${$("#gePreviewCon").offset().left}px`)
            if (parseTheme.position == 2) {//顶部
                menuCon.css('width', `${$("#gePreviewCon").width()}px`)
                menuIcon.css({
                    left: `${$("#gePreviewCon").width() / 2 + $("#gePreviewCon").offset().left - menuIcon.width() / 2}px`,
                    top: `${menuHeight}px`,
                    background:`${menuStyle.bgColor}`,
                    borderRadius: '0 0 10px 10px'
                })
                menuIcon.html(`<i class="ivu-icon ivu-icon-ios-arrow-up" style="position:relative;top:-2px;font-size:24px;color:#ffff"></i>`)
                let el = document.querySelector(".gePreviewMenu ul")
                horwheel(el)//支持鼠标滚轮滚动
                mouseDeal(el)//鼠标向左向右滑动
                let topTimer
                let topHide = function() {
                    menuIcon.css({
                        top:0
                    })
                    menuCon.hide()
                    menuCon.data("check", 0)
                    if (topTimer) {
                        clearTimeout(topTimer)
                        topTimer = null
                    }
                }
                let topHideTimeFun = function() {
                    topTimer = setTimeout(()=>{
                        topHide()
                    }, 10 * 1000)//10s 自动隐藏菜单
                }
                topHideTimeFun()
                menuIcon.on('click', function() {
                    let check = menuCon.data("check")
                    if(check == 1) {
                        topHide()
                    }else{
                        menuIcon.css('top', `${menuHeight}px`)
                        menuCon.show()
                        topHideTimeFun()
                    }
                    menuCon.data("check",1 - check)
                })
            }else{//左侧
                let previewConH = $("#gePreviewCon").height()
                let left = menuWidth + $("#gePreviewCon").offset().left
                menuCon.css('height', `${previewConH}px`)
                menuIcon.css({
                    height:'40px',
                    width:'20px',
                    left: `${left}px`,
                    lineHeight:`40px`,
                    top: `${previewConH / 2 + menuIcon.height() / 2 }px`,
                    background: `${menuStyle.bgColor}`,
                    borderRadius:'0 10px 10px 0'
                })
                menuIcon.html(`<i class="ivu-icon ivu-icon-ios-arrow-back" style="position:relative;left:-2px;font-size:24px;color:#fff;"></i>`)
                let leftTimer
                let leftHide = function() {
                    menuIcon.css('left', `${left - menuWidth}px`)
                    menuCon.hide()
                    menuCon.data("check", 0)
                    if (leftTimer) {
                        clearTimeout(leftTimer)
                        leftTimer = null
                    }
                }
                let leftHideTimeFun = function() {
                    leftTimer = setTimeout(() => {
                        leftHide()
                    }, 10 * 1000)//10s 自动隐藏菜单
                }
                leftHideTimeFun()
                menuIcon.on('click', function() {
                    let check = menuCon.data("check")
                    if (check == 1) {
                        leftHide()
                    } else {
                        menuIcon.css('left', `${left}px`)
                        menuCon.show()
                        leftHideTimeFun()
                    }
                    menuCon.data("check", 1 - check)
                })
            }
        })
    }
}
let mainProcess = new Main()
export default {
    mainProcess
}
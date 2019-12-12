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
        this.fileSystem = null
        this.menuStyle = null
        this.applyInfo = null
    }

    // 初始化
    async init() {
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
        const host = await geAjax('api/console/host/imageHost', 'GET')
        this.fileSystem = host.imageHost
        this.applyInfo = await geAjax(`api/iot-cds/cds/configurationDesignStudioForPreview/${id}`, 'GET')
        if (!this.applyInfo) {
            return
        }
        let token = getCookie('token')
        let refreshToken = getCookie('refreshToken')
        if ((!token || !refreshToken) && this.applyInfo.status === 0) { //未登录且应用未发布的情况下
            let notPublishImg = '../../../static/images/apply_not_publish.png'
            gePreview.style.height = "80vh"
            gePreview.style.width = "80vw"
            gePreview.style.background = `url('${notPublishImg}') center center no-repeat`
            gePreview.style.backgroundSize = "contain"
            return
        }
        document.getElementsByTagName('title')[0].innerHTML = this.applyInfo.studioName
        // 设置默认页面
        this.previewPage = new PreviewPage(this.applyInfo, this, gePreview)
        //初始化菜单
        this.initMenus()
    }
    //切换页面
    changePage(pageId,isAction) { //isAction 是否交互事件触发的
        if(isAction) {
            let items = $(".gePreviewMenu ul li")
            let scroolToMenu = ()=>{
                if (this.menuStyle.position == 1) {
                    $(".gePreviewMenu ul").animate({scrollTop: $(this).offset().top + "px"}, 500)
                } else {
                    $(".gePreviewMenu ul").animate({scrollLeft: $(this).offset().left + "px"}, 500)
                }
            }
            if(items.length) { //如果菜单未隐藏,滚动菜单到对应位置并选中
                items.each(function() {
                    let attrPageId = $(this).data("pageId")
                    if(attrPageId == pageId) {
                        $(this).click() //执行事件切换页面
                        scroolToMenu()
                        return false //终止each 循环
                    }
                })
                return
            } 
        }
        this.pageId = pageId
        // 渲染页面
        this.renderPageFun(pageId)
       
        let res = this.checkIsToInitMenu()
        if(res[0]) {
            setTimeout(()=>{
                this.updateMenuPos(res[1])
                window.onresize = () => {
                    this.refreshMenuPos(res[1])
                }
            })
        }

    }
    checkIsToInitMenu() {
        let res = true
        let {content, theme} = this.applyInfo
        let parseTheme = null
        let parseContent = JSON.parse(content)
        let pageRankNormal = parseContent.rank.normal
        if (theme) {
            parseTheme = JSON.parse(theme)
        }
        if (!parseTheme || pageRankNormal.length == 1 || parseTheme.status == 0) {
            res = false
        }
        return [res, parseTheme, parseContent,pageRankNormal]
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
    // 渲染页面
    renderPageFun(id) {
        let pageId = id
        let pageContent = this.previewPage.content[pageId]
        this.previewPage.parsePage(pageContent, this.fileSystem)
    }

    initMenus() {
        let resMenu = this.checkIsToInitMenu()
        if (!resMenu[0]) {
            //只有一个页面，不渲染菜单 老应用未编辑过的没有theme字段，不渲染菜单 重新编辑过的老应用或者新增的应用，选择不启用菜单，则不渲染
            this.changePage(this.previewPage.pagesRank.normal[0]) //渲染首页面
            return
        }
        let pages = {}
        let parseTheme = resMenu[1]
        let parseContent = resMenu[2]
        let pageRankNormal = resMenu[3]
        pageRankNormal.forEach(item=>{
            pages[item] = parseContent.pages[item].title
        })
        this.menuStyle  = menuStyles[parseTheme.style - 1]
        $(()=>{
            let timer = null
            let menuCon = $(".gePreviewMenu")
            let menuIcon = $(".gePreviewMenuIcon")
            menuIcon.attr("data-check", 1)
            menuCon.css({background: this.menuStyle.bgColor})
            let menuUl = $("<ul>")

            let menuHide = (iconCss, ) => {
                menuIcon.css(iconCss)
                menuCon.hide()
                menuIcon.attr("data-check", 0)
            }

            let menuShow = (iconCss,conCss) => {
                menuCon.show()
                menuHideFun()
                menuIcon.css(iconCss)
                menuCon.css(conCss)
            }
            let dealMenuHide = () => {
                if (parseTheme.position == 2) {
                    menuHide({top: 0})
                } else {
                    let left = menuWidth + $("#gePreviewCon").offset().left
                    menuHide({left: `${left - menuWidth}px`})
                }
            }
            let menuHideFun = () => {
                if (timer) {
                    window.clearTimeout(timer)
                    timer = null
                }
                timer = setTimeout(() => {
                    dealMenuHide()
                }, 10 * 1000)
            }
            let checkMenuFun = (key,el)=>{
                el.addClass('check').siblings().removeClass('check')
                el.css('background', this.menuStyle.checkColor).siblings().css('background', 'unset')
                this.changePage(key) //切换页面
                menuHideFun()
            }
            for (let key in pages) {
                let menuLi = $("<li>")
                menuLi.addClass('preview-menu-check')
                $(menuLi).on('click', function() {
                    if ($(this).hasClass('check')) {
                        return
                    }
                    checkMenuFun(key, $(this))
                })
                menuLi.css({
                    color: this.menuStyle.fontColor,
                    width: `${menuWidth - 20}px`,
                    height: `${menuHeight}px`,
                    display: 'inline-block',
                    lineHeight: `${menuHeight}px`,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                })
                if (parseTheme.position == 1) {
                    menuLi.css({padding: '0 10px'})
                }
                menuLi.html(`${pages[key]}`)
                menuLi.attr('title', pages[key])
                menuLi.data('pageId', key)//交互事件 跳转页面时候通过这个定位到对应的菜单项
                menuUl.append(menuLi)
            }
            menuCon.append(menuUl)
            $(".preview-menu-check:eq(0)").click() //默认第一个页面
            let that = this
            menuIcon.on('click', function() {
                let check = menuIcon.attr("data-check")
                if(check == 1) {
                    dealMenuHide()
                }else{
                    menuHideFun()
                    if (parseTheme.position == 2) {
                        menuShow({top: `${menuHeight}px`},{width: `${that.getConWidth()}px`})
                    }else{
                        let left = menuWidth + $("#gePreviewCon").offset().left
                        menuShow({left: `${left}px`},{height: `${that.getConHeight()}px`})
                    }
                }
                menuIcon.attr("data-check", 1 - check)
            })
        })
    }
    dealMenuTop(menuIcon) {
        let conWidth = this.getConWidth()
        this.setMenuItemStyle(
            {
                left: `${conWidth / 2 + $("#gePreviewCon").offset().left - menuIcon.width() / 2}px`,
                top: `${menuHeight}px`,
                background: `${this.menuStyle.bgColor}`,
                borderRadius: '0 0 10px 10px'
            },
            {
                height: `${menuHeight}px`,
                textAlign: 'center',
                'width': `${conWidth}px`
            },
            '<i class="ivu-icon ivu-icon-ios-arrow-up" style="position:relative;top:-2px;font-size:24px;color:#ffff"></i>',
            {
                overflowX: 'scroll',
                overflowY: 'hidden',
                whiteSpace: 'nowrap',
            },
        )
        let mouseDeal = function(el) {
            $(el).mousedown(e => {
                let left = parseInt($(el).scrollLeft())
                let downx = e.pageX
                $(el).mousemove("mousemove", evt => {
                    let endx = evt.pageX - downx + left
                    $(el).scrollLeft(endx)
                })
            })
            $(document.body).mouseup(() => {
                $(el).unbind("mousemove")
            })
        }
        let el = document.querySelector(".gePreviewMenu ul")
        horwheel(el)//支持鼠标滚轮滚动
        mouseDeal(el)//鼠标向左向右滑动
    }
    getConWidth() {
        let conWidth = $("#gePreviewCon").width()
        let docWidth = $(document).width()
        if (conWidth > docWidth) {
            conWidth = docWidth
        }
        return conWidth
    }
    getConHeight() {
        let previewConH = $("#gePreviewCon").height()
        let docHeight = $(document).height()
        if (previewConH > docHeight) {
            previewConH = docHeight
        }
        return previewConH
    }
    dealMenuLeft(previewConH,left,menuIcon) {
        this.setMenuItemStyle(
            {
                height: '40px',
                width: '20px',
                left: `${left}px`,
                lineHeight: `40px`,
                top: `${previewConH / 2 + menuIcon.height() / 2}px`,
                background: `${this.menuStyle.bgColor}`,
                borderRadius: '0 10px 10px 0'
            },
            {
                width: `${menuWidth}px`,
                height: `${previewConH}px`
            },
            '<i class="ivu-icon ivu-icon-ios-arrow-back" style="position:relative;left:-2px;font-size:24px;color:#fff;"></i>',
            {
                position: 'absolute',
                left: '0',
                top: '0',
                right: '-14px',
                bottom: '0',
                height: '100%',
                overflowY: 'scroll',
            },
        )
    }
    setMenuItemStyle(iconCss, conCss,  iconHtml, ulCss) {
        let menuCon = $(".gePreviewMenu")
        let menuIcon = $(".gePreviewMenuIcon")
        let menuUl = $(".gePreviewMenu ul")
        menuIcon.css(iconCss)
        if(conCss) {
            menuCon.css(conCss)
            menuCon.css('left', `${$("#gePreviewCon").offset().left}px`)
        }
        if(ulCss) {
            menuUl.css(ulCss)
        }
        if(iconHtml) {
            menuIcon.html(iconHtml)
        }
    }
    updateMenuPos(parseTheme) {
        let menuIcon = $(".gePreviewMenuIcon")
        if (parseTheme.position == 1) {
            let left = menuWidth + $("#gePreviewCon").offset().left
            this.dealMenuLeft(this.getConHeight(), left, menuIcon)
        } else {
            this.dealMenuTop(menuIcon)
        }
    }
    refreshMenuPos(parseTheme) {
        let conWidth = this.getConWidth()
        let menuIcon = $(".gePreviewMenuIcon")
        let left = menuWidth + $("#gePreviewCon").offset().left
        let previewConH = this.getConHeight()
        let check = menuIcon.attr("data-check")
        let iconStyle,conStyle
        conStyle = {width: `${conWidth}px`};
        if(check == 1) {
            if (parseTheme.position == 1) {
                iconStyle = {left: `${left}px`, top: `${previewConH / 2 + menuIcon.height() / 2}px`}
                conStyle = {height: `${previewConH}px`, left: `${left}px`}
            }else{
                iconStyle = {left: `${conWidth / 2 + $("#gePreviewCon").offset().left - menuIcon.width() / 2}px`}
            }
        }else{
            if (parseTheme.position == 1) {
                iconStyle = {left: `${left - menuWidth}px`}
                conStyle = {left: `${left}px`}
            }else{
                iconStyle = {top: 0}
            }
        }
        this.setMenuItemStyle(iconStyle, conStyle)
    }
}
let mainProcess = new Main()
export default {
    mainProcess
}
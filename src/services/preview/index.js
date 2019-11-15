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
        console.log(applyInfo)
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
            //只有一个页面，不渲染菜单 老应用未编辑过的没有theme字段，不渲染菜单 重新编辑过的老应用或者新增的应用，选择启用不启用菜单，则不渲染
            return;
        }
        let pages = {}
        pageRankNormal.forEach(item=>{
            pages[item] = parseContent.pages[item].title
        })
        let menuStyle = menuStyles[parseTheme.style - 1]
        let menuCon = $(".gePreviewMenu")
        let menuUl = $("<ul>")
        menuCon.css({
            background: menuStyle.bgColor,
            width: '100%',
        })
        if(parseTheme.position == 1) {
            menuCon.css({
                width: `${menuWidth}px`,
                height: `${$(window).height()}px`,
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
            $(".gePreviewMenu").css('left', `${$("#gePreviewCon").offset().left}px`)
            if (parseTheme.position == 2) {//顶部
                $(".gePreviewMenu").css('width', `${$("#gePreviewCon").width()}px`)
                let el = document.querySelector(".gePreviewMenu ul")
                horwheel(el)//支持鼠标滚轮滚动
                mouseDeal(el)//鼠标向左向右滑动
            }
        })
    }
}
let mainProcess = new Main()
export default {
    mainProcess
}
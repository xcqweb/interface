import {geAjax} from './util'
import PreviewPage from './render-page'

// 主函数
let mainProcess
// 控件xml解析信息
let applyInfo
// 正常页面渲染地方
let gePreview
let ev//自定义事件，echart dom 渲染后，通知初始化echarts
// 文件服务器host
let fileSystem

/**
 * 执行渲染主函数
 */
class Main {
    constructor() {
        // 应用的页面信息
        this.previewPage = null
        // 当前页面
        this.pageId = null
    }

    // 初始化
    async init() {
        ev = document.createEvent('CustomEvent')
        ev.initCustomEvent('initEcharts', false, true, null)
        gePreview = document.getElementById('gePreview')
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
        fileSystem = host.imageHost
        applyInfo = await geAjax(`/api/iot-cds/cds/configurationDesignStudio/${id}`, 'GET')
        if (!applyInfo) {
            return
        }
        document.getElementsByTagName('title')[0].innerHTML = applyInfo.studioName
        // 设置默认页面
        this.previewPage = new PreviewPage(applyInfo, this, gePreview)
        this.pageId = this.previewPage.pagesRank.normal[0]
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
        this.previewPage.parsePage(pageContent,fileSystem)
        document.dispatchEvent(ev)
    }

    // 渲染弹窗
    renderDialog(id) {
        let pageContent = this.previewPage.content[id];
        this.previewPage.parsePage(pageContent,fileSystem)
        document.dispatchEvent(ev)
    }
}
mainProcess = new Main()
export default {
    mainProcess
}
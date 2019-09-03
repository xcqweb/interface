import {geAjax} from './util'
import {mxUtils} from '../../services/mxGlobal'
import PreviewPage from './render-page'

// 主函数
let mainProcess
// 控件xml解析信息
let shapeXlms, applyInfo, fileSystem
// 正常页面渲染地方
let gePreview
// 浮窗节点
let formatLayer
let ev//自定义事件，echart dom 渲染后，通知初始化echarts
/**
 * 加载控件的xml配置文档
 */
function loadShapeXml() {
    return new Promise((resolve) => {
        mxUtils.get('/static/stencils/preview.xml', function(res) {
            let root = res.getXml();
            let obj = {};
            const shapes = root.documentElement.getElementsByTagName('shape');
            for (let shape of shapes) {
                obj[shape.getAttribute('name')] = {
                    viewBox: shape.getAttribute('viewBox'),
                    path: shape.childNodes[1]
                };
            }
            resolve(obj)
        })
    })
}

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
        ev.initCustomEvent('initEcharts', false, true)
        gePreview = document.getElementById('gePreview')
        formatLayer = document.getElementById('formatLayer')
        let idArr = /id=(.+?)$/.exec(location.search)
        let id
        if (idArr) {
            // 查看应用
            id = idArr[1]
        }
        const host = await geAjax('/api/console/host/imageHost', 'GET')
        fileSystem = host.host;
        applyInfo = await geAjax(`/api/iot-cds/cds/configurationDesignStudio/${id}`, 'GET')
        shapeXlms = await loadShapeXml();
        if (!applyInfo) {
            return
        }
        document.getElementsByTagName('title')[0].innerHTML = applyInfo.studioName
        // 设置默认页面
        this.previewPage = new PreviewPage(applyInfo, this, gePreview, formatLayer)
        this.pageId = this.previewPage.pagesRank.normal[0]
        // 渲染页面
        this.renderNormal()
    }
    // 判断页面类型
    getPageType(id) {
        if (this.previewPage.pagesRank.normal.indexOf(id) !== -1) {
            return 'normal';
        } else if (this.previewPage.pagesRank.dialog.indexOf(id) !== -1) {
            return 'dialog';
        } else {
            return null;
        }
    }
    // 渲染普通页面
    renderNormal() {
        let pageContent = this.previewPage.content[this.pageId];
        this.previewPage.parsePage(pageContent, fileSystem, shapeXlms)
        document.dispatchEvent(ev)
    }

    // 渲染弹窗
    renderDialog(id) {
        let pageContent = this.previewPage.content[id];
        this.previewPage.parsePage(pageContent, fileSystem, shapeXlms)
        document.dispatchEvent(ev)
    }

    // 渲染浮窗
    renderLayer() {
        this.previewPage.renderLayer()
    }
}
mainProcess = new Main()
export default {
    mainProcess
}
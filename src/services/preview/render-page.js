/**
 * 渲染页面
 */
// 页面宽度和高度
let pageWidth = 0,pageHeight = 0
// websocket信息
let applyData = {}
let fileSystem //文件服务器host
// 默认样式
const defaultStyle = {align:'center',verticalAlign:'middle',strokeColor:'#000000',fillColor:'#FFFFFF',fontSize:'12px'}

import {removeEle, destroyWs, insertImage, insertEdge, bindEvent,dealProgress,dealPipeline, dealCharts,dealLight} from './util'
import {createWsReal,getLastData} from './bind-data'
import GetNodeInfo from './node-info'
import {mxUtils} from './../../services/mxGlobal'
import requestUtil from '../../services/request'
import urls from '../../constants/url'
class PreviewPage {
    constructor(data, mainProcess, gePreview) {
        let {
            content,
        } = data
        let parseContent = JSON.parse(content)
        this.content = parseContent.pages
        this.pagesRank = parseContent.rank
        this.wsParams = []
        this.currentPageId = ''
        this.mainProcess = mainProcess
        this.gePreview = gePreview
    }
    // 生成弹窗
    createDialog(page) {
        let {id,title,xml} = page
        const xmlDoc = mxUtils.parseXml(xml).documentElement
        let contentBgColor = xmlDoc.getAttribute('background')
        let contentWidth = xmlDoc.getAttribute('pageWidth')
        let contentHeight = xmlDoc.getAttribute('pageHeight')

        let {fontSize,color,lineHeight,textAlign,background} = page.style

        if(!lineHeight) {
            lineHeight = '36px'
        }
        if(!textAlign) {
            textAlign = 'center'
        }
        let bg = document.createElement('div')
        bg.className = 'bg';
        bg.id = 'bg_' + id;
        document.getElementById('geDialogs').appendChild(bg)
        let dialog = document.createElement('div');
        dialog.className = 'geDialog';
        dialog.style.width = contentWidth + 'px';
        // 加上标题行高
        dialog.style.height = (Math.ceil(contentHeight) + 36) + 'px';
        dialog.id = id;
        // 标题
        let titleEl = document.createElement('p')
        titleEl.className = 'geDialogTitle'
        titleEl.style.cssText = `width:${contentWidth}px;text-align:${textAlign};line-height:${lineHeight};
            font-size:${fontSize};color:${color};background:${background};`
        titleEl.innerHTML = title
        dialog.appendChild(titleEl)
        // 点击关闭弹窗
        titleEl.addEventListener('click', () => {
            removeEle(dialog)
            removeEle(bg)
            // 关闭websocket
            destroyWs(applyData, id)
        })
        // 弹窗正文
        let content = document.createElement('div')

        content.className = 'geDialogContent'
        content.style.cssText = `width:${contentWidth}px;height:${contentHeight}px;background:${contentBgColor};`
        dialog.appendChild(content)
        document.getElementById('geDialogs').appendChild(dialog)
        return content
    }
    // 解析所有控件节点
    parseCells(root) {
        // 递归获取节点
        let getNode = (tId = 1) => {
            let list = [];
            for (let item of root) {
                // 节点类型：object有属性，mxcell无属性
                let node, value, tagName = item.tagName
                // 节点id
                let id = item.getAttribute('id');
                let bindData = JSON.parse(item.getAttribute('bindData'))
                // 节点交互
                let actionsInfo = JSON.parse(item.getAttribute('actionsInfo'))
                // 节点状态
                let statesInfo = JSON.parse(item.getAttribute('statesInfo'))
                // 链接
                let link = item.getAttribute('link')
                // mxcell节点
                if (tagName == 'object') {
                    node = item.childNodes[0]
                    value = item.getAttribute('label')
                } else {
                    node = item;
                    value = node.getAttribute('value')
                }
                // 节点父节点
                let parentId = node.getAttribute('parent')
                // 节点存在id，递归
                if (parentId == tId && id) {
                    // 节点参数信息
                    let getNodeInfo = new GetNodeInfo(node)
                    // 节点类型
                    let shapeName = getNodeInfo.getStyles('shape')
                    let x, y, width, height, fillColor, strokeColor, strokeStyle, fontColor, fontSize, styles, isGroup, image, hide, align, verticalAlign, rotation, direction, flipH, flipV, startArrow, endArrow, strokeWidth, fontWeight,edgeProps
                    styles = node.getAttribute('style')
                    isGroup = styles.indexOf('group') != -1
                    fillColor = getNodeInfo.getStyles('fillColor') || '#FFFFFF'
                    fontColor = getNodeInfo.getStyles('fontColor') || '#000000'
                    verticalAlign = getNodeInfo.getStyles('verticalAlign') || 'middle'
                    rotation = getNodeInfo.getStyles('rotation') || 0
                    direction = getNodeInfo.getStyles('direction')
                    flipH = getNodeInfo.getStyles('flipH') || 0
                    flipV = getNodeInfo.getStyles('flipV') || 0
                    align = getNodeInfo.getStyles('align') || 'center'
                    fontSize = getNodeInfo.getStyles('fontSize') || '12'
                    fontWeight = getNodeInfo.getStyles('fontStyle') || 0
                    strokeStyle = getNodeInfo.getStyles('dashed')
                    strokeWidth = getNodeInfo.getStyles('strokeWidth') || 1
                    strokeColor = (shapeName.includes('image') ? getNodeInfo.getStyles('imageBorder') : getNodeInfo.getStyles('strokeColor')) || 'none';
                    // 图片地址
                    image = getNodeInfo.getStyles('image') || null
                    x = parseFloat(node.childNodes[0].getAttribute('x')) || 0
                    y = parseFloat(node.childNodes[0].getAttribute('y')) || 0
                    width = parseFloat(node.childNodes[0].getAttribute('width'))
                    hide = item.getAttribute('hide');
                    height = parseFloat(node.childNodes[0].getAttribute('height'))
                    if(shapeName == 'beeline') {
                        edgeProps = item.getAttribute('edgeProps')
                        edgeProps = JSON.parse(edgeProps)
                        width = Math.abs(edgeProps.tx - edgeProps.sx)
                        height = Math.abs(edgeProps.ty - edgeProps.sy)
                        if(height < 30) {//防止箭头预览只看到一半
                            height = 30
                        }
                        if (width < 30) { //防止箭头预览只看到一半
                            width = 30
                        }
                        x = Math.min(edgeProps.sx, edgeProps.tx) / 2
                        y = Math.min(edgeProps.sy, edgeProps.ty) / 2
                        height = height + y
                        width = width + x
                    }
                    let obj = {
                        id,
                        bindData,
                        shapeName,
                        x,
                        y,
                        width,
                        height,
                        fillColor,
                        strokeColor,
                        strokeStyle,
                        strokeWidth,
                        value,
                        isGroup,
                        fontColor,
                        fontSize,
                        fontWeight,
                        image,
                        link,
                        actionsInfo,
                        statesInfo,
                        hide,
                        verticalAlign,
                        align,
                        rotation,
                        direction,
                        flipH,
                        flipV,
                        edgeProps
                    }
                    if (shapeName == 'beeline') {
                        startArrow = getNodeInfo.getStyles('startArrow')
                        endArrow = getNodeInfo.getStyles('endArrow')
                        obj.startArrow = startArrow
                        obj.endArrow = endArrow
                    }else if(shapeName == 'progress') {
                        let progressProps = item.getAttribute('progressProps')
                        obj.progressProps = progressProps
                    }else if(shapeName.includes('pipeline')) {
                        let pipelineProps = item.getAttribute('pipelineProps')
                        obj.pipelineProps = pipelineProps
                    }else if(shapeName.includes('Chart')) {
                        let chartProps = item.getAttribute('chartProps')
                        obj.chartProps = chartProps
                    }
                    // 组合节点
                    obj.children = getNode(id)
                    list.push(obj)
                }
            }
            return list
        }
        let cells = getNode()
        cells.map(cell => {
            // 计算页面高度
            pageWidth = (cell.x + cell.width) > pageWidth ? cell.x + cell.width : pageWidth
            pageHeight = (cell.y + cell.height) > pageHeight ? cell.y + cell.height : pageHeight
        })
        return cells    
    }
    // 清空页面内容
    clearPage() {
        this.gePreview.innerHTML = ''
    }
    subscribeData() {
        applyData[this.currentPageId] = {
            wsReal: '',
            data: {},
            wsParams: this.wsParams,
            lockWs: false
        }
        createWsReal(this.currentPageId, applyData, fileSystem)
        getLastData(this.wsParams, fileSystem) //低频数据 通过调用最后一笔数据显示
    }
    // 解析页面
    parsePage(page,fileSystemParam) {
        fileSystem = fileSystemParam
        this.currentPageId = page.id
        const xmlDoc = mxUtils.parseXml(page.xml).documentElement
        let pageStyle = page.style
        const root = xmlDoc.getElementsByTagName('root')[0].childNodes
        const viewBackground = xmlDoc.getAttribute('background')
        let contentWidth = xmlDoc.getAttribute('pageWidth')
        let contentHeight = xmlDoc.getAttribute('pageHeight')
        const list = []
        for (let i = 0; i < root.length; i++) {
            list.push(root[i])
        }
        // 页面宽度和高度
        pageWidth = pageHeight = 0
        let cells = this.parseCells(list)
        this.wsParams = []
        if (page.type === 'normal') {
            // 清除全部websocket
            for (let key in applyData) {
                destroyWs(applyData, key)
            }
            document.getElementById('geDialogs').innerHTML = ''
            // 清空页面内容
            this.clearPage()
            // 正常页面      
            this.renderPages(cells, this.gePreview)
            this.gePreview.style.width = contentWidth + 'px'
            this.gePreview.style.height = contentHeight + 'px'
            this.gePreview.style.backgroundColor = viewBackground
            if (pageStyle && pageStyle.backgroundUrl) {
                pageStyle.backgroundUrl = pageStyle.backgroundUrl.replace(/getechFileSystem\//, fileSystem)
                this.gePreview.style.background = `url(${pageStyle.backgroundUrl}) no-repeat center center`
                this.gePreview.style.backgroundSize = "100% 100%"
            }
        } else {
            // 弹窗页面
            let layerContent = this.createDialog(page)
            layerContent.innerHTML = ''
            this.renderPages(cells, layerContent)
        }
        $(() => {
            setTimeout(() => {
                this.subscribeData()
            }, 400)
        })
        return cells
    }
    // 渲染页面
    renderPages(cells, ele = this.gePreview) {
        for (let i = 0;i < cells.length;i++) {
            let cell = cells[i]
            let cellHtml = this.renderCell(cell)
            ele.appendChild(cellHtml)
            // 组内资源
            if (cell.children.length) {
                this.renderPages(cell.children, cellHtml)
            }
        }
    }

    // 渲染控件节点
    renderCell(cell) {
        const shapeName = cell.shapeName
        let cellHtml
        if (shapeName.includes('image')) {
            // 图片
            cellHtml = insertImage(cell,fileSystem)
        } else if (shapeName === 'linkTag') {
            // smartBi链接iframe
            cellHtml = document.createElement('iframe')
            let curLinkStr  = cell.link
            if(cell.link) {
                let curLink = JSON.parse(curLinkStr).url
                cellHtml.setAttribute('src', `${/^(https|http):\/\//.test(curLink) ? '' : 'http://' }${curLink}`)
            }
        } else if (shapeName === 'menuCell' || shapeName === 'menulist') {
            // 菜单
            cellHtml = document.createElement('div')
            cellHtml.innerHTML = cell.value;
        }  else if (shapeName === 'text') {
            // 文本
            cellHtml = document.createElement('span')
            cellHtml.style.overflow = 'visible'
            let child = document.createElement('span')
            let translateX = '0'
            let translateY = '0'
            child.style.position = "absolute"
            if (cell.align === 'right') {
                child.style.right = '0'
            } else if (cell.align === 'center') {
                child.style.left = '50%'
                translateX = '-50%'
            }
            if (cell.verticalAlign === 'bottom') {
                child.style.bottom = '0'
            } else if (cell.verticalAlign === 'middle') {
                child.style.top = '50%'
                translateY = '-50%'
            } else {
                translateY = '8px'
            }
            child.style.transform = `translate(${translateX}, ${translateY})`
            child.style.lineHeight = '1'
            child.style.whiteSpace = 'nowrap'
            let reg = />(.+)</
            let textArr = cell.value.match(reg)
            if(textArr && textArr.length) {
                child.innerHTML = textArr[1]
            }else{
                child.innerHTML = cell.value
            }
            cellHtml.appendChild(child)
        } else if (shapeName === 'button') {
            // 按钮
            cellHtml = document.createElement('div')
            cellHtml.innerHTML = cell.value
        } else if (shapeName === 'beeline') {
            // 箭头、直线，曲线
            cellHtml = insertEdge(cell)
        } else if(shapeName === 'progress') {
            cellHtml = dealProgress(cell)
        } else if (shapeName.includes('pipeline')) {
            cellHtml = dealPipeline(cell)
        } else if (shapeName.includes('Chart')) {
            cellHtml = dealCharts(cell)
        } else if (shapeName == 'light') {
            cellHtml = dealLight(cell)
        } else {
            // 其他
            cellHtml = document.createElement('p');
            if(shapeName === 'ellipse') {
                cellHtml.style.borderRadius = "50%"
            }
            cellHtml.innerHTML = cell.value;
        }
        if (shapeName !== 'text') {
            if (cell.verticalAlign === 'top') {
                cellHtml.style.lineHeight = cell.fontSize + 'px'
            } else if (cell.verticalAlign === 'bottom') {
                cellHtml.style.lineHeight = (cell.height * 2 - cell.fontSize) + 'px'
            } else {
                cellHtml.style.lineHeight = cell.height + 'px'
            }
        }
        cellHtml.style.textAlign = cell.align
        if (['image', 'userimage', 'pipeline1', 'pipeline2','pipeline3','beeline','lineChart','gaugeChart','light','progress'].includes(shapeName)) {
            cellHtml.style.backgroundColor = 'transparent'
        }else{
            if (cell.children.length > 0 && (cell.fillColor === '#FFFFFF' || cell.fillColor == 'none')) {
                cellHtml.style.backgroundColor = 'transparent'
            } else {
                cellHtml.style.backgroundColor = cell.fillColor
            }
        }
        if(shapeName != 'beeline') {
            let borderStyle = 'solid'
            if(cell.strokeStyle) {
                borderStyle = 'dashed'
            }
            cellHtml.style.border = `${cell.strokeColor == 'none' ? '' : `${cell.strokeWidth}px ${borderStyle} ${cell.strokeColor || defaultStyle.strokeColor}`}`;
        }
        cellHtml.style.width = cell.width + 'px'
        cellHtml.style.height = cell.height + 'px'
        cellHtml.className = 'gePalette'
        // 隐藏
        if (cell.hide == 'true') {
            cellHtml.style.display = 'none'
        }
        // 旋转
        cellHtml.style.transform = `rotate(${cell.rotation}deg) ${cell.flipV == 1 ? ' scaleY(-1)' : ''} ${cell.flipH == 1 ? ' scaleX(-1)' : ''}`;
        // 字体大小
        cellHtml.style.fontSize = `${cell.fontSize}px`
        cellHtml.style.fontWeight = `${cell.fontWeight == 1 ? 'bold' : 'normal'}`
        // 字体颜色
        cellHtml.style.color = `${cell.fontColor}`
        // 定位
        cellHtml.style.left = cell.x + 'px'
        cellHtml.style.top = cell.y + 'px'
        cellHtml.id = `palette_${cell.id}`
        // 绑定事件
        bindEvent(cellHtml, cell, this.mainProcess, applyData,fileSystem)
        $(cellHtml).data("shapeName",shapeName)
        if (cell.bindData && cell.bindData.dataSource && cell.bindData.dataSource.deviceTypeChild) {
            let devices = cell.bindData.dataSource.deviceNameChild
            let paramShow = []
            if (cell.bindData.params) {
                cell.bindData.params.forEach((item)=>{
                    paramShow.push(item.paramName)
                })
            }
            $(cellHtml).data("paramShow", paramShow)
            let resParams = []
            let cellStateInfoHasModel = [] //默认状态以及绑定了模型公式的状态
            let modelIdsParam = []
            let statesInfo = cell.statesInfo
            if (statesInfo && statesInfo.length) {
                cellStateInfoHasModel.push(statesInfo[0])//添加默认状态的
                statesInfo.forEach((item)=>{
                    if (item.modelFormInfo) {
                        cellStateInfoHasModel.push(item)
                        modelIdsParam.push(item.modelFormInfo)
                    }
                })
                if (modelIdsParam.length) {
                    requestUtil.post(urls.getModelByIds.url, modelIdsParam).then((res) => {
                        res.returnObj.forEach((item, index) => {
                            cellStateInfoHasModel[index + 1].modelFormInfo = item
                            let formulaAttr
                            if (item.formula) {
                                formulaAttr = JSON.parse(item.formula)
                            }
                            let flatFormulaAttr = []
                            if (formulaAttr) {
                                formulaAttr.data.forEach((item)=>{
                                    flatFormulaAttr = flatFormulaAttr.concat(...item)
                                })
                                flatFormulaAttr.forEach((d) => {
                                    resParams.push(d.paramName)
                                })
                            }
                        })
                        $(cellHtml).data("stateModels", cellStateInfoHasModel)
                        this.initWsParams(cellHtml, devices, resParams, paramShow)
                    },()=>{
                        this.initWsParams(cellHtml, devices, resParams, paramShow)
                    })
                }else{
                    this.initWsParams(cellHtml, devices, resParams, paramShow)
                }
            } else{
                this.initWsParams(cellHtml, devices, resParams, paramShow)
            }
        }
        return cellHtml
    }
    initWsParams(cellHtml, devices, resParams, paramShow) {
        $(cellHtml).data("paramShowAll", Array.from(new Set(paramShow.concat(resParams))))
        if (devices) {
            devices.forEach((item) => {
                cellHtml.className += ` point_${item.id}`
                let resArr = Array.from(new Set(resParams.concat(paramShow)))
                if (resArr.length) {
                    this.wsParams.push({
                        pointId: item.id,
                        params: resArr
                    })
                }
            })
        }
    }
}

export default PreviewPage
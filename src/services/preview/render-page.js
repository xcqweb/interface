/**
 * 渲染页面
 */
// 页面宽度和高度
let pageWidth = 0,pageHeight = 0
// websocket信息
let applyData = {}
// 正常的最小x、y偏移量
let minX, minY
// 接收的点位数据
let pointData = {}
let pointParams = []
let layerData = null
// 配置好的svg图
let configSvg = ['drop', 'circle', 'diamond', 'square', 'pentagram']
// 默认样式
const defaultStyle = {align:'center',verticalAlign:'middle',strokeColor:'#000000',fillColor:'#FFFFFF',fontSize:'12px'}


import {removeEle,destroyWs,insertImage,inserEdge,insertSvg,bindEvent,dealProgress,dealPipeline,dealCharts,bindState} from './util'
import {createWsReal,createWsAlarm} from './bind-data'
import GetNodeInfo from './node-info'
import {mxUtils} from './../../services/mxGlobal'
class PreviewPage {
    constructor(data, mainProcess, gePreview, formatLayer) {
        let {
            content,
            studioId,
        } = data
        let parseContent = JSON.parse(content)
        this.content = parseContent.pages
        this.pagesRank = parseContent.rank
        this.renderPageId = studioId
        this.wsParams = []
        this.mainProcess = mainProcess
        this.gePreview = gePreview
        this.formatLayer = formatLayer
    }

    // 页面数量
    pageCounts() {
        return Object.keys(this.content);
    }
    // 生成弹窗
    createDialog(id, pagetitle) {
        let bg = document.createElement('div')
        bg.className = 'bg';
        bg.id = 'bg_' + id;
        document.getElementById('geDialogs').appendChild(bg)
        let dialog = document.createElement('div');
        dialog.className = 'geDialog';
        dialog.style.width = pageWidth + 'px';
        dialog.style.height = pageHeight + 'px';
        dialog.id = id;
        // 标题
        let title = document.createElement('p');
        title.className = 'geDialogTitle';
        title.innerHTML = pagetitle;
        dialog.appendChild(title);
        // 点击关闭弹窗
        title.addEventListener('click', () => {
            removeEle(dialog);
            removeEle(bg);
            // 关闭websocket
            destroyWs(applyData, id);
        })
        // 弹窗正文
        let content = document.createElement('div');
        content.className = 'geDialogContent'
        dialog.appendChild(content);
        document.getElementById('geDialogs').appendChild(dialog);
        return content;
    }
    // 解析所有控件节点
    parseCells(root) {
        // 递归获取节点
        minX = minY = 0;
        let getNode = (tId = 1) => {
            let list = [];
            for (let item of root) {
                // 节点类型：object有属性，mxcell无属性
                let node, value, tagName = item.tagName;
                // 节点id
                let id = item.getAttribute('id');
                // 节点交互
                let actionsInfo = JSON.parse(item.getAttribute('actionsInfo'))
                // 节点状态
                let statesInfo = JSON.parse(item.getAttribute('statesInfo'))
                // 数据绑定
                let bindData = JSON.parse(item.getAttribute('bindData'))
                // 链接
                let smartBiLink = item.getAttribute('smartBiLink')
                // mxcell节点
                if (tagName == 'object') {
                    node = item.childNodes[0];
                    value = item.getAttribute('label');
                } else {
                    node = item;
                    value = node.getAttribute('value');
                }
                // 节点父节点
                let parentId = node.getAttribute('parent');
                // 节点存在id，递归
                if (parentId == tId && id) {
                    // 节点参数信息
                    let getNodeInfo = new GetNodeInfo(node);
                    // 节点类型
                    let shapeName = getNodeInfo.getStyles('shape');
                    let x, y, width, height, fillColor, strokeColor,strokeStyle, fontColor, fontSize, styles, isGroup, image, hide, align, verticalAlign, selectProps, defaultProp, points, rotation, flipH, flipV,startArrow,endArrow
                    styles = node.getAttribute('style');
                    isGroup = styles.indexOf('group') != -1;
                    fillColor = getNodeInfo.getStyles('fillColor') || '#FFFFFF';
                    fontColor = getNodeInfo.getStyles('fontColor') || '#000000';
                    verticalAlign = getNodeInfo.getStyles('verticalAlign') || 'middle';
                    rotation = getNodeInfo.getStyles('rotation') || 0;
                    flipH = getNodeInfo.getStyles('flipH') || 0;
                    flipV = getNodeInfo.getStyles('flipV') || 0;
                    align = getNodeInfo.getStyles('align') || 'center';
                    fontSize = getNodeInfo.getStyles('fontSize') || '12';
                    strokeStyle = getNodeInfo.getStyles('dashed')
                    strokeColor = (shapeName.includes('image') ? getNodeInfo.getStyles('imageBorder') : getNodeInfo.getStyles('strokeColor')) || 'none';
                    // 图片地址
                    image = getNodeInfo.getStyles('image') || null;
                    x = parseFloat(node.childNodes[0].getAttribute('x')) || 0;
                    y = parseFloat(node.childNodes[0].getAttribute('y')) || 0;
                    width = parseFloat(node.childNodes[0].getAttribute('width'));
                    hide = item.getAttribute('hide');
                    height = parseFloat(node.childNodes[0].getAttribute('height'));
                    selectProps = item.getAttribute('selectProps') || '';
                    defaultProp = item.getAttribute('defaultProp') || '';
                    // edge获取路径节点
                    if (shapeName === 'endarrow' || shapeName === 'beeline' || shapeName === 'curve') {
                        const childNodes = node.getElementsByTagName('mxGeometry')[0].childNodes;
                        points = {
                            points: []
                        };
                        for (let childNode of childNodes) {
                            let asText = childNode.getAttribute('as')
                            if (asText === 'sourcePoint') {
                                // 起点
                                points.source = [parseFloat(childNode.getAttribute('x')) || 0, parseFloat(childNode.getAttribute('y')) || 0];
                            } else if (asText === 'targetPoint') {
                                // 终点
                                points.target = [parseFloat(childNode.getAttribute('x')) || 0, parseFloat(childNode.getAttribute('y')) || 0];
                            } else if (asText === 'points') {
                                // 节点
                                for (let point of childNode.childNodes) {
                                    points.points.push([parseFloat(point.getAttribute('x')) || 0, parseFloat(point.getAttribute('y')) || 0])
                                }
                            }
                        }
                        let reviseX, reviseY = 0;
                        // 最小左侧
                        let leftList = [].concat(points.source[0], points.target[0])
                        leftList = points.points.reduce((item, val) => {
                            item.push(val[0])
                            return item
                        }, leftList);
                        reviseX = Math.min.apply(null, leftList);
                        let maxX = Math.max.apply(null, leftList);
                        // // 最小顶部
                        let topList = [].concat(points.source[1], points.target[1])
                        topList = points.points.reduce((item, val) => {
                            item.push(val[1])
                            return item
                        }, topList);
                        reviseY = Math.min.apply(null, topList);
                        let maxY = Math.max.apply(null, topList);
                        // 修正定位
                        points.source[0] -= reviseX;
                        points.source[1] -= reviseY;
                        points.target[0] -= reviseX;
                        points.target[1] -= reviseY;
                        points.points.map(val => {
                            val[0] -= reviseX;
                            val[1] -= reviseY;
                        })
                        x = reviseX;
                        y = reviseY;
                        width = Math.abs(maxX - reviseX);
                        width = width < 10 ? 10 : width;
                        height = Math.abs(maxY - reviseY);
                        height = height < 10 ? 10 : height;
                        if (shapeName !== 'curve') {
                            if (shapeName === 'endarrow') {
                                if (points.target[0] == 0 && points.target[1] == 0) {
                                    if (points.source[0] < points.source[1]) {
                                        points.target[0] = 4;
                                        points.source[0] = 4;
                                    } else {
                                        points.target[1] = 4;
                                        points.source[1] = 4;
                                    }
                                } else if (points.source[1] == 0 && points.target[0] == 0) {
                                    if (points.source[0] > points.target[1]) {
                                        points.target[1] -= 4;
                                    } else {
                                        points.target[0] = 4;
                                        points.source[0] = 4;
                                    }
                                } else if (points.source[0] == 0 && points.target[1] == 0) {
                                    if (points.source[1] > points.target[0]) {
                                        points.target[0] -= 4;
                                    } else {
                                        points.target[1] = 4;
                                        points.source[1] = 4;
                                    }
                                } else if (points.source[0] == 0 && points.source[1] == 0) {
                                    if (points.target[1] > points.target[0]) {
                                        points.target[0] -= 4;
                                    } else {
                                        points.target[1] -= 4;
                                    }
                                }
                            }
                            if (points.target[0] == 0 && points.source[0] == 0) {
                                points.target[0] = 4;
                                points.source[0] = 4;
                            }
                            if (points.target[1] == 0 && points.source[1] == 0) {
                                points.target[1] = 4;
                                points.source[1] = 4;
                            }
                        }
                    }
                    (x < minX || minX === null) && (minX = x);
                    (y < minY || minY === null) && (minY = y);
                    let obj = {
                        id,
                        shapeName,
                        x,
                        y,
                        width,
                        height,
                        fillColor,
                        strokeColor,
                        strokeStyle,
                        value,
                        isGroup,
                        fontColor,
                        fontSize,
                        image,
                        smartBiLink,
                        actionsInfo,
                        statesInfo,
                        bindData,
                        hide,
                        verticalAlign,
                        align,
                        selectProps,
                        defaultProp,
                        points,
                        rotation,
                        flipH,
                        flipV
                    };
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
                    obj.children = getNode(id);
                    list.push(obj);
                }
            }
            return list;
        };
        let cells = getNode();
        cells.map(cell => {
            // 修正最外层节点的定位信息
            cell.x -= minX - 20;
            cell.y -= minY - 20;
            // 计算页面高度
            pageWidth = ((cell.x + cell.width) > pageWidth ? cell.x + cell.width : pageWidth) + 20;
            pageHeight = ((cell.y + cell.height) > pageHeight ? cell.y + cell.height : pageHeight) + 20;
        })
        return cells;
    }
    // 清空页面内容
    clearPage() {
        this.gePreview.innerHTML = ''
    }
    // 解析页面
    parsePage(page, fileSystem, shapeXlms) {
        const xmlDoc = mxUtils.parseXml(page.xml).documentElement
        const root = xmlDoc.getElementsByTagName('root')[0].childNodes
        const bodyBackground = xmlDoc.getAttribute('background'); // 新增全背景色
        document.body.setAttribute('style', `background:${bodyBackground}`)
        const list = []
        for (let i = 0; i < root.length; i++) {
            list.push(root[i])
        }
        // 页面宽度和高度
        pageWidth = pageHeight = 0
        let cells = this.parseCells(list)
        this.renderPageId = page.id
        this.wsParams = [];
        if (page.type === 'normal') {
            // 清除全部websocket
            for (let key in applyData) {
                destroyWs(applyData, key)
            }
            pointData = Object.assign({});
            document.getElementById('geDialogs').innerHTML = ''
            // 正常的最小x、y偏移量
            minX = minY = null
            // 清空页面内容
            this.clearPage()
            // 正常页面      
            this.renderPages(cells, this.gePreview, fileSystem, shapeXlms)
            this.gePreview.style.width = pageWidth + 'px'
            this.gePreview.style.height = pageHeight + 'px'
        } else {
            // 弹窗页面
            let layerContent = this.createDialog(page.id, page.title)
            layerContent.innerHTML = ``;
            this.renderPages(cells, layerContent, fileSystem, shapeXlms)
        }
        applyData[page.id] = {
            ws_real: '',
            ws_alarm: '',
            data: {},
            wsParams: this.wsParams,
            lockWs: false
        };

        applyData[page.id].ws_real = createWsReal(page.id, pointData, pointParams, applyData, layerData, this.mainProcess)
        applyData[page.id].ws_alarm = createWsAlarm(page.id, pointParams, applyData), layerData, this.mainProcess
        return cells;
    }
    // 渲染页面
    renderPages(cells, ele = this.gePreview, fileSystem, shapeXlms) {
        for (let cell of cells) {
            if (cell.bindData) {
                this.wsParams.push({
                    pointId: cell.bindData.point,
                    params: cell.bindData.params.map(val => {
                        return val.name
                    }).join()
                })
                pointParams = this.wsParams
            }
            let cellHtml = this.renderCell(cell, fileSystem, shapeXlms);
            ele.appendChild(cellHtml);
            // 组内资源
            if (cell.children.length) {
                this.renderPages(cell.children, cellHtml, fileSystem, shapeXlms);
            }
        }
    }

    // 渲染控件节点
    renderCell(cell, fileSystem, shapeXlms) {
        const shapeName = cell.shapeName;
        let cellHtml;
        if (shapeName === 'image') {
            // 图片
            cellHtml = insertImage(cell, fileSystem)
        } else if (shapeName === 'linkTag') {
            // smartBi链接iframe
            cellHtml = document.createElement('iframe');
            let curLink
            if (cell.actionsInfo) {
                curLink = cell.smartBiLink || cell.actionsInfo[0].link
            }
            cellHtml.setAttribute('src', `${/^(https|http):\/\//.test(curLink) ? '' : 'http://' }${curLink}`);
        } else if (shapeName === 'menuCell' || shapeName === 'menulist') {
            // 菜单
            cellHtml = document.createElement('div');
            cellHtml.innerHTML = cell.value;
        } else if (shapeName === 'select') {
            // 下拉框
            cellHtml = document.createElement('select');
            const selectProps = cell.selectProps.split(',');
            cellHtml.innerHTML = `
        <option>请选择</option>
        ${
    selectProps.map(prop => `
            <option ${prop === cell.defaultProp ? 'selected' : ''}>${prop}</option>
          `).join('')
}
      `
        } else if (shapeName === 'singleCheck') {
            // 单选框
            cellHtml = document.createElement('input');
            cellHtml.setAttribute('type', 'radio');
        } else if (shapeName === 'multipleCheck') {
            // 多选框
            cellHtml = document.createElement('input');
            cellHtml.setAttribute('type', 'checkbox');
        } else if (shapeName === 'text') {
            // 文本
            cellHtml = document.createElement('span');
            cellHtml.innerHTML = cell.value;
            // 还原位置与界面工具一样
            if (cellHtml.firstChild && cellHtml.firstChild.style) {
                cellHtml.firstChild.style.display = 'inline-block'
            }
        } else if (shapeName === 'button') {
            // 按钮
            cellHtml = document.createElement('div');
            cellHtml.innerHTML = cell.value;
        } else if (shapeName === 'endarrow' || shapeName === 'beeline' || shapeName === 'curve') {
            // 箭头、直线，曲线
            cellHtml = inserEdge(cell)
        } else if (configSvg.includes(shapeName)) {
            // svg图
            cellHtml = insertSvg(shapeName, cell.width, cell.height, cell.x, cell.y, cell.fillColor, cell.strokeColor, shapeXlms)
        }  else if(shapeName === 'progress') {
            cellHtml = dealProgress(cell)
        } else if (shapeName.includes('pipeline')) {
            cellHtml = dealPipeline(cell)
        } else if (shapeName.includes('Chart')) {
            cellHtml = dealCharts(cell)
        }
        else {
            // 其他
            cellHtml = document.createElement('p');
            if(shapeName === 'ellipse') {
                cellHtml.style.borderRadius = "50%"
            } else if (shapeName == 'light') {
                cellHtml.style.background = `url(${cell.image}) no-repeat`
                cellHtml.style.backgroundSize = '100% 100%'
            }
            cellHtml.innerHTML = cell.value;
        }
        if (!['endarrow', 'beeline', 'curve','circle'].includes(shapeName)) {
            if (cell.verticalAlign === 'top') {
                cellHtml.style.lineHeight = cell.fontSize + 'px';
            } else if (cell.verticalAlign === 'bottom') {
                cellHtml.style.lineHeight = (cell.height * 2 - cell.fontSize) + 'px';
            } else {
                cellHtml.style.lineHeight = cell.height + 'px';
            }
            cellHtml.style.textAlign = cell.align;
            
            if (cell.children.length > 0 && cell.fillColor === '#FFFFFF') {
                cellHtml.style.backgroundColor = 'transparent';
            } else if(shapeName.includes('pipeline')) {
                cellHtml.style.backgroundColor = 'transparent';
            }else {
                cellHtml.style.backgroundColor = cell.fillColor; // 原来的写法
            }
        } else {
            cellHtml.style.lineHeight = 0;
        }
        // 非Edge和svg控件
        if (!['endarrow','curve', 'circle','beeline'].includes(shapeName) && !configSvg.includes(shapeName)) {
            let borderStyle = 'solid'
            if(cell.strokeStyle) {
                borderStyle = 'dashed'
            }
            cellHtml.style.border = `${cell.strokeColor == 'none' ? '' : `1px ${borderStyle} ${cell.strokeColor || defaultStyle.strokeColor}`}`;
            cellHtml.style.width = cell.width + 'px';
            cellHtml.style.height = cell.height + 'px';
        }
        cellHtml.className = 'gePalette';
        // 隐藏
        if (cell.hide == 'true') {
            cellHtml.style.display = 'none';
        }
        // 旋转
        cellHtml.style.transform = `rotate(${cell.rotation}deg) ${cell.flipV == 1 ? ' scaleY(-1)' : ''} ${cell.flipH == 1 ? ' scaleX(-1)' : ''}`;
        // 字体大小
        cellHtml.style.fontSize = `${cell.fontSize}px`;
        // 字体颜色
        cellHtml.style.color = `${cell.fontColor}`;
        // 定位
        cellHtml.style.left = cell.x + 'px';
        cellHtml.style.top = cell.y + 'px';
        cellHtml.id = `palette_${cell.id}`
        // 绑定事件
        bindEvent(cellHtml, cell.actionsInfo, this.mainProcess)
        //绑定状态
        bindState(cellHtml,cell.statesInfo)
        // 浮窗
        if (cell.bindData && cell.bindData.point && cell.bindData.params.length > 0) {
            if (cell.bindData.fillVariable) {
                // 需要填充数据
                cellHtml.className += ` ${cell.bindData.point} ${cell.bindData.point}_text`
                cellHtml.setAttribute('data-filltext', cell.bindData.params.map(item => {
                    return item.name
                }).join(","));
                cellHtml.innerHTML = ''
            } else {
                // 根据接收数据
                cellHtml.className += ` ${cell.bindData.point}`
            }
            cellHtml.setAttribute('data-defaultFill', cell.fillColor)
            // 显示
            cellHtml.addEventListener('mousemove', (e) => {
                const bodyScrollTop = document.getElementsByTagName('body')[0].scrollTop// body滚动
                const bodyScrollLeft = document.getElementsByTagName('body')[0].scrollLeft
                const htmlScrollTop = document.getElementsByTagName('html')[0].scrollTop// 最外层滚动
                const htmlScrollLeft = document.getElementsByTagName('html')[0].scrollLeft
                layerData = cell.bindData
                this.renderLayer()
                this.formatLayer.style.left = e.clientX + bodyScrollLeft + htmlScrollLeft + 5 + 'px'
                this.formatLayer.style.top = e.clientY + bodyScrollTop + htmlScrollTop + 5 + 'px'
                this.formatLayer.style.opacity = '1'
            })
            // 隐藏
            cellHtml.addEventListener('mouseleave', () => {
                this.formatLayer.style.opacity = 0
                layerData = null
            })
        }
        return cellHtml;
    }
    // 渲染浮窗
    renderLayer() {
        this.formatLayer.innerHTML = ''
        const data = Object.assign({}, pointData[layerData.point]);
        if (!Object.keys(data).length) {
            return
        }
        let params = [{
            name: 'timestamp'
        }].concat(layerData.params)
        let leftKeys = document.createElement('ul')
        leftKeys.id = 'leftKeys'
        let rightKeys = document.createElement('ul')
        rightKeys.id = 'rightKeys'
        // 填充内容
        for (let param of params) {
            let leftInfo = document.createElement('li')
            leftInfo.innerHTML = `${param.name}=`;
            let rightInfo = document.createElement('li')
            rightInfo.innerHTML = data[param.name]
            rightInfo.innerHTML = param.name === 'timestamp' ? data[param.name] : data[param.name] !== undefined ? data[param.name] : 'NaN'
            leftKeys.appendChild(leftInfo)
            rightKeys.appendChild(rightInfo)
        }
        this.formatLayer.appendChild(leftKeys)
        this.formatLayer.appendChild(rightKeys)
    }
}

export default PreviewPage
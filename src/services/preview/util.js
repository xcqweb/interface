import {getCookie, setCookie} from '../Utils'
import {data1,data2} from '../../constants/chart-default-data'
import {mxUtils} from '../../services/mxGlobal'
import echarts from 'echarts'
import requestUtil from '../../services/request'
import urls from '../../constants/url'
import {drawArrow} from './draw-arrow'

/**
 * 移除dom节点
 * @param {object} ele 
 */
function removeEle(ele) {
    const parent = ele.parentNode;
    if (parent) {
        parent.removeChild(ele);
    }
}

/**
 * 关闭websocket
 * @param {string} pageId 
 */
function destroyWs(applyData,pageId) {
    if(applyData[pageId].wsReal) {
        applyData[pageId].wsReal.close()
        delete applyData[pageId]
    }
}

/**
 * 封装ajax请求
 * @param {string} url  请求地址
 * @param {string} method 请求方法，默认GET方法
 * @param {object} data 请求参数
 */
async function geAjax(url, method = 'GET', data = null) {
    return new Promise((resolve)=>{
        callAjax()
        function callAjax() {
            let token = getCookie('token')
            let refreshToken = getCookie('refreshToken')
            $.ajax({
                method,
                headers: {
                    "Content-Type": 'application/json;charset=utf-8',
                    "Authorization": 'Bearer ' + token
                },
                data:data,
                url:`${window.location.origin}/${url}`,
                success: function(res) {
                    resolve(res)
                },
                error:function(res) {
                    if (res.status == 418) {
                        geAjax('api/auth/refreshToken', 'POST', {
                            refreshToken
                        }).then(res => {
                            setCookie('token', res.token);
                            setCookie('refreshToken', res.refreshToken)
                            callAjax()
                        })
                    }
                }
            })
        }
    })
}

/**
 * 插入图片
 * @param {object} cell 
 */
function insertImage(cell) {
    let con = document.createElement('div')
    if(cell.image) {
        con.style.background = `url('${cell.image}') no-repeat`
        con.style.backgroundPosition = "center center"
        con.style.backgroundSize = "100% 100%"
    }
    return con
}

/**
 * 插入箭头结尾的svg
 * @param {Array} source 起始点
 * @param {Array} target 结束点
 */
function insertEdge(cell) {
    let {startArrow, endArrow, strokeStyle,edgeProps} = cell
    let which = 0//是否有箭头
    let isDash = false //是否虚线
    if (startArrow != 'none' && endArrow != 'none') {
        which = 3
    } else if (startArrow == 'classic') {
        which = 2
    } else if (endArrow == 'classic') {
        which = 1
    }
    if (strokeStyle && strokeStyle == 1 ) {
        isDash = true
    }
    let con = document.createElement('div')
    let canvas = document.createElement('canvas')
    canvas.width = cell.width 
    canvas.height = cell.height
    let ctx = canvas.getContext("2d")
    if (edgeProps) {
        drawArrow(ctx, edgeProps.sx - cell.x, edgeProps.sy - cell.y, edgeProps.tx - cell.x, edgeProps.ty - cell.y, which, cell.strokeColor, cell.strokeWidth,isDash)
    }
    con.appendChild(canvas)
    return con
}

/**
 * 显示事件
 */
function actionShow(action, mainProcess) {
    if (action.innerType === 'palette') {
        let hide = $('#palette_' + action.link).data('hide')
        document.getElementById('palette_' + action.link).style.display = hide === 'true' ? 'block' : 'none'
    } else {
        mainProcess.renderPageFun(action.link)
    }
}

/**
 * 打开事件
 */
function actionOpen(action, mainProcess) {
    if (action.type === 'out') {
        // 打开外部链接
        window.location.href = `${/^(https|http):\/\//.test(action.link) ? '' : 'http://'}${action.link}`;
    } else if (action.innerType === 'page') {
        // 打开页面
        const pageType = mainProcess.getPageType(action.link)
        if (pageType === 'normal' && mainProcess.pageId !== action.link) {
            mainProcess.changePage(action.link,true)
        } else if (pageType === 'dialog') {
            mainProcess.renderPageFun(action.link)
        }
    }
}
/**
 * 关闭事件
 */
function actionClose(action, applyData) {
    if (action.innerType === 'page' && action.type === 'in' && document.getElementById(action.link)) {
        removeEle(document.getElementById(action.link));
        removeEle(document.getElementById('bg_' + action.link));
        //有浮窗在的隐藏浮窗
        hideFrameLayout()
        destroyWs(applyData,action.link);
    }
}
/**
 * 隐藏浮窗
 */
function hideFrameLayout() {
    let formatLayerEl = $("#formatLayer")
    formatLayerEl.html(" ")
    formatLayerEl.hide()
}
/**
 * 触发事件
 * @param {object} action 
 */
function effectEvent(action, mainProcess, applyData, fileSystem) {
    switch (action.effectAction) {
        case 'show':
            actionShow(action, mainProcess)
            break;
        case 'hide':
            actionHide(action, applyData)
            break;
        case 'open':
            actionOpen(action, mainProcess)
            break;
        case 'close':
            actionClose(action, applyData)
            break;
        case 'change'://控件切换状态
            actionChange(action, fileSystem)
            break;
        default:
            break;
    }
}
/**
 * 把目标控件切换 为选中的状态
 * @param {*} action 
 * @param {*} cellInfo 
 */
function actionChange(action, fileSystem) {
    let cellCon = document.getElementById('palette_' + action.link)
    let {stateInfo} = action
    if (stateInfo.animateCls) {
        cellCon.classList.add(stateInfo.animateCls)
    }
    let imgInfo = stateInfo.imgInfo
    for (let key in stateInfo.style) {
        cellCon.style[key] = stateInfo.style[key]
    }
    if(imgInfo) {
        imgInfo.url = imgInfo.url.replace(/getechFileSystem\//, fileSystem)
        cellCon.style.background = `url(${imgInfo.url}) center center no-repeat`
        cellCon.style.backgroundSize = '100% 100%'
    }
}

/**
 * 隐藏事件
 */
function actionHide(action, applyData) {
    if (action.innerType === 'palette') {
        let hide = $('#palette_' + action.link).data('hide')
        document.getElementById('palette_' + action.link).style.display = hide === 'true' ? 'block' : 'none'
    } else if (document.getElementById(action.link)) {
        removeEle(document.getElementById(action.link));
        removeEle(document.getElementById('bg_' + action.link));
        // 断开websocket
        destroyWs(applyData,action.link);
    }
}

/**
 * 绑定事件 （2019.8.30 版本后，mouseEvent只有click事件了，为了兼容以前的生产版本上的应用，暂时留着其他的事件）
 * @param {object} ele DOM节点
 * @param {Array} ele DOM节点
 */
function bindEvent(ele, cellInfo, mainProcess, applyData, fileSystem) {
    let {actionsInfo} = cellInfo
    if (actionsInfo) {
        ele.style.cursor = "pointer"
        for (let action of actionsInfo) {
            ele.addEventListener(action.mouseEvent, function(e) {
                e = e || window.event;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }
                // 触发事件
                effectEvent(action, mainProcess, applyData,fileSystem)
            })
        }
    }
}

/**
 * 提示信息
 * @param {boolean} flag 失败提示还是成功提示 
 */
function showTips(flag = true, title = '请求') {
    let dialog = document.createElement('div');
    dialog.className = 'geDialog';
    // 遮罩层
    let bg = document.createElement('div')
    bg.className = 'bg';
    document.body.appendChild(bg)
    // 图标
    let icon = document.createElement('img');
    icon.setAttribute('src', `${window.PREFIX_PATH}/static/images/icon/defalult/${flag ? 'error' : 'success'}.png`)
    // 文本
    let msg = document.createElement('p')
    msg.innerHTML = `${title}${flag ? '成功' : '失败'}`
}
//插入进度条
function dealProgress(cell) {
    let con = document.createElement('div')
    let {progressProps} = cell
    let progressPropsObj = JSON.parse(progressProps)
    $(con).data("progressPropsObj", progressPropsObj)
    let progressTop = -(cell.height - 2)
    let progress = `<div class="progressbar-wrap" style="width:${cell.width}px;height:${cell.height}px;">
            <div class="progressbar-common progressbar-back" style="height:${cell.height}px;"></div> 
            <div class="progressbar-common progressbar" style="height:${cell.height - 4}px;top:${progressTop}px;left:2px;width:0;border:0;"/>
            <div class="progressbar-text" style="position:relative;width:${cell.width - 4}px;height:${cell.height - 4}px;line-height:${cell.height - 4}px;"></div>
        </div>`
    con.innerHTML = progress
    return con
}

function dealPipeline(cell) {
    let pipeline1ImgUrl = 'static/stencils/basic/pipeline1.svg'
    let pipeline2ImgUrl = 'static/stencils/basic/pipeline2.svg'
    let pipeline3ImgUrl = 'static/stencils/basic/pipeline3.svg'
    let con = document.createElement('div')
    let pipelineProps = cell.pipelineProps
    let pipelinePropsObj
    if (pipelineProps) {
        pipelinePropsObj = JSON.parse(pipelineProps)
        pipeline1ImgUrl = 'static/stencils/basic/pipeline_forward.svg'
        if(pipelinePropsObj.flow == 'back') {
            pipeline1ImgUrl = 'static/stencils/basic/pipeline_back.svg'
        }
    }
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', cell.width)
    svg.setAttribute('height', cell.height)

    let image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    if(cell.shapeName == 'pipeline1') {
        image.setAttribute('href', pipeline1ImgUrl)
    } else if(cell.shapeName == 'pipeline2') {
        image.setAttribute('href', pipeline2ImgUrl)
    } else if(cell.shapeName == 'pipeline3') {
        image.setAttribute('href', pipeline3ImgUrl)
    }
    image.setAttribute('width', cell.width)
    image.setAttribute('height', cell.height)
    svg.appendChild(image)
    con.appendChild(svg)
    return con
}
function createSelect(params) {
    let defaultParamIndex = 0
    defaultParamIndex = params.findIndex(item => {
        return item.type
    })
    if(defaultParamIndex == -1) {
        defaultParamIndex = 0
    }
    let defaultParam = params[defaultParamIndex]
    params.splice(defaultParamIndex,1)
    params.unshift(defaultParam)
    let select = document.createElement('select')
    select.style.cssText = "width:132px;"

    params.forEach((item,index)=>{
        select.innerHTML += `<option value=${index}>${item.partName || ""} ${item.partName ? '/' : ''} ${item.paramName}</option>`
    })
    return select
}
function dealCharts(mainProcess,cell) {
    let con = document.createElement('div')
    let selectCon = document.createElement('div')
    let needAddEvent = false
    if(cell.bindData && cell.bindData.params) {
        let params = cell.bindData.params
        selectCon.style.cssText = `display:flex;position:relative;width:${cell.width}px;height:24px;left:0;top:24px;justify-content:flex-end;z-index:10;`
        if(params.length > 1) {
            selectCon.append(createSelect(params))
        }
        needAddEvent = true
        con.appendChild(selectCon)
    }
    
    let chartCon = document.createElement('div')
    chartCon.style.cssText = `position:relative;left:0;top:0;width:${cell.width + parseInt(cell.strokeWidth)}px;height:${cell.height + parseInt(cell.strokeWidth)}px;`
    chartCon.className = "chart-con"
    con.appendChild(chartCon)
    let chartAttr = cell.chartProps
    let options = {}
    if (chartAttr) {
        options = JSON.parse(chartAttr)
    }else{
        if(cell.shapeName == 'lineChart') {
            options = data1
        }else{
            options = data2
        }
    }
    let fun = (isRefresh) => {
        let myEchart = echarts.init(chartCon)
        if (cell.bindData && cell.bindData.dataSource && cell.bindData.dataSource.deviceTypeChild && cell.bindData.params && cell.bindData.params.length) {
            let temp = $(con).data("paramShowDefault")
            if(temp) {
                let titleShow = temp.paramName
                let paramId = temp.paramId
                let paramType = temp.paramType
                let devices = cell.bindData.dataSource.deviceNameChild
                if(!Array.isArray(devices)) {
                    devices = [devices]
                }
                if (cell.shapeName == 'lineChart') {
                    let tempOptions = JSON.parse(JSON.stringify(options))
                    tempOptions.xAxis.data = []
                    tempOptions.yAxis.name = titleShow
                    let tempLegend = [], tempSeries = []
                    let markLine = tempOptions.series[0].markLine
                    let markLineMax = 0, markValArr = []
                    let paramIds = []
                    devices.forEach((device,index)=>{
                        paramIds[index] = dealDefaultParams(device.id,temp,$(con).data('subParams')).deviceParamId
                    })
                    requestUtil.get(`${urls.timeSelect.url}${paramId}`, {paramType: paramType == 'device' ? 0 : 1}).then(res => {
                        let checkItem = res.durations.find((item) => {
                            return item.checked === true
                        })
                        let chartDataLen = Math.ceil(checkItem.duration / res.rateCycle)
                        $(con).data("chartDataLen", chartDataLen)
                        if (markLine && markLine.data && markLine.data.length) {
                            markLine.data.forEach(item => {
                                markValArr.push(item.yAxis)
                            })
                            markLineMax = Math.max(...markValArr)
                        }
                        let pentSdbParams = []
                        devices.forEach((item,index)=>{
                            pentSdbParams.push({
                                paramIds:[paramIds[index]],
                                deviceId:item.id,
                                period:checkItem.duration,
                            })
                        })
                        let hasData = false
                        requestUtil.post(`${urls.pentSdbData.url}`, pentSdbParams).then(res => {
                            if (res && res.length) {
                                for(let i = 0;i < res.length;i++) {
                                    if(JSON.stringify(res[i]) === '{}') {
                                        continue
                                    }
                                    let tempArr = res[i]
                                    let device = devices[i]
                                    tempLegend.push(device.name)
                                    tempOptions.legend.data = tempLegend
                                    tempSeries.push({
                                        type: 'line',
                                        name: device.name,
                                        markLine: markLine,
                                        data: [],
                                        deviceId: device.id, //设备id，额外添加的，匹配数据时候用
                                    })
                                    if(tempArr && tempArr.resMap && JSON.stringify(tempArr.resMap) !== '{}') {
                                        let keys = Object.keys(tempArr.resMap).sort((a,b)=>a - b)
                                        for (let key of keys) {
                                            if(i == 0) {
                                                tempOptions.xAxis.data.push(timeFormate(key, false))//x轴数据一样 ，只放一次
                                            }
                                            tempSeries[i].data.push(tempArr.resMap[key])
                                        }
                                        tempOptions.yAxis.max = Math.max(...tempSeries[i].data, markLineMax)
                                        tempOptions.series = tempSeries
                                        hasData = true
                                    }
                                }
                                if(hasData) {
                                    myEchart.setOption(tempOptions)
                                }else{
                                    myEchart.setOption(options)//默认图表
                                }
                            }
                        },()=>{
                            myEchart.setOption(options)
                        })
                    })
                } else {
                    if(isRefresh) {
                        let data = mainProcess.realData.find(item=>{
                            return item.deviceId = devices[0].id
                        })
                        let val = 0
                        if(data) {
                            val = data[temp.deviceParamId] || 0
                        }
                        options.series.data = [{value: val, name: titleShow}]
                    }else{
                        options.series.data = [{value: 0, name: titleShow}]
                    }
                    options.series.name = titleShow
                    myEchart.setOption(options)
                }
            }else{
                myEchart.setOption(options)
            }
        } else {
            myEchart.setOption(options)
        }
    }
    if(needAddEvent) {
        $(selectCon).on('change','select',function() {
            let params = $(con).data("paramShow")
            $(this).data("paramShowDefault",params[$(this).val()])
            fun(true)
        })
    }
    $(()=>{
        fun()
    })
    return con
}
function dealDefaultParams(deviceId,defaultParam,subParams) {
    if(defaultParam.deviceParamId) {
        return defaultParam
    }
    let {partId,paramId} = defaultParam
    let resDeviceParamArr,resDeviceParam
    resDeviceParamArr = subParams.find(item=>{
        return item.deviceId = deviceId
    })
    if(resDeviceParamArr && resDeviceParamArr.length) {
        for(let i = 0;i < resDeviceParamArr.length;i++) {
            let item = resDeviceParamArr[i]
            if (item.includes(paramId)) {
                if (!partId || item.includes(partId)) {
                    resDeviceParam = item
                    break
                }
            }
        }
    }
    defaultParam.deviceParamId = resDeviceParam
    return defaultParam
}
 
function dealLight() {
    let con = document.createElement('div')
    con.style.background = `url('../../..${window.PREFIX_PATH}/static/stencils/basic/light.png') no-repeat`
    con.style.backgroundPosition = "center center"
    con.style.backgroundSize = "100% 100%"
    return con
}
//保留2位小数，如：2，还会保留2 不会补0
function toDecimal2NoZero(x) {
    var f = Math.round(x * 100) / 100
    var s = f.toString()
    return s
}
function throttleFun(fun, delay) {
    let prvTm = Date.now(),result = null
    return function() {
        let context = this
        let args = arguments
        let now = Date.now()
        if (now - prvTm >= delay) {
            result = fun.apply(context, args)
            prvTm = Date.now()
        }
        return result
    }
}
function timeFormate(time,isMilliSecond) {
    time = +time || new Date().getTime()
    const timeEle = new Date(time)
    const year = timeEle.getFullYear()
    const month = timeEle.getMonth() + 1
    const day = timeEle.getDate()
    const hours = timeEle.getHours()
    const minute = timeEle.getMinutes()
    const second = timeEle.getSeconds()
    const cmSecond = timeEle.getUTCMilliseconds()
    let res = `${year}/${month > 9 ? month : '0' + month}/${day > 9 ? day : '0' + day} ${hours > 9 ? hours : '0' + hours}:${minute > 9 ? minute : '0' + minute}:${second > 9 ? second : '0' + second}`
    if(isMilliSecond) {
        res += `.${cmSecond}`
    }
    return res
}
//获取设备id
function getDeviceId(dpId) {
    const HEADER_SPLITE = ":"
    const CENTER_SPLITE = "|"
    const INVENTED_PARAM = "VP"
    const DEVICE_PARAM = "P"
    let strs,deviceId
    if (dpId.includes(INVENTED_PARAM + HEADER_SPLITE)) {
        dpId = dpId.substring(3)
    } else if (dpId.includes(DEVICE_PARAM + HEADER_SPLITE)) {
        dpId = dpId.substring(2)
    }
    strs = dpId.split(CENTER_SPLITE)
    deviceId = strs[0]
    return deviceId
}
function insertSvg(shapeXmls,key,cell) {
    let {width,height,fillColor,strokeColor,strokeWidth,strokeStyle} = cell
    let inner = shapeXmls[key].path
    inner.setAttribute('fill', fillColor)
    inner.setAttribute('stroke', strokeColor)
    inner.setAttribute('stroke-width', strokeWidth)
    inner.setAttribute('vector-effect','non-scaling-stroke')
    let dashArr = '0 0'
    if(strokeStyle) {
        dashArr = `${strokeWidth * 3} ${strokeWidth * 3}`
    }
    inner.setAttribute('stroke-dasharray',dashArr)
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', shapeXmls[key].viewBox)
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    svg.innerHTML = inner.outerHTML
    return svg
}
function dealTriangle(cell) {
    let {width,height,fillColor,strokeColor,strokeWidth,value,fontColor,strokeStyle} = cell
    let con = document.createElement('div')
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    let dashArr = '0 0'
    if(strokeStyle) {
        dashArr = `${strokeWidth * 3} ${strokeWidth * 3}`
    }
    svg.innerHTML = `<path d="M ${strokeWidth} ${strokeWidth} L ${width - strokeWidth} ${height / 2 - strokeWidth} L ${strokeWidth} ${height - strokeWidth} Z" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-dasharray="${dashArr}">`
    con.appendChild(svg)
    let textCon = document.createElement('div')
    textCon.style.cssText = `width:${width}px;height:${height}px;position:absolute;color:${fontColor};left:0;top:0;`
    textCon.innerHTML = `${value}`
    con.appendChild(textCon)
    return con
}
function dealPentagram(mainProcess,cell) {
    let {width,height,value,fontColor} = cell
    let con = document.createElement('div')
    let content = insertSvg(mainProcess.shapeXmls,'pentagram',cell)
    con.appendChild(content)
    let textCon = document.createElement('div')
    textCon.style.cssText = `width:${width}px;height:${height}px;position:absolute;color:${fontColor};left:0;top:0;`
    textCon.innerHTML = `${value}`
    con.appendChild(textCon)
    return con
}
/**
 * 加载控件的xml配置文档
 */
function loadShapeXml() {
    return new Promise((resolve) => {
        mxUtils.get(`../../..${window.PREFIX_PATH}/static/stencils/preview.xml`, function(res) {            
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
export {
    removeEle, destroyWs, geAjax, insertImage, insertEdge, bindEvent, showTips, timeFormate,dealTriangle,dealPentagram,loadShapeXml,
    dealProgress, dealPipeline, dealCharts, dealLight, toDecimal2NoZero, throttleFun, hideFrameLayout, getDeviceId,dealDefaultParams,insertSvg
}
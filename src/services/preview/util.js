import {getCookie, setCookie} from '../Utils'
import {data1,data2} from '../../constants/chart-default-data'
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
    return new Promise((resolve,reject)=>{
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
                url,
                success: function(res) {
                    resolve(res)
                },
                error:function(res) {
                    if (res.status == 418) {
                        geAjax('/api/auth/refreshToken', 'POST', {
                            refreshToken
                        }).then(res => {
                            setCookie('token', res.token);
                            setCookie('refreshToken', res.refreshToken)
                            callAjax()
                        })
                    }
                    reject(res)
                }
            })
        }
    })
}

/**
 * 插入图片
 * @param {object} cell 
 */
function insertImage(cell, fileSystem) {
    let con = document.createElement('div')
    if(cell.image) {
        cell.image = cell.image.replace(/getechFileSystem\//, fileSystem)
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
        document.getElementById('palette_' + action.link).style.display = '';
    } else {
        mainProcess.renderDialog(action.link)
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
            mainProcess.pageId = action.link
            mainProcess.renderNormal()
        } else if (pageType === 'dialog') {
            mainProcess.renderDialog(action.link)
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
    let shapeName = $(cellCon).data("shapeName")
    if (stateInfo.animateCls) {
        cellCon.classList.add(stateInfo.animateCls)
    }
    if (shapeName == 'light') {
        dealLightFill(cellCon,stateInfo.style.background)
        return
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
        document.getElementById('palette_' + action.link).style.display = 'none';
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
    icon.setAttribute('src', `/static/images/icon/defalult/${flag ? 'error' : 'success'}.png`)
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

function dealCharts(cell) {
    let con = document.createElement('div')
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
    document.addEventListener("initEcharts",()=>{
        let myEchart = echarts.init(con)
        if (cell.bindData && cell.bindData.dataSource && cell.bindData.dataSource.deviceTypeChild && cell.bindData.params) {
            let titleShow = cell.bindData.params[0].paramName
            let devices = cell.bindData.dataSource.deviceNameChild
            if (cell.shapeName == 'lineChart') {
                let deviceTypeId = cell.bindData.dataSource.deviceTypeChild.id
                requestUtil.get(`${urls.timeSelect.url}${deviceTypeId}`).then(res => {
                    let checkItem = res.durations.find((item) => {
                        return item.checked === true
                    })
                    let chartDataLen = Math.ceil(checkItem.duration / res.rateCycle)
                    $(con).data("chartDataLen", chartDataLen)
                    let nowTs = +new Date()
                    options.xAxis.data = []
                    options.yAxis.name = titleShow
                    let tempLegend = [], tempSeries = []
                    let markLine = options.series[0].markLine
                    let markLineMax = 0,markValArr = []
                    if(markLine && markLine.data && markLine.data.length) {
                        markLine.data.forEach(item=>{
                            markValArr.push(item.yAxis)
                        })
                        markLineMax = Math.max(...markValArr)
                    }
                    options.legend.data = tempLegend
                    devices.forEach((item,index) => {
                        tempLegend.push(item.name)
                        tempSeries.push({
                            type: 'line',
                            name: item.name,
                            markLine: markLine,
                            data: [],
                            pointId: item.id, //设备id，额外添加的，匹配数据时候用
                        })
                        let pentSdbParams = {
                            pointId: item.id,
                            key: titleShow,
                            schame: 'iot',
                            startTs: nowTs - checkItem.duration * 1000,
                            endTs: nowTs,
                        }
                        let refreshToken = getCookie('refreshToken')
                        geAjax('/api/auth/refreshToken', 'POST', {
                            refreshToken
                        }).then(res => {
                            setCookie('token', res.token);
                            setCookie('refreshToken', res.refreshToken)
                            requestUtil.post(`${urls.pentSdbData.url}`, pentSdbParams).then(res => {
                                for (let key in res.resMap) {
                                    if(index === 0) {
                                        options.xAxis.data.push(timeFormate(key))
                                    }
                                    tempSeries[index].data.push(res.resMap[key])
                                }
                                if(index === 0) {
                                    options.yAxis.max = Math.max(...tempSeries[0].data, markLineMax)
                                }
                                if (index == devices.length - 1) {
                                    options.series = tempSeries
                                    myEchart.setOption(options)
                                }
                            })
                        })
                    })
                })
            }else {
                options.series.data = [{value:0,name:titleShow}]
                options.series.name = titleShow
                myEchart.setOption(options)
            }
        }else {
            myEchart.setOption(options)
        }
    })
    return con
}
 
function dealLight(cell) {
    let con = document.createElement('div')
    let light = `<svg 
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="${cell.width}px" height="${cell.height}px" viewbox="0 0 27.5 26.5">
        <path fill-rule="evenodd"  stroke="rgb(125, 125, 125)" stroke-width="1px" stroke-linecap="butt" stroke-linejoin="miter" fill="#CBCBCB"
        d="M13.000,8.000 C16.867,8.000 19.999,10.047 19.999,12.571 L19.999,24.000 L6.000,24.000 L6.000,12.571 C6.000,10.047 9.134,8.000 13.000,8.000 Z"/>
        <path fill-rule="evenodd"  fill="rgb(125, 125, 125)"
        d="M12.996,0.000 C14.536,0.000 14.212,1.592 14.212,3.017 C14.212,3.604 14.294,4.442 14.050,4.861 C13.888,5.113 13.564,5.364 13.240,5.364 C12.996,5.364 12.835,5.281 12.671,5.197 C11.861,4.778 12.105,3.520 12.105,2.263 C12.105,1.760 12.024,1.006 12.185,0.670 C12.266,0.252 12.589,0.168 12.996,0.000 L12.996,0.000 ZM5.292,2.682 C5.618,2.682 5.861,2.766 6.105,2.934 L7.645,4.861 C7.889,5.197 8.294,5.532 8.456,5.951 C8.699,6.538 8.375,7.125 7.969,7.292 C7.645,7.544 7.076,7.460 6.754,7.209 C6.429,6.957 6.105,6.454 5.861,6.035 L5.051,4.945 C4.564,4.442 3.916,3.856 4.564,3.101 C4.726,2.850 4.969,2.850 5.292,2.682 L5.292,2.682 ZM20.780,3.101 C21.591,3.101 22.321,3.688 21.996,4.610 C21.833,5.029 21.428,5.281 21.185,5.616 L20.132,6.789 C19.970,7.041 19.724,7.376 19.483,7.544 C19.240,7.711 18.672,7.795 18.348,7.628 C17.862,7.292 17.536,6.622 17.862,6.035 L18.915,4.861 C19.158,4.526 19.483,4.275 19.724,3.939 C19.889,3.688 20.132,3.436 20.374,3.269 L20.780,3.101 ZM0.915,9.891 C1.321,9.891 1.564,9.975 1.889,10.058 C2.456,10.142 3.104,10.310 3.672,10.394 C4.159,10.478 4.564,10.478 4.888,10.813 C5.212,11.064 5.375,11.735 5.131,12.154 C4.969,12.406 4.726,12.657 4.401,12.657 C4.077,12.741 3.753,12.573 3.429,12.573 L1.644,12.154 C1.159,12.070 0.672,11.986 0.348,11.735 C-0.057,11.400 -0.139,10.478 0.267,10.058 C0.510,9.975 0.672,9.975 0.915,9.891 L0.915,9.891 ZM24.834,10.394 C25.727,10.394 26.375,11.400 25.808,12.154 C25.482,12.573 24.997,12.573 24.348,12.657 C23.781,12.741 23.131,12.825 22.564,12.908 C22.321,12.992 21.915,13.076 21.591,12.992 C21.266,12.908 20.942,12.657 20.780,12.406 C20.537,11.819 20.861,11.148 21.266,10.981 C21.510,10.897 21.833,10.897 22.159,10.813 L23.942,10.478 C24.266,10.478 24.510,10.478 24.834,10.394 L24.834,10.394 Z">
        <animate attributeName='fill-opacity'  attributeType='XML' begin='0s;' dur='.4s' from='1' to='0' repeatCount="indefinite"/>
        </path>
        <path fill-rule="evenodd"  fill="rgb(125, 125, 125)"
        d="M4.501,25.000 L21.500,25.000 C21.776,25.000 22.000,25.224 22.000,25.500 C22.000,25.776 21.776,26.000 21.500,26.000 L4.501,26.000 C4.225,26.000 4.000,25.776 4.000,25.500 C4.000,25.224 4.225,25.000 4.501,25.000 Z"/>
        </svg>`
    con.innerHTML = light
    return con
}
function dealLightFill(ele,color) { //处理闪烁灯 填充色
    let paths = $(ele).find("svg path")
    $(paths[0]).attr("fill", color)
    $(paths[1]).attr("fill", color)
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
function timeFormate(time) {
    time = +time || new Date().getTime()
    const timeEle = new Date(time)
    const year = timeEle.getFullYear()
    const month = timeEle.getMonth() + 1
    const day = timeEle.getDate()
    const hours = timeEle.getHours()
    const minute = timeEle.getMinutes()
    const second = timeEle.getSeconds()
    const cmSecond = timeEle.getUTCMilliseconds()
    return `${year}/${month > 9 ? month : '0' + month}/${day > 9 ? day : '0' + day} ${hours > 9 ? hours : '0' + hours}:${minute > 9 ? minute : '0' + minute}:${second > 9 ? second : '0' + second}.${cmSecond}`
}
export {
    removeEle, destroyWs, geAjax, insertImage, insertEdge, bindEvent, showTips,
    dealProgress, dealPipeline, dealCharts, dealLight, toDecimal2NoZero, dealLightFill, throttleFun, hideFrameLayout
}
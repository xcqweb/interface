import {geAjax, toDecimal2NoZero, timeFormate,dealDefaultParams,svgShape,setSvgImageHref} from './util'
import {getCookie} from '../Utils'
import echarts from 'echarts'
let reconnectCount = 0 //websocket连接出错时候，重连的次数
const reconnectMaxCount = 5
//获取websocket连接信息
let websocketUrlReal = ''
//获取最后一笔数据
async function getLastData(deviceParams, fileSystem,mainProcess) {
    let paramIds = []
    let maps = dealdeviceParams(deviceParams)
    for (let item of maps.values()) {
        paramIds.push(item)
    }
    const res = await geAjax('api/v2/persist/tsdb/point/last', 'POST', JSON.stringify(paramIds))
    setterRealData(res,fileSystem,mainProcess)
}

function dealdeviceParams(deviceParams) {
    let maps = new Map()
    deviceParams.forEach(item => {
        let obj = {
            deviceId: item.deviceId,
            paramIds: item.params
        }
        if (maps.has(item.deviceId)) {
            let tempObj = maps.get(item.deviceId)
            tempObj.paramIds = Array.from(new Set(tempObj.paramIds.concat(obj.paramIds)))
            maps.set(item.deviceId, tempObj)
        } else {
            maps.set(item.deviceId, obj)
        }
    })
    return maps
}

/**
 * 
 * @param {*} isReal 是否是实时数据
 * @param {*} modeId 绑定数据时候 viewTool/model/serach 返回的 模型id
 */
async function getSubscribeInfos(deviceParams) {
    let params = {
        subscribeInfos: [],
        networkProtocol: 'websocket',
    };
    let maps = dealdeviceParams(deviceParams)
    for (let item of maps.values()) {
        item.subscribeType = 'realtime_datahub'
        item.pushRate = 500
        item.sourceId = item.deviceId
        params.subscribeInfos.push(item)
    }
    let data = await geAjax('api/pubsub/subscribe', 'POST', JSON.stringify(params))
    data = JSON.parse(data)
    websocketUrlReal = data.data
    return data
}
function setterRealData(res, fileSystem,mainProcess) {
    let maps = new Map()
    let targetArr = []
    res.forEach(item=>{
        if (maps.has(item.deviceId)) {
            let tempObj = maps.get(item.deviceId)
            maps.set(item.deviceId, Object.assign({},tempObj,item))
        } else {
            maps.set(item.deviceId, item)
        }
    })
    for(let val of maps.values()) {
        targetArr.push(val)
    }
    targetArr.forEach((item)=>{
        let els = document.querySelectorAll(`.device_${item.deviceId}`) //多设备情况下，会多次走这个地方
        for(let i = 0;i < els.length;i++) {
            const $ele = $(els[i])
            let shapeName = $ele.data("shapeName")
            let paramShow = $ele.data("paramShow")
            let val = null
            let paramShowDefault = $ele.data("paramShowDefault")
            if(shapeName == 'lineChart' && paramShowDefault) {
                $ele.data("paramShowDefault",dealDefaultParams(item.deviceId,paramShowDefault,$ele.data('subParams')))
                paramShowDefault = $ele.data("paramShowDefault")
            }
            if (paramShowDefault) {
                val = item[paramShowDefault.deviceParamId]
            }
            if(shapeName == 'progress') {//进度条
                if(!val) {
                    val = 0
                }
                let progressPropsObj = $ele.data("progressPropsObj")
                let {max,min,type} = progressPropsObj
                let percentVal = val / (max - min)
                let text = `${toDecimal2NoZero(percentVal * 100)}%`
                if(type == 'real') {
                    text = val
                }
                let target = $ele.find(".progressbar-common.progressbar")
                let textEl = $ele.find(".progressbar-text")
                let background = "linear-gradient(to right,#FF280F,#FFA963)"
                if (percentVal * 100 > 75) {
                    background = "linear-gradient(to right,#D4D7FF,#175FFF)"
                }else if (percentVal * 100 > 50) {
                    background = "linear-gradient(to right,#BDFFBA,#12FF1A)"
                } else if (percentVal * 100 > 25) {
                    background = "linear-gradient(to right,#FFF7B3,#FFEF17)"
                }
                target.css("background", background)
                target.animate({"width":`${percentVal * 100}%`})
                textEl.html(text)
            }else if(shapeName.includes('Chart')) {
                let echartsInstance = echarts.getInstanceByDom($ele.find('.chart-con')[0])
                let options = echartsInstance.getOption()
                if(options) {
                    if(shapeName == 'lineChart') {
                        let chartDataLen = $ele.data("chartDataLen")
                        options.series.forEach((ser)=>{
                            if (ser.deviceId == item.deviceId) {
                                if(ser.data.length >= chartDataLen) {
                                    ser.data.splice(0, ser.data.length - chartDataLen)
                                    options.xAxis[0].data.splice(0,  options.xAxis[0].data.length - chartDataLen)
                                }
                                if (val || val == 0) {
                                    // if (!isNaN(Number(val))) {
                                    ser.data.push(val);
                                    let yMax = options.yAxis[0].max;
                                    options.yAxis[0].max = Math.max(yMax, val)
                                    options.xAxis[0].data.push(timeFormate(item.timestamp, false))
                                    // }
                                }
                            }
                        })
                    }else {//只有仪表盘切换多个参数时候，需要处理每个参数的历史数据或者实际数据情况
                        let realDataIds = mainProcess.realData.map(item=>item.deviceParamId)
                        if(!realDataIds.includes(item.deviceParamId)) {
                            mainProcess.realData.push(item)
                        }else{
                            let index = realDataIds.indexOf(item.deviceParamId)
                            mainProcess.realData[index] = item
                        }
                        if (!val) {
                            val = 0
                        }
                        options.series[0].data[0].value = val
                    }
                    echartsInstance.setOption(options)
                }
            }else {
                if(val || val === 0) {
                    if(shapeName == 'triangle' || shapeName.includes('pentagram')) {
                        $ele.find(".text-show").html(val)
                    }else{
                        $ele.html(val)
                    }
                }
                let stateModels = $ele.data("stateModels")
                if(stateModels) {
                    let stateIndex = 0 //默认状态 未找到要切换的状态，显示默认
                    for (let j = 1; j < stateModels.length;j++) {
                        if (dealStateFormula(stateModels[j].modelFormInfo.formula, item)) {
                            stateIndex = j
                            break
                        }
                    }
                    changeEleState(els[i], stateModels[stateIndex],fileSystem)
                }
                if (paramShow && paramShow.length) {
                    let paramData = $ele.data('paramData')
                    if (!paramData) {
                        paramData = {
                            time:"",
                            data: {}
                        }
                    }
                    paramShow.forEach(d => {
                        let dpIdVal = item[d.deviceParamId]
                        if (dpIdVal || dpIdVal == 0) {
                            paramData.data[d.paramName] = dpIdVal
                            paramData.time = timeFormate(item.timestamp, false)
                        }else{
                            if(!paramData.data[d.paramName]) {
                                paramData.data[d.paramName] = null
                            }
                        }
                    })
                    $ele.data('paramData', paramData)
                    if ($ele.data('frameFlag')) { //当前控件显示时候，刷新对应浮窗数据
                        $ele.trigger('mouseenter')
                    }
                }
            }
        }
    })
}
/**
 * 将实际值代入公式判断结果(true,false)
 * @param {} formula 公式
 * @param {} data 公式中参数的实际值
 */
function dealStateFormula(formula, data) {
    if(!formula) {
        return false
    }
    formula = JSON.parse(formula)
    let res1 = true,res2 = false
    let logics = formula.data
    if(!logics) {
        return false
    }
    if (!formula.conditionLogic || formula.conditionLogic == 1) { // 顶级条件是and，有一个为false，就返回false
        for(let i = 0;i < logics.length;i++) {
            if (!dealLogic(logics[i],data)) {//子级条件有一个为false，整体为false
                res1 = false
                break 
            }
        }
        return res1
    }  
    // 顶级条件or
    for (let i = 0; i < logics.length; i++) {
        if (dealLogic(logics[i], data)) {//子级条件有一个为true，整体为true
            res2 = true
            break
        }
    }
    return res2
}
/**
 * 根据值判断公式的结果true or false
 * @param {*} logic 模型公式
 * @param {*} data 实际数据的参数以及值
 */
function dealLogic(logic,data) {
    let res = true
    let operate = +logic.logical
    if(!logic.key) {
        return false
    }
    let tempArr = logic.key.split("/")
    let deviceType = tempArr[0]
    let paramId = tempArr[tempArr.length - 1]
    let tempParamVal
    if(deviceType == 'device') {
        tempParamVal = dealDataVal(paramId, data,tempArr[1])
    }else{
        tempParamVal = dealDataVal(paramId, data)
    }
    let fixed = +logic.fixedValue
    let min = +logic.minValue
    let max = +logic.maxValue
    if (!tempParamVal && tempParamVal !== 0) {
        return false
    }
    let paramVal = +tempParamVal
    switch (operate) {
        case 1: // 介于
            res = paramVal > min && paramVal < max
            break
        case 2: // 未介于
            res = paramVal >= max || paramVal <= min
            break
        case 3: // 等于
            res = paramVal == fixed
            break
        case 4: // 不等于
            res = paramVal != fixed
            break
        case 5: // 大于
            res = paramVal > fixed
            break
        case 6: // 小于
            res = paramVal < fixed
            break
        case 7: // 大于等于
            res = paramVal >= fixed
            break
        case 8: // 小于等于
            res = paramVal <= fixed
            break
    }
    return res
}
//如果是设备需要同时满足参数id和部件id都包含
function dealDataVal(paramId, data,partId) {
    let keys = Object.keys(data)
    for(let i = 0;i < keys.length;i++) {
        if (keys[i].includes(paramId)) {
            if (!partId || keys[i].includes(partId)) {
                return data[keys[i]]
            }
        }
    }
}
/**
 * 切换该元素的样式状态
 * @param {*} el 
 * @param {*} stateInfo
 */
function changeEleState(el, stateInfo,fileSystem) {
    let shapeName = $(el).data("shapeName")
    if (stateInfo.animateCls) {
        el.classList.add(stateInfo.animateCls)
    }else{
        //去掉动画样式
        el.classList.remove('animate-blink')
    }
    let svgShapes = svgShape()
    if(svgShapes.includes(shapeName)) {
        let path = $(el).find("path")
        path.attr('fill',stateInfo.style.background)
        path.attr('stroke',stateInfo.style.borderColor)
        let text = $(el).find('.text-show')
        text.css('color',stateInfo.style.color)
        return
    } 
    let imgInfo = stateInfo.imgInfo
    for (let key in stateInfo.style) {
        el.style[key] = stateInfo.style[key]
    }
    if (imgInfo) {
        imgInfo.url = imgInfo.url.replace(/getechFileSystem\//, fileSystem)
        setSvgImageHref(el,imgInfo.url)
        return
    } 
    if (shapeName.includes('image')) {
        setSvgImageHref(el,$(el).data("defaultImg"))
    }
}
/**
 * 重连websocket
 * @param {string} pageId 
 */
function reconnect(pageId,applyData) {
    if (!applyData[pageId] || applyData[pageId].lockWs) {return;}
    applyData[pageId].lockWs = true
    // 3s重连
    if(!applyData[pageId].timer) {
        applyData[pageId].timer = setInterval(function() {
            reconnectCount++
            if(reconnectCount > reconnectMaxCount) {
                clearInterval(applyData[pageId].timer)
                return
            }
            createWsReal(pageId,applyData)
            applyData[pageId].lockWs = false
        }, 3000)
    }
}

function initialWs(ws, pageId, applyData, fileSystem,mainProcess) {
    // websocket连接成功
    ws.onopen = function() {
        if(applyData[pageId].timer) {
            clearInterval(applyData[pageId].timer)
        }
    }
    // 接收消息
    ws.onmessage = function(res) {
        let data = JSON.parse(res.data)
        if(!data || !data.length) {
            return
        }
        let dataArr = Object.keys(data[0])
        if (dataArr[0] === 'rspCode' || dataArr[1] === 'rspMsg') {
            return
        }
        setterRealData(JSON.parse(res.data), fileSystem,mainProcess)
    }
    // 接收异常
    ws.onerror = function() {
        reconnect(pageId,applyData)
    }
    // 关闭
    ws.onclose = function() {
        reconnect(pageId,applyData)
    }
}

//实时数据
function createWsReal(pageId, applyData, fileSystem,mainProcess) {
    let deviceParams = applyData[pageId].wsParams
    getSubscribeInfos(deviceParams).then((res) => {
        if (deviceParams.length === 0 || !websocketUrlReal) {
            return
        }
        const token = getCookie('token')
        let ws = new WebSocket(res.data, token) // 提交时使用这个
        initialWs(ws, pageId, applyData, fileSystem,mainProcess)
        if(applyData[pageId].wsReal) {
            applyData[pageId].wsReal.close()
        }
        applyData[pageId].wsReal = ws
    })
}

export {
    createWsReal, getLastData
}
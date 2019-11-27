import {geAjax,toDecimal2NoZero,dealLightFill,throttleFun} from './util'
import {getCookie} from '../Utils'
import echarts from 'echarts'

//获取websocket连接信息
let websocketUrlReal = ''
//获取最后一笔数据
async function getLastData(deviceParams, fileSystem) {
    let paramIds = []
    let maps = dealdeviceParams(deviceParams)
    for (let item of maps.values()) {
        paramIds.push(item)
    }
    const res = await geAjax('/api/v2/persist/tsdb/point/last', 'POST', JSON.stringify(paramIds))
    setterRealData(res,fileSystem)
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
    let data = await geAjax('/api/pubsub/subscribe', 'POST', JSON.stringify(params))
    data = JSON.parse(data)
    websocketUrlReal = data.data
    return data
}
function setterRealData(res, fileSystem) {
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
        let els = document.querySelectorAll(`.device_${item.deviceId}`)
        for(let i = 0;i < els.length;i++) {
            let shapeName = $(els[i]).data("shapeName")
            let paramShow = $(els[i]).data("paramShow")
            let paramShowDefault = $(els[i]).data("paramShowDefault")
            let val = null
            if (paramShowDefault) {
                val = item[paramShowDefault.deviceParamId]
            }
            if(shapeName == 'progress') {//进度条
                if(!val) {
                    val = 0
                }
                let progressPropsObj = $(els[i]).data("progressPropsObj")
                let {max,min,type} = progressPropsObj
                let percentVal = val / (max - min)
                let text = `${toDecimal2NoZero(percentVal * 100)}%`
                if(type == 'real') {
                    text = val
                }
                let target = $(els[i]).find(".progressbar-common.progressbar")
                let textEl = $(els[i]).find(".progressbar-text")
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
                let echartsInstance = echarts.getInstanceByDom(els[i])
                let options = echartsInstance.getOption()
                if(options) {
                    if(shapeName == 'lineChart') {
                        let chartDataLen = $(els[i]).data("chartDataLen")
                        options.series.forEach((ser)=>{
                            if (ser.deviceId == item.deviceId) {
                                if(ser.data.length >= chartDataLen) {
                                    ser.data.shift()
                                }
                                if(val || val == 0) {
                                    ser.data.push(val)
                                }
                            }
                        })
                        let yMax = options.yAxis[0].max
                        options.yAxis[0].max = Math.max(yMax,val)
                        if(options.xAxis[0].data.length >= chartDataLen) {
                            options.xAxis[0].data.shift()
                        }
                        options.xAxis[0].data.push(item.timestamp)
                    }else {
                        if (!val) {
                            val = 0
                        }
                        options.series[0].data[0].value = val
                    }
                    echartsInstance.setOption(options)
                }
            }else {
                if(val || val === 0) {
                    $(els[i]).html(`${val}`)
                }
                let stateModels = $(els[i]).data("stateModels")
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
                    let formatLayerEl = $("#formatLayer")
                    let formatLayerElText = () => {
                        formatLayerEl.html("<ul style='height:100%;display:flex;flex-direction:column;justify-content:center;'>" + 
                            `<li>${item.timestamp}</li>` +
                            paramShow.map((d) => {
                                return `<li>${d.paramName}=${item[d.deviceParamId]}</li>`
                            }).join('') + "</ul>")
                    }
                    let formatLayerShow = (e)=>{
                        let {clientX,clientY} = e
                        formatLayerEl.css({left:`${clientX}px`,top:`${clientY}px`})
                        formatLayerElText()
                        formatLayerEl.show()
                    }
                    $(els[i]).mouseenter(e=>{
                        formatLayerShow(e)
                        els[i].frameFlag = true
                    })
                    $(els[i]).mousemove(throttleFun(formatLayerShow,20))
                    $(els[i]).mouseleave(() => {
                        els[i].frameFlag = false
                        formatLayerEl.html("")
                        formatLayerEl.hide()
                    })
                    if (els[i].frameFlag) { //当前控件显示时候，刷新对应浮窗数据
                        formatLayerElText()
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
        return
    }
    formula = JSON.parse(formula)
    let res1 = true,breakFlag = false,res2 = false
    let logics = formula.data
    if(!logics) {
        return false
    }
    if (!formula.conditionLogic || formula.conditionLogic == 1) { // 顶级条件是and，有一个为false，就返回false
        for(let i = 0;i < logics.length;i++) {
            for(let j = 0;j < logics[i].length;j++) {
                if (!dealLogic(logics[i][j],data)) {//子级条件有一个为false，整体为false
                    breakFlag = true
                    res1 = false
                    break 
                }
            }
            if(breakFlag) {
                break
            }
        }
        return res1
    }  
    // 顶级条件or
    for (let i = 0; i < logics.length; i++) {
        for (let j = 0; j < logics[i].length; j++) {
            if (!dealLogic(logics[i][j],data)) {
                continue
            }
            if (j == logics[i].length - 1) {//子级条件全为true
                breakFlag = true
            }
        }
        if (breakFlag) {//父级条件有一个为true,整个结果为true
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
    let param = logic.paramName
    let fixed = +logic.fixedValue
    let min = +logic.minValue
    let max = +logic.maxValue
    let tempParamVal = data[param]
    if (!data[param] && tempParamVal !== 0) {
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
    if (shapeName == 'light') {
        dealLightFill(el, stateInfo.style.background)
        return
    }
    let imgInfo = stateInfo.imgInfo
    for (let key in stateInfo.style) {
        el.style[key] = stateInfo.style[key]
    }
    if (imgInfo) {
        imgInfo.url = imgInfo.url.replace(/getechFileSystem\//, fileSystem)
        el.style.background = `url(${imgInfo.url}) center center no-repeat`
        el.style.backgroundSize = '100% 100%'
        return
    } 
    if (shapeName.includes('image')) {
        el.style.background = `url(${$(el).data("defaultImg")}) center center no-repeat`
        el.style.backgroundSize = '100% 100%'
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
    setTimeout(function() {
        createWsReal(pageId,applyData)
        applyData[pageId].lockWs = false
    }, 3000)
}

function initialWs(ws, pageId, applyData, fileSystem) {
    // websocket连接成功
    ws.onopen = function() {
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
        setterRealData(JSON.parse(res.data), fileSystem)
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
function createWsReal(pageId, applyData, fileSystem) {
    let deviceParams = applyData[pageId].wsParams
    getSubscribeInfos(deviceParams).then((res) => {
        if (deviceParams.length === 0 || !websocketUrlReal) {
            return
        }
        const token = getCookie('token')
        let ws = new WebSocket(res.data, token) // 提交时使用这个
        initialWs(ws, pageId, applyData, fileSystem)
        applyData[pageId].wsReal = ws
    })
}

export {
    createWsReal, getLastData
}
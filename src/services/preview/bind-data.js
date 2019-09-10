import {geAjax} from './util'
import {getCookie,throttle} from '../Utils'
// import {conditionLogical,logicalSignList} from '../../constants/model-form-logic'
//获取websocket连接信息
let websocketUrlReal = ''
//获取最后一笔数据
async function getLastData(pointParams) {
    let params = []
    let maps = dealPointParams(pointParams)
    for (let item of maps.values()) {
        params.push(item)
    }
    const res = await geAjax('/api/persist/opentsdb/point/last', 'POST', JSON.stringify(params))
    setterRealData(res)
}

function dealPointParams(pointParams) {
    let maps = new Map()
    pointParams.forEach(item => {
        let obj = {
            pointId: item.pointId,
            keys: item.params
        }
        if (maps.has(item.pointId)) {
            let tempObj = maps.get(item.pointId)
            tempObj.keys = Array.from(new Set(tempObj.keys.concat(obj.keys)))
            maps.set(item.pointId, tempObj)
        } else {
            maps.set(item.pointId, obj)
        }
    })
    return maps
}

/**
 * 
 * @param {*} isReal 是否是实时数据
 * @param {*} modeId 绑定数据时候 viewTool/model/serach 返回的 模型id
 */
async function getSubscribeInfos(pointParams) {
    let params = {
        subscribeInfos: [],
        networkProtocol: 'websocket',
    };
    let maps = dealPointParams(pointParams)
    for (let item of maps.values()) {
        item.subscribeType = 'realtime_datahub'
        item.pushRate = 500
        item.params = item.keys
        params.subscribeInfos.push(item)
    }
    const data = await geAjax('/api/pubsub/subscribe', 'POST', JSON.stringify(params))
    websocketUrlReal = data.data
    return data
}
//绑定数据&切换状态的处理方法
function setterRealData(res) {
    res.forEach((item)=>{
        let els = document.querySelectorAll(`.point_${item.pointId}`)
        for(let i = 0;i < els.length;i++) {
            let shapeName = $(els[i]).data("shapeName")
            let paramShow = $(els[i]).data("paramShow")
            let realVal = item[paramShow[0]]
            if(shapeName == 'progress') {//进度条
                let progressPropsObj = $(els[i]).data("progressPropsObj")
                let {max,min,type} = progressPropsObj
                let percentVal = (realVal / (max - min)).toFixed(4)
                let text = `${percentVal * 100}%`
                if(type == 'real') {
                    text = realVal
                }
                let target = $(els[i]).find(".progressbar-common.progressbar")
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
                target.html(text)
            }else if(shapeName.includes('Chart')) {
                console.log("tt")
            }else {
                if (paramShow.length == 1) {
                    $(els[i]).html(`${item[paramShow[0]]}`)
                } else{
                    $(els[i]).css("line-height", "normal")
                    $(els[i]).html("<ul style='height:100%;display:flex;flex-direction:column;justify-content:center;'>" + paramShow.map((d) => {
                        return `<li>${d}=${item[d]}`
                    }).join('') + "</ul>")
                }              
            }

            let stateModels = $(els[i]).data("stateModels")
            if(stateModels) {
                let stateIndex = 0
                for (let j = 1; j < stateModels.length;j++) {
                    if (dealStateFormula(stateModels[j].modelFormInfo.formula, item)) {
                        stateIndex = j
                        break
                    }
                }
                changeEleState(els[i], stateModels[stateIndex])
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
    formula = JSON.parse(formula)
    let res1 = true,breakFlag = false,res2 = false
    let logics = formula.data
    if(!logics) {
        return
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
    let operate = logic.logical
    let param = logic.paramName
    let fixed = logic.fixedValue
    let min = logic.minValue
    let max = logic.maxValue
    switch (operate) {
        case 1: // 介于
            res = data[param] > min && data[param] < max
            break
        case 2: // 未介于
            res = data[param] >= max && data[param] <= min
            break
        case 3: // 等于
            res = data[param] == fixed
            break
        case 4: // 不等于
            res = data[param] != fixed
            break
        case 5: // 大于
            res = data[param] > fixed
            break
        case 6: // 小于
            res = data[param] < fixed
            break
        case 7: // 大于等于
            res = data[param] >= fixed
            break
        case 8: // 小于等于
            res = data[param] <= fixed
            break
              
    }
    return res
}
/**
 * 切换该元素的样式状态
 * @param {*} el 
 * @param {*} stateInfo
 */
function changeEleState(el, stateInfo) {
    if (stateInfo.animateCls) {
        el.classList.add(stateInfo.animateCls)
    }
    for (let key in stateInfo.style) {
        el.style[key] = stateInfo.style[key]
    }
}
/**
 * 重连websocket
 * @param {string} pageId 
 */
function reconnect(pageId,applyData) {
    if (!applyData[pageId] || applyData[pageId].lockWs) {return;}
    applyData[pageId].lockWs = true;
    // 3s重连
    setTimeout(function() {
        createWsReal(pageId,applyData)
        applyData[pageId].lockWs = false
    }, 3000)
}

function initialWs(ws, pageId,applyData) {
    // websocket连接成功
    ws.onopen = function() {
    }
    // 接收消息
    ws.onmessage = function(res) {
        let data = JSON.parse(res.data)
        let dataArr = Object.keys(data)
        if (dataArr[0] === 'rspCode' || dataArr[1] === 'rspMsg') {
            return
        }
        throttle(setterRealData(JSON.parse(res.data)), 600)
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
function createWsReal(pageId,applyData) {
    let pointParams = applyData[pageId].wsParams
    getSubscribeInfos(pointParams).then((res) => {
        if (pointParams.length === 0 || !websocketUrlReal) {
            return
        }
        const token = getCookie('token');
        let ws = new WebSocket(res.data, token); // 提交时使用这个
        initialWs(ws, pageId,applyData)
        applyData[pageId].wsReal = ws
    })
}

export {
    createWsReal, getLastData
}
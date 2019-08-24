import {geAjax,setCellStatus} from './util'
import {getCookie,throttle} from '../Utils'
//获取websocket连接信息
let websocketUrlReal = ''
let websocketUrlAlarm = ''

function setterRealDataDeal(resData, pointData, layerData, mainProcess) {
    resData.forEach(item => {
        pointData[item.pointId] = item;
        let doms = document.getElementsByClassName(item.pointId + '_text');
        // 填充文本
        for (let d of doms) {
            let dataFillText = d.getAttribute('data-filltext')
            if (dataFillText) {
                dataFillText = dataFillText.split(",")
                // 上抛数据为数字 0 的时候,转换为字符串 '0';
                if (item[dataFillText[0]] === 0) {
                    item[dataFillText[0]] = '0';
                }
                if (d.childElementCount == 0 && item[dataFillText[0]]) {
                    d.innerHTML = item[dataFillText[0]]
                }
            }
        }
        if (layerData && layerData.point === item.pointId) {
            mainProcess.renderLayer()
        }
    })
}

//获取最后一笔数据
async function getLastData(pointData, pointParams, layerData, mainProcess) {
    if (!pointParams.length) {return}
    let params = [];
    let maps = new Map();
    pointParams.forEach(item => {
        if (item.pointId) {
            let obj = {
                pointId: item.pointId,
                keys: item.params.split(",")
            }
            if (maps.has(item.pointId)) {
                let tempObj = maps.get(item.pointId);
                tempObj.keys = Array.from(new Set(tempObj.keys.concat(obj.keys)));
                maps.set(item.pointId, tempObj);
            } else {
                maps.set(item.pointId, obj);
            }
        }
    });
    for (let item of maps.values()) {
        params.push(item)
    }
    const res = await geAjax('/api/persist/opentsdb/point/last', 'POST', JSON.stringify(params));
    setterRealDataDeal(res, pointData,layerData, mainProcess)
}

/**
 * 
 * @param {*} isReal 是否是实时数据
 * @param {*} modeId 绑定数据时候 viewTool/model/serach 返回的 模型id
 */
async function getsubscribeInfos(isReal, pointParams) {
    if (!pointParams.length) {return}
    let params = {
        subscribeInfos: [],
        networkProtocol: 'websocket',
    };
    let maps = new Map();
    pointParams.forEach(item => {
        if (item.pointId) {
            let obj = {
                pointId: item.pointId,
                subscribeType: isReal ? 'realtime' : 'realtime_alarm',
            }
            if (isReal) {
                obj.pushRate = 500;
                obj.params = item.params.split(",");
            }
            if (isReal && maps.has(item.pointId)) {
                let tempObj = maps.get(item.pointId);
                tempObj.params = Array.from(new Set(tempObj.params.concat(obj.params)));
                maps.set(item.pointId, tempObj);
            } else if (isReal) {
                maps.set(item.pointId, obj);
            }
            if (!isReal) {
                params.subscribeInfos.push(obj)
            }
        }
    });
    if (isReal) {
        for (let item of maps.values()) {
            params.subscribeInfos.push(item)
        }
    }
    const data = await geAjax('/api/subscribe', 'POST', JSON.stringify(params));
    isReal ? (websocketUrlReal = data.data) : (websocketUrlAlarm = data.data)
    return data
}

function setterRealData(res,layerData, mainProcess) {
    let resData = JSON.parse(res.data)
    setterRealDataDeal(resData, layerData, mainProcess)
}

//处理报警数据
function setterAlarmdata(res, pointData) {
    let resData = JSON.parse(res.data)
    // 根据状态设置颜色
    let doms = document.getElementsByClassName(resData.pointId + '_text');
    if (resData.alarm && resData.operation !== 3) {
        if (!pointData[resData.pointId] || resData.alarm !== pointData[resData.pointId].alarm) {
            setCellStatus(resData.pointId, resData.alarm, resData)
        }
    }
    if (resData.operation === 3) {
        if (doms.length === 0) {
            doms = document.getElementsByClassName(resData.pointId);
        }
        for (let dom of doms) {
            if (dom.childElementCount == 0) {
                dom.style.backgroundColor = dom.getAttribute('data-defaultFill');
            } else {
                dom.getElementsByTagName('svg')[0].firstChild.setAttribute('fill', dom.getAttribute('data-defaultFill'));
            }
        }
    }
}

/**
 * 重连websocket
 * @param {string} pageId 
 */
function reconnect(pageId, type, pointData, pointParams, applyData) {
    if (!applyData[pageId] || applyData[pageId].lockWs) {return;}
    applyData[pageId].lockWs = true;
    // 3s重连
    setTimeout(function() {
        if (type === 'real') {
            createWsReal(pageId, pointData, pointParams, applyData)
        } else {
            createWsAlarm(pageId, pointParams)
        }

        applyData[pageId].lockWs = false;
    }, 3000)
}

function initialWs(ws, pageId, type, pointData, pointParams, applyData,layerData, mainProcess) {
    // websocket连接成功
    ws.onopen = function() {
        // ws.send(JSON.stringify(applyData[pageId].wsParams));
    }
    // 接收消息
    ws.onmessage = function(res) {
        let data = JSON.parse(res.data)
        let dataArr = Object.keys(data)
        if (dataArr[0] === 'rspCode' || dataArr[1] === 'rspMsg') {return}
        if (type === 'real') {
            throttle(setterRealData(res,layerData, mainProcess), 600)
        } else {
            throttle(setterAlarmdata(res,pointData), 600)
        }
    }
    // 接收异常
    ws.onerror = function() {
        reconnect(pageId, type, pointData, pointParams, applyData)
    }
    // 关闭
    ws.onclose = function() {
        reconnect(pageId, type, pointData, pointParams, applyData)
    }
}


//实时数据
function createWsReal(pageId, pointData, pointParams, applyData,layerData, mainProcess) {
    getLastData(pointData, pointParams, layerData, mainProcess)
    getsubscribeInfos(true, pointParams).then((res) => {
        if (applyData[pageId].wsParams.length === 0 || !websocketUrlReal) {
            return;
        }
        const token = getCookie('token');
        let ws = new WebSocket(res.data, token); // 提交时使用这个
        initialWs(ws, pageId, 'real', pointData, pointParams, applyData,layerData, mainProcess);
        applyData[pageId].ws_real = ws;
    })
}

//报警数据
function createWsAlarm(pageId, pointParams, applyData, layerData, mainProcess) {
    getsubscribeInfos(false, pointParams).then((res) => {
        if (applyData[pageId].wsParams.length === 0 || !websocketUrlAlarm) {
            return;
        }
        const token = getCookie('token');
        let ws = new WebSocket(res.data, token); // 提交时使用这个

        initialWs(ws, pageId, 'alarm', pointParams, applyData,layerData, mainProcess)
        applyData[pageId].ws_alarm = ws
    })
}


export {
    createWsReal, createWsAlarm
}
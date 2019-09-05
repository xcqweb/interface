import {geAjax} from './util'
import {getCookie,throttle} from '../Utils'
//获取websocket连接信息
let websocketUrlReal = ''
//获取最后一笔数据
/* async function getLastData(pointParams) {
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
}
 */
/**
 * 
 * @param {*} isReal 是否是实时数据
 * @param {*} modeId 绑定数据时候 viewTool/model/serach 返回的 模型id
 */
async function getSubscribeInfos(isReal, pointParams) {
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
                subscribeType: 'realtime',
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
        }
    });
    if (isReal) {
        for (let item of maps.values()) {
            params.subscribeInfos.push(item)
        }
    }
    const data = await geAjax('/api/subscribe', 'POST', JSON.stringify(params))
    websocketUrlReal = data.data
    return data
}

//绑定数据&切换状态的处理方法
function setterRealData(res) {
    let resData = JSON.parse(res.data)
    console.log(resData,"根据状态切换数据")
}
 
/**
 * 重连websocket
 * @param {string} pageId 
 */
function reconnect(pageId, type,pointParams, applyData) {
    if (!applyData[pageId] || applyData[pageId].lockWs) {return;}
    applyData[pageId].lockWs = true;
    // 3s重连
    setTimeout(function() {
        if (type === 'real') {
            createWsReal(pageId,pointParams, applyData)
        }
        applyData[pageId].lockWs = false;
    }, 3000)
}

function initialWs(ws, pageId, type,pointParams, applyData) {
    // websocket连接成功
    ws.onopen = function() {
    }
    // 接收消息
    ws.onmessage = function(res) {
        let data = JSON.parse(res.data)
        let dataArr = Object.keys(data)
        if (dataArr[0] === 'rspCode' || dataArr[1] === 'rspMsg') {return}
        if (type === 'real') {
            throttle(setterRealData(res), 600)
        }
    }
    // 接收异常
    ws.onerror = function() {
        reconnect(pageId, type,pointParams, applyData)
    }
    // 关闭
    ws.onclose = function() {
        reconnect(pageId, type,pointParams, applyData)
    }
}

//实时数据
function createWsReal(pageId,pointParams, applyData) {
    getSubscribeInfos(true, pointParams).then((res) => {
        if (applyData[pageId].wsParams.length === 0 || !websocketUrlReal) {
            return;
        }
        const token = getCookie('token');
        let ws = new WebSocket(res.data, token); // 提交时使用这个
        initialWs(ws, pageId, 'real',pointParams, applyData)
        applyData[pageId].ws_real = ws
    })
}

export {
    createWsReal
}
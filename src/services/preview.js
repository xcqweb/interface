/* eslint-disable */
import {getCookie,throttle,setCookie} from '../services/Utils'
// 主函数
let mainProcess;
// 控件xml解析信息
let shapeXmls,applyInfo,fileSystem;
// 正常页面渲染地方
let gePreview;
// 正常的最小x、y偏移量
let minX,minY;
// 页面宽度和高度
let pageWidth=0,pageHeight = 0;
// 配置好的svg图
let configSvg = ['drop', 'circle', 'diamond', 'square', 'pentagram'];
// 默认样式
const defaultStyle = {
    align: 'center',
    verticalAlign: 'middle',
    strokeColor: '#000000',
    fillColor: '#FFFFFF',
    fontSize: '12px'
}
// 浮窗节点
let formatLayer;
let layerData = null;
// websocket信息
let applyData = {};
// 接收的点位数据
let pointData = {};
let pointParams = [];
/**
 * 插入系统自带svg
 * @param {string} key 
 * @param {number} w 
 * @param {number} h 
 * @param {number} x 
 * @param {number} y 
 * @param {string} fillColor 
 * @param {string} strokeColor 
 */
function insertSvg(key, w, h, x, y, fillColor = 'none', strokeColor = '#333') {
    let inner = shapeXmls[key].path;
    let svgContent = document.createElement('div');
    inner.setAttribute('fill', fillColor)
    inner.setAttribute('stroke', strokeColor)
    inner.setAttribute('stroke-width', 1);
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.float = 'left';
    if (key === 'circle') {
        inner.setAttribute('cx', w / 2);
        inner.setAttribute('cy', h / 2);
        inner.setAttribute('rx', w / 2);
        inner.setAttribute('ry', h / 2);
    } else {
        svg.setAttribute('viewBox', shapeXmls[key].viewBox)
    }
    svg.setAttribute('stroke-width', 1);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.innerHTML = inner.outerHTML;
    svgContent.appendChild(svg);
    return svgContent;
}
//获取最后一笔数据
async function getLastData() {
  if(!pointParams.length) return
  let params=[];
  let maps = new Map();
  pointParams.forEach(item=>{
      if(item.pointId){
        let obj={
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
  const res = await geAjax('/api/persist/opentsdb/point/last', 'POST',JSON.stringify(params));
  setterRealDataLast(res)
}

//获取websocket连接信息
var websocketUrl_real = ''
var websocketUrl_alarm = ''

/**
 * 
 * @param {*} isReal 是否是实时数据
 * @param {*} modeId 绑定数据时候 viewTool/model/serach 返回的 模型id
 */
async function getsubscribeInfos(isReal){
    if(!pointParams.length) return
    let params={
        subscribeInfos:[],
        networkProtocol: 'websocket',
    };
    let maps=new Map();
    pointParams.forEach(item => {
        if(item.pointId){
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
                tempObj.params=Array.from(new Set(tempObj.params.concat(obj.params)));
                maps.set(item.pointId,tempObj);
            } else if (isReal){
                maps.set(item.pointId,obj);
            }
            if(!isReal){
                params.subscribeInfos.push(obj)
            }
        }
    });
    if(isReal){
        for (let item of maps.values()) {
            params.subscribeInfos.push(item)
        }
    }
    const data = await geAjax('/api/subscribe', 'POST',JSON.stringify(params));
    isReal?(websocketUrl_real = data.data):(websocketUrl_alarm = data.data)
    return data
}

 

 //报警数据
 function createWs_alarm(pageId) {
    getsubscribeInfos(false).then((res) => {
        if (applyData[pageId].wsParams.length === 0 || !websocketUrl_alarm) {
            return;
        };
        const token = getCookie('token');
        // let ws = new WebSocket(`ws://${location.host}/ws/websocket`, token); // 提交时使用这个
        let ws = new WebSocket(res.data, token); // 提交时使用这个
        // let ws = new WebSocket(`ws://10.74.20.17:8082/websocket`, token); // SIT环境websocket,调试用这个

        initialWs(ws, pageId, 'alarm');
        applyData[pageId].ws_alarm = ws;
    })
}

//实时数据
function createWs_real(pageId) {
  getLastData()
  getsubscribeInfos(true).then( (res) => {
    if ( applyData[pageId].wsParams.length === 0 || !websocketUrl_real) {
      return;
    };
    const token = getCookie('token');
    // let ws = new WebSocket(`ws://${location.host}/ws/websocket`, token); // 提交时使用这个
    let ws = new WebSocket(res.data, token); // 提交时使用这个
    // let ws = new WebSocket(`ws://10.74.20.17:8082/websocket`, token); // SIT环境websocket,调试用这个
    initialWs(ws, pageId,'real');
    applyData[pageId].ws_real = ws;
  })
}
/**
 * 重连websocket
 * @param {string} pageId 
 */
function reconnect (pageId,type) {
  if (!applyData[pageId] || applyData[pageId].lockWs) return;
  applyData[pageId].lockWs = true;
  // 3s重连
  setTimeout(function () {
    if(type === 'real'){
      createWs_real(pageId)
    }else{
      createWs_alarm(pageId)
    }
    
    applyData[pageId].lockWs = false;
  }, 3000)
}

function setterRealDataLast(res){
    setterRealDataDeal(res)
}
function setterRealDataDeal(resData) {
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
/**
 * 
 * @param {object} ws 
 * @param {string} pageId 
 */
function setterRealData(res) {
   let resData = JSON.parse(res.data)
   setterRealDataDeal(resData)
}

 

//处理报警数据
function setterAlarmdata(res) {
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
function initialWs (ws, pageId,type) {
  // websocket连接成功
  ws.onopen = function () {
    // ws.send(JSON.stringify(applyData[pageId].wsParams));
  }
  // 接收消息
  ws.onmessage = function (res) {
    let data = JSON.parse(res.data)
    let dataArr = Object.keys(data)
    if(dataArr[0] === 'rspCode' || dataArr[1] === 'rspMsg') return
     if(type === 'real'){
      throttle(setterRealData(res),600)
    }else{
      throttle(setterAlarmdata(res),600)
    }
  }
  // 接收异常
  ws.onerror = function (e) {
    reconnect(pageId,type)
  }
  // 关闭
  ws.onclose = function (e) {
    reconnect(pageId,type);
  }
}
/**
 * 关闭websocket
 * @param {string} pageId 
 */
function destroyWs (pageId) {
  (applyData[pageId].ws_real && applyData[pageId].ws_real.close()) || (applyData[pageId].ws_alarm && applyData[pageId].ws_alarm.close());
  delete applyData[pageId];
}
/**
 * 设置节点属性
 * @param {string} id 
 * @param {number} alarm 
 */
function setCellStatus(id, alarm, data) {
    // 该参数全部DOM
    let doms = document.getElementsByClassName(id);
    let color = null;
    switch (alarm) {
        case 1:
            // 预警黄
            color = '#FFDA05';  
            break;
        case 2:
            // 告警红
            color = '#FF5542';  
            break;
        case 3:
            // 异常灰
            color = '#A1B0B5';  
            break;
        default:
            color = null;
            break;
    }
    for (let dom of doms) {
        if (dom.childElementCount == 0) {
            let dataFillText = dom.getAttribute('data-filltext');
            let arr;
            if (dataFillText) {
                arr=dataFillText.split(",")
                for (let d in data) {
                    if (arr.indexOf(d)!=-1) {
                        dom.style.backgroundColor = color || dom.getAttribute('data-defaultFill');
                    }
                }
            } else {
                dom.style.backgroundColor = color || dom.getAttribute('data-defaultFill');
            }
        } else {
            dom.getElementsByTagName('svg')[0].firstChild.setAttribute('fill', color || dom.getAttribute('data-defaultFill'));
        }
    }
}
/**
 * 插入图片
 * @param {object} cell 
 */
function insertImage(cell) {
    let svgContent = document.createElement('div');
  
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', cell.width);
    svg.setAttribute('height', cell.height);

    let image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', cell.image.replace(/getechFileSystem/, fileSystem));
    image.setAttribute('width', cell.width);
    image.setAttribute('height', cell.height);
    image.setAttribute('preserveAspectRatio', 'none');

    svg.appendChild(image);
    svgContent.appendChild(svg);
    return svgContent;
}

/**
 * 插入箭头结尾的svg
 * @param {Array} source 起始点
 * @param {Array<Array>} points 中间点 
 * @param {Array} target 结束点
 */
function inserEdge(cell) {
    let {source, points, target} = cell.points;
    let svgContent = document.createElement('div');
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', cell.width);
    svg.setAttribute('height', cell.height);
    svg.innerHTML = `
    <defs>      
        <marker id="arrow" 
        markerUnits="strokeWidth" 
        markerWidth="10" 
        markerHeight="10" 
        refX="8"
        refY="5" 
        orient="auto">
          <path d="M2,2 L8,5 L2,8 L5,5 Z" style="fill:${cell.strokeColor};" />
    </marker>
    </defs>
  `
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    let direct;
    if (cell.shapeName === 'curve') {
        direct = `M${source.join(' ')} C ${points.map(point => `${point.join()} `).join('')} ${target.join()}`
    } else {
        direct = `M${source.join(' ')} ${points.map(point => `T${point.join(' ')} `).join('')} T${target.join(' ')}`
    }
    const attrs = {
        d: direct,
        fill: 'white',
        stroke: cell.strokeColor,
        'stroke-width': 2,
    };
    if (cell.shapeName === 'endarrow') {
        attrs['marker-end'] = "url(#arrow)";
    }
    if(cell.shapeName === 'curve'){
        attrs.fill = 'none'
    }
    for (let item in attrs) {
        path.setAttribute(item, attrs[item])
    }
    svg.appendChild(path);
    svgContent.appendChild(svg);
    return svgContent;
}

/**
 * 加载控件的xml配置文档
 */
function loadShapeXml() {
    return new Promise((resolve, reject) => {
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

/**
 * 原生http
 * @param {string} url  请求地址
 * @param {string} method 请求方法，默认GET方法
 * @param {object} data 请求参数
 */
function geHttp(url, method = 'GET', data = null) {
    const token = getCookie('token');
    const refreshToken = getCookie('refreshToken');
    return new Promise((resolve, reject) => {
        if ( token && refreshToken ) {
            let xmlhttp;
            if(window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            }else{
                //针对IE
                xmlhttp = new ActiveXObject("Microsoft.XMLHttp")
            }
            // 监听readystate，执行回调
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    // 服务器响应正确数据
                    resolve(JSON.parse(xmlhttp.responseText))
                } else if (xmlhttp.readyState == 4) {
                    // 服务器响应错误数据
                    reject(xmlhttp.responseText)
                }
            }
            xmlhttp.open(method, url, true);
            // 设置请求头
            xmlhttp.setRequestHeader("Content-Type","application/json;charset=utf-8");
            xmlhttp.setRequestHeader("Authorization","Bearer " + getCookie('token'));
            xmlhttp.send(data);
        } else {
            reject('登录失效')
        }
    })
}

/**
 * 封装ajax请求
 * @param {string} url  请求地址
 * @param {string} method 请求方法，默认GET方法
 * @param {object} data 请求参数
 */
async function geAjax(url, method = 'GET', data = null) {
    const token = getCookie('token');
    const refreshToken = getCookie('refreshToken');
    if (!token || !refreshToken) {
        alert('登录失效，请重新登录系统！');
        return;
    }
    const t_exp = jwt_decode(token).exp;
    const r_exp = jwt_decode(refreshToken).exp;
    const now = new Date().valueOf();
    if (now > t_exp * 1000 && now < r_exp * 1000) {
    // 刷新token
        await geHttp('/api/auth/refreshToken', 'POST', {refreshToken}).then(res => {
            setCookie('token', res.token);
            setCookie('refreshToken', res.refreshToken);
        })
    } else  if (now > r_exp * 1000) {
        alert('登陆失效，请重新登陆系统！');
        return;
    }

    return new Promise((resolve, reject) => {
        if ( token && refreshToken ) {
            let xmlhttp;
            if(window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            }else{
                //针对IE
                xmlhttp = new ActiveXObject("Microsoft.XMLHttp")
            }
            // 监听readystate，执行回调
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    // 服务器响应正确数据
                    resolve(JSON.parse(xmlhttp.responseText))
                } else if (xmlhttp.readyState == 4) {
                    // 服务器响应错误数据
                    reject(xmlhttp.responseText)
                }
            }
            xmlhttp.open(method, url, true);
            // 设置请求头
            xmlhttp.setRequestHeader("Content-Type","application/json;charset=utf-8");
            xmlhttp.setRequestHeader("Authorization","Bearer " + getCookie('token'));
            xmlhttp.send(data);
        } else {
            reject('登陆失效')
        }
    })
}
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
 * 绑定事件
 * @param {object} ele DOM节点
 * @param {Array} ele DOM节点
 */
function BindEvent(ele, actionsInfo) {
    if (actionsInfo) {
        for(let action of actionsInfo) {
            if (action.mouseEvent !== 'unset' && action.effectAction !== 'unset' && action.link) {
                if ((action.mouseEvent === 'select' || action.mouseEvent === 'unselect') && ele.nodeName !== 'SELECT') {
                    // 单选、复选的选中和取消选中事件
                    ele.addEventListener('click', function(e) {
                        if (ele.checked && action.mouseEvent === 'select') {
                            effectEvent(action);
                        } else if (!ele.checked && action.mouseEvent === 'unselect') {
                            effectEvent(action);
                        }
                    })
                } else if ((action.mouseEvent === 'select' || action.mouseEvent === 'unselect') && ele.nodeName == 'SELECT') {
                    // 下拉框的选中和取消选中事件
                    ele.addEventListener('change', function(e) {
                        if (ele.value !== '请选择' && action.mouseEvent === 'select') {
                            effectEvent(action);
                        } else if (ele.value === '请选择' && action.mouseEvent === 'unselect') {
                            effectEvent(action);
                        }
                    })
                } else {
                    ele.addEventListener(action.mouseEvent, function(e) {
                        e = e || window.event;
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        } else {
                            e.cancelBubble = true;
                        }
                        // 触发事件
                        effectEvent(action);
                    })
                }
            }
        }
    }
}

/**
 * 触发事件
 * @param {object} action 
 */
function effectEvent(action) {
    switch (action.effectAction) {
        case 'show':
            actionShow(action);
            break;
        case 'hide':
            actionHide(action);
            break;
        case 'open':
            actionOpen(action);
            break;
        case 'close':
            actionClose(action);
            break;
        default:
            break;
    }
}
/**
 * 显示事件
 */
function actionShow(action) {
    if (action.innerType === 'palette') {
        document.getElementById('palette_' + action.link).style.display = '';
    } else {
        mainProcess.renderDialog(action.link)
    }
}
/**
 * 隐藏事件
 */
function actionHide(action) {
    if (action.innerType === 'palette') {
        document.getElementById('palette_' + action.link).style.display = 'none';
    } else if (document.getElementById(action.link)) {
        removeEle(document.getElementById(action.link));
        removeEle(document.getElementById('bg_' + action.link));
        // 断开websocket
        destroyWs(action.link);
    }
}
/**
 * 打开事件
 */
function actionOpen(action) {
    if (action.type === 'out') {
    // 打开外部链接
        window.location.href =  `${/^(https|http):\/\//.test(action.link) ? '' : 'http://'}${action.link}`;
    } else if (action.innerType === 'page') {
    // 打开页面
        const pageType = mainProcess.getPageType(action.link);
        if (pageType === 'normal' && mainProcess.pageId !== action.link) {
            mainProcess.pageId = action.link;
            mainProcess.renderNormal();
        } else if (pageType === 'dialog') {
            mainProcess.renderDialog(action.link)
        }
    }
}
/**
 * 关闭事件
 */
function actionClose(action) {
    if (action.innerType === 'page' && action.type === 'in' && document.getElementById(action.link)) {
        removeEle(document.getElementById(action.link));
        removeEle(document.getElementById('bg_' + action.link));
        destroyWs(action.link);
    }
}
/**
 * 渲染页面
 */
class PreviewPage {
    constructor(data) {
        let {
            content,
            describe,
            id,
            name
        } = data;
        let parseContent = JSON.parse(content)
        this.content = parseContent.pages;
        this.pagesRank = parseContent.rank;
        this.describe = describe;
        this.id = id;
        this.name = name;
        this.renderPageId = id;
        this.wsParams = [];
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
            destroyWs(id);
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
        let getNode = (t_id = 1) => {
            let list = [];
            for (let item of root) {
                // 节点类型：object有属性，mxcell无属性
                let node,value,tagName = item.tagName;
                // 节点id
                let id = item.getAttribute('id');
                // 节点交互
                let actionsInfo = JSON.parse(item.getAttribute('actionsInfo'));
                // 数据绑定
                let bindData = JSON.parse(item.getAttribute('bindData'));
                // 链接
                let smartBiLink = item.getAttribute('smartBiLink');
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
                if (parentId == t_id && id) {
                    // 节点参数信息
                    let getNodeInfo = new GetNodeInfo(node);
                    // 节点类型
                    let shapeName = getNodeInfo.getStyles('shape');
                    let x,y,width,height,fillColor,strokeColor,fontColor,fontSize,styles, isGroup, image, hide, align, verticalAlign, selectProps,defaultProp, points,rotation,flipH,flipV;
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
                    strokeColor = (shapeName == 'image' ? getNodeInfo.getStyles('imageBorder') : getNodeInfo.getStyles('strokeColor')) || 'none';
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
                                    if (points.source[0] < points.source[1]){
                                        points.target[0] = 4;
                                        points.source[0] = 4;
                                    }else{
                                        points.target[1] = 4;
                                        points.source[1] = 4;
                                    }
                                }else if (points.source[1] == 0 && points.target[0] == 0) {
                                     if (points.source[0] > points.target[1]) {
                                         points.target[1] -= 4;
                                     } else {
                                         points.target[0] = 4;
                                         points.source[0] = 4;
                                     }
                                }else if (points.source[0] == 0 && points.target[1] == 0) {
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
                        value,
                        isGroup,
                        fontColor,
                        fontSize,
                        image,
                        smartBiLink,
                        actionsInfo,
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
        gePreview.innerHTML = '';
    }
    // 解析页面
    parsePage(page) {
        const xmlDoc = mxUtils.parseXml(page.xml).documentElement;
        const root = xmlDoc.getElementsByTagName('root')[0].childNodes;
        const bodyBackground = xmlDoc.getAttribute('background'); // 新增全背景色
        document.body.setAttribute('style', `background:${bodyBackground}`);
        const list = []
        for (let i = 0; i < root.length; i++) {
            list.push(root[i])
        }
        // 页面宽度和高度
        pageWidth = pageHeight = 0;
        let cells = this.parseCells(list);
        this.renderPageId = page.id;
        this.wsParams = [];
        if (page.type === 'normal') {
            // 清除全部websocket
            for (let key in applyData) {
                destroyWs(key);
            }
            pointData = Object.assign({});
            document.getElementById('geDialogs').innerHTML = '';
            // 正常的最小x、y偏移量
            minX = minY = null;
            // 清空页面内容
            this.clearPage();
            // 正常页面      
            this.renderPages(cells);
            gePreview.style.width = pageWidth + 'px';
            gePreview.style.height = pageHeight + 'px';
        } else {
            // 弹窗页面
            let layerContent = this.createDialog(page.id, page.title);
            layerContent.innerHTML = ``;
            this.renderPages(cells, layerContent);
        }
    applyData[page.id] = {
      ws_real: '',
      ws_alarm: '',
      data: {},
      wsParams: this.wsParams,
      lockWs: false
    };

    applyData[page.id].ws_real = createWs_real(page.id);
    applyData[page.id].ws_alarm = createWs_alarm(page.id);
    return cells;
  }
  // 渲染页面
  renderPages (cells, ele = gePreview) {
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
      console.log(cell)
      let cellHtml = this.renderCell(cell);
      ele.appendChild(cellHtml);
      // 组内资源
      if (cell.children.length) {
        this.renderPages(cell.children, cellHtml);
      }
    }
  }
  
    // 渲染控件节点
    renderCell(cell) {
        console.log(cell)
        const shapeName = cell.shapeName;
        let cellHtml;
        if (shapeName === 'image') {
            // 图片
            cellHtml = insertImage(cell)
        } else if (shapeName === 'linkTag') {
            // smartBi链接iframe
            cellHtml = document.createElement('iframe');
            let curLink = cell.smartBiLink || cell.actionsInfo[0].link
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
            cellHtml = insertSvg(shapeName, cell.width, cell.height, cell.x, cell.y, cell.fillColor, cell.strokeColor)
        } else {
            // 其他
            cellHtml = document.createElement('p');
            cellHtml.innerHTML = cell.value;
        }
        if (!['endarrow', 'beeline', 'curve'].includes(shapeName)) {
            if (cell.verticalAlign === 'top') {
                cellHtml.style.lineHeight = cell.fontSize + 'px';
            } else if (cell.verticalAlign === 'bottom') {
                cellHtml.style.lineHeight = (cell.height * 2 - cell.fontSize) + 'px';
            } else {
                cellHtml.style.lineHeight = cell.height + 'px';
            }
            cellHtml.style.textAlign = cell.align;
            cellHtml.style.backgroundColor = cell.fillColor; // 原来的写法
            if (cell.children.length > 0 && cell.fillColor === '#FFFFFF') {
                cellHtml.style.backgroundColor = 'transparent';
            } // 组合生成的背景为透明
        } else {
            cellHtml.style.lineHeight = 0;
        }
        // svg列表背景透明
        if (['endarrow', 'beeline', 'curve'].includes(shapeName) || configSvg.includes(shapeName)) {
            cellHtml.style.backgroundColor = 'transparent';
        }
        // 非Edge和svg控件
        if (!['endarrow', 'beeline', 'curve'].includes(shapeName) && !configSvg.includes(shapeName)) {
            cellHtml.style.border = `${cell.strokeColor == 'none' ? '' : `1px solid ${cell.strokeColor || defaultStyle.strokeColor}`}`;
            cellHtml.style.width = cell.width + 'px';
            cellHtml.style.height = cell.height + 'px';
        }
        cellHtml.className = 'gePalette';
        // 隐藏
        console.log(cellHtml)
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
        BindEvent(cellHtml, cell.actionsInfo)
        // 浮窗
        if (cell.bindData && cell.bindData.point && cell.bindData.params.length > 0) {
            if (cell.bindData.fillVariable) {
                // 需要填充数据
                cellHtml.className += ` ${cell.bindData.point} ${cell.bindData.point}_text`;
                cellHtml.setAttribute('data-filltext', cell.bindData.params.map(item=>{return item.name}).join(","));
                cellHtml.innerHTML = '';
            } else {
                // 根据接收数据
                cellHtml.className += ` ${cell.bindData.point}`;
            }
            cellHtml.setAttribute('data-defaultFill', cell.fillColor)
            // 显示
            cellHtml.addEventListener('mousemove', (e) => {
                const bodyScrollTop = document.getElementsByTagName('body')[0].scrollTop; // body滚动
                const bodyScrollLeft = document.getElementsByTagName('body')[0].scrollLeft;
                const htmlScrollTop = document.getElementsByTagName('html')[0].scrollTop; // 最外层滚动
                const htmlScrollLeft = document.getElementsByTagName('html')[0].scrollLeft;
                layerData = cell.bindData;
                this.renderLayer();
                formatLayer.style.left =  e.clientX + bodyScrollLeft + htmlScrollLeft + 5 + 'px';
                formatLayer.style.top = e.clientY + bodyScrollTop + htmlScrollTop + 5 + 'px';
                formatLayer.style.opacity = '1';
            })
            // 隐藏
            cellHtml.addEventListener('mouseleave', () => {
                formatLayer.style.opacity = 0;
                layerData = null;
            })
        }
        return cellHtml;
    }
    // 渲染浮窗
    renderLayer() {
        formatLayer.innerHTML = '';
        const data = Object.assign({}, pointData[layerData.point]);
        if (!Object.keys(data).length) {return;}
        let params = [{name: 'timestamp'}].concat(layerData.params)
        let leftKeys = document.createElement('ul');
        leftKeys.id = 'leftKeys';
        let rightKeys = document.createElement('ul');
        rightKeys.id = 'rightKeys';
        // 填充内容
        for (let param of params) {
            let leftInfo = document.createElement('li');
            leftInfo.innerHTML = `${param.name}=`;
            let rightInfo = document.createElement('li');
            rightInfo.innerHTML = data[param.name]
            rightInfo.innerHTML = param.name === 'timestamp' ? data[param.name] : data[param.name] !== undefined ? data[param.name] : 'NaN';
            leftKeys.appendChild(leftInfo);
            rightKeys.appendChild(rightInfo);
        }
        formatLayer.appendChild(leftKeys);
        formatLayer.appendChild(rightKeys);
    }
}

/**
 * 获取控件样式
 */
class GetNodeInfo {
    constructor(node) {
        this.node = node
        this.styles = this.node.getAttribute('style')
    }

    getStyles(key) {
        let reg = new RegExp(key + '=(.+?);')
        let execStr = reg.exec(this.styles);
        return execStr ? execStr[1] : '';
    }
}

/**
 * 执行渲染主函数
 */
class Main {
    constructor() {
    // 应用的页面信息
        this.previewPage = null;
        // 当前页面
        this.pageId = null;
    }

    // 初始化
    async init() {
        gePreview = document.getElementById('gePreview');
        formatLayer = document.getElementById('formatLayer')
        let id = /id=(.+?)$/.exec(location.search);
        console.log(id)
        if ( id ) {
            // 查看应用
            id = id[1];
        }
        // const host = await geAjax('/api/image/host', 'GET');
        const host = await geAjax('/api/console/host/imageHost', 'GET');
        fileSystem = host.host;
        // applyInfo = await geAjax(`/api/viewtool/${id}`, 'GET');
        applyInfo = await geAjax(`/api/iot-cds/cds/configurationDesignStudio/${id}`, 'GET');
        shapeXmls = await loadShapeXml();
        if (!applyInfo) {
            console.log('未查到对应数据')
            return;
        }
        // 设置页签名称
        document.getElementsByTagName('title')[0].innerHTML = applyInfo.name;
        // 设置默认页面
        this.previewPage = new PreviewPage(applyInfo);
        this.pageId = this.previewPage.pagesRank.normal[0];
        // 渲染页面
        this.renderNormal();
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
        this.previewPage.parsePage(pageContent);
    }

    // 渲染弹窗
    renderDialog(id) {
        let pageContent = this.previewPage.content[id];
        this.previewPage.parsePage(pageContent);
    }

    // 渲染浮窗
    renderLayer() {
        this.previewPage.renderLayer()
    }
}
mainProcess = new Main();
export default {
    mainProcess
}
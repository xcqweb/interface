import {getCookie, setCookie} from '../Utils'
import {data1,data2} from '../../constants/chart-default-data'
import echarts from 'echarts'
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
    (applyData[pageId].ws_real && applyData[pageId].ws_real.close()) || (applyData[pageId].ws_alarm && applyData[pageId].ws_alarm.close());
    delete applyData[pageId];
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
        showTips(true, '登陆失效，请重新登陆系统！')
        return;
    }
    const tExp = window.jwt_decode(token).exp;
    const rExp = window.jwt_decode(refreshToken).exp;
    const now = new Date().valueOf();
    if (now > tExp * 1000 && now < rExp * 1000) {
        // 刷新token
        await geHttp('/api/auth/refreshToken', 'POST', {
            refreshToken
        }).then(res => {
            setCookie('token', res.token);
            setCookie('refreshToken', res.refreshToken);
        })
    } else if (now > rExp * 1000) {
        showTips(true,'登陆失效，请重新登陆系统！')
        return;
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
            if (token && refreshToken) {
                let xmlhttp;
                if (window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();
                } else {
                    //针对IE
                    xmlhttp = new window.ActiveXObject("Microsoft.XMLHttp")
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
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=utf-8");
                xmlhttp.setRequestHeader("Authorization", "Bearer " + getCookie('token'));
                xmlhttp.send(data);
            } else {
                reject('登录失效')
            }
        })
    }

    return new Promise((resolve, reject) => {
        if (token && refreshToken) {
            let xmlhttp;
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            } else {
                //针对IE
                xmlhttp = new window.ActiveXObject("Microsoft.XMLHttp")
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
            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=utf-8");
            xmlhttp.setRequestHeader("Authorization", "Bearer " + getCookie('token'));
            xmlhttp.send(data);
        } else {
            reject('登陆失效')
        }
    })
}

/**
 * 插入图片
 * @param {object} cell 
 */
function insertImage(cell, fileSystem) {
    let con = document.createElement('div');
    if(cell.image) {
        con.style.background = `url('${cell.image.replace(/getechFileSystem/, fileSystem)}')`
    }
    return con
}

/**
 * 插入箭头结尾的svg
 * @param {Array} source 起始点
 * @param {Array<Array>} points 中间点 
 * @param {Array} target 结束点
 */
function inserEdge(cell) {
    let {
        source,
        points,
        target,
    } = cell.points;
    console.log(source,points,target)
    let {startArrow,
        endArrow,
        strokeStyle} = cell
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
            <path d="M2,2 L8,5 L2,8 L5,5 Z" style="fill:${cell.strokeColor};"/>
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
        stroke: cell.strokeColor,
        'stroke-width': 2,
    };
    if (strokeStyle) {
        attrs['stroke-dasharray'] = '2.25 2.25'
    }
    if (cell.shapeName === 'endarrow') {
        attrs['marker-end'] = "url(#arrow)";
    }
    if (cell.shapeName === 'curve') {
        attrs.fill = 'none'
    }
    if (startArrow && startArrow == 'classic') {
        attrs['marker-start'] = "url(#arrow)"
    }
    if (endArrow && endArrow == 'classic') {
        attrs['marker-end'] = "url(#arrow)"
    }
    for (let item in attrs) {
        path.setAttribute(item, attrs[item])
    }
    svg.appendChild(path);
    svgContent.appendChild(svg);
    return svgContent;
}

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
function insertSvg(key, w, h, x, y, fillColor = '#000', strokeColor = '#000', shapeXmls) {
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
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.innerHTML = inner.outerHTML;
    svgContent.appendChild(svg);
    return svgContent;
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
function actionClose(action, applyData) {
    if (action.innerType === 'page' && action.type === 'in' && document.getElementById(action.link)) {
        removeEle(document.getElementById(action.link));
        removeEle(document.getElementById('bg_' + action.link));
        destroyWs(applyData,action.link);
    }
}

/**
 * 触发事件
 * @param {object} action 
 */
function effectEvent(action, mainProcess, applyData) {
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
            actionChange(action)
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
function actionChange(action) {
    let cellCon = document.getElementById('palette_' + action.link)
    let {stateInfo} = action
    if (stateInfo.animateCls) {
        cellCon.classList.add(stateInfo.animateCls)
    }
    for (let key in stateInfo.style) {
        cellCon.style[key] = stateInfo.style[key]
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
function bindEvent(ele, cellInfo, mainProcess, applyData) {
    let {actionsInfo} = cellInfo
    if (actionsInfo) {
        for (let action of actionsInfo) {
            if (action.mouseEvent !== 'unset' && action.effectAction !== 'unset' && action.link) {
                if ((action.mouseEvent === 'select' || action.mouseEvent === 'unselect') && ele.nodeName !== 'SELECT') {
                    // 单选、复选的选中和取消选中事件
                    ele.addEventListener('click', function() {
                        if (ele.checked && action.mouseEvent === 'select') {
                            effectEvent(action, mainProcess, applyData);
                        } else if (!ele.checked && action.mouseEvent === 'unselect') {
                            effectEvent(action, mainProcess, applyData);
                        }
                    })
                } else if ((action.mouseEvent === 'select' || action.mouseEvent === 'unselect') && ele.nodeName == 'SELECT') {
                    // 下拉框的选中和取消选中事件
                    ele.addEventListener('change', function() {
                        if (ele.value !== '请选择' && action.mouseEvent === 'select') {
                            effectEvent(action, mainProcess, applyData);
                        } else if (ele.value === '请选择' && action.mouseEvent === 'unselect') {
                            effectEvent(action, mainProcess, applyData);
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
                        effectEvent(action, mainProcess, applyData);
                    })
                }
            }
        }
    }
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
                arr = dataFillText.split(",")
                for (let d in data) {
                    if (arr.indexOf(d) != -1) {
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
    let progressPropsObj
    let percent = 0.8
    let text = ''
    if(progressProps) {
        progressPropsObj = JSON.parse(progressProps)
        if(progressPropsObj.type == 'real') {
            text = progressPropsObj.val
        }else{
            if(!progressPropsObj.val) {
                percent = 0
            }else{
                percent = progressPropsObj.val / (+progressPropsObj.max - (+progressPropsObj.min)).toFixed(2)
            }
            text = percent
        }
    }
    let progressTop = -(cell.height + 4)
    let progress = `<div class="progressbar-wrap" style="width:${cell.width}px;">
            <div class="progressbar-common progressbar-back" style="height:${cell.height}px;"></div> 
            <div class="progressbar-common progressbar progress" style="height:${cell.height}px;top:${progressTop}px;width:${percent * 100}%;">${text}</div> 
        </div>`
    con.innerHTML = progress
    let root = document.documentElement
    root.style.setProperty('--progressPercent',`${percent * 100}%`)
    return con
}

function dealPipeline(cell) {
    let pipeline1ImgUrl = 'static/stencils/basic/npipeline1.svg'
    let con = document.createElement('div')
    let pipelineProps = cell.pipelineProps
    let dasharray = 0
    let dashoffset = 16
    let pipelinePropsObj
    if (pipelineProps) {
        pipelinePropsObj = JSON.parse(pipelineProps)
        dasharray = 8
        pipeline1ImgUrl = 'static/stencils/basic/pipeline_forward.svg'
        if(pipelinePropsObj.flow == 'back') {
            dashoffset = -16
            pipeline1ImgUrl = 'static/stencils/basic/pipeline_back.svg'
        }
    }
    let pipeline2 = `<svg 
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="${cell.width}px" height="${cell.height}px" viewbox="0 0 25 24">
        <style type="text/css">
            .flow2 {
                stroke-dasharray: ${dasharray};
                animation: dash2 0.5s linear;
                animation-iteration-count: infinite; 
            }
            @keyframes dash2 {
                to{
                    stroke-dashoffset: ${dashoffset}; 
                }
            }
        </style>
        <path fill-rule="evenodd"  stroke="rgb(125, 125, 125)" stroke-width="1px" stroke-linecap="butt" stroke-linejoin="miter" fill="rgb(203, 203, 203)"
        d="M24.000,2.007 L13.541,2.003 L13.521,2.003 C13.348,1.999 13.177,1.999 13.008,2.003 L12.349,2.042 C2.964,2.042 2.003,4.370 2.003,12.993 C2.003,13.229 2.000,13.463 2.010,13.696 L2.010,22.000 L12.000,22.000 L12.000,16.000 C12.000,14.266 11.844,12.000 13.000,12.000 L22.000,12.000 L24.000,12.000 L24.000,2.007 Z"/>
        
        <path fill-rule="evenodd"  stroke="rgb(255, 255, 255)" stroke-width="1px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
        d="M24.000,6.007 L13.541,6.003 L13.521,6.003 C13.348,5.999 13.177,5.999 13.008,6.003 L12.000,6.000 C5.951,6.000 6.002,8.456 6.002,14.993 C6.002,15.229 6.000,15.463 6.011,15.696 L6.011,23.000 " class="flow2"/>
        <path fill-rule="evenodd"  fill="rgb(125, 125, 125)"
        d="M22.999,-0.000 C23.552,-0.000 24.000,0.448 24.000,1.000 L24.000,13.000 C24.000,13.552 23.552,14.000 22.999,14.000 C22.448,14.000 22.000,13.552 22.000,13.000 L22.000,1.000 C22.000,0.448 22.448,-0.000 22.999,-0.000 Z"/>
        <path fill-rule="evenodd"  fill="rgb(125, 125, 125)"
        d="M1.001,21.000 L13.000,21.000 C13.552,21.000 13.999,21.448 13.999,22.000 C13.999,22.552 13.552,23.000 13.000,23.000 L1.001,23.000 C0.448,23.000 -0.000,22.552 -0.000,22.000 C-0.000,21.448 0.448,21.000 1.001,21.000 Z"/>
        </svg>`
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', cell.width)
    svg.setAttribute('height', cell.height)

    let image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    image.setAttribute('href', pipeline1ImgUrl)
    image.setAttribute('width', cell.width)
    image.setAttribute('height', cell.height)

    svg.appendChild(image)
    if(cell.shapeName == 'pipeline1') {
        con.appendChild(svg)
    }else{
        con.innerHTML = pipeline2
    }
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
        myEchart.setOption(options)
    })
    return con
}
 
function dealLight(cell) {
    let con = document.createElement('div')
    let light = `<svg 
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="${cell.width}px" height="${cell.height}px" viewbox="0 0 27.5 26.5">
        <path fill-rule="evenodd"  stroke="rgb(125, 125, 125)" stroke-width="1px" stroke-linecap="butt" stroke-linejoin="miter" fill="rgb(203, 203, 203)"
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

export {
    removeEle, destroyWs, geAjax, insertImage, inserEdge, insertSvg, bindEvent, setCellStatus, showTips,
    dealProgress, dealPipeline, dealCharts, dealLight
}
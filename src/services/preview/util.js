import {getCookie, setCookie} from '../Utils'
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
    let {
        source,
        points,
        target
    } = cell.points;
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
    if (cell.shapeName === 'curve') {
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
 * 插入系统自带svg
 * @param {string} key 
 * @param {number} w 
 * @param {number} h 
 * @param {number} x 
 * @param {number} y 
 * @param {string} fillColor 
 * @param {string} strokeColor 
 */
function insertSvg(key, w, h, x, y, fillColor = 'none', strokeColor = '#333', shapeXmls) {
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
function actionClose(action) {
    if (action.innerType === 'page' && action.type === 'in' && document.getElementById(action.link)) {
        removeEle(document.getElementById(action.link));
        removeEle(document.getElementById('bg_' + action.link));
        destroyWs(action.link);
    }
}

/**
 * 触发事件
 * @param {object} action 
 */
function effectEvent(action, mainProcess) {
    switch (action.effectAction) {
        case 'show':
            actionShow(action, mainProcess);
            break;
        case 'hide':
            actionHide(action);
            break;
        case 'open':
            actionOpen(action, mainProcess);
            break;
        case 'close':
            actionClose(action);
            break;
        default:
            break;
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
 * 绑定事件
 * @param {object} ele DOM节点
 * @param {Array} ele DOM节点
 */
function bindEvent(ele, actionsInfo, mainProcess) {
    if (actionsInfo) {
        for (let action of actionsInfo) {
            if (action.mouseEvent !== 'unset' && action.effectAction !== 'unset' && action.link) {
                if ((action.mouseEvent === 'select' || action.mouseEvent === 'unselect') && ele.nodeName !== 'SELECT') {
                    // 单选、复选的选中和取消选中事件
                    ele.addEventListener('click', function() {
                        if (ele.checked && action.mouseEvent === 'select') {
                            effectEvent(action, mainProcess);
                        } else if (!ele.checked && action.mouseEvent === 'unselect') {
                            effectEvent(action, mainProcess);
                        }
                    })
                } else if ((action.mouseEvent === 'select' || action.mouseEvent === 'unselect') && ele.nodeName == 'SELECT') {
                    // 下拉框的选中和取消选中事件
                    ele.addEventListener('change', function() {
                        if (ele.value !== '请选择' && action.mouseEvent === 'select') {
                            effectEvent(action, mainProcess);
                        } else if (ele.value === '请选择' && action.mouseEvent === 'unselect') {
                            effectEvent(action, mainProcess);
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
                        effectEvent(action, mainProcess);
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

export {
    removeEle, destroyWs, geAjax, insertImage, inserEdge, insertSvg, bindEvent, setCellStatus, showTips
}
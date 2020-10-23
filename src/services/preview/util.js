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
        url:`${window.location.origin}${window.API_PREFIX}/${url}`,
        success: function(res) {
          resolve(res)
        },
        error:function(res) {
          if (res.status == 418) {
            geAjax(`${window.API_PREFIX}/api/auth/refreshToken`, 'POST', {
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
    con.innerHTML = `<svg width="${cell.width}px" height="${cell.height}px">
            <image x="0" y="0" width="${cell.width}px" height="${cell.height}px" preserveAspectRatio="none"
              xlink:href="${cell.image}"/>
          </svg>`
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
  if (action.innerType === 'page') {
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
  if (action.innerType === 'page' && document.getElementById(action.link)) {
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
function effectEvent(action, mainProcess, applyData, fileSystem,bindData) {
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
    case 'send':// 下发指令
      actionSend(action,mainProcess,bindData)
      break;
    default:
      break;
  }
}
function actionSend(action,mainProcess,bindData) {
  let {data} = action,controlList = [],commandTemplateId
  // 调用下发指令接口，发出指令
  let sendFun = ()=>{
    // 先拿指令下的variables
    let deviceId = mainProcess.applyInfo.deviceId
    if(bindData && bindData.dataSource && bindData.dataSource.deviceNameChild) { // 触发action的绑定的都是单设备，不需要判断deviceNameChild为数组的情况
      deviceId = bindData.dataSource.deviceNameChild.id
    }
    requestUtil.get(`${urls.commandTemplate.url}${data.detail.deviceModelId}`).then(res =>{
      if(res && res.length) {
        controlList = res
        const obj = controlList.filter(item => {
          return item.functionId === data.detail.functionId
        })
        if(obj && obj.length) {
          commandTemplateId = obj[0].commandTemplateId
          const params = {
            deviceId,
            deviceModelId:data.detail.deviceModelId,
            functionId: data.detail.functionId,
            commandTemplateId,
          }
          requestUtil.get(urls.commandTplVariable.url,params).then(res=>{
            let variables = res.variables
            let commandParams = {
              commandTemplateId:commandTemplateId,
              deviceId,
              sourceOrg:'IoT',
              sendSource:'configurationDesignStudio',
              timestamp:new Date().getTime(),
              serialnumber:guid(),
              command:variables
            }
            requestUtil.post(urls.commandSend.url,commandParams).then(result=>{
              if(result.code == 0) {
                mainProcess.previewContext.success('指令下发成功')
              }
            })
          })
        }
      }
    })
  }
  if(data.isTip) {
    mainProcess.previewContext.confirmVisible = true
    mainProcess.previewContext.confirmCb = ()=>{ 
      // if(isPwd == 1) { 
      //   mainProcess.previewContext.inputPwdVisible = true
      //   mainProcess.previewContext.sendCb = (pwd)=>{
      //     sendFun()
      //   }
      // }
      sendFun()
    }
  }else{
    sendFun()
  }
}
/**
 * 把目标控件切换 为选中的状态
 * @param {*} action 
 * @param {*} cellInfo 
 */
function actionChange(action, fileSystem) {
  let cellCon = document.getElementById('palette_' + action.link)
  let shapeName = $(cellCon).data('shapeName')
  let {stateInfo} = action
  if (stateInfo.animateCls) {
    cellCon.classList.add(stateInfo.animateCls)
  }
  let svgShapes = svgShape()
  if(svgShapes.includes(shapeName)) {
    let path = $(cellCon).find("path")
    path.attr('fill',stateInfo.style.background)
    path.attr('stroke',stateInfo.style.borderColor)
    let text = $(cellCon).find('.text-show')
    text.css('color',stateInfo.style.color)
    return
  } 
  let imgInfo = stateInfo.imgInfo
  for (let key in stateInfo.style) {
    cellCon.style[key] = stateInfo.style[key]
  }
  if(imgInfo) {
    cellCon.style.background = "transparent"
    imgInfo.url = imgInfo.url.replace(/getechFileSystem\//, fileSystem)
    setSvgImageHref(cellCon,imgInfo.url)
  }
}
// 设置svg iamge 的href
function setSvgImageHref(el,imgUrl) {
  let svg = el.children[0]
  if(svg && svg.children.length) {
    let svgImage = svg.children[0]
    svgImage.href.baseVal = imgUrl
  }
}
//svg控件要改变样式的
function svgShape() {
  return [
    'triangle','pentagram'
  ]
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
// 获取uuiid
function guid() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
/**
 * 绑定事件 （2019.8.30 版本后，mouseEvent只有click事件了，为了兼容以前的生产版本上的应用，暂时留着其他的事件）
 * @param {object} ele DOM节点
 * @param {Array} ele DOM节点
 */
function bindEvent(ele, cellInfo, mainProcess, applyData, fileSystem) {
  let {actionsInfo,bindData} = cellInfo
  let dealBubble = e=>{
    e = e || window.event;
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }
  if (actionsInfo) {
    ele.style.cursor = "pointer"
    for (let action of actionsInfo) {
      ele.addEventListener(action.mouseEvent, function(e) {
        dealBubble(e)
        // 触发事件
        effectEvent(action, mainProcess, applyData,fileSystem,bindData)
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
function dealCharts(mainProcess,cell,context) {
  let con = document.createElement('div')
  let selectCon = document.createElement('div')
  let needAddEvent = false
  if(cell.bindData && cell.bindData.params) {
    let params = cell.bindData.params
    selectCon.style.cssText = `display:flex;position:absolute;width:${cell.width}px;height:24px;left:0;top:0;justify-content:flex-end;z-index:10;`
    if(params.length > 1) {
      selectCon.appendChild(createSelect(params))
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
    if (cell.shapeName == 'lineChart') {
      options.yAxis.max = ""
    }
  }else{
    if(cell.shapeName == 'lineChart') {
      options = data1
    }else{
      options = data2
    }
  }
  let fun = () => {
    let myEchart = echarts.init(chartCon)
    if (cell.bindData && cell.bindData.dataSource && cell.bindData.params && cell.bindData.params.length && (cell.bindData.dataSource.deviceNameChild || context.deviceId)) {
      let temp = $(con).data("paramShowDefault")
      if(temp) {
        let titleShow = temp.paramName
        let paramId = temp.paramId
        let paramType = temp.paramType
        let devices = cell.bindData.dataSource.deviceNameChild
        if(!Array.isArray(devices) && devices) {
          devices = [devices]
        } else if(!devices && context.deviceId) {//组态模板的情况
          devices = [{
            id:context.deviceId,
            name:context.deviceName
          }]
        }
        if (cell.shapeName == 'lineChart') {
          let tempOptions = JSON.parse(JSON.stringify(options))
          tempOptions.xAxis.data = []
          const base = 12
          if(titleShow.length > base) { // 防止y轴名字展示不全
            let arr = new Array(titleShow.length * 2 - base).fill(' ')
            titleShow = arr.join('') + titleShow
          }
          tempOptions.yAxis.name = titleShow
          tempOptions.legend.data = []
          let tempLegend = [], tempSeries = []
          let markLine = tempOptions.series[0].markLine
          let markLineMax = 0, markValArr = []
          let paramIds = []
          const historyDataFun = ()=>{
            if(paramIds.length) {
              requestUtil.get(`${urls.timeSelect.url}${paramId}`, {paramType: paramType == 'device' ? 0 : 1}).then(res => {
                let checkItem = res.durations.find((item) => {
                  return item.checked === true
                })
                let chartDataLen = Math.ceil(checkItem && checkItem.duration / res.rateCycle)
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
                requestUtil.post(`${urls.pentSdbData.url}`, pentSdbParams).then(res => {
                  if (res && res.length) {
                    let xAxisData = []
                    for(let i = 0;i < res.length;i++) {
                      let tempArr = res[i]
                      let device = devices[i]
                      if(device) {
                        tempLegend.push(device.name)
                        tempOptions.legend.data = tempLegend
                        tempSeries.push({
                          type: 'line',
                          name: device.name,
                          markLine: markLine,
                          data: [],
                          deviceId: device.id, //设备id，额外添加的，匹配数据时候用
                        })
                        if(JSON.stringify(res[i]) === '{}') {
                          continue
                        }
                        if(tempArr && tempArr.resMap && JSON.stringify(tempArr.resMap) !== '{}') {
                          let keys = Object.keys(tempArr.resMap).sort((a,b)=>a - b)
                          xAxisData = []
                          for (let key of keys) {
                            xAxisData.push(timeFormate(key, false))
                            tempSeries[i].data.push(tempArr.resMap[key])
                          }
                          if(tempOptions.yAxis.max) {
                            tempOptions.yAxis.max = Math.max(...tempSeries[i].data, markLineMax,tempOptions.yAxis.max)
                          }else{
                            tempOptions.yAxis.max = Math.max(...tempSeries[i].data, markLineMax)
                          }
                          tempOptions.series = tempSeries
                        }
                      }
                    }
                    tempOptions.xAxis.data = xAxisData
                    myEchart.setOption(tempOptions)
                  }
                },()=>{
                  myEchart.setOption(options)
                })
              })
            }else{
              myEchart.setOption(tempOptions)
            }
          }
          if(context.deviceId) {// 组态模板的情况
            const paramShow = $(con).data('paramShow')
            let emptyDeviceParamIds = paramShow.map((item)=>{
              return {
                paramType: item.paramType == 'device' ? 0 : 1,
                deviceId: context.deviceId,
                partId: item.partId,
                paramId: item.paramId
              }
            })
            requestUtil.post(urls.deviceParamGenerate.url,emptyDeviceParamIds).then((res)=>{
              let resParam = [],maps = new Map()
              res.forEach(item=>{
                let tempArr = []
                if (maps.has(item.deviceId)) {
                  tempArr =  maps.get(item.deviceId)
                  tempArr.push(item.deviceParamId)
                  maps.set(item.deviceId,Array.from(new Set(tempArr)))
                }else{
                  maps.set(item.deviceId, [item.deviceParamId])
                }
              })
              for (let key of maps.keys()) {
                resParam.push({
                  deviceId:key,
                  params:maps.get(key)
                })
              }
              let tempPId = dealDefaultParams(context.deviceId,temp,resParam).deviceParamId
              if(tempPId) {
                paramIds[0] = tempPId
                historyDataFun()
              }
            })
          } else{
            devices.forEach((device,index)=>{
              let tempPId = dealDefaultParams(device.id,temp,$(con).data('subParams')).deviceParamId
              if(tempPId) {
                paramIds[index] = tempPId
              }
            })
            historyDataFun()
          }
         
        } else {//仪表盘
          let data = mainProcess.realData.find(item=>{
            return item.deviceId == devices[0].id
          })
          let val = 0
          if(data) {
            val = data[temp.deviceParamId] || 0
          }
          options.series.data = [{value: val, name: titleShow}]
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
      $(con).data("paramShowDefault",params[$(this).val()])
      fun()
    })
  }
  $(()=>{
    fun()
  })
  return con
}
function dealDefaultParams(deviceId,defaultParam,subParams) {
  let {partId,paramId} = defaultParam
  let resDeviceParamArr,resDeviceParam = null
  if(!subParams) {
    return defaultParam
  }
  resDeviceParamArr = subParams.find(item=>{
    return item.deviceId == deviceId
  })
  if(resDeviceParamArr && resDeviceParamArr.params.length) {
    for(let i = 0;i < resDeviceParamArr.params.length;i++) {
      let item = resDeviceParamArr.params[i]
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
 
function dealLight(cell) {
  let con = document.createElement('div')
  con.innerHTML = `<svg width="${cell.width}px" height="${cell.height}px">
    <image x="0" y="0" width="${cell.width}px" height="${cell.height}px" preserveAspectRatio="none"
        xlink:href="../../..${window.PREFIX_PATH}/static/stencils/basic/light.png"/>
    </svg>`
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
function insertSvg(shapeXmls,key,cell) {
  let {width,height,fillColor,strokeColor,strokeWidth,strokeStyle} = cell
  let inner = shapeXmls[key].path
  inner[0].setAttribute('fill', fillColor)
  inner[0].setAttribute('stroke', strokeColor)
  inner[0].setAttribute('stroke-width', strokeWidth)
  inner[0].setAttribute('vector-effect','non-scaling-stroke')
  let dashArr = '0 0'
  if(strokeStyle) {
    dashArr = `${strokeWidth * 3} ${strokeWidth * 3}`
  }
  inner[0].setAttribute('stroke-dasharray',dashArr)
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', shapeXmls[key].viewBox)
  svg.setAttribute('width', width)
  svg.setAttribute('height', height)
  svg.setAttribute('preserveAspectRatio',"none slice")
  let res = ''
  for(let item of inner) {
    res += item.outerHTML
  }
  svg.innerHTML = res
  return svg
}
function dealTriangle(cell) {
  let {width,height,fillColor,strokeColor,strokeWidth,strokeStyle} = cell
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
  con.appendChild(dealAlignText(cell))
  return con
}
function dealAlignText(cell) {
  let {width,height,fontColor,value,verticalAlign,align} = cell
  let textCon = document.createElement('div')
  textCon.className = "text-show"
  let alignItems = 'flex-start'
  let justifyContent = 'flex-start'
  if (align === 'left') {
    justifyContent = 'flex-start'
  } else if (align === 'right') {
    justifyContent = 'flex-end'
  } else {
    justifyContent = 'center'
  }
  if (verticalAlign === 'top') {
    alignItems = 'flex-start'
  } else if (verticalAlign === 'bottom') {
    alignItems = 'flex-end'
  } else {
    alignItems = 'center'
  }
  textCon.style.cssText = `display:flex;width:${width}px;height:${height}px;position:absolute;color:${fontColor};left:0;top:0;align-items:${alignItems};justify-content:${justifyContent};`
  textCon.innerHTML = `${value}`
  return textCon
}
function dealSvgWidgets(mainProcess,cell,shapeName) {
  let con = document.createElement('div')
  let content = insertSvg(mainProcess.shapeXmls,shapeName,cell)
  con.appendChild(content)
  con.appendChild(dealAlignText(cell))
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
          path: shape.children
        };
      }
      resolve(obj)
    })    
  })
}
function getQueryVariable(variable) {
  var query = window.location.search.substring(1)
  var vars = query.split("&")
  for (var i = 0;i < vars.length;i++) {
    var pair = vars[i].split("=")
    if(pair[0] == variable) {
      return pair[1]
    }
  }
  return null
}
export {
  removeEle, destroyWs, geAjax, insertImage, insertEdge, bindEvent, showTips, timeFormate,dealTriangle,dealSvgWidgets,loadShapeXml,
  dealProgress, dealPipeline, dealCharts, dealLight, toDecimal2NoZero, throttleFun, hideFrameLayout,dealDefaultParams,insertSvg,svgShape,setSvgImageHref,getQueryVariable
}
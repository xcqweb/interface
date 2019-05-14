// 编辑model
const model = new mxGraphModel();
// 控件xml解析信息
let shapeXmls,applyInfo,fileSystem;
// 正常页面渲染地方
let gePreview = document.getElementById('gePreview');
// 正常的最小x、y偏移量
let minX = minY = 0;
// 页面宽度和高度
let pageWidth = pageHeight = 0;
// 配置好的svg图
let configSvg = ['drop', 'circle', 'diamond', 'square', 'pentagram'];
// 默认样式
const defaultStyle= {
  align: 'center',
  verticalAlign: 'middle',
  strokeColor: '#000000',
  fillColor: '#FFFFFF',
  fontSize: '12px'
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
function insertSvg(key, w, h, x, y, fillColor = 'none', strokeColor='#333') {
  let inner = shapeXmls[key].path;
  let svgContent = document.createElement('div');
  inner.setAttribute('fill', fillColor)
  inner.setAttribute('stroke', strokeColor)
  
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', shapeXmls[key].viewBox)
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  // svg.setAttribute('transform', `translate(${x}, ${y})`)
  svg.innerHTML = inner.outerHTML;
  svgContent.appendChild(svg);
  return svgContent;
  // document.body.appendChild(svgContent)
}

/**
 * 插入箭头结尾的svg
 * @param {Array} source 起始点
 * @param {Array<Array>} points 中间点 
 * @param {Array} target 结束点
 */
function inserEdge (cell) {
  let { source, points, target } = cell.points;
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
          <path d="M2,2 L8,5 L2,8 L5,5 L2,2" style="fill:${cell.strokeColor};" />
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
function loadShapeXml () {
  return new Promise((resolve, reject) => {
    mxUtils.get('/static/stencils/preview.xml', function (res) {
      let root = res.getXml();
      let obj = {};
      let shape = root.documentElement.firstChild;
      while (shape != null) {
        if (shape.nodeType == 1) {
          obj[shape.getAttribute('name')] = {
            viewBox: shape.getAttribute('viewBox'),
            path: shape.children[0]
          };
        }
        shape = shape.nextSibling
      }
      resolve(obj)
    })    
  })
}

/**
 * 提示信息
 * @param {boolean} flag 失败提示还是成功提示 
 */
function showTips (flag=true, title='请求') {
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
 * 获取cookie信息
 * @param {string} cname cookie的key值
 */
function getCookie (cname) {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {c = c.substring(1); }
    if (c.indexOf(name) !== -1) {return c.substring(name.length, c.length); }
  }
  return '';
};
/**
 * 封装ajax请求
 * @param {string} url  请求地址
 * @param {string} method 请求方法，默认GET方法
 * @param {object} data 请求参数
 */
function geAjax (url, method = 'GET', data = null) {
  const token = getCookie('token');
  return new Promise((resolve, reject) => {
    if ( token ) {
      let xmlhttp;
      if(window.XMLHttpRequest){
        xmlhttp =new XMLHttpRequest();
      }else{
        //针对IE
        xmlhttp = new ActiveXObject("Microsoft.XMLHttp")
      }
      // 监听readystate，执行回调
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 &&xmlhttp.status ==200){
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

function showDialog() {
  let bg = document.createElement('div');
}

/**
 * 渲染页面
 */
class PreviewPage {
  constructor(data){
    let {
      content,
      describe,
      id,
      name
    } = data;
    this.content = JSON.parse(content);
    this.describe = describe;
    this.id = id;
    this.name = name;
  }

  // 页面数量
  pageCounts() {
    return Object.keys(this.content);
  }
  // 生成弹窗
  createDialog() {
    let bg = document.createElement('div')
    bg.className = 'bg';
    document.body.appendChild(bg)
    let dialog = document.createElement('div');
    dialog.className = 'geDialog';
    // 标题
    let title = document.createElement('p');
    title.className = 'geDialogTitle';
    title.innerHTML = '弹窗';
    dialog.appendChild(title);
    // 点击关闭弹窗
    title.addEventListener('click', () => {
      dialog.remove();
      bg.remove();
    })
    // 弹窗正文
    let content = document.createElement('div');
    dialog.appendChild(content);
    document.body.append(dialog);
    return content;
  }
  // 解析所有控件节点
  parseCells (root) {
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
          let actionsInfo = item.getAttribute('actionsInfo');
          // 链接
          let smartBiLink = item.getAttribute('smartBiLink');
          // mxcell节点
          if (tagName == 'object') {
            node = item.children[0];
            value = item.getAttribute('label');
          } else {
            node = item;
            value = node.getAttribute('value');
          };
          // 节点父节点
          let parentId = node.getAttribute('parent');
          // 节点存在id，递归
          if (parentId == t_id && id) {
            // 节点参数信息
            let getNodeInfo = new GetNodeInfo(node);
            // 节点类型
            let shapeName = getNodeInfo.getStyles('shape');
              let x,y,width,height,fillColor,strokeColor,fontColor,fontSize,styles, isGroup, image, hide, align, verticalAlign, selectProps, points,rotation;
              styles = node.getAttribute('style');
              // console.log(styles)
              isGroup = styles.indexOf('group') != -1;
              fillColor = getNodeInfo.getStyles('fillColor') || '#FFFFFF';
              fontColor = getNodeInfo.getStyles('fontColor') || '#FFFFFF';
              verticalAlign = getNodeInfo.getStyles('verticalAlign') || 'middle';
              rotation = getNodeInfo.getStyles('rotation') || 0;
              align = getNodeInfo.getStyles('align') || 'center';
              fontSize = getNodeInfo.getStyles('fontSize') || '12';
              strokeColor = (shapeName == 'image' ? getNodeInfo.getStyles('imageBorder') : getNodeInfo.getStyles('strokeColor')) || 'none';
              // 图片地址
              image = getNodeInfo.getStyles('image') || null;
              x = parseFloat(node.children[0].getAttribute('x')) || 0;
              y = parseFloat(node.children[0].getAttribute('y')) || 0;
              width = parseFloat(node.children[0].getAttribute('width'));
              hide = item.getAttribute('hide');
              height = parseFloat(node.children[0].getAttribute('height'));
              selectProps = item.getAttribute('selectProps') || '';
              // edge获取路径节点
              if (shapeName === 'endarrow' || shapeName === 'beeline' || shapeName === 'curve') {
                const childNodes = node.getElementsByTagName('mxGeometry')[0].children;
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
                    for (let point of childNode.children) {
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
              x < minX && (minX = x);
              y < minY && (minY = y);
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
                  hide,
                  verticalAlign,
                  align,
                  selectProps,
                  points,
                  rotation
              };
              // 组合节点
              obj.children = getNode(id);
              list.push(obj);
          };
      };
      return list;
    };
    let cells = getNode();
    cells.map(cell => {
      // 计算页面高度
      pageWidth = ((cell.x + cell.width) > pageWidth ? cell.x + cell.width : pageWidth) + 20;
      pageHeight = ((cell.y + cell.height) > pageHeight ? cell.y + cell.height : pageHeight) + 20;
      // 修正最外层节点的定位信息
      cell.x += Math.abs(minX) + 20;
      cell.y += Math.abs(minY) + 20;
    })
    return cells;
  }
  // 清空页面内容
  clearPage () {
    gePreview.innerHTML = '';
  }
  // 解析页面
  parsePage (page) {
    const xmlDoc = mxUtils.parseXml(page.xml).documentElement;
    const root = xmlDoc.getElementsByTagName('root')[0].children;
    let cells = this.parseCells(root);
    if (page.type === 'normal') {
      // 正常页面
      this.clearPage();
      this.renderPage(cells);
      gePreview.style.width = pageWidth + 'px';
      gePreview.style.height = pageHeight + 'px';
    } else {
      // 弹窗页面
      let layerContent = this.createDialog();
      layerContent.innerHTML = ``
    }
    return cells
  }
  // 获取节点的style内的某个属性
  // 渲染页面
  renderPage (cells, ele = gePreview) {
    for (let cell of cells) {
      let cellHtml = this.renderCell(cell);
      ele.appendChild(cellHtml);
      // 组内资源
      if (cell.children.length) {
        this.renderPage(cell.children, cellHtml);
      }
    }
  }
  
  // 渲染控件节点
  renderCell (cell) {
    console.log(cell)
    const shapeName = cell.shapeName;
    let cellHtml;
    if (shapeName === 'image') {
      // 图片
      cellHtml = document.createElement('img');
      cellHtml.setAttribute('src', cell.image.replace(/getechFileSystem/, fileSystem))
    } else if (shapeName === 'linkTag') {
      // smartBi链接iframe
      cellHtml = document.createElement('iframe');
      cellHtml.setAttribute('src', `${cell.smartBiLink}&user=admin&password=123456`);
    } else if (shapeName === 'menuCell' || shapeName === 'menulist') {
      // 菜单
      cellHtml = document.createElement('div');
      cellHtml.innerHTML = cell.value;
    } else if (shapeName === 'select') {
      // 下拉框
      cellHtml = document.createElement('select');
      const selectProps = cell.selectProps.split(',');
      for (let item of selectProps) {
        let opt = document.createElement('option');
        opt.setAttribute('value', item);
        opt.innerHTML = item;
        cellHtml.appendChild(opt)
      }
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
    } else if (shapeName === 'button') {
      // 按钮
      cellHtml = document.createElement('div');
      cellHtml.innerHTML = cell.value;
    } else if (shapeName === 'endarrow' || shapeName === 'beeline' || shapeName === 'curve') {
      // 箭头、直线，曲线
      cellHtml = inserEdge(cell)
    } else if (configSvg.includes(shapeName)) {
      cellHtml = insertSvg(shapeName, cell.width, cell.height, cell.x, cell.y, "#FFFFFF", cell.strokeColor)
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
      cellHtml.style.backgroundColor = cell.fillColor;
    } else {
      cellHtml.style.lineHeight = 0;
    }
    // 非Edge和svg控件
    if (!['endarrow', 'beeline', 'curve'].includes(shapeName) && !configSvg.includes(shapeName)) {
      cellHtml.style.border = `${cell.strokeColor == 'none' ? '' : `1px solid ${cell.strokeColor || defaultStyle.strokeColor}`}`;
      cellHtml.style.width = cell.width + 'px';
      cellHtml.style.height = cell.height + 'px';
    }
    cellHtml.className = 'gePalette';
    // 隐藏
    if (cell.hide == 'true') {
      cellHtml.style.display = 'none';
    }
    // 旋转
    cellHtml.style.transform = `rotate(${cell.rotation}deg)`;
    // 字体大小
    cellHtml.style.fontSize = `${cell.fontSize}px`;
    // 字体颜色
    cellHtml.style.color = `${cell.fontColor}`;
    // 定位
    cellHtml.style.left = cell.x + 'px';
    cellHtml.style.top = cell.y + 'px';
    return cellHtml;
  }
}

/**
 * 获取控件样式
 */
class GetNodeInfo {
  constructor (node) {
    this.node = node
    this.styles = this.node.getAttribute('style')
  }

  getStyles (key) {
    let reg = new RegExp(key + '=(.+?);')
    let execStr = reg.exec(this.styles);
    return execStr ? execStr[1] : '';
  }
}

/**
 * 创建矩形
 */
class CreateRectangle extends GetNodeInfo {
  constructor (name) {
    super(name);
  }

  render () {
    this.getStyles()
  }
}

/**
 * 执行渲染主函数
 */
async function main () {
  let id = /id=(.+?)$/.exec(location.search)
  if ( id ) {
    id = id[1]
  } else {
    console.log('id不存在');
    return;
  }
  const host = await geAjax('/api/image/host', 'GET');
  fileSystem = host.host;
  applyInfo = await geAjax(`/api/viewtool/${id}`, 'GET');
  shapeXmls = await loadShapeXml();
  if (!applyInfo) {
    console.log('未查到对应数据')
    return;
  }
  applyInfo = applyInfo;
  let previewPage = new PreviewPage(applyInfo);
  previewPage.parsePage(previewPage.content.sddaa);
  // for (let key in previewPage.content) {
  //   if (previewPage.content[key].type === 'normal') {
  //     console.log(key)
  //     // console.log(previewPage.parsePage(previewPage.content[key]))
  //   }
  // }
}
main();


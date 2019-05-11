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
// -----------------------------
/**
 * 插入svg
 * @param {string} key 
 * @param {number} w 
 * @param {number} h 
 * @param {string} fillColor 
 * @param {string} strokeColor 
 */
function insertSvg(key, w, h, fillColor = 'none', strokeColor='#333') {
  let inner = shapeXmls[key]
  let svgContent = document.createElement('div');
  inner.setAttribute('fill', fillColor)
  inner.setAttribute('stroke', strokeColor)
  
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.innerHTML = inner.outerHTML;
  svgContent.appendChild(svg)
  document.body.appendChild(svgContent)
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
          obj[shape.getAttribute('name')] = shape.children[0];
        }
        shape = shape.nextSibling
      }
      resolve(obj)
    })    
  })
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
    console.log(root)
    let getNode = (t_id = 1) => {
      let list = [];
      for (let item of root) {
          // console.log(item)
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
              console.log(item)
              // 节点参数信息
              let getNodeInfo = new GetNodeInfo(node);
              // console.log(getNodeInfo)
              let x,y,width,height,fillColor,strokeColor,fontColor,fontSize,styles, isGroup, image;
              // console.log(node)
              styles = node.getAttribute('style');
              isGroup = styles.indexOf('group') != -1;
              fillColor = getNodeInfo.getStyles('fillColor') || '#FFFFFF';
              fontColor = getNodeInfo.getStyles('fontColor') || '#FFFFFF';
              fontSize = getNodeInfo.getStyles('fontSize') || '12';
              strokeColor = getNodeInfo.getStyles('strokeColor') || 'none';
              image = getNodeInfo.getStyles('image') || null;
              x = parseFloat(node.children[0].getAttribute('x')) || 0;
              y = parseFloat(node.children[0].getAttribute('y')) || 0;
              width = parseFloat(node.children[0].getAttribute('width'));
              height = parseFloat(node.children[0].getAttribute('height'));
              x < minX && (minX = x);
              y < minY && (minY = y);
              // 节点类型
              let shapeName = getNodeInfo.getStyles('shape');
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
                  actionsInfo
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
      pageWidth = (cell.x + cell.width) > pageWidth ? cell.x + cell.width : pageWidth;
      pageHeight = (cell.y + cell.height) > pageHeight ? cell.x + cell.width : pageHeight;
      cell.x += Math.abs(minX);
      cell.y += Math.abs(minY);
    })
    return cells;
  }
  // 清空页面内容
  clearPage () {
    gePreview.innerHTML = ''
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
      // cell.x += Math.abs(minX);
      // cell.y += Math.abs(minY);
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
    const shapeName = cell.shapeName;
    let cellHtml;
    if (shapeName === 'image') {
      cellHtml = document.createElement('img');
      cellHtml.id = 'iddddddddddddddddd'
      cellHtml.setAttribute('src', cell.image.replace(/getechFileSystem/, fileSystem))
    } else if (shapeName === 'linkTag') {
      cellHtml = document.createElement('a');
    } else if (shapeName === 'menuCell' || shapeName === 'menulist') {
      cellHtml = document.createElement('div');
      cellHtml.innerHTML = cell.shapeName;
    } else if (shapeName === 'select') {
      cellHtml = document.createElement('select');
    } else if (shapeName === 'singleCheck') {
      cellHtml = document.createElement('input');
      cellHtml.setAttribute('type', 'radio');
    } else if (shapeName === 'multipleCheck') {
      cellHtml = document.createElement('input');
      cellHtml.setAttribute('type', 'checkbox');
    } else if (shapeName === 'text') {
      cellHtml = document.createElement('span');
      cellHtml.innerHTML = cell.value;
    } else if (shapeName === 'button') {
      cellHtml = document.createElement('div');
      cellHtml.innerHTML = cell.value;
      // cellHtml.setAttribute('type', 'checkbox');
    } else {
      cellHtml = document.createElement('p');
      cellHtml.innerHTML = cell.value;
    }
    cellHtml.style.left = cell.x + 'px';
    cellHtml.style.top = cell.y + 'px';
    cellHtml.style.width = cell.width + 'px';
    cellHtml.style.height = cell.height + 'px';
    cellHtml.style.backgroundColor = cell.fillColor;
    cellHtml.style.border = '1px solid '  + cell.strokeColor;
    cellHtml.className = 'gePalette'
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
  for (let key in previewPage.content) {
    if (previewPage.content[key].type === 'normal') {
      console.log(previewPage.parsePage(previewPage.content[key]))
    }
  }
}
main();


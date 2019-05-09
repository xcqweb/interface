let xmlstr = `<mxGraphModel dx="1426" dy="810" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" background="#ffffff">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="3" value="" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
      <mxGeometry x="90" y="140" width="120" height="60" as="geometry"/>
    </mxCell>
    <mxCell id="4" value="" style="whiteSpace=wrap;html=1;aspect=fixed;" vertex="1" parent="1">
      <mxGeometry x="440" y="100" width="80" height="80" as="geometry"/>
    </mxCell>
    <mxCell id="5" value="" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
      <mxGeometry x="370" y="230" width="120" height="60" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>
`
var model = new mxGraphModel();
// 解析为xml格式
var xmlDoc = mxUtils.parseXml(xmlstr).documentElement;
console.log(xmlDoc)

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
          resolve(xmlhttp.responseText)
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
 * 执行渲染
 */
async function main () {
  let id = /id=(.+?)$/.exec(location.search)
  if ( id ) {
    id = id[1]
  } else {
    console.log('id不存在');
    return;
  }
  let fileSystem = await geAjax('/api/image/host', 'GET');
  let applyInfo = await geAjax(`/api/viewtool/${id}`, 'GET')
  if (!applyInfo) {
    console.log('未查到对应数据')
    return;
  }
  applyInfo = JSON.parse(applyInfo)
  let previewPage = new PreviewPage(applyInfo)
  previewPage.pageCounts();
}

// 根节点列表
let root = xmlDoc.getElementsByTagName('root')[0].children;
console.log(root)
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

  pageCounts() {
    console.log(Object.keys(this.content))
  }
}

/**
 * 获取控件样式
 */
class GetStyle {
  constructor (name) {
    this.name = name
  }

  
  getStyles () {

  }
}

class CreateRectangle extends GetStyle {
  constructor (name) {
    super(name);
  }

  render () {
    this.getStyles()
  }
}
// let mockdata = {"id":"1e9713e63b7ed20968cc5b1e5d5f3ca","serialNumber":"10000042","name":"test apply4","content":"{\"页面1\":{\"title\":\"页面1\",\"desc\":\"\",\"xml\":\"<mxGraphModel dx=\\\"1189\\\" dy=\\\"799\\\" grid=\\\"1\\\" gridSize=\\\"10\\\" palettesInfo=\\\"{&quot;rectangle&quot;:{&quot;name&quot;:&quot;矩形&quot;,&quot;num&quot;:5},&quot;button&quot;:{&quot;name&quot;:&quot;按钮&quot;,&quot;num&quot;:1},&quot;menulist&quot;:{&quot;name&quot;:&quot;菜单&quot;,&quot;num&quot;:2},&quot;menuCell&quot;:{&quot;name&quot;:&quot;菜单&quot;,&quot;num&quot;:0},&quot;image&quot;:{&quot;name&quot;:&quot;图片&quot;,&quot;num&quot;:0},&quot;text&quot;:{&quot;name&quot;:&quot;文本&quot;,&quot;num&quot;:0},&quot;select&quot;:{&quot;name&quot;:&quot;下拉列表&quot;,&quot;num&quot;:1},&quot;table&quot;:{&quot;name&quot;:&quot;表格&quot;,&quot;num&quot;:0},&quot;tableBox&quot;:{&quot;name&quot;:&quot;表格&quot;,&quot;num&quot;:2},&quot;tableCell&quot;:{&quot;name&quot;:&quot;表格&quot;,&quot;num&quot;:0},&quot;endarrow&quot;:{&quot;name&quot;:&quot;箭头&quot;,&quot;num&quot;:0},&quot;line&quot;:{&quot;name&quot;:&quot;直线&quot;,&quot;num&quot;:1},&quot;curve&quot;:{&quot;name&quot;:&quot;曲线&quot;,&quot;num&quot;:0},&quot;linkTag&quot;:{&quot;name&quot;:&quot;Link&quot;,&quot;num&quot;:2},&quot;primitive&quot;:{&quot;name&quot;:&quot;图元&quot;,&quot;num&quot;:0},&quot;multipleCheck&quot;:{&quot;name&quot;:&quot;复选&quot;,&quot;num&quot;:0},&quot;singleCheck&quot;:{&quot;name&quot;:&quot;单选&quot;,&quot;num&quot;:0}}\\\" guides=\\\"1\\\" tooltips=\\\"1\\\" connect=\\\"0\\\" arrows=\\\"0\\\" fold=\\\"1\\\" page=\\\"0\\\" pageScale=\\\"1\\\" pageWidth=\\\"827\\\" pageHeight=\\\"1169\\\" background=\\\"#ffffff\\\"><root><mxCell id=\\\"0\\\"/><mxCell id=\\\"1\\\" parent=\\\"0\\\"/><object label=\\\"\\\" palettename=\\\"菜单2\\\" id=\\\"21\\\"><mxCell style=\\\"shape=menulist;group;selectBackgroundColor=#3B72A8;selectedFontColor=#3333FF;fontColor=#000000;fillColor=#FFFFFF;\\\" parent=\\\"1\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"-260\\\" y=\\\"100\\\" width=\\\"360\\\" height=\\\"40\\\" as=\\\"geometry\\\"/></mxCell></object><mxCell id=\\\"22\\\" value=\\\"菜单1\\\" style=\\\"shape=menuCell;html=1;whiteSpace=wrap;\\\" parent=\\\"21\\\" vertex=\\\"1\\\"><mxGeometry width=\\\"120\\\" height=\\\"40\\\" as=\\\"geometry\\\"/></mxCell><mxCell id=\\\"23\\\" value=\\\"菜单2\\\" style=\\\"shape=menuCell;html=1;whiteSpace=wrap;\\\" parent=\\\"21\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"120\\\" width=\\\"120\\\" height=\\\"40\\\" as=\\\"geometry\\\"/></mxCell><mxCell id=\\\"24\\\" value=\\\"菜单3\\\" style=\\\"shape=menuCell;html=1;whiteSpace=wrap;\\\" parent=\\\"21\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"240\\\" width=\\\"120\\\" height=\\\"40\\\" as=\\\"geometry\\\"/></mxCell><object label=\\\"&lt;a style=&quot;width: 100% ; height: 100% ; color: #3d91f7 ; display: table-cell ; vertical-align: bottom ; text-decoration: underline&quot; class=&quot;linkTag&quot;&gt;link&lt;br&gt;&lt;/a&gt;\\\" palettename=\\\"Link1\\\" id=\\\"26\\\"><mxCell style=\\\"shape=linkTag;html=1;strokeColor=none;fillColor=none;verticalAlign=middle;align=center;fontColor=#000000;\\\" parent=\\\"1\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"-260\\\" y=\\\"190\\\" width=\\\"70\\\" height=\\\"40\\\" as=\\\"geometry\\\"/></mxCell></object><object label=\\\"&lt;a style=&quot;width:100%;height:100%;color: #3D91F7;display: table-cell;vertical-align: bottom;text-decoration: underline&quot; class=&quot;linkTag&quot;&gt;Link&lt;/a&gt;\\\" palettename=\\\"Link2\\\" id=\\\"27\\\"><mxCell style=\\\"shape=linkTag;html=1;strokeColor=none;fillColor=none;verticalAlign=middle;align=center;fontColor=#000000;\\\" parent=\\\"1\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"-175\\\" y=\\\"190\\\" width=\\\"70\\\" height=\\\"40\\\" as=\\\"geometry\\\"/></mxCell></object><object label=\\\"\\\" palettename=\\\"矩形5\\\" bindData=\\\"{&quot;pointType&quot;:&quot;1e97096c7d793308d043f792111face&quot;,&quot;point&quot;:&quot;1e9713862b2e7f0b0abb56374f156db&quot;,&quot;params&quot;:[{&quot;name&quot;:&quot;5u&quot;,&quot;id&quot;:&quot;1e97138c8085f90b0abb56374f156db&quot;},{&quot;name&quot;:&quot;P1&quot;,&quot;id&quot;:&quot;1e97096c7d793318d043f792111face&quot;}]}\\\" id=\\\"46\\\"><mxCell style=\\\"rounded=0;shape=rectangle;whiteSpace=wrap;html=1;fontColor=#000000;\\\" parent=\\\"1\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"-10\\\" y=\\\"190\\\" width=\\\"120\\\" height=\\\"60\\\" as=\\\"geometry\\\"/></mxCell></object></root></mxGraphModel>\",\"type\":\"normal\"},\"页面2\":{\"title\":\"页面2\",\"desc\":\"\",\"xml\":\"<mxGraphModel dx=\\\"1083\\\" dy=\\\"799\\\" grid=\\\"1\\\" gridSize=\\\"10\\\" palettesInfo=\\\"{&quot;rectangle&quot;:{&quot;name&quot;:&quot;矩形&quot;,&quot;num&quot;:4},&quot;button&quot;:{&quot;name&quot;:&quot;按钮&quot;,&quot;num&quot;:1},&quot;menulist&quot;:{&quot;name&quot;:&quot;菜单&quot;,&quot;num&quot;:2},&quot;menuCell&quot;:{&quot;name&quot;:&quot;菜单&quot;,&quot;num&quot;:0},&quot;image&quot;:{&quot;name&quot;:&quot;图片&quot;,&quot;num&quot;:1},&quot;text&quot;:{&quot;name&quot;:&quot;文本&quot;,&quot;num&quot;:0},&quot;select&quot;:{&quot;name&quot;:&quot;下拉列表&quot;,&quot;num&quot;:0},&quot;table&quot;:{&quot;name&quot;:&quot;表格&quot;,&quot;num&quot;:0},&quot;tableBox&quot;:{&quot;name&quot;:&quot;表格&quot;,&quot;num&quot;:0},&quot;tableCell&quot;:{&quot;name&quot;:&quot;表格&quot;,&quot;num&quot;:0},&quot;endarrow&quot;:{&quot;name&quot;:&quot;箭头&quot;,&quot;num&quot;:0},&quot;line&quot;:{&quot;name&quot;:&quot;直线&quot;,&quot;num&quot;:0},&quot;curve&quot;:{&quot;name&quot;:&quot;曲线&quot;,&quot;num&quot;:0},&quot;linkTag&quot;:{&quot;name&quot;:&quot;Link&quot;,&quot;num&quot;:0},&quot;primitive&quot;:{&quot;name&quot;:&quot;图元&quot;,&quot;num&quot;:0},&quot;multipleCheck&quot;:{&quot;name&quot;:&quot;复选&quot;,&quot;num&quot;:0},&quot;singleCheck&quot;:{&quot;name&quot;:&quot;单选&quot;,&quot;num&quot;:0}}\\\" guides=\\\"1\\\" tooltips=\\\"1\\\" connect=\\\"0\\\" arrows=\\\"0\\\" fold=\\\"1\\\" page=\\\"0\\\" pageScale=\\\"1\\\" pageWidth=\\\"827\\\" pageHeight=\\\"1169\\\" background=\\\"#ffffff\\\"><root><mxCell id=\\\"0\\\"/><mxCell id=\\\"1\\\" parent=\\\"0\\\"/><object label=\\\"\\\" palettename=\\\"矩形1\\\" id=\\\"2\\\"><mxCell style=\\\"rounded=0;shape=rectangle;whiteSpace=wrap;html=1;fontColor=#000000;\\\" parent=\\\"1\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"10\\\" y=\\\"120\\\" width=\\\"120\\\" height=\\\"60\\\" as=\\\"geometry\\\"/></mxCell></object><object label=\\\"\\\" palettename=\\\"菜单2\\\" id=\\\"3\\\"><mxCell style=\\\"shape=menulist;group;fontColor=#000000;\\\" parent=\\\"1\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"60\\\" y=\\\"310\\\" width=\\\"360\\\" height=\\\"40\\\" as=\\\"geometry\\\"/></mxCell></object><mxCell id=\\\"4\\\" value=\\\"菜单1\\\" style=\\\"shape=menuCell;html=1;whiteSpace=wrap;\\\" parent=\\\"3\\\" vertex=\\\"1\\\"><mxGeometry width=\\\"120\\\" height=\\\"40\\\" as=\\\"geometry\\\"/></mxCell><mxCell id=\\\"5\\\" value=\\\"菜单2\\\" style=\\\"shape=menuCell;html=1;whiteSpace=wrap;\\\" parent=\\\"3\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"120\\\" width=\\\"120\\\" height=\\\"40\\\" as=\\\"geometry\\\"/></mxCell><mxCell id=\\\"6\\\" value=\\\"菜单3\\\" style=\\\"shape=menuCell;html=1;whiteSpace=wrap;\\\" parent=\\\"3\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"240\\\" width=\\\"120\\\" height=\\\"40\\\" as=\\\"geometry\\\"/></mxCell><object label=\\\"\\\" palettename=\\\"图片1\\\" id=\\\"7\\\"><mxCell style=\\\"shape=image;image;html=1;labelBackgroundColor=#ffffff;image=getechFileSystem/group1/M00/00/01/wKgDTlzGjwqAS5Z-ABR6K7HTkgo756.jpg;fontColor=#000000;\\\" parent=\\\"1\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"-40\\\" y=\\\"400\\\" width=\\\"300\\\" height=\\\"170\\\" as=\\\"geometry\\\"/></mxCell></object><object label=\\\"\\\" palettename=\\\"矩形2\\\" actionsInfo=\\\"[{&quot;type&quot;:&quot;out&quot;,&quot;link&quot;:&quot;&quot;,&quot;innerType&quot;:&quot;页面&quot;,&quot;mouseEvent&quot;:&quot;鼠标移入&quot;,&quot;effectAction&quot;:&quot;隐藏&quot;}]\\\" id=\\\"8\\\"><mxCell style=\\\"rounded=0;shape=rectangle;whiteSpace=wrap;html=1;fontColor=#000000;\\\" parent=\\\"1\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"60\\\" y=\\\"10\\\" width=\\\"120\\\" height=\\\"60\\\" as=\\\"geometry\\\"/></mxCell></object><object label=\\\"\\\" palettename=\\\"矩形3\\\" id=\\\"9\\\"><mxCell style=\\\"rounded=0;shape=rectangle;whiteSpace=wrap;html=1;fontColor=#000000;\\\" parent=\\\"1\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"190\\\" y=\\\"80\\\" width=\\\"120\\\" height=\\\"60\\\" as=\\\"geometry\\\"/></mxCell></object><object label=\\\"\\\" palettename=\\\"矩形4\\\" id=\\\"10\\\"><mxCell style=\\\"rounded=0;shape=rectangle;whiteSpace=wrap;html=1;fontColor=#000000;\\\" parent=\\\"1\\\" vertex=\\\"1\\\"><mxGeometry x=\\\"130\\\" y=\\\"200\\\" width=\\\"120\\\" height=\\\"60\\\" as=\\\"geometry\\\"/></mxCell></object></root></mxGraphModel>\",\"type\":\"dialog\"}}","describe":"test apply4 describe","applyCon":null,"status":0,"applieNum":0,"models":null};

// let preview = new PreviewPage(mockdata);
// preview.getName()

// console.log(document.getElementById('gePreview'))

let createRectangle = new CreateRectangle('矩形')
createRectangle.render()
main();
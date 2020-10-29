import {mxUtils,mxCodec} from './mxGlobal'
function syncWidget(editorUi,type,info) {
  let {editor} = editorUi
  let pages = editor.pages
  let xmlList = []
  Object.values(pages).forEach(item=>{
    let {xml} = item
    xmlList.push(xml)
  })
  xmlList.forEach(item=>{
    let doc = mxUtils.parseXml(item)
    let code = new mxCodec(doc)
    console.log(code)
  })
  if(type == 'state') {
    if(info) {//同步状态修改

    } else { //同步状态删除

    }
  }
}

export {
  syncWidget
}
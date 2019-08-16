/* eslint-disable */
/**
 * 获取一级域名
 */
import {OpenDialog} from './editor/Dialogs'
const getDomain = () => {
    let host = location.hostname;
    const ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if (ip.test(host) === true || host === 'localhost') {return host; }
    const regex = /([^]*).*/;
    const match = host.match(regex);
    if (typeof match !== 'undefined' && null !== match) {host = match[1]; }
    if (typeof host !== 'undefined' && null !== host) {
        const strAry = host.split('.');
        if (strAry.length > 1) {
            host = strAry[strAry.length - 2] + '.' + strAry[strAry.length - 1];
        }
    }
    return '.' + host;
};
/**
 * 获取cookie信息
 * @param {string} cname cookie的key值
 */
let getCookie=function(cname) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {c = c.substring(1); }
        if (c.indexOf(name) !== -1) {return c.substring(name.length, c.length); }
    }
    return '';
}
/**
 * 设置cookie信息
 */
let setCookie=function(cname, value, expiredays = null) {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = cname + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toUTCString()) + ';domain=' + getDomain() + ';path=/;';
}
function throttle(func, wait, options) {
  /* options的默认值
   *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
   *  options.leading = true;
   * 表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
   *  options.trailing = true; 
   * 注意：当options.trailing = false时，效果与上面的简单实现效果相同
   */
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : _.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = _.now();
    if (!previous && options.leading === false) previous = now;
    // 计算剩余时间
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 当到达wait指定的时间间隔，则调用func函数
    // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
    if (remaining <= 0 || remaining > wait) {
      // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      // options.trailing=true时，延时执行func函数
      timeout = setTimeout(later, remaining);
    }
    return result;
  }
}

function tipDialog(editorUi,tips,title='提示'){
  editorUi.showDialog(new OpenDialog(tips).container, (Editor.useLocalStorage) ? 640 : 320,
    (Editor.useLocalStorage) ? 480 : 80, true, false,null, null, title, null)
  setTimeout(()=>{
    editorUi.hideDialog()
  },1500)
}
function sureContainer(editorUi,info,confirmText='确定',cancelText='取消',cb) {
  let {mxUtils} = require('./mxGlobal')
  let saveContent = editorUi.createDiv('geDialogInfo');
  let nameTitle = document.createElement('p')
  nameTitle.innerHTML = info;
  nameTitle.className = 'geDialogInfoTitle';
  saveContent.appendChild(nameTitle)

  // 保存按钮
  let btnContent = editorUi.createDiv('btnContent')
  let genericBtn = mxUtils.button(confirmText, () => {
      cb()
      editorUi.hideDialog();
  })
  genericBtn.className = 'geBtn gePrimaryBtn';
  // 取消按钮
  let cancelBtn = mxUtils.button(cancelText,()=> {
    editorUi.hideDialog();
  });
  cancelBtn.className = 'geBtn';
  btnContent.appendChild(cancelBtn);
  btnContent.appendChild(genericBtn);

  saveContent.appendChild(btnContent)
  this.container = saveContent;
}
function sureDialog(editorUi, info, cb, confirmText = '确定', cancelText = '取消', title = '提示') {
  let dlg = new sureContainer(editorUi, info, confirmText, cancelText,cb)
  editorUi.showDialog(dlg.container, 410, 160, true, false, null, null, title);
}
export {
  getCookie,
  setCookie,
  throttle,
  tipDialog,
  sureDialog
}
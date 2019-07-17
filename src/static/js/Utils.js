/**
 * 获取一级域名
 */
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
 * 设置cookie信息
 */
function setCookie (cname, value, expiredays = null) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = cname + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toUTCString()) + ';domain=' + getDomain() + ';path=/;';
};

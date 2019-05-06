// urlParams is null when used for embedding
window.urlParams = window.urlParams || {};

// Public global variables
window.MAX_REQUEST_SIZE = window.MAX_REQUEST_SIZE  || 10485760;
window.MAX_AREA = window.MAX_AREA || 15000 * 15000;

// URLs for save and export
window.EXPORT_URL = window.EXPORT_URL || '/export';
window.SAVE_URL = window.SAVE_URL || '/save';
window.OPEN_URL = window.OPEN_URL || '/open';
window.RESOURCES_PATH = window.RESOURCES_PATH || '/static/resources';
window.RESOURCE_BASE = window.RESOURCE_BASE || window.RESOURCES_PATH + '/grapheditor';
window.STENCIL_PATH = window.STENCIL_PATH || '/static/stencils';
window.IMAGE_PATH = window.IMAGE_PATH || 'static/images/default';
window.STYLE_PATH = window.STYLE_PATH || 'static';
window.OPEN_FORM = window.OPEN_FORM || 'open.html';
// 设置默认地址
window.mxBasePath = window.mxBasePath || '/static/';
window.mxLanguage = window.mxLanguage || urlParams['lang'];
window.mxLanguages = window.mxLanguages || ['de'];
// 文件服务器地址
window.fileSystem = null;

// 获取cookie
window.getCookie = function(cname) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {c = c.substring(1); }
    if (c.indexOf(name) !== -1) {return c.substring(name.length, c.length); }
  }
  return '';
};
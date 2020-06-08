/* eslint-disable */
// urlParams is null when used for embedding
window.urlParams = window.urlParams || {};
window.RESOURCES_PATH = PREFIX_PATH + '/static/resources/eidtor';
window.STENCIL_PATH = PREFIX_PATH + '/static/stencils';
window.IMAGE_PATH = PREFIX_PATH + '/static/images/default';
window.STYLE_PATH = PREFIX_PATH + '/static';

/* window.RESOURCES_PATH = window.RESOURCES_PATH || '/static/resources/eidtor';
window.STENCIL_PATH = window.STENCIL_PATH || '/static/stencils';
window.IMAGE_PATH = window.IMAGE_PATH || 'static/images/default';
window.STYLE_PATH = window.STYLE_PATH || 'static'; */
// 设置默认地址
// 文件服务器地址
window.fileSystem = null

// 获取cookie
let getCookie = function(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {c = c.substring(1); }
        if (c.indexOf(name) !== -1) {return c.substring(name.length, c.length); }
    }
    return '';
};
window.mxLanguage = getCookie('language') || 'zh'
window.mxClient.languages = ['zh','en']
/**
 * Change types
 */
export {
    getCookie
}
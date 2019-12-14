/* eslint-disable */
// urlParams is null when used for embedding
window.urlParams = window.urlParams || {};

var pathA = '/interface';
// var pathA = window.location.host + '/interface';

window.RESOURCES_PATH = pathA + '/static/resources/eidtor';
window.STENCIL_PATH = pathA + '/static/stencils';
window.IMAGE_PATH = pathA + '/static/images/default';
window.STYLE_PATH = pathA + '/static';
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
function ChangePageSetup(ui, color, image, format)
{
    this.ui = ui;
    this.color = color;
    this.previousColor = color;
    this.image = image;
    this.previousImage = image;
    this.format = format;
    this.previousFormat = format;
	
    // Needed since null are valid values for color and image
    this.ignoreColor = false;
    this.ignoreImage = false;
}

/**
 * Implementation of the undoable page rename.
 */
ChangePageSetup.prototype.execute = function()
{
    var graph = this.ui.editor.graph;
	
    if (!this.ignoreColor)
    {
        this.color = this.previousColor;
        var tmp = graph.background;
        this.ui.setBackgroundColor(this.previousColor);
        this.previousColor = tmp;
    }
	
    if (!this.ignoreImage)
    {
        this.image = this.previousImage;
        var tmp = graph.backgroundImage;
        this.ui.setBackgroundImage(this.previousImage);
        this.previousImage = tmp;
    }
	
    if (this.previousFormat != null)
    {
        this.format = this.previousFormat;
        var tmp = graph.pageFormat;
        if (this.previousFormat.width != tmp.width ||
			this.previousFormat.height != tmp.height)
        {
            this.ui.setPageFormat(this.previousFormat);
            this.previousFormat = tmp;
        }
    }

    if (this.foldingEnabled != null && this.foldingEnabled != this.ui.editor.graph.foldingEnabled)
    {
    		this.ui.setFoldingEnabled(this.foldingEnabled);
        this.foldingEnabled = !this.foldingEnabled;
    }
};
export {
    getCookie, ChangePageSetup
}
/* eslint-disable */
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
window.mxLanguage = window.mxLanguage || urlParams['lang'];
window.mxLanguages = window.mxLanguages || ['de'];
// 文件服务器地址
window.fileSystem = null;

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
        console.log(tmp, "tt--aa")
        if (this.previousFormat.width != tmp.width ||
			this.previousFormat.height != tmp.height)
        {
            console.log(previousFormat)
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
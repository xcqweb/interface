/* eslint-disable */
/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */


/**
 * Construcs a new sidebar for the given editor.
 */
import requestUtil from '../request'
import Urls from '../../constants/url'
import VueEvent from '../VueEvent'
import { tipDialog, sureDialog } from '../Utils'
var basicXmlFns = [];
function Sidebar(editorUi, container, container2)
{
    this.editorUi = editorUi;
    this.container = container;
    this.containerbottom = container2
    this.palettes = new Object();
    this.taglist = new Object();
    this.showTooltips = true;
    this.graph = editorUi.createTemporaryGraph(this.editorUi.editor.graph.getStylesheet());
    this.graph.cellRenderer.antiAlias = false;
    this.graph.foldingEnabled = false;
    console.log(this.graph.container)
    this.graph.container.style.visibility = 'hidden';
    // this.graph.container2.style.visibility = 'hidden';
    document.body.appendChild(this.graph.container);
	
    this.pointerUpHandler = mxUtils.bind(this, function()
    {
        this.showTooltips = true;
    });

    mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointerup' : 'mouseup', this.pointerUpHandler);

    this.pointerDownHandler = mxUtils.bind(this, function()
    {
        this.showTooltips = false;
        this.hideTooltip();
    });
	
    mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', this.pointerDownHandler);
	
    this.pointerMoveHandler = mxUtils.bind(this, function(evt)
    {
        var src = mxEvent.getSource(evt);
		
        while (src != null)
        {
            if (src == this.currentElt)
            {
                return;
            }
			
            src = src.parentNode;
        }
		
        this.hideTooltip();
    });

    mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', this.pointerMoveHandler);

    // Handles mouse leaving the window
    this.pointerOutHandler = mxUtils.bind(this, function(evt)
    {
        if (evt.toElement == null && evt.relatedTarget == null)
        {
            this.hideTooltip();
        }
    });
	
    mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointerout' : 'mouseout', this.pointerOutHandler);

    // Enables tooltips after scroll
    mxEvent.addListener(container, 'scroll', mxUtils.bind(this, function()
    {
        this.showTooltips = true;
        this.hideTooltip();
    }));
    // Pre-fetches tooltip image
    if (!mxClient.IS_SVG)
    {
        new Image().src = IMAGE_PATH + '/tooltip.png';
    }
}

/**
 * 原型初始化
 */
Sidebar.prototype.init = function(type)
{
    if (type === 'nowload') {
        let layoutTitle = document.querySelector("#layoutTitle")
        let layout = document.querySelector("#layout")
        let userTitle = document.querySelectorAll("#userTitle")
        let user = document.querySelectorAll("#user")
        userTitle.forEach((item) => {
            item.remove()
        })
        user.forEach((item) => {
            item.remove()
        })
        layoutTitle.remove()
        layout.remove()
        this.addUserPalette(false); // 自定义控件
        this.addLayoutPalette(false) // layout
    } else {
        this.addPagePalette();//页面管理
        this.addGeneralPalette(true);//基础控件
        this.addUserPalette(false); // 自定义控件
        this.addLayoutPalette(false) // layout
    }
};

/**
 * Sets the default font size.
 */
Sidebar.prototype.collapsedImage = '/static/images/icons/colspan.png'
/**
 * Sets the default font size.
 */
Sidebar.prototype.expandedImage = '/static/images/icons/expand.png'

/**
 * Sets the default font size.
 */
Sidebar.prototype.tooltipImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/tooltip.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAbCAMAAAB7jU7LAAAACVBMVEX///+ZmZn///9Y2COLAAAAA3RSTlP//wDXyg1BAAAAOElEQVR42mXQMQ4AMAgDsWv//+iutcJmIQSk+9dJpVKpVCqVSqVSqZTdncWzF8/NeP7FkxWenPEDOnUBiL3jWx0AAAAASUVORK5CYII=';

/**
 * 搜索图标
 */
Sidebar.prototype.searchImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/search.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEaSURBVHjabNGxS5VxFIfxz71XaWuQUJCG/gCHhgTD9VpEETg4aMOlQRp0EoezObgcd220KQiXmpretTAHQRBdojlQEJyukPdt+b1ywfvAGc7wnHP4nlZd1yKijQW8xzNc4Su+ZOYfQ3T6/f4YNvEJYzjELXp4VVXVz263+7cR2niBxAFeZ2YPi3iHR/gYERPDwhpOsd6sz8x/mfkNG3iOlWFhFj8y89J9KvzGXER0GuEaD42mgwHqUtoljbcRsTBCeINpfM/MgZLKPpaxFxGbOCqDXmILN7hoJrTKH+axhxmcYRxP0MIDnOBDZv5q1XUNIuJxifJp+UNV7t7BFM6xeic0RMQ4Bpl5W/ol7GISx/eEUUTECrbx+f8A8xhiZht9zsgAAAAASUVORK5CYII=';

/**
 * 
 */
Sidebar.prototype.dragPreviewBorder = '1px dashed black';

/**
 * Specifies if tooltips should be visible. Default is true.
 */
Sidebar.prototype.enableTooltips = true;

/**
 * Specifies the delay for the tooltip. Default is 16 px.
 */
Sidebar.prototype.tooltipBorder = 16;

/**
 * Specifies the delay for the tooltip. Default is 300 ms.
 */
Sidebar.prototype.tooltipDelay = 300;

/**
 * Specifies the delay for the drop target icons. Default is 200 ms.
 */
Sidebar.prototype.dropTargetDelay = 200;

/**
 * Specifies the URL of the gear image.
 */
Sidebar.prototype.gearImage = STENCIL_PATH + '/clipart/Gear_128x128.png';

/**
 * Specifies the width of the thumbnails.
 */
Sidebar.prototype.thumbWidth = 36;

/**
 * Specifies the height of the thumbnails.
 */
Sidebar.prototype.thumbHeight = 36;

/**
 * Specifies the padding for the thumbnails. Default is 3.
 */
Sidebar.prototype.thumbPadding = (document.documentMode >= 5) ? 0 : 1;

/**
 * Specifies the delay for the tooltip. Default is 2 px.
 */
Sidebar.prototype.thumbBorder = 2;

/**
 * Specifies the size of the sidebar titles.
 */
Sidebar.prototype.sidebarTitleSize = 9;

/**
 * Specifies if titles in the sidebar should be enabled.
 */
Sidebar.prototype.sidebarTitles = false;

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.tooltipTitles = true;

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.maxTooltipWidth = 400;

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.maxTooltipHeight = 400;

/**
 * Specifies if stencil files should be loaded and added to the search index
 * when stencil palettes are added. If this is false then the stencil files
 * are lazy-loaded when the palette is shown.
 */
Sidebar.prototype.addStencilsToIndex = true;

/**
 * Specifies the width for clipart images. Default is 80.
 */
Sidebar.prototype.defaultImageWidth = 300;

/**
 * Specifies the height for clipart images. Default is 80.
 */
Sidebar.prototype.defaultImageHeight = 170;

/**
 * Adds all palettes to the sidebar.
 */
Sidebar.prototype.getTooltipOffset = function()
{
    return new mxPoint(0, 0);
};

/**
 * 显示控件浮窗.
 */
Sidebar.prototype.showTooltip = function(elt, cells, w, h, title, showLabel)
{
    if (this.enableTooltips && this.showTooltips)
    {
        if (this.currentElt != elt)
        {
            if (this.thread != null)
            {
                window.clearTimeout(this.thread);
                this.thread = null;
            }
			
            var show = mxUtils.bind(this, function()
            {
                // Lazy creation of the DOM nodes and graph instance
                if (this.tooltip == null)
                {
                    this.tooltip = document.createElement('div');
                    this.tooltip.className = 'geSidebarTooltip';
                    this.tooltip.style.zIndex = mxPopupMenu.prototype.zIndex - 1;
                    document.body.appendChild(this.tooltip);
					
                    this.graph2 = new Graph(this.tooltip, null, null, this.editorUi.editor.graph.getStylesheet());
                    this.graph2.resetViewOnRootChange = false;
                    this.graph2.foldingEnabled = false;
                    this.graph2.gridEnabled = false;
                    this.graph2.autoScroll = false;
                    this.graph2.setTooltips(false);
                    this.graph2.setConnectable(false);
                    this.graph2.setEnabled(false);
					
                    if (!mxClient.IS_SVG)
                    {
                        this.graph2.view.canvas.style.position = 'relative';
                    }
					
                    this.tooltipImage = mxUtils.createImage(this.tooltipImage);
                    this.tooltipImage.className = 'geSidebarTooltipImage';
                    this.tooltipImage.style.zIndex = mxPopupMenu.prototype.zIndex - 1;
                    this.tooltipImage.style.position = 'absolute';
                    this.tooltipImage.style.width = '14px';
                    this.tooltipImage.style.height = '27px';
					
                    document.body.appendChild(this.tooltipImage);
                }
				
                this.graph2.model.clear();
                this.graph2.view.setTranslate(this.tooltipBorder, this.tooltipBorder);

                if (w > this.maxTooltipWidth || h > this.maxTooltipHeight)
                {
                    this.graph2.view.scale = Math.round(Math.min(this.maxTooltipWidth / w, this.maxTooltipHeight / h) * 100) / 100;
                }
                else
                {
                    this.graph2.view.scale = 1;
                }
				
                this.tooltip.style.display = 'block';
                this.graph2.labelsVisible = (showLabel == null || showLabel);
                var fo = mxClient.NO_FO;
                mxClient.NO_FO = Editor.prototype.originalNoForeignObject;
                this.graph2.addCells(cells);
                mxClient.NO_FO = fo;
				
                var bounds = this.graph2.getGraphBounds();
                var width = bounds.width + 2 * this.tooltipBorder + 4;
                var height = bounds.height + 2 * this.tooltipBorder;
				
                if (mxClient.IS_QUIRKS)
                {
                    height += 4;
                    this.tooltip.style.overflow = 'hidden';
                }
                else
                {
                    this.tooltip.style.overflow = 'visible';
                }

                this.tooltipImage.style.visibility = 'visible';
                this.tooltip.style.width = width + 'px';
				
                // Adds title for entry
                if (this.tooltipTitles && title != null && title.length > 0)
                {
                    if (this.tooltipTitle == null)
                    {
                        this.tooltipTitle = document.createElement('div');
                        this.tooltipTitle.style.borderTop = '1px solid gray';
                        this.tooltipTitle.style.textAlign = 'center';
                        this.tooltipTitle.style.width = '100%';
						
                        // Oversize titles are cut-off currently. Should make tooltip wider later.
                        this.tooltipTitle.style.overflow = 'hidden';
                        this.tooltipTitle.style.position = 'absolute';
                        this.tooltipTitle.style.paddingTop = '6px';
                        this.tooltipTitle.style.bottom = '6px';

                        this.tooltip.appendChild(this.tooltipTitle);
                    }
                    else
                    {
                        this.tooltipTitle.innerHTML = '';
                    }
					
                    this.tooltipTitle.style.display = '';
                    mxUtils.write(this.tooltipTitle, title);
					
                    var ddy = this.tooltipTitle.offsetHeight + 10;
                    height += ddy;
					
                    if (mxClient.IS_SVG)
                    {
                        this.tooltipTitle.style.marginTop = (2 - ddy) + 'px';
                    }
                    else
                    {
                        height -= 6;
                        this.tooltipTitle.style.top = (height - ddy) + 'px';	
                    }
                }
                else if (this.tooltipTitle != null && this.tooltipTitle.parentNode != null)
                {
                    this.tooltipTitle.style.display = 'none';
                }
				
                this.tooltip.style.height = height + 'px';
                var x0 = -Math.round(bounds.x - this.tooltipBorder);
                var y0 = -Math.round(bounds.y - this.tooltipBorder);
				
                var b = document.body;
                var d = document.documentElement;
                var off = this.getTooltipOffset();
                var bottom = Math.max(b.clientHeight || 0, d.clientHeight);
                var left = this.container.clientWidth + this.editorUi.splitSize + 3 + this.editorUi.container.offsetLeft + off.x;
                var top = Math.min(bottom - height - 20 /*status bar*/, Math.max(0, (this.editorUi.container.offsetTop +
					this.container.offsetTop + elt.offsetTop - this.container.scrollTop - height / 2 + 16))) + off.y;

                if (mxClient.IS_SVG)
                {
                    if (x0 != 0 || y0 != 0)
                    {
                        this.graph2.view.canvas.setAttribute('transform', 'translate(' + x0 + ',' + y0 + ')');
                    }
                    else
                    {
                        this.graph2.view.canvas.removeAttribute('transform');
                    }
                }
                else
                {
                    this.graph2.view.drawPane.style.left = x0 + 'px';
                    this.graph2.view.drawPane.style.top = y0 + 'px';
                }
				
                // Workaround for ignored position CSS style in IE9
                // (changes to relative without the following line)
                this.tooltip.style.position = 'absolute';
                this.tooltip.style.left = left + 'px';
                this.tooltip.style.top = top + 'px';
                this.tooltipImage.style.left = (left - 13) + 'px';
                this.tooltipImage.style.top = (top + height / 2 - 13) + 'px';
            });

            if (this.tooltip != null && this.tooltip.style.display != 'none')
            {
                // show();
            }
            else
            {
                // this.thread = window.setTimeout(show, this.tooltipDelay);
            }

            this.currentElt = elt;
        }
    }
};

/**
 * 隐藏控件浮窗.
 */
Sidebar.prototype.hideTooltip = function()
{
    if (this.thread != null)
    {
        window.clearTimeout(this.thread);
        this.thread = null;
    }
	
    if (this.tooltip != null)
    {
        this.tooltip.style.display = 'none';
        this.tooltipImage.style.visibility = 'hidden';
        this.currentElt = null;
    }
};

/**
 * Hides the current tooltip.
 */
Sidebar.prototype.addDataEntry = function(tags, width, height, title, data)
{
    return this.addEntry(tags, mxUtils.bind(this, function()
    {
	   	return this.createVertexTemplateFromData(data, width, height, title);
    }));
};

/**
 * Hides the current tooltip.
 */
Sidebar.prototype.addEntry = function(tags, fn)
{
    if (this.taglist != null && tags != null && tags.length > 0)
    {
        // Replaces special characters
        var tmp = tags.toLowerCase().replace(/[\/\,\(\)]/g, ' ').split(' ');
		
        var doAddEntry = mxUtils.bind(this, function(tag)
        {
            if (tag.length > 1)
            {
                var entry = this.taglist[tag];
                if (typeof entry !== 'object')
                {
                    entry = {entries: [], dict: new mxDictionary()};
                    this.taglist[tag] = entry;
                }

                // Ignores duplicates
                if (entry.dict.get(fn) == null)
                {
                    entry.dict.put(fn, fn);
                    entry.entries.push(fn);
                }
            }
        });
        for (var i = 0; i < tmp.length; i++)
        {
            doAddEntry(tmp[i]);
			
            // Adds additional entry with removed trailing numbers
            var normalized = tmp[i].replace(/\.*\d*$/, '');
			
            if (normalized != tmp[i])
            {
                doAddEntry(normalized);
            }
        }
    }
	
    return fn;
};

/**
 * Adds shape search UI.
 */
Sidebar.prototype.searchEntries = function(searchTerms, count, page, success, error)
{
    if (this.taglist != null && searchTerms != null)
    {
        var tmp = searchTerms.toLowerCase().split(' ');
        var dict = new mxDictionary();
        var max = (page + 1) * count;
        var results = [];
        var index = 0;
		
        for (var i = 0; i < tmp.length; i++)
        {
            if (tmp[i].length > 0)
            {
                var entry = this.taglist[tmp[i]];
                var tmpDict = new mxDictionary();
				
                if (entry != null)
                {
                    var arr = entry.entries;
                    results = [];

                    for (var j = 0; j < arr.length; j++)
                    {
                        var entry = arr[j];
	
                        // NOTE Array does not contain duplicates
                        if ((index == 0) == (dict.get(entry) == null))
                        {
                            tmpDict.put(entry, entry);
                            results.push(entry);
							
                            if (i == tmp.length - 1 && results.length == max)
                            {
                                success(results.slice(page * count, max), max, true, tmp);
								
                                return;
                            }
                        }
                    }
                }
                else
                {
                    results = [];
                }
				
                dict = tmpDict;
                index++;
            }
        }
		
        var len = results.length;
        success(results.slice(page * count, (page + 1) * count), len, false, tmp);
    }
    else
    {
        success([], null, null, tmp);
    }
};

/**
 * Adds shape search UI.
 */
Sidebar.prototype.filterTags = function(tags)
{
    if (tags != null)
    {
        var arr = tags.split(' ');
        var result = [];
        var hash = {};
		
        // Ignores tags with leading numbers, strips trailing numbers
        for (var i = 0; i < arr.length; i++)
        {
            // Removes duplicates
            if (hash[arr[i]] == null)
            {
                hash[arr[i]] = '1';
                result.push(arr[i]);
            }
        }
		
        return result.join(' ');
    }
	
    return null;
};

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.cloneCell = function(cell, value)
{
    var clone = cell.clone();
	
    if (value != null)
    {
        clone.value = value;
    }
	
    return clone;
};

/**
 * Adds shape search UI. 搜索
 */
Sidebar.prototype.addSearchPalette = function(expand)
{
    var elt = document.createElement('div');
    elt.style.visibility = 'hidden';
    // this.container.appendChild(elt);
    this.containerbottom.appendChild(elt);
		
    var div = document.createElement('div');
    div.className = 'geSidebar';
    div.style.boxSizing = 'border-box';
    div.style.overflow = 'hidden';
    div.style.width = '100%';
    div.style.padding = '8px';
    div.style.paddingTop = '14px';
    div.style.paddingBottom = '0px';

    if (!expand)
    {
        //不为被隐藏的对象保留其物理空间，即该对象在页面上彻底消失。style
        div.style.display = 'none';
    }
	
    var inner = document.createElement('div');
    inner.style.whiteSpace = 'nowrap';
    inner.style.textOverflow = 'clip';
    inner.style.paddingBottom = '8px';
    inner.style.cursor = 'default';

    //添加标题
    var filenameDiv = document.createElement('div');
    filenameDiv.setAttribute('id', 'filename');
    filenameDiv.style.width = '100%';
    filenameDiv.style.textAlign = 'center';
    filenameDiv.innerText = this.editorUi.editor.filename || mxResources.get('unsave');
    inner.appendChild(filenameDiv);
    //

    var input = document.createElement('input')

    input.setAttribute('placeholder', mxResources.get('searchShapes'));//搜索图形
    input.setAttribute('type', 'text');

    input.style.fontSize = '12px';
    input.style.overflow = 'hidden';
    input.style.boxSizing = 'border-box';
    input.style.border = 'solid 1px #d5d5d5';
    input.style.borderRadius = '4px';
    input.style.width = '100%';
    input.style.outline = 'none';
    input.style.padding = '6px';
    inner.appendChild(input);

    var cross = document.createElement('img');
    cross.setAttribute('src', Sidebar.prototype.searchImage);
    //Sidebar.prototype.searchImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/search.png'
    cross.setAttribute('title', mxResources.get('search'));//搜索
    cross.style.position = 'relative';
    cross.style.left = '-18px';
	
    if (mxClient.IS_QUIRKS)
    {
        input.style.height = '28px';
        cross.style.top = '-4px';
    }
    else
    {
        cross.style.top = '1px';
    }

    // Needed to block event transparency in IE
    cross.style.background = 'url(\'' + this.editorUi.editor.transparentImage + '\')';
	
    var find;

    inner.appendChild(cross);
    div.appendChild(inner);

    var center = document.createElement('center');
    var button = mxUtils.button(mxResources.get('moreResults'), function()
    {
        find();
    });
    button.style.display = 'none';
	
    // Workaround for inherited line-height in quirks mode
    button.style.lineHeight = 'normal';
    button.style.marginTop = '4px';
    button.style.marginBottom = '8px';
    center.style.paddingTop = '4px';
    center.style.paddingBottom = '8px';
	
    center.appendChild(button);
    div.appendChild(center);
	
    var searchTerm = '';
    var active = false;
    var complete = false;
    var page = 0;
    var hash = new Object();

    // Count is dynamically updated below
    var count = 12;
	
    var clearDiv = mxUtils.bind(this, function()
    {
        active = false;
        this.currentSearch = null;
        var child = div.firstChild;
		
        while (child != null)
        {
            var next = child.nextSibling;
			
            if (child != inner && child != center)
            {
                child.parentNode.removeChild(child);
            }
			
            child = next;
        }
    });
		
    mxEvent.addListener(cross, 'click', function()
    {
        if (cross.getAttribute('src') == Dialog.prototype.closeImage)
        {
            cross.setAttribute('src', Sidebar.prototype.searchImage);
            cross.setAttribute('title', mxResources.get('search'));
            button.style.display = 'none';
            input.value = '';
            searchTerm = '';
            clearDiv();
        }

        input.focus();
    });

    find = mxUtils.bind(this, function()
    {
        // Shows 4 rows (minimum 4 results)
        count = 4 * Math.max(1, Math.floor(this.container.clientWidth / (this.thumbWidth + 10)));
        this.hideTooltip();
		
        if (input.value != '')
        {
            if (center.parentNode != null)
            {
                if (searchTerm != input.value)
                {
                    clearDiv();
                    searchTerm = input.value;
                    hash = new Object();
                    complete = false;
                    page = 0;
                }
				
                if (!active && !complete)
                {
                    button.setAttribute('disabled', 'true');
                    button.style.display = '';
                    button.style.cursor = 'wait';
                    button.innerHTML = mxResources.get('loading') + '...';
                    active = true;
					
                    // Ignores old results
                    var current = new Object();
                    this.currentSearch = current;
					
                    this.searchEntries(searchTerm, count, page, mxUtils.bind(this, function(results, len, more, terms)
                    {
                        if (this.currentSearch == current)
                        {
                            results = (results != null) ? results : [];
                            active = false;
                            page++;
                            center.parentNode.removeChild(center);
                            this.insertSearchHint(div, searchTerm, count, page, results, len, more, terms);

                            for (var i = 0; i < results.length; i++)
                            {
                                var elt = results[i]();
								
                                // Avoids duplicates in results
                                if (hash[elt.innerHTML] == null)
                                {
                                    hash[elt.innerHTML] = '1';
                                    div.appendChild(results[i]());
                                }
                            }
							
                            if (more)
                            {
                                button.removeAttribute('disabled');
                                button.innerHTML = mxResources.get('moreResults');
                            }
                            else
                            {
                                button.innerHTML = mxResources.get('reset');
                                button.style.display = 'none';
                                complete = true;
                            }
							
                            button.style.cursor = '';
                            div.appendChild(center);
                        }
                    }), mxUtils.bind(this, function()
                    {
                        // TODO: Error handling
                        button.style.cursor = '';
                    }));
                }
            }
        }
        else
        {
            clearDiv();
            input.value = '';
            searchTerm = '';
            hash = new Object();
            button.style.display = 'none';
            complete = false;
            input.focus();
        }
    });
	
    mxEvent.addListener(input, 'keydown', mxUtils.bind(this, function(evt)
    {
        if (evt.keyCode == 13 /* Enter */)
        {
            find();
            mxEvent.consume(evt);
        }
    }));
	
    mxEvent.addListener(input, 'focus', function()
    {
        input.style.paddingRight = '';
    });
	
    mxEvent.addListener(input, 'blur', function()
    {
        input.style.paddingRight = '20px';
    });

    input.style.paddingRight = '20px';
	
    mxEvent.addListener(input, 'keyup', mxUtils.bind(this, function(evt)
    {
        if (input.value == '')
        {
            cross.setAttribute('src', Sidebar.prototype.searchImage);
            cross.setAttribute('title', mxResources.get('search'));
        }
        else
        {
            cross.setAttribute('src', Dialog.prototype.closeImage);
            cross.setAttribute('title', mxResources.get('reset'));
        }
		
        if (input.value == '')
        {
            complete = true;
            button.style.display = 'none';
        }
        else if (input.value != searchTerm)
        {
            button.style.display = 'none';
            complete = false;
        }
        else if (!active)
        {
            if (complete)
            {
                button.style.display = 'none';
            }
            else
            {
                button.style.display = '';
            }
        }
    }));

    // Workaround for blocked text selection in Editor
    mxEvent.addListener(input, 'mousedown', function(evt)
    {
    	if (evt.stopPropagation)
    	{
    		evt.stopPropagation();
    	}
    	
    	evt.cancelBubble = true;
    });
    
    // Workaround for blocked text selection in Editor
    mxEvent.addListener(input, 'selectstart', function(evt)
    {
    	if (evt.stopPropagation)
    	{
    		evt.stopPropagation();
    	}
    	
    	evt.cancelBubble = true;
    });

    var outer = document.createElement('div');
    outer.appendChild(div);
    this.container.appendChild(outer);
	
    // Keeps references to the DOM nodes
    this.palettes['search'] = [elt, outer];
};

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.insertSearchHint = function(div, searchTerm, count, page, results, len, more, terms)
{
    if (results.length == 0 && page == 1)
    {
        var err = document.createElement('div');
        err.className = 'geTitle';
        err.style.cssText = 'background-color:transparent;border-color:transparent;' +
			'color:gray;padding:6px 0px 0px 0px !important;margin:4px 8px 4px 8px;' +
			'text-align:center;cursor:default !important';
		
        mxUtils.write(err, mxResources.get('noResultsFor', [searchTerm]));
        div.appendChild(err);
    }
};

/**
 * 删除页面
 * @param {object} ele 当前的节点
 */
Sidebar.prototype.deletePage = function(ele) {
    // 删除后应该显示的页面
    const pageType = this.editorUi.editor.currentType;
    const restList = this.editorUi.editor.pagesRank[pageType]
    if (restList.length <= 1) {
        // alert('至少保留一个' + (pageType === 'normal' ? '页面' : '弹窗'));
        tipDialog(this.editorUi,'至少保留一个' + (pageType === 'normal' ? '页面' : '弹窗'));
        return;
    } else {
        sureDialog(this.editorUi, `确定要删除${pageType === 'normal' ? '页面' : '弹窗'}吗`, () => {
            var target;
            var type = this.editorUi.editor.pages[this.editorUi.editor.currentPage].type
            if (ele.prev().length) {
                target = ele.prev().children('.spanli');
            } else if (ele.next().length) {
                target = ele.next().children('.spanli');
            } else if (type == 'dialog' && !!$("#normalPages li").first()) {
                target = $("#normalPages li").first().children('.spanli');
            } else if (type == 'noraml' && !!$("#dialogPages li").first()) {
                target = $("#dialogPages li").first().children('.spanli');
            }
            // 删除页面数据
            this.editorUi.editor.deletePage(ele.data('pageid'), type)
            target.click();
            // 移除节点
            ele.remove()
        })
        
    }
}
/**/
Sidebar.prototype.renameNode = function(ele, pageType) {
    let editInput = document.createElement('input');
    editInput.id = 'editPageInput';
    let oldVal = ele.innerText
    editInput.value = oldVal;
    ele.innerText = '';
    ele.appendChild(editInput);
    editInput.focus();
    let saveFn = () => {
        let name = editInput.value.trim();
        mxEvent.removeListener(document.body, 'click', saveFn);
        if (!name) {
            tipDialog(this.editorUi, `${pageType === 'normal' ? '页面' : '弹窗'}名称不能为空`);
            ele.innerHTML = `<span class="spanli" style="flex:1;width:150px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap">${oldVal}</span><span class="right-icon-dolt"></span>`
        } else if (name.length > 20) {
            tipDialog(this.editorUi, `${pageType === 'normal' ? '页面' : '弹窗'}名称不能超过20个字符`);
            ele.innerHTML = `<span class="spanli" style="flex:1;width:150px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap">${oldVal}</span><span class="right-icon-dolt"></span>`;
        } else {
            // 去除重名
            // if (name !== oldVal) {
            //     for (let key in this.editorUi.editor.pages) {
            //         if (this.editorUi.editor.pages[key].title === name) {
            //             // mxUtils.alert('页面名称不能重复');
            //             tipDialog(this.editorUi, `${pageType === 'normal' ? '页面' : '弹窗'}名称不能重复`);
            //             ele.innerHTML = oldVal;
            //             return;
            //         }
            //     }
            // }
            this.editorUi.editor.pages[ele.getAttribute('data-pageid')].title = name;
            ele.innerHTML = `<span class="spanli" style="flex:1;width:150px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap">${name}</span><span class="right-icon-dolt"></span>`;
        }
    }
    mxEvent.addListener(document.body, 'click', saveFn);
    // 回车
    mxEvent.addListener(editInput, 'click', function(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }, true);
    // 回车
    mxEvent.addListener(editInput, 'keydown', function(e) {
        if (e.keyCode === 13) {
            saveFn();
        }
    });
}
/*复制页面*/
Sidebar.prototype.copyPage = function (ele,pageType) {
 let  id = '';
 const currtitle = ele.innerText
 var xml = this.editorUi.editor.defaultXml[pageType];
 var currentPage = this.editorUi.editor.pages[this.editorUi.editor.currentPage]
 xml = currentPage.xml
 id = currentPage.id
 let titleText = `${currtitle}_副本`
 let page = {
    title: titleText,
    xml,
    id,
    style:{},
    type: pageType
  };
  let _li = document.createElement('li');
  let resPage = this.editorUi.editor.addPage(page,pageType);
  _li.setAttribute('data-pageid', resPage.id);
    _li.innerHTML = `<span class="spanli" style="flex:1;width:150px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap">${titleText}</span><span class="right-icon-dolt"></span>`;
  let changeRank = this.editorUi.editor.pagesRank[resPage.type];
  // 根据类型插入列表
   changeRank.push(resPage.id);
   if (pageType === 'normal') {
    $("#normalPages").append(_li);
   }
   if (pageType === 'dialog') {
    $("#dialogPages").append(_li);
   }
   this.editorUi.editor.pagesRank[resPage.type] = [].concat(changeRank);
    if (pageType === 'normal') {
        $("#normalPages li:last-child .spanli").click();
    }
    if (pageType === 'dialog') {
        $("#dialogPages li:last-child .spanli").click();
    }
}
Sidebar.prototype.svgPng = function (ele) {
    const svg = ele
    let ImgBase64 = ''
    return new Promise((resolve, reject) => {
        const s = new XMLSerializer().serializeToString(svg);
        const src = `data:image/svg+xml;base64,${window.btoa(s)}`;
        const img = new Image(); // 创建图片容器承载过渡
        img.src = src;
        img.onload = function() {
            // 图片创建后再执行，转Base64过程
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            if (img.width <= 2) {
                resolve()
            } else {
                canvas.height = img.height;
                const context = canvas.getContext('2d');
                context.drawImage(img, 0, 0);
                ImgBase64 = canvas.toDataURL('image/png');
                resolve(ImgBase64)
            }
        }
    })
}
/*添加模版*/
Sidebar.prototype.addTemplate = async function(type) {
    let svgImage = this.editorUi.editor.graph.getSvg(null, null, null, true, null, true, null, null, null, false)
    let imageurl = await this.svgPng(svgImage)
    if (imageurl) {
        console.log(this.editorUi.editor.pages)
        console.log(this.editorUi.editor.currentPage)
        var currentPage = this.editorUi.editor.pages[this.editorUi.editor.currentPage]
        console.log(currentPage)
        let data = {
            content: JSON.stringify(currentPage),
            pic: imageurl,
            type: type
        }
        requestUtil.post(Urls.addTemplate.url, data).then((res) => {
            if (res.picUrl) {
                tipDialog(this.editorUi, `添加${type === 'normal' ? '页面模版成功' : '弹窗模版成功' }`)
            }
        }).catch(() => {
            tipDialog(this.editorUi, `添加${type === 'normal' ? '页面模版失败' : '弹窗模版失败'}`)
        })
    } else {
        tipDialog(this.editorUi, `您未拖入组件，不能添加为模版！`)
    }
}

/**
 * 页面右键菜单
 */
Sidebar.prototype.createPageContextMenu = function(type) {
    var menulist = document.createElement('ul')
    if (document.querySelector('#pageContextMenu')) {
        document.querySelector('#pageContextMenu').remove()
    }
    menulist.id = 'pageContextMenu';
    // var menus = {
    //     'addPrev': '上方添加',
    //     'addNext': '下方添加',
    //     'movePrev': '上移',
    //     'moveNext': '下移',
    //     'rename': '重命名',
    //     'copy': '复制',
    //     'delete': '删除',
    // }
    let menus = null
    if (+type === 1) { // 弹窗
        menus = {
            'copy': '复制弹窗',
            'addTemplate':`添加到模版`,
            'rename': '重命名',
            'delete': '删除',
        }
    } else {
        menus = {
            'copy': '复制页面',
            'addTemplate':`添加到模版`,
            'rename': '重命名',
            'delete': '删除',
        }
    }
    for (var key in menus) {
        var menu = document.createElement('li')
        menu.innerText = menus[key]
        menu.className = key
        menu.setAttribute('data-type', key)
        menulist.appendChild(menu)
    }
    document.body.appendChild(menulist);
    // 隐藏菜单
    mxEvent.addGestureListeners(document, (evt) => {
        if (evt.target.parentNode && evt.target.parentNode.id !== 'pageContextMenu') {
            this.hidePageContextMenu();
        }
    });
    mxEvent.addListener(menulist, 'click', function(evt) {
        evt.stopPropagation()
        var target = evt.target;
        var ele = $(".pageList .currentPage").eq(0);
        let pageType = null
        if (ele.parent().attr('id') === 'normalPages') {
            pageType = 'normal'
        } else {
            pageType = 'dialog'
        }
        const element = document.querySelector('.pageList>li.currentPage')
        // 操作类型
        var actionType = target.getAttribute('data-type');
        // 添加页面
        var addPage = this.editorUi.actions.get('addPage').funct;

        // const pageType = this.editorUi.editor.currentType;
        let index = this.editorUi.editor.pagesRank[pageType].indexOf(ele.data('pageid'))
        switch (actionType) {
            case 'movePrev':
                this.editorUi.editor.pagesRank[pageType] = mxUtils.swapItems( this.editorUi.editor.pagesRank[pageType], index - 1, index);
                ele.insertBefore(ele.prev())
                break;
            case 'moveNext':
				 this.editorUi.editor.pagesRank[pageType] = mxUtils.swapItems( this.editorUi.editor.pagesRank[pageType], index, index - 1);
                ele.insertAfter(ele.next())
                break;
            case 'delete':
                this.deletePage(ele)
                break;
            case 'rename':
                this.renameNode(element, pageType)
                break;
            case 'copy':
                this.copyPage(element,pageType)
                break;
            case 'homepage':
                this.editorUi.editor.pagesRank[pageType] = mxUtils.swapItems( this.editorUi.editor.pagesRank[pageType], index - 1, index);
                // var first = document.pageList
                var targetEle = null
                if (pageType ==='normal') {
                    targetEle = document.querySelector('#normalPages')
                } else {
                    targetEle = document.querySelector('#dialogPages')
                }
                const currentnode = document.querySelector('.currentPage')
                const first = targetEle.firstChild
                targetEle.insertBefore(currentnode,first)
                $('.left-sidebar-homepage').removeClass('left-sidebar-homepage')
                currentnode.className += ' left-sidebar-homepage'
                break
            case 'addTemplate':
                this.addTemplate(pageType)
                break;
            default:
                addPage(actionType)
                break;
        }
        this.hidePageContextMenu();
    }.bind(this))
    return menulist;
}

function createPageList(editorUi, el, data, id) {
    // 页面列表
    editorUi.editor.setCurrentType(id == 'normalPages' ? 'normal' : 'dialog');
    var pageListEle = document.createElement('ul');
    pageListEle.className = "pageList";
    pageListEle.id = id;
    for (var i in data) {
        var page = document.createElement('li')
        if (data[i].type === 'normal' && i === '0') { // 首页
            page.className = 'left-sidebar-homepage'
        }
        page.setAttribute('data-pageid', data[i].id);
        page.innerHTML =  `<span class="spanli" style="flex:1;width:150px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap">${data[i].title}</span><span class="right-icon-dolt"></span>`;
        pageListEle.appendChild(page)
    }
    el.appendChild(pageListEle)
    $('.commonPages').on('mouseenter', '.pageList>li.currentPage>.right-icon-dolt',function(evt) {
        evt.preventDefault();
        // 右键菜单展示
        var menulist = document.getElementById('pageContextMenu');
        var targetElement = document.querySelector("#pageContextMenu .rename")
        const textlen = menulist.firstChild.innerText
        if (!$(this).parent().hasClass('left-sidebar-homepage') && textlen.indexOf('弹窗') === -1) {
            if(!$('#pageContextMenu').children('.homepage').length) {
                const Oli = document.createElement('li')
                Oli.className = 'homepage'
                Oli.innerText = '设为首页'
                Oli.setAttribute('data-type', 'homepage')
                menulist.insertBefore(Oli,targetElement)
            }
        } else {
            $('.homepage').remove()
        }
        menulist.style.display = 'block';
        menulist.style.left = mxEvent.getClientX(evt) + 'px';
        menulist.style.top = mxEvent.getClientY(evt) + 'px';
        $('.commonPages .pageList>li.currentPage>.right-icon-dolt').css({ 'pointer-events': 'none'})
    })
    function changePage(e) {
        let target = e.target
        if (((target.parentNode.nodeName === 'LI') && target.parentNode.className !== 'currentPage')) {
            // 目标页面名称
            var nextTitle = target.parentElement.getAttribute('data-pageid');
            // 已选中节点
            if (editorUi.editor.currentPage !== nextTitle && editorUi.editor.pages[editorUi.editor.currentPage]) {
                editorUi.editor.setXml()
            }
            // 切换到新的页面
            $(".currentPage").removeClass('currentPage')
            editorUi.editor.setCurrentPage(nextTitle)
            if (!target.parentNode.className) {
                target.parentNode.className += "currentPage"
            } else {
                target.parentNode.className += " currentPage"
            }
            var doc = mxUtils.parseXml(editorUi.editor.pages[nextTitle].xml)
            editorUi.editor.setGraphXml(doc.documentElement)
            VueEvent.$emit('pageTabEvent', id == 'normalPages' ? 0 : 1)
            if (id == 'dialogPages'){
                VueEvent.$emit('initDialogPos')
            }
        }
    }
    if (id.includes('normal')) {
        $('.normalPages').on('click', '.pageList>li>.spanli', function (evt) {
            changePage(evt)
        })
    }
    if (id.includes('dialog')) {
        $('.dialogPages').on('click', '.pageList>li>.spanli', function (evt) {
            changePage(evt)
        })
    }
    mxEvent.addListener(pageListEle, 'contextmenu', function(evt) {
        evt.preventDefault();
    })
    
    return pageListEle;
}
Sidebar.prototype.hidePageContextMenu = function() {
    document.getElementById('pageContextMenu') ?  document.getElementById('pageContextMenu').style.display = 'none' : null;
    $('.commonPages .pageList>li.currentPage>.right-icon-dolt').css({ 'pointer-events': 'auto' })
}
Sidebar.prototype.tabsSwitch = function(type) {
    this.createPageContextMenu(type)
}
Sidebar.prototype.addPagePalette = function() {
    var normalPages = []
    var dialogPages = [];
    var pages = this.editorUi.editor.pages;
    // 页面
    for (let key of this.editorUi.editor.pagesRank.normal) {
        pages[key] && normalPages.push(pages[key]);
    }
    // // 弹窗
    for (let key of this.editorUi.editor.pagesRank.dialog) {
        pages[key] && dialogPages.push(pages[key]);
    }
    const normalPagesEl = document.querySelector('.normalPages')
    const dialogPagesEl = document.querySelector('.dialogPages')
    createPageList(this.editorUi,normalPagesEl, normalPages, 'normalPages')
    createPageList(this.editorUi, dialogPagesEl, dialogPages, 'dialogPages')
    this.createPageContextMenu()
}
/**
 * 添加给定的模板控件.
 */
Sidebar.prototype.addStencilPalette = function(id, title, stencilFile, style, ignore, onInit, scale, tags, customFns)
{
    scale = (scale != null) ? scale : 1;
	
    var fns = [];
	
    if (customFns != null)
    {
        for (var i = 0; i < customFns.length; i++)
        {
            fns.push(customFns[i]);
        }
    }
    mxStencilRegistry.loadStencilSet(stencilFile, mxUtils.bind(this, function(packageName, stencilName, displayName, w, h)
    {
        if (ignore == null || mxUtils.indexOf(ignore, stencilName) < 0)
        {
            var tmp = this.getTagsForStencil(packageName, stencilName);
            var tmpTags = (tags != null) ? tags[stencilName] : null;

            if (tmpTags != null)
            {
                tmp.push(tmpTags);
            }
            fns.push(this.createVertexTemplateEntry('shape=' + packageName + stencilName.toLowerCase() + style,
                Math.round(w * scale), Math.round(h * scale), '', '', null, null,
                this.filterTags(tmp.join(' '))));
        }
    }), true, true);
    basicXmlFns = fns;
};
/**
 * 图元管理
 */
Sidebar.prototype.addBasicXml = function() {
    this.addPaletteFunctions('primitiveManage', '图元管理', true, basicXmlFns);
}
Sidebar.prototype.addBasicPalette = function()
{
    this.addStencilPalette('basic', mxResources.get('basic'), '/static/stencils/basic.xml',
        ';whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1;aspect=fixed',
        null, null, null, null, []);
};
/**
 * 图元列表
 */
Sidebar.prototype.primitives = ['circle', 'diamond', 'drop', 'pentagram', 'square'];
/**
 * 基本控件
 */
Sidebar.prototype.addGeneralPalette = function(expand)
{
    var that = this;
    var fns = [
        // 文字
        this.createVertexTemplateEntry(
            "shape=text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;",
            // "shape=text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;",
            60,
            20,
            // 类似链接一样设置
            '<span style="display:table-cell;vertical-align: middle;word-break:break-word;line-height:1;">输入文本</span>',
            // 'text',
            "文字"
        ),
        // 直线
        this.createEdgeTemplateEntry('shape=beeline;endArrow=none;html=1;', 50, 50, '', '直线', null,''),
         //箭头
        //this.createEdgeTemplateEntry('shape=endarrow;endArrow=classic;html=1;', 50, 0, '', '箭头', false, false),
        // 矩形
        this.createVertexTemplateEntry('rounded=0;shape=rectangle;whiteSpace=wrap;html=1;strokeColor=#000;', 120, 60, '', '矩形', null, null, '矩形'),
        // 圆形
        this.createVertexTemplateEntry('shape=ellipse;whiteSpace=wrap;html=1;strokeColor=#000;aspect=fixed;', 36, 36, '', '圆形', null, null, '圆形'),
        // this.createVertexTemplateEntry('rounded=0;shape=oval;whiteSpace=wrap;html=1;', 36, 36, '', '圆形', null, null, '圆形'),
        // 横向菜单
        this.addEntry('page menu', function()
        {
            var cell = new mxCell('', new mxGeometry(0, 0, 360, 40), 'shape=menulist;group;selectBackgroundColor=#3B72A8;selectedFontColor=#3B72A8;');
            cell.vertex = true;
			
            for (let i = 0; i < 3; i++) {
                let line = parseInt(i / 3);
                let xNum = i % 3;
                let symbol = new mxCell('菜单' + (i + 1), new mxGeometry(xNum * 120, 40 * line, 120, 40), 'shape=menuCell;strokeColor=#000000;html=1;whiteSpace=wrap;');
                symbol.vertex = true;
                cell.insert(symbol);
            }
            // 
            return that.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, '菜单');
        }),
        // 按钮
        this.createVertexTemplateEntry('shape=button;html=1;strokeColor=#000;fillColor=none;overflow=fill', 70, 40, '<button class="buttonTag" style="box-sizing:content-box;background:transparent;">BUTTON</button>', '按钮'),
        // 复选
        // this.createVertexTemplateEntry('shape=multipleCheck;html=1;strokeColor=#000;fillColor=none;overflow=fill', 32, 32, '<input type="checkbox" class="inputTag1" />', '复选'),
        // this.createVertexTemplateEntry('shape=multipleCheck;html=1;labelBackgroundColor=#ffffff;image=/static/stencils/basic/multipleCheck.png', 16, 16, '', '复选'),
        // 单选
        // this.createVertexTemplateEntry('shape=singleCheck;html=1;strokeColor=#000;fillColor=none;overflow=fill', 32, 32, '<input type="radio" class="inputTag" />', '单选'),
        // this.createVertexTemplateEntry('shape=singleCheck;html=1;labelBackgroundColor=#ffffff;image=/static/stencils/basic/singleCheck.png', 16, 16, '', '单选'),
        // 下拉列表
        // this.createVertexTemplateEntry('shape=select;html=1;strokeColor=#000;fillColor=none;overflow=fill', 100, 16, '<select disabled class="selectTag"></select><div class="selectTagShade"></div>', '下拉列表'),
        // 表格，通过html生成
        /* this.createVertexTemplateEntry('shape=table;html=1;strokeColor=none;fillColor=none;overflow=fill;', 180, 140,
         	'<p style="width:100%;height:25%;line-height: 100%;text-align: center">表格标题</p>' +
 			'<table border="1" style="width:100%;height:75%;border-collapse:collapse;">' +
 			'<tr><td align="center">Value 1</td><td align="center">Value 2</td><td align="center">Value 3</td></tr>' +
 			'<tr><td align="center">Value 4</td><td align="center">Value 5</td><td align="center">Value 6</td></tr>' +
        	'<tr><td align="center">Value 7</td><td align="center">Value 8</td><td align="center">Value 9</td></tr></table>', '表格'), */
        //表格,通过矩形拼接
        this.addEntry('tableBox', function()
        {
            var cell = new mxCell('', new mxGeometry(0, 0, 300, 90), 'shape=tableBox;group');
            cell.vertex = true;
            for (let i = 0; i < 9; i++) {
                let line = parseInt(i / 3);
                let xNum = i % 3;
                let symbol = new mxCell(i < 3 ? 'Column ' + (i + 1) : '', new mxGeometry(xNum * 100, 30 * line, 100, 30), 'shape=tableCell;strokeColor=#000000;html=1;whiteSpace=wrap;');
                symbol.vertex = true;
                cell.insert(symbol);
            }
            return that.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, '表格');
        }),
        // 图片
        this.createVertexTemplateEntry('shape=image;html=1;labelBackgroundColor=#ffffff;image=/static/stencils/basic/image.png', this.defaultImageWidth, this.defaultImageHeight, '', '图片'),
        // 图元
        // this.createVertexTemplateEntry('shape=primitive;html=1;labelBackgroundColor=#ffffff;image=/static/stencils/basic/primitive.png', 50, 50, '', '图元'),
        // 曲线
        // this.addEntry('curve', mxUtils.bind(this, function()
	 	// {
        //     var cell = new mxCell('', new mxGeometry(0, 0, 50, 50), 'shape=curve;curved=1;endArrow=none;html=1;');
        //     cell.geometry.setTerminalPoint(new mxPoint(0, 50), true);
        //     cell.geometry.setTerminalPoint(new mxPoint(50, 0), false);
        //     cell.geometry.points = [new mxPoint(50, 50), new mxPoint(0, 0)];
        //     cell.geometry.relative = true;
        //     cell.edge = true;
        //     return this.createEdgeTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, '曲线');
	 	// })),
        // 管道2
        this.createVertexTemplateEntry('shape=pipeline2;html=1;labelBackgroundColor=#ffffff;image=/static/stencils/basic/npipeline2.svg', 72, 72, '', '管道2'),
        // 指示灯
        this.createVertexTemplateEntry('shape=light;html=1;labelBackgroundColor=#ffffff;image=/static/stencils/basic/light2.svg', 72, 72, '', '指示灯'),
        // 进度条
        this.createVertexTemplateEntry('shape=progress;html=1;labelBackgroundColor=#ffffff;image=/static/stencils/basic/progress2.svg', 72, 36, '', '进度条'),
        // 管道1
        this.createVertexTemplateEntry('shape=pipeline1;html=1;labelBackgroundColor=#ffffff;image=/static/stencils/basic/npipeline1.svg', 36, 72, '', '管道1'),
        // 链接
        this.createVertexTemplateEntry('shape=linkTag;html=1;strokeColor=none;fillColor=none;verticalAlign=middle;align=center', 70, 40, '<a style="width:100%;height:100%;color: #3D91F7;display: table-cell;vertical-align: bottom;text-decoration: underline" class="linkTag">Link</a>', 'Link'),
    ];
    //封装
    this.addPaletteFunctions('general', '基本控件', (expand != null) ? expand : true, fns);

    let fnsChart=[
        this.createVertexTemplateEntry('shape=lineChart;html=1;labelBackgroundColor=#ffffff;image=/static/stencils/basic/lineChart2.svg', 190, 90, '', '趋势图'),
        this.createVertexTemplateEntry('shape=gaugeChart;html=1;labelBackgroundColor=#ffffff;image=/static/stencils/basic/gaugeChart2.svg', 100, 90, '', '仪表盘'),
    ]
    this.addPaletteFunctions('chart', '图表控件', false, fnsChart);
   };
/**/
Sidebar.prototype.addLayoutPalette = function (expand) {
    let materialLibraryId = 'e76e6a1b18e493472bc869d835811711'
    let Array1 = []
    requestUtil.get(Urls.materialList.url + `/${materialLibraryId}`).then((res) => {
        let that = this
        let data = res.materialList || []
        data.forEach((item) => {
            Array1.push(that.createVertexTemplateEntry(`shape=userimage;html=1;labelBackgroundColor=#ffffff;image=${item.picUrl}`, 300, 170, '', 'layout图', '', '', '', 'layout', `${item.picUrl}`))
        })
        // if (Array1.length) {
        this.addPaletteFunctions('layout', 'layout控件', false, Array1);
        // }
    })
}
/*
addUserPalette
*/
Sidebar.prototype.addUserPalette = function (expand) {
    var that = this;
    let arr = []
    requestUtil.get(Urls.materialList.url).then((res) => {
        let data = res.records || []
        data.forEach((item) => {
            let obj = {
                name: item.libraryName,
                materialLibraryId: item.materialLibraryId
            }
            arr.push(obj)
        })
        arr.forEach((item) => {
            let Array1 = []
            requestUtil.get(Urls.materialList.url + `/${item.materialLibraryId}`).then((res) => {
                let that = this
                let data = res.materialList
                data.forEach((item) => {
                    Array1.push(that.createVertexTemplateEntry(`shape=userimage;html=1;labelBackgroundColor=#ffffff;image=${item.picUrl}`, 300, 170, '', 'layout图', '', '', '', 'layout', `${item.picUrl}`))
                })
                // if (Array1.length) {
                    this.addPaletteFunctions('user', `${item.name}`, false, Array1);
                // }
            })
        })
    })
    
}
/**
 * Adds the given image palette.
 */
Sidebar.prototype.addImagePalette = function(id, title, prefix, postfix, items, titles, tags)
{
	var showTitles = titles != null;
	var fns = [];
	
	for (var i = 0; i < items.length; i++)
	{
		(mxUtils.bind(this, function(item, title, tmpTags)
		{
			if (tmpTags == null)
			{
				var slash = item.lastIndexOf('/');
				var dot = item.lastIndexOf('.');
				tmpTags = item.substring((slash >= 0) ? slash + 1 : 0, (dot >= 0) ? dot : item.length).replace(/[-_]/g, ' ');
			}
			
			fns.push(this.createVertexTemplateEntry('image;html=1;labelBackgroundColor=#ffffff;image=' + prefix + item + postfix,
				this.defaultImageWidth, this.defaultImageHeight, '', title, title != null, null, this.filterTags(tmpTags)));
		}))(items[i], (titles != null) ? titles[i] : null, (tags != null) ? tags[items[i]] : null);
	}
	this.addPaletteFunctions(id, title, false, fns);
};


/**
 * 左侧列表标题栏
 */
Sidebar.prototype.createTitle = function(label, id)
{
    // let wrapEle = document.createElement('div')
    var elt = document.createElement('a');
    elt.setAttribute('href', 'javascript:void(0);');
    elt.setAttribute('ondragstart', 'return false;');
    elt.setAttribute('title', mxResources.get('sidebarTooltip'));
    elt.className = 'geTitle';
    elt.id = id + 'Title';
    mxUtils.write(elt, label);
    // 页面管理一栏，增加添加页面管理的icon
    if (id === 'pageManage') {
        var img = document.createElement('img');
        img.setAttribute('src', '/static/images/icons/addPage.png');
        img.setAttribute('id', 'addPage');
        img.addEventListener('click', function(e) {
            e = e || window.event;
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            // 触发事件
            var action = this.editorUi.actions.get('addPage');
            action.funct();
        }.bind(this), true)
        elt.appendChild(img);
    }
    // wrapEle.appendChild(elt)
    return elt;
};

/**
 * Creates a thumbnail for the given cells.
 */
Sidebar.prototype.createThumb = function(cells, width, height, parent, title, showLabel, showTitle, realWidth, realHeight)
{
    this.graph.labelsVisible = (showLabel == null || showLabel);
    var fo = mxClient.NO_FO;
    mxClient.NO_FO = Editor.prototype.originalNoForeignObject;
    this.graph.view.scaleAndTranslate(1, 0, 0);
    this.graph.addCells(cells);
    var bounds = this.graph.getGraphBounds();
    var s = Math.floor(Math.min((width - 2 * this.thumbBorder) / bounds.width,
        (height - 2 * this.thumbBorder) / bounds.height) * 100) / 100;
    this.graph.view.scaleAndTranslate(s, Math.floor((width - bounds.width * s) / 2 / s - bounds.x),
        Math.floor((height - bounds.height * s) / 2 / s - bounds.y));
    var node = null;
	
    // For supporting HTML labels in IE9 standards mode the container is cloned instead
    if (this.graph.dialect == mxConstants.DIALECT_SVG && !mxClient.NO_FO)
    {
        node = this.graph.view.getCanvas().ownerSVGElement.cloneNode(true);
    }
    // LATER: Check if deep clone can be used for quirks if container in DOM
    else
    {
        node = this.graph.container.cloneNode(false);
        node.innerHTML = this.graph.container.innerHTML;
		
        // Workaround for clipping in older IE versions
        if (mxClient.IS_QUIRKS || document.documentMode == 8)
        {
            node.firstChild.style.overflow = 'visible';
        }
    }
	
    this.graph.getModel().clear();
    mxClient.NO_FO = fo;
	
    // Catch-all event handling
    if (mxClient.IS_IE6)
    {
        parent.style.backgroundImage = 'url(' + this.editorUi.editor.transparentImage + ')';
    }
    node.style.position = 'relative';
    node.style.overflow = 'hidden';
    node.style.cursor = 'move';
    // node.style.left = this.thumbBorder + 'px';
    node.style.top = this.thumbBorder + 'px';
    node.style.width = width + 'px';
    node.style.height = height + 'px';
    node.style.visibility = '';
    node.style.minWidth = '';
    node.style.minHeight = '';
    node.style.margin = '0 auto';
    title && (node.style.opacity = 0);
	
    parent.appendChild(node);
	
    // Adds title for sidebar entries
    if (this.sidebarTitles && title != null && showTitle != false)
    {
        var border = (mxClient.IS_QUIRKS) ? 2 * this.thumbPadding + 2 : 0;
        parent.style.height = (this.thumbHeight + border + this.sidebarTitleSize + 8) + 'px';
		
        var div = document.createElement('div');
        div.style.fontSize = this.sidebarTitleSize + 'px';
        div.style.color = '#303030';
        div.style.textAlign = 'center';
        div.style.whiteSpace = 'nowrap';
		
        if (mxClient.IS_IE)
        {
            div.style.height = (this.sidebarTitleSize + 12) + 'px';
        }

        div.style.paddingTop = '4px';
        mxUtils.write(div, title);
        parent.appendChild(div);
    }

    return bounds;
};

/**
 * Creates and returns a new palette item for the given image.
 */
Sidebar.prototype.createItem = function(cells, title, showLabel, showTitle, width, height, allowCellsInserted, type, imageurl)
{
    // let Basic_ = 'http://10.74.20.26:8009/'
    var elt = document.createElement('a');
    var ui = this.editorUi;
    elt.setAttribute('href', "javascript:void(0);");
    elt.setAttribute('ondragstart', 'return false;');
    elt.className = 'geItem';
    elt.style.overflow = 'hidden';
    var border = (mxClient.IS_QUIRKS) ? 8 + 2 * this.thumbPadding : 2 * this.thumbBorder;
    // elt.style.width = (this.thumbWidth + border + 14) + 'px';
    // elt.style.height = (this.thumbHeight + border + 20) + 'px';
    elt.style.width = '46px'
    elt.style.height = '46px'
    // elt.style.marginRight = '5px'
    // elt.style.marginBottom = '5px'
    // elt.style.padding = this.thumbPadding + 'px';
    var shapeName = /shape=(.+?);/.exec(cells[0].style)[1];
    if (!title) {
        // 图元列表
        this.thumbWidth = 29;
        this.thumbHeight = 29;
        elt.style.width = '33px';
        elt.style.height = '33px';
    } else {
        if (type === 'layout' || type === 'lineChart' || type === 'gaugeChart') {
            elt.style.backgroundImage = `url(${imageurl})`;
        } else {
            elt.style.backgroundImage = 'url(/static/stencils/basic/' + shapeName + '.png)';
        }
        elt.style.backgroundPosition = `center center`
        elt.style.backgroundRepeat = `no-repeat`
    }
	
    if (mxClient.IS_IE6)
    {
        elt.style.border = 'none';
    }
    this.createThumb(cells, this.thumbWidth, this.thumbHeight, elt, title, showLabel, showTitle, width, height);
    var bounds = new mxRectangle(0, 0, width, height);
    if (cells.length > 1 || cells[0].vertex)
    {
        if (!/primitive/.test(cells[0].style)) {
            // 非图元绑定拖拽插入画布事件
            var ds = this.createDragSource(elt, this.createDropHandler(cells, true, allowCellsInserted, bounds), this.createDragPreview(width, height), cells, bounds);
            ds.isGuidesEnabled = mxUtils.bind(this, function()
            {
                return this.editorUi.editor.graph.graphHandler.guidesEnabled;
            });
        }
    }
    else if (cells[0] != null && cells[0].edge)
    {
        var ds = this.createDragSource(elt, this.createDropHandler(cells, false, allowCellsInserted,
            bounds), this.createDragPreview(width, height), cells, bounds);
    }
	
    // Shows a tooltip with the rendered cell
    if (!mxClient.IS_IOS)
    {
        mxEvent.addGestureListeners(elt, null, mxUtils.bind(this, function(evt)
        {
            if (mxEvent.isMouseEvent(evt))
            {
                this.showTooltip(elt, cells, bounds.width, bounds.height, title, showLabel);
            }
        }));
    }
    //控件名称
    if (showLabel){
        var nameText = document.createElement('p')
        nameText.style.textAlign = 'center'
        nameText.style.textOverflow = 'ellipsis'
        nameText.style.overflow = 'hidden'
        nameText.innerText = title
        elt.appendChild(nameText)
    }
    return elt;
};

/**
 * 更新控件类型的样式
 */
Sidebar.prototype.updateShapes = function(source, targets)
{
    var graph = this.editorUi.editor.graph;
    var sourceCellStyle = graph.getCellStyle(source);
    var result = [];
	
    graph.model.beginUpdate();
    try
    {
        var cellStyle = graph.getModel().getStyle(source);

        // 所有类型的样式
        var styles = ['shadow', 'dashed', 'dashPattern', 'fontFamily', 'fontSize', 'fontColor', 'align', 'startFill',
		              'startSize', 'endFill', 'endSize', 'strokeColor', 'strokeWidth', 'fillColor', 'gradientColor',
		              'html', 'part', 'noEdgeStyle', 'edgeStyle', 'elbow', 'childLayout', 'recursiveResize',
		              'container', 'collapsible', 'connectable'];
		
        for (var i = 0; i < targets.length; i++)
        {
            var targetCell = targets[i];
			
            if ((graph.getModel().isVertex(targetCell) == graph.getModel().isVertex(source)) ||
				(graph.getModel().isEdge(targetCell) == graph.getModel().isEdge(source)))
            {
                var state = graph.view.getState(targetCell);
                var style = (state != null) ? state.style : graph.getCellStyle(targets[i]);
                graph.getModel().setStyle(targetCell, cellStyle);
				
                // Removes all children of composite cells
                if (state != null && mxUtils.getValue(state.style, 'composite', '0') == '1')
                {
                    var childCount = graph.model.getChildCount(targetCell);
					
                    for (var j = childCount; j >= 0; j--)
                    {
                        graph.model.remove(graph.model.getChildAt(targetCell, j));
                    }
                }

                if (style != null)
                {
                    // Replaces the participant style in the lifeline shape with the target shape
                    if (style[mxConstants.STYLE_SHAPE] == 'umlLifeline' &&
						sourceCellStyle[mxConstants.STYLE_SHAPE] != 'umlLifeline')
                    {
                        graph.setCellStyles(mxConstants.STYLE_SHAPE, 'umlLifeline', [targetCell]);
                        graph.setCellStyles('participant', sourceCellStyle[mxConstants.STYLE_SHAPE], [targetCell]);
                    }
					
                    for (var j = 0; j < styles.length; j++)
                    {
                        var value = style[styles[j]];
						
                        if (value != null)
                        {
                            graph.setCellStyles(styles[j], value, [targetCell]);
                        }
                    }
                }
				
                result.push(targetCell);
            }
        }
    }
    finally
    {
        graph.model.endUpdate();
    }
	
    return result;
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createDropHandler = function(cells, allowSplit, allowCellsInserted, bounds)
{
    allowCellsInserted = (allowCellsInserted != null) ? allowCellsInserted : true;
    return mxUtils.bind(this, function(graph, evt, target, x, y, force)
    {
        var elt = (force) ? null : ((mxEvent.isTouchEvent(evt) || mxEvent.isPenEvent(evt)) ?
            document.elementFromPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt)) :
            mxEvent.getSource(evt));
		
        while (elt != null && elt != this.container)
        {
            elt = elt.parentNode;
        }
		
        if (elt == null && graph.isEnabled())
        {
            cells = graph.getImportableCells(cells);
			
            if (cells.length > 0)
            {
                graph.stopEditing();
				
                // Holding alt while mouse is released ignores drop target
                var validDropTarget = (target != null && !mxEvent.isAltDown(evt)) ?
                    graph.isValidDropTarget(target, cells, evt) : false;
                var select = null;

                if (target != null && !validDropTarget)
                {
                    target = null;
                }
				
                if (!graph.isCellLocked(target || graph.getDefaultParent()))
                {
                    graph.model.beginUpdate();
                    try
                    {
                        x = Math.round(x);
                        y = Math.round(y);
						
                        // Splits the target edge or inserts into target group
                        if (allowSplit && graph.isSplitTarget(target, cells, evt))
                        {
                            var clones = graph.cloneCells(cells);
                            graph.splitEdge(target, clones, null,
                                x - bounds.width / 2, y - bounds.height / 2);
                            select = clones;
                        }
                        else if (cells.length > 0)
                        {
                            select = graph.importCells(cells, x, y, target);
                        }
						
                        // Executes parent layout hooks for position/order
                        if (graph.layoutManager != null)
                        {
                            var layout = graph.layoutManager.getLayout(target);
							
                            if (layout != null)
                            {
                                var s = graph.view.scale;
                                var tr = graph.view.translate;
                                var tx = (x + tr.x) * s;
                                var ty = (y + tr.y) * s;
								
                                for (var i = 0; i < select.length; i++)
                                {
                                    layout.moveCell(select[i], tx, ty);
                                }
                            }
                        }
	
                        if (allowCellsInserted)
                        {                             graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select));
                        }
                    }
                    finally
                    {
                        graph.model.endUpdate();
                    }
	
                    if (select != null && select.length > 0)
                    {
                        graph.scrollCellToVisible(select[0]);
                        graph.setSelectionCells(select);
                    }

                    if (graph.editAfterInsert && evt != null && mxEvent.isMouseEvent(evt) &&
						select != null && select.length == 1)
                    {
                        window.setTimeout(function()
                        {
                            graph.startEditing(select[0]);
                        }, 0);
                    }
                }
            }
			
            mxEvent.consume(evt);
        }
    });
};

/**
 * Creates and returns a preview element for the given width and height.
 */
Sidebar.prototype.createDragPreview = function(width, height)
{
    var elt = document.createElement('div');
    elt.style.border = this.dragPreviewBorder;
    elt.style.width = width + 'px';
    elt.style.height = height + 'px';
	
    return elt;
};

/**
 * Creates a drag source for the given element.
 */
Sidebar.prototype.dropAndConnect = function(source, targets, direction, dropCellIndex, evt)
{
    var geo = this.getDropAndConnectGeometry(source, targets[dropCellIndex], direction, targets);
	
    // Targets without the new edge for selection
    var tmp = [];
	
    if (geo != null)
    {
        var graph = this.editorUi.editor.graph;
        var editingCell = null;

        graph.model.beginUpdate();
        try
        {
            var sourceGeo = graph.getCellGeometry(source);
            var geo2 = graph.getCellGeometry(targets[dropCellIndex]);

            // Handles special case where target should be ignored for stack layouts
            var targetParent = graph.model.getParent(source);
            var validLayout = true;
			
            // Ignores parent if it has a stack layout
            if (graph.layoutManager != null)
            {
                var layout = graph.layoutManager.getLayout(targetParent);
			
                // LATER: Use parent of parent if valid layout
                if (layout != null && layout.constructor == mxStackLayout)
                {
                    validLayout = false;

                    var tmp = graph.view.getState(targetParent);
					
                    // Offsets by parent position
                    if (tmp != null)
                    {
                        var offset = new mxPoint((tmp.x / graph.view.scale - graph.view.translate.x),
                            (tmp.y / graph.view.scale - graph.view.translate.y));
                        geo.x += offset.x;
                        geo.y += offset.y;
                        var pt = geo.getTerminalPoint(false);
						
                        if (pt != null)
                        {
                            pt.x += offset.x;
                            pt.y += offset.y;
                        }
                    }
                }
            }
			
            var dx = geo2.x;
            var dy = geo2.y;
			
            // Ignores geometry of edges
            if (graph.model.isEdge(targets[dropCellIndex]))
            {
                dx = 0;
                dy = 0;
            }
			
            var useParent = graph.model.isEdge(source) || (sourceGeo != null && !sourceGeo.relative && validLayout);
            targets = graph.importCells(targets, (geo.x - (useParent ? dx : 0)),
                (geo.y - (useParent ? dy : 0)), (useParent) ? targetParent : null);
            tmp = targets;
			
            if (graph.model.isEdge(source))
            {
                // Adds new terminal to edge
                // LATER: Push new terminal out radially from edge start point
                graph.model.setTerminal(source, targets[dropCellIndex], direction == mxConstants.DIRECTION_NORTH);
            }
            else if (graph.model.isEdge(targets[dropCellIndex]))
            {
                // Adds new outgoing connection to vertex and clears points
                graph.model.setTerminal(targets[dropCellIndex], source, true);
                var geo3 = graph.getCellGeometry(targets[dropCellIndex]);
                geo3.points = null;
				
                if (geo3.getTerminalPoint(false) != null)
                {
                    geo3.setTerminalPoint(geo.getTerminalPoint(false), false);
                }
                else if (useParent && graph.model.isVertex(targetParent))
                {
                    // Adds parent offset to other nodes
                    var tmpState = graph.view.getState(targetParent);
                    var offset = (tmpState.cell != graph.view.currentRoot) ?
                        new mxPoint((tmpState.x / graph.view.scale - graph.view.translate.x),
                            (tmpState.y / graph.view.scale - graph.view.translate.y)) : new mxPoint(0, 0);

                    graph.cellsMoved(targets, offset.x, offset.y, null, null, true);
                }
            }
            else
            {
                geo2 = graph.getCellGeometry(targets[dropCellIndex]);
                dx = geo.x - Math.round(geo2.x);
                dy = geo.y - Math.round(geo2.y);
                geo.x = Math.round(geo2.x);
                geo.y = Math.round(geo2.y);
                graph.model.setGeometry(targets[dropCellIndex], geo);
                graph.cellsMoved(targets, dx, dy, null, null, true);
                tmp = targets.slice();
                editingCell = (tmp.length == 1) ? tmp[0] : null;
                targets.push(graph.insertEdge(null, null, '', source, targets[dropCellIndex],
                    graph.createCurrentEdgeStyle()));
            }
			
            graph.fireEvent(new mxEventObject('cellsInserted', 'cells', targets));
        }
        finally
        {
            graph.model.endUpdate();
        }
		
        if (graph.editAfterInsert && evt != null && mxEvent.isMouseEvent(evt) &&
			editingCell != null)
        {
            window.setTimeout(function()
            {
                graph.startEditing(editingCell);
            }, 0);
        }
    }
	
    return tmp;
};

/**
 * Creates a drag source for the given element.
 */
Sidebar.prototype.getDropAndConnectGeometry = function(source, target, direction, targets)
{
    var graph = this.editorUi.editor.graph;
    var view = graph.view;
    var keepSize = targets.length > 1;
    var geo = graph.getCellGeometry(source);
    var geo2 = graph.getCellGeometry(target);
	
    if (geo != null && geo2 != null)
    {
        geo2 = geo2.clone();

        if (graph.model.isEdge(source))
        {
            var state = graph.view.getState(source);
            var pts = state.absolutePoints;
            var p0 = pts[0];
            var pe = pts[pts.length - 1];
			
            if (direction == mxConstants.DIRECTION_NORTH)
            {
                geo2.x = p0.x / view.scale - view.translate.x - geo2.width / 2;
                geo2.y = p0.y / view.scale - view.translate.y - geo2.height / 2;
            }
            else
            {
                geo2.x = pe.x / view.scale - view.translate.x - geo2.width / 2;
                geo2.y = pe.y / view.scale - view.translate.y - geo2.height / 2;
            }
        }
        else
        {
            if (geo.relative)
            {
                var state = graph.view.getState(source);
                geo = geo.clone();
                geo.x = (state.x - view.translate.x) / view.scale;
                geo.y = (state.y - view.translate.y) / view.scale;
            }
			
            var length = graph.defaultEdgeLength;
			
            // Maintains edge length
            if (graph.model.isEdge(target) && geo2.getTerminalPoint(true) != null && geo2.getTerminalPoint(false) != null)
            {
                var p0 = geo2.getTerminalPoint(true);
                var pe = geo2.getTerminalPoint(false);
                var dx = pe.x - p0.x;
                var dy = pe.y - p0.y;
				
                length = Math.sqrt(dx * dx + dy * dy);
				
                geo2.x = geo.getCenterX();
                geo2.y = geo.getCenterY();
                geo2.width = 1;
                geo2.height = 1;
				
                if (direction == mxConstants.DIRECTION_NORTH)
                {
                    geo2.height = length
                    geo2.y = geo.y - length;
                    geo2.setTerminalPoint(new mxPoint(geo2.x, geo2.y), false);
                }
                else if (direction == mxConstants.DIRECTION_EAST)
                {
                    geo2.width = length
                    geo2.x = geo.x + geo.width;
                    geo2.setTerminalPoint(new mxPoint(geo2.x + geo2.width, geo2.y), false);
                }
                else if (direction == mxConstants.DIRECTION_SOUTH)
                {
                    geo2.height = length
                    geo2.y = geo.y + geo.height;
                    geo2.setTerminalPoint(new mxPoint(geo2.x, geo2.y + geo2.height), false);
                }
                else if (direction == mxConstants.DIRECTION_WEST)
                {
                    geo2.width = length
                    geo2.x = geo.x - length;
                    geo2.setTerminalPoint(new mxPoint(geo2.x, geo2.y), false);
                }
            }
            else
            {
                // Try match size or ignore if width or height < 45 which
                // is considered special enough to be ignored here
                if (!keepSize && geo2.width > 45 && geo2.height > 45 &&
					geo.width > 45 && geo.height > 45)
                {
                    geo2.width = geo2.width * (geo.height / geo2.height);
                    geo2.height = geo.height;
                }
	
                geo2.x = geo.x + geo.width / 2 - geo2.width / 2;
                geo2.y = geo.y + geo.height / 2 - geo2.height / 2;

                if (direction == mxConstants.DIRECTION_NORTH)
                {
                    geo2.y = geo2.y - geo.height / 2 - geo2.height / 2 - length;
                }
                else if (direction == mxConstants.DIRECTION_EAST)
                {
                    geo2.x = geo2.x + geo.width / 2 + geo2.width / 2 + length;
                }
                else if (direction == mxConstants.DIRECTION_SOUTH)
                {
                    geo2.y = geo2.y + geo.height / 2 + geo2.height / 2 + length;
                }
                else if (direction == mxConstants.DIRECTION_WEST)
                {
                    geo2.x = geo2.x - geo.width / 2 - geo2.width / 2 - length;
                }
				
                // Adds offset to match cells without connecting edge
                if (graph.model.isEdge(target) && geo2.getTerminalPoint(true) != null && target.getTerminal(false) != null)
                {
                    var targetGeo = graph.getCellGeometry(target.getTerminal(false));
					
                    if (targetGeo != null)
                    {
                        if (direction == mxConstants.DIRECTION_NORTH)
                        {
                            geo2.x -= targetGeo.getCenterX();
                            geo2.y -= targetGeo.getCenterY() + targetGeo.height / 2;
                        }
                        else if (direction == mxConstants.DIRECTION_EAST)
                        {
                            geo2.x -= targetGeo.getCenterX() - targetGeo.width / 2;
                            geo2.y -= targetGeo.getCenterY();
                        }
                        else if (direction == mxConstants.DIRECTION_SOUTH)
                        {
                            geo2.x -= targetGeo.getCenterX();
                            geo2.y -= targetGeo.getCenterY() - targetGeo.height / 2;
                        }
                        else if (direction == mxConstants.DIRECTION_WEST)
                        {
                            geo2.x -= targetGeo.getCenterX() + targetGeo.width / 2;
                            geo2.y -= targetGeo.getCenterY();
                        }
                    }
                }
            }
        }
    }
	
    return geo2;
};

/**
 * Creates a drag source for the given element.
 */
Sidebar.prototype.createDragSource = function(elt, dropHandler, preview, cells, bounds)
{
    // Checks if the cells contain any vertices
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var freeSourceEdge = null;
    var firstVertex = null;
    var sidebar = this;
    for (var i = 0; i < cells.length; i++)
    {
        if (firstVertex == null && this.editorUi.editor.graph.model.isVertex(cells[i]))
        {
            firstVertex = i;
        }
        else if (freeSourceEdge == null && this.editorUi.editor.graph.model.isEdge(cells[i]) &&
				this.editorUi.editor.graph.model.getTerminal(cells[i], true) == null)
        {
            freeSourceEdge = i;
        }
		
        if (firstVertex != null && freeSourceEdge != null)
        {
            break;
        }
    }
	
    var dragSource = mxUtils.makeDraggable(elt, this.editorUi.editor.graph, mxUtils.bind(this, function(graph, evt, target, x, y)
    {
        if (this.updateThread != null)
        {
            window.clearTimeout(this.updateThread);
        }
		
        if (cells != null && currentStyleTarget != null && activeArrow == styleTarget)
        {
            var tmp = graph.isCellSelected(currentStyleTarget.cell) ? graph.getSelectionCells() : [currentStyleTarget.cell];
            var updatedCells = this.updateShapes((graph.model.isEdge(currentStyleTarget.cell)) ? cells[0] : cells[firstVertex], tmp);
            graph.setSelectionCells(updatedCells);
        }
        else if (cells != null && activeArrow != null && currentTargetState != null && activeArrow != styleTarget)
        {
            var index = (graph.model.isEdge(currentTargetState.cell) || freeSourceEdge == null) ? firstVertex : freeSourceEdge;
            graph.setSelectionCells(this.dropAndConnect(currentTargetState.cell, cells, direction, index, evt));
        }
        else
        {
            dropHandler.apply(this, arguments);
        }
		
        if (this.editorUi.hoverIcons != null)
        {
            this.editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
        }
    }), preview, 0, 0, graph.autoscroll, true, true);
	
    // Stops dragging if cancel is pressed
    graph.addListener(mxEvent.ESCAPE, function(sender, evt)
    {
        if (dragSource.isActive())
        {
            dragSource.reset();
        }
    });

    // Overrides mouseDown to ignore popup triggers
    var mouseDown = dragSource.mouseDown;
	
    dragSource.mouseDown = function(evt)
    {
        if (!mxEvent.isPopupTrigger(evt) && !mxEvent.isMultiTouchEvent(evt))
        {
            graph.stopEditing();
            mouseDown.apply(this, arguments);
        }
    };

    // Workaround for event redirection via image tag in quirks and IE8
    function createArrow(img, tooltip)
    {
        var arrow = null;
		
        if (mxClient.IS_IE && !mxClient.IS_SVG)
        {
            // Workaround for PNG images in IE6
            if (mxClient.IS_IE6 && document.compatMode != 'CSS1Compat')
            {
                arrow = document.createElement(mxClient.VML_PREFIX + ':image');
                arrow.setAttribute('src', img.src);
                arrow.style.borderStyle = 'none';
            }
            else
            {
                arrow = document.createElement('div');
                arrow.style.backgroundImage = 'url(' + img.src + ')';
                arrow.style.backgroundPosition = 'center';
                arrow.style.backgroundRepeat = 'no-repeat';
            }
			
            arrow.style.width = (img.width + 4) + 'px';
            arrow.style.height = (img.height + 4) + 'px';
            arrow.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
        }
        else
        {
            arrow = mxUtils.createImage(img.src);
            arrow.style.width = img.width + 'px';
            arrow.style.height = img.height + 'px';
        }
		
        if (tooltip != null)
        {
            arrow.setAttribute('title', tooltip);
        }
		
        // mxUtils.setOpacity(arrow, (img == this.refreshTarget) ? 30 : 20);
        // arrow.style.position = 'absolute';
        arrow.style.display = 'none';
        arrow.style.width = '0';
        arrow.style.height = '0';
        // arrow.style.cursor = 'crosshair';
		
        return arrow;
    }

    var currentTargetState = null;
    var currentStateHandle = null;
    var currentStyleTarget = null;
    var activeTarget = false;
	
    var arrowUp = createArrow(this.triangleUp, mxResources.get('connect'));
    var arrowRight = createArrow(this.triangleRight, mxResources.get('connect'));
    var arrowDown = createArrow(this.triangleDown, mxResources.get('connect'));
    var arrowLeft = createArrow(this.triangleLeft, mxResources.get('connect'));
    var styleTarget = createArrow(this.refreshTarget, mxResources.get('replace'));
    // Workaround for actual parentNode not being updated in old IE
    var styleTargetParent = null;
    var roundSource = createArrow(this.roundDrop);
    var roundTarget = createArrow(this.roundDrop);
    var direction = mxConstants.DIRECTION_NORTH;
    var activeArrow = null;
	
    function checkArrow(x, y, bounds, arrow)
    {
        if (arrow.parentNode != null)
        {
            if (mxUtils.contains(bounds, x, y))
            {
                mxUtils.setOpacity(arrow, 100);
                activeArrow = arrow;
            }
            else
            {
                mxUtils.setOpacity(arrow, (arrow == styleTarget) ? 30 : 20);
            }
        }
		
        return bounds;
    }
	
    // Hides guides and preview if target is active
    var dsCreatePreviewElement = dragSource.createPreviewElement;
	
    // Stores initial size of preview element
    dragSource.createPreviewElement = function(graph)
    {
        var elt = dsCreatePreviewElement.apply(this, arguments);
		
        // Pass-through events required to tooltip on replace shape
        if (mxClient.IS_SVG)
        {
            elt.style.pointerEvents = 'none';
        }
		
        this.previewElementWidth = elt.style.width;
        this.previewElementHeight = elt.style.height;
		
        return elt;
    };
	
    // Shows/hides hover icons
    var dragEnter = dragSource.dragEnter;
    dragSource.dragEnter = function(graph, evt)
    {
        if (ui.hoverIcons != null)
        {
            ui.hoverIcons.setDisplay('none');
        }
		
        dragEnter.apply(this, arguments);
    };
	
    var dragExit = dragSource.dragExit;
    dragSource.dragExit = function(graph, evt)
    {
        if (ui.hoverIcons != null)
        {
            ui.hoverIcons.setDisplay('');
        }
		
        dragExit.apply(this, arguments);
    };
	
    dragSource.dragOver = function(graph, evt)
    {
        mxDragSource.prototype.dragOver.apply(this, arguments);

        if (this.currentGuide != null && activeArrow != null)
        {
            this.currentGuide.hide();
        }

        if (this.previewElement != null)
        {
            var view = graph.view;
			
            if (currentStyleTarget != null && activeArrow == styleTarget)
            {
                this.previewElement.style.display = (graph.model.isEdge(currentStyleTarget.cell)) ? 'none' : '';
				
                this.previewElement.style.left = currentStyleTarget.x + 'px';
                this.previewElement.style.top = currentStyleTarget.y + 'px';
                this.previewElement.style.width = currentStyleTarget.width + 'px';
                this.previewElement.style.height = currentStyleTarget.height + 'px';
            }
            else if (currentTargetState != null && activeArrow != null)
            {
                var index = (graph.model.isEdge(currentTargetState.cell) || freeSourceEdge == null) ? firstVertex : freeSourceEdge;
                var geo = sidebar.getDropAndConnectGeometry(currentTargetState.cell, cells[index], direction, cells);
                var geo2 = (!graph.model.isEdge(currentTargetState.cell)) ? graph.getCellGeometry(currentTargetState.cell) : null;
                var geo3 = graph.getCellGeometry(cells[index]);
                var parent = graph.model.getParent(currentTargetState.cell);
                var dx = view.translate.x * view.scale;
                var dy = view.translate.y * view.scale;
				
                if (geo2 != null && !geo2.relative && graph.model.isVertex(parent) && parent != view.currentRoot)
                {
                    var pState = view.getState(parent);
					
                    dx = pState.x;
                    dy = pState.y;
                }
				
                var dx2 = geo3.x;
                var dy2 = geo3.y;

                // Ignores geometry of edges
                if (graph.model.isEdge(cells[index]))
                {
                    dx2 = 0;
                    dy2 = 0;
                }
				
                // Shows preview at drop location
                this.previewElement.style.left = ((geo.x - dx2) * view.scale + dx) + 'px';
                this.previewElement.style.top = ((geo.y - dy2) * view.scale + dy) + 'px';
				
                if (cells.length == 1)
                {
                    this.previewElement.style.width = (geo.width * view.scale) + 'px';
                    this.previewElement.style.height = (geo.height * view.scale) + 'px';
                }
				
                this.previewElement.style.display = '';
            }
            else if (dragSource.currentHighlight.state != null &&
				graph.model.isEdge(dragSource.currentHighlight.state.cell))
            {
                // Centers drop cells when splitting edges
                this.previewElement.style.left = Math.round(parseInt(this.previewElement.style.left) -
					bounds.width * view.scale / 2) + 'px';
                this.previewElement.style.top = Math.round(parseInt(this.previewElement.style.top) -
					bounds.height * view.scale / 2) + 'px';
            }
            else
            {
                this.previewElement.style.width = this.previewElementWidth;
                this.previewElement.style.height = this.previewElementHeight;
                this.previewElement.style.display = '';
            }
        }
    };
	
    var startTime = new Date().getTime();
    var timeOnTarget = 0;
    var prev = null;
	
    // Gets source cell style to compare shape below
    var sourceCellStyle = this.editorUi.editor.graph.getCellStyle(cells[0]);
	
    // Allows drop into cell only if target is a valid root
    dragSource.getDropTarget = mxUtils.bind(this, function(graph, x, y, evt)
    {
        // Alt means no targets at all
        // LATER: Show preview where result will go
        var cell = (!mxEvent.isAltDown(evt) && cells != null) ? graph.getCellAt(x, y) : null;
		
        // Uses connectable parent vertex if one exists
        if (cell != null && !this.graph.isCellConnectable(cell))
        {
            var parent = this.graph.getModel().getParent(cell);
			
            if (this.graph.getModel().isVertex(parent) && this.graph.isCellConnectable(parent))
            {
                cell = parent;
            }
        }
		
        // Ignores locked cells
        if (graph.isCellLocked(cell))
        {
            cell = null;
        }
		
        var state = graph.view.getState(cell);
        activeArrow = null;
        var bbox = null;

        // Time on target
        if (prev != state)
        {
            prev = state;
            startTime = new Date().getTime();
            timeOnTarget = 0;

            if (this.updateThread != null)
            {
                window.clearTimeout(this.updateThread);
            }
			
            if (state != null)
            {
                this.updateThread = window.setTimeout(function()
                {
                    if (activeArrow == null)
                    {
                        prev = state;
                        dragSource.getDropTarget(graph, x, y, evt);
                    }
                }, this.dropTargetDelay + 10);
            }
        }
        else
        {
            timeOnTarget = new Date().getTime() - startTime;
        }

        // Shift means disabled, delayed on cells with children, shows after this.dropTargetDelay, hides after 2500ms
        if (timeOnTarget < 2500 && state != null && !mxEvent.isShiftDown(evt) &&
			// If shape is equal or target has no stroke, fill and gradient then use longer delay except for images
			(((mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE) != mxUtils.getValue(sourceCellStyle, mxConstants.STYLE_SHAPE) &&
			(mxUtils.getValue(state.style, mxConstants.STYLE_STROKECOLOR, mxConstants.NONE) != mxConstants.NONE ||
			mxUtils.getValue(state.style, mxConstants.STYLE_FILLCOLOR, mxConstants.NONE) != mxConstants.NONE ||
			mxUtils.getValue(state.style, mxConstants.STYLE_GRADIENTCOLOR, mxConstants.NONE) != mxConstants.NONE)) ||
			mxUtils.getValue(sourceCellStyle, mxConstants.STYLE_SHAPE) == 'image') ||
			timeOnTarget > 1500 || graph.model.isEdge(state.cell)) && (timeOnTarget > this.dropTargetDelay) && 
			((graph.model.isVertex(state.cell) && firstVertex != null) ||
			(graph.model.isEdge(state.cell) && graph.model.isEdge(cells[0]))))
        {
            currentStyleTarget = state;
            var tmp = (graph.model.isEdge(state.cell)) ? graph.view.getPoint(state) :
                new mxPoint(state.getCenterX(), state.getCenterY());
            tmp = new mxRectangle(tmp.x - this.refreshTarget.width / 2, tmp.y - this.refreshTarget.height / 2,
                this.refreshTarget.width, this.refreshTarget.height);
			
            styleTarget.style.left = Math.floor(tmp.x) + 'px';
            styleTarget.style.top = Math.floor(tmp.y) + 'px';
			
            if (styleTargetParent == null)
            {
                graph.container.appendChild(styleTarget);
                styleTargetParent = styleTarget.parentNode;
            }
			
            checkArrow(x, y, tmp, styleTarget);
        }
        // Does not reset on ignored edges
        else if (currentStyleTarget == null || !mxUtils.contains(currentStyleTarget, x, y) ||
			(timeOnTarget > 1500 && !mxEvent.isShiftDown(evt)))
        {
            currentStyleTarget = null;
			
            if (styleTargetParent != null)
            {
                styleTarget.parentNode.removeChild(styleTarget);
                styleTargetParent = null;
            }
        }
        else if (currentStyleTarget != null && styleTargetParent != null)
        {
            // Sets active Arrow as side effect
            var tmp = (graph.model.isEdge(currentStyleTarget.cell)) ? graph.view.getPoint(currentStyleTarget) : new mxPoint(currentStyleTarget.getCenterX(), currentStyleTarget.getCenterY());
            tmp = new mxRectangle(tmp.x - this.refreshTarget.width / 2, tmp.y - this.refreshTarget.height / 2,
                this.refreshTarget.width, this.refreshTarget.height);
            checkArrow(x, y, tmp, styleTarget);
        }
		
        // Checks if inside bounds
        if (activeTarget && currentTargetState != null && !mxEvent.isAltDown(evt) && activeArrow == null)
        {
            // LATER: Use hit-detection for edges
            bbox = mxRectangle.fromRectangle(currentTargetState);
			
            if (graph.model.isEdge(currentTargetState.cell))
            {
                var pts = currentTargetState.absolutePoints;
				
                if (roundSource.parentNode != null)
                {
                    var p0 = pts[0];
                    bbox.add(checkArrow(x, y, new mxRectangle(p0.x - this.roundDrop.width / 2,
                        p0.y - this.roundDrop.height / 2, this.roundDrop.width, this.roundDrop.height), roundSource));
                }
				
                if (roundTarget.parentNode != null)
                {
                    var pe = pts[pts.length - 1];
                    bbox.add(checkArrow(x, y, new mxRectangle(pe.x - this.roundDrop.width / 2,
                        pe.y - this.roundDrop.height / 2,
                        this.roundDrop.width, this.roundDrop.height), roundTarget));
                }
            }
            else
            {
                var bds = mxRectangle.fromRectangle(currentTargetState);
				
                // Uses outer bounding box to take rotation into account
                if (currentTargetState.shape != null && currentTargetState.shape.boundingBox != null)
                {
                    bds = mxRectangle.fromRectangle(currentTargetState.shape.boundingBox);
                }

                bds.grow(this.graph.tolerance);
                bds.grow(HoverIcons.prototype.arrowSpacing);
				
                var handler = this.graph.selectionCellsHandler.getHandler(currentTargetState.cell);
				
                if (handler != null)
                {
                    bds.x -= handler.horizontalOffset / 2;
                    bds.y -= handler.verticalOffset / 2;
                    bds.width += handler.horizontalOffset;
                    bds.height += handler.verticalOffset;
					
                    // Adds bounding box of rotation handle to avoid overlap
                    if (handler.rotationShape != null && handler.rotationShape.node != null &&
						handler.rotationShape.node.style.visibility != 'hidden' &&
						handler.rotationShape.node.style.display != 'none' &&
						handler.rotationShape.boundingBox != null)
                    {
                        bds.add(handler.rotationShape.boundingBox);
                    }
                }
				
                // bbox.add(checkArrow(x, y, new mxRectangle(currentTargetState.getCenterX() - this.triangleUp.width / 2,
                // 	bds.y - this.triangleUp.height, this.triangleUp.width, this.triangleUp.height), arrowUp));
                // bbox.add(checkArrow(x, y, new mxRectangle(bds.x + bds.width,
                // 	currentTargetState.getCenterY() - this.triangleRight.height / 2,
                // 	this.triangleRight.width, this.triangleRight.height), arrowRight));
                // bbox.add(checkArrow(x, y, new mxRectangle(currentTargetState.getCenterX() - this.triangleDown.width / 2,
                // 		bds.y + bds.height, this.triangleDown.width, this.triangleDown.height), arrowDown));
                // bbox.add(checkArrow(x, y, new mxRectangle(bds.x - this.triangleLeft.width,
                // 		currentTargetState.getCenterY() - this.triangleLeft.height / 2,
                // 		this.triangleLeft.width, this.triangleLeft.height), arrowLeft));
            }
			
            // Adds tolerance
            if (bbox != null)
            {
                bbox.grow(10);
            }
        }
		
        direction = mxConstants.DIRECTION_NORTH;
		
        if (activeArrow == arrowRight)
        {
            direction = mxConstants.DIRECTION_EAST;
        }
        else if (activeArrow == arrowDown || activeArrow == roundTarget)
        {
            direction = mxConstants.DIRECTION_SOUTH;
        }
        else if (activeArrow == arrowLeft)
        {
            direction = mxConstants.DIRECTION_WEST;
        }
		
        if (currentStyleTarget != null && activeArrow == styleTarget)
        {
            state = currentStyleTarget;
        }

        var validTarget = (firstVertex == null || graph.isCellConnectable(cells[firstVertex])) &&
			((graph.model.isEdge(cell) && firstVertex != null) ||
			(graph.model.isVertex(cell) && graph.isCellConnectable(cell)));
		
        // Drop arrows shown after this.dropTargetDelay, hidden after 5 secs, switches arrows after 500ms
        if ((currentTargetState != null && timeOnTarget >= 5000) ||
			(currentTargetState != state &&
			(bbox == null || !mxUtils.contains(bbox, x, y) ||
			(timeOnTarget > 500 && activeArrow == null && validTarget))))
        {
            activeTarget = false;
            currentTargetState = ((timeOnTarget < 5000 && timeOnTarget > this.dropTargetDelay) || graph.model.isEdge(cell)) ? state : null;

            if (currentTargetState != null && validTarget)
            {
                var elts = [roundSource, roundTarget, arrowUp, arrowRight, arrowDown, arrowLeft];
				
                for (var i = 0; i < elts.length; i++)
                {
                    if (elts[i].parentNode != null)
                    {
                        elts[i].parentNode.removeChild(elts[i]);
                    }
                }
				
                if (graph.model.isEdge(cell))
                {
                    var pts = state.absolutePoints;
					
                    if (pts != null)
                    {
                        var p0 = pts[0];
                        var pe = pts[pts.length - 1];
                        var tol = graph.tolerance;
                        var box = new mxRectangle(x - tol, y - tol, 2 * tol, 2 * tol);
						
                        roundSource.style.left = Math.floor(p0.x - this.roundDrop.width / 2) + 'px';
                        roundSource.style.top = Math.floor(p0.y - this.roundDrop.height / 2) + 'px';
						
                        roundTarget.style.left = Math.floor(pe.x - this.roundDrop.width / 2) + 'px';
                        roundTarget.style.top = Math.floor(pe.y - this.roundDrop.height / 2) + 'px';
						
                        if (graph.model.getTerminal(cell, true) == null)
                        {
                            graph.container.appendChild(roundSource);
                        }
						
                        if (graph.model.getTerminal(cell, false) == null)
                        {
                            graph.container.appendChild(roundTarget);
                        }
                    }
                }
                else
                {
                    var bds = mxRectangle.fromRectangle(state);
					
                    // Uses outer bounding box to take rotation into account
                    if (state.shape != null && state.shape.boundingBox != null)
                    {
                        bds = mxRectangle.fromRectangle(state.shape.boundingBox);
                    }

                    bds.grow(this.graph.tolerance);
                    bds.grow(HoverIcons.prototype.arrowSpacing);
					
                    var handler = this.graph.selectionCellsHandler.getHandler(state.cell);
					
                    if (handler != null)
                    {
                        bds.x -= handler.horizontalOffset / 2;
                        bds.y -= handler.verticalOffset / 2;
                        bds.width += handler.horizontalOffset;
                        bds.height += handler.verticalOffset;
						
                        // Adds bounding box of rotation handle to avoid overlap
                        if (handler.rotationShape != null && handler.rotationShape.node != null &&
							handler.rotationShape.node.style.visibility != 'hidden' &&
							handler.rotationShape.node.style.display != 'none' &&
							handler.rotationShape.boundingBox != null)
                        {
                            bds.add(handler.rotationShape.boundingBox);
                        }
                    }
					
                    arrowUp.style.left = Math.floor(state.getCenterX() - this.triangleUp.width / 2) + 'px';
                    arrowUp.style.top = Math.floor(bds.y - this.triangleUp.height) + 'px';
					
                    arrowRight.style.left = Math.floor(bds.x + bds.width) + 'px';
                    arrowRight.style.top = Math.floor(state.getCenterY() - this.triangleRight.height / 2) + 'px';
					
                    arrowDown.style.left = arrowUp.style.left
                    arrowDown.style.top = Math.floor(bds.y + bds.height) + 'px';
					
                    arrowLeft.style.left = Math.floor(bds.x - this.triangleLeft.width) + 'px';
                    arrowLeft.style.top = arrowRight.style.top;
					
                    if (state.style['portConstraint'] != 'eastwest')
                    {
                        graph.container.appendChild(arrowUp);
                        graph.container.appendChild(arrowDown);
                    }

                    graph.container.appendChild(arrowRight);
                    graph.container.appendChild(arrowLeft);
                }
				
                // Hides handle for cell under mouse
                if (state != null)
                {
                    currentStateHandle = graph.selectionCellsHandler.getHandler(state.cell);
					
                    if (currentStateHandle != null && currentStateHandle.setHandlesVisible != null)
                    {
                        currentStateHandle.setHandlesVisible(false);
                    }
                }
				
                activeTarget = true;
            }
            else
            {
                var elts = [roundSource, roundTarget, arrowUp, arrowRight, arrowDown, arrowLeft];
				
                for (var i = 0; i < elts.length; i++)
                {
                    if (elts[i].parentNode != null)
                    {
                        elts[i].parentNode.removeChild(elts[i]);
                    }
                }
            }
        }

        if (!activeTarget && currentStateHandle != null)
        {
            currentStateHandle.setHandlesVisible(true);
        }
		
        // Handles drop target
        var target = ((!mxEvent.isAltDown(evt) || mxEvent.isShiftDown(evt)) &&
			!(currentStyleTarget != null && activeArrow == styleTarget)) ?
            mxDragSource.prototype.getDropTarget.apply(this, arguments) : null;
        var model = graph.getModel();
		
        if (target != null)
        {
            if (activeArrow != null || !graph.isSplitTarget(target, cells, evt))
            {
                // Selects parent group as drop target
                while (target != null && !graph.isValidDropTarget(target, cells, evt) && model.isVertex(model.getParent(target)))
                {
                    target = model.getParent(target);
                }
				
                if (graph.view.currentRoot == target || (!graph.isValidRoot(target) &&
					graph.getModel().getChildCount(target) == 0) ||
					graph.isCellLocked(target) || model.isEdge(target))
                {
                    target = null;
                }
            }
        }
		
        return target;
    });
	
    dragSource.stopDrag = function()
    {
        mxDragSource.prototype.stopDrag.apply(this, arguments);
		
        var elts = [roundSource, roundTarget, styleTarget, arrowUp, arrowRight, arrowDown, arrowLeft];
		
        for (var i = 0; i < elts.length; i++)
        {
            if (elts[i].parentNode != null)
            {
                elts[i].parentNode.removeChild(elts[i]);
            }
        }
		
        if (currentTargetState != null && currentStateHandle != null)
        {
            currentStateHandle.reset();
        }
		
        currentStateHandle = null;
        currentTargetState = null;
        currentStyleTarget = null;
        styleTargetParent = null;
        activeArrow = null;
    };
	
    return dragSource;
};

/**
 * Adds a handler for inserting the cell with a single click.
 */
Sidebar.prototype.itemClicked = function(cells, ds, evt, elt)
{
    var graph = this.editorUi.editor.graph;
    graph.container.focus();
	
    // Alt+Click inserts and connects
    if (mxEvent.isAltDown(evt))
    {
        if (graph.getSelectionCount() == 1 && graph.model.isVertex(graph.getSelectionCell()))
        {
            var firstVertex = null;
			
            for (var i = 0; i < cells.length && firstVertex == null; i++)
            {
                if (graph.model.isVertex(cells[i]))
                {
                    firstVertex = i;
                }
            }
			
            if (firstVertex != null)
            {
                graph.setSelectionCells(this.dropAndConnect(graph.getSelectionCell(), cells, (mxEvent.isMetaDown(evt) || mxEvent.isControlDown(evt)) ?
                    (mxEvent.isShiftDown(evt) ? mxConstants.DIRECTION_WEST : mxConstants.DIRECTION_NORTH) : 
                    (mxEvent.isShiftDown(evt) ? mxConstants.DIRECTION_EAST : mxConstants.DIRECTION_SOUTH),
                firstVertex, evt));
                graph.scrollCellToVisible(graph.getSelectionCell());
            }
        }
    }
    // Shift+Click updates shape
    else if (mxEvent.isShiftDown(evt) && !graph.isSelectionEmpty())
    {
        this.updateShapes(cells[0], graph.getSelectionCells());
        graph.scrollCellToVisible(graph.getSelectionCell());
    }
    else
    {
        var pt = graph.getFreeInsertPoint();
        ds.drop(graph, evt, null, pt.x, pt.y, true);
		
        if (this.editorUi.hoverIcons != null && (mxEvent.isTouchEvent(evt) || mxEvent.isPenEvent(evt)))
        {
            this.editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
        }
    }
};

/**
 * Adds a handler for inserting the cell with a single click.
 */
Sidebar.prototype.addClickHandler = function(elt, ds, cells)
{
    var graph = this.editorUi.editor.graph;
    var oldMouseDown = ds.mouseDown;
    var oldMouseMove = ds.mouseMove;
    var oldMouseUp = ds.mouseUp;
    var tol = graph.tolerance;
    var first = null;
    var that = this;
	
    ds.mouseDown = function(evt)
    {
        oldMouseDown.apply(this, arguments);
        first = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
		
        if (this.dragElement != null)
        {
            this.dragElement.style.display = 'none';
            mxUtils.setOpacity(elt, 50);
        }
    };
	
    ds.mouseMove = function(evt)
    {
        if (this.dragElement != null && this.dragElement.style.display == 'none' &&
			first != null && (Math.abs(first.x - mxEvent.getClientX(evt)) > tol ||
			Math.abs(first.y - mxEvent.getClientY(evt)) > tol))
        {
            this.dragElement.style.display = '';
            mxUtils.setOpacity(elt, 100);
        }
		
        oldMouseMove.apply(this, arguments);
    };
	
    ds.mouseUp = function(evt)
    {
        if (!mxEvent.isPopupTrigger(evt) && this.currentGraph == null &&
			this.dragElement != null && this.dragElement.style.display == 'none')
        {
            that.itemClicked(cells, ds, evt, elt);
        }

        oldMouseUp.apply(ds, arguments);
        mxUtils.setOpacity(elt, 100);
        first = null;
		
        // Blocks tooltips on this element after single click
        that.currentElt = elt;
    };
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplateEntry = function(style, width, height, value, title, showLabel, showTitle, tags, type, imageurl)
{
    tags = (tags != null && tags.length > 0) ? tags : title.toLowerCase();
	
    return this.addEntry(tags, mxUtils.bind(this, function()
 	{
        return this.createVertexTemplate(style, width, height, value, title, showLabel, showTitle, '', type, imageurl);
 	}));
}

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplate = function (style, width, height, value, title, showLabel, showTitle, allowCellsInserted, type, imageurl)
{
    var cells = [new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style)];
    cells[0].vertex = true;
    return this.createVertexTemplateFromCells(cells, width, height, title, showLabel, showTitle, allowCellsInserted, type, imageurl);
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplateFromData = function(data, width, height, title, showLabel, showTitle, allowCellsInserted)
{
    var doc = mxUtils.parseXml(this.graph.decompress(data));
    var codec = new mxCodec(doc);

    var model = new mxGraphModel();
    codec.decode(doc.documentElement, model);
	
    var cells = this.graph.cloneCells(model.root.getChildAt(0).children);

    return this.createVertexTemplateFromCells(cells, width, height, title, showLabel, showTitle, allowCellsInserted);
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplateFromCells = function(cells, width, height, title, showLabel, showTitle, allowCellsInserted,type, imageurl)
{
    // Use this line to convert calls to this function with lots of boilerplate code for creating cells
    return this.createItem(cells, title, showLabel, showTitle, width, height, allowCellsInserted, type, imageurl);
};

/**
 * 
 */
Sidebar.prototype.createEdgeTemplateEntry = function(style, width, height, value, title, showLabel, tags, allowCellsInserted)
{
    tags = (tags != null && tags.length > 0) ? tags : title.toLowerCase();
 	return this.addEntry(tags, mxUtils.bind(this, function()
 	{
 		return this.createEdgeTemplate(style, width, height, value, title, showLabel, allowCellsInserted);
 	}));
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createEdgeTemplate = function(style, width, height, value, title, showLabel, allowCellsInserted)
{
    var cell = new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style);
    cell.geometry.setTerminalPoint(new mxPoint(0, height), true);
    cell.geometry.setTerminalPoint(new mxPoint(width, 0), false);
    cell.geometry.relative = true;
    cell.edge = true;
    return this.createEdgeTemplateFromCells([cell], width, height, title, showLabel, allowCellsInserted);
};

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createEdgeTemplateFromCells = function(cells, width, height, title, showLabel, allowCellsInserted)
{	
    return this.createItem(cells, title, showLabel, true, width, height, allowCellsInserted);
};

/**
 * Adds the given palette.
 */
Sidebar.prototype.addPaletteFunctions = function(id, title, expanded, fns)
{
    this.addPalette(id, title, expanded, mxUtils.bind(this, function(content)
    {
        if (fns.length) {
            for (var i = 0; i < fns.length; i++) {
                content.appendChild(fns[i](content));
            }
        } else {
            content.innerHTML = '<span style="display:block;min-height:30px;width:100%;text-align:center;font-size:12px;line-height:30px;color:#acacac">暂无数据</span>'
        }
        
    }));
};

/**
 * Adds the given palette.
 */
Sidebar.prototype.addPalette = function(id, title, expanded, onInit)
{
    var elt = this.createTitle(title, id);
    // this.container.appendChild(elt);
    this.containerbottom.appendChild(elt);
    var div = document.createElement('div');
    div.className = 'geSidebar';
	
    // Disables built-in pan and zoom in IE10 and later
    if (mxClient.IS_POINTER)
    {
        div.style.touchAction = 'none';
    }

    if (expanded)
    {
        onInit(div);
        onInit = null;
    }
    else
    {
        div.style.display = 'none';
    }
	
    this.addFoldingHandler(elt, div, onInit);
	
    var outer = document.createElement('div');
    // this.container.appendChild(div);
    this.containerbottom.appendChild(div);
    
    // Keeps references to the DOM nodes
    if (id != null)
    {
    		this.palettes[id] = [elt, outer];
        // div.className += ' ' + id
        div.id = id;
    }
    return div;
};


/**
 * 快捷方式
 */
/* Sidebar.prototype.addPaletteCus = function (onInit) {
    var div = document.createElement('div');
    div.className = 'geSidebar';

    // Disables built-in pan and zoom in IE10 and later
    if (mxClient.IS_POINTER) {
        div.style.touchAction = 'none';
    }
    onInit(div);
    document.querySelector('.rightbarShortcut').appendChild(div);
    return div;
} */

/**
 * Create the given title element.
 */
Sidebar.prototype.addFoldingHandler = function(title, content, funct)
{
    var initialized = false;

    // Avoids mixed content warning in IE6-8
    if (!mxClient.IS_IE || document.documentMode >= 8)
    {
        title.style.backgroundImage = (content.style.display == 'none') ?
            'url(\'' + this.collapsedImage + '\')' : 'url(\'' + this.expandedImage + '\')';
    }
	
    title.style.backgroundRepeat = 'no-repeat';
    title.style.backgroundPosition = '3px 50%';
    title.style.backgroundSize = '16px 16px';

    mxEvent.addListener(title, 'click', mxUtils.bind(this, function(evt)
    {
        if (content.style.display == 'none')
        {
            if (!initialized)
            {
                initialized = true;
				
                if (funct != null)
                {
                    // Wait cursor does not show up on Mac
                    title.style.cursor = 'wait';
                    var prev = title.innerHTML;
                    title.innerHTML = mxResources.get('loading') + '...';
					
                    window.setTimeout(function()
                    {
                        var fo = mxClient.NO_FO;
                        mxClient.NO_FO = Editor.prototype.originalNoForeignObject;
                        funct(content);
                        mxClient.NO_FO = fo;
                        content.style.display = 'flex';
                        title.style.cursor = '';
                        title.innerHTML = prev;
                    }, 0);
                }
                else
                {
                    content.style.display = 'flex';
                }
            }
            else
            {
                content.style.display = 'flex';
            }
			
            title.style.backgroundImage = 'url(\'' + this.expandedImage + '\')';
        }
        else
        {
            title.style.backgroundImage = 'url(\'' + this.collapsedImage + '\')';
            content.style.display = 'none';
        }
		
        mxEvent.consume(evt);
    }));
};

/**
 * Removes the palette for the given ID.
 */
Sidebar.prototype.removePalette = function(id)
{
    var elts = this.palettes[id];
	
    if (elts != null)
    {
        this.palettes[id] = null;
		
        for (var i = 0; i < elts.length; i++)
        {
            this.container.removeChild(elts[i]);
        }
		
        return true;
    }
	
    return false;
};

/**
 * Creates the array of tags for the given stencil. Duplicates are allowed and will be filtered out later.
 */
Sidebar.prototype.getTagsForStencil = function(packageName, stencilName, moreTags)
{
    var tags = packageName.split('.');
	
    for (var i = 1; i < tags.length; i++)
    {
        tags[i] = tags[i].replace(/_/g, ' ')
    }
	
    tags.push(stencilName.replace(/_/g, ' '));
	
    if (moreTags != null)
    {
        tags.push(moreTags);
    }
	
    return tags.slice(1, tags.length);
};

/**
 * Adds the given stencil palette.
 */
Sidebar.prototype.destroy = function()
{
    if (this.graph != null)
    {
        if (this.graph.container != null && this.graph.container.parentNode != null)
        {
            this.graph.container.parentNode.removeChild(this.graph.container);
        }
		
        this.graph.destroy();
        this.graph = null;
    }
	
    if (this.pointerUpHandler != null)
    {
        mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointerup' : 'mouseup', this.pointerUpHandler);
        this.pointerUpHandler = null;
    }

    if (this.pointerDownHandler != null)
    {
        mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', this.pointerDownHandler);
        this.pointerDownHandler = null;
    }
	
    if (this.pointerMoveHandler != null)
    {
        mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', this.pointerMoveHandler);
        this.pointerMoveHandler = null;
    }
	
    if (this.pointerOutHandler != null)
    {
        mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointerout' : 'mouseout', this.pointerOutHandler);
        this.pointerOutHandler = null;
    }
};
window.Sidebar = Sidebar
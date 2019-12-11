/* eslint-disable */
/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs the actions object for the given UI.
 */
import {
    addPageDialog,
    PreviewDialog
} from '../editor/Dialogs'
import {mxUtils, mxResources}  from '../mxGlobal'
import router from '../../router'
function Actions(editorUi)
{
    this.editorUi = editorUi;
    this.actions = new Object();
    this.init();
}
function removeImageRadio() {
    if (document.querySelector('.mxPopupMenu')) {
        document.querySelector('.mxPopupMenu').remove()
    }
}
/**
 * Adds the default actions.
 */
Actions.prototype.init = function()
{
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var isGraphEnabled = function()
    {
        return Action.prototype.isEnabled.apply(this, arguments) && graph.isEnabled();
    };
    // loading···
    this.addAction('loading', function(text = mxResources.get('loading')) {
        var content = ui.createDiv('geDialogInfo')
        var loadingText = document.createElement('p');
        loadingText.id = "loadingText";
        loadingText.innerText = text;
        content.appendChild(loadingText);
        // 加载条
        var loadingBar = document.createElement('p');
        loadingBar.className = "geLoadingBar"
        var loadingBarInner = document.createElement('p');
        loadingBarInner.className = "geLoadingBarInner";
        loadingBar.appendChild(loadingBarInner)
        var len = 0, timer = null;
        timer = setInterval(() => {
            len = parseFloat(loadingBarInner.style.width);
            if ( len >= 80 && len < 99) {
                len += 0.3;
                loadingBarInner.style.width = len + '%';
            } else if ( len >= 100 ) {
                clearInterval(timer);
                ui.hideDialog();
            } else if (len < 80) {
                len += 4;
                loadingBarInner.style.width = len + '%';
            }
        }, 700)
        content.appendChild(loadingBar);
        ui.showDialog(content, 410, 80, true, false, null, null, '');
        return loadingBarInner;
    })
    // 是否展示左侧菜单
    function toggleSidebar() {
        if (ui.sidebarContainer.style.display == 'none' && (graph.isPaletteEnabled() || graph.isPageManageEnabled())) {
            ui.toggleSidebarPanel(false);
        }
        if (!graph.isPaletteEnabled() && !graph.isPageManageEnabled()) {
            ui.toggleSidebarPanel(true);
        } else {
            ui.toggleSidebarPanel(false);
        }
    }
    // 是否展示右侧菜单
    function toggleRightSide() {
        if (!graph.isPaletteManageEnabled() && !graph.isFormatManageEnabled()) {
            ui.toggleRightPanel(true);
        } else if (ui.rightBarContainer.style.display == 'none') {
            ui.toggleRightPanel(false);
        }
    }
    // 菜单操作
    var field = null;
    // 控件栏
    field = this.addAction('palette', function() {
        $("#general").toggle();
        $("#generalTitle").toggle();
        graph.setPaletteEnabled(!graph.isPaletteEnabled());
        toggleSidebar();
    }, true)		
    // 设置是否显示状态切换
    field.setToggleAction(true);
    field.setSelectedCallback(function() { return graph.isPaletteEnabled(); });

    // 页面列表栏
    field = this.addAction('pageList', function() {
        $("#pageManage").toggle();
        $("#pageManageTitle").toggle();
        graph.setPageManageEnabled(!graph.isPageManageEnabled());
        toggleSidebar();
    }, true)
    field.setToggleAction(true);
    field.setSelectedCallback(function() { return graph.isPageManageEnabled(); });
	
    // 控件管理栏
    field = this.addAction('paletteManage', function() {
        $(".gePaletteManageContainer").toggle();
        graph.setPaletteManageEnabled(!graph.isPaletteManageEnabled());
        toggleRightSide();
    }, true)
    field.setToggleAction(true);
    field.setSelectedCallback(function() { return graph.isPaletteManageEnabled(); });

    // 交互样式
    field = this.addAction('formatManage', function() {
        $(".geFormatContainer").toggle();
        graph.setFormatManageEnabled(!graph.isFormatManageEnabled());
        toggleRightSide();
    }, true)
    field.setToggleAction(true);
    field.setSelectedCallback(function() { return graph.isFormatManageEnabled(); });
	
    // 工具栏
    field = this.addAction('toolbar', function() {
        graph.setToolbarEnabled(!graph.isToolbarEnabled());
        ui.toggleToolbarPanel(!graph.isToolbarEnabled())
    }, true)
    field.setToggleAction(true);
    field.setSelectedCallback(function() { return graph.isToolbarEnabled(); });
	
    field = null;
    // 全屏
    /* this.addAction('fullScreen', function() {
        mxUtils.fullScreen()
    }) */
    // 菜单部分排版操作
    // 文本左对齐
    this.addAction('leftalign', function() {
        ui.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_LEFT])()
    }, false)
    // 文本居中对齐
    this.addAction('centeralign', function() {
        ui.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_CENTER])()
    }, false)
    // 文本右对齐
    this.addAction('rightalign', function() {
        ui.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_RIGHT])()
    }, false)
    // 控件向左对齐
    this.addAction('left', function () {
        graph.alignCells(mxConstants.ALIGN_LEFT)
    }, false)
     // 控件向右对齐
    this.addAction('right', function () {
        graph.alignCells(mxConstants.ALIGN_RIGHT)
    }, false)
    // 控件向上对齐
    this.addAction('top', function() {
        graph.alignCells(mxConstants.ALIGN_TOP)
    }, false)
    // 控件向下对齐
    this.addAction('bottom', function() {
        graph.alignCells(mxConstants.ALIGN_BOTTOM)
    }, false)
    // 控件垂直居中对齐
    this.addAction('verticalcenter', function() {
        graph.alignCells(mxConstants.ALIGN_CENTER)
    }, false)
    // 控件水平居中对齐
    this.addAction('horizontalcenter', function() {
        graph.alignCells(mxConstants.ALIGN_MIDDLE)
    }, false)
    // 控件垂直等距分布
    this.addAction('verticalalign', function() {
        graph.distributeCells(false);
    }, false)
    // 控件水平等距分布
    this.addAction('horizontalalign', function() {
        graph.distributeCells(true);
    }, false)

    // 水平翻转
    this.addAction('flipH', function() {
        graph.toggleCellStyles(mxConstants.STYLE_FLIPH, false);
    }, false)
    // 垂直翻转
    this.addAction('flipV', function() {
        graph.toggleCellStyles(mxConstants.STYLE_FLIPV, false);
    }, false)
    // 链接报表
    this.addAction('linkReport', function() {
        var dlg = new LinkReportDialog(ui, '')
        ui.showDialog(dlg.container, 410, 200, true, false, null, null, '链接');
    }, true)
    // 预览
    this.addAction('previewapply', function (){
        let dlg = new PreviewDialog(ui,function(){
            let page = router.resolve({
                path: "/interface/interface_preview",
                query: {
                    id: sessionStorage.getItem('applyId')
                }
            })
            window.open(page.href,'_blank')
        })
        ui.showDialog(dlg.container, 410, 160, true, false, null, null, mxResources.get('preview'))
    }, true, null, Editor.ctrlKey + '+Shift+P');
   
     // 文件操作
    this.addAction('new', function() { ui.actions.get('addPage').funct() });
    this.addAction('open', function()
    {
        window.openNew = true;
        window.openKey = 'open';		
        ui.openFile();
    });

    // 增加页面
    this.addAction('addPage', function(type) {
        type = type || 'add';
        var dlg = new addPageDialog(ui, type)
        ui.showDialog(dlg.container, 400, 270, true, false, null, null, type == 'rename' ? '编辑页面' : '新建页面');
    })
    /**
     * 获取节点坐标信息
     * @param {mxCell} mxCell 
     */
    const getGeo = mxCell => {
        const geo = graph.getCellGeometry(mxCell);
        return geo.clone();
    };
    /**
	 * 插入菜单
	 * @param {string} type 往前插入菜单：'before'，往后插入菜单：'after'
	 */
    function insertMenu(type) {
        var cell = graph.getSelectionCell();
        var cellW = cell.geometry.width;
        let cellH = cell.geometry.height;
        var menuCell = cell.parent;
        if (menuCell.children.length >= 10) {
            mxUtils.alert('最多10个菜单');
        }
        const model = graph.getModel();
        const moveX = (item, cellW) => {
            const geo = getGeo(item);
            geo.x += cellW;
            model.setGeometry(item, geo);
        };
        model.beginUpdate();
        try {
            let x = cell.geometry.x;
            let items = menuCell.children;
            let len = items.length;
            if (type === 'before') {
                for (var i = 0; i < len; i++) {
                    if (items[i].geometry.x >= x) {
                        moveX(items[i], cellW);
                    }
                }
            } else {
                for (var i = 0; i < len; i++) {
                    if (items[i].geometry.x > x) {
                        moveX(items[i], cellW);
                    }
                }
                x += cellW;
            }
            const symbol = new mxCell('菜单', new mxGeometry(x, 0, cellW, cellH), 'shape=menuCell;html=1;whiteSpace=wrap;strokeColor=#000;');
            symbol.setVertex(true);
            // 设置id
            symbol.setId(model.createId(symbol));
            model.add(menuCell, symbol);
            const menuCellGeo = getGeo(menuCell);
            menuCellGeo.width += cellW;
            model.setGeometry(menuCell, menuCellGeo);
        } finally {
            model.endUpdate();
        }
    }

    // 往前插入菜单
    this.addAction('insertMenuBefore', function() {
        insertMenu('before');
    })
    // 往后插入菜单
    this.addAction('insertMenuAfter', function() {
        insertMenu('after');
    })
    	
    // 向上插入一行
    this.addAction('addUpRow', () => {
        this.insertTableCell('up');
    })
    // 向下插入一行
    this.addAction('addLowerRow', () => {
        this.insertTableCell('lower');
    })
    // 删除行
    this.addAction('deleteRow', () => {
        this.deleteTableCell('row');
    })
    // 向左插入一列
    this.addAction('addLeftCol', () => {
        this.insertTableCell('left');
    })
    // 向右插入一列
    this.addAction('addRightCol', () => {
        this.insertTableCell('right');
    })
    // 删除列
    this.addAction('deleteCol', () => {
        this.deleteTableCell('col');
    })
    this.addAction('import...', () =>
    {
        window.openNew = false;
        window.openKey = 'import';
		
        // Closes dialog after open
        window.openFile = new OpenFile(mxUtils.bind(this, function()
        {
            ui.hideDialog();
        }));
		
        window.openFile.setConsumer(mxUtils.bind(this, function(xml, filename)
        {
            try
            {
                var doc = mxUtils.parseXml(xml);
                editor.graph.setSelectionCells(editor.graph.importGraphModel(doc.documentElement));
            }
            catch (e)
            {
                mxUtils.alert(mxResources.get('invalidOrMissingFile') + ': ' + e.message);
            }
        }));

        // Removes openFile if dialog is closed
        ui.showDialog(new OpenDialog(this).container, 320, 220, true, true, function()
        {
            window.openFile = null;
        });
    }).isEnabled = isGraphEnabled;

    this.addAction('save', function() { ui.saveFile(true); }, null, null, Editor.ctrlKey + '+S').isEnabled = isGraphEnabled;
    this.addAction('saveAs...', function() { ui.saveFile(true); }, null, null, Editor.ctrlKey + '+Shift+S').isEnabled = isGraphEnabled;
    this.addAction('editDiagram...', function()
    {
        var dlg = new EditDiagramDialog(ui);
        ui.showDialog(dlg.container, 620, 420, true, false, null, null, '编辑图表');
        dlg.init();
    });
    this.addAction('pageSetup...', function() { ui.showDialog(new PageSetupDialog(ui).container, 340, 200, true, false, null, null, '页面设置'); }).isEnabled = isGraphEnabled;
    this.addAction('print...', function() { ui.showDialog(new PrintDialog(ui).container, 300, 180, true, true); }, null, 'sprite-print', Editor.ctrlKey + '+P');
    this.addAction('preview', function() { mxUtils.show(graph, null, 10, 10); });
    // 编辑操作
    this.addAction('undo', function() { ui.undo(); }, null, 'sprite-undo', Editor.ctrlKey + '+Z');
    this.addAction('redo', function() { ui.redo(); }, null, 'sprite-redo', (!mxClient.IS_WIN) ? Editor.ctrlKey + '+Shift+Z' : Editor.ctrlKey + '+Y');
    this.addAction('cut', function() { 
        mxClipboard.cut(graph);
        removeImageRadio();
    }, null, 'sprite-cut', Editor.ctrlKey + '+X');
    this.addAction('copy', function() {
        mxClipboard.copy(graph);
        removeImageRadio();
    }, null, 'sprite-copy', Editor.ctrlKey + '+C');
    this.addAction('paste', function()
    {
        if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
        {
            mxClipboard.paste(graph);
        }
    }, null, 'sprite-paste', Editor.ctrlKey + '+V');
    this.addAction('pasteHere', function(evt)
    {
        if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
        {
            graph.getModel().beginUpdate();
            try
            {
                var cells = mxClipboard.paste(graph);
				
                if (cells != null)
                {
                    var includeEdges = true;
					
                    for (var i = 0; i < cells.length && includeEdges; i++)
                    {
                        includeEdges = includeEdges && graph.model.isEdge(cells[i]);
                    }

                    var t = graph.view.translate;
                    var s = graph.view.scale;
                    var dx = t.x;
                    var dy = t.y;
                    var bb = null;
					
                    if (cells.length == 1 && includeEdges)
                    {
                        var geo = graph.getCellGeometry(cells[0]);
						
                        if (geo != null)
                        {
                            bb = geo.getTerminalPoint(true);
                        }
                    }

                    bb = (bb != null) ? bb : graph.getBoundingBoxFromGeometry(cells, includeEdges);
					
                    if (bb != null)
                    {
                        var x = Math.round(graph.snap(graph.popupMenuHandler.triggerX / s - dx));
                        var y = Math.round(graph.snap(graph.popupMenuHandler.triggerY / s - dy));
						
                        graph.cellsMoved(cells, x - bb.x, y - bb.y);
                    }
                }
            }
            finally
            {
                graph.getModel().endUpdate();
            }
        }
    });
    this.addAction('resetHide', function () { 
        let flag = false
        let selectCell = graph.getSelectionCell()
        if (graph.getModel().getValue(graph.getSelectionCell())) {
            let showOrHide = graph.getModel().getValue(graph.getSelectionCell()).getAttribute('hide')
            if (showOrHide === null) {
                flag = true
            } else if (showOrHide === 'true') {
                flag = false
            } else if (showOrHide === 'false') {
                flag = true
            }
        } else {
            if (Object.prototype.toString.call(selectCell) === '[object Object]' && (selectCell.hide === undefined || !selectCell.hide)) {
                selectCell.hide= true
                flag = true
            } else {
                selectCell.hide = false
                flag = false
            }
        }
        setTimeout(() => {
            newSetCellAttrs('hide', flag)
        })
        removeImageRadio();
    }, null, 'sprite-resetHide',null);
    function newSetCellAttrs(key, value) {
        var cell = graph.getSelectionCell();
        var cellInfo = graph.getModel().getValue(cell);
        // 转换类型
        if (!mxUtils.isNode(cellInfo)) {
            var doc = mxUtils.createXmlDocument();
            var obj = doc.createElement('object');
            obj.setAttribute('label', cellInfo || '');
            cellInfo = obj;
        }
        cellInfo.setAttribute(key, value);
        graph.getModel().setValue(cell, cellInfo);
    }
    /**
	 * 删除节点
	 * @param {object} includeEdges 是否包含线条
	 */
    function deleteCells(includeEdges)
    {
        // 取消互动操作
        graph.escape();
        let cellSelected = graph.getSelectionCell()
        if (graph.view.getState(cellSelected) && graph.view.getState(cellSelected).style.shape === 'tableCell') {
            let model = graph.getModel()
            model.beginUpdate()
            model.setValue(cellSelected, '')
            model.endUpdate()
            graph.view.refresh(cellSelected)
            return
        }
        var cells = graph.getDeletableCells(graph.getSelectionCells());
        if (cells != null && cells.length > 0)
        {
            const model = graph.getModel();
            const parents = graph.model.getParents(cells);
            model.beginUpdate();
			try {
                graph.removeCells(cells, true);
                // 群组删除节点时选中父节点
                if (parents != null) {
                    var select = [];
                    var len = parents.length;
                    for (var i = 0; i < len; i++) {
                        // 删除菜单时处理菜单长度和子菜单的定位
                        if (graph.view.getState(parents[i]) && graph.view.getState(parents[i]).style.shape === 'menulist') {
                            let pos_x = 0;
                            for (var j = 0; j < parents[i].children.length; j++) {
                                var cell = parents[i].children[j];
                                const geo = getGeo(cell);
                                geo.x = pos_x;
                                pos_x += geo.width;
                                model.setGeometry(cell, geo);
                            }
                            const parentGeo = getGeo(parents[i]);
                            parentGeo.width = pos_x;
                            model.setGeometry(parents[i], parentGeo);
                        }
                        // 添加选中节点
                        if (graph.model.contains(parents[i]) &&
                            (graph.model.isVertex(parents[i]) ||
                                graph.model.isEdge(parents[i]))) {
                            select.push(parents[i]);
                        }
                    }
                    select.length && graph.setSelectionCells(select);
                }
            } finally {
                model.endUpdate();
            }
        }
    }
    function dealLockCell(isLock,cells){
        graph.setCellStyles(mxConstants.STYLE_MOVABLE, isLock,cells);
        graph.setCellStyles(mxConstants.STYLE_RESIZABLE, isLock, cells);
        graph.setCellStyles(mxConstants.STYLE_ROTATABLE, isLock, cells);
        graph.setCellStyles(mxConstants.STYLE_DELETABLE, isLock, cells);
        graph.setCellStyles(mxConstants.STYLE_EDITABLE, isLock, cells);
        graph.setCellStyles('connectable', isLock, cells);
    }
    function lockCell(isLock){
        graph.getModel().beginUpdate();
        let cells = graph.getSelectionCells();
        for(let i=0;i<cells.length;i++){
            if (cells[i].children && cells[i].children.length){
                dealLockCell(isLock, cells[i].children)
            }
        }
        dealLockCell(isLock)
        graph.getModel().endUpdate();
    }
    this.addAction('delete', function(evt)
    {
        deleteCells(evt != null && mxEvent.isShiftDown(evt));
        removeImageRadio();
    }, null, null, 'Delete');
    this.addAction('deleteAll', function()
    {
        deleteCells(true);
    }, null, null, Editor.ctrlKey + '+Delete');
    this.addAction('duplicate', function()
    {
        graph.setSelectionCells(graph.duplicateCells());
    }, null, null, Editor.ctrlKey + '+D');
    this.put('turn', new Action(mxResources.get('turn'), function()
    {
        graph.turnShapes(graph.getSelectionCells());
    }, null, null, null));
    this.addAction('selectVertices', function() { graph.selectVertices(); }, null, null, Editor.ctrlKey + '+Shift+I');
    this.addAction('selectEdges', function() { graph.selectEdges(); }, null, null, Editor.ctrlKey + '+Shift+E');
    this.addAction('selectAll', function() { graph.selectAll(null, true); }, null, null, Editor.ctrlKey + '+A');
    this.addAction('selectNone', function() { graph.clearSelection(); }, null, null, Editor.ctrlKey + '+Shift+A');
    this.addAction('lock',()=>{
        lockCell(0)
    },null, null, Editor.ctrlKey + '+L');
    this.addAction('unlock', () => {
        lockCell(1)
    }, null, null, Editor.ctrlKey + '+Shift+L');
    this.addAction('lockUnlock', function()
    {
        if (!graph.isSelectionEmpty())
        {
            graph.getModel().beginUpdate();
            try
            {
                var defaultValue = graph.isCellMovable(graph.getSelectionCell()) ? 1 : 0;
                graph.toggleCellStyles(mxConstants.STYLE_MOVABLE, defaultValue);
                graph.toggleCellStyles(mxConstants.STYLE_RESIZABLE, defaultValue);
                graph.toggleCellStyles(mxConstants.STYLE_ROTATABLE, defaultValue);
                graph.toggleCellStyles(mxConstants.STYLE_DELETABLE, defaultValue);
                graph.toggleCellStyles(mxConstants.STYLE_EDITABLE, defaultValue);
                graph.toggleCellStyles('connectable', defaultValue);
            }
            finally
            {
                graph.getModel().endUpdate();
            }
        }
    }, null, null, Editor.ctrlKey + '+L');

    // Navigation actions
    this.addAction('home', function() { graph.home(); }, null, null, 'Home');
    this.addAction('exitGroup', function() { graph.exitGroup(); }, null, null, Editor.ctrlKey + '+Shift+Home');
    this.addAction('enterGroup', function() { graph.enterGroup(); }, null, null, Editor.ctrlKey + '+Shift+End');
    this.addAction('collapse', function() { graph.foldCells(true); }, null, null, Editor.ctrlKey + '+Home');
    this.addAction('expand', function() { graph.foldCells(false); }, null, null, Editor.ctrlKey + '+End');
	
    // Arrange actions
    this.addAction('toFront', function() {
        removeImageRadio();
        graph.orderCells(false); 
    }, null, null, Editor.ctrlKey + '+Shift+F');
    this.addAction('toBack', function() {
        removeImageRadio(); 
        graph.orderCells(true); 
    }, null, null, Editor.ctrlKey + '+Shift+B');
    this.addAction('group', function()
    {
        if (graph.getSelectionCount() == 1)
        {
            graph.setCellStyles('container', '1');
        }
        else
        {
            graph.setSelectionCell(graph.groupCells(null, 0));
        }
    }, null, null, Editor.ctrlKey + '+G');
    this.addAction('ungroup', function()
    {
        if (graph.getSelectionCount() == 1 && graph.getModel().getChildCount(graph.getSelectionCell()) == 0)
        {
            graph.setCellStyles('container', '0');
        }
        else
        {
            graph.setSelectionCells(graph.ungroupCells());
        }
    }, null, null, Editor.ctrlKey + '+Shift+U');
    this.addAction('removeFromGroup', function() { graph.removeCellsFromParent(); });
    // Adds action
    this.addAction('edit', function()
    {
        if (graph.isEnabled())
        {
            graph.startEditingAtCell();
        }
    }, null, null, 'F2/Enter');
    this.addAction('openLink', function()
    {
        var link = graph.getLinkForCell(graph.getSelectionCell());
		
        if (link != null)
        {
            graph.openLink(link);
        }
    });
    this.addAction('editLink...', function()
    {
        var graph = ui.editor.graph;
		
        if (graph.isEnabled() && !graph.isSelectionEmpty())
        {
            var cell = graph.getSelectionCell();
            var value = graph.getLinkForCell(cell) || '';
			
            ui.showLinkDialog(value, mxResources.get('apply'), function(link)
            {
                link = mxUtils.trim(link);
    				graph.setLinkForCell(cell, (link.length > 0) ? link : null);
            });
        }
    }, null, null, 'Alt+Shift+L');
    this.addAction('insertLink...', function()
    {
        if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
        {
            ui.showLinkDialog('', mxResources.get('insert'), function(link, docs)
            {
                link = mxUtils.trim(link);
				
                if (link.length > 0)
                {
                    var icon = null;
                    var title = graph.getLinkTitle(link);
					
                    if (docs != null && docs.length > 0)
                    {
                        icon = docs[0].iconUrl;
                        title = docs[0].name || docs[0].type;
                        title = title.charAt(0).toUpperCase() + title.substring(1);
						
                        if (title.length > 30)
                        {
                            title = title.substring(0, 30) + '...';
                        }
                    }
					
                    var pt = graph.getFreeInsertPoint();
            		var linkCell = new mxCell(title, new mxGeometry(pt.x, pt.y, 100, 40),
	            	    	'fontColor=#0000EE;fontStyle=4;rounded=1;overflow=hidden;' + ((icon != null) ?
	            	    	'shape=label;imageWidth=16;imageHeight=16;spacingLeft=26;align=left;image=' + icon :
	            	    	'spacing=10;'));
            	    linkCell.vertex = true;

            	    graph.setLinkForCell(linkCell, link);
            	    graph.cellSizeUpdated(linkCell, true);

            		graph.getModel().beginUpdate();
            		try
            		{
        	    		linkCell = graph.addCell(linkCell);
        	    		graph.fireEvent(new mxEventObject('cellsInserted', 'cells', [linkCell]));
            	    }
            		finally
            		{
            			graph.getModel().endUpdate();
            		}
            		
            	    graph.setSelectionCell(linkCell);
            	    graph.scrollCellToVisible(graph.getSelectionCell());
                }
            });
        }
    }).isEnabled = isGraphEnabled;
    this.addAction('link', mxUtils.bind(this, function()
    {
        var graph = ui.editor.graph;
		
        if (graph.isEnabled())
        {
            if (graph.cellEditor.isContentEditing())
            {
                var elt = graph.getSelectedElement();
                var link = graph.getParentByName(elt, 'A', graph.cellEditor.textarea);
                var oldValue = '';
				
                // Workaround for FF returning the outermost selected element after double
                // click on a DOM hierarchy with a link inside (but not as topmost element)
                if (link == null && elt != null && elt.getElementsByTagName != null)
                {
                    // Finds all links in the selected DOM and uses the link
                    // where the selection text matches its text content
                    var links = elt.getElementsByTagName('a');
					
                    for (var i = 0; i < links.length && link == null; i++)
                    {
                        if (links[i].textContent == elt.textContent)
                        {
                            graph.selectNode(links[i]);
                            link = links[i];
                        }
                    }
                }

                if (link != null && link.nodeName == 'A')
                {
                    oldValue = link.getAttribute('href') || '';
                }
				
                var selState = graph.cellEditor.saveSelection();
				
                ui.showLinkDialog(oldValue, mxResources.get('apply'), mxUtils.bind(this, function(value)
                {
		    		graph.cellEditor.restoreSelection(selState);

		    		if (value != null)
		    		{
		    			graph.insertLink(value);
                    }
                }));
            }
            else if (graph.isSelectionEmpty())
            {
                this.get('insertLink').funct();
            }
            else
            {
                this.get('editLink').funct();
            }
        }
    }), false);
    this.addAction('autosize', function()
    {
        var cells = graph.getSelectionCells();
		
        if (cells != null)
        {
            graph.getModel().beginUpdate();
            try
            {
                for (var i = 0; i < cells.length; i++)
                {
                    var cell = cells[i];
					
                    if (graph.getModel().getChildCount(cell))
                    {
                        graph.updateGroupBounds([cell], 20);
                    }
                    else
                    {
                        var state = graph.view.getState(cell);
                        var geo = graph.getCellGeometry(cell);

                        if (graph.getModel().isVertex(cell) && state != null && state.text != null &&
							geo != null && graph.isWrapping(cell))
                        {
                            geo = geo.clone();
                            geo.height = state.text.boundingBox.height / graph.view.scale;
                            graph.getModel().setGeometry(cell, geo);
                        }
                        else
                        {
                            graph.updateCellSize(cell);
                        }
                    }
                }
            }
            finally
            {
                graph.getModel().endUpdate();
            }
        }
    }, null, null, Editor.ctrlKey + '+Shift+Y');
    this.addAction('formattedText', function()
    {
    	var state = graph.getView().getState(graph.getSelectionCell());
    	
    	if (state != null)
    	{
	    	var value = '1';
	    	graph.stopEditing();
			
            graph.getModel().beginUpdate();
            try
            {
		    	if (state.style['html'] == '1')
		    	{
		    		value = null;
		    		var label = graph.convertValueToString(state.cell);
		    		
		    		if (mxUtils.getValue(state.style, 'nl2Br', '1') != '0')
                    {
                        // Removes newlines from HTML and converts breaks to newlines
                        // to match the HTML output in plain text
                        label = label.replace(/\n/g, '').replace(/<br\s*.?>/g, '\n');
                    }
		    		
		    		// Removes HTML tags
	    			var temp = document.createElement('div');
	    			temp.innerHTML = label;
	    			label = mxUtils.extractTextWithWhitespace(temp.childNodes);
	    			
                    graph.cellLabelChanged(state.cell, label);
		    	}
		    	else
		    	{
		    		// Converts HTML tags to text
		    		var label = mxUtils.htmlEntities(graph.convertValueToString(state.cell), false);
		    		
		    		if (mxUtils.getValue(state.style, 'nl2Br', '1') != '0')
                    {
                        // Converts newlines in plain text to breaks in HTML
                        // to match the plain text output
		    			label = label.replace(/\n/g, '<br/>');
                    }
		    		
		    		graph.cellLabelChanged(state.cell, graph.sanitizeHtml(label));
		    	}
		
		       	graph.setCellStyles('html', value);
                ui.fireEvent(new mxEventObject('styleChanged', 'keys', ['html'],
                    'values', [(value != null) ? value : '0'], 'cells',
                    graph.getSelectionCells()));
            }
            finally
            {
                graph.getModel().endUpdate();
            }
    	}
    });
    this.addAction('rotation', function()
    {
        var value = '0';
        var state = graph.getView().getState(graph.getSelectionCell());
		
        if (state != null)
        {
            value = state.style[mxConstants.STYLE_ROTATION] || value;
        }
        var dlg = new valueDialog(ui, value, '旋转角度（0-360）：', '应用', function(newValue)
        {
            if (newValue != null && !isNaN(newValue))
            {
                graph.setCellStyles(mxConstants.STYLE_ROTATION, newValue);
                ui.hideDialog()
            }
        }, null, null);
		
        ui.showDialog(dlg.container, 375, 80, true, false, null, null ,'任意旋转');
    });
    // 视图
    this.addAction('resetView', function()
    {
        graph.zoomTo(1);
        ui.resetScrollbars();
    }, null, null, Editor.ctrlKey + '+H');
    //this.addAction('zoomIn', function(evt) { graph.zoomIn(); }, null, null, Editor.ctrlKey + '+');
    //this.addAction('zoomOut', function(evt) { graph.zoomOut(); }, null, null, Editor.ctrlKey + '-');
    this.addAction('fitWindow', function() { graph.fit(); }, null, null, Editor.ctrlKey + '+Shift+H');
    this.addAction('fitPage', mxUtils.bind(this, function()
    {
        if (!graph.pageVisible)
        {
            this.get('pageView').funct();
        }
		
        var fmt = graph.pageFormat;
        var ps = graph.pageScale;
        var cw = graph.container.clientWidth - 10;
        var ch = graph.container.clientHeight - 10;
        var scale = Math.floor(20 * Math.min(cw / fmt.width / ps, ch / fmt.height / ps)) / 20;
        graph.zoomTo(scale);
		
        if (mxUtils.hasScrollbars(graph.container))
        {
            var pad = graph.getPagePadding();
            graph.container.scrollTop = pad.y * graph.view.scale - 1;
            graph.container.scrollLeft = Math.min(pad.x * graph.view.scale, (graph.container.scrollWidth - graph.container.clientWidth) / 2) - 1;
        }
    }), null, null, Editor.ctrlKey + '+J');
    this.addAction('fitTwoPages', mxUtils.bind(this, function()
    {
        if (!graph.pageVisible)
        {
            this.get('pageView').funct();
        }
		
        var fmt = graph.pageFormat;
        var ps = graph.pageScale;
        var cw = graph.container.clientWidth - 10;
        var ch = graph.container.clientHeight - 10;
		
        var scale = Math.floor(20 * Math.min(cw / (2 * fmt.width) / ps, ch / fmt.height / ps)) / 20;
        graph.zoomTo(scale);
		
        if (mxUtils.hasScrollbars(graph.container))
        {
            var pad = graph.getPagePadding();
            graph.container.scrollTop = Math.min(pad.y, (graph.container.scrollHeight - graph.container.clientHeight) / 2);
            graph.container.scrollLeft = Math.min(pad.x, (graph.container.scrollWidth - graph.container.clientWidth) / 2);
        }
    }), null, null, Editor.ctrlKey + '+Shift+J');
    this.addAction('fitPageWidth', mxUtils.bind(this, function()
    {
        if (!graph.pageVisible)
        {
            this.get('pageView').funct();
        }
		
        var fmt = graph.pageFormat;
        var ps = graph.pageScale;
        var cw = graph.container.clientWidth - 10;

        var scale = Math.floor(20 * cw / fmt.width / ps) / 20;
        graph.zoomTo(scale);
		
        if (mxUtils.hasScrollbars(graph.container))
        {
            var pad = graph.getPagePadding();
            graph.container.scrollLeft = Math.min(pad.x * graph.view.scale,
                (graph.container.scrollWidth - graph.container.clientWidth) / 2);
        }
    }));
    // Option actions
    var action = null;
    action = this.addAction('grid', function()
    {
        graph.setGridEnabled(!graph.isGridEnabled());
        ui.fireEvent(new mxEventObject('gridEnabledChanged'));
    }, null, null);
    action.setToggleAction(true);
    action.setSelectedCallback(function() { return graph.isGridEnabled(); });
    action.setEnabled(false);
	
    action = this.addAction('guides', function()
    {
        graph.graphHandler.guidesEnabled = !graph.graphHandler.guidesEnabled;
        ui.fireEvent(new mxEventObject('guidesEnabledChanged'));
    });
    action.setToggleAction(true);
    action.setSelectedCallback(function() { return graph.graphHandler.guidesEnabled; });
    action.setEnabled(false);
	
    action = this.addAction('tooltips', function()
    {
        graph.tooltipHandler.setEnabled(!graph.tooltipHandler.isEnabled());
    });
    action.setToggleAction(true);
    action.setSelectedCallback(function() { return graph.tooltipHandler.isEnabled(); });
	
    action = this.addAction('collapseExpand', function()
    {
        var change = new ChangePageSetup(ui);
        change.ignoreColor = true;
        change.ignoreImage = true;
        change.foldingEnabled = !graph.foldingEnabled;
		
        graph.model.execute(change);
    });
    action.setToggleAction(true);
    action.setSelectedCallback(function() { return graph.foldingEnabled; });
    action.isEnabled = isGraphEnabled;
    action = this.addAction('scrollbars', function()
    {
        ui.setScrollbars(!ui.hasScrollbars());
    });
    action.setToggleAction(true);
    action.setSelectedCallback(function() { return graph.scrollbars; });
    action = this.addAction('pageView', mxUtils.bind(this, function()
    {
        // ui.setPageVisible(!graph.pageVisible);
    }), true, null, 'Ctrl+Shift+L');
    action.setToggleAction(true);
    action.setSelectedCallback(function() { return graph.pageVisible; });
    action = this.addAction('connectionArrows', function()
    {
        graph.connectionArrowsEnabled = !graph.connectionArrowsEnabled;
        ui.fireEvent(new mxEventObject('connectionArrowsChanged'));
    }, null, null, 'Alt+Shift+A');
    action.setToggleAction(true);
    action.setSelectedCallback(function() { return graph.connectionArrowsEnabled; });
    action = this.addAction('connectionPoints', function()
    {
        graph.setConnectable(!graph.connectionHandler.isEnabled());
        ui.fireEvent(new mxEventObject('connectionPointsChanged'));
    }, null, null, 'Alt+Shift+P');
    action.setToggleAction(true);
    action.setSelectedCallback(function() { return graph.connectionHandler.isEnabled(); });
    action = this.addAction('copyConnect', function()
    {
        graph.connectionHandler.setCreateTarget(!graph.connectionHandler.isCreateTarget());
        ui.fireEvent(new mxEventObject('copyConnectChanged'));
    });
    action.setToggleAction(true);
    action.setSelectedCallback(function() { return graph.connectionHandler.isCreateTarget(); });
    action.isEnabled = isGraphEnabled;
    action = this.addAction('autosave', function()
    {
        ui.editor.setAutosave(!ui.editor.autosave);
    });
    action.setToggleAction(true);
    action.setSelectedCallback(function() { return ui.editor.autosave; });
    action.isEnabled = isGraphEnabled;
    action.visible = false;
	
    // Help actions
    this.addAction('help', function()
    {
        var ext = '';
		
        if (mxResources.isLanguageSupported(mxClient.language))
        {
            ext = '_' + mxClient.language;
        }
		
        graph.openLink(RESOURCES_PATH + '/help' + ext + '.html');
    });
	
    var showingAbout = false;
	
    this.put('about', new Action(mxResources.get('about') + ' 界面工具...', function()
    {
        if (!showingAbout)
        {
            ui.showDialog(new AboutDialog(ui).container, 320, 280, true, true, function()
            {
                showingAbout = false;
            });
			
            showingAbout = true;
        }
    }, null, null, 'F1'));
	
    // Font style actions
    var toggleFontStyle = mxUtils.bind(this, function(key, style, fn, shortcut)
    {
        return this.addAction(key, function()
        {
            if (fn != null && graph.cellEditor.isContentEditing())
            {
                fn();
            }
            else
            {
                graph.stopEditing(false);
				
                graph.getModel().beginUpdate();
                try
                {
                    graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, style);
					
                    // Removes bold and italic tags and CSS styles inside labels
                    if ((style & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
                    {
                        graph.updateLabelElements(graph.getSelectionCells(), function(elt)
                        {
                            elt.style.fontWeight = null;
							
                            if (elt.nodeName == 'B')
                            {
                                graph.replaceElement(elt);
                            }
                        });
                    }
                    else if ((style & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
                    {
                        graph.updateLabelElements(graph.getSelectionCells(), function(elt)
                        {
                            elt.style.fontStyle = null;
							
                            if (elt.nodeName == 'I')
                            {
                                graph.replaceElement(elt);
                            }
                        });
                    }
                    else if ((style & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
                    {
                        graph.updateLabelElements(graph.getSelectionCells(), function(elt)
                        {
                            elt.style.textDecoration = null;
							
                            if (elt.nodeName == 'U')
                            {
                                graph.replaceElement(elt);
                            }
                        });
                    }
                }
                finally
                {
                    graph.getModel().endUpdate();
                }
            }
        }, null, null, shortcut);
    });
	
    toggleFontStyle('bold', mxConstants.FONT_BOLD, function() { document.execCommand('bold', false, null); }, Editor.ctrlKey + '+B');
    toggleFontStyle('italic', mxConstants.FONT_ITALIC, function() { document.execCommand('italic', false, null); }, Editor.ctrlKey + '+I');
    toggleFontStyle('underline', mxConstants.FONT_UNDERLINE, function() { document.execCommand('underline', false, null); }, Editor.ctrlKey + '+U');
	
    // Color actions
    this.addAction('fontColor...', function() { ui.menus.pickColor(mxConstants.STYLE_FONTCOLOR, 'forecolor', '000000'); });
    this.addAction('strokeColor...', function() { ui.menus.pickColor(mxConstants.STYLE_STROKECOLOR); });
    this.addAction('fillColor...', function() { ui.menus.pickColor(mxConstants.STYLE_FILLCOLOR); });
    this.addAction('gradientColor...', function() { ui.menus.pickColor(mxConstants.STYLE_GRADIENTCOLOR); });
    this.addAction('backgroundColor...', function() { ui.menus.pickColor(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, 'backcolor'); });
    this.addAction('borderColor...', function() { ui.menus.pickColor(mxConstants.STYLE_LABEL_BORDERCOLOR); });
	
	
    // 编辑图片
    this.addAction('image', function(e) {
        // var cell = graph.getSelectionCell();
        // var dlg = new ImageDialog(ui, cell)
        // ui.showDialog(dlg.container, 410, 370, true, false, null, null, '选择图片');
        // dlg.init()
        // 本地图片
        let timer = setTimeout(() => {
            removeImageRadio();
            clearTimeout(timer)
        },200)
        var localImage;
        if (document.getElementsByClassName('imageRadio')[0]) {
            document.getElementsByClassName('imageRadio')[0].addEventListener('click', function (e) {
                document.getElementById('checkedImage') ? document.getElementById('checkedImage').id = '' : null;
            })
            document.getElementById('chooseImage').addEventListener('change', function (e) {
                //创建new FileReader()对象
                return new Promise(function (resolve, reject) {
                    var fr = new FileReader();
                    fr.onload = (function (file) {
                        resolve(file)
                        removeImageRadio();
                    })(e.target.files[0]);
                    fr.onerror = function () {
                        reject('上传失败');
                    };
                    fr.readAsDataURL(e.target.files[0])
                }).then((res) => {
                    localImage = res
                    // 更换图片
                    var select = null;
                    var cells = graph.getSelectionCells();
                    var updateImg = function (newValue) {
                        let prefix = 'getechFileSystem/'
                        let newValueCell = prefix + newValue.picPath
                        graph.getModel().beginUpdate()
                        try {
                            graph.setCellStyles(mxConstants.STYLE_IMAGE, (newValueCell.length > 0) ? newValueCell : null, cells);
                        }
                        finally {
                            graph.getModel().endUpdate();
                        }
                        if (select != null) {
                            graph.setSelectionCells(select);
                            graph.scrollCellToVisible(select[0]);
                        }
                    }
                    if (localImage) {
                        var formData = new FormData();
                        formData.append('file', localImage);
                        formData.append('materialLibraryId', '')
                        ui.editor.uploadFile(ui, 'api/iot-cds/sources/material', 'POST', formData, function (res) {
                            updateImg(res)
                        })
                    } 
                }).catch((meg) => {
                    console.log(meg)
                })
            })
        } else {
            removeImageRadio()
        }
    })
    
    this.addAction('images', function()
    {
        if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
        {
            var title = mxResources.get('image') + ' (' + mxResources.get('url') + '):';
	    	var state = graph.getView().getState(graph.getSelectionCell());
	    	var value = '';
	    	
	    	if (state != null)
	    	{
	    		value = state.style[mxConstants.STYLE_IMAGE] || value;
	    	}
	    	
	    	var selectionState = graph.cellEditor.saveSelection();
	    	ui.showImageDialog(title, value, function(newValue, w, h)
            {
	    		// 将图片插入html
	    		if (graph.cellEditor.isContentEditing())
	    		{
	    			graph.cellEditor.restoreSelection(selectionState);
	    			graph.insertImage(newValue, w, h);
	    		}
	    		else
	    		{
                    var cells = graph.getSelectionCells();
					
                    if (newValue != null && (newValue.length > 0 || cells.length > 0))
                    {
                        var select = null;
						
                        graph.getModel().beginUpdate();
			        	try
			        	{
			        		// Inserts new cell if no cell is selected
			    			if (cells.length == 0)
			    			{
			    				var pt = graph.getFreeInsertPoint();
			    				cells = [graph.insertVertex(graph.getDefaultParent(), null, '', pt.x, pt.y, w, h,
			    						'shape=image;imageAspect=0;aspect=fixed;verticalLabelPosition=bottom;verticalAlign=top;')];
			    				select = cells;
		            	    		graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select));
			    			}
			    			
			        		graph.setCellStyles(mxConstants.STYLE_IMAGE, (newValue.length > 0) ? newValue : null, cells);
			        		
			        		// Sets shape only if not already shape with image (label or image)
			        		var state = graph.view.getState(cells[0]);
			        		var style = (state != null) ? state.style : graph.getCellStyle(cells[0]);
			        		
			        		if (style[mxConstants.STYLE_SHAPE] != 'image' && style[mxConstants.STYLE_SHAPE] != 'label')
			        		{
			        			graph.setCellStyles(mxConstants.STYLE_SHAPE, 'image', cells);
			        		}
			        		else if (newValue.length == 0)
			        		{
			        			graph.setCellStyles(mxConstants.STYLE_SHAPE, null, cells);
			        		}
				        	
				        	if (graph.getSelectionCount() == 1)
				        	{
					        	if (w != null && h != null)
					        	{
					        		var cell = cells[0];
					        		var geo = graph.getModel().getGeometry(cell);
					        		
					        		if (geo != null)
					        		{
					        			geo = geo.clone();
						        		geo.width = w;
						        		geo.height = h;
						        		graph.getModel().setGeometry(cell, geo);
					        		}
					        	}
				        	}
			        	}
			        	finally
			        	{
			        		graph.getModel().endUpdate();
			        	}
			        	
			        	if (select != null)
			        	{
			        		graph.setSelectionCells(select);
			        		graph.scrollCellToVisible(select[0]);
			        	}
                    }
		    	}
            }, graph.cellEditor.isContentEditing(), !graph.cellEditor.isContentEditing());
        }
    }).isEnabled = isGraphEnabled;
    // 关闭format面板
    action = this.addAction('formatPanel', mxUtils.bind(this, function()
    {
        ui.toggleRightPanel();
    }), null, null, Editor.ctrlKey + '+Shift+P');
    action.setToggleAction(true);
    action.setSelectedCallback(mxUtils.bind(this, function() { return ui.formatWidth > 0; }));
    action = this.addAction('outline', mxUtils.bind(this, function()
    {
        if (this.outlineWindow == null)
        {
            // LATER: Check layers window for initial placement
            this.outlineWindow = new OutlineWindow(ui, document.body.offsetWidth - 260, 100, 180, 180);
            this.outlineWindow.window.addListener('show', function()
            {
                ui.fireEvent(new mxEventObject('outline'));
            });
            this.outlineWindow.window.addListener('hide', function()
            {
                ui.fireEvent(new mxEventObject('outline'));
            });
            this.outlineWindow.window.setVisible(true);
            ui.fireEvent(new mxEventObject('outline'));
        }
        else
        {
            this.outlineWindow.window.setVisible(!this.outlineWindow.window.isVisible());
        }
    }), null, null, Editor.ctrlKey + '+Shift+O');
	
    action.setToggleAction(true);
    action.setSelectedCallback(mxUtils.bind(this, function() { return this.outlineWindow != null && this.outlineWindow.window.isVisible(); }));
};
/**
 * 获取当前表格的行数
 */
Actions.prototype.getRowNum = function(cell) {
    return parseInt(cell.geometry.y / cell.geometry.height);
};
/**
 * 获取当前表格的列数
 */
Actions.prototype.getColNum = function(cell) {
    return parseInt(cell.geometry.x / cell.geometry.width);
};

/**
 * 是否是表格
 */
Actions.prototype.isTableBox = function(cell) {
    return /shape=tableBox/.test(cell.style.toString());
}
/**
 * 是否是表格单元格
 */
Actions.prototype.isTableCell = function (cell) {
    return /shape=tableCell/.test(cell.style.toString());
}
/**
 * 获取表格行和列数
 * 获取表格列数
 */
Actions.prototype.getTableRowColNum = function (table) {
    if (!this.isTableBox(table)) {
        return null;
    }
    const ui = this.editorUi;
    const editor = ui.editor;
    const graph = editor.graph;
    let col = 0;
    let row = 0;
    const tableCells = table.children;
    tableCells.forEach(cell => {
        if (cell.geometry.y === 0) {
            col++;
        }
        if (cell.geometry.x === 0) {
            row++;
        }
    })
    return {row, col};
}
/**
 * 获取当前单元格的所有同行同列元素
 */
Actions.prototype.getRowColCells = function (selectionCell = null) {
    const ui = this.editorUi;
    const editor = ui.editor;
    const graph = editor.graph;
    const cell = selectionCell ? selectionCell : graph.getSelectionCell();
    if (!this.isTableCell(cell)) {
        return null;
    }
    const table = cell.parent;
    const tableCells = table.children;
    const cellX = cell.geometry.x;
    const cellY = cell.geometry.y;
    const rowCells = [];
    const colCells = [];
    const rightCells = [];
    const bottomCells = [];
    tableCells.forEach(item => {
        // X轴相等，同列
        if (item.geometry.x === cellX) {
            colCells.push(item);
        } else if (item.geometry.x > cellX) {
            // 当前单元格右边的元素
            rightCells.push(item);
        }
        // Y轴相等，同行
        if (item.geometry.y === cellY) {
            rowCells.push(item);
        } else if (item.geometry.y > cellY) {
            // 当前单元格下方的元素
            bottomCells.push(item);
        }
    });
    return {graph, cell, table, rowCells, colCells, rightCells, bottomCells};
};
/**
 * 当前单元格宽高发生变化时，
 * 更新同行的高和同列的宽，
 * 更新tableBox的宽高，
 * 更新右方的x轴，
 * 更新下方的y轴
 * @param {string} type 更新类型
 * @param {number} diff 更新差值
 * @param {tableCell} selectionCell 当前选中的单元格
 */
Actions.prototype.updateRowColSize = function (type, diff, selectionCell = null) {
    if (!type || !diff) {
        return;
    }
    const ui = this.editorUi;
    const editor = ui.editor;
    const graph = editor.graph;
    const model = graph.getModel();
    const cell = selectionCell ? selectionCell : graph.getSelectionCell();
    if (!this.isTableCell(cell)) {
        return null;
    }
    const table = cell.parent;
    const tableCells = table.children;
    const cellW = cell.geometry.width;
    const cellH = cell.geometry.height;
    const cellX = cell.geometry.x;
    const cellY = cell.geometry.y;
    const tableW = table.geometry.width;
    const tableH = table.geometry.height;
    const wType = 'W';
    const hType = 'H';
    const getGeo = mxCell => {
        const geo = graph.getCellGeometry(mxCell);
        return geo.clone();
    };
    const extendGeo = (geo, type, value) => {
        switch (type) {
            case 'W':
                geo.width = value;
                break;
            case 'H':
                geo.height = value;
                break;
            case 'X':
                geo.x = value;
                break;
            case 'Y':
                geo.y = value;
                break;
        }
        return geo;
    };
    // model.beginUpdate();
    // 更新单元格的
    tableCells.forEach(mxCell => {
        // 当前选中单元格不用再次更新
        if (mxCell.id !== cell.id) {
            const geo = getGeo(mxCell);
            let flag = true; // 是否需要更新geometry
            // 修改宽，整列宽度都要改，右边单元格需要改x轴
            if (type === wType) {
                // X轴相等，同列
                if (mxCell.geometry.x === cellX) {
                    extendGeo(geo, wType, cellW);
                } else if (mxCell.geometry.x > cellX) {
                    // 当前单元格右边的元素
                    extendGeo(geo, 'X', mxCell.geometry.x + diff);
                } else {
                    flag = false
                }
            } else if (type === hType) {
                // 更新高时，要更新整行，下方单元格需要改y轴
                // Y轴相等，同行
                if (mxCell.geometry.y === cellY) {
                    extendGeo(geo, hType, cellH);
                } else if (mxCell.geometry.y > cellY) {
                    // 当前单元格下方的元素
                    extendGeo(geo, 'Y', mxCell.geometry.y + diff);
                } else {
                    flag = false
                }
            } else {
                flag = false
            }
            flag && model.setGeometry(mxCell, geo);
        }
    });
    // 更新表格的
    const tableGeo = getGeo(table);
    type === wType && extendGeo(tableGeo, wType, tableW + diff);
    type === hType && extendGeo(tableGeo, hType, tableH + diff);
    [wType, hType].includes(type) && model.setGeometry(table, tableGeo);
    // model.endUpdate();
}
Actions.prototype.insertTableCell = function (type, selectionCell = null) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    let cell = selectionCell ? selectionCell : graph.getSelectionCell();
    const data = this.getRowColCells(cell);
    if (data === null) {
        return;
    }
    const table = data.table;
    const cellW = cell.geometry.width;
    const cellH = cell.geometry.height;
    const getGeo = mxCell => {
        const geo = graph.getCellGeometry(mxCell);
        return geo.clone();
    };
    const model = graph.getModel();
    const moveXY = (item, isY) => {
        const geo = getGeo(item);
        if (isY) {
            geo.y += cellH;
        } else {
            geo.x += cellW;
        }
        model.setGeometry(item, geo);
    };
    const addItem = geomery => {
        const symbol = new mxCell('', geomery, 'shape=tableCell;strokeColor=#000000;html=1;whiteSpace=wrap;fillColor=none;');
        symbol.setVertex(true);
        // 设置id
        symbol.setId(model.createId(symbol));
        model.add(table, symbol);
    };
    model.beginUpdate();
    try {
        const tableGeo = getGeo(table);
        // 插入行时，下方的元素要移动y轴
        if (type === 'up' || type === 'lower') {
            data.bottomCells.forEach(item => {
                moveXY(item, true);
            });
            if (type === 'up') {
                // 上方插入行，当前行也要下移y轴
                data.rowCells.forEach(item => {
                    const geo = getGeo(item);
                    addItem(new mxGeometry(geo.x, geo.y, geo.width, cellH));
                    moveXY(item, true);
                });
            } else {
                data.rowCells.forEach(item => {
                    const geo = getGeo(item);
                    addItem(new mxGeometry(geo.x, geo.y + cellH, geo.width, cellH));
                });
            }
            tableGeo.height += cellH;
        } else {
            // 插入列，右方元素需要移动x轴
            data.rightCells.forEach(item => {
                moveXY(item);
            });
            if (type === 'left') {
                // 左侧插入列，当前列要右移
                data.colCells.forEach(item => {
                    const geo = getGeo(item);
                    addItem(new mxGeometry(geo.x, geo.y, cellW, geo.height));
                    moveXY(item);
                });
            } else {
                data.colCells.forEach(item => {
                    const geo = getGeo(item);
                    addItem(new mxGeometry(geo.x + cellW, geo.y, cellW, geo.height));
                });
            }
            tableGeo.width += cellW;
        }
        model.setGeometry(table, tableGeo)
    }
    finally {
        model.endUpdate();
    }
};
Actions.prototype.deleteTableCell = function(type,selectionCell=null) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    let cell = selectionCell ? selectionCell : graph.getSelectionCell();
    const data = this.getRowColCells(cell);
    if (data === null) {
        return;
    }
    const table = data.table;
    const cellW = cell.geometry.width;
    const cellH = cell.geometry.height;
    const getGeo = mxCell => {
        const geo = graph.getCellGeometry(mxCell);
        return geo.clone();
    };
    const model = graph.getModel();
    const moveXY = (item, isY) => {
        const geo = getGeo(item);
        if (isY) {
            geo.y -= cellH;
        } else {
            geo.x -= cellW;
        }
        model.setGeometry(item, geo);
    };
    model.beginUpdate();
    try {
        let delCells = [];
        const tableGeo = getGeo(table);
        // 删除行，下方元素y轴需要上移
        if (type === 'row') {
            delCells = [...data.rowCells];
            data.bottomCells.forEach(item => {
                moveXY(item, true);
            });
            tableGeo.height -= cellH;
        } else {
            delCells = [...data.colCells];
            data.rightCells.forEach(item => {
                moveXY(item);
            });
            tableGeo.width -= cellW;
        }
        graph.removeCells(delCells, true);
        model.setGeometry(table, tableGeo);
    }
    finally {
        model.endUpdate();
    }
};
/**
 * Registers the given action under the given name.
 */
Actions.prototype.addAction = function(key, funct, enabled, iconCls, shortcut)
{
    var title;
    if (key.substring(key.length - 3) == '...')
    {
        key = key.substring(0, key.length - 3);
        title = mxResources.get(key) + '...';
    }
    else
    {
        title = mxResources.get(key);
    }
    return this.put(key, new Action(title, funct, enabled, iconCls, shortcut));
};

/**
 * Registers the given action under the given name.
 */
Actions.prototype.put = function(name, action)
{
    this.actions[name] = action;
	
    return action;
};

/**
 * Returns the action for the given name or null if no such action exists.
 */
Actions.prototype.get = function(name)
{
    return this.actions[name];
}; 

/**
 * Constructs a new action for the given parameters.
 */
let Action =function (label, funct, enabled, iconCls, shortcut)
{
    mxEventSource.call(this);
    this.label = label;
    this.funct = this.createFunction(funct);
    this.enabled = (enabled != null) ? enabled : true;
    this.iconCls = iconCls;
    this.shortcut = shortcut;
    this.visible = true;
}

// Action inherits from mxEventSource
mxUtils.extend(Action, mxEventSource);

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.createFunction = function(funct)
{
    return funct;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.setEnabled = function(value)
{
    if (this.enabled != value)
    {
        this.enabled = value;
        this.fireEvent(new mxEventObject('stateChanged'));
    }
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.isEnabled = function()
{
    return this.enabled;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.setToggleAction = function(value)
{
    this.toggleAction = value;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.setSelectedCallback = function(funct)
{
    this.selectedCallback = funct;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.isSelected = function()
{
    return this.selectedCallback();
};
window.Actions=Actions
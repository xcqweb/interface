/* eslint-disable */
/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new graph editor
 */
Menus = function(editorUi)
{
    this.editorUi = editorUi;
    this.menus = new Object();
    this.init();

    // Pre-fetches checkmark image
    if (!mxClient.IS_SVG)
    {
        new Image().src = this.checkmarkImage;
    }
};

/**
 * Sets the default font family.
 */
Menus.prototype.defaultFont = 'MicrosoftYaHei';

/**
 * Sets the default font size.
 */
Menus.prototype.defaultFontSize = '12';

/**
 * 默认一级菜单栏
 */
Menus.prototype.defaultMenuItems = ['file', 'edit', 'view', 'arrange', 'publish', 'help'];

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.defaultFonts = ['MicrosoftYaHei', 'Verdana', 'Times New Roman', 'Garamond', 'Comic Sans MS',
           		             'Courier New', 'Georgia', 'Lucida Console', 'Tahoma'];

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.init = function()
{
    var graph = this.editorUi.editor.graph;
    var isGraphEnabled = mxUtils.bind(graph, graph.isEnabled);

    this.customFonts = [];
    this.customFontSizes = [];
    // 布局
    this.put('arrange', new Menu(mxUtils.bind(this, function(menu, parent)
    {
        this.addMenuItems(menu, ['toFront', 'toBack', '-'], parent);
        this.addSubmenu('direction', menu, parent);
        this.addSubmenu('align', menu, parent);
        this.addMenuItems(menu, ['-', 'group', 'ungroup', 'removeFromGroup', '-','autosize'], parent);
    }))).isEnabled = isGraphEnabled;

    // 文件
    this.put('publish', new Menu(mxUtils.bind(this, function(menu, parent)
    {
        this.addMenuItems(menu, ['publish'], parent);
    })));
    // 视图
    this.put('view', new Menu(mxUtils.bind(this, function(menu, parent)
    {
        this.addMenuItems(menu, ['resetView'], parent);
        this.addMenuItems(menu, ['-','palette' ,'toolbar' ,'paletteManage' ,'pageList' ,'formatManage' ,'-' ,'scrollbars', 'grid', '-'], parent);
        this.addSubmenu('pageScale', menu, parent);
        this.addMenuItems(menu, ['zoomIn', 'zoomOut'], parent);
    })));
    /* this.put('pageScale', new Menu(mxUtils.bind(this, function(menu, parent)
    {
        var scales = [0.25, 0.5, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4];
        for (var i = 0; i < scales.length; i++)
        {
            (function(scale)
            {
                menu.addItem((scale * 100) + '%', null, function()
                {
                    graph.zoomTo(scale);
                }, parent);
            })(scales[i]);
        }
    }))); */
    // 文件
    this.put('file', new Menu(mxUtils.bind(this, function(menu, parent)
    {
        this.addMenuItems(menu, ['new', 'open', '-', 'save', 'pageSetup'], parent);
    })));
    // 编辑
    this.put('edit', new Menu(mxUtils.bind(this, function(menu, parent)
    {
        this.addMenuItems(menu, ['undo', 'redo', '-','cut', 'copy', 'paste', '-', 'selectAll', 'selectNone', 'delete']);
    })));
    // 帮助
    this.put('help', new Menu(mxUtils.bind(this, function(menu, parent)
    {
        this.addMenuItems(menu, ['about']);
    })));
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.put = function(name, menu)
{
    this.menus[name] = menu;

    return menu;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.get = function(name)
{
    return this.menus[name];
};

/**
 * Adds the given submenu.
 */
Menus.prototype.addSubmenu = function(name, menu, parent, label)
{
    var entry = this.get(name);

    if (entry != null)
    {
        var enabled = entry.isEnabled();

        if (menu.showDisabled || enabled)
        {
            var submenu = menu.addItem(label || mxResources.get(name), null, null, parent, null, enabled);
            this.addMenu(name, menu, submenu);
        }
    }
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.addMenu = function(name, popupMenu, parent)
{
    var menu = this.get(name);

    if (menu != null && (popupMenu.showDisabled || menu.isEnabled()))
    {
        this.get(name).execute(popupMenu, parent);
    }
};

/**
 * Adds a menu item to insert a table.
 */
Menus.prototype.addInsertTableItem = function(menu)
{
    // KNOWN: Does not work in IE8 standards and quirks
    var graph = this.editorUi.editor.graph;

    function createTable(rows, cols)
    {
        var html = ['<table>'];

        for (var i = 0; i < rows; i++)
        {
            html.push('<tr>');

            for (var j = 0; j < cols; j++)
            {
                html.push('<td><br></td>');
            }

            html.push('</tr>');
        }

        html.push('</table>');

        return html.join('');
    }

    // Show table size dialog
    var elt2 = menu.addItem('', null, mxUtils.bind(this, function(evt)
    {
        var td = graph.getParentByName(mxEvent.getSource(evt), 'TD');

        if (td != null)
        {
            var row2 = graph.getParentByName(td, 'TR');

            // To find the new link, we create a list of all existing links first
    		// LATER: Refactor for reuse with code for finding inserted image below
            var tmp = graph.cellEditor.textarea.getElementsByTagName('table');
            var oldTables = [];

            for (var i = 0; i < tmp.length; i++)
            {
                oldTables.push(tmp[i]);
            }

            // Finding the new table will work with insertHTML, but IE does not support that
            graph.container.focus();
            graph.pasteHtmlAtCaret(createTable(row2.sectionRowIndex + 1, td.cellIndex + 1));

            // Moves cursor to first table cell
            var newTables = graph.cellEditor.textarea.getElementsByTagName('table');

            if (newTables.length == oldTables.length + 1)
            {
                // Inverse order in favor of appended tables
                for (var i = newTables.length - 1; i >= 0; i--)
                {
                    if (i == 0 || newTables[i] != oldTables[i - 1])
                    {
                        graph.selectNode(newTables[i].rows[0].cells[0]);
                        break;
                    }
                }
            }
        }
    }));

    // Quirks mode does not add cell padding if cell is empty, needs good old spacer solution
    var quirksCellHtml = '<img src="' + mxClient.imageBasePath + '/transparent.gif' + '" width="16" height="16"/>';

    function createPicker(rows, cols)
    {
        var table2 = document.createElement('table');
        table2.setAttribute('border', '1');
        table2.style.borderCollapse = 'collapse';

        if (!mxClient.IS_QUIRKS)
        {
            table2.setAttribute('cellPadding', '8');
        }

        for (var i = 0; i < rows; i++)
        {
            var row = table2.insertRow(i);

            for (var j = 0; j < cols; j++)
            {
                var cell = row.insertCell(-1);

                if (mxClient.IS_QUIRKS)
                {
                    cell.innerHTML = quirksCellHtml;
                }
            }
        }

        return table2;
    }

    function extendPicker(picker, rows, cols)
    {
        for (var i = picker.rows.length; i < rows; i++)
        {
            var row = picker.insertRow(i);

            for (var j = 0; j < picker.rows[0].cells.length; j++)
            {
                var cell = row.insertCell(-1);

                if (mxClient.IS_QUIRKS)
                {
                    cell.innerHTML = quirksCellHtml;
                }
            }
        }

        for (var i = 0; i < picker.rows.length; i++)
        {
            var row = picker.rows[i];

            for (var j = row.cells.length; j < cols; j++)
            {
                var cell = row.insertCell(-1);

                if (mxClient.IS_QUIRKS)
                {
                    cell.innerHTML = quirksCellHtml;
                }
            }
        }
    }

    elt2.firstChild.innerHTML = '';
    var picker = createPicker(5, 5);
    elt2.firstChild.appendChild(picker);

    var label = document.createElement('div');
    label.style.padding = '4px';
    label.style.fontSize = Menus.prototype.defaultFontSize + 'px';
    label.innerHTML = '1x1';
    elt2.firstChild.appendChild(label);

    mxEvent.addListener(picker, 'mouseover', function(e)
    {
        var td = graph.getParentByName(mxEvent.getSource(e), 'TD');

        if (td != null)
        {
            var row2 = graph.getParentByName(td, 'TR');
            extendPicker(picker, Math.min(20, row2.sectionRowIndex + 2), Math.min(20, td.cellIndex + 2));
            label.innerHTML = (td.cellIndex + 1) + 'x' + (row2.sectionRowIndex + 1);

            for (var i = 0; i < picker.rows.length; i++)
            {
                var r = picker.rows[i];

                for (var j = 0; j < r.cells.length; j++)
                {
                    var cell = r.cells[j];

                    if (i <= row2.sectionRowIndex && j <= td.cellIndex)
                    {
                        cell.style.backgroundColor = 'blue';
                    }
                    else
                    {
                        cell.style.backgroundColor = 'white';
                    }
                }
            }

            mxEvent.consume(e);
        }
    });
};

/**
 * Adds a style change item to the given menu.
 */
Menus.prototype.edgeStyleChange = function(menu, label, keys, values, sprite, parent, reset)
{
    return menu.addItem(label, null, mxUtils.bind(this, function()
    {
        var graph = this.editorUi.editor.graph;
        graph.stopEditing(false);

        graph.getModel().beginUpdate();
        try
        {
            var cells = graph.getSelectionCells();
            var edges = [];

            for (var i = 0; i < cells.length; i++)
            {
                var cell = cells[i];

                if (graph.getModel().isEdge(cell))
                {
                    if (reset)
                    {
                        var geo = graph.getCellGeometry(cell);

                        // Resets all edge points
                        if (geo != null)
                        {
                            geo = geo.clone();
                            geo.points = null;
                            graph.getModel().setGeometry(cell, geo);
                        }
                    }

                    for (var j = 0; j < keys.length; j++)
                    {
                        graph.setCellStyles(keys[j], values[j], [cell]);
                    }

                    edges.push(cell);
                }
            }

            this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', keys,
                'values', values, 'cells', edges));
        }
        finally
        {
            graph.getModel().endUpdate();
        }
    }), parent, sprite);
};

/**
 * Adds a style change item to the given menu.
 */
Menus.prototype.styleChange = function(menu, label, keys, values, sprite, parent, fn, post)
{
    var apply = this.createStyleChangeFunction(keys, values);

    return menu.addItem(label, null, mxUtils.bind(this, function()
    {
        var graph = this.editorUi.editor.graph;

        if (fn != null && graph.cellEditor.isContentEditing())
        {
            fn();
        }
        else
        {
            apply(post);
        }
    }), parent, sprite);
};

/**
 *
 */
Menus.prototype.createStyleChangeFunction = function(keys, values)
{
    return mxUtils.bind(this, function(post)
    {
        var graph = this.editorUi.editor.graph;
        graph.stopEditing(false);

        graph.getModel().beginUpdate();
        try
        {
            for (var i = 0; i < keys.length; i++)
            {
                graph.setCellStyles(keys[i], values[i]);
            }

            if (post != null)
            {
                post();
            }
            this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', keys, 'values', values,
                'cells', graph.getSelectionCells()));
        }
        finally
        {
            graph.getModel().endUpdate();
        }
    });
};

/**
 * Adds a style change item with a prompt to the given menu.
 */
Menus.prototype.promptChange = function(menu, label, hint, defaultValue, key, parent, enabled, fn, sprite)
{
    return menu.addItem(label, null, mxUtils.bind(this, function()
    {
        var graph = this.editorUi.editor.graph;
        var value = defaultValue;
    	var state = graph.getView().getState(graph.getSelectionCell());

    	if (state != null)
    	{
    		value = state.style[key] || value;
    	}

        var dlg = new FilenameDialog(this.editorUi, value, mxResources.get('apply'), mxUtils.bind(this, function(newValue)
        {
            if (newValue != null && newValue.length > 0)
            {
                graph.getModel().beginUpdate();
                try
                {
                    graph.stopEditing(false);
                    graph.setCellStyles(key, newValue);
                }
                finally
                {
                    graph.getModel().endUpdate();
                }

                if (fn != null)
                {
                    fn(newValue);
                }
            }
        }), mxResources.get('enterValue') + ((hint.length > 0) ? (' ' + hint) : ''));
        this.editorUi.showDialog(dlg.container, 300, 80, true, true);
        dlg.init();
    }), parent, sprite, enabled);
};

/**
 * Adds a handler for showing a menu in the given element.
 */
Menus.prototype.pickColor = function(key, cmd, defaultValue)
{
    var graph = this.editorUi.editor.graph;

    if (cmd != null && graph.cellEditor.isContentEditing())
    {
        // Saves and restores text selection for in-place editor
        var selState = graph.cellEditor.saveSelection();

        var dlg = new ColorDialog(this.editorUi, defaultValue || '000000', mxUtils.bind(this, function(color)
        {
            graph.cellEditor.restoreSelection(selState);
            document.execCommand(cmd, false, (color != mxConstants.NONE) ? color : 'transparent');
        }), function()
        {
            graph.cellEditor.restoreSelection(selState);
        });
        this.editorUi.showDialog(dlg.container, 230, 430, true, true);
        dlg.init();
    }
    else
    {
        if (this.colorDialog == null)
        {
            this.colorDialog = new ColorDialog(this.editorUi);
        }

        this.colorDialog.currentColorKey = key;
        var state = graph.getView().getState(graph.getSelectionCell());
        var color = 'none';

        if (state != null)
        {
            color = state.style[key] || color;
        }

        if (color == 'none')
        {
            color = 'ffffff';
            this.colorDialog.picker.fromString('ffffff');
            this.colorDialog.colorInput.value = 'none';
        }
        else
        {
            this.colorDialog.picker.fromString(color);
        }

        this.editorUi.showDialog(this.colorDialog.container, 230, 430, true, true);
        this.colorDialog.init();
    }
};

/**
 * Adds a handler for showing a menu in the given element.
 */
Menus.prototype.toggleStyle = function(key, defaultValue)
{
    var graph = this.editorUi.editor.graph;
    var value = graph.toggleCellStyles(key, defaultValue);
    this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [key], 'values', [value],
        'cells', graph.getSelectionCells()));
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addMenuItem = function(menu, key, parent, trigger, sprite, label)
{
    var action = this.editorUi.actions.get(key);
    if (action != null && (menu.showDisabled || action.isEnabled()) && action.visible)
    {
        var item = menu.addItem(label || action.label, null, function()
        {
            action.funct(trigger);
        }, parent, sprite, action.isEnabled());

        // Adds checkmark image
        if (action.toggleAction && action.isSelected())
        {
            menu.addCheckmark(item, Editor.checkmarkImage);
        }
        // 右键菜单，快捷键提示
        this.addShortcut(item, action);

        return item;
    }

    return null;
};

/**
 * Adds a checkmark to the given menuitem.
 */
Menus.prototype.addShortcut = function(item, action)
{
    if (action.shortcut != null)
    {
        var td = item.lastChild;
        var span = document.createElement('span');
        mxUtils.write(span, action.shortcut);
        td.appendChild(span);
    }
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addMenuItems = function(menu, keys, parent, trigger, sprites)
{
    for (var i = 0; i < keys.length; i++)
    {
        if (keys[i] == '-')
        {
            menu.addSeparator(parent);
        }
        else
        {
            this.addMenuItem(menu, keys[i], parent, trigger, (sprites != null) ? sprites[i] : null);
        }
    }
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.createPopupMenu = function(menu, cell, evt)
{
    var graph = this.editorUi.editor.graph;
    menu.smartSeparators = true;
    // 未选择节点
    if (graph.isSelectionEmpty())
    {
        this.addMenuItems(menu, ['undo', 'redo', 'paste'], null, evt);
    } else {
        cell = graph.getSelectionCell();
        var state = graph.view.getState(cell);
        if (state != null)
        {
            var shapeName = state.style.shape;
            // if (graph.getSelectionCount() > 1 && shapeName !== 'menuCell' && shapeName !== 'menulist')
            // {
            //     // 选择多个节点，增加组合操作
            //     menu.addSeparator();
            //     this.addMenuItems(menu, ['group'], null, evt);
            // }
            // else if (graph.getSelectionCount() == 1 && !graph.getModel().isEdge(cell) && !graph.isSwimlane(cell) &&
			// 		graph.getModel().getChildCount(cell) > 0 && shapeName !== 'menulist')
            // {
            //     // 选择组合内的节点，增加取消组合操作
            //     menu.addSeparator();
            //     this.addMenuItems(menu, ['ungroup'], null, evt);
            // }
            // 选中单个节点,展示不同的右键菜单
            if (graph.getSelectionCount() == 1)
            {
                // console.log(!graph.getModel().isEdge(cell))
                // console.log(!graph.isSwimlane(cell))
                // console.log(graph.getModel().getChildCount(cell) > 0)
                // console.log(shapeName)
                if (!graph.getModel().isEdge(cell) && !graph.isSwimlane(cell) && graph.getModel().getChildCount(cell) > 0 && shapeName !== 'menulist') {
                    // 选择组合内的节点，增加取消组合操作
                    menu.addSeparator();
                    // this.addMenuItems(menu, ['ungroup'], null, evt);
                    this.addMenuItems(menu, ['copy', 'cut', 'paste', '-', 'toFront', 'toBack', '-', 'group', 'ungroup', '-', 'resetHide', 'delete'], null, evt);
                } else {
                    // tableBox 表格  menulist: 菜单 图片 image 按钮 button
                    if (shapeName == "menuCell") { // 直接后面操作
                        // this.addMenuItems(menu, ['delete', 'edit','-'], null, evt);
                    } else if (shapeName == "menulist") { // 菜单
                        // this.addMenuItems(menu, ['delete', '-'], null, evt);
                        this.addMenuItems(menu, ['copy', 'cut', 'paste', '-'], null, evt);
                    } else {
                        if (shapeName !== 'tableCell') {
                            this.addMenuItems(menu, ['copy', 'cut', 'paste', '-'], null, evt);
                        }
                        // this.addMenuItems(menu, ['cut', 'copy', 'delete','-'], null, evt);
                    }
                    let cellArray = ['menuCell', 'tableCell']
                    if (!cellArray.includes(shapeName)) {
                        this.addMenuItems(menu, ['toFront', 'toBack', '-'], null, evt);
                        menu.addSeparator();
                        this.addMenuItems(menu, ['group', 'ungroup', '-'], null, evt);
                    }
                    menu.addSeparator();
                    let arr = ['rectangle','ellipse', 'button', 'menulist', 'image', 'multipleCheck', 'singleCheck', 'select', 'tableBox', 'beeline', 'endarrow', 'curve', 'linkTag','text','right','progress','pipeline1','pipeline2']
                    if (arr.includes(shapeName)) {
                        this.addMenuItems(menu, ['resetHide', '-', 'delete'], null, evt);
                    }
                    if(shapeName == 'linkTag') {
                        // 链接
                        this.addMenuItem(menu, 'configLink', null, evt).firstChild.innerHTML = '配置...';
                    } else if (shapeName == 'rectangle') {
                        // 矩形
                        // this.addMenuItem(menu, 'paletteData', null, evt);
                    } else if (shapeName === 'select') {
                        // 下拉列表
                        this.addMenuItem(menu, 'selectProp', null, evt).firstChild.innerHTML = '属性...';
                    } else if (shapeName == 'image') {
                        // 编辑图片
                        this.addMenuItem(menu, 'image', null, evt).firstChild.innerHTML = '选择图片...';
                    } else if (shapeName == 'menuCell') {
                        // 菜单
                        this.addMenuItems(menu, ['insertMenuBefore', 'insertMenuAfter', 'delete'], null, evt);
                    } else if (this.editorUi.sidebar.primitives.indexOf(shapeName) != -1) {
                        // 图元
                        this.addMenuItems(menu, ['changePrimitive', 'paletteData'], null, evt);
                    } else if (shapeName == 'tableCell') {
                        // 单元格
                        this.addMenuItems(menu, ['addUpRow', 'addLowerRow', 'deleteRow','-', 'addLeftCol', 'addRightCol', 'deleteCol'], null, evt);
                    }
                }
            } else if (graph.getSelectionCount() > 1){
                menu.addSeparator();
                this.addMenuItems(menu, ['copy', 'cut', 'paste', '-', 'toFront', 'toBack', '-', 'group', 'ungroup', '-', 'resetHide', 'delete'], null, evt);
            }
        }
    }
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.createMenubar = function(container)
{
    var menubar = new Menubar(this.editorUi, container);
    var menus = this.defaultMenuItems;

    // logo
    var logoImg = document.createElement('img');
    logoImg.className = 'geLogo'
    logoImg.setAttribute('src', '/static/images/icons/logo.png');
    container.appendChild(logoImg);

    for (var i = 0; i < menus.length; i++)
    {
        (mxUtils.bind(this, function(menu)
        {
            var elt = menubar.addMenu(mxResources.get(menus[i]), mxUtils.bind(this, function()
            {
                // Allows extensions of menu.funct
                menu.funct.apply(this, arguments);
            }));

            this.menuCreated(menu, elt);
        }))(this.get(menus[i]));
    }

    return menubar;
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.menuCreated = function(menu, elt, className)
{
    if (elt != null)
    {
        className = (className != null) ? className : 'geItem';

        menu.addListener('stateChanged', function()
        {
            elt.enabled = menu.enabled;

            if (!menu.enabled)
            {
                elt.className = className + ' mxDisabled';

                if (document.documentMode == 8)
                {
                    elt.style.color = '#c3c3c3';
                }
            }
            else
            {
                elt.className = className;

                if (document.documentMode == 8)
                {
                    elt.style.color = '';
                }
            }
        });
    }
};

/**
 * Construcs a new menubar for the given editor.
 */
function Menubar(editorUi, container)
{
    this.editorUi = editorUi;
    this.container = container;
}

/**
 * Adds the menubar elements.
 */
Menubar.prototype.hideMenu = function()
{
    this.editorUi.hideCurrentMenu();
};

/**
 * Adds a submenu to this menubar.
 */
Menubar.prototype.addMenu = function(label, funct, before)
{
    var elt = document.createElement('a');
    elt.setAttribute('href', 'javascript:void(0);');
    elt.setAttribute('ondragstart', 'return false;');
    elt.className = 'geItem';
    mxUtils.write(elt, label);
    this.addMenuHandler(elt, funct);

    if (before != null)
    {
    	this.container.insertBefore(elt, before);
    }
    else
    {
    	this.container.appendChild(elt);
    }

    return elt;
};

/**
 * Adds a handler for showing a menu in the given element.
 */
Menubar.prototype.addMenuHandler = function(elt, funct)
{
    if (funct != null)
    {
        var show = true;

        var clickHandler = mxUtils.bind(this, function(evt)
        {
            this.editorUi.sidebar.hidePageContextMenu();
            if (show && elt.enabled == null || elt.enabled)
            {
                this.editorUi.editor.graph.popupMenuHandler.hideMenu();
                var menu = new mxPopupMenu(funct);
                menu.div.className += ' geMenubarMenu';
                menu.smartSeparators = true;
                menu.showDisabled = true;
                menu.autoExpand = true;
                // Disables autoexpand and destroys menu when hidden
                menu.hideMenu = mxUtils.bind(this, function(e)
                {
                    this.editorUi.currentMenuElt.className = 'geItem';
                    mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
                    this.editorUi.resetCurrentMenu();
                    menu.destroy();
                });

                var offset = mxUtils.getOffset(elt);
                menu.popup(offset.x, offset.y + elt.offsetHeight, null, evt);
                this.editorUi.setCurrentMenu(menu, elt);
            }

            mxEvent.consume(evt);
        });

        // 点击之后的鼠标移动
        mxEvent.addListener(elt, 'mousemove', mxUtils.bind(this, function(evt)
        {
            if (this.editorUi.currentMenu != null && this.editorUi.currentMenuElt != elt)
            {
                this.editorUi.currentMenuElt.className = 'geItem';
                elt.className += ' activeMenu';

                this.editorUi.hideCurrentMenu();
                clickHandler(evt);
            }
        }));

        // 隐藏菜单
        mxEvent.addListener(elt, 'mousedown', mxUtils.bind(this, function()
        {
            elt.className += ' activeMenu';
            show = this.currentElt != elt;
        }));

        mxEvent.addListener(elt, 'click', mxUtils.bind(this, function(evt)
        {
            clickHandler(evt);
            show = true;
        }));
    }
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menubar.prototype.destroy = function()
{
    // do nothing
};

/**
 * Constructs a new action for the given parameters.
 */
function Menu(funct, enabled)
{
    mxEventSource.call(this);
    this.funct = funct;
    this.enabled = (enabled != null) ? enabled : true;
}

// Menu inherits from mxEventSource
mxUtils.extend(Menu, mxEventSource);

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.isEnabled = function()
{
    return this.enabled;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.setEnabled = function(value)
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
Menu.prototype.execute = function(menu, parent)
{
    this.funct(menu, parent);
};

/**
 * "Installs" menus in EditorUi.
 */
EditorUi.prototype.createMenus = function()
{
    return new Menus(this);
};

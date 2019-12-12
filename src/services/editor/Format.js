/* eslint-disable */
/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
import {ChangePageSetup} from './Init'
export var Format = function(editorUi, container)
{
    this.editorUi = editorUi;
    this.container = container;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.labelIndex = 3;

/**
 * Returns information about the current selection.
 */
Format.prototype.currentIndex = 0;

/**
 * Returns information about the current selection.
 */
Format.prototype.showCloseButton = false;

/**
 * Background color for inactive tabs.
 */
Format.prototype.inactiveTabBackgroundColor = '#FFFFFF';

/**
 * Background color for inactive tabs.
 */
Format.prototype.roundableShapes = ['label', 'rectangle', 'internalStorage', 'corner',
    'parallelogram', 'swimlane', 'triangle', 'trapezoid',
    'ext', 'step', 'tee', 'process', 'link',
    'rhombus', 'offPageConnector', 'loopLimit', 'hexagon',
    'manualInput', 'curlyBracket', 'singleArrow', 'callout',
    'doubleArrow', 'flexArrow', 'card', 'umlLifeline'];

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.init = function()
{
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    this.update = mxUtils.bind(this, function(sender, evt)
    {
        this.clearSelectionState();
        this.refresh();
    });
	
    graph.getSelectionModel().addListener(mxEvent.CHANGE, this.update);
};

/**
 * Returns information about the current selection.
 */
Format.prototype.clearSelectionState = function()
{
    this.selectionState = null;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.getSelectionState = function()
{
    if (this.selectionState == null)
    {
        this.selectionState = this.createSelectionState();
    }
	
    return this.selectionState;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.createSelectionState = function()
{
    var cells = this.editorUi.editor.graph.getSelectionCells();
    var result = this.initSelectionState();
	
    for (var i = 0; i < cells.length; i++)
    {
        this.updateSelectionStateForCell(result, cells[i], cells);
    }
	
    return result;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.initSelectionState = function()
{
    return {vertices: [], edges: [], x: null, y: null, width: null, height: null, style: {},
        containsImage: false, containsLabel: false, fill: true, autoSize: false, image: true, shadow: false, lineJumps: true};
};

/**
 * Returns information about the current selection.
 */
Format.prototype.updateSelectionStateForCell = function(result, cell, cells)
{
    var graph = this.editorUi.editor.graph;
    var state = graph.view.getState(cell);
    if (graph.getModel().isVertex(cell) || state.style.shape === 'curve')
    {
        result.vertices.push(cell);
        var geo = graph.getCellGeometry(cell);
		
        if (geo != null)
        {
            if (geo.width > 0)
            {
                if (result.width == null)
                {
                    result.width = geo.width;
                }
                else if (result.width != geo.width)
                {
                    result.width = '';
                }
            }
            else
            {
                result.containsLabel = true;
            }
			
            if (geo.height > 0)
            {
                if (result.height == null)
                {
                    result.height = geo.height;
                }
                else if (result.height != geo.height)
                {
                    result.height = '';
                }
            }
            else
            {
                result.containsLabel = true;
            }
			
            if (!geo.relative || geo.offset != null)
            {
                var x = (geo.relative) ? geo.offset.x : geo.x;
                var y = (geo.relative) ? geo.offset.y : geo.y;
				
                if (result.x == null)
                {
                    result.x = x;
                }
                else if (result.x != x)
                {
                    result.x = '';
                }
				
                if (result.y == null)
                {
                    result.y = y;
                }
                else if (result.y != y)
                {
                    result.y = '';
                }
            }
        }
    }
    else if (graph.getModel().isEdge(cell))
    {
        result.edges.push(cell);
    }

	
    if (state != null)
    {
        result.autoSize = result.autoSize || this.isAutoSizeState(state);
        result.glass = result.glass && this.isGlassState(state);
        result.rounded = result.rounded && this.isRoundedState(state);
        result.lineJumps = result.lineJumps && this.isLineJumpState(state);
        result.comic = result.comic && this.isComicState(state);
        result.image = result.image && this.isImageState(state);
        result.shadow = result.shadow && this.isShadowState(state);
        result.fill = result.fill && this.isFillState(state);
		
        var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
        result.containsImage = result.containsImage || shape == 'image';
		
        for (var key in state.style)
        {
            var value = state.style[key];
			
            if (value != null)
            {
                if (result.style[key] == null)
                {
                    result.style[key] = value;
                }
                else if (result.style[key] != value)
                {
                    result.style[key] = '';
                }
            }
        }
    }
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isFillState = function(state)
{
    return state.view.graph.model.isVertex(state.cell) ||
		mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == 'arrow' ||
		mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == 'filledEdge' ||
		mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == 'flexArrow';
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isGlassState = function(state)
{
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
    return (shape == 'label' || shape == 'rectangle' || shape == 'internalStorage' ||
			shape == 'ext' || shape == 'umlLifeline' || shape == 'swimlane' ||
			shape == 'process');
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isRoundedState = function(state)
{
    return (state.shape != null) ? state.shape.isRoundable() :
        mxUtils.indexOf(this.roundableShapes, mxUtils.getValue(state.style,
            mxConstants.STYLE_SHAPE, null)) >= 0;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isLineJumpState = function(state)
{
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
    var curved = mxUtils.getValue(state.style, mxConstants.STYLE_CURVED, false);
	
    return !curved && (shape == 'connector' || shape == 'filledEdge');
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isComicState = function(state)
{
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
    return mxUtils.indexOf(['label', 'rectangle', 'internalStorage', 'corner', 'parallelogram', 'note', 'collate',
	                        'swimlane', 'triangle', 'trapezoid', 'ext', 'step', 'tee', 'process', 'link', 'rhombus',
	                        'offPageConnector', 'loopLimit', 'hexagon', 'manualInput', 'singleArrow', 'doubleArrow',
	                        'flexArrow', 'filledEdge', 'card', 'umlLifeline', 'connector', 'folder', 'component', 'sortShape',
	                        'cross', 'umlFrame', 'cube', 'isoCube', 'isoRectangle', 'partialRectangle'], shape) >= 0;
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isAutoSizeState = function(state)
{
    return mxUtils.getValue(state.style, mxConstants.STYLE_AUTOSIZE, null) == '1';
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isImageState = function(state)
{
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
    return (shape == 'label' || shape == 'image');
};

/**
 * Returns information about the current selection.
 */
Format.prototype.isShadowState = function(state)
{
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
    return (shape != 'image');
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.clear = function()
{
    this.container.innerHTML = '';
	
    // Destroy existing panels
    if (this.panels != null)
    {
        for (var i = 0; i < this.panels.length; i++)
        {
            this.panels[i].destroy();
        }
    }
	
    this.panels = [];
};
var BaseFormatPanel = function(format, editorUi, container)
{
    this.format = format;
    this.editorUi = editorUi;
    this.container = container;
    this.listeners = [];
};
window.BaseFormatPanel = BaseFormatPanel
/**
 * Adds the given color option.
 */
BaseFormatPanel.prototype.getSelectionState = function()
{
    var graph = this.editorUi.editor.graph;
    var cells = graph.getSelectionCells();
    var shape = null;

    for (var i = 0; i < cells.length; i++)
    {
        var state = graph.view.getState(cells[i]);
		
        if (state != null)
        {
            var tmp = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
			
            if (tmp != null)
            {
                if (shape == null)
                {
                    shape = tmp;
                }
                else if (shape != tmp)
                {
                    return null;
                }
            }
			
        }
    }
	
    return shape;
};

/**
 * Install input handler.
 */
BaseFormatPanel.prototype.installInputHandler = function(input, key, defaultValue, min, max, unit, textEditFallback, isFloat)
{
    unit = (unit != null) ? unit : '';
    isFloat = (isFloat != null) ? isFloat : false;
	
    var ui = this.editorUi;
    var graph = ui.editor.graph;
	
    min = (min != null) ? min : 1;
    max = (max != null) ? max : 999;
	
    var selState = null;
    var updating = false;
	
    var update = mxUtils.bind(this, function(evt)
    {
        var value = (isFloat) ? parseFloat(input.value) : parseInt(input.value);
        // Special case: angle mod 360
        if (!isNaN(value) && key == mxConstants.STYLE_ROTATION)
        {
            // Workaround for decimal rounding errors in floats is to
            // use integer and round all numbers to two decimal point
            value = mxUtils.mod(Math.round(value * 100), 36000) / 100;
        }
		
        value = Math.min(max, Math.max(min, (isNaN(value)) ? defaultValue : value));
		
        if (graph.cellEditor.isContentEditing() && textEditFallback)
        {
            if (!updating)
            {
                updating = true;
				
                if (selState != null)
                {
                    graph.cellEditor.restoreSelection(selState);
                    selState = null;
                }
				
                textEditFallback(value);
                input.value = value + unit;
	
                // Restore focus and selection in input
                updating = false;
            }
        }
        else if (!isNaN(value))
        {
            if (graph.isEditing())
            {
                graph.stopEditing(true);
            }
			
            graph.getModel().beginUpdate();
            try
            {
                var shapeName = graph.view.getState(graph.getSelectionCell()).style.shape;
                let ss = shapeName === 'tableBox' || shapeName === 'menulist' ? graph.getSelectionCells().concat(graph.getSelectionCell().children) : graph.getSelectionCells();
                graph.setCellStyles(key, value, ss);

                if (key == mxConstants.STYLE_FONTSIZE)
                {
                    graph.updateLabelElements(ss, function(elt)
                    {
                        elt.style.fontSize = value + 'px';
                        elt.removeAttribute('size');
                    });
                }
				
                ui.fireEvent(new mxEventObject('styleChanged', 'keys', [key],
                    'values', [value], 'cells', ss));
            }
            finally
            {
                graph.getModel().endUpdate();
            }
        }
		
        input.value = value + unit;
        mxEvent.consume(evt);
    });

    if (textEditFallback && graph.cellEditor.isContentEditing())
    {
        // KNOWN: Arrow up/down clear selection text in quirks/IE 8
        // Text size via arrow button limits to 16 in IE11. Why?
        mxEvent.addListener(input, 'mousedown', function()
        {
            if (document.activeElement == graph.cellEditor.textarea)
            {
                selState = graph.cellEditor.saveSelection();
            }
        });
		
        mxEvent.addListener(input, 'touchstart', function()
        {
            if (document.activeElement == graph.cellEditor.textarea)
            {
                selState = graph.cellEditor.saveSelection();
            }
        });
    }
	
    mxEvent.addListener(input, 'change', update);
    mxEvent.addListener(input, 'blur', update);
	
    return update;
};

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createPanel = function()
{
    var div = document.createElement('div');	
    return div;
};

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createTitle = function(title)
{
    var div = document.createElement('p');
    div.style.padding = '12px 0px 3px';
    div.style.whiteSpace = 'nowrap';
    div.style.overflow = 'hidden';
    div.style.lineHeight = '12px';
    div.style.width = '100%';
    // div.style.float = 'left';
    mxUtils.write(div, title);	
    return div;
};

/**
 * 
 */
BaseFormatPanel.prototype.createStepper = function(input, update, step, height, disableFocus, defaultValue)
{
    step = (step != null) ? step : 1;
    height =  12;
	
    if (mxClient.IS_QUIRKS)
    {
        height = height - 2;
    }
    else if (mxClient.IS_MT || document.documentMode >= 8)
    {
        height = height + 1;
    } 
	
    var stepper = document.createElement('div');
    stepper.style.border = '1px solid rgb(192, 192, 192)';
    stepper.style.width = '10px';
    stepper.style.position = 'relative';
    stepper.style.left = '-10px';
    stepper.style.border = 'none';

    var up = document.createElement('div');
    up.style.position = 'relative';
    up.style.height = height + 'px';
    up.style.width = '10px';
    up.className = 'geBtnUp';
    stepper.appendChild(up);
	
    var down = up.cloneNode(false);
    down.style.border = 'none';
    down.style.height = height + 'px';
    down.className = 'geBtnDown';
    stepper.appendChild(down);

    mxEvent.addListener(down, 'click', function(evt)
    {
        if (input.value == '')
        {
            input.value = defaultValue || '2';
        }
		
        var val = parseInt(input.value);
		
        if (!isNaN(val))
        {
            input.value = val - step;
			
            if (update != null)
            {
                update(evt);
            }
        }
		
        mxEvent.consume(evt);
    });
	
    mxEvent.addListener(up, 'click', function(evt)
    {
        if (input.value == '')
        {
            input.value = defaultValue || '0';
        }
		
        var val = parseInt(input.value);
		
        if (!isNaN(val))
        {
            input.value = val + step;
			
            if (update != null)
            {
                update(evt);
            }
        }
		
        mxEvent.consume(evt);
    });
	
    // Disables transfer of focus to DIV but also :active CSS
    // so it's only used for fontSize where the focus should
    // stay on the selected text, but not for any other input.
    if (disableFocus)
    {
        var currentSelection = null;
		
        mxEvent.addGestureListeners(stepper,
            function(evt)
            {
                // Workaround for lost current selection in page because of focus in IE
                if (mxClient.IS_QUIRKS || document.documentMode == 8)
                {
                    currentSelection = document.selection.createRange();
                }
				
                mxEvent.consume(evt);
            },
            null,
            function(evt)
            {
                // Workaround for lost current selection in page because of focus in IE
                if (currentSelection != null)
                {
                    try
                    {
                        currentSelection.select();
                    }
                    catch (e)
                    {
                        // ignore
                    }
					
                    currentSelection = null;
                    mxEvent.consume(evt);
                }
            }
        );
    }
	
    return stepper;
};

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createOption = function(label, isCheckedFn, setCheckedFn, listener)
{
    var div = document.createElement('div');
    div.style.padding = '6px 0px 1px 0px';
    div.style.whiteSpace = 'nowrap';
    div.style.overflow = 'hidden';
    div.style.width = '200px';
    div.style.height = (mxClient.IS_QUIRKS) ? '27px' : '24px';
	
    var cb = document.createElement('input');
    cb.setAttribute('type', 'checkbox');
    cb.style.margin = '0px 6px 0px 0px';
    div.appendChild(cb);

    var span = document.createElement('span');
    mxUtils.write(span, label);
    div.appendChild(span);

    var applying = false;
    var value = isCheckedFn();
	
    var apply = function(newValue)
    {
        if (!applying)
        {
            applying = true;
			
            if (newValue)
            {
                cb.setAttribute('checked', 'checked');
                cb.defaultChecked = true;
                cb.checked = true;
            }
            else
            {
                cb.removeAttribute('checked');
                cb.defaultChecked = false;
                cb.checked = false;
            }
			
            if (value != newValue)
            {
                value = newValue;
				
                // Checks if the color value needs to be updated in the model
                if (isCheckedFn() != value)
                {
                    setCheckedFn(value);
                }
            }
			
            applying = false;
        }
    };

    mxEvent.addListener(div, 'click', function(evt)
    {
        if (cb.getAttribute('disabled') != 'disabled')
        {
            // Toggles checkbox state for click on label
            var source = mxEvent.getSource(evt);
			
            if (source == div || source == span)
            {
                cb.checked = !cb.checked;
            }
			
            apply(cb.checked);
        }
    });
	
    apply(value);
	
    if (listener != null)
    {
        listener.install(apply);
        this.listeners.push(listener);
    }

    return div;
};

/**
 * The string 'null' means use null in values.
 */
BaseFormatPanel.prototype.createCellOption = function(label, key, defaultValue, enabledValue, disabledValue, fn, action, stopEditing)
{
    enabledValue = (enabledValue != null) ? ((enabledValue == 'null') ? null : enabledValue) : '1';
    disabledValue = (disabledValue != null) ? ((disabledValue == 'null') ? null : disabledValue) : '0';
	
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
	
    return this.createOption(label, function()
    {
        // Seems to be null sometimes, not sure why...
        var state = graph.view.getState(graph.getSelectionCell());
		
        if (state != null)
        {
            return mxUtils.getValue(state.style, key, defaultValue) != disabledValue;
        }
		
        return null;
    }, function(checked)
    {
        if (stopEditing)
        {
            graph.stopEditing();
        }
		
        if (action != null)
        {
            action.funct();
        }
        else
        {
            graph.getModel().beginUpdate();
            try
            {
                var value = (checked) ? enabledValue : disabledValue;
                graph.setCellStyles(key, value, graph.getSelectionCells());
				
                if (fn != null)
                {
                    fn(graph.getSelectionCells(), value);
                }
				
                ui.fireEvent(new mxEventObject('styleChanged', 'keys', [key],
                    'values', [value], 'cells', graph.getSelectionCells()));
            }
            finally
            {
                graph.getModel().endUpdate();
            }
        }
    },
    {
        install: function(apply)
        {
            this.listener = function()
            {
                // Seems to be null sometimes, not sure why...
                var state = graph.view.getState(graph.getSelectionCell());
				
                if (state != null)
                {
                    apply(mxUtils.getValue(state.style, key, defaultValue) != disabledValue);
                }
            };
			
            graph.getModel().addListener(mxEvent.CHANGE, this.listener);
        },
        destroy: function()
        {
            graph.getModel().removeListener(this.listener);
        }
    });
};
 
/**
 * 
 */
BaseFormatPanel.prototype.addUnitInput = function(container, unit, left, width, update, step, marginTop, disableFocus)
{
    marginTop = (marginTop != null) ? marginTop : 0;
	
    var input = document.createElement('input');
    input.style.float = 'left';
    container.appendChild(input);
	
    var stepper = this.createStepper(input, update, step, null, disableFocus);
    stepper.style.float = 'left';
    container.appendChild(stepper);

    return input;
};
 
/**
 * 
 */
BaseFormatPanel.prototype.createRelativeOption = function(label, key, width, handler, init)
{
    width = (width != null) ? width : 44;
	
    var graph = this.editorUi.editor.graph;
    var div = this.createPanel();
    div.style.paddingTop = '10px';
    div.style.paddingBottom = '10px';
    mxUtils.write(div, label);
    // div.style.fontWeight = 'bold';
	
    var update = mxUtils.bind(this, function(evt)
    {
        if (handler != null)
        {
            handler(input);
        }
        else
        {
            var value = parseInt(input.value);
            value = Math.min(100, Math.max(0, (isNaN(value)) ? 100 : value));
            var state = graph.view.getState(graph.getSelectionCell());
			
            if (state != null && value != mxUtils.getValue(state.style, key, 100))
            {
                // Removes entry in style (assumes 100 is default for relative values)
                if (value == 100)
                {
                    value = null;
                }
				
                graph.setCellStyles(key, value, graph.getSelectionCells());
                this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [key],
                    'values', [value], 'cells', graph.getSelectionCells()));
            }
	
            input.value = ((value != null) ? value : '100') + ' %';
        }
		
        mxEvent.consume(evt);
    });

    var input = this.addUnitInput(div, '%', 20, width, update, 10, -15, handler != null);

    if (key != null)
    {
        var listener = mxUtils.bind(this, function(sender, evt, force)
        {
            if (force || input != document.activeElement)
            {
                var ss = this.format.getSelectionState();
                var tmp = parseInt(mxUtils.getValue(ss.style, key, 100));
                input.value = (isNaN(tmp)) ? '' : tmp + ' %';
            }
        });
		
        mxEvent.addListener(input, 'keydown', function(e)
        {
            if (e.keyCode == 13)
            {
                graph.container.focus();
                mxEvent.consume(e);
            }
            else if (e.keyCode == 27)
            {
                listener(null, null, true);
                graph.container.focus();
                mxEvent.consume(e);
            }
        });
		
        graph.getModel().addListener(mxEvent.CHANGE, listener);
        this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
        listener();
    }

    mxEvent.addListener(input, 'blur', update);
    mxEvent.addListener(input, 'change', update);
	
    if (init != null)
    {
        init(input);
    }

    return div;
};

/**
 * 
 */
BaseFormatPanel.prototype.addLabel = function(div, title, right, width)
{
    width = (width != null) ? width : 61;
	
    var label = document.createElement('div');
    mxUtils.write(label, title);
    label.style.position = 'absolute';
    label.style.right = right + 'px';
    label.style.width = width + 'px';
    label.style.marginTop = '6px';
    label.style.textAlign = 'center';
    div.appendChild(label);
};

/**
 * 
 */
BaseFormatPanel.prototype.addKeyHandler = function(input, listener)
{
    mxEvent.addListener(input, 'keydown', mxUtils.bind(this, function(e)
    {
        if (e.keyCode == 13)
        {
            this.editorUi.editor.graph.container.focus();
            mxEvent.consume(e);
        }
        else if (e.keyCode == 27)
        {
            if (listener != null)
            {
                listener(null, null, true);				
            }

            this.editorUi.editor.graph.container.focus();
            mxEvent.consume(e);
        }
    }));
};

/**
 * Adds the label menu items to the given menu and parent.
 */
BaseFormatPanel.prototype.destroy = function()
{
    if (this.listeners != null)
    {
        for (var i = 0; i < this.listeners.length; i++)
        {
            this.listeners[i].destroy();
        }
		
        this.listeners = null;
    }
};
 
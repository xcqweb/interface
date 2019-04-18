/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
Format = function(editorUi, container)
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
	graph.addListener(mxEvent.EDITING_STARTED, this.update);
	graph.addListener(mxEvent.EDITING_STOPPED, this.update);
	graph.getModel().addListener(mxEvent.CHANGE, this.update);
	graph.addListener(mxEvent.ROOT, mxUtils.bind(this, function()
	{
		this.refresh();
	}));
	
	editor.addListener('autosaveChanged', mxUtils.bind(this, function()
	{
		this.refresh();
	}));
	
	this.refresh();
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
	
	if (graph.getModel().isVertex(cell))
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

	var state = graph.view.getState(cell);
	
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

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.refresh = function()
{
	if (this.container.style.width == '0px')
	{
		return;
	}
	
	this.clear();
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	
	var div = document.createElement('div');
	div.style.whiteSpace = 'nowrap';
	div.style.cursor = 'default';
	
	var label = document.createElement('div');
	label.style.border = '1px solid #CCCCCC';
	label.style.borderWidth = '1px 0px 1px 0px';
	label.style.textAlign = 'center';
	label.className = "geTitle";
	label.style.padding = 0;
	label.style.margin = 0;
	label.style.overflow = 'hidden';
	label.style.float = 'left';
	label.style.height = '34px';
	label.style.lineHeight = '32px';
	label.style.width = '100%';
	this.container.appendChild(div);

	var containsLabel = this.getSelectionState().containsLabel;
	var currentLabel = null;
	var currentPanel = null;
	var addClickHandler = mxUtils.bind(this, function(elt, panel, index)
	{
		var clickHandler = mxUtils.bind(this, function(evt)
		{
			if (currentLabel != elt)
			{
				if (containsLabel)
				{
					this.labelIndex = index;
				}
				else
				{
					this.currentIndex = index;
				}
				
				if (currentLabel != null)
				{
					currentLabel.style.backgroundColor = '#FAFAFA';	
					currentLabel.style.color = '#000000';
				}
				
				currentLabel = elt;
				currentLabel.style.color = '#FFFFFF';
				currentLabel.style.backgroundColor = '#3D91F7';
				
				if (currentPanel != panel)
				{
					if (currentPanel != null)
					{
						currentPanel.style.display = 'none';
					}
					
					currentPanel = panel;
					currentPanel.style.display = '';
				}
			}
		});
		
		mxEvent.addListener(elt, 'click', clickHandler);
		
		if (index == ((containsLabel) ? this.labelIndex : this.currentIndex))
		{
			// Invokes handler directly as a workaround for no click on DIV in KHTML.
			clickHandler();
		}
	});
	
	var idx = 0;
	label.style.width = '50%';
	var label2 = label.cloneNode(false);

	// tab标签页
	// 交互
	mxUtils.write(label2, mxResources.get('interaction'));
	div.appendChild(label2);

	var propertiesPanel = div.cloneNode(false);
	propertiesPanel.className = 'formatPannel'
	propertiesPanel.style.display = 'none';
	this.panels.push(new ActionsPanel(this, ui, propertiesPanel));
	this.container.appendChild(propertiesPanel);
	
	// 样式
	mxUtils.write(label, mxResources.get('style'));
	div.appendChild(label);
	
	var arrangePanel = div.cloneNode(false);
	arrangePanel.className = 'formatPannel'
	arrangePanel.style.display = 'none';
	arrangePanel.style.paddingLeft = '10px';
	this.panels.push(new ArrangePanel(this, ui, arrangePanel));
	this.container.appendChild(arrangePanel);

	addClickHandler(label2, propertiesPanel, idx++);
	addClickHandler(label, arrangePanel, idx++);
};

/**
 * Base class for format panels.
 */
BaseFormatPanel = function(format, editorUi, container)
{
	this.format = format;
	this.editorUi = editorUi;
	this.container = container;
	this.listeners = [];
};

/**
 * 
 */
BaseFormatPanel.prototype.buttonBackgroundColor = 'white';
/**
 * 给已经选中的控件设置属性
 */
BaseFormatPanel.prototype.setCellAttrs = function (key, value) {
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var cell = graph.getSelectionCell();
	var cellInfo = graph.getModel().getValue(cell);
	// 转换类型
	if (!mxUtils.isNode(cellInfo))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', cellInfo || '');
		cellInfo = obj;
	};
	cellInfo.setAttribute(key, value);
	graph.getModel().setValue(cell, cellInfo);
};
/**
 * 获取控件设置属性
 */
BaseFormatPanel.prototype.getCellAttrs = function (key, cellname) {
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var cell = cellname || graph.getSelectionCell();
	var cellInfo = graph.getModel().getValue(cell);
	// 转换类型
	if (!mxUtils.isNode(cellInfo))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', cellInfo || '');
		cellInfo = obj;
	};
	return cellInfo.attributes[key] && cellInfo.attributes[key].nodeValue || '';
};

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
		else if (value != mxUtils.getValue(this.format.getSelectionState().style, key, defaultValue))
		{
			if (graph.isEditing())
			{
				graph.stopEditing(true);
			}
			
			graph.getModel().beginUpdate();
			try
			{
				graph.setCellStyles(key, value, graph.getSelectionCells());
				
				// Handles special case for fontSize where HTML labels are parsed and updated
				if (key == mxConstants.STYLE_FONTSIZE)
				{
					graph.updateLabelElements(graph.getSelectionCells(), function(elt)
					{
						elt.style.fontSize = value + 'px';
						elt.removeAttribute('size');
					});
				}
				
				ui.fireEvent(new mxEventObject('styleChanged', 'keys', [key],
						'values', [value], 'cells', graph.getSelectionCells()));
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
	div.style.margin = '12px 0px 3px';
	div.style.whiteSpace = 'nowrap';
	div.style.overflow = 'hidden';
	div.style.lineHeight = '12px';
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
 * 增加一个颜色操作.
 */
BaseFormatPanel.prototype.createColorOption = function(label, getColorFn, setColorFn, defaultColor, listener, callbackFn, hideCheckbox)
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
	if (!hideCheckbox)
	{
		div.appendChild(cb);	
	}

	var span = document.createElement('span');
	mxUtils.write(span, label);
	div.appendChild(span);
	
	var applying = false;
	var value = getColorFn();

	var btn = null;

	var apply = function(color, disableUpdate, forceUpdate)
	{
		if (!applying)
		{
			applying = true;
			btn.innerHTML = '<div style="width: 110px;height: 16px;margin: 3px;background-color:' +
				((color != null && color != mxConstants.NONE) ? color : defaultColor) + ';"></div>';
			
			btn.style.display = color ? '' : 'none';

			if (callbackFn != null)
			{
				callbackFn(color);
			}

			if (!disableUpdate)
			{
				value = color;
				// 检查是否需要更新
				if (forceUpdate || getColorFn() != value)
				{
					setColorFn(value);
				}
			}
			
			applying = false;
		}
	};

	btn = mxUtils.button('', mxUtils.bind(this, function(evt)
	{
		this.editorUi.pickColor(value, function(color)
		{
			apply(color, null, true);
		});
		mxEvent.consume(evt);
	}));
	
	btn.style.height = '24px';
	btn.className = 'geColorBtn';
	btn.style.display = (!value || value == 'none') ? 'none' : '';

	// mxEvent.addListener(btn, 'click', function(evt)
	// {
	// 	var source = mxEvent.getSource(evt);
	// 	if (source == cb || source.nodeName != 'INPUT')
	// 	{		
	// 		// Toggles checkbox state for click on label
	// 		if (source != cb)
	// 		{
	// 			cb.checked = !cb.checked;
	// 		}
	
	// 		// Overrides default value with current value to make it easier
	// 		// to restore previous value if the checkbox is clicked twice
	// 		if (!cb.checked && value != null && value != mxConstants.NONE &&
	// 			defaultColor != mxConstants.NONE)
	// 		{
	// 			defaultColor = value;
	// 		}
			
	// 		apply((cb.checked) ? defaultColor : mxConstants.NONE);
	// 	}
	// });

	apply(value, true);
	if (listener != null)
	{
		listener.install(apply);
		this.listeners.push(listener);
	}
	
	return btn;
};

/**
 * 创建颜色选择器
 */
BaseFormatPanel.prototype.createCellColorOption = function(label, colorKey, defaultColor, callbackFn, setStyleFn)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	return this.createColorOption(label, function()
	{
		// Seems to be null sometimes, not sure why...
		var state = graph.view.getState(graph.getSelectionCell());
		if (state != null)
		{
			return mxUtils.getValue(state.style, colorKey, null);
		}
		
		return null;
	}, function(color)
	{
		graph.getModel().beginUpdate();
		try
		{
			if (setStyleFn != null)
			{
				setStyleFn(color);
			}
			graph.setCellStyles(colorKey, color, graph.getSelectionCells());
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', [colorKey],
				'values', [color], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	}, defaultColor || mxConstants.NONE,
	{
		install: function(apply)
		{
			this.listener = function()
			{
				// Seems to be null sometimes, not sure why...
				var state = graph.view.getState(graph.getSelectionCell());
				
				if (state != null)
				{
					apply(mxUtils.getValue(state.style, colorKey, null));
				}
			};
			
			graph.getModel().addListener(mxEvent.CHANGE, this.listener);
		},
		destroy: function()
		{
			graph.getModel().removeListener(this.listener);
		}
	}, callbackFn, true);
};

/**
 * 
 */
BaseFormatPanel.prototype.addArrow = function(elt, height)
{
	height = (height != null) ? height : 10;
	
	var arrow = document.createElement('div');
	arrow.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
	arrow.style.padding = '6px';
	arrow.style.paddingRight = '4px';
	
	var m = (10 - height);
	
	if (m == 2)
	{
		arrow.style.paddingTop = 6 + 'px';
	}
	else if (m > 0)
	{
		arrow.style.paddingTop = (6 - m) + 'px';
	}
	else
	{
		arrow.style.marginTop = '-2px';
	}
	
	arrow.style.height = height + 'px';
	arrow.style.borderLeft = '1px solid #a0a0a0';
	arrow.innerHTML = '<img border="0" src="' + ((mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHBJREFUeNpidHB2ZyAGsACxDRBPIKCuA6TwCBB/h2rABu4A8SYmKCcXiP/iUFgAxL9gCi8A8SwsirZCMQMTkmANEH9E4v+CmsaArvAdyNFI/FlQ92EoBIE+qCRIUz168DBgsU4OqhinQpgHMABAgAEALY4XLIsJ20oAAAAASUVORK5CYII=' :
		IMAGE_PATH + '/dropdown.png') + '" style="margin-bottom:4px;">';
	mxUtils.setOpacity(arrow, 70);
	
	var symbol = elt.getElementsByTagName('div')[0];
	
	if (symbol != null)
	{
		symbol.style.paddingRight = '6px';
		symbol.style.marginLeft = '4px';
		symbol.style.marginTop = '-1px';
		symbol.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
		mxUtils.setOpacity(symbol, 60);
	}

	mxUtils.setOpacity(elt, 100);
	elt.style.border = '1px solid #a0a0a0';
	elt.style.backgroundColor = this.buttonBackgroundColor;
	elt.style.backgroundImage = 'none';
	elt.style.width = 'auto';
	elt.className += ' geColorBtn';
	mxUtils.setPrefixedStyle(elt.style, 'borderRadius', '3px');
	
	elt.appendChild(arrow);
	
	return symbol;
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
 * 添加文本输入框
 */
BaseFormatPanel.prototype.addTextInput = function(container, unit, right, width, update, step, marginTop, disableFocus)
{
	marginTop = (marginTop != null) ? marginTop : 0;
	
	var input = document.createElement('input');
	input.style.position = 'absolute';
	input.style.textAlign = 'left';
	input.style.marginTop = '-2px';
	input.style.right = (right + 12) + 'px';
	input.style.width = width + 'px';
	container.appendChild(input);

	return input;
};
/**
 * 添加下拉框
 */
BaseFormatPanel.prototype.addUnitSelect = function name(container, width, list, selectOp, desc) 
{
	// 添加抬头
	desc && container.appendChild(this.createTitle(desc));
	// 下拉框
	var dirSelect = document.createElement('select');
	dirSelect.style.width = width + 'px';
	dirSelect.style.float = 'unset';
	dirSelect.className = "formatMiddleSelect";

	var dirs = list;
	for (var i = 0; i < dirs.length; i++)
	{
		var dirOption = document.createElement('option');
		dirOption.setAttribute('value', dirs[i]);
		// mxUtils.write(dirOption, mxResources.get(dirs[i]));
		if (selectOp == dirs[i]) {
			dirOption.setAttribute('selected', 'selected')
		}
		mxUtils.write(dirOption, dirs[i]);
		dirSelect.appendChild(dirOption);
	}
	container.appendChild(dirSelect);
	return dirSelect;
}

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
 * 
 */
BaseFormatPanel.prototype.styleButtons = function(elts)
{
	for (var i = 0; i < elts.length; i++)
	{
		mxUtils.setPrefixedStyle(elts[i].style, 'borderRadius', '3px');
		mxUtils.setOpacity(elts[i], 100);
		elts[i].style.border = '1px solid #a0a0a0';
		elts[i].style.padding = '4px';
		elts[i].style.paddingTop = '3px';
		elts[i].style.paddingRight = '1px';
		elts[i].style.margin = '1px';
		elts[i].style.width = '31px';
		elts[i].style.height = '29px';
		elts[i].className += ' geColorBtn';
	}
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

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	if (format.getSelectionState().vertices.length === 1) {
		this.baseInit();
		// this.TextInit();
		// this.styleInit();
		// this.init();
	}
};

mxUtils.extend(ArrangePanel, BaseFormatPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.init = function()
{
	var graph = this.editorUi.editor.graph;
	var ss = this.format.getSelectionState();

	// this.container.appendChild(this.addLayerOps(this.createPanel()));
	// Special case that adds two panels
	this.addGeometry(this.container);
	this.addEdgeGeometry(this.container);

	if (!ss.containsLabel || ss.edges.length == 0)
	{
		this.container.appendChild(this.addAngle(this.createPanel()));
	}
	
	if (!ss.containsLabel && ss.edges.length == 0)
	{
		// this.container.appendChild(this.addFlip(this.createPanel()));
	}

	if (ss.vertices.length > 1)
	{
		this.container.appendChild(this.addAlign(this.createPanel()));
		this.container.appendChild(this.addDistribute(this.createPanel()));
	}
	
	// this.container.appendChild(this.addGroupOps(this.createPanel()));
};

/**
 * 
 */
ArrangePanel.prototype.addLayerOps = function(div)
{
	var ui = this.editorUi;
	
	var btn = mxUtils.button(mxResources.get('toFront'), function(evt)
	{
		ui.actions.get('toFront').funct();
	})
	
	btn.setAttribute('title', mxResources.get('toFront') + ' (' + this.editorUi.actions.get('toFront').shortcut + ')');
	btn.style.width = '100px';
	btn.style.marginRight = '2px';
	div.appendChild(btn);
	
	var btn = mxUtils.button(mxResources.get('toBack'), function(evt)
	{
		ui.actions.get('toBack').funct();
	})
	
	btn.setAttribute('title', mxResources.get('toBack') + ' (' + this.editorUi.actions.get('toBack').shortcut + ')');
	btn.style.width = '100px';
	div.appendChild(btn);
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addGroupOps = function(div)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var cell = graph.getSelectionCell();
	var ss = this.format.getSelectionState();
	var count = 0;
	var btn = null;
	
	div.style.paddingTop = '8px';
	div.style.paddingBottom = '6px';

	if (graph.getSelectionCount() > 1)
	{
		btn = mxUtils.button(mxResources.get('group'), function(evt)
		{
			ui.actions.get('group').funct();
		})
		
		btn.setAttribute('title', mxResources.get('group') + ' (' + this.editorUi.actions.get('group').shortcut + ')');
		btn.style.width = '202px';
		btn.style.marginBottom = '2px';
		div.appendChild(btn);
		count++;
	}
	else if (graph.getSelectionCount() == 1 && !graph.getModel().isEdge(cell) && !graph.isSwimlane(cell) &&
			graph.getModel().getChildCount(cell) > 0)
	{
		btn = mxUtils.button(mxResources.get('ungroup'), function(evt)
		{
			ui.actions.get('ungroup').funct();
		})
		
		btn.setAttribute('title', mxResources.get('ungroup') + ' (' +
			this.editorUi.actions.get('ungroup').shortcut + ')');
		btn.style.width = '202px';
		btn.style.marginBottom = '2px';
		div.appendChild(btn);
		count++;
	}
	
	if (ss.vertices.length > 0)
	{
		
	}
	
	if (graph.getSelectionCount() == 1 && graph.getModel().isVertex(cell) &&
   		graph.getModel().isVertex(graph.getModel().getParent(cell)))
	{		
		btn = mxUtils.button(mxResources.get('removeFromGroup'), function(evt)
		{
			ui.actions.get('removeFromGroup').funct();
		})
		
		btn.setAttribute('title', mxResources.get('removeFromGroup'));
		btn.style.width = '202px';
		btn.style.marginBottom = '2px';
		div.appendChild(btn);
		count++;
	}
	
	
	if (count == 0)
	{
		div.style.display = 'none';
	}
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addAlign = function(div)
{
	var graph = this.editorUi.editor.graph;
	div.style.paddingTop = '6px';
	div.style.paddingBottom = '12px';
	div.appendChild(this.createTitle(mxResources.get('align')));
	
	var stylePanel = document.createElement('div');
	stylePanel.style.position = 'relative';
	stylePanel.style.paddingLeft = '0px';
	stylePanel.style.borderWidth = '0px';
	stylePanel.className = 'geToolbarContainer';
	
	if (mxClient.IS_QUIRKS)
	{
		div.style.height = '60px';
	}
	
	var left = this.editorUi.toolbar.addButton('geSprite-alignleft', mxResources.get('left'),
		function() { graph.alignCells(mxConstants.ALIGN_LEFT); }, stylePanel);
	var center = this.editorUi.toolbar.addButton('geSprite-aligncenter', mxResources.get('center'),
		function() { graph.alignCells(mxConstants.ALIGN_CENTER); }, stylePanel);
	var right = this.editorUi.toolbar.addButton('geSprite-alignright', mxResources.get('right'),
		function() { graph.alignCells(mxConstants.ALIGN_RIGHT); }, stylePanel);

	var top = this.editorUi.toolbar.addButton('geSprite-aligntop', mxResources.get('top'),
		function() { graph.alignCells(mxConstants.ALIGN_TOP); }, stylePanel);
	var middle = this.editorUi.toolbar.addButton('geSprite-alignmiddle', mxResources.get('middle'),
		function() { graph.alignCells(mxConstants.ALIGN_MIDDLE); }, stylePanel);
	var bottom = this.editorUi.toolbar.addButton('geSprite-alignbottom', mxResources.get('bottom'),
		function() { graph.alignCells(mxConstants.ALIGN_BOTTOM); }, stylePanel);
	
	this.styleButtons([left, center, right, top, middle, bottom]);
	right.style.marginRight = '6px';
	div.appendChild(stylePanel);
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addFlip = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	div.style.paddingTop = '6px';
	div.style.paddingBottom = '10px';

	var span = document.createElement('div');
	span.style.marginTop = '2px';
	span.style.marginBottom = '8px';
	mxUtils.write(span, mxResources.get('flip'));
	div.appendChild(span);
	
	var btn = mxUtils.button(mxResources.get('horizontal'), function(evt)
	{
		graph.toggleCellStyles(mxConstants.STYLE_FLIPH, false);
	})
	
	btn.setAttribute('title', mxResources.get('horizontal'));
	btn.style.width = '100px';
	btn.style.marginRight = '2px';
	div.appendChild(btn);
	
	var btn = mxUtils.button(mxResources.get('vertical'), function(evt)
	{
		graph.toggleCellStyles(mxConstants.STYLE_FLIPV, false);
	})
	
	btn.setAttribute('title', mxResources.get('vertical'));
	btn.style.width = '100px';
	div.appendChild(btn);
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addDistribute = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	div.style.paddingTop = '6px';
	div.style.paddingBottom = '12px';
	
	div.appendChild(this.createTitle(mxResources.get('distribute')));

	var btn = mxUtils.button(mxResources.get('horizontal'), function(evt)
	{
		graph.distributeCells(true);
	})
	
	btn.setAttribute('title', mxResources.get('horizontal'));
	btn.style.width = '100px';
	btn.style.marginRight = '2px';
	div.appendChild(btn);
	
	var btn = mxUtils.button(mxResources.get('vertical'), function(evt)
	{
		graph.distributeCells(false);
	})
	
	btn.setAttribute('title', mxResources.get('vertical'));
	btn.style.width = '100px';
	div.appendChild(btn);
	
	return div;
};

/**
 * 增加角度操作框
 */
ArrangePanel.prototype.addAngle = function(container)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = this.format.getSelectionState();
	container.appendChild(this.createTitle('角度'));

	var div = document.createElement('div');
	div.style.overflow = 'hidden';
	var update;
	// 输入框
	var input = this.addUnitInput(div, '°', 20, 44, function()
	{
		update.apply(this, arguments);
	});
	input.className = 'formatMiddleInput';
	update = this.installInputHandler(input, mxConstants.STYLE_ROTATION, 0, 0, 360, '°', null, true);
	
	// 旋转90
	var trunBtn = document.createElement('span');
	trunBtn.className = 'formatMiddleBtn';
	trunBtn.style.marginLeft = '-6px';
	trunBtn.innerText = '旋转90度';
	div.appendChild(trunBtn);
	var listener = mxUtils.bind(this, function(sender, evt, force, num)
	{
		if (force || document.activeElement != input)
		{
			ss = this.format.getSelectionState();
			var tmp = num || parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_ROTATION, 0));
			input.value = (isNaN(tmp)) ? '' : tmp  + '°';
		}
	});

	mxEvent.addListener(trunBtn, 'click', function (e) {
		input.value = '90°';
		update(input, mxConstants.STYLE_ROTATION, 90, 0, 360, '°', null, true);
	}.bind(this))

	this.addKeyHandler(input, listener);
	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();
	container.appendChild(div);
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addGeometry = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var rect = this.format.getSelectionState();
	container.appendChild(this.createTitle('大小'));
	
	var div = document.createElement('div');
	div.style.paddingBottom = '8px';
	div.style.overflow = 'hidden';

	// 宽高
	var widthUpdate, heightUpdate;
	var width = this.addUnitInput(div, 'px', 0, 44, function()
	{
		widthUpdate.apply(this, arguments);
	});
	width.className = 'formatMiddleInput';

	var autosizeBtn = document.createElement('div');
	autosizeBtn.className = 'geSprite geSprite-fit';
	autosizeBtn.setAttribute('title', mxResources.get('autosize') + ' (' + this.editorUi.actions.get('autosize').shortcut + ')');
	mxUtils.setOpacity(autosizeBtn, 50);
	
	mxEvent.addListener(autosizeBtn, 'mouseenter', function()
	{
		mxUtils.setOpacity(autosizeBtn, 100);
	});
	
	mxEvent.addListener(autosizeBtn, 'mouseleave', function()
	{
		mxUtils.setOpacity(autosizeBtn, 50);
	});

	mxEvent.addListener(autosizeBtn, 'click', function()
	{
		ui.actions.get('autosize').funct();
	});
	
	div.appendChild(autosizeBtn);
	// 高度
	var height = this.addUnitInput(div, 'px', 60, 44, function()
	{
		heightUpdate.apply(this, arguments);
	});
	height.className = 'formatMiddleInput';

	var wrapper = document.createElement('div');
	wrapper.style.paddingTop = '8px';
	wrapper.style.paddingRight = '20px';
	wrapper.style.whiteSpace = 'nowrap';
	wrapper.style.textAlign = 'right';
	
	// div.appendChild(wrapper);
	
	this.addKeyHandler(width, listener);
	this.addKeyHandler(height, listener);
	
	var constrainCheckbox = {checked: true};
	widthUpdate = this.addGeometryHandler(width, function(geo, value)
	{
		if (geo.width > 0)
		{
			var value = Math.max(1, value);
			if (constrainCheckbox.checked)
			{
				geo.height = Math.round((geo.height  * value * 100) / geo.width) / 100;
			}
			geo.width = value;
		}
	});
	heightUpdate = this.addGeometryHandler(height, function(geo, value)
	{
		if (geo.height > 0)
		{
			var value = Math.max(1, value);
			if (constrainCheckbox.checked)
			{
				geo.width = Math.round((geo.width  * value * 100) / geo.height) / 100;
			}
			geo.height = value;
		}
	});
	
	container.appendChild(div);
	// console.log(graph.getSelectionCell())
	// console.log( graph.getModel().getValue(graph.getSelectionCell()).attributes)
	// console.log(this.format.getSelectionState())
	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		rect = this.format.getSelectionState();

		if (!rect.containsLabel && rect.vertices.length == graph.getSelectionCount() &&
			rect.width != null && rect.height != null)
		{
			div.style.display = '';
			
			if (force || document.activeElement != width)
			{
				width.value = rect.width + ((rect.width == '') ? '' : ' px');
			}
			
			if (force || document.activeElement != height)
			{
				height.value = rect.height + ((rect.height == '') ? '' : ' px');
			}
		}
		else
		{
			div.style.display = '';
		}
		
	});

	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }}); 
	listener();
};
/**
 * 
 */
ArrangePanel.prototype.addGeometryHandler = function(input, fn)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var initialValue = null;
	
	function update(evt)
	{
		if (input.value != '')
		{
			var value = parseFloat(input.value);

			if (value != initialValue)
			{
				graph.getModel().beginUpdate();
				try
				{
					var cells = graph.getSelectionCells();
					
					for (var i = 0; i < cells.length; i++)
					{
						if (graph.getModel().isVertex(cells[i]))
						{
							var geo = graph.getCellGeometry(cells[i]);
							
							if (geo != null)
							{
								geo = geo.clone();
								fn(geo, value);
								
								graph.getModel().setGeometry(cells[i], geo);
							}
						}
					}
				}
				finally
				{
					graph.getModel().endUpdate();
				}
				
				initialValue = value;
				input.value = value + ' px';
			}
			else if (isNaN(value)) 
			{
				input.value = initialValue + ' px';
			}
		}
		
		mxEvent.consume(evt);
	};

	mxEvent.addListener(input, 'blur', update);
	mxEvent.addListener(input, 'change', update);
	mxEvent.addListener(input, 'focus', function()
	{
		initialValue = input.value;
	});
	
	return update;
};

ArrangePanel.prototype.addEdgeGeometryHandler = function(input, fn)
{
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var initialValue = null;

    function update(evt)
    {
        if (input.value != '')
        {
            var value = parseFloat(input.value);

            if (isNaN(value))
            {
                input.value = initialValue + ' px';
            }
            else if (value != initialValue)
            {
                graph.getModel().beginUpdate();
                try
                {
                    var cells = graph.getSelectionCells();

                    for (var i = 0; i < cells.length; i++)
                    {
                        if (graph.getModel().isEdge(cells[i]))
                        {
                            var geo = graph.getCellGeometry(cells[i]);

                            if (geo != null)
                            {
                                geo = geo.clone();
                                fn(geo, value);

                                graph.getModel().setGeometry(cells[i], geo);
                            }
                        }
                    }
                }
                finally
                {
                    graph.getModel().endUpdate();
                }

                initialValue = value;
                input.value = value + ' px';
            }
        }

        mxEvent.consume(evt);
    };

    mxEvent.addListener(input, 'blur', update);
    mxEvent.addListener(input, 'change', update);
    mxEvent.addListener(input, 'focus', function()
    {
        initialValue = input.value;
    });

    return update;
};

/**
 * 
 */
ArrangePanel.prototype.addEdgeGeometry = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var rect = this.format.getSelectionState();
	
	var div = this.createPanel();
	
	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.width = '70px';
	span.style.marginTop = '0px';
	span.style.fontWeight = 'bold';
	mxUtils.write(span, mxResources.get('width'));
	div.appendChild(span);

	var widthUpdate, xtUpdate, ytUpdate, xsUpdate, ysUpdate;
	var width = this.addUnitInput(div, 'px', 20, 44, function()
	{
		widthUpdate.apply(this, arguments);
	});

	mxUtils.br(div);
	this.addKeyHandler(width, listener);
	
	function widthUpdate(evt)
	{
		// Maximum stroke width is 999
		var value = parseInt(width.value);
		value = Math.min(999, Math.max(1, (isNaN(value)) ? 1 : value));
		
		if (value != mxUtils.getValue(rect.style, 'width', mxCellRenderer.defaultShapes['flexArrow'].prototype.defaultWidth))
		{
			graph.setCellStyles('width', value, graph.getSelectionCells());
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', ['width'],
					'values', [value], 'cells', graph.getSelectionCells()));
		}

		width.value = value + ' px';
		mxEvent.consume(evt);
	};

	mxEvent.addListener(width, 'blur', widthUpdate);
	mxEvent.addListener(width, 'change', widthUpdate);

	container.appendChild(div);

	var divs = this.createPanel();
	divs.style.paddingBottom = '30px';

	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.width = '70px';
	span.style.marginTop = '0px';
	mxUtils.write(span, 'Start');
	divs.appendChild(span);

	var xs = this.addUnitInput(divs, 'px', 84, 44, function()
	{
		xsUpdate.apply(this, arguments);
	});
	var ys = this.addUnitInput(divs, 'px', 20, 44, function()
	{
		ysUpdate.apply(this, arguments);
	});

	mxUtils.br(divs);
	this.addLabel(divs, mxResources.get('left'), 84);
	this.addLabel(divs, mxResources.get('top'), 20);
	container.appendChild(divs);
	this.addKeyHandler(xs, listener);
	this.addKeyHandler(ys, listener);

	var divt = this.createPanel();
	divt.style.paddingBottom = '30px';

	var span = document.createElement('div');
	span.style.position = 'absolute';
	span.style.width = '70px';
	span.style.marginTop = '0px';
	mxUtils.write(span, 'End');
	divt.appendChild(span);

	var xt = this.addUnitInput(divt, 'px', 84, 44, function()
	{
		xtUpdate.apply(this, arguments);
	});
	var yt = this.addUnitInput(divt, 'px', 20, 44, function()
	{
		ytUpdate.apply(this, arguments);
	});

	mxUtils.br(divt);
	this.addLabel(divt, mxResources.get('left'), 84);
	this.addLabel(divt, mxResources.get('top'), 20);
	container.appendChild(divt);
	this.addKeyHandler(xt, listener);
	this.addKeyHandler(yt, listener);

	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		rect = this.format.getSelectionState();
		var cell = graph.getSelectionCell();
		
		if (rect.style.shape == 'link' || rect.style.shape == 'flexArrow')
		{
			div.style.display = '';
			
			if (force || document.activeElement != width)
			{
				var value = mxUtils.getValue(rect.style, 'width',
					mxCellRenderer.defaultShapes['flexArrow'].prototype.defaultWidth);
				width.value = value + ' px';
			}
		}
		else
		{
			div.style.display = 'none';
		}

		if (graph.getSelectionCount() == 1 && graph.model.isEdge(cell))
		{
			var geo = graph.model.getGeometry(cell);
			
			if (geo.sourcePoint != null && graph.model.getTerminal(cell, true) == null)
			{
				xs.value = geo.sourcePoint.x;
				ys.value = geo.sourcePoint.y;
			}
			else
			{
				divs.style.display = 'none';
			}
			
			if (geo.targetPoint != null && graph.model.getTerminal(cell, false) == null)
			{
				xt.value = geo.targetPoint.x;
				yt.value = geo.targetPoint.y;
			}
			else
			{
				divt.style.display = 'none';
			}
		}
		else
		{
			divs.style.display = 'none';
			divt.style.display = 'none';
		}
	});

	xsUpdate = this.addEdgeGeometryHandler(xs, function(geo, value)
	{
		geo.sourcePoint.x = value;
	});

	ysUpdate = this.addEdgeGeometryHandler(ys, function(geo, value)
	{
		geo.sourcePoint.y = value;
	});

	xtUpdate = this.addEdgeGeometryHandler(xt, function(geo, value)
	{
		geo.targetPoint.x = value;
	});

	ytUpdate = this.addEdgeGeometryHandler(yt, function(geo, value)
	{
		geo.targetPoint.y = value;
	});

	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();
};

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(TextFormatPanel, BaseFormatPanel);

/**
 * 增加基础操作部分
 */
ArrangePanel.prototype.baseInit = function () {
	this.addBase(this.container)
}
ArrangePanel.prototype.addBase = function (container) {
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	this.cell = graph.getSelectionCell();
	this.cellInfo = graph.getModel().getValue(this.cell);
	var rect = this.format.getSelectionState();
	// 转换类型
	if (!mxUtils.isNode(this.cellInfo))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', this.cellInfo || '');
		this.cellInfo = obj;
	};
	var attrs = this.cellInfo.attributes;
	this.attrs = attrs;
	var temp = {};
	if (attrs) {
		for (var i = 0; i < attrs.length; i++)
		{
			if ((attrs[i].nodeName != 'label') && attrs[i].nodeName != 'placeholders')
			{
				temp[attrs[i].nodeName] =  attrs[i].nodeValue;
			}
		}
	}
	// 名称
	this.addName(container);
	// 大小
	this.addGeometry(container);
	// 角度
	this.addAngle(container);
	// 边框
	this.addStroke(container);
	// 隐藏
	this.addShowHide(container);
}
/**
 * 名称
 */
ArrangePanel.prototype.addName = function (container) {
	container.appendChild(this.createTitle('名称'));
	var defaultValue = this.getCellAttrs('palettename');
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', defaultValue)
	// 监听事件`
	mxEvent.addListener(container, 'mousedown', function () {
		nameInput.blur()
	});
	mxEvent.addListener(nameInput, 'mousedown', function(evt)
	{
		if (evt.stopPropagation)
		{
			evt.stopPropagation();
		}
		
		evt.cancelBubble = true;
	});
	// 失去焦点
	mxEvent.addListener(nameInput, 'blur', function(evt)
	{
		this.setCellAttrs('palettename', evt.target.value);
	}.bind(this));
	nameInput.className = 'formatLargeInput'
	container.appendChild(nameInput);
}
/**
 * 显示还是隐藏
 */
ArrangePanel.prototype.addShowHide = function (container) {
	var div = document.createElement('div');
	div.style.marginTop = '12px';
	var span = document.createElement('span');
	span.innerText = '显示/隐藏';
	span.style.float = 'left';
	div.appendChild(span);
	var defaultValue = this.getCellAttrs('hide');
	// 按钮框
	var btnBox = document.createElement('div')
	btnBox.style.float = 'left';
	btnBox.style.width = '32px';
	btnBox.style.height = '16px';
	btnBox.style.borderRadius = '8px';
	btnBox.style.marginLeft = '4px';
	btnBox.style.backgroundColor = '#3D91F7';
	// 按钮
	var btn = document.createElement('span')
	if (defaultValue=='true') {
		btn.style.float ='right';
		btnBox.style.backgroundColor = '#A7A9AD';
	} else {
		btn.style.float = 'left';
		btnBox.style.backgroundColor = '#3D91F7';
	}
	btn.style.width = '16px';
	btn.style.height = '16px';
	btn.style.borderRadius = '8px';
	btn.style.backgroundColor = '#fff';
	btnBox.appendChild(btn);
	// 点击事件
	mxEvent.addListener(btnBox, 'click', function (evt) {
		this.setCellAttrs('hide', btn.style.float === 'left');
	}.bind(this))

	div.appendChild(btnBox);
	container.appendChild(div);
}
/**
 * 增加文本编辑样式内容
 */
ArrangePanel.prototype.TextInit = function()
{
	this.container.style.borderBottom = 'none';
	this.addFont(this.container);
};

/**
 * 增加文本编辑样式内容
 */
ArrangePanel.prototype.addFont = function(container)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = this.format.getSelectionState();

	var stylePanel = this.createPanel();
	stylePanel.style.paddingTop = '2px';
	stylePanel.style.paddingBottom = '2px';
	stylePanel.style.position = 'relative';
	stylePanel.style.marginLeft = '-2px';
	stylePanel.style.borderWidth = '0px';
	stylePanel.className = 'geToolbarContainer';
	
	if (mxClient.IS_QUIRKS)
	{
		stylePanel.style.display = 'block';
	}
	
	container.appendChild(stylePanel);
	
	var colorPanel = this.createPanel();
	colorPanel.style.marginTop = '8px';
	colorPanel.style.borderTop = '1px solid #c0c0c0';
	colorPanel.style.paddingTop = '6px';
	colorPanel.style.paddingBottom = '6px';

	var stylePanel2 = stylePanel.cloneNode(false);
	stylePanel2.style.marginLeft = '-3px';
	var fontStyleItems = this.editorUi.toolbar.addItems(['bold', 'italic', 'underline'], stylePanel2, true);
	fontStyleItems[0].setAttribute('title', mxResources.get('bold') + ' (' + this.editorUi.actions.get('bold').shortcut + ')');
	fontStyleItems[1].setAttribute('title', mxResources.get('italic') + ' (' + this.editorUi.actions.get('italic').shortcut + ')');
	fontStyleItems[2].setAttribute('title', mxResources.get('underline') + ' (' + this.editorUi.actions.get('underline').shortcut + ')');
	
	var verticalItem = this.editorUi.toolbar.addItems(['vertical'], stylePanel2, true)[0];
	
	if (mxClient.IS_QUIRKS)
	{
		mxUtils.br(container);
	}
	
	container.appendChild(stylePanel2);

	this.styleButtons(fontStyleItems);
	this.styleButtons([verticalItem]);
	
	var stylePanel3 = stylePanel.cloneNode(false);
	stylePanel3.style.marginLeft = '-3px';
	stylePanel3.style.paddingBottom = '0px';
	
	// Helper function to return a wrapper function does not pass any arguments
	var callFn = function(fn)
	{
		return function()
		{
			return fn();
		};
	};
	
	var left = this.editorUi.toolbar.addButton('geSprite-left', mxResources.get('left'),
			(graph.cellEditor.isContentEditing()) ?
			function()
			{
				document.execCommand('justifyleft', false, null);
			} : callFn(this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_LEFT])), stylePanel3);
	var center = this.editorUi.toolbar.addButton('geSprite-center', mxResources.get('center'),
			(graph.cellEditor.isContentEditing()) ?
			function()
			{
				document.execCommand('justifycenter', false, null);
			} : callFn(this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_CENTER])), stylePanel3);
	var right = this.editorUi.toolbar.addButton('geSprite-right', mxResources.get('right'),
			(graph.cellEditor.isContentEditing()) ?
			function()
			{
				document.execCommand('justifyright', false, null);
			} : callFn(this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_RIGHT])), stylePanel3);

	this.styleButtons([left, center, right]);

	if (graph.cellEditor.isContentEditing())
	{
		var clear = this.editorUi.toolbar.addButton('geSprite-removeformat', mxResources.get('removeFormat'),
			function()
			{
				document.execCommand('removeformat', false, null);
			}, stylePanel2);
		this.styleButtons([clear]);
	}
	
	var top = this.editorUi.toolbar.addButton('geSprite-top', mxResources.get('top'),
		callFn(this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_TOP])), stylePanel3);
	var middle = this.editorUi.toolbar.addButton('geSprite-middle', mxResources.get('middle'),
		callFn(this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_MIDDLE])), stylePanel3);
	var bottom = this.editorUi.toolbar.addButton('geSprite-bottom', mxResources.get('bottom'),
		callFn(this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_BOTTOM])), stylePanel3);
	
	this.styleButtons([top, middle, bottom]);
	
	if (mxClient.IS_QUIRKS)
	{
		mxUtils.br(container);
	}
	
	container.appendChild(stylePanel3);
	
	// Hack for updating UI state below based on current text selection
	// currentTable is the current selected DOM table updated below
	var sub, sup, full;
	
	if (graph.cellEditor.isContentEditing())
	{
		top.style.display = 'none';
		middle.style.display = 'none';
		bottom.style.display = 'none';
		verticalItem.style.display = 'none';
		
		full = this.editorUi.toolbar.addButton('geSprite-justifyfull', null,
			function()
			{
				document.execCommand('justifyfull', false, null);
			}, stylePanel3);
		this.styleButtons([full,
       		sub = this.editorUi.toolbar.addButton('geSprite-subscript',
       			mxResources.get('subscript') + ' (' + Editor.ctrlKey + '+,)',
			function()
			{
				document.execCommand('subscript', false, null);
			}, stylePanel3), sup = this.editorUi.toolbar.addButton('geSprite-superscript',
				mxResources.get('superscript') + ' (' + Editor.ctrlKey + '+.)',
			function()
			{
				document.execCommand('superscript', false, null);
			}, stylePanel3)]);
		full.style.marginRight = '9px';
		
		var tmp = stylePanel3.cloneNode(false);
		tmp.style.paddingTop = '4px';
		var btns = [this.editorUi.toolbar.addButton('geSprite-orderedlist', mxResources.get('numberedList'),
				function()
				{
					document.execCommand('insertorderedlist', false, null);
				}, tmp),
			this.editorUi.toolbar.addButton('geSprite-unorderedlist', mxResources.get('bulletedList'),
				function()
				{
					document.execCommand('insertunorderedlist', false, null);
				}, tmp),
			this.editorUi.toolbar.addButton('geSprite-outdent', mxResources.get('decreaseIndent'),
					function()
					{
						document.execCommand('outdent', false, null);
					}, tmp),
			this.editorUi.toolbar.addButton('geSprite-indent', mxResources.get('increaseIndent'),
				function()
				{
					document.execCommand('indent', false, null);
				}, tmp),
			this.editorUi.toolbar.addButton('geSprite-code', mxResources.get('html'),
				function()
				{
					graph.cellEditor.toggleViewMode();
				}, tmp)];
		this.styleButtons(btns);
		btns[btns.length - 1].style.marginLeft = '9px';
		
		if (mxClient.IS_QUIRKS)
		{
			mxUtils.br(container);
			tmp.style.height = '40';
		}
		
		container.appendChild(tmp);
	}
	else
	{
		fontStyleItems[2].style.marginRight = '9px';
		right.style.marginRight = '9px';
	}

	// Font size
	var input = document.createElement('input');
	input.style.textAlign = 'right';
	input.style.marginTop = '4px';
	
	if (!mxClient.IS_QUIRKS)
	{
		input.style.position = 'absolute';
		input.style.right = '32px';
	}
	
	input.style.width = '46px';
	input.style.height = (mxClient.IS_QUIRKS) ? '21px' : '17px';
	stylePanel2.appendChild(input);
	
	// Workaround for font size 4 if no text is selected is update font size below
	// after first character was entered (as the font element is lazy created)
	var pendingFontSize = null;

	var inputUpdate = this.installInputHandler(input, mxConstants.STYLE_FONTSIZE, Menus.prototype.defaultFontSize, 1, 999, ' px',
	function(fontSize)
	{
		// IE does not support containsNode
		// KNOWN: Fixes font size issues but bypasses undo
		if (window.getSelection && !mxClient.IS_IE && !mxClient.IS_IE11)
		{
			var selection = window.getSelection();
			var container = (selection.rangeCount > 0) ? selection.getRangeAt(0).commonAncestorContainer :
				graph.cellEditor.textarea;

			function updateSize(elt, ignoreContains)
			{
				if (elt != graph.cellEditor.textarea && graph.cellEditor.textarea.contains(elt) &&
					(ignoreContains || selection.containsNode(elt, true)))
				{
					if (elt.nodeName == 'FONT')
					{
						elt.removeAttribute('size');
						elt.style.fontSize = fontSize + 'px';
					}
					else
					{
						var css = mxUtils.getCurrentStyle(elt);
						
						if (css.fontSize != fontSize + 'px')
						{
							if (mxUtils.getCurrentStyle(elt.parentNode).fontSize != fontSize + 'px')
							{
								elt.style.fontSize = fontSize + 'px';
							}
							else
							{
								elt.style.fontSize = '';
							}
						}
					}
				}
			};
			
			// Wraps text node or mixed selection with leading text in a font element
			if (container == graph.cellEditor.textarea ||
				container.nodeType != mxConstants.NODETYPE_ELEMENT)
			{
				document.execCommand('fontSize', false, '1');
			}

			if (container != graph.cellEditor.textarea)
			{
				container = container.parentNode;
			}
			
			if (container.nodeType == mxConstants.NODETYPE_ELEMENT)
			{
				var elts = container.getElementsByTagName('*');
				updateSize(container);
				
				for (var i = 0; i < elts.length; i++)
				{
					updateSize(elts[i]);
				}
			}

			input.value = fontSize + ' px';
		}
		else if (window.getSelection || document.selection)
		{
			// Checks selection
			var par = null;
			
			if (document.selection)
			{
				par = document.selection.createRange().parentElement();
			}
			else
			{
				var selection = window.getSelection();
				
				if (selection.rangeCount > 0)
				{
					par = selection.getRangeAt(0).commonAncestorContainer;
				}
			}
			
			// Node.contains does not work for text nodes in IE11
			function isOrContains(container, node)
			{
			    while (node != null)
			    {
			        if (node === container)
			        {
			            return true;
			        }
			        
			        node = node.parentNode;
			    }
			    
			    return false;
			};
			
			if (par != null && isOrContains(graph.cellEditor.textarea, par))
			{
				pendingFontSize = fontSize;
				
				// Workaround for can't set font size in px is to change font size afterwards
				document.execCommand('fontSize', false, '4');
				var elts = graph.cellEditor.textarea.getElementsByTagName('font');
				
				for (var i = 0; i < elts.length; i++)
				{
					if (elts[i].getAttribute('size') == '4')
					{
						elts[i].removeAttribute('size');
						elts[i].style.fontSize = pendingFontSize + 'px';
			
						// Overrides fontSize in input with the one just assigned as a workaround
						// for potential fontSize values of parent elements that don't match
						window.setTimeout(function()
						{
							input.value = pendingFontSize + ' px';
							pendingFontSize = null;
						}, 0);
						
						break;
					}
				}
			}
		}
	}, true);
	
	var stepper = this.createStepper(input, inputUpdate, 1, 10, true, Menus.prototype.defaultFontSize);
	stepper.style.display = input.style.display;
	stepper.style.marginTop = '4px';
	
	if (!mxClient.IS_QUIRKS)
	{
		stepper.style.right = '20px';
	}
	
	stylePanel2.appendChild(stepper);
	
	
	var bgColorApply = null;
	var currentBgColor = '#ffffff';
	
	var fontColorApply = null;
	var currentFontColor = '#000000';
	
	var panel = (graph.cellEditor.isContentEditing()) ? this.createColorOption(mxResources.get('fontColor'), function()
	{
		return currentFontColor;
	}, function(color)
	{
		document.execCommand('forecolor', false, (color != mxConstants.NONE) ? color : 'transparent');
	}, '#000000',
	{
		install: function(apply) { fontColorApply = apply; },
		destroy: function() { fontColorApply = null; }
	}, null, true) : this.createCellColorOption(mxResources.get('fontColor'), mxConstants.STYLE_FONTCOLOR, '#000000', function(color)
	{
	}, function(color)
	{
		if (color == null || color == mxConstants.NONE)
		{
			graph.setCellStyles(mxConstants.STYLE_NOLABEL, '1', graph.getSelectionCells());
		}
		else
		{
			graph.setCellStyles(mxConstants.STYLE_NOLABEL, null, graph.getSelectionCells());
		}

		graph.updateLabelElements(graph.getSelectionCells(), function(elt)
		{
			elt.removeAttribute('color');
			elt.style.color = null;
		});
	});
	
	colorPanel.appendChild(panel);
	
	container.appendChild(colorPanel);
	
	function setSelected(elt, selected)
	{
		if (mxClient.IS_IE && (mxClient.IS_QUIRKS || document.documentMode < 10))
		{
			elt.style.filter = (selected) ? 'progid:DXImageTransform.Microsoft.Gradient('+
            	'StartColorStr=\'#c5ecff\', EndColorStr=\'#87d4fb\', GradientType=0)' : '';
		}
		else
		{
			elt.style.backgroundImage = (selected) ? 'linear-gradient(#c5ecff 0px,#87d4fb 100%)' : '';
		}
	};
	
	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		ss = this.format.getSelectionState();
		var fontStyle = mxUtils.getValue(ss.style, mxConstants.STYLE_FONTSTYLE, 0);
		setSelected(fontStyleItems[0], (fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD);
		setSelected(fontStyleItems[1], (fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC);
		setSelected(fontStyleItems[2], (fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE);

		setSelected(verticalItem, mxUtils.getValue(ss.style, mxConstants.STYLE_HORIZONTAL, '1') == '0');
		
		if (force || document.activeElement != input)
		{
			var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_FONTSIZE, Menus.prototype.defaultFontSize));
			input.value = (isNaN(tmp)) ? '' : tmp  + ' px';
		}
		
		var align = mxUtils.getValue(ss.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
		setSelected(left, align == mxConstants.ALIGN_LEFT);
		setSelected(center, align == mxConstants.ALIGN_CENTER);
		setSelected(right, align == mxConstants.ALIGN_RIGHT);
		
		var valign = mxUtils.getValue(ss.style, mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
		setSelected(top, valign == mxConstants.ALIGN_TOP);
		setSelected(middle, valign == mxConstants.ALIGN_MIDDLE);
		setSelected(bottom, valign == mxConstants.ALIGN_BOTTOM);
	});


	this.addKeyHandler(input, listener);

	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();
	
	if (graph.cellEditor.isContentEditing())
	{
		var updating = false;
		
		var updateCssHandler = function()
		{
			if (!updating)
			{
				updating = true;
			
				window.setTimeout(function()
				{
					var selectedElement = graph.getSelectedElement();
					var node = selectedElement;

					while (node != null && node.nodeType != mxConstants.NODETYPE_ELEMENT)
					{
						node = node.parentNode;
					}

					if (node != null)
					{
						// Workaround for commonAncestor on range in IE11 returning parent of common ancestor
						if (node == graph.cellEditor.textarea && graph.cellEditor.textarea.children.length == 1 &&
							graph.cellEditor.textarea.firstChild.nodeType == mxConstants.NODETYPE_ELEMENT)
						{
							node = graph.cellEditor.textarea.firstChild;
						}
						
						function getRelativeLineHeight(fontSize, lineHeight, elt)
						{
							if (elt.style.lineHeight.substring(elt.style.lineHeight.length - 1) == '%')
							{
								return parseInt(elt.style.lineHeight) / 100;
							}
							else
							{
								return (lineHeight.substring(lineHeight.length - 2) == 'px') ?
										parseFloat(lineHeight) / fontSize : parseInt(lineHeight);
							}
						};
						
						function getAbsoluteFontSize(fontSize)
						{
							if (fontSize.substring(fontSize.length - 2) == 'px')
							{
								return parseFloat(fontSize);
							}
							else
							{
								return mxConstants.DEFAULT_FONTSIZE;
							}
						}
						
						//var realCss = mxUtils.getCurrentStyle(selectedElement);
						var css = mxUtils.getCurrentStyle(node);
						var fontSize = getAbsoluteFontSize(css.fontSize);
						var lineHeight = getRelativeLineHeight(fontSize, css.lineHeight, node);

						// Finds common font size
						var elts = node.getElementsByTagName('*');

						// IE does not support containsNode
						if (elts.length > 0 && window.getSelection && !mxClient.IS_IE && !mxClient.IS_IE11)
						{
							var selection = window.getSelection();

							for (var i = 0; i < elts.length; i++)
							{
								if (selection.containsNode(elts[i], true))
								{
									temp = mxUtils.getCurrentStyle(elts[i]);
									fontSize = Math.max(getAbsoluteFontSize(temp.fontSize), fontSize);
									var lh = getRelativeLineHeight(fontSize, temp.lineHeight, elts[i]);
									
									if (lh != lineHeight || isNaN(lh))
									{
										lineHeight = '';
									}
								}
							}
						}
						
						if (css != null)
						{
							setSelected(fontStyleItems[0], css.fontWeight == 'bold' || graph.getParentByName(node, 'B', graph.cellEditor.textarea) != null);
							setSelected(fontStyleItems[1], css.fontStyle == 'italic' || graph.getParentByName(node, 'I', graph.cellEditor.textarea) != null);
							setSelected(fontStyleItems[2], graph.getParentByName(node, 'U', graph.cellEditor.textarea) != null);
							setSelected(left, css.textAlign == 'left');
							setSelected(center, css.textAlign == 'center');
							setSelected(right, css.textAlign == 'right');
							setSelected(full, css.textAlign == 'justify');
							setSelected(sup, graph.getParentByName(node, 'SUP', graph.cellEditor.textarea) != null);
							setSelected(sub, graph.getParentByName(node, 'SUB', graph.cellEditor.textarea) != null);
							
							if (document.activeElement != input)
							{
								if (node.nodeName == 'FONT' && node.getAttribute('size') == '4' &&
									pendingFontSize != null)
								{
									node.removeAttribute('size');
									node.style.fontSize = pendingFontSize + ' px';
									pendingFontSize = null;
								}
								else
								{
									input.value = (isNaN(fontSize)) ? '' : fontSize + ' px';
								}
								
							}
							
							// Converts rgb(r,g,b) values
							var color = css.color.replace(
								    /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
								    function($0, $1, $2, $3) {
								        return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
								    });
							var color2 = css.backgroundColor.replace(
								    /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
								    function($0, $1, $2, $3) {
								        return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
								    });
							
							// Updates the color picker for the current font
							if (fontColorApply != null)
							{
								if (color.charAt(0) == '#')
								{
									currentFontColor = color;
								}
								else
								{
									currentFontColor = '#000000';
								}
								
								fontColorApply(currentFontColor, true);
							}
							
							if (bgColorApply != null)
							{
								if (color2.charAt(0) == '#')
								{
									currentBgColor = color2;
								}
								else
								{
									currentBgColor = null;
								}
								
								bgColorApply(currentBgColor, true);
							}
							
							// Workaround for firstChild is null or not an object
							// in the log which seems to be IE8- only / 29.01.15
						}
					}
					
					updating = false;
				}, 0);
			}
		};
		
		mxEvent.addListener(graph.cellEditor.textarea, 'input', updateCssHandler)
		mxEvent.addListener(graph.cellEditor.textarea, 'touchend', updateCssHandler);
		mxEvent.addListener(graph.cellEditor.textarea, 'mouseup', updateCssHandler);
		mxEvent.addListener(graph.cellEditor.textarea, 'keyup', updateCssHandler);
		this.listeners.push({destroy: function()
		{
			// No need to remove listener since textarea is destroyed after edit
		}});
		updateCssHandler();
	}

	return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	// this.init();
};

mxUtils.extend(StyleFormatPanel, BaseFormatPanel);

/**
 * 
 */
ArrangePanel.prototype.defaultStrokeColor = 'black';

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.styleInit = function()
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var ss = this.format.getSelectionState();
	if (ss.containsImage && ss.vertices.length == 1 && ss.style.shape == 'image' &&
		ss.style.image != null && ss.style.image.substring(0, 19) == 'data:image/svg+xml;')
	{
		this.container.appendChild(this.addSvgStyles(this.createPanel()));
	}
	
	if (!ss.containsImage || ss.style.shape == 'image')
	{
		this.container.appendChild(this.addFill(this.createPanel()));
	}

	// this.container.appendChild(this.addStroke(this.createPanel()));
	this.container.appendChild(this.addLineJumps(this.createPanel()));
	var opacityPanel = this.createRelativeOption(mxResources.get('opacity'), mxConstants.STYLE_OPACITY, 41);
	opacityPanel.style.paddingTop = '8px';
	opacityPanel.style.paddingBottom = '8px';
	this.container.appendChild(opacityPanel);
	this.container.appendChild(this.addEffects(this.createPanel()));
	var opsPanel = this.addEditOps(this.createPanel());
	
	if (opsPanel.firstChild != null)
	{
		mxUtils.br(opsPanel);
	}
	
};

/**
 * Use browser for parsing CSS.
 */
ArrangePanel.prototype.getCssRules = function(css)
{
	var doc = document.implementation.createHTMLDocument('');
	var styleElement = document.createElement('style');
	
	mxUtils.setTextContent(styleElement, css);
	doc.body.appendChild(styleElement);
	
	return styleElement.sheet.cssRules;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.addSvgStyles = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var ss = this.format.getSelectionState();
	container.style.paddingTop = '6px';
	container.style.paddingBottom = '6px';
	container.style.display = 'none';

	try
	{
		var exp = ss.style.editableCssRules;
		
		if (exp != null)
		{
			var regex = new RegExp(exp);
			
			var data = ss.style.image.substring(ss.style.image.indexOf(',') + 1);
			var xml = (window.atob) ? atob(data) : Base64.decode(data, true);
			var svg = mxUtils.parseXml(xml);
			
			if (svg != null)
			{
				var styles = svg.getElementsByTagName('style');
				
				for (var i = 0; i < styles.length; i++)
				{
					var rules = this.getCssRules(mxUtils.getTextContent(styles[i]));
					
					for (var j = 0; j < rules.length; j++)
					{
						this.addSvgRule(container, rules[j], svg, styles[i], rules, j, regex);
					}
				}
			}
		}
	}
	catch (e)
	{
		// ignore
	}
	
	return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.addSvgRule = function(container, rule, svg, styleElem, rules, ruleIndex, regex)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	
	if (regex.test(rule.selectorText))
	{
		function rgb2hex(rgb)
		{
			 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
			 
			 return (rgb && rgb.length === 4) ? "#" +
			  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
			  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
			  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
		};
		
		var addStyleRule = mxUtils.bind(this, function(rule, key, label)
		{
			if (rule.style[key] != '')
			{
				var option = this.createColorOption(label + ' ' + rule.selectorText, function()
				{
					return rgb2hex(rule.style[key]);
				}, function(color)
				{
					rules[ruleIndex].style[key] = color;
					var cssTxt = '';
					
					for (var i = 0; i < rules.length; i++) 
					{
						cssTxt += rules[i].cssText + ' ';
					}
					
					styleElem.textContent = cssTxt;
					var xml = mxUtils.getXml(svg.documentElement);
					
					graph.setCellStyles(mxConstants.STYLE_IMAGE, 'data:image/svg+xml,' +
						((window.btoa) ? btoa(xml) : Base64.encode(xml, true)),
						graph.getSelectionCells());
				}, '#ffffff',
				{
					install: function(apply)
					{
						// ignore
					},
					destroy: function()
					{
						// ignore
					}
				});
			
				container.appendChild(option);
				
				// Shows container if rules are added
				container.style.display = '';
			}
		});
		
		addStyleRule(rule, 'fill', mxResources.get('fill'));
		addStyleRule(rule, 'stroke', mxResources.get('line'));
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.addEditOps = function(div)
{
	var ss = this.format.getSelectionState();
	var btn = null;
	
	if (this.editorUi.editor.graph.getSelectionCount() == 1)
	{
	}
	
	if (ss.image)
	{
		var btn2 = mxUtils.button(mxResources.get('editImage'), mxUtils.bind(this, function(evt)
		{
			this.editorUi.actions.get('image').funct();
		}));
		
		btn2.setAttribute('title', mxResources.get('editImage'));
		btn2.style.marginBottom = '2px';
		
		if (btn == null)
		{
			btn2.style.width = '202px';
		}
		else
		{
			btn.style.width = '100px';
			btn2.style.width = '100px';
			btn2.style.marginLeft = '2px';
		}
		
		div.appendChild(btn2);
	}
	
	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.addFill = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var ss = this.format.getSelectionState();
	container.style.paddingTop = '6px';
	container.style.paddingBottom = '6px';

	// Adds gradient direction option
	var gradientSelect = document.createElement('select');
	gradientSelect.style.position = 'absolute';
	gradientSelect.style.marginTop = '-2px';
	gradientSelect.style.right = (mxClient.IS_QUIRKS) ? '52px' : '72px';
	gradientSelect.style.width = '70px';
	
	// Stops events from bubbling to color option event handler
	mxEvent.addListener(gradientSelect, 'click', function(evt)
	{
		mxEvent.consume(evt);
	});

	var fillKey = (ss.style.shape == 'image') ? mxConstants.STYLE_IMAGE_BACKGROUND : mxConstants.STYLE_FILLCOLOR;
	var label = (ss.style.shape == 'image') ? mxResources.get('background') : mxResources.get('fill');
	
	var fillPanel = this.createCellColorOption(label, fillKey, '#ffffff');

	var tmpColor = mxUtils.getValue(ss.style, fillKey, null);

	var directions = [mxConstants.DIRECTION_NORTH, mxConstants.DIRECTION_EAST,
	                  mxConstants.DIRECTION_SOUTH, mxConstants.DIRECTION_WEST];

	for (var i = 0; i < directions.length; i++)
	{
		var gradientOption = document.createElement('option');
		gradientOption.setAttribute('value', directions[i]);
		mxUtils.write(gradientOption, mxResources.get(directions[i]));
		gradientSelect.appendChild(gradientOption);
	}
	

	var listener = mxUtils.bind(this, function()
	{
		ss = this.format.getSelectionState();
		var value = mxUtils.getValue(ss.style, mxConstants.STYLE_GRADIENT_DIRECTION, mxConstants.DIRECTION_SOUTH);
		
		// Handles empty string which is not allowed as a value
		if (value == '')
		{
			value = mxConstants.DIRECTION_SOUTH;
		}
		
		gradientSelect.value = value;
		container.style.display = (ss.fill) ? '' : 'none';
		
		var fillColor = mxUtils.getValue(ss.style, mxConstants.STYLE_FILLCOLOR, null);

	});
	
	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();

	mxEvent.addListener(gradientSelect, 'change', function(evt)
	{
		graph.setCellStyles(mxConstants.STYLE_GRADIENT_DIRECTION, gradientSelect.value, graph.getSelectionCells());
		mxEvent.consume(evt);
	});
	
	container.appendChild(fillPanel);
	
	// Adds custom colors
	var custom = this.getCustomColors();
	
	for (var i = 0; i < custom.length; i++)
	{
		container.appendChild(this.createCellColorOption(custom[i].title, custom[i].key, custom[i].defaultValue));
	}
	
	return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.getCustomColors = function()
{
	var ss = this.format.getSelectionState();
	var result = [];
	
	if (ss.style.shape == 'swimlane')
	{
		result.push({title: mxResources.get('laneColor'), key: 'swimlaneFillColor', defaultValue: '#ffffff'});
	}
	
	return result;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.addStroke = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var ss = this.format.getSelectionState();
	container.appendChild(this.createTitle('边框'));
	
	var colorPanel = document.createElement('div');
	colorPanel.style.overflow = 'hidden';
	
	// 增加下拉选项
	var styleSelect = document.createElement('select');
	styleSelect.className = 'formatMiddleSelect'
	styleSelect.style.marginRight = '4px';
	var styles = ['有', '无'];
	for (var i = 0; i < styles.length; i++)
	{
		var styleOption = document.createElement('option');
		styleOption.setAttribute('value', styles[i]);
		styleOption.innerText = styles[i];
		styleSelect.appendChild(styleOption);
	}

	var state = graph.view.getState(graph.getSelectionCell());
	var color = mxUtils.getValue(state.style, 'strokeColor', null)
	color ? styleSelect.value = '有' : styleSelect.value = '无';
	colorPanel.appendChild(styleSelect)
	mxEvent.addListener(styleSelect, 'change', function(evt)
	{
		graph.getModel().beginUpdate();
		try
		{
			// 无边框时 color设置为none
			color = styleSelect.value == '无' ? 'none' : '#000000';
			graph.setCellStyles('strokeColor', color, graph.getSelectionCells());
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', ['strokeColor'],'values', [color], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
		
		mxEvent.consume(evt);
	});
	
	mxEvent.addListener(styleSelect, 'click', function(evt)
	{
		mxEvent.consume(evt);
	});

	var strokeKey = (ss.style.shape == 'image') ? mxConstants.STYLE_IMAGE_BORDER : mxConstants.STYLE_STROKECOLOR;
	var label = (ss.style.shape == 'image') ? mxResources.get('border') : mxResources.get('line');
	
	var lineColor = this.createCellColorOption(label, strokeKey, '#000000');
	lineColor.className += " formatMiddleBtn";
	colorPanel.appendChild(lineColor);
	container.appendChild(colorPanel)
	return container;
};

/**
 * Adds UI for configuring line jumps.
 */
ArrangePanel.prototype.addLineJumps = function(container)
{
	var ss = this.format.getSelectionState();
	
	if (Graph.lineJumpsEnabled && ss.edges.length > 0 &&
		ss.vertices.length == 0 && ss.lineJumps)
	{
		container.style.padding = '8px 0px 24px 18px';
		
		var ui = this.editorUi;
		var editor = ui.editor;
		var graph = editor.graph;
		
		var span = document.createElement('div');
		span.style.position = 'absolute';
		span.style.width = '80px';
		
		mxUtils.write(span, mxResources.get('lineJumps'));
		container.appendChild(span);
		
		var styleSelect = document.createElement('select');
		styleSelect.style.position = 'absolute';
		styleSelect.style.marginTop = '-2px';
		styleSelect.style.right = '76px';
		styleSelect.style.width = '62px';

		var styles = ['none', 'arc', 'gap', 'sharp'];

		for (var i = 0; i < styles.length; i++)
		{
			var styleOption = document.createElement('option');
			styleOption.setAttribute('value', styles[i]);
			mxUtils.write(styleOption, mxResources.get(styles[i]));
			styleSelect.appendChild(styleOption);
		}
		
		mxEvent.addListener(styleSelect, 'change', function(evt)
		{
			graph.getModel().beginUpdate();
			try
			{
				graph.setCellStyles('jumpStyle', styleSelect.value, graph.getSelectionCells());
				ui.fireEvent(new mxEventObject('styleChanged', 'keys', ['jumpStyle'],
					'values', [styleSelect.value], 'cells', graph.getSelectionCells()));
			}
			finally
			{
				graph.getModel().endUpdate();
			}
			
			mxEvent.consume(evt);
		});
		
		// Stops events from bubbling to color option event handler
		mxEvent.addListener(styleSelect, 'click', function(evt)
		{
			mxEvent.consume(evt);
		});
		
		container.appendChild(styleSelect);
		
		var jumpSizeUpdate;
		
		var jumpSize = this.addUnitInput(container, 'px', 22, 33, function()
		{
			jumpSizeUpdate.apply(this, arguments);
		});
		
		jumpSizeUpdate = this.installInputHandler(jumpSize, 'jumpSize',
			Graph.defaultJumpSize, 0, 999, ' px');
		
		var listener = mxUtils.bind(this, function(sender, evt, force)
		{
			ss = this.format.getSelectionState();
			styleSelect.value = mxUtils.getValue(ss.style, 'jumpStyle', 'none');

			if (force || document.activeElement != jumpSize)
			{
				var tmp = parseInt(mxUtils.getValue(ss.style, 'jumpSize', Graph.defaultJumpSize));
				jumpSize.value = (isNaN(tmp)) ? '' : tmp  + ' px';
			}
		});

		this.addKeyHandler(jumpSize, listener);

		graph.getModel().addListener(mxEvent.CHANGE, listener);
		this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
		listener();
	}
	else
	{
		container.style.display = 'none';
	}
	
	return container;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.addEffects = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = this.format.getSelectionState();
	
	div.style.paddingTop = '0px';
	div.style.paddingBottom = '2px';

	var table = document.createElement('table');

	if (mxClient.IS_QUIRKS)
	{
		table.style.fontSize = '1em';
	}

	table.style.width = '100%';
	table.style.fontWeight = 'bold';
	table.style.paddingRight = '20px';
	var tbody = document.createElement('tbody');
	var row = document.createElement('tr');
	row.style.padding = '0px';
	var left = document.createElement('td');
	left.style.padding = '0px';
	left.style.width = '50%';
	left.setAttribute('valign', 'top');
	
	var right = left.cloneNode(true);
	right.style.paddingLeft = '8px';
	row.appendChild(left);
	row.appendChild(right);
	tbody.appendChild(row);
	table.appendChild(tbody);
	div.appendChild(table);

	var current = left;
	var count = 0;
	
	var addOption = mxUtils.bind(this, function(label, key, defaultValue)
	{
		var opt = this.createCellOption(label, key, defaultValue);
		opt.style.width = '100%';
		current.appendChild(opt);
		current = (current == left) ? right : left;
		count++;
	});

	var listener = mxUtils.bind(this, function(sender, evt, force)
	{
		ss = this.format.getSelectionState();
		
		left.innerHTML = '';
		right.innerHTML = '';
		current = left;
		
		if (ss.rounded)
		{
			addOption(mxResources.get('rounded'), mxConstants.STYLE_ROUNDED, 0);
		}
		
		if (ss.style.shape == 'swimlane')
		{
			addOption(mxResources.get('divider'), 'swimlaneLine', 1);
		}

		if (!ss.containsImage)
		{
			// addOption(mxResources.get('shadow'), mxConstants.STYLE_SHADOW, 0);
		}
		
		if (ss.glass)
		{
			addOption(mxResources.get('glass'), mxConstants.STYLE_GLASS, 0);
		}

		if (ss.comic)
		{
			addOption(mxResources.get('comic'), 'comic', 0);
		}
		
		if (count == 0)
		{
			div.style.display = 'none';
		}
	});
	
	graph.getModel().addListener(mxEvent.CHANGE, listener);
	this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
	listener();

	return div;
}

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.addStyleOps = function(div)
{
	div.style.paddingTop = '10px';
	div.style.paddingBottom = '10px';
	
	var btn = mxUtils.button(mxResources.get('setAsDefaultStyle'), mxUtils.bind(this, function(evt)
	{
		this.editorUi.actions.get('setAsDefaultStyle').funct();
	}));
	
	btn.setAttribute('title', mxResources.get('setAsDefaultStyle') + ' (' + this.editorUi.actions.get('setAsDefaultStyle').shortcut + ')');
	btn.style.width = '202px';
	div.appendChild(btn);

	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(DiagramFormatPanel, BaseFormatPanel);

/**
 * Switch to disable page view.
 */
DiagramFormatPanel.showPageView = true;

/**
 * Specifies if the background image option should be shown. Default is true.
 */
DiagramFormatPanel.prototype.showBackgroundImageOption = true;

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.init = function()
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;

	this.container.appendChild(this.addView(this.createPanel()));

	if (graph.isEnabled())
	{
		this.container.appendChild(this.addStyleOps(this.createPanel()));
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addView = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	div.appendChild(this.createTitle(mxResources.get('view')));

	if (graph.isEnabled())
	{
		// Page View
		if (DiagramFormatPanel.showPageView)
		{
			div.appendChild(this.createOption(mxResources.get('pageView'), function()
			{
				return !graph.pageVisible;
			}, function(checked)
			{
				ui.actions.get('pageView').funct();
			},
			{
				install: function(apply)
				{
					this.listener = function()
					{
						apply(graph.pageVisible);
					};
					
					ui.addListener('pageViewChanged', this.listener);
				},
				destroy: function()
				{
					ui.removeListener(this.listener);
				}
			}));
		}
		
		// Background
		var bg = this.createColorOption(mxResources.get('background'), function()
		{
			return graph.background;
		}, function(color)
		{
			var change = new ChangePageSetup(ui, color);
			change.ignoreImage = true;
			
			graph.model.execute(change);
		}, '#ffffff',
		{
			install: function(apply)
			{
				this.listener = function()
				{
					apply(graph.background);
				};
				
				ui.addListener('backgroundColorChanged', this.listener);
			},
			destroy: function()
			{
				ui.removeListener(this.listener);
			}
		});
		
		if (this.showBackgroundImageOption)
		{
			var btn = mxUtils.button(mxResources.get('image'), function(evt)
			{
				ui.showBackgroundImageDialog();
				mxEvent.consume(evt);
			})
		
			btn.style.position = 'absolute';
			btn.className = 'geColorBtn';
			btn.style.marginTop = '-4px';
			btn.style.paddingBottom = (document.documentMode == 11 || mxClient.IS_MT) ? '0px' : '2px';
			btn.style.height = '22px';
			btn.style.right = (mxClient.IS_QUIRKS) ? '44px' : '72px';
			btn.style.width = '56px';
		
			bg.appendChild(btn);
		}
		
		div.appendChild(bg);
	}
	
	return div;
};

/**
 * 
 */
DiagramFormatPanel.prototype.addGridOption = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	
	var input = document.createElement('input');
	input.style.position = 'absolute';
	input.style.textAlign = 'right';
	input.style.width = '38px';
	input.value = graph.getGridSize() + ' px';
	
	var stepper = this.createStepper(input, update);
	input.style.display = (graph.isGridEnabled()) ? '' : 'none';
	stepper.style.display = input.style.display;

	mxEvent.addListener(input, 'keydown', function(e)
	{
		if (e.keyCode == 13)
		{
			graph.container.focus();
			mxEvent.consume(e);
		}
		else if (e.keyCode == 27)
		{
			input.value = graph.getGridSize();
			graph.container.focus();
			mxEvent.consume(e);
		}
	});
	
	function update(evt)
	{
		var value = parseInt(input.value);
		value = Math.max(1, (isNaN(value)) ? 10 : value);
		
		if (value != graph.getGridSize())
		{
			graph.setGridSize(value)
		}

		input.value = value + ' px';
		mxEvent.consume(evt);
	};

	mxEvent.addListener(input, 'blur', update);
	mxEvent.addListener(input, 'change', update);

};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addStyleOps = function(div)
{
	var btn = mxUtils.button(mxResources.get('editData'), mxUtils.bind(this, function(evt)
	{
		this.editorUi.actions.get('editData').funct();
	}));
	
	btn.setAttribute('title', mxResources.get('editData') + ' (' + this.editorUi.actions.get('editData').shortcut + ')');
	btn.style.width = '202px';
	div.appendChild(btn);

	return div;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.destroy = function()
{
	BaseFormatPanel.prototype.destroy.apply(this, arguments);
	
	if (this.gridEnabledListener)
	{
		this.editorUi.removeListener(this.gridEnabledListener);
		this.gridEnabledListener = null;
	}
};


/**
 * 交互面板
 */
ActionsPanel = function(format, editorUi, container)
{
	BaseFormatPanel.call(this, format, editorUi, container);
	this.init(container);
};
/**
 * 继承基础面板
 */
mxUtils.extend(ActionsPanel, BaseFormatPanel);

ActionsPanel.prototype.init = function (container) {
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var cell = graph.getSelectionCell();
	this.modelInfo = graph.getModel().getValue(cell);
	// 节点的信息
	var state = this.editorUi.editor.graph.view.getState(cell);

	if (!mxUtils.isNode(this.modelInfo))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', this.modelInfo || '');
		this.modelInfo = obj;
	}

	// this.addConditions(this.container);
	// this.addAlarm(this.container);
	// 编辑数据
	if (graph.getSelectionCount() == 1)
	{
		// 公共交互
		var addAction = document.createElement('button')
		addAction.className = 'formatSmallBtn';
		addAction.innerText = '+ 交互';
		this.container.appendChild(addAction);
		// 默认一个交互操作
		this.rectangleActions()
		
		mxEvent.addListener(addAction, 'click', function (evt) {
			this.rectangleActions()
		}.bind(this))
	}
}

/**
 * 矩形交互
 */
ActionsPanel.prototype.rectangleActions = function () {
	this.createInfoBox(this.container, '点击菜单1首页--显示首页页面，首页字体白，蓝色填充')
	this.createOperateBox(this.container);
}

/**
 * 创建描述信息栏
 */
ActionsPanel.prototype.createInfoBox = function (container, desc = '') {
	// 描述内容
	var infoTxt = document.createElement('p');
	infoTxt.className = 'infoTxt';
	infoTxt.innerHTML = desc;
	container.appendChild(infoTxt);
	// 编辑图标
	var editIcon = this.editIcon();
	infoTxt.appendChild(editIcon);
}
/**
 * 编辑图标
 */
ActionsPanel.prototype.editIcon = function () {
	var editIcon = document.createElement('img');
	editIcon.className = 'editIcon';
	editIcon.setAttribute('src', '/static/images/icons/edit.png')
	return editIcon;
}
/**
 * 创建选择事件、选择动作操作栏 
 */
ActionsPanel.prototype.createOperateBox = function(container)
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var rect = this.format.getSelectionState();
	var cell = graph.getSelectionCell();
	var modelInfo = graph.getModel().getValue(cell);
	// 初始化属性
	if (modelInfo !== undefined && modelInfo !== null) {
		var attrs = modelInfo.attributes;
		var isLayer = graph.getModel().getParent(cell) == graph.getModel().getRoot();
		var temp = {};
		if (attrs) {
			for (var i = 0; i < attrs.length; i++)
			{
				if ((isLayer || attrs[i].nodeName != 'label') && attrs[i].nodeName != 'placeholders')
				{
					temp[attrs[i].nodeName] =  attrs[i].nodeValue;
				}
			}
		}
		var divpanel = this.createPanel();
		divpanel.style.paddingBottom = '12px';
		// 新增下拉框
		// 选择事件
		var mouseEvent = this.addUnitSelect(divpanel, 218, ["选择", "鼠标移入", "鼠标移出", "点击", "双击", "选中", "未选中"], temp.mouseEvent, mxResources.get('chooseEvent'));
		// 选择动作
		var effectAction = this.addUnitSelect(divpanel, 218, ["选择", "显示", "隐藏", "打开", "关闭"], temp.effectAction, mxResources.get('chooseAction'));
		// 内部页面、控件链接
		var innerChoose = document.createElement('div');
		innerChoose.style.margin = '12px 0';
		// 单选按钮
		var innerRadio = document.createElement('input');
		innerRadio.setAttribute('type', 'radio');
		innerRadio.setAttribute('checked', true);
		innerRadio.setAttribute('name', 'radioType');
		innerChoose.appendChild(innerRadio);
		// 下拉列表
		var innerType = this.addUnitSelect(innerChoose, 198, ["页面", '控件'], '', '');
		innerType.style.marginLeft = '6px';
		divpanel.appendChild(innerChoose);
		// 页面或者控件列表
		var pageList = document.createElement('ul');
		pageList.className = 'pageList';
		var mockData = ['首页', '设备列表', '曲线图', '告警中心', '浮窗']
		pageList.innerHTML = `
			${
				mockData.map((val) => (`<li>${val}</li>`)).join('')
			}
		`;
		// 选择页面
		mxEvent.addListener(pageList, 'click', function (evt) {
			$('.formatPageActive').removeClass();
			evt.target.className = 'formatPageActive';
		})
		divpanel.appendChild(pageList);
		// 外部链接
		var outChoose = document.createElement('div');
		outChoose.style.margin = '12px 0';
		// 单选按钮
		var outRadio = document.createElement('input');
		outRadio.setAttribute('type', 'radio');
		outRadio.setAttribute('name', 'radioType');
		outChoose.appendChild(outRadio);
		// 名称
		var _title = document.createElement('span');
		_title.innerText = '外部链接';
		_title.style.marginLeft = '6px';
		outChoose.appendChild(_title);
		// 外部链接输入框
		var outInput = document.createElement('input');
		outInput.className = 'outLink'
		divpanel.appendChild(outChoose);
		
		divpanel.appendChild(outInput);
		if (!mxUtils.isNode(modelInfo))
		{
			var doc = mxUtils.createXmlDocument();
			var obj = doc.createElement('object');
			obj.setAttribute('label', modelInfo || '');
			modelInfo = obj;
		}
			
		// 事件监听
		// 选择内部链接
		mxEvent.addListener(innerRadio, 'click', function (evt) {
			innerType.removeAttribute('disabled');
			// 禁用外部选择
			outInput.value = '';
			outInput.setAttribute('disabled', true);
		})
		// 选择外部链接
		mxEvent.addListener(outRadio, 'click', function (evt) {
			outInput.removeAttribute('disabled');
			// 禁用内部选择
			innerType.setAttribute('disabled', true);
			$('.formatPageActive').removeClass();
		})
		// 选择事件
		mxEvent.addListener(mouseEvent, 'change', function () {
			modelInfo = modelInfo.cloneNode(true);
			modelInfo.setAttribute('mouseEvent', mouseEvent.value);
			graph.getModel().setValue(cell, modelInfo);
		});
		// 选择动作
		mxEvent.addListener(effectAction, 'change', function () {
			modelInfo.setAttribute('effectAction', effectAction.value);
			graph.getModel().setValue(cell, modelInfo);
		});
		
		container.appendChild(divpanel);	
	}
};
/**
 * 设置条件
 */
ActionsPanel.prototype.addConditions = function (container) {
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var rect = this.format.getSelectionState();
	var cell = graph.getSelectionCell();
	var modelInfo = graph.getModel().getValue(cell);
	if (modelInfo !== undefined && modelInfo !== null) {
		// 初始化属性
		var attrs = modelInfo.attributes;
		var isLayer = graph.getModel().getParent(cell) == graph.getModel().getRoot();
		var temp = {};
		if (attrs) {
			for (var i = 0; i < attrs.length; i++)
			{
				if ((isLayer || attrs[i].nodeName != 'label') && attrs[i].nodeName != 'placeholders')
				{
					temp[attrs[i].nodeName] =  attrs[i].nodeValue;
				}
			}
		}
	
		var title = this.createTitle(mxResources.get('condition'));
		title.style.paddingLeft = '18px';
		title.style.paddingTop = '10px';
		title.style.paddingBottom = '6px';
		container.appendChild(title);	
	
		var divpanel = this.createPanel();
		divpanel.style.paddingBottom = '12px';
		
		
		// 文本框
		var codeArea = document.createElement('textarea');
		codeArea.style.width = "97%";
		codeArea.style.height = "60px";
		codeArea.style.resize = "vertical";
		codeArea.value = temp.condition || '';
		// 监听事件`
		mxEvent.addListener(container, 'mousedown', function () {
			codeArea.blur()
		});
		mxEvent.addListener(codeArea, 'mousedown', function(evt)
		{
			if (evt.stopPropagation)
			{
				evt.stopPropagation();
			}
			
			evt.cancelBubble = true;
		});
		// 失去焦点
		mxEvent.addListener(codeArea, 'blur', function(evt)
		{
			modelInfo.setAttribute('condition', evt.target.value);
			graph.getModel().setValue(cell, modelInfo);
		});
		// mxUtils.write(codeArea, mxResources.get('angle'));
		divpanel.appendChild(codeArea)
	
		if (!mxUtils.isNode(modelInfo))
		{
			var doc = mxUtils.createXmlDocument();
			var obj = doc.createElement('object');
			obj.setAttribute('label', modelInfo || '');
			modelInfo = obj;
		}
			
		// 事件监听
		
		container.appendChild(divpanel);
		
	}
}

/**
 * 设置提示信息
 */
ActionsPanel.prototype.addAlarm = function (container) {
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var cell = graph.getSelectionCell();
	var modelInfo = graph.getModel().getValue(cell);
	if (modelInfo !== undefined && modelInfo !== null) {
		// 初始化属性
		var attrs = modelInfo.attributes;
		var isLayer = graph.getModel().getParent(cell) == graph.getModel().getRoot();
		var temp = {};
		if (attrs) {
			for (var i = 0; i < attrs.length; i++)
			{
				if ((isLayer || attrs[i].nodeName != 'label') && attrs[i].nodeName != 'placeholders')
				{
					temp[attrs[i].nodeName] =  attrs[i].nodeValue;
				}
			}
		}
		// 告警标题
		var title = this.createTitle(mxResources.get('alarm'));
		title.style.paddingLeft = '18px';
		title.style.paddingTop = '10px';
		title.style.paddingBottom = '6px';
		container.appendChild(title);	
	
		var divpanel = this.createPanel();
		divpanel.style.paddingBottom = '12px';	
		
		// 文本框
		let alarm1 = this.addSingleInput(divpanel, 'param1', temp);
	
		// 监听事件`
		mxEvent.addListener(container, 'mousedown', function (e) {
			alarm1.blur()
		});
	
		if (!mxUtils.isNode(modelInfo))
		{
			var doc = mxUtils.createXmlDocument();
			var obj = doc.createElement('object');
			obj.setAttribute('label', modelInfo || '');
			modelInfo = obj;
		}
		
		container.appendChild(divpanel);
		
	}
}
/**
 * 设置修改属性
 */
ActionsPanel.prototype.changValue = function (cell, value) {

}

/**
 * 添加单行文本
 */
ActionsPanel.prototype.addSingleInput = function (container, name, value ) {
	// 文本框
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var cell = graph.getSelectionCell();
	var modelInfo = this.modelInfo;
	// 创建节点
	var box = document.createElement('div');
	var input = document.createElement('input');
	input.value = value[name] || '';
	input.className = input.className + ' u-prop-cell';
	mxUtils.write(box, mxResources.get(name) + ': ');
	box.appendChild(input);
	// 监听事件、失去焦点进行赋值操作
	mxEvent.addListener(input, 'blur', function(evt)
    {
		modelInfo.setAttribute(name, evt.target.value);
		graph.getModel().setValue(cell, modelInfo);
	});
	container.appendChild(box);
	return input;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
ActionsPanel.prototype.destroy = function()
{
	BaseFormatPanel.prototype.destroy.apply(this, arguments);
	
	// if (this.gridEnabledListener)
	// {
	// 	this.editorUi.removeListener(this.gridEnabledListener);
	// 	this.gridEnabledListener = null;
	// }
};

/**
 * 控件管理列表
 */
var PaletteManage = function (editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
	var editor = editorUi.editor;
	var graph = editor.graph;
	
	this.update = mxUtils.bind(this, function(sender, evt)
	{
		this.refresh();
	});
	
	// graph.getSelectionModel().addListener(mxEvent.CHANGE, this.update);
	// graph.addListener(mxEvent.EDITING_STARTED, this.update);
	// graph.addListener(mxEvent.EDITING_STOPPED, this.update);
	graph.getModel().addListener(mxEvent.CHANGE, this.update);
	// graph.addListener(mxEvent.ROOT, mxUtils.bind(this, function()
	// {
	// 	this.refresh();
	// }));
	
	editor.addListener('autosaveChanged', mxUtils.bind(this, function()
	{
		// this.refresh();
	}));
	
	// this.refresh();
};

/**
 * 展开图标
 */
PaletteManage.prototype.expandImage = '/static/images/icons/expand.png';

/**
 * 收缩图标
 */
PaletteManage.prototype.colspanImage = '/static/images/icons/colspan.png';
/**
 * 控件名称和缩略图
 */
PaletteManage.prototype.list = {
	rectangle: '矩形',
	button: '按钮',
	menulist: '菜单',
	image: '图片',
	text: '文本',
	select: '下拉列表',
	table: '表格',
	endarrow: '箭头',
	line: '直线',
	curve: '曲线',
	linkTag: 'Link',
	primitive: '图元'
}
/**
 * 生成标题
 */
 PaletteManage.prototype.createTitle = function(label, id)
{
	var elt = document.createElement('a');
	elt.setAttribute('href', 'javascript:void(0);');
	elt.className = 'geTitle';
	elt.id = id + 'Title';
	elt.style.backgroundRepeat = 'no-repeat';
	elt.style.backgroundPosition = '3px 50%';
	elt.style.backgroundSize = '16px 16px';
	elt.style.backgroundImage = 'url(' + this.expandImage + ')';
	mxUtils.write(elt, label);
	// 页面管理一栏，增加添加页面管理的icon
	var img = document.createElement('img');
	img.setAttribute('src', '/static/images/icons/search.png');
	img.setAttribute('id', 'addPage');
	img.addEventListener('click', function (e) {
		w = e || window.event;
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
		// 触发事件
		$(".gePaletteManageContainer .formatLargeInput").toggle();
		$(".gePaletteManageContainer .formatLargeInput").val('').focus();
		this.fillList(elt.nextSibling, '')
	}.bind(this), true)
	elt.appendChild(img);
	return elt;
};
/**
 * 生成搜索框
 */
PaletteManage.prototype.createSearchInput = function (container) {
	// 搜索框
	var input = document.createElement('input');
	input.style.display = 'none';
	input.className = 'formatLargeInput';
	var timer = null;
	// 阻止冒泡
	mxEvent.addListener(input, 'mousedown', function(evt)
	{
		if (evt.stopPropagation)
		{
			evt.stopPropagation();
		}		
		evt.cancelBubble = true;
	});
	// 键盘事件
	mxEvent.addListener(input, 'keyup', function(e)
	{
		var keyCode = e.keyCode;
		e.stopPropagation()
		if ((48 <= keyCode && keyCode <= 57) || (65 <= keyCode && keyCode <= 90)|| (96 <= keyCode && keyCode <= 111) || keyCode == 8 || keyCode == 46)
		{
			clearTimeout(timer)
			// 300ms的防抖
			timer = setTimeout(function () {
				this.fillList(container, input.value)
				mxEvent.consume(e);
			}.bind(this), 300);
		}
		else if (keyCode == 27)
		{
			// 取消
			input.style.display = 'none';
			input.value = '';
			this.fillList(container, '')
			mxEvent.consume(e);
		}
	}.bind(this));
	container.appendChild(input);
}
/**
 * 填充列表
 */
PaletteManage.prototype.fillList = function (container, filter) {
	var primitives = this.editorUi.sidebar.primitives;
	var cells = [].concat(this.cells);
	filter = filter.trim();
	// 清除原先列表
	$("#paletteManageList").remove();
	var ul = document.createElement('ul');
	ul.id = 'paletteManageList';
	// 不显示节点的名称
	var forbiddenShape = ['pagemenu'];
	for (var i = 0; i < cells.length; i++) {
		// 节点的state信息
		var state = this.editorUi.editor.graph.view.getState(cells[i]);
		var info = state.style.shape;
		info = primitives.indexOf(info) == -1 ? info : 'primitive';
		var name = this.getCellInfo('palettename', cells[i]) || '';
		if (forbiddenShape.indexOf(info) != -1 || (name.indexOf(filter) == -1 && this.list[info].indexOf(filter) == -1)) continue;
		// 内容
		var _li = document.createElement('li');
		_li.innerText = name;
		_li.innerText += '(' + this.list[info] + ')';
		_li.setAttribute('data-defaultbg', 'url(/static/images/palettes/' + info + '.png)');
		_li.setAttribute('data-activebg', 'url(/static/images/palettes/' + info + '_white.png)');
		_li.style.backgroundImage = 'url(/static/images/palettes/' + info + '.png)';
		ul.appendChild(_li)
	};
	// 绑定事件
	mxEvent.addListener(ul, 'click', function (evt) {
		if (evt.target.nodeName === 'LI') {
			// 移除高亮，恢复默认背景
			$('.paletteActive').css({backgroundImage: $('.paletteActive').data('defaultbg')});
			$('.paletteActive').removeClass();
			// 选中高亮
			evt.target.className = 'paletteActive';
			evt.target.style.backgroundImage = evt.target.getAttribute('data-activebg');
			this.editorUi.editor.graph.setSelectionCell(cells[0]);
		}
	}.bind(this))
	container.appendChild(ul);
}
/**
 * 生成控件列表
 */
PaletteManage.prototype.createContent = function (container) {
	var div = document.createElement('div');
	this.createSearchInput(div);
	this.fillList(div, '');

	container.appendChild(div);
	return div;
}
/**
 * 绑定折叠事件
 */
PaletteManage.prototype.addFoldingHandler = function(elt, content) {
	mxEvent.addListener(elt, 'click', function () {
		if (content.style.display !== 'none') {
			content.style.display = 'none';
			elt.style.backgroundImage = 'url(' + this.colspanImage + ')';
			elt.parentNode.style.flex = 'unset';
		} else {
			content.style.display = '';
			elt.style.backgroundImage = 'url(' + this.expandImage + ')';
			elt.parentNode.style.flex = '';
			elt.parentNode.style.height = '';
		}
	}.bind(this))
}

/**
 * 刷新列表内容
 */
PaletteManage.prototype.refresh = function () {
	this.clear();	
	// 获取全部节点
	this.cells = this.getCells();

	var title = this.createTitle('控件', 'paletteManageTitle');
	this.container.appendChild(title);

	var content = this.createContent(this.container);
	this.addFoldingHandler(title, content);
}
/**
 * 清除控件列表内容
 */
PaletteManage.prototype.clear = function()
{
	this.container.innerHTML = '';
};
/**
 * 获取全部控件
 */
PaletteManage.prototype.getCells = function () {
	var cells = this.editorUi.editor.graph.getModel().cells;
	var res = [];
	for (var key in cells) {
		if (cells[key].id != '0' && cells[key].id != '1') {
			// console.log(this.getCellInfo('palettename', cells[key]))
			
			res.push(cells[key])
		}
	}
	return res;
}
/**
 * 获取控件名称
 */
PaletteManage.prototype.getCellInfo = function (key, cell) {
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var cellInfo = graph.getModel().getValue(cell);
	
	return cellInfo.attributes && cellInfo.attributes[key] && cellInfo.attributes[key].nodeValue || '';
}
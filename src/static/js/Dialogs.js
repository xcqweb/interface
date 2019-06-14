/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new open dialog.
 */
var OpenDialog = function()
{
	// var iframe = document.createElement('iframe');
	// iframe.style.backgroundColor = 'transparent';
	// iframe.allowTransparency = 'true';
	// iframe.style.borderStyle = 'none';
	// iframe.style.borderWidth = '0px';
	// iframe.style.overflow = 'hidden';
	// iframe.frameBorder = '0';
	
	// // Adds padding as a workaround for box model in older IE versions
	// var dx = (mxClient.IS_VML && (document.documentMode == null || document.documentMode < 8)) ? 20 : 0;
	
	// iframe.setAttribute('width', (((Editor.useLocalStorage) ? 640 : 320) + dx) + 'px');
	// iframe.setAttribute('height', (((Editor.useLocalStorage) ? 480 : 220) + dx) + 'px');
	// iframe.setAttribute('src', OPEN_FORM);
	var p = document.createElement('p')
	p.innerHTML = '此菜单将打开应用中心';
	p.style.textAlign = "center"
	p.style.fontSize = '14px';
	p.style.lineHeight = '40px';
	
	this.container = p;
};

/**
 * Constructs a new color dialog.
 */
var ColorDialog = function(editorUi, color, apply, cancelFn)
{
	this.editorUi = editorUi;
	
	var input = document.createElement('input');
	input.style.marginBottom = '10px';
	input.style.margintop = '3px';
	input.style.width = '194px';
	
	// Required for picker to render in IE
	if (mxClient.IS_IE)
	{
		input.style.marginTop = '10px';
		document.body.appendChild(input);
	}
	
	this.init = function()
	{
		if (!mxClient.IS_TOUCH)
		{
			input.focus();
		}
	};

	var picker = new jscolor.color(input);
	picker.pickerOnfocus = false;
	picker.showPicker();

	var div = document.createElement('div');
	jscolor.picker.box.style.position = 'relative';
	jscolor.picker.box.style.width = '194px';
	jscolor.picker.box.style.height = '100px';
	jscolor.picker.box.style.paddingBottom = '10px';
	div.appendChild(jscolor.picker.box);

	var center = document.createElement('center');
	center.style.textAlign = "left";
	
	function createRecentColorTable()
	{
		var table = addPresets((ColorDialog.recentColors.length == 0) ? ['FFFFFF'] :
					ColorDialog.recentColors, 11, 'FFFFFF', true);
		table.style.marginBottom = '8px';
		
		return table;
	};
	
	function addPresets(presets, rowLength, defaultColor, addResetOption)
	{
		rowLength = (rowLength != null) ? rowLength : 12;
		var table = document.createElement('table');
		table.style.borderCollapse = 'collapse';
		table.setAttribute('cellspacing', '0');
		table.style.marginBottom = '20px';
		table.style.cellSpacing = '0px';
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);

		var rows = presets.length / rowLength;
		
		for (var row = 0; row < rows; row++)
		{
			var tr = document.createElement('tr');
			
			for (var i = 0; i < rowLength; i++)
			{
				(function(clr)
				{
					var td = document.createElement('td');
					td.style.border = '1px solid black';
					td.style.padding = '0px';
					td.style.width = '16px';
					td.style.height = '16px';
					
					if (clr == null)
					{
						clr = defaultColor;
					}
					
					if (clr == 'none')
					{
						td.style.background = 'url(\'' + Dialog.prototype.noColorImage + '\')';
					}
					else
					{
						td.style.backgroundColor = '#' + clr;
					}
					
					tr.appendChild(td);

					if (clr != null)
					{
						td.style.cursor = 'pointer';
						
						mxEvent.addListener(td, 'click', function()
						{
							if (clr == 'none')
							{
								picker.fromString('ffffff');
								input.value = 'none';
							}
							else
							{
								picker.fromString(clr);
							}
						});
					}
				})(presets[row * rowLength + i]);
			}
			
			tbody.appendChild(tr);
		}
		
		if (addResetOption)
		{
			var td = document.createElement('td');
			td.setAttribute('title', mxResources.get('reset'));
			td.style.border = '1px solid black';
			td.style.padding = '0px';
			td.style.width = '16px';
			td.style.height = '16px';
			td.style.backgroundImage = 'url(\'' + Dialog.prototype.closeImage + '\')';
			td.style.backgroundPosition = 'center center';
			td.style.backgroundRepeat = 'no-repeat';
			td.style.cursor = 'pointer';
			
			tr.appendChild(td);

			mxEvent.addListener(td, 'click', function()
			{
				ColorDialog.resetRecentColors();
				table.parentNode.replaceChild(createRecentColorTable(), table);
			});
		}
		
		center.appendChild(table);
		
		return table;
	};

	div.appendChild(input);
	mxUtils.br(div);
	
	// Adds recent colors
	createRecentColorTable();
		
	// Adds presets
	var table = addPresets(this.presetColors);
	table.style.marginBottom = '8px';
	table = addPresets(this.defaultColors);
	table.style.marginBottom = '16px';

	div.appendChild(center);

	var buttons = document.createElement('div');
	buttons.className = "btnContent";
	buttons.style.textAlign = 'right';
	buttons.style.whiteSpace = 'nowrap';
	buttons.style.overflow = 'hidden';
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	});
	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}
	
	var applyFunction = (apply != null) ? apply : this.createApplyFunction();
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		var color = input.value;
		ColorDialog.addRecentColor(color, 12);
		
		if (color != 'none' && color.charAt(0) != '#')
		{
			color = '#' + color;
		}

		applyFunction(color);
		editorUi.hideDialog();
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	buttons.appendChild(applyBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}
	
	if (color != null)
	{
		if (color == 'none')
		{
			picker.fromString('ffffff');
			input.value = 'none';
		}
		else
		{
			picker.fromString(color);
		}
	}
	
	div.appendChild(buttons);
	this.picker = picker;
	this.colorInput = input;

	// LATER: Only fires if input if focused, should always
	// fire if this dialog is showing.
	mxEvent.addListener(div, 'keydown', function(e)
	{
		if (e.keyCode == 27)
		{
			editorUi.hideDialog();
			
			if (cancelFn != null)
			{
				cancelFn();
			}
			
			mxEvent.consume(e);
		}
	});
	
	this.container = div;
	this.container.className = "geDialogInfo"
};

/**
 * Creates function to apply value
 */
ColorDialog.prototype.presetColors = ['E6D0DE', 'CDA2BE', 'B5739D', 'E1D5E7', 'C3ABD0', 'A680B8', 'D4E1F5', 'A9C4EB', '7EA6E0', 'D5E8D4', '9AC7BF', '67AB9F', 'D5E8D4', 'B9E0A5', '97D077', 'FFF2CC', 'FFE599', 'FFD966', 'FFF4C3', 'FFCE9F', 'FFB570', 'F8CECC', 'F19C99', 'EA6B66']; 

/**
 * Creates function to apply value
 */
ColorDialog.prototype.defaultColors = ['none', 'FFFFFF', 'E6E6E6', 'CCCCCC', 'B3B3B3', '999999', '808080', '666666', '4D4D4D', '333333', '1A1A1A', '000000', 'FFCCCC', 'FFE6CC', 'FFFFCC', 'E6FFCC', 'CCFFCC', 'CCFFE6', 'CCFFFF', 'CCE5FF', 'CCCCFF', 'E5CCFF', 'FFCCFF', 'FFCCE6',
		'FF9999', 'FFCC99', 'FFFF99', 'CCFF99', '99FF99', '99FFCC', '99FFFF', '99CCFF', '9999FF', 'CC99FF', 'FF99FF', 'FF99CC', 'FF6666', 'FFB366', 'FFFF66', 'B3FF66', '66FF66', '66FFB3', '66FFFF', '66B2FF', '6666FF', 'B266FF', 'FF66FF', 'FF66B3', 'FF3333', 'FF9933', 'FFFF33',
		'99FF33', '33FF33', '33FF99', '33FFFF', '3399FF', '3333FF', '9933FF', 'FF33FF', 'FF3399', 'FF0000', 'FF8000', 'FFFF00', '80FF00', '00FF00', '00FF80', '00FFFF', '007FFF', '0000FF', '7F00FF', 'FF00FF', 'FF0080', 'CC0000', 'CC6600', 'CCCC00', '66CC00', '00CC00', '00CC66',
		'00CCCC', '0066CC', '0000CC', '6600CC', 'CC00CC', 'CC0066', '990000', '994C00', '999900', '4D9900', '009900', '00994D', '009999', '004C99', '000099', '4C0099', '990099', '99004D', '660000', '663300', '666600', '336600', '006600', '006633', '006666', '003366', '000066',
		'330066', '660066', '660033', '330000', '331A00', '333300', '1A3300', '003300', '00331A', '003333', '001933', '000033', '190033', '330033', '33001A'];

/**
 * Creates function to apply value
 */
ColorDialog.prototype.createApplyFunction = function()
{
	return mxUtils.bind(this, function(color)
	{
		var graph = this.editorUi.editor.graph;
		
		graph.getModel().beginUpdate();
		try
		{
			graph.setCellStyles(this.currentColorKey, color);
			this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [this.currentColorKey],
				'values', [color], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	});
};

/**
 * 
 */
ColorDialog.recentColors = [];

/**
 * Adds recent color for later use.
 */
ColorDialog.addRecentColor = function(color, max)
{
	if (color != null)
	{
		mxUtils.remove(color, ColorDialog.recentColors);
		ColorDialog.recentColors.splice(0, 0, color);
		
		if (ColorDialog.recentColors.length >= max)
		{
			ColorDialog.recentColors.pop();
		}
	}
};

/**
 * Adds recent color for later use.
 */
ColorDialog.resetRecentColors = function()
{
	ColorDialog.recentColors = [];
};

/**
 * Constructs a new about dialog.
 */
var AboutDialog = function(editorUi)
{
	var div = document.createElement('div');
	div.setAttribute('align', 'center');
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get('about') + ' 界面工具');
	div.appendChild(h3);
	mxUtils.br(div);
	var closeBtn = mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	});
	closeBtn.className = 'geBtn gePrimaryBtn';
	div.appendChild(closeBtn);
	
	this.container = div;
};
/**
 * 一个输入框的弹窗
 */
var valueDialog = function (editorUi, filename, titleText, buttonText, fn) {
	var saveContent = editorUi.createDiv('geDialogInfo')
	// 文件名称
	var valTitle = document.createElement('p')
	valTitle.innerHTML = titleText
	valTitle.className = 'geDialogInfoTitle';	
	saveContent.appendChild(valTitle)
	
	var valInput = document.createElement('input');
	valInput.setAttribute('value', filename || '');
	valInput.className = 'saveFileInput'
	saveContent.appendChild(valInput)

	// 按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button(buttonText, function()
	{
		editorUi.hideDialog();
		fn(parseFloat(valInput.value));
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	btnContent.appendChild(cancelBtn);
	mxEvent.addListener(valInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			genericBtn.click();
		}
	});
	
	btnContent.appendChild(genericBtn);
	saveContent.appendChild(btnContent)
	this.container = saveContent;
}
/**
 * 保存文件弹窗
 */
var FilenameDialog = function(editorUi, filename, buttonText, fn, label, validateFn, content, helpLink, closeOnBtn, cancelFn)
{
	closeOnBtn = (closeOnBtn != null) ? closeOnBtn : true;
	
	var saveContent = editorUi.createDiv('geDialogInfo')
	// 文件名称
	var nameTitle = document.createElement('p')
	nameTitle.innerHTML = '文件名称'
	nameTitle.className = 'geDialogInfoTitle';	
	saveContent.appendChild(nameTitle)
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', filename || '');
	nameInput.className = 'saveFileInput'
	saveContent.appendChild(nameInput)

	// 文件描述
	var desTitle = document.createElement('p');
	desTitle.innerHTML = '文件描述';
	desTitle.style.margin = "9px 0 5px";
	desTitle.style.color = "#929292";
	saveContent.appendChild(desTitle)
	
	var descInput = document.createElement('input');
	descInput.setAttribute('value', editorUi.editor.getDescribe() || '');
	descInput.className = 'saveFileInput'
	saveContent.appendChild(descInput)

	// 按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button(buttonText, function()
	{
		if (validateFn == null || validateFn(nameInput.value))
		{			
			fn(nameInput.value, descInput.value);
		}
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	
	this.init = function()
	{
		if (label == null && content != null)
		{
			return;
		}
		
		nameInput.focus();
		
		if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			nameInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
		
		// Installs drag and drop handler for links
		if (Graph.fileSupport)
		{
			// Setup the dnd listeners
			var dlg = saveContent.parentNode;
			var graph = editorUi.editor.graph;
			var dropElt = null;
				
			mxEvent.addListener(dlg, 'dragleave', function(evt)
			{
				if (dropElt != null)
			    {
					dropElt.style.backgroundColor = '';
			    	dropElt = null;
			    }
			    
				evt.stopPropagation();
				evt.preventDefault();
			});
			
			mxEvent.addListener(dlg, 'dragover', mxUtils.bind(this, function(evt)
			{
				// IE 10 does not implement pointer-events so it can't have a drop highlight
				if (dropElt == null && (!mxClient.IS_IE || document.documentMode > 10))
				{
					dropElt = nameInput;
					dropElt.style.backgroundColor = '#ebf2f9';
				}
				
				evt.stopPropagation();
				evt.preventDefault();
			}));
					
			mxEvent.addListener(dlg, 'drop', mxUtils.bind(this, function(evt)
			{
			    if (dropElt != null)
			    {
					dropElt.style.backgroundColor = '';
			    	dropElt = null;
			    }

			    if (mxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0)
			    {
			    	nameInput.value = decodeURIComponent(evt.dataTransfer.getData('text/uri-list'));
			    	genericBtn.click();
			    }

			    evt.stopPropagation();
			    evt.preventDefault();
			}));
		}
	};
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btnContent.appendChild(cancelBtn);
	}
	
	if (helpLink != null)
	{
		var helpBtn = mxUtils.button(mxResources.get('help'), function()
		{
			editorUi.editor.graph.openLink(helpLink);
		});
		
		helpBtn.className = 'geBtn';	
		btnContent.appendChild(helpBtn);
	}

	mxEvent.addListener(nameInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			genericBtn.click();
		}
	});
	
	btnContent.appendChild(genericBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		btnContent.appendChild(cancelBtn);
	}
	saveContent.appendChild(btnContent)
	this.container = saveContent;
};

/**
 * 链接设置弹窗
 */
var ConfigLinkDialog = function(editorUi, linkvalue, buttonText, fn)
{
	var graph = editorUi.editor.graph;
	// 获取选中节点
	var cell = graph.getSelectionCell();
	var cellInfo = graph.getModel().getValue(cell);
	var saveContent = editorUi.createDiv('geDialogInfo')

	// 名称
	var linkNameTitle = document.createElement('p');
	linkNameTitle.innerHTML = '名称：';
	linkNameTitle.style.margin = "9px 0 5px";
	linkNameTitle.style.color = "#929292";
	saveContent.appendChild(linkNameTitle)
	
	var linkNameInput = document.createElement('input');
	linkNameInput.setAttribute('value', cellInfo.getAttribute('smartBiName') || '');
	linkNameInput.className = 'saveFileInput'
	saveContent.appendChild(linkNameInput)

	// 链接
	var linkTitle = document.createElement('p');
	linkTitle.innerHTML = '链接：';
	linkTitle.style.margin = "9px 0 5px";
	linkTitle.style.color = "#929292";
	saveContent.appendChild(linkTitle)
	
	var linkInput = document.createElement('input');
	linkInput.setAttribute('value', cellInfo.getAttribute('smartBiLink') || '');
	linkInput.className = 'saveFileInput'
	saveContent.appendChild(linkInput)

	// 按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button(buttonText, function()
	{
		editorUi.hideDialog();
		cellInfo.setAttribute('smartBiName', linkNameInput.value);
		cellInfo.setAttribute('smartBiLink', linkInput.value);
		graph.getModel().setValue(cell, cellInfo);
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	
	this.init = function()
	{
	};
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	btnContent.appendChild(cancelBtn);

	mxEvent.addListener(linkInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			genericBtn.click();
		}
	});
	
	btnContent.appendChild(genericBtn);
	
	saveContent.appendChild(btnContent)
	this.container = saveContent;
};
/**
 * 链接弹窗
 */
var LinkReportDialog = function(editorUi, defaultLink) {
	var graph = editorUi.editor.graph;
	// 获取选中节点
	var cell = graph.getSelectionCell();
	var cellInfo = graph.getModel().getValue(cell);
	var saveContent = editorUi.createDiv('geDialogInfo');
	// 链接
	var nameTitle = document.createElement('p')
	nameTitle.innerHTML = '链接'
	nameTitle.className = 'geDialogInfoTitle';	
	saveContent.appendChild(nameTitle)
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', cellInfo.getAttribute('linkReport') || '');
	nameInput.setAttribute('placeholder', '请输入链接地址');
	nameInput.className = 'saveFileInput'
	saveContent.appendChild(nameInput)

	// 保存按钮
	var btnContent =editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button('保存', function()
	{
		if (!nameInput.value) {
			mxUtils.alert('请输入链接名称')
		} else {
			cellInfo = cellInfo.cloneNode(true);
			cellInfo.setAttribute('linkReport', nameInput.value)
			graph.getModel().setValue(cell, cellInfo)
			editorUi.hideDialog();
		}
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	// 取消按钮
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btnContent.appendChild(cancelBtn);
	}

	mxEvent.addListener(nameInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			genericBtn.click();
		}
	});
	
	btnContent.appendChild(genericBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		btnContent.appendChild(cancelBtn);
	}

	saveContent.appendChild(btnContent)
	this.container = saveContent;
}
/**
 * 发布弹窗
 */
var PreviewDialog = function(editorUi) {
	var saveContent = editorUi.createDiv('geDialogInfo');
	// 链接
	var nameTitle = document.createElement('p')
	nameTitle.innerHTML = '保存并预览该应用？';
	nameTitle.className = 'geDialogInfoTitle';
	saveContent.appendChild(nameTitle)

	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button('保存并预览', function()
	{
		editorUi.save(editorUi.editor.filename || '新建应用', editorUi.editor.describe || '').then(res => {
			window.open('/interface/preview.html?id=' + res.id);
			editorUi.hideDialog();
		}).catch(e => {
			console.log(e)
		});
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	// 取消按钮
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	btnContent.appendChild(cancelBtn);
	btnContent.appendChild(genericBtn);
	
	saveContent.appendChild(btnContent)
	this.container = saveContent;
}
/**
 * 发布弹窗
 */
var PublishDialog = function(editorUi) {
	var saveContent = editorUi.createDiv('geDialogInfo');
	let editor = editorUi.editor;
	// 链接
	var nameTitle = document.createElement('p')
	nameTitle.innerHTML = '发布之后，生成的应用将在平台展示。';
	nameTitle.className = 'geDialogInfoTitle';
	saveContent.appendChild(nameTitle)

	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button('保存并发布', function()
	{
		editorUi.hideDialog();
		editorUi.save(editor.filename, editor.describe).then(res => {
			editor.ajax(editorUi, '/api/viewtool/publish/'+ editor.getApplyId()+'/1', 'PUT', null, function () {
				editor.tipInfo(editorUi, true, '发布');
			}, function () {
				editor.tipInfo(editorUi, false, '发布');
			});
			editorUi.hideDialog();
		});
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	// 取消按钮
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	btnContent.appendChild(cancelBtn);
	btnContent.appendChild(genericBtn);
	
	saveContent.appendChild(btnContent)
	this.container = saveContent;
}

/**
 * 提示弹窗
 * @param {object} editorUi
 * @param {boolean} flag null:不额外添加字段；true：成功；false失败
 * @param {string} info	提示信息
 */
var tipDialog = function(editorUi, flag, info) {
	var tipContent = editorUi.createDiv('tipDialogInfo');
	// 图标
	var img = document.createElement('img')
	img.setAttribute('src', flag ? '/static/images/default/success.png' : '/static/images/default/error.png');
	tipContent.appendChild(img)
	// 内容
	var infoText = document.createElement('p')
	infoText.className = 'tipText'
	infoText.innerHTML = info + (flag === null ? '' : flag ? '成功' : '失败');
	tipContent.appendChild(infoText)
	setTimeout(function () {
		editorUi.hideDialog()
	}, 3000)
	return tipContent
}

/**
 * 图片弹窗
 * @param {object} editorUi 
 * @param {object} cell 选择的节点 
 */
var ImageDialog = function (editorUi, cell) {
	var graph = editorUi.editor.graph;
	var value = graph.getModel().getValue(cell);
	// Converts the value to an XML node
	if (!mxUtils.isNode(value))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', value || '');
		value = obj;
	}

	// 本地图片
	var localImage;
	// 内部图片
	var saveContent = editorUi.createDiv('geDialogInfo');
	saveContent.innerHTML = `
		<label class="imageRadio">
			<input class="imageTypeRadio" id="innerTypeRadio" type="radio" name="image" checked/>
			内部图片
		</label>
		<div id="innerImageBox">
		</div>
		<label class="imageRadio">
			<input class="imageTypeRadio" id="localTypeRadio" type="radio" name="image" />
			<input type="file" id="chooseImage" title="" accept=".jpg,.jpge,.gif,.png"/>
			其他图片
		</label>
		<p id="choosedImgPath"></p>
	`
	this.init = function () {
		editorUi.editor.ajax(editorUi, '/api/layoutTypes', 'POST', {page: 0, size: 9999999}, function (res) {
			document.getElementById('innerImageBox').innerHTML = `
				${
					res.content.map(val => `
						<ul>
							<li class="innerImageType collapsedImage" data-typeid="${val.id}">${val.descript}</li>
							<ul class="innerImageList">
							</ul>
						</ul>
					`).join('')
				}
			`
		}, function () {

		})
		// 选择图片方式
		document.getElementById('innerTypeRadio').addEventListener('click', function (e) {
			localImage = null;
			e.stopImmediatePropagation()
		})
		document.getElementsByClassName('imageRadio')[1].addEventListener('click', function (e) {
				document.getElementById('checkedImage') ? document.getElementById('checkedImage').id = '' : null;
				document.getElementById('localTypeRadio').checked = true
		})
		// 获取本地图片
		document.getElementById('chooseImage').addEventListener('change', function (e) {
			//创建new FileReader()对象
			var fr = new FileReader();
			// 获取图片信息
			localImage = e.target.files[0];
			//将图片读取为DataURL
			// fr.readAsDataURL(localImage);
			// fr.onload = function() {}
			document.getElementById('choosedImgPath').innerHTML = document.getElementById('chooseImage').value;
		})
		// 内部图片点击事件
		document.getElementById('innerImageBox').addEventListener('click', function (e) {
			var className = e.target.className
			if (/^innerImageType/.test(className)) {
				// 点击图片类型名称
				if (/expandedImage$/.test(className)) {
					// 展开状态点击
					e.target.className = 'innerImageType collapsedImage';
					e.target.nextElementSibling.style.height = '0px';
				} else {
					// 收缩状态点击
					if (e.target.nextElementSibling.children.length === 0) {
						editorUi.editor.ajax(editorUi, '/api/layoutType/' + e.target.getAttribute('data-typeid'), 'GET', null, function (res) {
							e.target.nextElementSibling.innerHTML = `
								${
									res.layouts.map(val => `
										<li data-layout="${val.layout}">${val.layoutName}</li>
									`).join('')
								}
							`
						}, function () {
				
						})
					}
					e.target.className = 'innerImageType expandedImage';
					e.target.nextElementSibling.style.height = ''
				}
			} else if (/innerImageList/.test(e.target.parentNode.className)) {
				document.getElementById('innerTypeRadio').checked = true
				// 点击选择图片
				document.getElementById('checkedImage') ? document.getElementById('checkedImage').id = '' : null;
				e.target.id = 'checkedImage'
			}
		})
	}
	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button('应用', function()
	{
		// 更换图片
		var select = null;
		var cells = graph.getSelectionCells();
		var updateImg = function (newValue) {
			newValue = 'getechFileSystem/' + newValue
			graph.getModel().beginUpdate();
			try {
				graph.setCellStyles(mxConstants.STYLE_IMAGE, (newValue.length > 0) ? newValue : null, cells);
			}
			finally {
				graph.getModel().endUpdate();
			}
	
			if (select != null) {
				graph.setSelectionCells(select);
				graph.scrollCellToVisible(select[0]);
			}
			editorUi.hideDialog();
		}
		var newValue;
		// 选择的是本地文件，上传文件
		if (localImage) {
			var formData = new FormData();
			formData.append('file', localImage);
			editorUi.editor.uploadFile(editorUi, '/api/upload/file', 'POST', formData, function (res) {
				newValue = res.filePath;
				updateImg(newValue)
			})
		} else if (document.getElementById('checkedImage') && document.getElementById('checkedImage').getAttribute('data-layout')) {
			let layout = document.getElementById('checkedImage').getAttribute('data-layout');
			newValue = layout;
			updateImg(newValue)
		} else {
			editorUi.hideDialog();
			return;
		}
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	// 取消按钮
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	btnContent.appendChild(cancelBtn);
	btnContent.appendChild(genericBtn);
	
	saveContent.appendChild(btnContent)
	this.container = saveContent;
}

/**
 * 新建页面
 * @param {object} editorUi
 * @param {string} type 弹窗类型：add-新增；addPrev-上方添加；addNext-下方添加；rename：重命名；copy：复制
 */
var addPageDialog = function (editorUi, type) {
	type = type || 'add';
	var desc = title = id = '';
	var pageType = 'normal';
	var currentPage = editorUi.editor.pages[editorUi.editor.currentPage]
	var xml = editorUi.editor.defaultXml;
	// 编辑和复制默认有值
	if (type == 'rename' || type == 'copy') {
		title = currentPage.title;
		desc = currentPage.desc;
		pageType = currentPage.type;
		xml = currentPage.xml;
		id = currentPage.id;
	} else if (type == 'addPrev' || type == 'addNext') {
		pageType = currentPage.type;
	}
	var saveContent = editorUi.createDiv('geDialogInfo');
	// 页面名称
	var nameTitle = document.createElement('p')
	nameTitle.innerHTML = '页面名称'
	nameTitle.className = 'geDialogInfoTitle';	
	saveContent.appendChild(nameTitle)
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', title);
	nameInput.setAttribute('placeholder', '请输入页面名称');
	nameInput.className = 'saveFileInput'
	saveContent.appendChild(nameInput)

	// 页面描述
	var desTitle = document.createElement('p');
	desTitle.innerHTML = '页面描述';
	desTitle.style.margin = "9px 0 5px";
	desTitle.style.color = "#929292";
	saveContent.appendChild(desTitle)
	
	var descInput = document.createElement('input');
	descInput.setAttribute('value', desc);
	descInput.setAttribute('placeholder', '请输入页面描述');
	descInput.className = 'saveFileInput'
	saveContent.appendChild(descInput)

	// 是否是弹窗
	var isDialog = document.createElement('label');
	isDialog.style.float = "left";
	isDialog.style.fontSize = "14px";
	isDialog.style.lineHeight = "16px";
	isDialog.style.marginTop = "12px";

	var isDialogFlag = document.createElement('input');
	isDialogFlag.style.float = "left";
	isDialogFlag.style.width = "16px";
	isDialogFlag.style.height = "16px";
	isDialogFlag.style.marginRight = "6px";
	isDialogFlag.setAttribute('type', 'checkbox');
	// 是否是弹窗
	pageType === 'dialog' && isDialogFlag.setAttribute('checked', true);
	(['rename', 'addPrev', 'addNext'].indexOf(type) !== -1 ) && isDialogFlag.setAttribute('disabled', true);
	isDialog.appendChild(isDialogFlag);
	var text = document.createElement('span');
	text.innerText = '弹窗式';
	isDialog.appendChild(text);
	saveContent.appendChild(isDialog);
	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');;
	var genericBtn = mxUtils.button('应用', function()
	{
		var titleText = nameInput.value.trim();
		if (!titleText) {
			mxUtils.alert('请输入页面名称');
		} else if (editorUi.editor.pages[titleText]) {
			mxUtils.alert('存在相同名称页面');
		} else if (titleText.length > 20) {
			mxUtils.alert('页面名称不能超过20个字符');
		} else {
			for (let key in editorUi.editor.pages) {
				if (editorUi.editor.pages[key].title === titleText) {
					mxUtils.alert('页面名称不能重复');
					return;
				}
			}
			const pageType = isDialogFlag.checked ? 'dialog' : 'normal';
			var page = {
				title: titleText,
				desc: descInput.value,
				xml,
				id,
				type: pageType
			};

			if (type == 'rename') {
				// 重命名
				editorUi.editor.pages[page.id] = page;
				$(".currentPage").text(page.title);
			} else {
				let _li = document.createElement('li');
				let resPage = editorUi.editor.addPage(page);
				_li.setAttribute('data-pageid', resPage.id);
				_li.innerHTML = titleText;
				let changeRank = editorUi.editor.pagesRank[resPage.type];
				// 根据类型插入列表
				if (type === 'addPrev') {
					const idx = changeRank.indexOf($('.currentPage').attr('data-pageid'));;
					changeRank.splice(idx, 0, resPage.id);
					$(_li).insertBefore($('.currentPage'));
				} else if (type === 'addNext') {
					const idx = changeRank.indexOf($('.currentPage').attr('data-pageid'));;
					changeRank.splice(idx + 1, 0, resPage.id);
					$(_li).insertAfter($('.currentPage'));
				} else if (isDialogFlag.checked) {
					changeRank.push(resPage.id);
					$("#dialogPages").append(_li);
				} else {
					changeRank.push(resPage.id);
					$("#normalPages").append(_li);
				};
				editorUi.editor.pagesRank[resPage.type] = [].concat(changeRank);
			}
			editorUi.hideDialog();
		}
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	// 取消按钮
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	btnContent.appendChild(cancelBtn);
	btnContent.appendChild(genericBtn);
	
	saveContent.appendChild(btnContent)
	this.container = saveContent;
}
/**
 * 下拉列表属性弹窗
 * @param {object} editorUi 
 */

/**
 * 第一次弹窗将其转为xml
 * @param {object} graph 
 * @param {object} cell 
 */
function convertsToXml (graph, cell) {
	var value = graph.getModel().getValue(cell);
	if (!mxUtils.isNode(value))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', value || '');
		value = obj;
	}
	return value;
}
var SelectPropDialog = function (editorUi, cell) {
	var graph = editorUi.editor.graph;
	var value = convertsToXml(graph, cell)
	// 获取选中节点
	var cellInfo = graph.getModel().getValue(cell);
	if (!mxUtils.isNode(cellInfo))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', cellInfo || '');
		cellInfo = obj;
	}
	var selectData = []
	if (cellInfo.attributes.selectProps) {
		selectData = [].concat(cellInfo.attributes.selectProps.nodeValue.split(','))
	}
	var defaultProp = cellInfo.getAttribute('defaultProp');
	var saveContent = editorUi.createDiv('geDialogInfo')
	// 属性列表
	saveContent.innerHTML = `
		<div id="innerPropsBox">
			<div class="innerPropsOperate">
				<img id="addProp" src="/static/images/icons/addProp.png" title="增加" />
				<img id="moveUp" src="/static/images/icons/moveupProp.png" title="上移" />
				<img id="moveDown" src="/static/images/icons/movedownProp.png" title="下移" />
				<img id="delProp" src="/static/images/icons/deleteProp.png" title="删除" />
			</div>
			<ul id="innerPropsList">
			${
				selectData.reduce((str, v) => str += `
						<li class="innerPropsType">
							<input type="checkbox" ${defaultProp === v ? 'checked' : '' } />
							<span>${v}</span>
						</li>
				`, '')
			}
			</ul>
		</div>
	`

	this.init = function () {
		// 增加
		$("#addProp").click(function () {
			var liEle = document.createElement('li')
			liEle.className = 'innerPropsType'
			var inputEle = document.createElement('input')
			inputEle.setAttribute('type', 'checkbox')
			liEle.appendChild(inputEle);
			var spanEle = document.createElement('span')
			spanEle.innerText = "新增属性"
			liEle.appendChild(spanEle);
			$("#innerPropsList").append(liEle)
		})
		// 上移
		$("#moveUp").click(function () {
			var node = 	$("#innerPropsList .active").eq(0);
			if (!node) { return false };
			node.insertBefore(node.prev());
		})
		// 下移
		$("#moveDown").click(function () {
			var node = 	$("#innerPropsList .active").eq(0);
			if (!node) { return false };
			node.insertAfter(node.next());
		})
		// 删除
		$("#delProp").click(function () {
			$("#innerPropsList .active").eq(0).remove()
		})
		// 单击选中
		$("#innerPropsList").click(function (e) {
			e = e || window.event;
			var node = e.target;
			if (node.nodeName === 'SPAN') {
				node = node.parentNode;
			} else if ( node.nodeName === 'INPUT' ) {
				node = node.parentNode;
				$(node).siblings().children(':checked').prop('checked', false)
			} else if ( node.nodeName !== 'LI') {
				return false;
			}
			$(node).siblings('.active')[0] ? $(node).siblings('.active')[0].className = 'innerPropsType' : '';
			node.className += " active";
		})
		// 双击编辑
		$("#innerPropsList").dblclick(function (e) {
			e = e || window.event;
			var target = e.target;
			if (target.nodeName === 'SPAN') {
				// 添加编辑框
				var _input = document.createElement('input')
				_input.className = 'editInput'
				target.parentNode.appendChild(_input);
				_input.focus();
				$(_input).val(target.innerText)
				// 失去焦点
				_input.addEventListener('blur', function () {
					$(this).prev().text($(this).val())
					$(this).remove();
				})
			}
		})
	}
	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button('应用', function()
	{
		var list = $("#innerPropsList").children();
		var data = [];
		for (var i = 0; i < list.length; i++) {
			data.push(list[i].children[1].innerText)
		};
		defaultProp = $('.innerPropsType input:checked').next().text();
		cellInfo.setAttribute('defaultProp', defaultProp);
		console.log(cellInfo.getAttribute('label'),defaultProp)
		cellInfo.setAttribute('label', cellInfo.getAttribute('label').replace(/"selectTag">(.*)<\/select>/, `"selectTag"><option>${defaultProp}</option></select>`))
		cellInfo.setAttribute('selectProps', data);
		graph.getModel().setValue(cell, cellInfo)
		editorUi.hideDialog();
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	// 取消按钮
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	btnContent.appendChild(cancelBtn);
	btnContent.appendChild(genericBtn);
	
	saveContent.appendChild(btnContent)
	this.container = saveContent;
}

function fillParams (elt, data) {
	elt.innerHTML = '';
	elt.innerHTML = `
		${
			data.map(param => `
				<span>${param.name}</span>
			`).join(';')
		}
	`;
}
/**
 * 控件数据弹窗
 * @param {object} editorUi 
 * @param {object} cell 
 */
var PaletteDataDialog = function(editorUi, cell) {
	var graph = editorUi.editor.graph;
	var modelInfo = graph.getModel().getValue(cell);
	var paramsData = '';
	// 绑定数据信息
	var bindData = JSON.parse(modelInfo.getAttribute('bindData')) || {
		pointType: '',
		point: '',
		params: [],
		fillVariable: false,
		changeStatus: []
	}
	// 弹窗内容
	var saveContent = editorUi.createDiv('geDialogInfo')
	saveContent.style.padding = "22px";
	// 已选择参数列表
	var choosedParam = bindData.params;
	// 填充列表
	this.fillContent = function (ele, data) {
		ele.innerHTML = '';
		for (var i = 0; i < data.length; i++) {
			var opt = document.createElement('option');
			opt.innerText = data[i].name;
			opt.setAttribute('value', data[i].id);
			( ele.id == 'pointSelect' ? bindData.point : bindData.pointType) === data[i].id ? opt.setAttribute('selected',  true) : null;
			if (data[i].points) {
				opt.setAttribute('data-points', JSON.stringify(data[i].points))
				opt.setAttribute('data-params', JSON.stringify(data[i].params))
			}
			ele.appendChild(opt)
		}
	}
	
	// 采集点类型：
	var typeTitle = document.createElement('p')
	typeTitle.innerHTML = '采集点类型：';
	typeTitle.className = 'geDialogInfoTitle';
	saveContent.appendChild(typeTitle)
	
	var typeSelect = document.createElement('select');
	typeSelect.setAttribute('value', '');
	typeSelect.className = 'dialogSelect';
	typeSelect.id = 'typeSelect';
	typeSelect.setAttribute('value', bindData.pointType)
	saveContent.appendChild(typeSelect)
	
	// 采集点：
	var pointTitle = document.createElement('p');
	pointTitle.innerHTML = '采集点：';
	pointTitle.className = 'geDialogInfoTitle';
	saveContent.appendChild(pointTitle)
	
	var pointSelect = document.createElement('select');
	pointSelect.setAttribute('value', '');
	pointSelect.className = 'dialogSelect'
	pointSelect.id = 'pointSelect'
	saveContent.appendChild(pointSelect)

	// 变量：
	var variableTitle = document.createElement('p');
	variableTitle.className = 'geDialogInfoTitle';
	var variableTitleSpan = document.createElement('span');
	variableTitleSpan.innerHTML = '变量：';
	variableTitle.appendChild(variableTitleSpan);
	// 添加变量
	var addVariableBtn = document.createElement('span');
	addVariableBtn.innerHTML = '变量';
	addVariableBtn.className = 'addVariableBtn';
	variableTitle.appendChild(addVariableBtn);
	saveContent.appendChild(variableTitle)
	// 填充内容的变量
	var insertVariable = document.createElement('div');
	insertVariable.className = 'geDialogInfoTitle';
	insertVariable.innerHTML = `
		<span>填充数据：</span>
		<span>
			<label>
				<input type='radio' class="fillVariable" value=true style="transform: translateY(2px)" name='insert' ${bindData.fillVariable && 'checked'} />
				是(默认填充第一个参数)
			</label>
			<label>
				<input type='radio' class="fillVariable" value=false style="transform: translateY(2px)" name='insert' ${!bindData.fillVariable && 'checked'} />
				否
			</label>
		</span>
	`
	saveContent.appendChild(insertVariable)
	// 变量列表
	var variableList = document.createElement('div');
	variableList.className = 'dataDialogList variablesList'
	fillParams(variableList, choosedParam);
	saveContent.appendChild(variableList);
	
	// 选择模型：
	var modelTitle = document.createElement('p');
	modelTitle.innerHTML = '选择模型：';
	modelTitle.className = 'geDialogInfoTitle';
	saveContent.appendChild(modelTitle)
	// 模型列表
	var modelList = document.createElement('ul');
	modelList.className = 'dataDialogList modelList'
	saveContent.appendChild(modelList);
		
	// 绑定事件
	// 选择采集点类型
	mxEvent.addListener(typeSelect, 'change', (e) => {
		var data = $(typeSelect).find("option:selected").data('points');
		paramsData = $(typeSelect).find("option:selected").data('params');
		this.fillContent(pointSelect, data);
		choosedParam = [];
		fillParams(variableList, choosedParam);
	})
	// 切换采集点
	mxEvent.addListener(pointSelect, 'change', (e) => {
		choosedParam = [];
		fillParams(variableList, choosedParam);
		fillModelList(modelList, []);
	});
	// 选择变量应用回调函数
	function chooseVariable(data) {
		choosedParam = data;
		fillParams(variableList, choosedParam);
		editorUi.hideDialog();
		getModels(editorUi, modelList, pointSelect.value, data.map(val => val.id).join(), true)
	}
	// 选择变量
	addVariableBtn.addEventListener('click', function (e) {
		var dlg = new chooseVariableDialog(editorUi, paramsData, choosedParam, chooseVariable)
		editorUi.showDialog(dlg.container, 410, 350, true, false, null, null, '选择变量');
	})
	
	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button('应用', function()
	{
		// 配置模型应用报警方式ajax
		bindData = {
			pointType: typeSelect.value,
			point: pointSelect.value,
			params: choosedParam,
			fillVariable: $('.fillVariable:checked').val() == 'true'
		}
		
		graph.getModel().beginUpdate();
		try {
			modelInfo.setAttribute('bindData', JSON.stringify(bindData));
			graph.getModel().setValue(cell, modelInfo);
		}
		finally {
			graph.getModel().endUpdate();
		}
		editorUi.hideDialog();
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	// 取消按钮
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	this.init = () => {
		editorUi.editor.ajax(editorUi, '/api/pointTypes', 'GET', '', (res) => {
			// 点位类型数据
			var pointTypes = [].concat(res);
			pointTypes.unshift({
				name: '请选择',
				id: '',
				points: [],
				params: []
			})
			// 点位列表
			const currentPointType = pointTypes.filter(val => {
				return val.id == bindData.pointType
			})[0];
			var pointsData = currentPointType.points;
			// 参数列表
			paramsData = currentPointType.params;
			
			this.fillContent(typeSelect, pointTypes)
			this.fillContent(pointSelect, pointsData)
			
			// 查询模型列表
			getModels(editorUi, modelList, bindData.point, bindData.params.map(val => val.id).join())
		})
	}
	cancelBtn.className = 'geBtn';
	btnContent.appendChild(cancelBtn);
	btnContent.appendChild(genericBtn);
	
	saveContent.appendChild(btnContent)
	this.container = saveContent;
}

/**
 * 生成列表
 * @param {Array<string>} data 数据列表
 * @param {string} classname class名称
 */
function createList (data, classname) {
	classname = classname || '';
	this.ulEle = document.createElement('ul');
	this.ulEle.className = classname;
	this.params = {};
	this.nodes = []; //选中的DOM节点
	this.ulEle.setAttribute('data-variables', []);
	fillList(this.ulEle, data);
	this.ulEle.addEventListener('click', function (e) {
		e = e || window.event;
		var target = e.target;
		// 事件委托
		if (target.nodeName === 'LI') {
			if (target.className == 'active' ) {
				target.className = '';
				let index = 0;
				this.nodes.splice( index , 1 );
				if (this.params[target.getAttribute('data-paramId')]) {
					delete this.params[target.getAttribute('data-paramId')]
				} 
			} else {
				target.className = 'active';
				this.params[target.getAttribute('data-paramId')] = {
					name: target.innerHTML,
					id: target.getAttribute('data-paramId')
				};
				this.nodes.push(target);
			}
			// 锁定操作按钮
			if (classname == 'sourceList variableList') {
				if (!Object.keys(this.params).length) {
					document.getElementsByClassName('increment')[0].className = 'increment disabledCrement';
				} else {
					document.getElementsByClassName('increment')[0].className = 'increment';
				}
			} else if (classname == 'destList variableList') {
				if (!Object.keys(this.params).length) {
					document.getElementsByClassName('decrement')[0].className = 'decrement disabledCrement';
				} else {
					document.getElementsByClassName('decrement')[0].className = 'decrement';
				}
			};
		}
	}.bind(this))
}

/**
 * 填充列表
 * @param {object} ele 
 * @param {Array} data
 */
function fillList (ele, data) {
	for (var i in data) {
		var opt = document.createElement('li');
		opt.innerText = data[i].name;
		opt.setAttribute('data-paramId', data[i].id)
		opt.setAttribute('title', data[i].name);
		ele.appendChild(opt);
	}
}

/**
 * 选择变量
 * @param {Array} data 全部参数列表
 * @param {Array} chooseData 以选择参数列表
 */
var chooseVariableDialog = function (editorUi, sourcedata = [], chooseData = [], fn) {
	var saveContent = editorUi.createDiv('geDialogInfo')
	saveContent.setAttribute('data-dialog', 'chooseVariable');
	// 搜索
	var searchBox = editorUi.createDiv('searchBox')
	var searchInput = document.createElement('input')
	searchInput.className = "dialogSelect"
	searchInput.setAttribute('placeholder', '搜索')
	searchBox.appendChild(searchInput)
	var searchBtn = document.createElement('button')
	searchBtn.innerText = "搜索"
	searchBox.appendChild(searchBtn)
	saveContent.appendChild(searchBox)

	// 点击搜索
	mxEvent.addListener(searchBtn, 'click', function () {
		let filterList = sourcedata.filter(val => {
			return val.name.indexOf(searchInput.value) != -1
		})
		sourceList.nodes = [];
		sourceList.params = {};
		sourceList.ulEle.innerHTML = '';
		document.getElementsByClassName('increment')[0].className = 'increment disabledCrement';
		fillList(sourceList.ulEle, filterList);
	})
	// 源变量列表，过滤已选中的
	sourcedata = sourcedata.filter(val => {
		for (let item of chooseData) {
			if (item.id === val.id) {
				return false
			}
		}
		return true
	})
	var sourceList = new createList(sourcedata, 'sourceList variableList');
	saveContent.appendChild(sourceList.ulEle);
	// 操作变量
	// 右边增加变量
	var operateList = editorUi.createDiv('operateList');
	var increment = editorUi.createDiv('increment disabledCrement');
	increment.innerText = '+';
	operateList.appendChild(increment);
	// 右边增加变量
	increment.addEventListener('click', function () {
		// 删除节点
		for (var i = 0; i < sourceList.nodes.length; i++) {
			sourceList.ulEle.removeChild(sourceList.nodes[i])
		}
		sourceList.nodes = [];
		// 修改数据
		var sList = sourceList.params;
		for (let key in sList) {
			chooseData.push(sList[key]);
			sourcedata = sourcedata.filter(val => {
				return val.id !== key
			})
		}
		fillList(destList.ulEle, sList);
		sourceList.params = {};
		document.getElementsByClassName('increment')[0].className = 'increment disabledCrement';
	})
	// 右边减少变量
	var decrement = editorUi.createDiv('decrement disabledCrement');
	decrement.innerText = '-';
	operateList.appendChild(decrement);
	saveContent.appendChild(operateList);
	// 目标变量列表
	var destList = new createList(chooseData, 'destList variableList');
	saveContent.appendChild(destList.ulEle);
	decrement.addEventListener('click', function () {
		// 删除节点
		for (var i = 0; i < destList.nodes.length; i++) {
			destList.ulEle.removeChild(destList.nodes[i])
		}
		destList.nodes = [];
		// 修改数据
		var sList = destList.params;
		for (let key in sList) {
			sourcedata.push(sList[key]);
			chooseData = chooseData.filter(val => {
				return val.id !== key
			})
		}
		for (let key in sList) {
			delete chooseData[key]
		}
		fillList(sourceList.ulEle, sList);
		destList.params = {};
		document.getElementsByClassName('decrement')[0].className = 'decrement disabledCrement';
	})

	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button('应用', function()
	{
		fn(chooseData);
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	// 取消按钮
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	btnContent.appendChild(cancelBtn);
	btnContent.appendChild(genericBtn);
	
	saveContent.appendChild(btnContent)
	this.container = saveContent;
}

/**
 * 根据采集点和参数查询应用
 * @param {object} editorUi
 * @param {string} pointId 采集点id
 * @param {string} paramId 变量id，逗号隔开
 * @param {boolean} closeDialog 是否需要关闭弹窗
 */
function getModels (editorUi, modelEle, pointId, paramId, closeDialog = false) {
	var modelData = [];
	if (pointId && paramId) {
		editorUi.editor.ajax(editorUi, '/api/viewTool/model/serach', 'POST', {pointId, paramId}, function (res) {
			modelData = [].concat(res);
			fillModelList(modelEle, modelData);
		}, null, '获取应用模型中···')
	} else {
		fillModelList(modelEle, modelData);
	}
	return modelData;
}

/**
 * 填充模型列表
 * @param {object} ele 模型列表的DOM节点
 * @param {Array} data 数据列表
 */
function fillModelList (ele, data) {
	if (data.length) {
		ele.innerHTML = `
			${
				data.map(model => `
					<li>
						<span style="color: #767676">${model.modelName}</span>
						<span title="${JSON.parse(model.modelContent)[0].replaceName}">${JSON.parse(model.modelContent)[0].replaceName}</span>
					</li>
				`).join('')
			}
		`;
	} else {
		sessionStorage.setItem('oldTab', JSON.stringify(      
			[
				{
						"path":"/alarmCenter",
						"name":"控制中心",
						"current":"",
						"status":""
				},
				{
						"name":"模型管理",
						"path":"/modelManage",
						"current":"}",
						"status":"add"
				}
		]));
		sessionStorage.setItem('tabIndex', 1);
		ele.innerHTML = `
			<span>当前采集点参数未独立应用模型</span><a class="addModelBtn" target="_blank" href="/modelManage">去添加模型</a>
		`
	}
}

/**
 * 填充执行列表
 * @param {object} ele 执行列表的DOM节点
 * @param {Array} data 数据列表
 */
function fillExecuteList (ele, data) {
	// 状态列表
	const statusList = [
		{
			status: 0,
			title: '不作任何变化'
		}, {
			status: 1,
			title: '预警黄'
		}, {
			status: 2,
			title: '告警红'
		}, {
			status: 3,
			title: '异常灰'
		}
	];

	ele.innerHTML = `
		${
			data.map(model => `
				<li data-modelId="${model.id}">
					<input type="checkbox" name="models" style="float: left;margin: 6px 2px 0 0;" ${model.warn != 0 ? "checked" : ""}/>
					<span style="color: #767676;float: left;width: 240px;overflow: hidden;text-overflow: ellipsis;" title="${model.modelName}${model.modelRule}">${model.modelName}${model.modelRule}</span>
					<select style="float: left;width: 65px;border-color: #C5C5C5;" value='3'>
					${
						statusList.map(status => `
							<option ${status.status == model.warn ? "selected" : ""} value="${status.status}">${status.title}</option>
						`).join('')
					}
					</select>
				</li>
			`).join('')
		}
	`;
}
/**
 * 更换图元
 */
var ChangePrimitiveDialog = function (editorUi) {
	var saveContent = editorUi.createDiv('geDialogInfo');
	saveContent.setAttribute('data-dialog', 'changePrimitive');
	// 图元列表
	var graph = editorUi.editor.graph;
	var cells = graph.getSelectionCells();
	saveContent.innerHTML = `
	${
		editorUi.sidebar.primitives.map(val => `
			<img class="primitiveIcon" src="/static/stencils/basic/${val}.png" />
		`).join('')
	}
	`
	// 点击更换图元
	mxEvent.addListener(saveContent, 'click', function (evt) {
		if (evt.target.nodeName === 'IMG') {
			graph.getModel().beginUpdate();
			try {
				graph.setCellStyles(mxConstants.STYLE_IMAGE, evt.target.getAttribute('src'), cells);
				editorUi.hideDialog();
			}
			finally {
				graph.getModel().endUpdate();
			}
		}
	})
	// saveContent.appendChild(primitiveList);
	this.container = saveContent;
}

/**
 * Constructs a new edit file dialog.
 */
var EditDiagramDialog = function(editorUi)
{
	var div = document.createElement('div');
	div.style.textAlign = 'right';
	var textarea = document.createElement('textarea');
	textarea.setAttribute('wrap', 'off');
	textarea.setAttribute('spellcheck', 'false');
	textarea.setAttribute('autocorrect', 'off');
	textarea.setAttribute('autocomplete', 'off');
	textarea.setAttribute('autocapitalize', 'off');
	textarea.style.overflow = 'auto';
	textarea.style.resize = 'none';
	textarea.style.width = '590px';
	textarea.style.height = '360px';
	textarea.style.marginBottom = '16px';
	
	textarea.value = mxUtils.getPrettyXml(editorUi.editor.getGraphXml());
	div.appendChild(textarea);
	
	this.init = function()
	{
		textarea.focus();
	};
	
	// Enables dropping files
	if (Graph.fileSupport)
	{
		function handleDrop(evt)
		{
		    evt.stopPropagation();
		    evt.preventDefault();
		    
		    if (evt.dataTransfer.files.length > 0)
		    {
    			var file = evt.dataTransfer.files[0];
    			var reader = new FileReader();
				
				reader.onload = function(e)
				{
					textarea.value = e.target.result;
				};
				
				reader.readAsText(file);
    		}
		    else
		    {
		    	textarea.value = editorUi.extractGraphModelFromEvent(evt);
		    }
		};
		
		function handleDragOver(evt)
		{
			evt.stopPropagation();
			evt.preventDefault();
		};

		// Setup the dnd listeners.
		textarea.addEventListener('dragover', handleDragOver, false);
		textarea.addEventListener('drop', handleDrop, false);
	}
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		div.appendChild(cancelBtn);
	}
	
	var select = document.createElement('select');
	select.style.width = '180px';
	select.className = 'geBtn';

	if (editorUi.editor.graph.isEnabled())
	{
		var replaceOption = document.createElement('option');
		replaceOption.setAttribute('value', 'replace');
		mxUtils.write(replaceOption, mxResources.get('replaceExistingDrawing'));
		select.appendChild(replaceOption);
	}

	var newOption = document.createElement('option');
	newOption.setAttribute('value', 'new');
	mxUtils.write(newOption, mxResources.get('openInNewWindow'));
	
	if (EditDiagramDialog.showNewWindowOption)
	{
		select.appendChild(newOption);
	}

	if (editorUi.editor.graph.isEnabled())
	{
		var importOption = document.createElement('option');
		importOption.setAttribute('value', 'import');
		mxUtils.write(importOption, mxResources.get('addToExistingDrawing'));
		select.appendChild(importOption);
	}

	div.appendChild(select);

	var okBtn = mxUtils.button(mxResources.get('ok'), function()
	{
		// Removes all illegal control characters before parsing
		var data = editorUi.editor.graph.zapGremlins(mxUtils.trim(textarea.value));
		var error = null;
		
		if (select.value == 'new')
		{
			window.openFile = new OpenFile(function()
			{
				editorUi.hideDialog();
				window.openFile = null;
			});
			
			window.openFile.setData(data, null);
			editorUi.editor.graph.openLink(editorUi.getUrl());
		}
		else if (select.value == 'replace')
		{
			editorUi.editor.graph.model.beginUpdate();
			try
			{
				editorUi.editor.setGraphXml(mxUtils.parseXml(data).documentElement);
				// LATER: Why is hideDialog between begin-/endUpdate faster?
				editorUi.hideDialog();
			}
			catch (e)
			{
				error = e;
			}
			finally
			{
				editorUi.editor.graph.model.endUpdate();				
			}
		}
		else if (select.value == 'import')
		{
			editorUi.editor.graph.model.beginUpdate();
			try
			{
				var doc = mxUtils.parseXml(data);
				var model = new mxGraphModel();
				var codec = new mxCodec(doc);
				codec.decode(doc.documentElement, model);
				
				var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
				editorUi.editor.graph.setSelectionCells(editorUi.editor.graph.importCells(children));
				
				// LATER: Why is hideDialog between begin-/endUpdate faster?
				editorUi.hideDialog();
			}
			catch (e)
			{
				error = e;
			}
			finally
			{
				editorUi.editor.graph.model.endUpdate();				
			}
		}
			
		if (error != null)
		{
			mxUtils.alert(error.message);
		}
	});
	okBtn.className = 'geBtn gePrimaryBtn';
	div.appendChild(okBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		div.appendChild(cancelBtn);
	}

	this.container = div;
};

/**
 * 
 */
EditDiagramDialog.showNewWindowOption = true;

/**
 * Constructs a new link dialog.
 */
var LinkDialog = function(editorUi, initialValue, btnLabel, fn)
{
	var div = document.createElement('div');
	mxUtils.write(div, mxResources.get('editLink') + ':');
	
	var inner = document.createElement('div');
	inner.className = 'geTitle';
	inner.style.backgroundColor = 'transparent';
	inner.style.borderColor = 'transparent';
	inner.style.whiteSpace = 'nowrap';
	inner.style.textOverflow = 'clip';
	inner.style.cursor = 'default';
	
	if (!mxClient.IS_VML)
	{
		inner.style.paddingRight = '20px';
	}
	
	var linkInput = document.createElement('input');
	linkInput.setAttribute('value', initialValue);
	linkInput.setAttribute('placeholder', 'http://www.example.com/');
	linkInput.setAttribute('type', 'text');
	linkInput.style.marginTop = '6px';
	linkInput.style.width = '400px';
	linkInput.style.backgroundImage = 'url(\'' + Dialog.prototype.clearImage + '\')';
	linkInput.style.backgroundRepeat = 'no-repeat';
	linkInput.style.backgroundPosition = '100% 50%';
	linkInput.style.paddingRight = '14px';
	
	var cross = document.createElement('div');
	cross.setAttribute('title', mxResources.get('reset'));
	cross.style.position = 'relative';
	cross.style.left = '-16px';
	cross.style.width = '12px';
	cross.style.height = '14px';
	cross.style.cursor = 'pointer';

	// Workaround for inline-block not supported in IE
	cross.style.display = (mxClient.IS_VML) ? 'inline' : 'inline-block';
	cross.style.top = ((mxClient.IS_VML) ? 0 : 3) + 'px';
	
	// Needed to block event transparency in IE
	cross.style.background = 'url(' + IMAGE_PATH + '/transparent.gif)';

	mxEvent.addListener(cross, 'click', function()
	{
		linkInput.value = '';
		linkInput.focus();
	});
	
	inner.appendChild(linkInput);
	inner.appendChild(cross);
	div.appendChild(inner);
	
	this.init = function()
	{
		linkInput.focus();
		
		if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
		{
			linkInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	};
	
	var btns = document.createElement('div');
	btns.style.marginTop = '18px';
	btns.style.textAlign = 'right';

	mxEvent.addListener(linkInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			editorUi.hideDialog();
			fn(linkInput.value);
		}
	});

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	var mainBtn = mxUtils.button(btnLabel, function()
	{
		editorUi.hideDialog();
		fn(linkInput.value);
	});
	mainBtn.className = 'geBtn gePrimaryBtn';
	btns.appendChild(mainBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
};

/**
 * 
 */
var OutlineWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;

	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.width = '100%';
	div.style.height = '100%';
	div.style.border = '1px solid whiteSmoke';
	div.style.overflow = 'hidden';

	this.window = new mxWindow(mxResources.get('outline'), div, x, y, w, h, true, true);
	this.window.minimumSize = new mxRectangle(0, 0, 80, 80);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);
	
	this.window.setLocation = function(x, y)
	{
		var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		
		x = Math.max(0, Math.min(x, iw - this.table.clientWidth));
		y = Math.max(0, Math.min(y, ih - this.table.clientHeight - 48));

		if (this.getX() != x || this.getY() != y)
		{
			mxWindow.prototype.setLocation.apply(this, arguments);
		}
	};
	
	var resizeListener = mxUtils.bind(this, function()
	{
		var x = this.window.getX();
		var y = this.window.getY();
		
		this.window.setLocation(x, y);
	});
	
	mxEvent.addListener(window, 'resize', resizeListener);
	
	var outline = editorUi.createOutline(this.window);

	this.destroy = function()
	{
		mxEvent.removeListener(window, 'resize', resizeListener);
		this.window.destroy();
		outline.destroy();
	}

	this.window.addListener(mxEvent.RESIZE, mxUtils.bind(this, function()
   	{
		outline.update(false);
		outline.outline.sizeDidChange();
   	}));
	
	this.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
	{
		outline.suspended = false;
		outline.outline.refresh();
		outline.update();
	}));
	
	this.window.addListener(mxEvent.HIDE, mxUtils.bind(this, function()
	{
		outline.suspended = true;
	}));
	
	this.window.addListener(mxEvent.NORMALIZE, mxUtils.bind(this, function()
	{
		outline.suspended = false;
		outline.update();
	}));
			
	this.window.addListener(mxEvent.MINIMIZE, mxUtils.bind(this, function()
	{
		outline.suspended = true;
	}));

	var outlineCreateGraph = outline.createGraph;
	outline.createGraph = function(container)
	{
		var g = outlineCreateGraph.apply(this, arguments);
		g.gridEnabled = false;
		g.pageScale = graph.pageScale;
		g.pageFormat = graph.pageFormat;
		g.background = (graph.background == null || graph.background == mxConstants.NONE) ? graph.defaultPageBackgroundColor : graph.background;
		g.pageVisible = graph.pageVisible;

		var current = mxUtils.getCurrentStyle(graph.container);
		div.style.backgroundColor = current.backgroundColor;
		
		return g;
	};
	
	function update()
	{
		outline.outline.pageScale = graph.pageScale;
		outline.outline.pageFormat = graph.pageFormat;
		outline.outline.pageVisible = graph.pageVisible;
		outline.outline.background = (graph.background == null || graph.background == mxConstants.NONE) ? graph.defaultPageBackgroundColor : graph.background;;
		
		var current = mxUtils.getCurrentStyle(graph.container);
		div.style.backgroundColor = current.backgroundColor;

		if (graph.view.backgroundPageShape != null && outline.outline.view.backgroundPageShape != null)
		{
			outline.outline.view.backgroundPageShape.fill = graph.view.backgroundPageShape.fill;
		}
		
		outline.outline.refresh();
	};

	outline.init(div);

	editorUi.editor.addListener('resetGraphView', update);
	editorUi.addListener('pageFormatChanged', update);
	editorUi.addListener('backgroundColorChanged', update);
	editorUi.addListener('backgroundImageChanged', update);
	editorUi.addListener('pageViewChanged', function()
	{
		update();
		outline.update(true);
	});
	
	if (outline.outline.dialect == mxConstants.DIALECT_SVG)
	{
		var zoomInAction = editorUi.actions.get('zoomIn');
		var zoomOutAction = editorUi.actions.get('zoomOut');
		
		mxEvent.addMouseWheelListener(function(evt, up)
		{
			var outlineWheel = false;
			var source = mxEvent.getSource(evt);
	
			while (source != null)
			{
				if (source == outline.outline.view.canvas.ownerSVGElement)
				{
					outlineWheel = true;
					break;
				}
	
				source = source.parentNode;
			}
	
			if (outlineWheel)
			{
				if (up)
				{
					zoomInAction.funct();
				}
				else
				{
					zoomOutAction.funct();
				}
	
				mxEvent.consume(evt);
			}
		});
	}
};

/**
 * 
 */
var LayersWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;
	
	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.background = (Dialog.backdropColor == 'white') ? 'whiteSmoke' : Dialog.backdropColor;
	div.style.border = '1px solid whiteSmoke';
	div.style.height = '100%';
	div.style.marginBottom = '10px';
	div.style.overflow = 'auto';

	var tbarHeight = (!EditorUi.compactUi) ? '30px' : '26px';
	
	var listDiv = document.createElement('div')
	listDiv.style.backgroundColor = (Dialog.backdropColor == 'white') ? '#dcdcdc' : '#e5e5e5';
	listDiv.style.position = 'absolute';
	listDiv.style.overflow = 'auto';
	listDiv.style.left = '0px';
	listDiv.style.right = '0px';
	listDiv.style.top = '0px';
	listDiv.style.bottom = (parseInt(tbarHeight) + 7) + 'px';
	div.appendChild(listDiv);
	
	var dragSource = null;
	var dropIndex = null;
	
	mxEvent.addListener(div, 'dragover', function(evt)
	{
		evt.dataTransfer.dropEffect = 'move';
		dropIndex = 0;
		evt.stopPropagation();
		evt.preventDefault();
	});
	
	// Workaround for "no element found" error in FF
	mxEvent.addListener(div, 'drop', function(evt)
	{
		evt.stopPropagation();
		evt.preventDefault();
	});

	var layerCount = null;
	var selectionLayer = null;
	
	var ldiv = document.createElement('div');
	
	ldiv.className = 'geToolbarContainer';
	ldiv.style.position = 'absolute';
	ldiv.style.bottom = '0px';
	ldiv.style.left = '0px';
	ldiv.style.right = '0px';
	ldiv.style.height = tbarHeight;
	ldiv.style.overflow = 'hidden';
	ldiv.style.padding = (!EditorUi.compactUi) ? '1px' : '4px 0px 3px 0px';
	ldiv.style.backgroundColor = (Dialog.backdropColor == 'white') ? 'whiteSmoke' : Dialog.backdropColor;
	ldiv.style.borderWidth = '1px 0px 0px 0px';
	ldiv.style.borderColor = '#c3c3c3';
	ldiv.style.borderStyle = 'solid';
	ldiv.style.display = 'block';
	ldiv.style.whiteSpace = 'nowrap';
	
	if (mxClient.IS_QUIRKS)
	{
		ldiv.style.filter = 'none';
	}
	
	var link = document.createElement('a');
	link.className = 'geButton';
	
	if (mxClient.IS_QUIRKS)
	{
		link.style.filter = 'none';
	}
	
	var removeLink = link.cloneNode();
	removeLink.innerHTML = '<div class="geSprite geSprite-delete" style="display:inline-block;"></div>';

	mxEvent.addListener(removeLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			graph.model.beginUpdate();
			try
			{
				var index = graph.model.root.getIndex(selectionLayer);
				graph.removeCells([selectionLayer], false);
				
				// Creates default layer if no layer exists
				if (graph.model.getChildCount(graph.model.root) == 0)
				{
					graph.model.add(graph.model.root, new mxCell());
					graph.setDefaultParent(null);
				}
				else if (index > 0 && index <= graph.model.getChildCount(graph.model.root))
				{
					graph.setDefaultParent(graph.model.getChildAt(graph.model.root, index - 1));
				}
				else
				{
					graph.setDefaultParent(null);
				}
			}
			finally
			{
				graph.model.endUpdate();
			}
		}
		
		mxEvent.consume(evt);
	});
	
	if (!graph.isEnabled())
	{
		removeLink.className = 'geButton mxDisabled';
	}
	
	ldiv.appendChild(removeLink);

	var insertLink = link.cloneNode();
	insertLink.innerHTML = '<div class="geSprite geSprite-insert" style="display:inline-block;"></div>';
	
	mxEvent.addListener(insertLink, 'click', function(evt)
	{
		if (graph.isEnabled() && !graph.isSelectionEmpty())
		{
			graph.moveCells(graph.getSelectionCells(), 0, 0, false, selectionLayer);
		}
	});

	ldiv.appendChild(insertLink);
		
	function renameLayer(layer)
	{
		if (graph.isEnabled() && layer != null)
		{
			var label = graph.convertValueToString(layer);
			var dlg = new FilenameDialog(editorUi, label || mxResources.get('background'), mxResources.get('rename'), mxUtils.bind(this, function(newValue)
			{
				if (newValue != null)
				{
					graph.cellLabelChanged(layer, newValue);
				}
			}), mxResources.get('enterName'));
			editorUi.showDialog(dlg.container, 410, 100, true, true);
			dlg.init();
		}
	};
	
	var duplicateLink = link.cloneNode();
	duplicateLink.innerHTML = '<div class="geSprite geSprite-duplicate" style="display:inline-block;"></div>';
	
	mxEvent.addListener(duplicateLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			var newCell = null;
			graph.model.beginUpdate();
			try
			{
				newCell = graph.cloneCells([selectionLayer])[0];
				graph.cellLabelChanged(newCell, mxResources.get('untitledLayer'));
				newCell.setVisible(true);
				newCell = graph.addCell(newCell, graph.model.root);
				graph.setDefaultParent(newCell);
			}
			finally
			{
				graph.model.endUpdate();
			}

			if (newCell != null && !graph.isCellLocked(newCell))
			{
				graph.selectAll(newCell);
			}
		}
	});
	
	if (!graph.isEnabled())
	{
		duplicateLink.className = 'geButton mxDisabled';
	}

	ldiv.appendChild(duplicateLink);

	var addLink = link.cloneNode();
	addLink.innerHTML = '<div class="geSprite geSprite-plus" style="display:inline-block;"></div>';
	addLink.setAttribute('title', mxResources.get('addLayer'));
	
	mxEvent.addListener(addLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			graph.model.beginUpdate();
			
			try
			{
				var cell = graph.addCell(new mxCell(mxResources.get('untitledLayer')), graph.model.root);
				graph.setDefaultParent(cell);
			}
			finally
			{
				graph.model.endUpdate();
			}
		}
		
		mxEvent.consume(evt);
	});
	
	if (!graph.isEnabled())
	{
		addLink.className = 'geButton mxDisabled';
	}
	
	ldiv.appendChild(addLink);

	div.appendChild(ldiv);	
	
	function refresh()
	{
		layerCount = graph.model.getChildCount(graph.model.root)
		listDiv.innerHTML = '';

		function addLayer(index, label, child, defaultParent)
		{
			var ldiv = document.createElement('div');
			ldiv.className = 'geToolbarContainer';

			ldiv.style.overflow = 'hidden';
			ldiv.style.position = 'relative';
			ldiv.style.padding = '4px';
			ldiv.style.height = '22px';
			ldiv.style.display = 'block';
			ldiv.style.backgroundColor = 'whiteSmoke';
			ldiv.style.borderWidth = '0px 0px 1px 0px';
			ldiv.style.borderColor = '#c3c3c3';
			ldiv.style.borderStyle = 'solid';
			ldiv.style.whiteSpace = 'nowrap';
			ldiv.setAttribute('title', label);
			
			var left = document.createElement('div');
			left.style.display = 'inline-block';
			left.style.width = '100%';
			left.style.textOverflow = 'ellipsis';
			left.style.overflow = 'hidden';
			
			mxEvent.addListener(ldiv, 'dragover', function(evt)
			{
				evt.dataTransfer.dropEffect = 'move';
				dropIndex = index;
				evt.stopPropagation();
				evt.preventDefault();
			});
			
			mxEvent.addListener(ldiv, 'dragstart', function(evt)
			{
				dragSource = ldiv;
				
				// Workaround for no DnD on DIV in FF
				if (mxClient.IS_FF)
				{
					// LATER: Check what triggers a parse as XML on this in FF after drop
					evt.dataTransfer.setData('Text', '<layer/>');
				}
			});
			
			mxEvent.addListener(ldiv, 'dragend', function(evt)
			{
				if (dragSource != null && dropIndex != null)
				{
					graph.addCell(child, graph.model.root, dropIndex);
				}

				dragSource = null;
				dropIndex = null;
				evt.stopPropagation();
				evt.preventDefault();
			});

			var btn = document.createElement('img');
			btn.setAttribute('draggable', 'false');
			btn.setAttribute('align', 'top');
			btn.setAttribute('border', '0');
			btn.style.padding = '4px';
			btn.setAttribute('title', mxResources.get('lockUnlock'));

			var state = graph.view.getState(child);
    			var style = (state != null) ? state.style : graph.getCellStyle(child);

			if (mxUtils.getValue(style, 'locked', '0') == '1')
			{
				btn.setAttribute('src', Dialog.prototype.lockedImage);
			}
			else
			{
				btn.setAttribute('src', Dialog.prototype.unlockedImage);
			}
			
			if (graph.isEnabled())
			{
				btn.style.cursor = 'pointer';
			}
			
			mxEvent.addListener(btn, 'click', function(evt)
			{
				if (graph.isEnabled())
				{
					var value = null;
					
					graph.getModel().beginUpdate();
					try
					{
			    		value = (mxUtils.getValue(style, 'locked', '0') == '1') ? null : '1';
			    		graph.setCellStyles('locked', value, [child]);
					}
					finally
					{
						graph.getModel().endUpdate();
					}

					if (value == '1')
					{
						graph.removeSelectionCells(graph.getModel().getDescendants(child));
					}
					
					mxEvent.consume(evt);
				}
			});

			left.appendChild(btn);

			var inp = document.createElement('input');
			inp.setAttribute('type', 'checkbox');
			inp.setAttribute('title', mxResources.get('hideIt', [child.value || mxResources.get('background')]));
			inp.style.marginLeft = '4px';
			inp.style.marginRight = '6px';
			inp.style.marginTop = '4px';
			left.appendChild(inp);
			
			if (graph.model.isVisible(child))
			{
				inp.setAttribute('checked', 'checked');
				inp.defaultChecked = true;
			}

			mxEvent.addListener(inp, 'click', function(evt)
			{
				graph.model.setVisible(child, !graph.model.isVisible(child));
				mxEvent.consume(evt);
			});

			mxUtils.write(left, label);
			ldiv.appendChild(left);
			
			if (graph.isEnabled())
			{
				// Fallback if no drag and drop is available
				if (mxClient.IS_TOUCH || mxClient.IS_POINTER || mxClient.IS_VML ||
					(mxClient.IS_IE && document.documentMode < 10))
				{
					var right = document.createElement('div');
					right.style.display = 'block';
					right.style.textAlign = 'right';
					right.style.whiteSpace = 'nowrap';
					right.style.position = 'absolute';
					right.style.right = '6px';
					right.style.top = '6px';
		
					// Poor man's change layer order
					if (index > 0)
					{
						var img2 = document.createElement('a');
						
						img2.setAttribute('title', mxResources.get('toBack'));
						
						img2.className = 'geButton';
						img2.style.cssFloat = 'none';
						img2.innerHTML = '&#9660;';
						img2.style.width = '14px';
						img2.style.height = '14px';
						img2.style.fontSize = '14px';
						img2.style.margin = '0px';
						img2.style.marginTop = '-1px';
						right.appendChild(img2);
						
						mxEvent.addListener(img2, 'click', function(evt)
						{
							if (graph.isEnabled())
							{
								graph.addCell(child, graph.model.root, index - 1);
							}
							
							mxEvent.consume(evt);
						});
					}
		
					if (index >= 0 && index < layerCount - 1)
					{
						var img1 = document.createElement('a');
						
						img1.setAttribute('title', mxResources.get('toFront'));
						
						img1.className = 'geButton';
						img1.style.cssFloat = 'none';
						img1.innerHTML = '&#9650;';
						img1.style.width = '14px';
						img1.style.height = '14px';
						img1.style.fontSize = '14px';
						img1.style.margin = '0px';
						img1.style.marginTop = '-1px';
						right.appendChild(img1);
						
						mxEvent.addListener(img1, 'click', function(evt)
						{
							if (graph.isEnabled())
							{
								graph.addCell(child, graph.model.root, index + 1);
							}
							
							mxEvent.consume(evt);
						});
					}
					
					ldiv.appendChild(right);
				}
				
				if (mxClient.IS_SVG && (!mxClient.IS_IE || document.documentMode >= 10))
				{
					ldiv.setAttribute('draggable', 'true');
					ldiv.style.cursor = 'move';
				}
			}

			mxEvent.addListener(ldiv, 'dblclick', function(evt)
			{
				var nodeName = mxEvent.getSource(evt).nodeName;
				
				if (nodeName != 'INPUT' && nodeName != 'IMG')
				{
					renameLayer(child);
					mxEvent.consume(evt);
				}
			});

			if (graph.getDefaultParent() == child)
			{
				ldiv.style.background = '#e6eff8';
				ldiv.style.fontWeight = (graph.isEnabled()) ? 'bold' : '';
				selectionLayer = child;
			}
			else
			{
				mxEvent.addListener(ldiv, 'click', function(evt)
				{
					if (graph.isEnabled())
					{
						graph.setDefaultParent(defaultParent);
						graph.view.setCurrentRoot(null);
						refresh();
					}
				});
			}
			
			listDiv.appendChild(ldiv);
		};
		
		// Cannot be moved or deleted
		for (var i = layerCount - 1; i >= 0; i--)
		{
			(mxUtils.bind(this, function(child)
			{
				addLayer(i, graph.convertValueToString(child) ||
					mxResources.get('background'), child, child);
			}))(graph.model.getChildAt(graph.model.root, i));
		}
		
		var label = graph.convertValueToString(selectionLayer) || mxResources.get('background');
		removeLink.setAttribute('title', mxResources.get('removeIt', [label]));
		insertLink.setAttribute('title', mxResources.get('moveSelectionTo', [label]));
		duplicateLink.setAttribute('title', mxResources.get('duplicateIt', [label]));
		
		if (graph.isSelectionEmpty())
		{
			insertLink.className = 'geButton mxDisabled';
		}
	};

	refresh();
	graph.model.addListener(mxEvent.CHANGE, function()
	{
		refresh();
	});

	graph.selectionModel.addListener(mxEvent.CHANGE, function()
	{
		if (graph.isSelectionEmpty())
		{
			insertLink.className = 'geButton mxDisabled';
		}
		else
		{
			insertLink.className = 'geButton';
		}
	});


};

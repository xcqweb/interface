/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new open dialog.
 */
var OpenDialog = function()
{
	var iframe = document.createElement('iframe');
	iframe.style.backgroundColor = 'transparent';
	iframe.allowTransparency = 'true';
	iframe.style.borderStyle = 'none';
	iframe.style.borderWidth = '0px';
	iframe.style.overflow = 'hidden';
	iframe.frameBorder = '0';
	
	// Adds padding as a workaround for box model in older IE versions
	var dx = (mxClient.IS_VML && (document.documentMode == null || document.documentMode < 8)) ? 20 : 0;
	
	iframe.setAttribute('width', (((Editor.useLocalStorage) ? 640 : 320) + dx) + 'px');
	iframe.setAttribute('height', (((Editor.useLocalStorage) ? 480 : 220) + dx) + 'px');
	iframe.setAttribute('src', OPEN_FORM);
	
	this.container = iframe;
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
	descInput.setAttribute('value', editorUi.editor.getFiledes() || '');
	descInput.className = 'saveFileInput'
	saveContent.appendChild(descInput)

	// 按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button(buttonText, function()
	{
		if (validateFn == null || validateFn(nameInput.value))
		{
			if (closeOnBtn)
			{
				editorUi.hideDialog();
			}
			
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
	
	var saveContent = editorUi.createDiv('geDialogInfo')
	// 链接名称
	var nameTitle = document.createElement('p')
	nameTitle.innerHTML = '名称:'
	nameTitle.className = 'geDialogInfoTitle';	
	saveContent.appendChild(nameTitle)
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', linkvalue || '');
	nameInput.className = 'saveFileInput'
	saveContent.appendChild(nameInput)

	// 链接
	var linkTitle = document.createElement('p');
	linkTitle.innerHTML = 'link:';
	linkTitle.style.margin = "9px 0 5px";
	linkTitle.style.color = "#929292";
	saveContent.appendChild(linkTitle)
	
	var linkInput = document.createElement('input');
	linkInput.setAttribute('value', editorUi.editor.getFiledes() || '');
	linkInput.className = 'saveFileInput'
	saveContent.appendChild(linkInput)

	// 按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button(buttonText, function()
	{
		editorUi.hideDialog();
		
		fn(nameInput.value, linkInput.value);
	});
	genericBtn.className = 'geBtn gePrimaryBtn';
	
	this.init = function()
	{
		nameInput.focus();
	};
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	btnContent.appendChild(cancelBtn);

	mxEvent.addListener(nameInput, 'keypress', function(e)
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
	if (cellInfo !== undefined && cellInfo !== null) {
	}
	if (!mxUtils.isNode(cellInfo))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', cellInfo || '');
		cellInfo = obj;
	}
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
	var genericBtn = mxUtils.button('创建', function()
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
var ShareDialog = function(editorUi) {
	var saveContent = editorUi.createDiv('geDialogInfo');
	// 链接
	var nameTitle = document.createElement('p')
	nameTitle.innerHTML = '发布之后，生成的页面将在平台展示。';
	nameTitle.className = 'geDialogInfoTitle';
	saveContent.appendChild(nameTitle)

	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button('发布', function()
	{
		editorUi.hideDialog();
		if (Math.random() > 0.5) {
			editorUi.showDialog(tipDialog(editorUi, true, '发布'), 120, 90, true, false, null, null, '')
		} else {
			editorUi.showDialog(tipDialog(editorUi, false, '发布'), 120, 90, true, false, null, null, '')
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
 * 提示弹窗
 * @param {object} editorUi
 * @param {boolean} flag true：成功；false失败
 * @param {string} info	提示信息
 */
var tipDialog = function(editorUi, flag, info) {
	var tipContent = editorUi.createDiv('tipDialogInfo');
	// 图标
	var img = document.createElement('img')
	img.setAttribute('src', flag ? '/static/images/success.png' : '/static/images/error.png');
	tipContent.appendChild(img)
	// 内容
	var infoText = document.createElement('p')
	infoText.className = 'tipText'
	infoText.innerHTML = info + (flag ? '成功' : '失败');
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

	var saveContent = editorUi.createDiv('geDialogInfo');
	var mockData = [
		{
			name: 'T1',
			data: [
				{
					name: 't1_AC_L20',
					url: 't1_AC_L20 url'
				},{
					name: 't1_AC_L40',
					url: 't1_AC_L40 url'
				},{
					name: 't1_Cl2',
					url: 't1_Cl2 url'
				},{
					name: 't1_HPCP',
					url: 't1_HPCP url'
				}
			]
		},{
			name: 'T2',
			data: [
				{
					name: 't2_AC_L20',
					url: 't2_AC_L20 url'
				},{
					name: 't2_AC_L40',
					url: 't2_AC_L40 url'
				},{
					name: 't2_Cl2',
					url: 't2_Cl2 url'
				},{
					name: 't2_HPCP',
					url: 't2_HPCP url'
				}
			]
		}
	]
	// 内部图片
	saveContent.innerHTML = `
		<label class="imageRadio">
			<input class="imageTypeRadio" id="innerTypeRadio" type="radio" name="image" checked/>
			内部图片
		</label>
		<div id="innerImageBox">
			${
				mockData.reduce((str, v) => str += `
					<ul>
						<li class="innerImageType expandedImage">${v.name}</li>
						<ul class="innerImageList">
							${
								v.data.reduce((s, item) => s += `
								<li>${item.name}</li>
								`, '')
							}
						</ul>
					</ul>`, '')
			}
		</div>
		<label class="imageRadio">
			<input class="imageTypeRadio" id="localTypeRadio" type="radio" name="image" />
			<input type="file" id="chooseImage" title="" accept=".jpg,.jpge,.gif,.png"/>
			其他图片
		</label>
	`
	this.init = function () {
		// 选择图片方式
		document.getElementById('innerTypeRadio').addEventListener('click', function (e) {
			e.stopImmediatePropagation()
		})
		document.getElementsByClassName('imageRadio')[1].addEventListener('click', function (e) {
				document.getElementById('checkedImage') ? document.getElementById('checkedImage').id = '' : null;
				document.getElementById('localTypeRadio').checked = true
		})
		// 获取本地图片
		document.getElementById('chooseImage').addEventListener('change', function (e) {
			var fr = new FileReader();//创建new FileReader()对象
			var imgObj = e.target.files[0];//获取图片

			fr.readAsDataURL(imgObj);//将图片读取为DataURL
			fr.onload = function() {
				console.log(this.result)
			}
		})
		// 内部图片点击事件
		document.getElementById('innerImageBox').addEventListener('click', function (e) {
			var className = e.target.className
			if (/^innerImageType/.test(className)) {
				// 点击图片类型名称
				if (/expandedImage$/.test(className)) {
					// 展开状态点击
					e.target.className = 'innerImageType collapsedImage';
					e.target.nextElementSibling.style.height = '0px'
				} else {
					// 收缩状态点击
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
		editorUi.hideDialog();
		// 更换图片
		var select = null;
		var cells = graph.getSelectionCells();
		// mock数据
		var newValue;
		var mockNum = Math.random()
		if (mockNum < 0.3) {
			newValue = "/static/stencils/IOT/t1_cl2_layout.png"
		} else if (mockNum < 0.5) {
			newValue = "/static/stencils/IOT/cl2_green.png"
		} else if (mockNum < 0.8) {
			newValue = "/static/stencils/IOT/cl2_red.png"
		} else {
			newValue = "/static/stencils/IOT/t2_cl2_layout.png"
		}
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
 */
var addPageDialog = function (editorUi) {
	var saveContent = editorUi.createDiv('geDialogInfo');
	// 页面名称
	var nameTitle = document.createElement('p')
	nameTitle.innerHTML = '页面名称'
	nameTitle.className = 'geDialogInfoTitle';	
	saveContent.appendChild(nameTitle)
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', '');
	nameInput.setAttribute('placeholder', '请输入页面名称');
	nameInput.className = 'saveFileInput'
	saveContent.appendChild(nameInput)

	// 页面描述
	var desTitle = document.createElement('p');
	desTitle.innerHTML = '页面描述';
	desTitle.style.margin = "9px 0 5px";
	desTitle.style.color = "#929292";
	saveContent.appendChild(desTitle)
	
	var descInput = document.createElement('textarea');
	descInput.setAttribute('value', '');
	descInput.setAttribute('placeholder', '请输入页面描述');
	descInput.className = 'saveFileInput'
	saveContent.appendChild(descInput)

	// 是否是弹窗
	var isDialog = document.createElement('label');
	isDialog.style.float = "left";
	isDialog.style.fontSize = "14px";
	isDialog.style.lineHeight = "16px";
	isDialog.style.marginTop = "3px";
	var isDialogFlag = document.createElement('input');
	isDialogFlag.style.float = "left";
	isDialogFlag.style.width = "16px";
	isDialogFlag.style.height = "16px";
	isDialogFlag.style.marginRight = "6px";
	isDialogFlag.setAttribute('type', 'checkbox');
	isDialog.appendChild(isDialogFlag);
	isDialog.append('弹窗式')
	saveContent.appendChild(isDialog);
	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');;
	var genericBtn = mxUtils.button('应用', function()
	{
		if (!nameInput.value) {
			mxUtils.alert('请输入页面名称');
		} else {
			var page = {
				title: nameInput.value,
				desc: descInput.value,
				type: isDialogFlag.checked ? 'dialog' : 'normal'
			};
			var _li = document.createElement('li');
			_li.innerHTML = nameInput.value;
			if (isDialogFlag.checked) {
				$("#dialogPages").append(_li);
			} else {
				$("#normalPages").append(_li);
			};
			editorUi.editor.addPage(page);
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
	var mockData = []
	if (cellInfo.attributes.selectProps) {
		mockData = [].concat(cellInfo.attributes.selectProps.nodeValue.split(','))
	}
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
				mockData.reduce((str, v) => str += `
						<li class="innerPropsType">
							<input type="checkbox" />
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
			var node = 	$(".innerPropsType").children(':checked').parent();
			if (!node) { return false };
			node.insertBefore(node.prev());
		})
		// 下移
		$("#moveDown").click(function () {
			var node = 	$(".innerPropsType").children(':checked').parent();
			if (!node) { return false };
			node.insertAfter(node.next());
		})
		// 删除
		$("#delProp").click(function () {
			$(".innerPropsType").children(':checked').parent().remove()
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
		cellInfo.setAttribute('selectProps', data);
		graph.getModel().setValue(cell, cellInfo)
		editorUi.hideDialog();
		// 绑定列表
		// mock数据
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
 * 控件数据弹窗
 * @param {object} editorUi 
 * @param {object} cell 
 */
var PaletteDataDialog = function(editorUi, cell) {
	var graph = editorUi.editor.graph;
	var value = convertsToXml(graph, cell)

	var saveContent = editorUi.createDiv('geDialogInfo')
	saveContent.style.padding = "22px";
	var mockData = [{
		name: '氯气',
		points: ['DOD_ASTK01_PT6', 'DOD_ASTK01_PT2']
	}, {
		name: 'particle',
		points: ['CBBPC121_Particle', 'CBBPC144_Particle', 'CBBPC140_Particle']
	}]
	// 填充列表
	this.fillContent = function (ele, data) {
		ele.innerHTML = '';
		for (var i = 0; i < data.length; i++) {
			var opt = document.createElement('option')
			opt.innerText = data[i].name || data[i]
			if (data[i].points) {
				opt.setAttribute('data-points', data[i].points)
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
	typeSelect.className = 'dialogSelect'
	typeSelect.id = 'typeSelect'
	saveContent.appendChild(typeSelect)
	this.fillContent(typeSelect, mockData)
	
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
	this.fillContent(pointSelect, mockData[0].points)

	// 变量：
	var variableTitle = document.createElement('p');
	variableTitle.innerHTML = '变量：';
	variableTitle.className = 'geDialogInfoTitle';
	saveContent.appendChild(variableTitle)

	var variableBtn = document.createElement('button');
	variableBtn.innerHTML = '点击勾选多个变量';
	variableBtn.className = 'dialogBtn'
	variableBtn.id = 'variableBtn'
	saveContent.appendChild(variableBtn)
	
	// 展示变量
	var showVariable = document.createElement('label')
	showVariable.innerText = '显示变量值'
	showVariable.style.display = 'inline-block'
	showVariable.style.paddingLeft = '12px'

	var showVariableCheck = document.createElement('input')
	showVariableCheck.setAttribute('type', 'checkbox')
	showVariableCheck.id = "showVariableCheck"
	showVariableCheck.style.float = 'left'
	showVariable.appendChild(showVariableCheck)
	saveContent.appendChild(showVariable)
	
	// 选择模型：
	var modelTitle = document.createElement('p');
	modelTitle.innerHTML = '选择模型：';
	modelTitle.className = 'geDialogInfoTitle';
	saveContent.appendChild(modelTitle)

	var modelBtn = document.createElement('button');
	modelBtn.innerHTML = '+ 模型';
	modelBtn.className = 'dialogBtn'
	modelBtn.id = 'modelBtn'
	saveContent.appendChild(modelBtn)
	
	// 执行：
	var executeTitle = document.createElement('p');
	executeTitle.innerHTML = '执行：';
	executeTitle.className = 'geDialogInfoTitle';
	saveContent.appendChild(executeTitle)

	var executeBtn = document.createElement('button');
	executeBtn.innerHTML = '+ 执行';
	executeBtn.className = 'dialogBtn'
	executeBtn.id = 'executeBtn'
	saveContent.appendChild(executeBtn)
	this.init = function () {
	}
	
	// 绑定事件
	// 选择采集点类型
	typeSelect.addEventListener('change', function (e) {
		var data = e.target.selectedOptions[0].getAttribute('data-points').split(',')
		this.fillContent(pointSelect, data)
	}.bind(this))
	
	// 选择变量
	variableBtn.addEventListener('click', function (e) {
		var dlg = new chooseVariableDialog(editorUi, cell)
		editorUi.showDialog(dlg.container, 410, 350, true, false, null, null, '选择变量');
	})
		
	// 选择模型
	modelBtn.addEventListener('click', function (e) {
		var dlg = new chooseModelDialog(editorUi, cell)
		editorUi.showDialog(dlg.container, 410, 350, true, false, null, null, '选择模型');
	})
		
	// 选择执行
	executeBtn.addEventListener('click', function (e) {
		var dlg = new chooseExecuteDialog(editorUi, cell)
		editorUi.showDialog(dlg.container, 410, 350, true, false, null, null, '选择执行');
	})

	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button('应用', function()
	{
		editorUi.hideDialog();
		// 绑定列表
		var select = null;
		var cells = graph.getSelectionCells();
		// mock数据
		var newValue;
		var mockNum = Math.random()
		if (mockNum < 0.3) {
			newValue = "/static/stencils/IOT/t1_cl2_layout.png"
		} else if (mockNum < 0.5) {
			newValue = "/static/stencils/IOT/cl2_green.png"
		} else if (mockNum < 0.8) {
			newValue = "/static/stencils/IOT/cl2_red.png"
		} else {
			newValue = "/static/stencils/IOT/t2_cl2_layout.png"
		}
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
 * 生成列表
 * @param {Array<string>} data 数据列表
 * @param {string} classname class名称
 */
function createList (data, classname) {
	classname = classname || '';
	this.ulEle = document.createElement('ul');
	this.ulEle.className = classname;
	this.variables = [];
	this.nodes = []; //选中的DOM节点
	this.ulEle.setAttribute('data-variables', [])
	for (var i = 0; i < data.length; i++) {
		var liEle = document.createElement('li');
		liEle.innerHTML = data[i];
		liEle.setAttribute('title', data[i]);
		this.ulEle.appendChild(liEle)
	}
	this.ulEle.addEventListener('click', function (e) {
		e = e || window.event;
		var target = e.target;
		// 事件委托
		if (target.nodeName === 'LI') {
			if (target.className == 'active' ) {
				target.className = '';
				var index = this.variables.indexOf(target.innerText);
				this.variables.splice( index , 1 );
				this.nodes.splice( index , 1 );
			} else {
				target.className = 'active';
				this.variables.push(target.innerText);
				this.nodes.push(target);
			}
			// 锁定操作按钮
			if (classname == 'sourceList variableList') {
				if (!this.variables.length) {
					document.getElementsByClassName('increment')[0].className = 'increment disabledCrement';
				} else {
					document.getElementsByClassName('increment')[0].className = 'increment';
				}
			} else if (classname == 'destList variableList') {
				if (!this.variables.length) {
					document.getElementsByClassName('decrement')[0].className = 'decrement disabledCrement';
				} else {
					document.getElementsByClassName('decrement')[0].className = 'decrement';
				}
			};
			this.ulEle.setAttribute('data-variables', JSON.stringify(this.variables))
		}
	}.bind(this))
	// return this.ulEle;
	// return this
}

/**
 * 填充列表
 * @param {object} ele 
 * @param {Array} data
 */
function fillList (ele, data) {
	for (var i = 0; i < data.length; i++) {
		var opt = document.createElement('li');
		opt.innerText = data[i];
		ele.appendChild(opt);
	}
}

/**
 * 选择变量
 */
var chooseVariableDialog = function (editorUi) {
	// mockData
	var data1 = ['变量变量变量变量变量变量变量1','变量2','变量3','变量4','变量5','变量6','变量7','变量8','变量9','变量10','变量11'];
	var data2 = [];
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

	// 源变量列表
	var sourceList = new createList(data1, 'sourceList variableList');
	saveContent.appendChild(sourceList.ulEle);
	// 操作变量
	// 右边增加变量
	var operateList = editorUi.createDiv('operateList');
	var increment = editorUi.createDiv('increment disabledCrement');
	increment.innerText = '+';
	operateList.appendChild(increment);
	increment.addEventListener('click', function () {
		// 删除节点
		for (var i = 0; i < sourceList.nodes.length; i++) {
			sourceList.ulEle.removeChild(sourceList.nodes[i])
		}
		sourceList.nodes = [];
		// 修改数据
		var sList = sourceList.variables;
		// var sList = JSON.parse(sourceList.getAttribute('data-variables'));
		// sourceList.removeChild(sourceList.children[0])
		data2 = data2.concat(sList);
		fillList(destList.ulEle, sList);
		sourceList.variables = [];
		document.getElementsByClassName('increment')[0].className = 'increment disabledCrement';
	})
	// 右边减少变量
	var decrement = editorUi.createDiv('decrement disabledCrement');
	decrement.innerText = '-';
	operateList.appendChild(decrement);
	saveContent.appendChild(operateList);
	// 目标变量列表
	var destList = new createList(data2, 'destList variableList');
	saveContent.appendChild(destList.ulEle);
	decrement.addEventListener('click', function () {
		// 删除节点
		for (var i = 0; i < destList.nodes.length; i++) {
			destList.ulEle.removeChild(destList.nodes[i])
		}
		destList.nodes = [];
		// 修改数据
		var sList = destList.variables;
		data1 = data1.concat(sList);
		fillList(sourceList.ulEle, sList);
		destList.variables = [];
		document.getElementsByClassName('decrement')[0].className = 'decrement disabledCrement';
	})

	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');
	var genericBtn = mxUtils.button('应用', function()
	{
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

/**
 * 选择模型
 */
var chooseModelDialog = function (editorUi) {
	var saveContent = editorUi.createDiv('geDialogInfo');
	saveContent.setAttribute('data-dialog', 'chooseModel');
	// 搜索
	var searchBox = editorUi.createDiv('searchBox');
	var searchInput = document.createElement('input')
	searchInput.className = "dialogSelect"
	searchInput.setAttribute('placeholder', '搜索')
	searchBox.appendChild(searchInput)
	var searchBtn = document.createElement('button')
	searchBtn.innerText = "搜索"
	searchBox.appendChild(searchBtn)
	saveContent.appendChild(searchBox)
	// 下拉
	var modelList = document.createElement('select')
	modelList.className = "dialogSelect"
	saveContent.appendChild(modelList)
	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');;
	var genericBtn = mxUtils.button('应用', function()
	{
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


/**
 * 选择执行
 */
var chooseExecuteDialog = function (editorUi) {
	var saveContent = editorUi.createDiv('geDialogInfo');
	saveContent.setAttribute('data-dialog', 'chooseExecute');
	// 保存按钮
	var btnContent = editorUi.createDiv('btnContent');;
	var genericBtn = mxUtils.button('应用', function()
	{
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
/**
 * Constructs a new textarea dialog.
 */
var TextareaDialog = function(editorUi, title, url, fn, cancelFn, cancelTitle, w, h, addButtons, noHide, noWrap, applyTitle)
{
	w = (w != null) ? w : 300;
	h = (h != null) ? h : 120;
	noHide = (noHide != null) ? noHide : false;
	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '100px';
	mxUtils.write(td, title);
	
	row.appendChild(td);
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');

	var nameInput = document.createElement('textarea');
	
	if (noWrap)
	{
		nameInput.setAttribute('wrap', 'off');
	}
	
	nameInput.setAttribute('spellcheck', 'false');
	nameInput.setAttribute('autocorrect', 'off');
	nameInput.setAttribute('autocomplete', 'off');
	nameInput.setAttribute('autocapitalize', 'off');
	
	mxUtils.write(nameInput, url || '');
	nameInput.style.resize = 'none';
	nameInput.style.width = w + 'px';
	nameInput.style.height = h + 'px';
	
	this.textarea = nameInput;

	this.init = function()
	{
		nameInput.focus();
		nameInput.scrollTop = 0;
	};

	td.appendChild(nameInput);
	row.appendChild(td);
	
	tbody.appendChild(row);

	row = document.createElement('tr');
	td = document.createElement('td');
	td.style.paddingTop = '14px';
	td.style.whiteSpace = 'nowrap';
	td.setAttribute('align', 'right');
	
	var cancelBtn = mxUtils.button(cancelTitle || mxResources.get('cancel'), function()
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
		td.appendChild(cancelBtn);
	}
	
	if (addButtons != null)
	{
		addButtons(td);
	}
	
	if (fn != null)
	{
		var genericBtn = mxUtils.button(applyTitle || mxResources.get('apply'), function()
		{
			if (!noHide)
			{
				editorUi.hideDialog();
			}
			
			fn(nameInput.value);
		});
		
		genericBtn.className = 'geBtn gePrimaryBtn';	
		td.appendChild(genericBtn);
	}
	
	if (!editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

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
 * Constructs a new export dialog.
 */
var ExportDialog = function(editorUi)
{
	var graph = editorUi.editor.graph;
	var bounds = graph.getGraphBounds();
	var scale = graph.view.scale;
	
	var width = Math.ceil(bounds.width / scale);
	var height = Math.ceil(bounds.height / scale);

	var row, td;
	
	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	table.setAttribute('cellpadding', (mxClient.IS_SF) ? '0' : '2');
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	td.style.width = '100px';
	mxUtils.write(td, mxResources.get('filename') + ':');
	
	row.appendChild(td);
	
	var nameInput = document.createElement('input');
	nameInput.setAttribute('value', editorUi.editor.getOrCreateFilename());
	nameInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(nameInput);
	row.appendChild(td);
	
	tbody.appendChild(row);
		
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('format') + ':');
	
	row.appendChild(td);
	
	var imageFormatSelect = document.createElement('select');
	imageFormatSelect.style.width = '180px';

	var pngOption = document.createElement('option');
	pngOption.setAttribute('value', 'png');
	mxUtils.write(pngOption, mxResources.get('formatPng'));
	imageFormatSelect.appendChild(pngOption);

	var gifOption = document.createElement('option');
	
	if (ExportDialog.showGifOption)
	{
		gifOption.setAttribute('value', 'gif');
		mxUtils.write(gifOption, mxResources.get('formatGif'));
		imageFormatSelect.appendChild(gifOption);
	}
	
	var jpgOption = document.createElement('option');
	jpgOption.setAttribute('value', 'jpg');
	mxUtils.write(jpgOption, mxResources.get('formatJpg'));
	imageFormatSelect.appendChild(jpgOption);

	var pdfOption = document.createElement('option');
	pdfOption.setAttribute('value', 'pdf');
	mxUtils.write(pdfOption, mxResources.get('formatPdf'));
	imageFormatSelect.appendChild(pdfOption);
	
	var svgOption = document.createElement('option');
	svgOption.setAttribute('value', 'svg');
	mxUtils.write(svgOption, mxResources.get('formatSvg'));
	imageFormatSelect.appendChild(svgOption);
	
	if (ExportDialog.showXmlOption)
	{
		var xmlOption = document.createElement('option');
		xmlOption.setAttribute('value', 'xml');
		mxUtils.write(xmlOption, mxResources.get('formatXml'));
		imageFormatSelect.appendChild(xmlOption);
	}

	td = document.createElement('td');
	td.appendChild(imageFormatSelect);
	row.appendChild(td);
	
	tbody.appendChild(row);
	
	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('zoom') + ' (%):');
	
	row.appendChild(td);
	
	var zoomInput = document.createElement('input');
	zoomInput.setAttribute('type', 'number');
	zoomInput.setAttribute('value', '100');
	zoomInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(zoomInput);
	row.appendChild(td);

	tbody.appendChild(row);

	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('width') + ':');
	
	row.appendChild(td);
	
	var widthInput = document.createElement('input');
	widthInput.setAttribute('value', width);
	widthInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(widthInput);
	row.appendChild(td);

	tbody.appendChild(row);
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('height') + ':');
	
	row.appendChild(td);
	
	var heightInput = document.createElement('input');
	heightInput.setAttribute('value', height);
	heightInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(heightInput);
	row.appendChild(td);

	tbody.appendChild(row);
	
	row = document.createElement('tr');
	
	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('background') + ':');
	
	row.appendChild(td);
	
	var transparentCheckbox = document.createElement('input');
	transparentCheckbox.setAttribute('type', 'checkbox');
	transparentCheckbox.checked = graph.background == null || graph.background == mxConstants.NONE;

	td = document.createElement('td');
	td.appendChild(transparentCheckbox);
	mxUtils.write(td, mxResources.get('transparent'));
	
	row.appendChild(td);
	
	tbody.appendChild(row);
	
	row = document.createElement('tr');

	td = document.createElement('td');
	td.style.fontSize = '10pt';
	mxUtils.write(td, mxResources.get('borderWidth') + ':');
	
	row.appendChild(td);
	
	var borderInput = document.createElement('input');
	borderInput.setAttribute('type', 'number');
	borderInput.setAttribute('value', ExportDialog.lastBorderValue);
	borderInput.style.width = '180px';

	td = document.createElement('td');
	td.appendChild(borderInput);
	row.appendChild(td);

	tbody.appendChild(row);
	table.appendChild(tbody);
	
	// Handles changes in the export format
	function formatChanged()
	{
		var name = nameInput.value;
		var dot = name.lastIndexOf('.');
		
		if (dot > 0)
		{
			nameInput.value = name.substring(0, dot + 1) + imageFormatSelect.value;
		}
		else
		{
			nameInput.value = name + '.' + imageFormatSelect.value;
		}
		
		if (imageFormatSelect.value === 'xml')
		{
			zoomInput.setAttribute('disabled', 'true');
			widthInput.setAttribute('disabled', 'true');
			heightInput.setAttribute('disabled', 'true');
			borderInput.setAttribute('disabled', 'true');
		}
		else
		{
			zoomInput.removeAttribute('disabled');
			widthInput.removeAttribute('disabled');
			heightInput.removeAttribute('disabled');
			borderInput.removeAttribute('disabled');
		}
		
		if (imageFormatSelect.value === 'png' || imageFormatSelect.value === 'svg')
		{
			transparentCheckbox.removeAttribute('disabled');
		}
		else
		{
			transparentCheckbox.setAttribute('disabled', 'disabled');
		}
	};
	
	mxEvent.addListener(imageFormatSelect, 'change', formatChanged);
	formatChanged();

	function checkValues()
	{
		if (widthInput.value * heightInput.value > MAX_AREA || widthInput.value <= 0)
		{
			widthInput.style.backgroundColor = 'red';
		}
		else
		{
			widthInput.style.backgroundColor = '';
		}
		
		if (widthInput.value * heightInput.value > MAX_AREA || heightInput.value <= 0)
		{
			heightInput.style.backgroundColor = 'red';
		}
		else
		{
			heightInput.style.backgroundColor = '';
		}
	};

	mxEvent.addListener(zoomInput, 'change', function()
	{
		var s = Math.max(0, parseFloat(zoomInput.value) || 100) / 100;
		zoomInput.value = parseFloat((s * 100).toFixed(2));
		
		if (width > 0)
		{
			widthInput.value = Math.floor(width * s);
			heightInput.value = Math.floor(height * s);
		}
		else
		{
			zoomInput.value = '100';
			widthInput.value = width;
			heightInput.value = height;
		}
		
		checkValues();
	});

	mxEvent.addListener(widthInput, 'change', function()
	{
		var s = parseInt(widthInput.value) / width;
		
		if (s > 0)
		{
			zoomInput.value = parseFloat((s * 100).toFixed(2));
			heightInput.value = Math.floor(height * s);
		}
		else
		{
			zoomInput.value = '100';
			widthInput.value = width;
			heightInput.value = height;
		}
		
		checkValues();
	});

	mxEvent.addListener(heightInput, 'change', function()
	{
		var s = parseInt(heightInput.value) / height;
		
		if (s > 0)
		{
			zoomInput.value = parseFloat((s * 100).toFixed(2));
			widthInput.value = Math.floor(width * s);
		}
		else
		{
			zoomInput.value = '100';
			widthInput.value = width;
			heightInput.value = height;
		}
		
		checkValues();
	});
	
	row = document.createElement('tr');
	td = document.createElement('td');
	td.setAttribute('align', 'right');
	td.style.paddingTop = '22px';
	td.colSpan = 2;
	
	var saveBtn = mxUtils.button(mxResources.get('export'), mxUtils.bind(this, function()
	{
		if (parseInt(zoomInput.value) <= 0)
		{
			mxUtils.alert(mxResources.get('drawingEmpty'));
		}
		else
		{
	    	var name = nameInput.value;
			var format = imageFormatSelect.value;
	    	var s = Math.max(0, parseFloat(zoomInput.value) || 100) / 100;
			var b = Math.max(0, parseInt(borderInput.value));
			var bg = graph.background;
			
			if ((format == 'svg' || format == 'png') && transparentCheckbox.checked)
			{
				bg = null;
			}
			else if (bg == null || bg == mxConstants.NONE)
			{
				bg = '#ffffff';
			}
			
			ExportDialog.lastBorderValue = b;
			ExportDialog.exportFile(editorUi, name, format, bg, s, b);
		}
	}));
	saveBtn.className = 'geBtn gePrimaryBtn';
	
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		td.appendChild(cancelBtn);
		td.appendChild(saveBtn);
	}
	else
	{
		td.appendChild(saveBtn);
		td.appendChild(cancelBtn);
	}

	row.appendChild(td);
	tbody.appendChild(row);
	table.appendChild(tbody);
	this.container = table;
};

/**
 * Remembers last value for border.
 */
ExportDialog.lastBorderValue = 0;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showGifOption = true;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showXmlOption = true;

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.exportFile = function(editorUi, name, format, bg, s, b)
{
	var graph = editorUi.editor.graph;
	
	if (format == 'xml')
	{
    	ExportDialog.saveLocalFile(editorUi, mxUtils.getXml(editorUi.editor.getGraphXml()), name, format);
	}
    else if (format == 'svg')
	{
		ExportDialog.saveLocalFile(editorUi, mxUtils.getXml(graph.getSvg(bg, s, b)), name, format);
	}
    else
    {
    	var bounds = graph.getGraphBounds();
    	
		// New image export
		var xmlDoc = mxUtils.createXmlDocument();
		var root = xmlDoc.createElement('output');
		xmlDoc.appendChild(root);
		
	    // Renders graph. Offset will be multiplied with state's scale when painting state.
		var xmlCanvas = new mxXmlCanvas2D(root);
		xmlCanvas.translate(Math.floor((b / s - bounds.x) / graph.view.scale),
			Math.floor((b / s - bounds.y) / graph.view.scale));
		xmlCanvas.scale(s / graph.view.scale);
		
		var imgExport = new mxImageExport()
	    imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);
	    
		// Puts request data together
		var param = 'xml=' + encodeURIComponent(mxUtils.getXml(root));
		var w = Math.ceil(bounds.width * s / graph.view.scale + 2 * b);
		var h = Math.ceil(bounds.height * s / graph.view.scale + 2 * b);
		
		// Requests image if request is valid
		if (param.length <= MAX_REQUEST_SIZE && w * h < MAX_AREA)
		{
			editorUi.hideDialog();
			var req = new mxXmlRequest(EXPORT_URL, 'format=' + format +
				'&filename=' + encodeURIComponent(name) +
				'&bg=' + ((bg != null) ? bg : 'none') +
				'&w=' + w + '&h=' + h + '&' + param);
			req.simulate(document, '_blank');
		}
		else
		{
			mxUtils.alert(mxResources.get('drawingTooLarge'));
		}
	}
};

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.saveLocalFile = function(editorUi, data, filename, format)
{
	if (data.length < MAX_REQUEST_SIZE)
	{
		editorUi.hideDialog();
		var req = new mxXmlRequest(SAVE_URL, 'xml=' + encodeURIComponent(data) + '&filename=' +
			encodeURIComponent(filename) + '&format=' + format);
		req.simulate(document, '_blank');
	}
	else
	{
		mxUtils.alert(mxResources.get('drawingTooLarge'));
		mxUtils.popup(xml);
	}
};

/**
 * Constructs a new metadata dialog.
 */
var EditDataDialog = function(ui, cell)
{
	var div = document.createElement('div');
	var graph = ui.editor.graph;
	
	var value = graph.getModel().getValue(cell);
	// Converts the value to an XML node
	if (!mxUtils.isNode(value))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', value || '');
		value = obj;
	}

	// Creates the dialog contents
	var form = new mxForm('properties');
	form.table.style.width = '100%';

	var attrs = value.attributes;
	var names = [];
	var texts = [];
	var count = 0;

	var id = EditDataDialog.getDisplayIdForCell(ui, cell);
	
	// FIXME: Fix remove button for quirks mode
	var addRemoveButton = function(text, name)
	{
		var wrapper = document.createElement('div');
		wrapper.style.position = 'relative';
		wrapper.style.paddingRight = '20px';
		wrapper.style.boxSizing = 'border-box';
		wrapper.style.width = '100%';
		
		var removeAttr = document.createElement('a');
		var img = mxUtils.createImage(Dialog.prototype.closeImage);
		img.style.height = '9px';
		img.style.fontSize = '9px';
		img.style.marginBottom = (mxClient.IS_IE11) ? '-1px' : '5px';
		
		removeAttr.className = 'geButton';
		removeAttr.setAttribute('title', mxResources.get('delete'));
		removeAttr.style.position = 'absolute';
		removeAttr.style.top = '4px';
		removeAttr.style.right = '0px';
		removeAttr.style.margin = '0px';
		removeAttr.style.width = '9px';
		removeAttr.style.height = '9px';
		removeAttr.style.cursor = 'pointer';
		removeAttr.appendChild(img);
		
		var removeAttrFn = (function(name)
		{
			return function()
			{
				var count = 0;
				
				for (var j = 0; j < names.length; j++)
				{
					if (names[j] == name)
					{
						texts[j] = null;
						form.table.deleteRow(count + ((id != null) ? 1 : 0));
						
						break;
					}
					
					if (texts[j] != null)
					{
						count++;
					}
				}
			};
		})(name);
		
		mxEvent.addListener(removeAttr, 'click', removeAttrFn);
		
		var parent = text.parentNode;
		wrapper.appendChild(text);
		wrapper.appendChild(removeAttr);
		parent.appendChild(wrapper);
	};
	
	var addTextArea = function(index, name, value)
	{
		names[index] = name;
		texts[index] = form.addTextarea(names[count] + ':', value, 2);
		texts[index].style.width = '100%';
		
		addRemoveButton(texts[index], name);
	};
	
	var temp = [];
	var isLayer = graph.getModel().getParent(cell) == graph.getModel().getRoot();

	for (var i = 0; i < attrs.length; i++)
	{
		if ((isLayer || attrs[i].nodeName != 'label') && attrs[i].nodeName != 'placeholders')
		{
			temp.push({name: attrs[i].nodeName, value: attrs[i].nodeValue});
		}
	}
	
	// Sorts by name
	temp.sort(function(a, b)
	{
	    if (a.name < b.name)
	    {
	    		return -1;
	    }
	    else if (a.name > b.name)
	    {
	    		return 1;
	    }
	    else
	    {
	    		return 0;
	    }
	});
	
	for (var i = 0; i < temp.length; i++)
	{
		addTextArea(count, temp[i].name, temp[i].value);
		count++;
	}
	
	var top = document.createElement('div');
	top.style.cssText = 'position:absolute;left:30px;right:30px;overflow-y:auto;top:30px;bottom:80px;';
	top.appendChild(form.table);

	var newProp = document.createElement('div');
	newProp.style.whiteSpace = 'nowrap';
	newProp.style.marginTop = '6px';

	var nameInput = document.createElement('input');
	nameInput.setAttribute('placeholder', mxResources.get('enterPropertyName'));
	nameInput.setAttribute('type', 'text');
	nameInput.setAttribute('size', (mxClient.IS_IE || mxClient.IS_IE11) ? '18' : '22');
	nameInput.style.marginLeft = '2px';

	newProp.appendChild(nameInput);
	top.appendChild(newProp);
	div.appendChild(top);
	
	var addBtn = mxUtils.button(mxResources.get('addProperty'), function()
	{
		var name = nameInput.value;

		// Avoid ':' in attribute names which seems to be valid in Chrome
		if (name.length > 0 && name != 'label' && name != 'placeholders' && name.indexOf(':') < 0)
		{
			try
			{
				var idx = mxUtils.indexOf(names, name);
				
				if (idx >= 0 && texts[idx] != null)
				{
					texts[idx].focus();
				}
				else
				{
					// Checks if the name is valid
					var clone = value.cloneNode(false);
					clone.setAttribute(name, '');
					
					if (idx >= 0)
					{
						names.splice(idx, 1);
						texts.splice(idx, 1);
					}

					names.push(name);
					var text = form.addTextarea(name + ':', '', 2);
					text.style.width = '100%';
					texts.push(text);
					addRemoveButton(text, name);

					text.focus();
				}

				nameInput.value = '';
			}
			catch (e)
			{
				mxUtils.alert(e);
			}
		}
		else
		{
			mxUtils.alert(mxResources.get('invalidName'));
		}
	});
	
	this.init = function()
	{
		if (texts.length > 0)
		{
			texts[0].focus();
		}
		else
		{
			nameInput.focus();
		}
	};
	
	addBtn.setAttribute('disabled', 'disabled');
	addBtn.style.marginLeft = '10px';
	addBtn.style.width = '144px';
	newProp.appendChild(addBtn);

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		ui.hideDialog.apply(ui, arguments);
	});
	
	cancelBtn.className = 'geBtn';
	
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		try
		{
			ui.hideDialog.apply(ui, arguments);
			
			// Clones and updates the value
			value = value.cloneNode(true);
			var removeLabel = false;
			
			for (var i = 0; i < names.length; i++)
			{
				if (texts[i] == null)
				{
					value.removeAttribute(names[i]);
				}
				else
				{
					value.setAttribute(names[i], texts[i].value);
					removeLabel = removeLabel || (names[i] == 'placeholder' &&
						value.getAttribute('placeholders') == '1');
				}
			}
			
			// Removes label if placeholder is assigned
			if (removeLabel)
			{
				value.removeAttribute('label');
			}
			
			// Updates the value of the cell (undoable)
			graph.getModel().setValue(cell, value);
		}
		catch (e)
		{
			mxUtils.alert(e);
		}
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	
	function updateAddBtn()
	{
		if (nameInput.value.length > 0)
		{
			addBtn.removeAttribute('disabled');
		}
		else
		{
			addBtn.setAttribute('disabled', 'disabled');
		}
	};

	mxEvent.addListener(nameInput, 'keyup', updateAddBtn);
	
	// Catches all changes that don't fire a keyup (such as paste via mouse)
	mxEvent.addListener(nameInput, 'change', updateAddBtn);
	
	var buttons = document.createElement('div');
	buttons.style.cssText = 'position:absolute;left:30px;right:30px;text-align:right;bottom:30px;height:40px;'
	
	if (ui.editor.graph.getModel().isVertex(cell) || ui.editor.graph.getModel().isEdge(cell))
	{
		var replace = document.createElement('span');
		replace.style.marginRight = '10px';
		var input = document.createElement('input');
		input.setAttribute('type', 'checkbox');
		input.style.marginRight = '6px';
		
		if (value.getAttribute('placeholders') == '1')
		{
			input.setAttribute('checked', 'checked');
			input.defaultChecked = true;
		}
	
		mxEvent.addListener(input, 'click', function()
		{
			if (value.getAttribute('placeholders') == '1')
			{
				value.removeAttribute('placeholders');
			}
			else
			{
				value.setAttribute('placeholders', '1');
			}
		});
		
		replace.appendChild(input);
		mxUtils.write(replace, mxResources.get('placeholders'));
		
		if (EditDataDialog.placeholderHelpLink != null)
		{
			var link = document.createElement('a');
			link.setAttribute('href', EditDataDialog.placeholderHelpLink);
			link.setAttribute('title', mxResources.get('help'));
			link.setAttribute('target', '_blank');
			link.style.marginLeft = '10px';
			link.style.cursor = 'help';
			
			var icon = document.createElement('img');
			icon.setAttribute('border', '0');
			icon.setAttribute('valign', 'middle');
			icon.style.marginTop = (mxClient.IS_IE11) ? '0px' : '-4px';
			icon.setAttribute('src', Editor.helpImage);
			link.appendChild(icon);
			
			replace.appendChild(link);
		}
		
		buttons.appendChild(replace);
	}
	
	if (ui.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
		buttons.appendChild(applyBtn);
	}
	else
	{
		buttons.appendChild(applyBtn);
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);
	this.container = div;
};
/**
 * Optional help link.
 */
EditDataDialog.getDisplayIdForCell = function(ui, cell)
{
	var id = null;
	
	if (ui.editor.graph.getModel().getParent(cell) != null)
	{
		id = cell.getId();
	}
	
	return id;
};

/**
 * Optional help link.
 */
EditDataDialog.placeholderHelpLink = null;

/**
 * Constructs a new metadata dialog.
 */
var EditPropDialog = function(ui, cell)
{
	var div = document.createElement('div');

	var graph = ui.editor.graph;
	
	var value = graph.getModel().getValue(cell);
	// Converts the value to an XML node
	if (!mxUtils.isNode(value))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', value || '');
		value = obj;
	}

	// Creates the dialog contents
	var form = new mxForm('properties');
	form.table.style.width = '100%';

	var attrs = value.attributes;
	var names = [];
	var texts = [];
	var count = 0;

	var id = EditPropDialog.getDisplayIdForCell(ui, cell);
	
	// FIXME: Fix remove button for quirks mode
	var addRemoveButton = function(text, name)
	{
		var wrapper = document.createElement('div');
		wrapper.style.position = 'relative';
		wrapper.style.paddingRight = '20px';
		wrapper.style.boxSizing = 'border-box';
		wrapper.style.width = '100%';
		
		var removeAttr = document.createElement('a');
		var img = mxUtils.createImage(Dialog.prototype.closeImage);
		img.style.height = '9px';
		img.style.fontSize = '9px';
		img.style.marginBottom = (mxClient.IS_IE11) ? '-1px' : '5px';
		
		removeAttr.className = 'geButton';
		removeAttr.setAttribute('title', mxResources.get('delete'));
		removeAttr.style.position = 'absolute';
		removeAttr.style.top = '4px';
		removeAttr.style.right = '0px';
		removeAttr.style.margin = '0px';
		removeAttr.style.width = '9px';
		removeAttr.style.height = '9px';
		removeAttr.style.cursor = 'pointer';
		removeAttr.appendChild(img);
		
		var removeAttrFn = (function(name)
		{
			return function()
			{
				var count = 0;
				
				for (var j = 0; j < names.length; j++)
				{
					if (names[j] == name)
					{
						texts[j] = null;
						form.table.deleteRow(count + ((id != null) ? 1 : 0));
						
						break;
					}
					
					if (texts[j] != null)
					{
						count++;
					}
				}
			};
		})(name);
		
		mxEvent.addListener(removeAttr, 'click', removeAttrFn);
		
		var parent = text.parentNode;
		wrapper.appendChild(text);
		wrapper.appendChild(removeAttr);
		parent.appendChild(wrapper);
	};
	var addTextArea = function(index, name, value)
	{
		names[index] = name;
		texts[index] = form.addTextarea(names[count] + ':', value, 2);
		texts[index].style.width = '100%';
		
		addRemoveButton(texts[index], name);
	};
	
	var temp = {
		device: '',
		singleVariable: true,
		variables: []
	};
	var isLayer = graph.getModel().getParent(cell) == graph.getModel().getRoot();
	for (var i = 0; i < attrs.length; i++)
	{
		if ((isLayer || attrs[i].nodeName != 'label') && attrs[i].nodeName != 'placeholders')
		{
			// temp[attrs[i].nodeName] = attrs[i].nodeValue;
		}
		if (attrs[i].nodeName == 'getech') {
			temp = JSON.parse(attrs[i].nodeValue)
		}
	}
	for (var i = 0; i < temp.length; i++)
	{
		addTextArea(count, temp[i].name, temp[i].value);
		count++;
	}
	
	var top = document.createElement('div');
	top.style.cssText = 'position:absolute;left:30px;right:30px;overflow-y:auto;top:30px;bottom:80px;';
	top.appendChild(form.table);
	
	// jevin
	let pointList = [
		{
			id: '',
			name: '请选择'
		},{
			id: 1,
			name: '点位1',
		}, {
			id: 2,
			name: '点位2'
		}
	]

	let statusList = ["正常", "预警", "告警", "异常"]
	// ====================================
	top.innerHTML = `
		<div class="geDialogInfo">
			<span class="geDialogLeft">点位:</span>
			<select class="geDialogRight" id="pointName">
			${
				pointList.map(val => `
					<option value=${val.id} ${val.id == temp.device ? 'selected' : ''}>${val.name}</option>
				`)
			}
			</select>
		</div>
		<div class="geDialogInfo">
			<span class="geDialogLeft">数据:</span>
			<div class="geDialogRight">
				<div>
					<label>
						<input name="dialogVariable" type="radio" id="singleVariable" ${temp.singleVariable ? "checked" : ''}/>
						单个变量
					</label>
					<button style="margin-left:8px" ${!temp.singleVariable ? 'disabled' : ""} id="selectSingleVariable">点击勾选变量</button>
				</div>
				<div style="padding: 5px 0;">
					<label>
						<input name="dialogVariable" type="radio" id="multipleVariable" ${!temp.singleVariable ? "checked" : ''}/>
						多个变量
					</label>
					<button style="margin-left:8px" ${temp.singleVariable ? 'disabled' : ""} id="selectMultipleVariable">点击勾选多个变量</button>
				</div>
			</div>
		</div>
		<div class="geDialogInfo">
			<span class="geDialogLeft">状态:</span>
			<select class="geDialogRight">
			${
				statusList.map(val => `
					<option value=${val}>${val}</option>
				`)
			}
			</select>
		</div>
	`
	div.appendChild(top);	
	// jevin
	var addBtn = mxUtils.button(mxResources.get('addProperty'), function()
	{
		// Avoid ':' in attribute names which seems to be valid in Chrome
		if (true )
		{
			try
			{
				var idx = mxUtils.indexOf(names, name);
				
				if (idx >= 0 && texts[idx] != null)
				{
					texts[idx].focus();
				}
				else
				{
					// Checks if the name is valid
					var clone = value.cloneNode(false);
					clone.setAttribute(name, '');
					
					if (idx >= 0)
					{
						names.splice(idx, 1);
						texts.splice(idx, 1);
					}

					names.push(name);
					var text = form.addTextarea(name + ':', '', 2);
					text.style.width = '100%';
					texts.push(text);
					addRemoveButton(text, name);

					text.focus();
				}

				nameInput.value = '';
			}
			catch (e)
			{
				mxUtils.alert(e);
			}
		}
		else
		{
			mxUtils.alert(mxResources.get('propTooLong'));
		}
	});

	// 弹窗弹出，初始化之后的操作
	this.init = function()
	{
		// 选择点位
		document.getElementById('pointName').addEventListener('change', function (e) {
			temp.device = e.target.value;
		})
		// 单个变量
		document.getElementById('singleVariable').addEventListener('click', function () {
			temp.singleVariable = true;
			document.getElementById('selectSingleVariable').removeAttribute('disabled')
			document.getElementById('selectMultipleVariable').setAttribute('disabled', true)
		})
		// 选择单个变量
		document.getElementById('selectSingleVariable').addEventListener('click', function () {
			selectVariableDialog();
		})
		// 多个变量
		document.getElementById('multipleVariable').addEventListener('click', function () {
			temp.singleVariable = false;
			document.getElementById('selectSingleVariable').setAttribute('disabled', true)
			document.getElementById('selectMultipleVariable').removeAttribute('disabled')
		})
		// 选择多个变量
		document.getElementById('selectMultipleVariable').addEventListener('click', function () {
			selectMultipleVariableDialog();
		})
	};
	
	addBtn.setAttribute('disabled', 'disabled');
	addBtn.style.marginLeft = '10px';
	addBtn.style.width = '76px';

	// 取消按钮
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		ui.hideDialog.apply(ui, arguments);
	});
	cancelBtn.className = 'geBtn';
	
	// 应用按钮
	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		try
		{
			ui.hideDialog.apply(ui, arguments);
			// Clones and updates the value
			value = value.cloneNode(true);
			value.setAttribute('getech', JSON.stringify(temp))
			// Updates the value of the cell (undoable)
			console.log(cell, value)
			graph.getModel().setValue(cell, value);
		}
		catch (e)
		{
			mxUtils.alert(e);
		}
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	
	// 底部按钮
	var buttons = document.createElement('div');
	buttons.style.cssText = 'position:absolute;left:30px;right:30px;text-align:center;bottom:30px;height:40px;'
	
	if (ui.editor.graph.getModel().isVertex(cell) || ui.editor.graph.getModel().isEdge(cell))
	{
		var replace = document.createElement('span');
		replace.style.marginRight = '10px';
		
		if (EditDataDialog.placeholderHelpLink != null)
		{
			var link = document.createElement('a');
			link.setAttribute('href', EditDataDialog.placeholderHelpLink);
			link.setAttribute('title', mxResources.get('help'));
			link.setAttribute('target', '_blank');
			link.style.marginLeft = '10px';
			link.style.cursor = 'help';
			
			var icon = document.createElement('img');
			icon.setAttribute('border', '0');
			icon.setAttribute('valign', 'middle');
			icon.style.marginTop = (mxClient.IS_IE11) ? '0px' : '-4px';
			icon.setAttribute('src', Editor.helpImage);
			link.appendChild(icon);
			
			replace.appendChild(link);
		}
		
		buttons.appendChild(replace);
	}
	
	if (ui.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
		buttons.appendChild(applyBtn);
	}
	else
	{
		buttons.appendChild(applyBtn);
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);
	this.container = div;

	// 单选变量窗口
	function selectVariableDialog() {
		// 存储临时变量
		let tempVariable = temp.variables;
		let oDiv = document.createElement('div');
		oDiv.className = "selectVariableDialog";
		oDiv.innerHTML = `
			<p class="dialogTitle">选择单个变量</p>
			<div class="searchBox">
				<input />
				<button id="searchVariable">搜索</button>
			</div>
			<div class="variablesList">
			</div>
			<div class="dialogBtns">
				<button class="geBtn" id="variableDialogCancel">取消</button>
				<button class="geBtn gePrimaryBtn" id="variableDialogEnsure">应用</button>
			</div>
		`
		document.body.append(oDiv);searchVariable;
		// 通过请求获取变量列表
		function getVariables() {
			let list1 = [
				'cl', 'header2', 'sn', 'dp_power', 'dp_speed'
			];
			let list2 = [
				'hpcp', 'cda', 'mdp', 'heater', 'particle'
			];
			let list = Math.random() > 0.5 ? list1 : list2;
			let str = list.reduce((item, val) => {
				item += `<p>${val}</p>`
				return item;
			}, '')
			document.getElementsByClassName('variablesList')[0].innerHTML = str
		};
		getVariables();
		// 选择变量
		document.getElementById('searchVariable').addEventListener("click", function () {
			getVariables()
		});
		// 选择变量
		document.getElementsByClassName('variablesList')[0].addEventListener("click", function (e) {
			let _target = e.target;
			if (_target.nodeName == 'DIV') return false;
			tempVariable = _target.innerHTML;
			// 清空其他选中样式
			let p_children = document.getElementsByClassName('variablesList')[0].children;
			for (let i = 0; i < p_children.length; i++) {
				p_children[i].style = "";
			}
			// 设置选中状态
			_target.style.color = "#fff";
			_target.style.backgroundColor = "#3B72A8";
		});
	
		// 取消
		document.getElementById('variableDialogCancel').addEventListener("click", function () {
			document.body.removeChild(document.getElementsByClassName('selectVariableDialog')[0])
		})
		// 确定
		document.getElementById('variableDialogEnsure').addEventListener("click", function () {
			temp.variables = [tempVariable];
			document.body.removeChild(document.getElementsByClassName('selectVariableDialog')[0])
		})
	}

	// 多选变量窗口
	function selectMultipleVariableDialog () {
		let tempVariables = temp.variables;
		let oDiv = document.createElement('div');
		oDiv.className = "selectVariableDialog selectMultipleVariableDialog";
		oDiv.innerHTML = `
			<p class="dialogTitle">选择多个变量</p>
			<div class="searchBox">
				<input />
				<button id="searchVariable">搜索</button>
			</div>
			<div class="selectedVariables">
			</div>
			<div class="variablesList">
			</div>
			<div class="dialogBtns">
				<button class="geBtn" id="variableDialogCancel">取消</button>
				<button class="geBtn gePrimaryBtn" id="variableDialogEnsure">应用</button>
			</div>
		`
		document.body.append(oDiv);searchVariable;
		// 通过请求获取变量列表
		function getVariables() {
			let list1 = [
				'cl', 'header2', 'sn', 'dp_power', 'dp_speed'
			];
			let list2 = [
				'hpcp', 'cda', 'mdp', 'heater', 'particle'
			];
			let list = Math.random() > 0.5 ? list1 : list2;
			let str = list.reduce((item, val) => {
				item += `<p>${val}</p>`
				return item;
			}, '')
			document.getElementsByClassName('variablesList')[0].innerHTML = str
		};
		// 渲染选中列表
		function setSelecteds() {
			let str = tempVariables.reduce((item, val) => {
				item += `<span class="variableDetail">${val}<a v_name="${val}" class="variableDetailDel">x</a></span>`
				return item;
			}, '')
			document.getElementsByClassName('selectedVariables')[0].innerHTML = str
		}
		getVariables();
		setSelecteds();
		// 选择变量
		document.getElementById('searchVariable').addEventListener("click", function () {
			getVariables()
		});
		// 选择变量
		document.getElementsByClassName('variablesList')[0].addEventListener("click", function (e) {
			let _target = e.target;
			if (_target.nodeName == 'DIV') return false; 
			if (tempVariables.indexOf(_target.innerHTML) == -1) {
				tempVariables.push(_target.innerHTML);
				setSelecteds();
			}
			let p_children = document.getElementsByClassName('variablesList')[0].children;
			for (let i = 0; i < p_children.length; i++) {
				p_children[i].style = "";
			}
			_target.style.color = "#fff";
			_target.style.backgroundColor = "#3B72A8";
		});
		// 删除选中
		document.getElementsByClassName('selectedVariables')[0].addEventListener("click", function (e) {
			if (e.target.className == "variableDetailDel") {
				let idx = tempVariables.indexOf(e.target.getAttribute('v_name'));
				tempVariables.splice(idx, 1);
				setSelecteds();
			}
		})
		// 取消
		document.getElementById('variableDialogCancel').addEventListener("click", function () {
			document.body.removeChild(document.getElementsByClassName('selectVariableDialog')[0])
		})
		// 确定
		document.getElementById('variableDialogEnsure').addEventListener("click", function () {
			temp.variables = tempVariables;
			document.body.removeChild(document.getElementsByClassName('selectVariableDialog')[0])
		})
	}
};
/**
 * Optional help link.
 */
EditPropDialog.getDisplayIdForCell = function(ui, cell)
{
	var id = null;
	
	if (ui.editor.graph.getModel().getParent(cell) != null)
	{
		id = cell.getId();
	}
	return id;
};

/**
 * Optional help link.
 */
EditPropDialog.placeholderHelpLink = null;


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
	
	var dataLink = link.cloneNode();
	dataLink.innerHTML = '<div class="geSprite geSprite-dots" style="display:inline-block;"></div>';
	dataLink.setAttribute('title', mxResources.get('rename'));

	mxEvent.addListener(dataLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			editorUi.showDataDialog(selectionLayer);
		}
		
		mxEvent.consume(evt);
	});
	
	if (!graph.isEnabled())
	{
		dataLink.className = 'geButton mxDisabled';
	}

	ldiv.appendChild(dataLink);
	
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
		dataLink.setAttribute('title', mxResources.get('editData'));
		
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

	this.window = new mxWindow(mxResources.get('layers'), div, x, y, w, h, true, true);
	this.window.minimumSize = new mxRectangle(0, 0, 120, 120);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);
	
	// Make refresh available via instance
	this.refreshLayers = refresh;
	
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

	this.destroy = function()
	{
		mxEvent.removeListener(window, 'resize', resizeListener);
		this.window.destroy();
	}
};

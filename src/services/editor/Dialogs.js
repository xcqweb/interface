/* eslint-disable */
/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new open dialog.
 */
var OpenDialog = function(tips)
{
    var p = document.createElement('p')
    p.innerHTML = tips
    p.style.textAlign = "center"
    p.style.fontSize = '14px';
    p.style.lineHeight = '40px';
	
    this.container = p;
};

/**
 * Constructs a new color dialog.
 */
var ColorDialog = function(editorUi, color, apply, cancelFn,isShowBtn=true)
{
    this.editorUi = editorUi;
    
    var selectColor = document.createElement('div');
    selectColor.style.display = 'flex';
    selectColor.style.marginTop = '8px';
    selectColor.style.alignItems='center'
    var input = document.createElement('input');
    input.style.width = '120px';
    input.style.border = '1px solid #D4D4D4';
    input.style.backgroundColor = '#fff';
    input.style.borderRadius = '2px';
    input.setAttribute('spellcheck',"false")
    //input.setAttribute('disabled',"");

    var rect = document.createElement('input')
    rect.style.width = '16px';
    rect.style.height = '16px';
    rect.style.marginRight = '4px';
    rect.style.backgroundColor = '#fff';
    rect.style.borderRadius = '2px';
    rect.style.border = 'none';
    //rect.setAttribute('disabled',"");

 /*    var copyColor = document.createElement('p');
    copyColor.style.width = '16px';
    copyColor.style.height = '16px';
    copyColor.style.marginLeft = '10px';
    copyColor.style.background = "url('/static/images/default/copyColor.png')";
    copyColor.style.cursor = 'pointer'; */

   /*  //点击复制
    mxEvent.addListener(copyColor,'click',() => {
        var oInput = document.createElement('input');
        oInput.value = input.value;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display='none';
    },false)
 */
    selectColor.appendChild(rect);
    selectColor.appendChild(input);
    //selectColor.appendChild(copyColor);

    var border = document.createElement('p');
    border.style.height = '1px';
    border.style.marginTop = '6px';
    border.style.backgroundColor = '#e1e1e1';

    // Required for picker to render in IE
    if (mxClient.IS_IE)
    {
        // input.style.marginTop = '10px';
        document.body.appendChild(selectColor);
    }
	
    this.init = function()
    {
        if (!mxClient.IS_TOUCH)
        {
            input.focus();
        }
    };
    var picker = new jscolor.color(input,rect);
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
        var table = addPresets((ColorDialog.recentColors.length == 0) ? ['#FFFFFF'] :
            ColorDialog.recentColors, 9, '#FFFFFF', true, true);
        table.style.marginBottom = '8px';
		
        return table;
    }
	
    function addPresets(presets, rowLength, defaultColor, addResetOption,isRecent)
    {
        if (!isShowBtn){
            presets = ['#D0021B', '#F5A623', '#F8E71C', '#7ED321', '#4A90E2', '#BD10E0', '#4A4A4A', '#9B9B9B']
        }
        rowLength = (rowLength != null) ? rowLength : 9;
        var odiv = document.createElement('div');

        var rows = presets.length / rowLength;
        for (var row = 0; row < rows; row++)
        {
            var tr = document.createElement('ul');
            for (var i = 0; i < rowLength; i++)
            {
                if(!presets[row * rowLength + i]){
                    continue;
                }
                (function(clr)
                {
                    var td = document.createElement('li');
                    td.style.border = `1px solid #d4d4d4`;
                    td.style.padding = '0px';
                    td.style.width = '16px';
                    td.style.height = '16px';
                    td.style.float = 'left';
                    td.style.borderRadius = '2px';
                    td.style.margin = '0 6px 6px 0';
					
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
                        td.style.backgroundColor = clr;
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
                                rect.style.backgroundColor = `${clr}`
                            }
                        });
                    }
                })(presets[row * rowLength + i]);
            }
            odiv.appendChild(tr);
        }
        
		var clearFix = document.createElement('p');
            clearFix.style.display= 'block';
            clearFix.style.overflow= 'auto';
            clearFix.style.clear= 'both';
            odiv.appendChild(clearFix);
        center.appendChild(odiv);
        if(!isRecent){
            var borderU = document.createElement('p');
            borderU.style.height = '1px';
            borderU.style.margin = '6px 0 6px 0';
            borderU.style.backgroundColor = '#e1e1e1';
            odiv.appendChild(borderU);
            var defaultColor = document.createElement('p');
            defaultColor.style.margin = '6px 0 3px 0';
            defaultColor.style.fontSize = '12px';
            defaultColor.style.color = '#252525';
            defaultColor.innerText = mxResources.get('recentlyUsed');
            odiv.appendChild(defaultColor);
        }
        return odiv;
    }

    div.appendChild(selectColor);
    div.appendChild(border);
    var defaultColor = document.createElement('p');
    defaultColor.style.margin = '6px 0 3px 0';
    defaultColor.style.fontSize = '12px';
    defaultColor.style.color = '#252525';
    defaultColor.innerText = mxResources.get('defaultColor');
    div.appendChild(defaultColor);
    // Adds presets 默认
    addPresets(this.presetColors,9,'#FFFFFF', true, !isShowBtn);
   if(isShowBtn){
        createRecentColorTable();
   }
    div.appendChild(center);
    if(isShowBtn){
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
            ColorDialog.addRecentColor(color, 9);
            
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
        div.appendChild(buttons);
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
// ColorDialog.prototype.presetColors = ['E6D0DE', 'CDA2BE', 'B5739D', 'E1D5E7', 'C3ABD0', 'A680B8', 'D4E1F5', 'A9C4EB', '7EA6E0', 'D5E8D4', '9AC7BF', '67AB9F', 'D5E8D4', 'B9E0A5', '97D077', 'FFF2CC', 'FFE599', 'FFD966', 'FFF4C3', 'FFCE9F', 'FFB570', 'F8CECC', 'F19C99', 'EA6B66']; 
ColorDialog.prototype.presetColors = ['none','#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'];

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
		
        if (ColorDialog.recentColors.length > max)
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
var valueDialog = function(editorUi, filename, titleText, buttonText, fn) {
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
function dealDefaultThem(editorUi){
    if (!editorUi.theme) {
        editorUi.theme = {
            position: 1,
            style: 1,
            status: 1
        }
        if (editorUi.isOldApply) {
            //老应用，默认不启用菜单
            editorUi.theme.status = 0
        }
    }
}
/**
 * 保存文件弹窗
 */
let FilenameDialog = function(editorUi,fn, closeOnBtn, cancelFn)
{
    closeOnBtn = (closeOnBtn != null) ? closeOnBtn : true
    var saveContent = editorUi.createDiv('geDialogInfo')
    dealDefaultThem(editorUi)
    saveContent.style.padding="20px 20px 0 20px"
    //默认导航是否启用
    let defaultConfigMenu = document.createElement('div')
    defaultConfigMenu.innerHTML = `<div style="font-size:14px;color:#929292;flex:1;">${mxResources.get('defaultMenu')}</div>
        <div style="flex:2"><input type="checkbox" class="menu-config-switch menu-config-switch-anim" ${editorUi.theme.status == 1 ? 'checked' : ''}></div>`;
    defaultConfigMenu.style.cssText = "display:flex;height:24px;align-items:center;"
    saveContent.appendChild(defaultConfigMenu)

    let menuPosMsgCon = document.createElement("div")
    menuPosMsgCon.style.display = editorUi.theme.status == 1 ? "block" : "none"

    $(defaultConfigMenu).on("change", "input", function() {
       if ($(this).prop("checked")) {
          editorUi.theme.status = 1
          menuPosMsgCon.style.display = 'block'
          $(".geDialog").css("minHeight", "266px")
       } else {
          editorUi.theme.status = 0
          menuPosMsgCon.style.display = "none"
          $(".geDialog").css('minHeight','auto')
       }
     })
    this.init = function() {
        if(editorUi.theme.status !=1){
            $(".geDialog").css("minHeight", "auto")
        }
    }
    // 导航位置
    let menuPosCon = document.createElement('div')
    menuPosMsgCon.style.marginTop='15px'
    menuPosCon.innerHTML = `<span style="font-size:14px;color:#929292;flex:1;">${mxResources.get('menuPosition')}</span>
    <div style="flex:2;display:flex;">
        <div class="menu-pos-con ${editorUi.theme.position == 1 ? 'check' : ''}">
            <div class="menu-left-cls check"></div>
        </div>
        <div class="menu-pos-con ${editorUi.theme.position == 2 ? 'check' : ''}" style="margin-left:20px;">
            <div class="menu-top-cls"><div>
        </div>
    </div>`;
    menuPosCon.className = 'menu-pos-con-dlg'
    menuPosMsgCon.appendChild(menuPosCon)
    $(menuPosCon).on('click','.menu-pos-con',(evt)=>{
        let el = evt.currentTarget
        $(el).addClass('check').siblings().removeClass('check')
    })
 
    // 导航风格
    let menuStyleCon = document.createElement('div')
    menuStyleCon.style.marginTop="15px"
    menuStyleCon.innerHTML = `<span style="font-size:14px;color:#929292;flex:1;">${mxResources.get('menuStyle')}</span>
    <ul class='menu-style-con'>
        <li class="${editorUi.theme.style == 1 ? 'check' : ''}"><div class="menu1"></div></li>
        <li class="${editorUi.theme.style == 2 ? 'check' : ''}"><div class="menu2"></div></li>
        <li class="${editorUi.theme.style == 3 ? 'check' : ''}"><div class="menu3"></div></li>
        <li class="${editorUi.theme.style == 4 ? 'check' : ''}"><div class="menu4"></div></li>
    </ul>
    `
    menuStyleCon.className = 'menu-pos-con-dlg'
    menuPosMsgCon.appendChild(menuStyleCon)
    $(menuStyleCon).on('click', 'li', (evt) => {
        let el = evt.currentTarget
        $(el).addClass('check').siblings().removeClass('check')
    })
    saveContent.appendChild(menuPosMsgCon)
    // 按钮
    var btnContent = editorUi.createDiv('btnContent')
    btnContent.style.marginTop="5px"
    btnContent.style.marginBottom='25px'
    var genericBtn = mxUtils.button(mxResources.get('save'), function()
    {   
        $(".menu-pos-con").each((index, item) => {
            if ($(item).hasClass('check')) {
                editorUi.theme.position = index + 1
                return false
            }
        })
        $(".menu-style-con li").each((index,item)=>{
            if($(item).hasClass('check')){
                editorUi.theme.style = index + 1
                return false
            }
        })
        fn()
    });
    genericBtn.className = 'geBtn gePrimaryBtn'
    var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
    {
        editorUi.hideDialog()
		
        if (cancelFn != null)
        {
            cancelFn(mxResources.get('cancel'))
        }
    });
    cancelBtn.className = 'geBtn'
    btnContent.appendChild(cancelBtn)
    btnContent.appendChild(genericBtn)
    saveContent.appendChild(btnContent)
    this.container = saveContent
};
/**
 * 发布弹窗
 */
let PreviewDialog = function(editorUi,fun) {
    var saveContent = editorUi.createDiv('geDialogInfo');
    // 链接
    var nameTitle = document.createElement('p')
    nameTitle.innerHTML = `${mxResources.get('savePreviewApply')}?`;
    nameTitle.className = 'geDialogInfoTitle';
    saveContent.appendChild(nameTitle)

    autoSaveFlagTerry = 0
    dealDefaultThem(editorUi)
    editorUi.save(true)

    // 保存按钮
    var btnContent = editorUi.createDiv('btnContent');
    var genericBtn = mxUtils.button(mxResources.get('preview'), function(){
        fun()
        editorUi.hideDialog()
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
let tipDialog = function(editorUi, flag, info) {
    var tipContent = editorUi.createDiv('tipDialogInfo');
    // 图标
    var img = document.createElement('img')
    img.setAttribute('src', flag ? window.PREFIX_PATH + '/static/images/default/success.png' : window.PREFIX_PATH + '/static/images/default/error.png');
    tipContent.appendChild(img)
    // 内容
    var infoText = document.createElement('p')
    infoText.className = 'tipText'
    infoText.innerHTML = info + (flag === null ? '' : flag ? '成功' : '失败');
    tipContent.appendChild(infoText)
    setTimeout(function() {
        editorUi.hideDialog()
    }, 3000)
    return tipContent
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
        }
		
        function handleDragOver(evt)
        {
            evt.stopPropagation();
            evt.preventDefault();
        }

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
        outline.outline.background = (graph.background == null || graph.background == mxConstants.NONE) ? graph.defaultPageBackgroundColor : graph.background;
		
        var current = mxUtils.getCurrentStyle(graph.container);
        div.style.backgroundColor = current.backgroundColor;

        if (graph.view.backgroundPageShape != null && outline.outline.view.backgroundPageShape != null)
        {
            outline.outline.view.backgroundPageShape.fill = graph.view.backgroundPageShape.fill;
        }
		
        outline.outline.refresh();
    }

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
    }
	
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
        }
		
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
    }

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

export {
    OpenDialog, ColorDialog, AboutDialog, valueDialog,PreviewDialog, tipDialog,
    EditDiagramDialog, LinkDialog, OutlineWindow, LayersWindow, FilenameDialog
}
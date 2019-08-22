const state = {
    type:0,//0=页面 1=弹窗 2=普通控件
    widgetInfo:{},//当前组件信息
    rand:0,//监听控件切换的刷新 随机数字
    states:[],//交互-切换里面的状态列表
    dialogTitleStyle:{style:{},size:{}},//弹窗标题
}

const mutations = {
    pageTabIndex(state,type) {
        state.type = type
    },
    getWidgetInfo(state,graph) {
        let widgetInfo = {

        }
        let cell = graph.getSelectionCell()
        let stateWidget = graph.view.getState(cell);
        let shapeInfo = stateWidget && stateWidget.style;
        widgetInfo.shapeInfo = shapeInfo

        let cellInfo = graph.getModel().getValue(cell);
        let widgetName = cellInfo && cellInfo.attributes && cellInfo.attributes['palettename'] && cellInfo.attributes['palettename'].nodeValue || '' //控件名称
        widgetInfo.widgetName = widgetName
        
        let geo = graph.getCellGeometry(cell)
        widgetInfo.geo = geo

        let {mxUtils,mxConstants} = require('../services/mxGlobal')
        let fontSize = 12
        let isSetBold = false
        let color = '',bgColor = '',borderColor = '',borderBold = 1
        let align = mxConstants.ALIGN_CENTER,valign = mxConstants.ALIGN_MIDDLE,borderLineCls,arrow1,arrow2
        if (stateWidget) {
            fontSize = parseFloat(mxUtils.getValue(stateWidget.style, mxConstants.STYLE_FONTSIZE, 0));
            isSetBold = mxUtils.getValue(stateWidget.style, 'fontStyle', 0) === 1
            color = mxUtils.getValue(stateWidget.style, 'fontColor', null)
            bgColor = mxUtils.getValue(stateWidget.style, 'fillColor', null)
            borderColor = mxUtils.getValue(stateWidget.style, 'strokeColor', null)
            if(shapeInfo.shape == 'image') {
                borderColor = mxUtils.getValue(stateWidget.style, 'imageBorder', "#000000")
            }
            borderBold = mxUtils.getValue(stateWidget.style, 'strokeWidth', 1)
            align = mxUtils.getValue(stateWidget.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER)
            valign = mxUtils.getValue(stateWidget.style, mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE)
            borderLineCls = mxUtils.getValue(stateWidget.style, mxConstants.STYLE_DASHED, null)
            if (shapeInfo.shape == 'beeline') {
                arrow1 = mxUtils.getValue(stateWidget.style, mxConstants.STYLE_STARTARROW, null)
                arrow2 = mxUtils.getValue(stateWidget.style, mxConstants.STYLE_ENDARROW, null)
            }
        }
        widgetInfo.fontSize = fontSize
        widgetInfo.isSetBold = isSetBold
        widgetInfo.color = color
        widgetInfo.bgColor = bgColor
        widgetInfo.borderColor = borderColor
        widgetInfo.borderBold = borderBold
        widgetInfo.align = align
        widgetInfo.valign = valign
        if (!borderLineCls) {
            widgetInfo.borderLineCls = 'border-line'
        } else if (borderLineCls == 1) {
            widgetInfo.borderLineCls = 'border-dash'
        }
        if (arrow1 && !arrow2) {
            widgetInfo.arrowCls = 'arrow-left'
        } else if (!arrow1 && arrow2) {
            widgetInfo.arrowCls = 'arrow-right'
        } else if (arrow1 && arrow2) {
            widgetInfo.arrowCls = 'arrow-double'
        } else if (!arrow1 && !arrow2) {
            widgetInfo.arrowCls = 'arrow-empty'
        }
        

        let temp = Object.assign({},state.widgetInfo, widgetInfo)
        state.widgetInfo = temp
        graph.refresh()
    },
    setWidgetInfo(state,obj) {
        state.widgetInfo = Object.assign(state.widgetInfo,obj)
    },
    widgetChange(state,rand) {
        state.rand = rand
    },
    refreshState(state,states) {//添加状态后，交互列表里面的状态列表刷新
        state.states = states
    },
    dialogTitleStyleDeal(state, {style,size}) {
        state.dialogTitleStyle = {style:style,size:size}
    }
}

const actions = {
    pageTabIndex({commit}, type = 0) {
        commit('pageTabIndex', type)
    },
}

export default {
    state,
    mutations,
    actions
}

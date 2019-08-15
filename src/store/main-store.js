const state = {
    type:0,//0=页面 1=弹窗 2=普通控件
    widgetInfo:{},//当前组件信息
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
        let align = mxConstants.ALIGN_CENTER,valign = mxConstants.ALIGN_MIDDLE
        if (stateWidget) {
            fontSize = parseFloat(mxUtils.getValue(stateWidget.style, mxConstants.STYLE_FONTSIZE, 0));
            isSetBold = mxUtils.getValue(stateWidget.style, 'fontStyle', 0) === 1
            color = mxUtils.getValue(stateWidget.style, 'fontColor', null)
            bgColor = mxUtils.getValue(stateWidget.style, 'fillColor', null)
            borderColor = mxUtils.getValue(stateWidget.style, 'strokeColor', null)
            borderBold = mxUtils.getValue(stateWidget.style, 'strokeWidth', 1)
            align = mxUtils.getValue(stateWidget.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER)
            valign = mxUtils.getValue(stateWidget.style, mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE)
        }
        widgetInfo.fontSize = fontSize
        widgetInfo.isSetBold = isSetBold
        widgetInfo.color = color
        widgetInfo.bgColor = bgColor
        widgetInfo.borderColor = borderColor
        widgetInfo.borderBold = borderBold
        widgetInfo.align = align
        widgetInfo.valign = valign
        let temp = Object.assign({},state.widgetInfo, widgetInfo)
        state.widgetInfo = temp
        graph.refresh()
    },
    setWidgetInfo(state,obj) {
        state.widgetInfo = Object.assign(state.widgetInfo,obj)
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

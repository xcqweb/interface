const state = {
    type:0,//0=页面 1=弹窗 2=普通控件
    widgetInfo:{},//当前组件信息
    rand:0,//监听控件切换的刷新 随机数字
    modelEditing: true, // 模型是否处于编辑状态
    footerModelUpdata: false // 是否刷新底部状态模型
}

const mutations = {
    pageTabIndex(state,type) {
        state.type = type
    },
    getWidgetInfo(state,graph) {
        let widgetInfo = {}
        let cell = graph.getSelectionCell()
        let stateWidget = graph.view.getState(cell)
        let cellsCount = graph.getSelectionCount()
        let cells = graph.getSelectionCells()

        let geo = graph.model.getGeometry(cell)
        let shapeInfo = stateWidget && stateWidget.style
        widgetInfo.shapeInfo = shapeInfo
        let cellInfo = graph.getModel().getValue(cell)
        if (cellInfo && cellInfo.attributes && cellInfo.attributes['palettename']) {
            let widgetName = cellInfo.attributes['palettename'].nodeValue || '' //控件名称
            widgetInfo.widgetName = widgetName
        }
        let edgeArr = new Array(2).fill(0)
        let edgeInfo = 1 //没有直线
        let cellsSameFlagEdge = { //选中多个控件时候，如果位置大小相同就显示值，否则显示空
            sx: true,
            sy: true,
            tx: true,
            ty: true,
        }
        let cellsSameFlag = {
            width: true,
            height: true,
            x: true,
            y: true,
        }
        let isSameProp = (cell1,cell2,prop)=> {
            let geo1 = graph.model.getGeometry(cell1)
            let geo2 = graph.model.getGeometry(cell2)
            return geo1[prop] == geo2[prop]
        }
        let isSamePropEdge = (cell1, cell2, prop) => {
            let res = true
            let stateWidget1 = graph.view.getState(cell1)
            let stateWidget2 = graph.view.getState(cell2)
            switch(prop) {
                case 'sx':
                    res = stateWidget1.absolutePoints[0].x == stateWidget2.absolutePoints[0].x
                    break
                case 'sy':
                    res = stateWidget1.absolutePoints[0].y == stateWidget2.absolutePoints[0].y
                    break
                case 'tx':
                    res = stateWidget1.absolutePoints[1].x == stateWidget2.absolutePoints[1].x
                    break
                case 'ty':
                    res = stateWidget1.absolutePoints[1].y == stateWidget2.absolutePoints[1].y
                    break
            }
            return res
        }
        for (let i = 0; i < cells.length; i++) {
            if (graph.model.isEdge(cells[i])) {
                edgeArr[0]++
            } else {
                edgeArr[1]++
            }
        }
        if (edgeArr[1] === 0) {
            edgeInfo = 3
        } else if (edgeArr[0] !== 0 && edgeArr[1] !== 0) {
            edgeInfo = 2
        }
        if((edgeInfo == 1 || edgeInfo == 3) && cellsCount > 1) {
            let tempFlag = cellsSameFlag,
                tempCellsSame = cellsSameFlag,
                isSamePropFun = isSameProp
            if(edgeInfo == 3) {
                tempFlag = cellsSameFlagEdge
                tempCellsSame = cellsSameFlagEdge
                isSamePropFun = isSamePropEdge
            }
            let cell1 = cells[0]
            for (let key of Object.keys(tempFlag)) {
                for (let i = 0; i < cells.length; i++) {
                    if (i < cells.length - 1) {
                        let cell2 = cells[i + 1]
                        if (!isSamePropFun(cell1, cell2, key)) {
                            tempCellsSame[key] = false
                            break
                        }
                    }
                }
            }
        }
        let dealEdgePosition = (cell)=>{
            let stateWidget = graph.view.getState(cell)
            let absolutePoints = stateWidget.absolutePoints
            let translate = stateWidget.view.translate
            absolutePoints = absolutePoints.map((item) => {
                return {
                    x: item.x - translate.x,
                    y: item.y - translate.y
                }
            })
            return {
                sx: absolutePoints[0].x,
                sy: absolutePoints[0].y,
                tx: absolutePoints[1].x,
                ty: absolutePoints[1].y
            }
        }
        if (stateWidget) {
            let tempFlag = cellsSameFlag
            if (graph.model.isEdge(cell)) {
                tempFlag = cellsSameFlagEdge
                widgetInfo.geo = dealEdgePosition(cell)
            }else{
                widgetInfo.geo = {
                    x:geo.x,
                    y:geo.y,
                    width:geo.width,
                    height:geo.height
                }
            }
            if (cellsCount > 1) {
                for (let key of Object.keys(widgetInfo.geo)) {
                    if (!tempFlag[key]) {
                        widgetInfo.geo[key] = ""
                    }
                }
            }
        }else{
            widgetInfo.geo = {}
        }

        let {mxUtils,mxConstants} = require('../services/mxGlobal')
        let fontSize = 12
        let isSetBold = false
        let color = '',bgColor = '',borderColor = '',borderBold = 1
        let align = mxConstants.ALIGN_CENTER,valign = mxConstants.ALIGN_MIDDLE,borderLineCls,arrow1,arrow2,lock
        if (stateWidget) {
            fontSize = parseFloat(mxUtils.getValue(stateWidget.style, mxConstants.STYLE_FONTSIZE, 0));
            isSetBold = mxUtils.getValue(stateWidget.style, 'fontStyle', 0) === 1
            color = mxUtils.getValue(stateWidget.style, 'fontColor', null)
            bgColor = mxUtils.getValue(stateWidget.style, 'fillColor', null)
            borderColor = mxUtils.getValue(stateWidget.style, 'strokeColor', null)
            if(shapeInfo.shape.includes('image')) {
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
            lock = mxUtils.getValue(stateWidget.style, mxConstants.STYLE_MOVABLE,0)
        }
        widgetInfo.lock = lock
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

        widgetInfo.cellsCount = cellsCount
        widgetInfo.edgeInfo = edgeInfo

        let temp = Object.assign({},state.widgetInfo, widgetInfo)
        state.widgetInfo = temp
    },
    widgetChange(state,rand) {
        state.rand = rand
    },
    modelEditing(state, modelEditing) {
        state.modelEditing = modelEditing
    },
    footerModelUpdata(state, footerModelUpdata) {
        state.footerModelUpdata = footerModelUpdata
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

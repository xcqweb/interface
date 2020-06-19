/** 设备表格头部 **/
export const tableDeviceData = [
  {
    title: '设备名',
    key: "deviceName",
    render: (h, params) => {
      console.log(params)
      return h('Tooltip', {
        attrs: {
          placement: "bottom-start",
          class: 'tooltip-width-inner',
          theme: 'light',
          maxWidth: 200,
          content: params.row.deviceName,
        },
      },
      [
        h('span', {
        }, params.row.deviceName)
      ]
      );
    },
  },
  {
    title: '设备类型',
    key: "typeName",
    render: (h, params) => {
      return h('span', {
        attrs: {
          title: params.row.deviceName,
        },
      }, params.row.deviceName);
    },
  },
  {
    title: '设备型号',
    key: "modelName"
  },
  {
    title: '操作',
    width: "160",
    slot: "actions",
    key: "actions"
  }
]
/** 应用表格头部 **/
export const tableApplyData = [
  {
    title: '应用名',
    key: "appName"
  },
  {
    title: '操作',
    width: "160",
    slot: "actions"
  }
]

/** 设备参数表格头部 **/
export const tableDeviceParamData = [
  {
    title: '参数名称',
    key: "paramName"
  },
  {
    title: '参数类型',
    slot: "paramType",
    key: "paramType"
  },
  {
    title: '所属部件',
    key: "partName"
  },
  {
    title: '默认显示',
    slot: "paramShow"
  },
  {
    title: '操作',
    width: "160",
    slot: "actions"
  }
]

/** 设备参数表格头部 **/
export const tableApplyParamData = [
  {
    title: '参数名称',
    key: "paramName"
  },
  {
    title: '默认显示',
    slot: "paramShow"
  },
  {
    title: '操作',
    width: "160",
    slot: "actions"
  }
]


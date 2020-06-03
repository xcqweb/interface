
export default {
  testBaseUrl: {url: "", "desc": "测试环境"},
  baseUrl: {url: `${window.location.origin}/`, "desc": "生产环境"},
  addTemplate: {url: 'api/iot-cds/cds/pageTemplate', 'desc': '添加模板'},
  materialList: {url:'api/iot-cds/sources/material/library', 'desc': '素材库列表'},
  materialRightList: {url: 'api/iot-cds/sources/material', 'desc': '素材库右侧删除'},
  preview: {url: 'api/iot-cds/cds/configurationDesignStudio', 'desc': '预览'},
  devicetypelist: {url: 'api/device/deviceType/select', 'desc': '所有设备类型列表'},
  deviceEquipList: {url: 'api/iot-cds/cds/dataSource/device', 'desc': '设备类型下设备列表'},
  deviceParamList: {url: 'api/iot-cds/cds/dataSource/param', 'desc': '设备类型下参数列表'},
  importDataSource: {url: 'api/iot-cds/cds/importDataSource','desc': '导入数据源'},
  hasImportDeviceType: {url: 'api/iot-cds/cds/dataSource/deviceTypeList', 'desc': '导入的设备类型'},
  deleteParamList: {url: 'api/iot-cds/cds/dataSourceDeviceParam', 'desc': '删除数据源设备参数'},
  deleteDeviceList: {url: 'api/iot-cds/cds/delConfigDevice', 'desc': '删除数据源下设备'},
  deleteDeviceType: {url: 'api/iot-cds/cds/dataSourceDeviceType/', 'desc': '删除数据源设备类型'},
  getModelList: {url: 'api/iot-cds/cds/model/deviceType', 'desc':"设备类型下模型列表"},
  addModelList: {url: 'api/iot-cds/cds/model', 'desc':'新增修改模型'},
  getModelByIds: {url: 'api/iot-cds/cds/getModelByIds', 'desc':'根据id批量获取模型'},
  timeSelect: {url: 'api/device/device/time/select/', 'desc':'获取参数默认时长'},
  ifMultipleEdit: {url: 'api/iot-cds/cds/configurationDesignStudio/judgeIsEdit/', 'des': '是否有多人编辑'},
  pentSdbData: {url: 'api/v2/persist/tsdb/data/keys', 'desc':'趋势图的历史数据'},
  normalParam: {url: 'api/device/deviceModel/param/normal/select', 'desc': '获取设备参数'},
  fictitiousParam: {url: 'api/device/deviceModel/param/fictitious/select', 'desc': '获取虚拟参数'},
  deviceParamGenerate: {url: 'api/device/index/deviceParams', 'desc': '生成拼接的设备参数接口'},
   
}
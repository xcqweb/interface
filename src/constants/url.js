export default {
    // testBaseUrl: {url: "/api", "desc": "测试环境"},
    testBaseUrl: {url: "", "desc": "测试环境"},
    baseUrl: {url: "http://10.74.20.25/", "desc": "生产环境"},
    addTemplate: {url: 'api/iot-cds/cds/pageTemplate', 'desc': '添加模版'},
    materialList: {url:'api/iot-cds/sources/material/library', 'desc': '素材库列表'},
    materialRightList: {url: 'api/iot-cds/sources/material', 'desc': '素材库右侧删除'},
    preview: {url: 'api/iot-cds/cds/configurationDesignStudio', 'desc': '预览'},
    devicetypelist: {url: 'api/device/deviceType/select', 'desc': '所有设备类型列表'},
    deviceEquipList: {url: 'api/iot-cds/cds/dataSource/device', 'desc': '设备类型下设备列表'},
    deviceParamList: {url: 'api/iot-cds/cds/dataSource/param', 'desc': '设备类型下参数列表'},
    importDataSource: {url: 'api/iot-cds/cds/importDataSource','desc': '导入数据源'},
    hasImportDeviceType: {url: 'api/iot-cds/cds/dataSource/deviceTypeList', 'desc': '导入的设备类型'},
    deleteParamList: {url: 'api/iot-cds/cds/dataSourceDeviceParam', 'desc': '删除数据源设备参数'},
    deleteDeviceList: {url: 'api/iot-cds/cds/dataSourceDevice', 'desc': '删除数据源下设备'},
    deleteDeviceType: {url: 'api/iot-cds/cds/dataSourceDeviceType/', 'desc': '删除数据源设备类型'},
    getModelList: {url: 'api/iot-cds/cds/model/deviceType', 'desc':"设备类型下模型列表"},
    addModelList: {url: 'api/iot-cds/cds/model', 'desc':'新增修改模型'}
}
/**
 * 数据源中的数据
 */
import requestUtil from '../services/request'

const state = {
    // 设备类型数据，Array
    typeData: [],
    // 设备型号数据，Object
    modelObj: {},
    // 设备对象数据，Object
    deviceObj: {},
};

const mutations = {
    setTypeData(state, data) {
        state.typeData = data;
    },
    setModelObj(state, data) {
        state.modelObj = data;
    },
    setDeviceObj(state, data) {
        state.deviceObj = data;
    },
};

const actions = {
    loadStudioDevices({commit}, params) {
        requestUtil.post('api/iot-cds/cds/findConfigDevice', params).then(res => {
            const typeData = [];
            const modelObj = {};
            const deviceObj = {};
            const data = res.returnObj;
            if (data) {
                data.forEach(item => {
                    if (!modelObj[item.deviceTypeId]) {
                        modelObj[item.deviceTypeId] = [];
                        typeData.push({
                            deviceTypeId: item.deviceTypeId,
                            deviceTypeName: item.deviceTypeName,
                        });
                    }
                    if (!deviceObj[item.deviceModelId]) {
                        deviceObj[item.deviceModelId] = [];
                        modelObj[item.deviceTypeId].push({
                            deviceModelId: item.deviceModelId,
                            deviceModelName: item.deviceModelName,
                        });
                    }
                    deviceObj[item.deviceModelId].push({
                        id: item.id,
                        deviceId: item.deviceId,
                        deviceName: item.deviceName,
                    });
                });
            }
            commit('setTypeData', typeData);
            commit('setModelObj', modelObj);
            commit('setDeviceObj', deviceObj);
        })
    },
};

export default {
    state,
    mutations,
    actions,
};

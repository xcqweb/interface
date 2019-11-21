<template>
  <data-column class="editmodel-wrap">
    <!-- 描述 -->
    <template
      slot="header"
    >
      <div class="model-describe">
        <p class="form-label">
          {{ $t('dataSource.remark') }}
        </p>
        <Input
          v-model="model.describe"
          class="descript-color"
          :disabled="!currentValue"
          type="textarea" 
          :placeholder="$t('dataSource.remarkPlaceholder')"
          :autosize="{maxRows: 3, minRows: 3}"
        />
      </div>
      <div class="addmodel-btn">
        <a
          v-if="currentValue"
          href="javascript:;"
          @click="showRuleModal"
        >
          {{ $t('dataSource.addRule') }}
        </a>
        <span v-else>{{ $t('dataSource.rule') }}</span>
      </div>
    </template>
    <!-- 条件 -->
    <model-rule
      ref="rule"
      :is-form="currentValue"
      :logic="logic"
      :rule-data="ruleData"
      @remove-param="handleRemoveParamsKey"
    />
    <!-- 底部按钮 -->
    <div
      slot="footer"
    >
      <!-- 编辑状态 -->
      <template v-if="currentValue">
        <Button @click="cancel">
          {{ $t('cancel') }}
        </Button>
        <Button
          type="primary"
          :loading="loading"
          @click="submit"
        >
          {{ $t('dataSource.saveModel') }}
        </Button>
      </template>
      <!-- 查看状态 -->
      <template v-else>
        <Button
          type="primary"
          @click="setEditStatus"
        >
          {{ $t('dataSource.editModel') }}
        </Button>
      </template>
    </div>
    <!-- 选择设备参数弹窗 -->
    <component
      :is="ruleView"
      v-model="visible"
      :title="$t('dataSource.addRule')"
      :device-model-id="deviceModelId"
      :selected-keys="ruleKeys"
      @callback="callback"
    />
  </data-column>
</template>

<script>
import {Input, Button, Message} from 'iview';
import DataColumn from './data-column'
import ModelRule from './model-rule'
import columnCommon from './js/column-common'
import modelCommon from './js/model-common'

export default {
    components: {
        Input,
        Button,
        DataColumn,
        ModelRule,
        SelectParams: (resolve) => {
            return require(['./select-params'], resolve);
        },
    },
    mixins: [columnCommon, modelCommon],
    props: {
        data: {
            type: Object,
        },
    },
    data() {
        return {
            // 添加条件弹窗相关属性
            visible: false,
            ruleView: '',
            // 提交按钮状态
            loading: false,
            model: {
                sourceId: '',
                studioId: '',
                deviceTypeId: '',
                formula: '',
                viewContent: '',
                describe: '',
                modelName: '',
            },
            ruleKeys: [],
            ruleData: [],
            logic: '1',
            studioId: '',
        };
    },
    watch: {
        data() {
            this.setModel();
        },
    },
    created() {
        this.setModel();
    },
    methods: {
        cancel() {
            this.currentValue = false;
            this.$emit('saved', false);
        },
        submit() {
            const data = this.$refs.rule.checkRule();
            if (data) {
                this.loading = true;
                this.model.formula = JSON.stringify(data);
                this.model.studioId = this.studioId;
                this.model.deviceTypeId = this.deviceModelId;
                this.model.modelName = this.data.modelName;
                this.model.sourceId = this.data.sourceId;
                let func, successMsg;
                if (!this.model.sourceId) {
                    func = 'post';
                    successMsg = 'dataSource.addModelSuccessfully';
                } else {
                    func = 'put';
                    successMsg = 'dataSource.editModelSuccessfully';
                }
                this.requestUtil[func](this.urls.addModelList.url, this.model).then(res => {
                    Message.success(this.$t(successMsg));
                    this.currentValue = false;
                    this.model.sourceId = res.sourceId;
                    this.loading = false;
                    this.$emit('saved', true);
                }).catch(() => {
                    this.loading = false;
                });
            }
        },
        showRuleModal() {
            this.ruleView = 'select-params';
            this.visible = true;
        },
        callback(items, keys) {
            const ruleData = [];
            items.forEach(item => {
                ruleData.push({
                    key: item.key,
                    partName: item.partName,
                    paramName: item.paramName,
                });
            });
            this.ruleData = ruleData;
            this.ruleKeys = keys;
        },
        handleRemoveParamsKey(key) {
            const index = this.ruleKeys.indexOf(key);
            if (index > -1) {
                this.ruleKeys.splice(index, 1);
            }
        },
        setModel() {
            const data = this.data;
            if (data) {
                let formula = data.formula ? JSON.parse(data.formula) : null;
                console.log(formula);
                if (formula) {
                    this.logic = formula.conditionLogic;
                    this.ruleData = formula.data;
                } else {
                    this.logic = '1';
                    this.ruleData = [];
                }
            }
        },
        setEditStatus() {
            this.$emit('set-edit-status');
        },
    },
};
</script>

<style lang="less">
.editmodel-wrap {
  .data-column-body {
    margin: 0 10px 10px;
    border: 1px dashed #ccc;
    border-radius: 4px;
  }

  .data-column-footer {
    padding: 10px;
    justify-content: flex-end;

    .ivu-btn {
      + .ivu-btn {
        margin-left: 10px;
      }
    }
  }
}

.model-describe {
  padding: 0 10px;

  .form-label {
    padding: 10px 0 5px;
  }
}
</style>
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
          v-model="model.descript"
          class="descript-color"
          :disabled="!showForm"
          type="textarea" 
          :placeholder="$t('dataSource.remarkPlaceholder')"
          :autosize="{maxRows: 3, minRows: 3}"
        />
      </div>
      <div class="addmodel-btn">
        <a
          v-if="showForm"
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
      :show-form="showForm"
      :data="data && data.formula"
      :rule-data="ruleData"
      :reset-data="resetModelRuleData"
      @remove-param="handleRemoveParamsKey"
      @on-rule-keys="setRuleKeys"
    />
    <!-- 底部按钮 -->
    <div
      slot="footer"
    >
      <!-- 编辑状态 -->
      <template v-if="showForm">
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
          @click="showForm = true"
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
import SelectParams from './select-params'
import columnCommon from './js/column-common'
import modelCommon from './js/model-common'

export default {
  components: {
    Input,
    Button,
    DataColumn,
    ModelRule,
    SelectParams,
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
        deviceModelId: '',
        formula: '',
        viewContent: '',
        descript: '',
        modelName: '',
      },
      ruleKeys: [],
      ruleData: [],
      studioId: '',
      resetModelRuleData: false,
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
      if (this.data.sourceId) {
        this.setModel();
        this.resetModelRuleData = !this.resetModelRuleData;
      }
      this.showForm = false;
    },
    submit() {
      const data = this.$refs.rule.checkRule();
      if (data) {
        this.model.modelName = this.data.modelName || this.data.editName;
        if (!this.model.modelName) {
          Message.error(this.$t('dataSource.modelNameCanNotEmpty'));
          return;
        }
        if (this.model.descript.length > 200) {
          Message.error(this.$t('dataSource.descriptLimit200'));
          return;
        }
        this.loading = true;
        this.model.formula = JSON.stringify(data);
        this.model.studioId = this.studioId;
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
          this.showForm = false;
          this.model.sourceId = res.sourceId;
          this.loading = false;
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
    setRuleKeys(keys) {
      this.ruleKeys = keys || [];
    },
    handleRemoveParamsKey(key) {
      const index = this.ruleKeys.indexOf(key);
      if (index > -1) {
        this.ruleKeys.splice(index, 1);
      }
    },
    setModel() {
      const data = this.data || {};
      let key;
      for (key in this.model) {
        this.model[key] = data[key] || '';
      }
      if(this.$store.state.main.isTemplateApply) {
        this.model.deviceModelId = sessionStorage.getItem('modelId')
      }
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
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
          type="textarea" 
          :placeholder="$t('dataSource.remarkPlaceholder')"
          :autosize="{maxRows: 3, minRows: 3}"
        />
      </div>
      <div class="addmodel-btn">
        <a
          href="javascript:;"
          @click="showRuleModal"
        >
          {{ $t('dataSource.addRule') }}
        </a>
      </div>
    </template>
    <!-- 条件 -->
    <!-- <div class="model-rule-wrap">
      
    </div> -->
    <!-- 底部按钮 -->
    <div
      slot="footer"
    >
      <Button @click="cancel">
        {{ $t('cancel') }}
      </Button>
      <Button
        type="primary"
        :loading="loading"
        @click="submit"
      >
        {{ $t('submit') }}
      </Button>
    </div>

    <component
      :is="ruleView"
      v-model="visible"
      :title="$t('dataSource.addRule')"
      :device-model-id="deviceModelId"
    />
  </data-column>
</template>

<script>
import {Input, Button} from 'iview';
import DataColumn from './data-column'
import columnCommon from './js/column-common'

export default {
    components: {
        Input,
        Button,
        DataColumn,
        SelectParams: (resolve) => {
            return require(['./select-params'], resolve);
        },
    },
    mixins: [columnCommon],
    props: {
        deviceModelId: {
            type: String,
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
                studioId: '',
                deviceTypeId: '',
                formula: '',
                viewContent: '',
                describe: '',
                modelName: '',
            },
        };
    },
    methods: {
        cancel() {
            console.log('cancel');
        },
        submit() {
            console.log('submit');
        },
        showRuleModal() {
            this.ruleView = 'select-params';
            this.visible = true;
        }
    }
}
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
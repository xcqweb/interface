<template>
  <div class="model-rule-wrap">
    <dl class="model-rule-item">
      <dt v-if="model.data.length > 1">
        <Select
          v-if="isForm"
          v-model="model.conditionLogic"
          size="small"
          transfer
        >
          <Option
            v-for="item in conditionLogical"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </Select>
        <div
          v-else
          class="model-rule-cell"
        >
          {{ model.conditionLogic === '1' ? 'And' : 'Or' }}
        </div>
      </dt>
      <dd>
        <table class="model-rule-table">
          <tr
            v-for="(row, index) in model.data"
            :key="index"
          >
            <td v-if="row.key.includes('device')">
              <div class="model-rule-cell">
                {{ row.partName }}
              </div>
            </td>
            <td :colspan="row.key.includes('virtual') ? '2' : ''">
              <div class="model-rule-cell">
                {{ row.paramName }}
              </div>
            </td>
            <td>
              <Select
                v-if="isForm"
                v-model="row.logical"
                style="width: 80px;"
                size="small"
                transfer
              >
                <Option
                  v-for="item in logicalSignList"
                  :key="item.value"
                  :value="item.value"
                  :label="$t(item.label)"
                />
              </Select>
              <div
                v-else
                class="model-rule-cell"
              >
                {{ getLogicalText(row.logical) }}
              </div>
            </td>
            <td>
              <!-- 介于或不介于 -->
              <template v-if="isForm">
                <div
                  v-if="isBetween(row.logical)"
                  class="between-box"
                >
                  <Input
                    v-model="row.minValue"
                    type="number"
                    size="small"
                  />
                  <span class="space-line">-</span>
                  <Input
                    v-model="row.maxValue"
                    type="number"
                    size="small"
                  />
                </div>
                <Input
                  v-else
                  v-model="row.fixedValue"
                  style="min-width: 60px; max-width: 130px;"
                  type="number"
                  size="small"
                />
              </template>
              <div
                v-else
                class="model-rule-cell"
              >
                {{ getLogicalValue(row) }}
              </div>
            </td>
            <td
              v-if="isForm"
              class="hide-border"
            >
              <Button 
                class="delete-btn"
                size="small"
                type="text"
                @click="removeRule(row.key, index)"
              >
                {{ $t('delete') }}
              </Button>
            </td>
          </tr>
        </table>
      </dd>
    </dl>
  </div>
</template>

<script>
import {Select, Option, Input, Button, Message} from 'iview'
import {conditionLogical, logicalSignList} from '@/constants/model-form-logic'

export default {
    components: {
        Select,
        Option,
        Input,
        Button,
    },
    props: {
        ruleData: {
            type: Array,
        },
        logic: {
            type: String,
        },
        isForm: {
            type: Boolean,
        },
    },
    data() {
        return {
            conditionLogical,
            logicalSignList,
            model: {
                conditionLogic: '1',
                data: []
            }
        };
    },
    computed: {
        showLogic() {
            return this.model.data.length > 1;
        },
    },
    watch: {
        ruleData() {
            this.updateData();
        },
        logic(val) {
            this.model.conditionLogic = val || '1';
        },
    },
    created() {
        this.updateData();
    },
    methods: {
        assign(obj, data) {
            return Object.assign(obj, {
                partName: '',
                paramName: '',
                logical: '',
                minValue: '',
                maxValue: '',
                fixedValue: '',
            }, data);
        },
        removeRule(key, index) {
            this.model.data.splice(index, 1);
            this.$emit('remove-param', key);
        },
        checkRule() {
            if (this.modelName) {
                Message.error(this.$t('dataSource.modelNameCanNotEmpty'));
                return;
            }
            if (this.model.data.length === 0) {
                Message.error(this.$t('dataSource.ruleIsRequired'));
                return;
            }
            const data = this.model.data;
            const len = data.length;
            let i;
            for (i = 0; i < len; i++) {
                const item = data[i];
                if (!item.logical) {
                    this.ruleIsEmpty(item.paramName);
                    return;
                }

                if (item.logical === '1' || item.logical === '2') {
                    if (!item.minValue || !item.maxValue) {
                        this.ruleIsEmpty(item.paramName);
                        return;
                    }
                } else if (!item.fixedValue) {
                    this.ruleIsEmpty(item.paramName);
                    return;
                }
            }

            return this.model;
        },
        ruleIsEmpty(label) {
            Message.error(this.$t('dataSource.ruleCanNotEmpty', {label}));
        },
        getLogicalText(value) {
            const data = this.logicalSignList;
            const len = data.length;
            let i;
            for (i = 0; i < len; i++) {
                if (data[i].value === value) {
                    return this.$t(data[i].label);
                }
            }
            return value;
        },
        getLogicalValue(item) {
            if (this.isBetween(item.logical)) {
                return [item.minValue, item.maxValue].join(',');
            } else {
                return item.fixedValue;
            }
        },
        isBetween(logical) {
            return logical === '1' || logical === '2';
        },
        updateData() {
            if (this.ruleData) {
                const newData = [];
                this.ruleData.forEach(param => {
                    const data = this.model.data.filter(item => item.key === param.key);
                    if (data && data.length > 0) {
                        this.assign(data[0], param);
                    } else {
                        newData.push(this.assign({}, param));
                    }
                });
                if (newData.length > 0) {
                    this.model.data.push(...newData);
                }
            }
        },
    },
}
</script>

<style lang="less">
.model-rule-wrap {
  padding: 6px 15px;
}

.model-rule-item {
  position: relative;
  
  dt,
  dd,
  td {
    &::before {
      content: '';
      position: absolute;
      left: 0;
      background-color: #D4D4D4;
    }
  }

  dt {
    position: absolute;
    left: 0;
    top: 50%;
    width: 85px;
    margin-top: -12px;

    &::before {
      left: 100%;
      top: 12px;
      width: 7px;
      height: 1px;
    }

    + dd {
      margin-left: 91px;

      > table > tr > td {
        &:first-child {
          padding-left: 15px;

          &::before {
            width: 15px;
          }
        }
      }
    }
  }

  dd {
    position: relative;

    &::before {
      top: 18px;
      bottom: 18px;
      width: 1px;
    }
  }

  table {
    border-spacing: 0;
    border-collapse: collapse;
  }

  td {
    position: relative;
    height: 36px;
    vertical-align: middle;

    &::before {
      top: 50%;
      width: 6px;
      height: 1px;
    }

    & + td {
      padding-left: 6px;
    }
  }

  .hide-border {
    &::before {
      display: none;
    }
  }

  .model-rule-cell {
    min-width: 75px;
    height: 24px;
    padding: 0 5px;
    line-height: 22px;
    background-color: #F2F2F2;
    border: 1px solid #D4D4D4;
    border-radius: 2px;
    box-sizing: border-box;
    white-space: nowrap;
    vertical-align: top;
  }
  
  .ivu-input-small {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }

  .ivu-select-placeholder,
  .ivu-select-selected-value {
    padding-left: 5px !important;
    padding-right: 20px !important;
  }
  
  .ivu-select-arrow {
    right: 5px !important;
  }

  .delete-btn {
    padding-left: 16px;
    background-image: url('../../assets/images/datasource/delete.png');
    background-size: 16px auto;
    background-repeat: no-repeat;
    background-position: 0 center;
  }

  .between-box {
    width: 130px;
    overflow: hidden;

    .ivu-input-wrapper,
    .space-line {
      float: left;
    }

    .ivu-input-wrapper {
      width: 60px;
    }

    .space-line {
      width: 10px;
      text-align: center;
    }
  }
}
</style>
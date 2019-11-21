<template>
  <data-column
    :title="title"
    :width="width"
  >
    <div
      slot="header"
      class="addmodel-btn"
    >
      <a
        href="javascript:;"
        @click="editModel()"
      >
        {{ $t('dataSource.addModel') }}
      </a>
    </div>
    <!-- 数据列表 -->
    <ul
      v-if="data && data.length > 0"
      class="model-data-list"
    >
      <li
        v-for="(item, index) in data"
        :key="index"
        :class="{active: activeIndex === index}"
      >
        <div 
          v-show="!item.editing"
          class="name"
          @click="handleClick(index)"
        >
          {{ item.modelName }}
        </div>
        <Input
          v-if="item.editing"
          v-model="item.editName"
          size="small"
        />
      </li>
    </ul>
    <no-data
      v-else
      :margin-top="-36"
    />
  </data-column>
</template>

<script>
import {Input, Message} from 'iview'
import NoData from './nodata';
import DataColumn from './data-column'
import columnCommon from './js/column-common'
import modelCommon from './js/model-common';

export default {
    components: {
        Input,
        NoData,
        DataColumn,
    },
    mixins: [columnCommon, modelCommon],
    props: {
        saved: {
            type: Boolean,
            default: false,
        },
        setEditStatus: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            activeIndex: 0,
            data: [],
            editItem: null,
        };
    },
    watch: {
        saved() {
            if (this.editItem) {
                this.editItem.modelName = this.editItem.editName;
                this.editItem = null;
            }
            this.editing = false;
        },
        deviceModelId() {
            this.getModel();
        },
        setEditStatus() {
            if (this.editItem) {
                this.editModel(this.editItem, true, this.activeIndex);
            }
        }
    },
    mounted() {
        this.getModel();
    },
    methods: {
        getModel() {
            if (!this.deviceModelId) {
                this.data = [];
                return;
            }
            const params = {
                studioId: this.studioId,
                deviceTypeId: this.deviceModelId,
            };
            this.requestUtil.post(this.urls.getModelList.url, params).then(res => {
                if (res && res.returnObj.length > 0) {
                    res.returnObj.forEach(item => {
                        item.editing = false;
                        item.editName = item.modelName;
                    });
                    this.data = res.returnObj;
                    this.editModel(this.data[0], false, 0);
                } else {
                    this.data = [];
                }
            });
        },
        editModel(item, editing = true, index = 0) {
            if (this.currentValue) {
                Message.error(this.$t('dataSource.haveUnsavedModel'));
                return;
            }
            if (!item) {
                item = {
                    editing: true,
                    sourceId: '',
                    studioId: '',
                    deviceTypeId: '',
                    formula: '',
                    viewContent: '',
                    describe: '',
                    modelName: '',
                    editName: '新建模型' + (this.data.length + 1),
                };
                this.data.unshift(item);
            }
            this.currentValue = editing;
            this.editItem = item;
            this.handleClick(index);
            this.$emit('on-edit', item);
        },
        handleClick(index) {
            this.activeIndex = index;
        },
    },
};
</script>

<style lang="less">
.model-data-list {
  li {
    &.active,
    .name {
      padding: 3px 6px;
    }

    &.active {
      background-color: #3D91F7;

      .name {
        color: #fff;
        padding: 0;
      }
    }

    .name {
      line-height: 24px;
    }

    & + li {
      margin-top: 1px;
    }
  }
}
</style>
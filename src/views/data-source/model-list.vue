<template>
  <data-column
    :title="title"
    :width="width"
  >
    <div
      v-show="(deviceModelId) || $store.state.main.isTemplateApply"
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
          :class="{hover: hoverIndex === index}"
          @click="hanldeItemClick(item, index)"
          @mouseover="handleMouseover(index)"
          @mouseout="handleMouseout()"
        >
          <p
            :title="item.modelName"
            @dblclick="handleRename(item, index)"
          >
            {{ item.modelName }}
          </p>
          <dropdown
            transfer-class-name="model-data-dropdown"
            transfer
            @on-visible-change="showItemDropdown"
          >
            <a
              class="more"
              href="javascript:;"
            />
            <dropdown-menu slot="list">
              <dropdown-item @click.native.stop="handleRename(item, index)">
                {{ $t('rename') }}
              </dropdown-item>
              <dropdown-item @click.native.stop="handleDelete(item)">
                {{ $t('delete') }}
              </dropdown-item>
            </dropdown-menu>
          </dropdown>
        </div>
        <Input
          v-if="item.editing"
          v-model.trim="item.editName"
          size="small"
          @on-blur="saveRename(item)"
          @keyup.native.enter="saveRename(item)"
        />
      </li>
    </ul>
    <no-data
      v-else
    />
    <!-- 移除确认弹窗 -->
    <component
      :is="removeView"
      v-model="removeVisible"
      :content="removeContent"
      :data="removeData"
      @callback="removeCallback"
    />
  </data-column>
</template>

<script>
import {Input, Message, Dropdown, DropdownMenu, DropdownItem} from 'iview'
import NoData from './nodata';
import DataColumn from './data-column'
import columnCommon from './js/column-common'
import modelCommon from './js/model-common'
import removeCommon from './js/remove-common'
import editingModel from './js/editing-model'

export default {
  components: {
    Input,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    NoData,
    DataColumn,
  },
  mixins: [columnCommon, modelCommon, removeCommon, editingModel],
  props: ['deviceTypeId', 'fromText'],
  data() {
    return {
      activeIndex: -1,
      data: [],
      editItem: null,
      loading: false,
      deleteItemId: null,
      hoverIndex: -1,
    };
  },
  watch: {
    deviceModelId() {
      this.getModel();
    },
    value(val) {
      if (!val) {
        this.getModel();
      }
    },
  },
  mounted() {
    this.getModel();
  },
  methods: {
    getModel() {
      if (this.showForm) {
        this.showForm = false;
        // 正在新增模型时，
        if (this.editItem && !this.editItem.sourceId) {
          this.activeIndex = -1;
          this.data.splice(0, 1);
          this.editItem = null;
        }
      }
      let params = {
        studioId: this.studioId,
      }
      if (this.fromText === 0) {
        params.deviceModelId = this.deviceModelId || sessionStorage.getItem('modelId')
      } else if (this.fromText === 1) {
        params.appId = this.deviceModelId
      } else if (this.fromText === 2) {
        params.appId = this.deviceModelId
      }
      if ((!params.deviceModelId && this.fromText === 0) || params.deviceModelId === 'null') {
        this.data = [];
        return;
      }
      if (this.fromText !== 0 && !params.appId) {
        this.data = [];
        return;
      }
      this.requestUtil.post(this.urls.getModelList.url, params).then(res => {
        if (res && res.returnObj.length > 0) {
          res.returnObj.forEach((item, index) => {
            item.index = index;
            item.dropdownVisible = false;
            item.editing = false;
            item.editName = item.modelName;
          });
          this.data = res.returnObj;
          this.hanldeItemClick(this.data[0], 0);
        } else {
          this.data = [];
          this.hanldeItemClick(null, -1);
        }
      });
    },
    editModel(item, isAddOrEdit = true, index = 0) {
      if (!this.canGoOn()) {
        return;
      }
      if (!item && isAddOrEdit) {
        item = {
          editing: true,
          sourceId: '',
          studioId: '',
          deviceModelId: this.deviceModelId,
          formula: '',
          viewContent: '',
          descript: '',
          modelName: '',
          editName: this.$t('model') + (this.data.length + 1),
        };
        this.data.unshift(item);
      }
      this.showForm = isAddOrEdit;
      this.editItem = item;
      this.setActiveIndex(index);
      this.$emit('on-edit', item);
    },
    hanldeItemClick(item, index) {
      this.editModel(item, false, index);
    },
    setActiveIndex(index) {
      if (this.activeIndex === index) {
        return;
      }
      this.activeIndex = index;
    },
    handleMouseover(index) {
      clearTimeout(this.$timeout);
      this.hoverIndex = index;
    },
    handleMouseout() {
      this.$timeout = setTimeout(() => {
        if (this.hoverIndex > 0 && !this.data[this.hoverIndex].dropdownVisible) {
          this.hoverIndex = -1;
        }
      }, 100);
    },
    showItemDropdown(visible) {
      if (visible) {
        this.visibleIndex = this.hoverIndex;
      }
      if (this.hoverIndex > 0) {
        const item = this.data[this.hoverIndex];
        item.dropdownVisible = visible;
        if (!visible && this.visibleIndex === item.index) {
          this.hoverIndex = -1;
        }
      }
    },
    handleRename(item, index) {
      if (!this.canGoOn()) {
        return;
      }
      item.editing = true;
      this.editModel(item, false, index);
      this.$nextTick(() => {
        setTimeout(() => {
          const input = this.$el.querySelector('li.active input');
          if (input) {
            input.select();
          }
        }, 10);
      });
    },
    handleDelete(item) {
      if (!this.canGoOn()) {
        return;
      }
      this.deleteItemId = item.sourceId;
      this.removeContent = this.$t('dataSource.confirmToDeleteModel', {name: item.modelName});
      this.showRemoveModal();
    },
    removeCallback() {
      this.requestUtil.delete(this.urls.addModelList.url + '/' + this.deleteItemId).then(() => {
        Message.success(this.$t('deleteSuccessfully'));
        this.getModel();
      });
    },
    saveRename(item) {
      // 新增不需要重命名
      if (!item.sourceId || this.loading) {
        return;
      }
      item.editing = false;
      if (!item.editName || item.editName === item.modelName) {
        item.editName = item.modelName;
        return;
      }
      this.loading = true;
      const data = {
        studioId: item.studioId,
        deviceTypeId: item.deviceTypeId,
        deviceModelId: item.deviceModelId,
        viewContent: item.viewContent,
        descript: item.descript,
        sourceId: item.sourceId,
        modelName: item.editName,
        formula: item.formula,
      };
      this.requestUtil.put(this.urls.addModelList.url, data).then(() => {
        Message.success(this.$t('dataSource.renameSuccessfully'));
        this.$store.commit('footerModelUpdata', true);
        item.modelName = item.editName;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="less">
.model-data-list {
  li {
    &.active {
      padding: 3px 6px;
      background-color: #3D91F7;

      .name {
        padding: 0;

        p {
          color: #fff;
        }

        .ivu-dropdown {
          top: -2px;
          right: -6px;
        }
      }
    }

    .more {
      display: block;
      width: 30px;
      height: 26px;
      background-image: url('../../assets/images/leftsidebar/more1_ic.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 16px auto;
    }

    .name {
      position: relative;
      padding: 3px 6px;
      line-height: 24px;

      p {
        margin-right: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
  
      .ivu-dropdown {
        position: absolute;
        display: none;
        top: 1px;
        right: 0;
      }

      &.hover {
        background-color: #3D91F7;

        p {
          color: #fff;
        }

        .ivu-dropdown {
          display: block;
        }
      }
    }

    & + li {
      margin-top: 1px;
    }
  }
}

.ivu-select-dropdown {
  &.model-data-dropdown {
    margin: 0;
    padding: 0;
    background: #F5F5F5;
    border-radius: 2px;
    box-shadow:0px 0px 10px 0px rgba(0, 0, 0, 0.3);
    animation: none !important;

    .ivu-dropdown-item {
      color: #252525;
      height: 24px;
      font-size: 14px !important;
      padding: 0 15px;
      line-height: 24px;

      &:hover {
        color: #fff;
        background-color: #3D91F7;
      }
    }
  }
}
</style>
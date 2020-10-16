<template>
  <data-column
    :title="title"
    :width="width"
  >
    <tree
      v-if="items && items.length > 0"
      class="params-tree"
      :data="items"
    />
    <no-data
      v-else
      :margin-top="-36"
    />
  </data-column>
</template>

<script>
import {Tree} from 'iview'
import DataColumn from './data-column'
import NoData from './nodata'
import columnCommon from './js/column-common'
import paramsCommon from './js/params-common'

export default {
  components: {
    Tree,
    DataColumn,
    NoData,
  },
  mixins: [columnCommon, paramsCommon],
  watch: {
    deviceModelId() {
      this.getData();
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getDeviceParamsCallback(res) {
      let data = null;
      if (res && res.length > 0) {
        data = {
          title: this.$t('dataSource.deviceParameter'),
          expand: true,
          children: [],
        };
        const obj = {};
        res.forEach(item => {
          let tree;
          let displayName = ''
          if(item.displayName) {
            displayName = `(${item.displayName})`
          }
          if (obj[item.partId]) {
            tree = obj[item.partId];
          } else {
            tree = {
              title: item.partName + displayName,
              partId: item.partId,
              expand: false,
              children: [],
            };
            obj[item.partId] = tree;
            data.children.push(tree);
          }
          tree.children.push({
            title: item.paramName + displayName,
            paramId: item.paramId,
            expand: false,
            children: [],
          });
        });
      }
      this.deviceParams = data;
    },
    getVirtualParamsCallback(res) {
      let data = null;
      if (res && res.length > 0) {
        data = {
          title: this.$t('dataSource.virtualParamter'),
          expand: true,
          children: [],
        };
        res.forEach(item => {
          let displayName = ''
          if(item.displayName) {
            displayName = `(${item.displayName})`
          }
          data.children.push({
            title: item.paramName + displayName,
            paramId: item.paramId,
            expand: false,
            children: [],
          });
        });
      }
      this.virtualParams = data;
    },
  },
};
</script>

<style lang="less">
.params-tree {
    padding: 5px 6px;

    li {
        position: relative;
    }

    .ivu-tree-arrow {
        position: absolute;
        left: 3px;
        top: 0;
    }

    .ivu-tree-title {
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    > .ivu-tree-children {
        > li {
            > .ivu-tree-title {
                padding-left: 22px;
                background:rgba(249,249,249,1);
                border: 1px solid rgba(204,204,204,1);
                border-radius: 2px;
            }
        }
    }

    ul {
        padding-top: 1px;

        li {
            position: relative;
            margin: 0;
            padding-top: 1px;
            line-height: 24px;
        }
    }

    .ivu-tree-arrow {
        i {
            font-size: 16px;
        }
    }

    li {
        overflow: hidden;

        ul {
            margin-top: 1px;

            .ivu-tree-title {
                margin-left: 22px;
            }
        }
    }
}
</style>
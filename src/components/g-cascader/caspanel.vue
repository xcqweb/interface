<template>
  <span>
    <ul
      v-if="data && data.length"
      style="min-width:160px;"
      class="yzqScrollStyle"
      :class="[prefixCls + '-menu']"
    >
      <Casitem
        v-for="(item,index) in data"
        :key="index"
        :prefix-cls="prefixCls"
        :data="item"
        :tmp-item="tmpItem"
        @click.native.stop="handleClickItem(item, $event)"
        @mouseenter.native.stop="handleHoverItem(item)"
      />
    </ul>
    <Caspanel
      v-if="sublist && sublist.length"
      :prefix-cls="prefixCls"
      :data="sublist"
      :disabled="disabled"
      :trigger="trigger"
      :change-on-select="changeOnSelect"
    />
  </span>
</template>
<script>
import Casitem from './casitem.vue';
import Emitter from './emitter';
import {findComponentUpward, findComponentDownward} from './assist';
export default {
    name: 'Caspanel',
    components: {Casitem},
    mixins: [ Emitter ],
    props: {
        data: {
            type: Array,
            default() {
                return [];
            },
        },
        disabled: Boolean,
        changeOnSelect: Boolean,
        trigger: String,
        prefixCls: String,
    },
    data() {
        return {
            tmpItem: {},
            result: [],
            sublist: [],
        };
    },
    watch: {
        data() {
            this.sublist = [];
        },
    },
    mounted() {
        this.$on('on-find-selected', (params) => {
            const val = params.value;
            const value = [...val];
            for (let i = 0; i < value.length; i++) {
                for (let j = 0; j < this.data.length; j++) {
                    if (value[i] === this.data[j].value) {
                        this.handleTriggerItem(this.data[j], true);
                        value.splice(0, 1);
                        this.$nextTick(() => {
                            this.broadcast('Caspanel', 'on-find-selected', {
                                value,
                            });
                        });
                        return false;
                    }
                }
            }
        });
        // deep for #1553
        this.$on('on-clear', (deep = false) => {
            this.sublist = [];
            this.tmpItem = {};
            if (deep) {
                const Caspanel = findComponentDownward(this, 'Caspanel');
                if (Caspanel) {
                    Caspanel.$emit('on-clear', true);
                }
            }
        });
    },
    methods: {
        isIcon(node) {
            const nodeName = (node.nodeName || '').toLocaleUpperCase();
            const isIvu = node.classList.contains('ivu-icon');
            if (nodeName === 'I' && isIvu) {
                return true;
            }
            return false;
        },
        handleClickItem(item, ev) {
            const isIcon = this.isIcon(ev.target);
            if (this.trigger !== 'click' && item.children && item.children.length) {
                return;  // #1922
            }
            this.handleTriggerItem(item, false, true, isIcon);
        },
        handleHoverItem(item) {
            if (this.trigger !== 'hover' || !item.children || !item.children.length) {
                return false;
            }
            this.handleTriggerItem(item, false, true, false);
        },
        //#6158 -- default fromInit = false to fromInit = true;
        handleTriggerItem(item, fromInit = true, fromUser = false, isIcon = false) {
            if (item.disabled) {
                return;
            }
            const cascader = findComponentUpward(this, 'GCascader');
            if (item.loading !== undefined && !item.children.length) {
                if (cascader && cascader.loadData) {
                    cascader.loadData(item, () => {
                        // todo
                        if (fromUser) {
                            cascader.isLoadedChildren = true;
                        }
                        if (item.children.length) {
                            this.handleTriggerItem(item);
                        }
                    });
                    return;
                }
            }
            // return value back recursion  // 向上递归，设置临时选中值（并非真实选中）
            const backItem = this.getBaseItem(item);
            // #5021 for this.changeOnSelect，加 if 是因为 #4472
            if (
                this.changeOnSelect ||
                    (backItem.label !== this.tmpItem.label || backItem.value !== this.tmpItem.value) ||
                    (backItem.label === this.tmpItem.label && backItem.value === this.tmpItem.value)
            ) {
                this.tmpItem = backItem;
                this.emitUpdate([backItem]);
            }

            if (item.children && item.children.length) {
                this.sublist = item.children;
                if (!isIcon) {
                    const obj = {
                        lastValue: false,
                        changeOnSelect: this.changeOnSelect,
                        fromInit,
                    };
                    this.dispatch('GCascader', 'on-result-change', obj);
                }
                // #1553
                if (this.changeOnSelect) {
                    const Caspanel = findComponentDownward(this, 'Caspanel');
                    if (Caspanel) {
                        Caspanel.$emit('on-clear', true);
                    }
                }
            } else {
                this.sublist = [];
                if (!isIcon) {
                    const obj = {
                        lastValue: true,
                        changeOnSelect: this.changeOnSelect,
                        fromInit,
                    };
                    this.dispatch('GCascader', 'on-result-change', obj);
                }
            }

            if (cascader) {
                cascader.$refs.drop.update();
            }
        },
        updateResult(item) {
            this.result = [this.tmpItem].concat(item);
            this.emitUpdate(this.result);
        },
        getBaseItem(item) {
            const backItem = Object.assign({}, item);
            if (backItem.children) {
                delete backItem.children;
            }

            return backItem;
        },
        emitUpdate(result) {
            if (this.$parent.$options.name === 'Caspanel') {
                this.$parent.updateResult(result);
            } else {
                this.$parent.$parent.updateResult(result);
            }
        },
    },
};
</script>

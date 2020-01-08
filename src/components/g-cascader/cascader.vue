<template>
  <div
    v-click-outside="handleClose"
    :class="classes"
    style="position:relative"
  >
    <div
      ref="reference"
      :class="[prefixCls + '-rel']"
      @click="toggleOpen"
    >
      <input
        type="hidden"
        :name="name"
        :value="currentValue"
      >
      <slot>
        <Input
          ref="input"
          :element-id="elementId"
          :readonly="!filterable"
          :disabled="disabled"
          :value="displayInputRender"
          :size="size"
          :placeholder="inputPlaceholder"
          @on-change="handleInput"
        />
        <div
          v-show="filterable && query === ''"
          :class="[prefixCls + '-label']"
          @click="handleFocus"
        >
          {{ displayRender }}
        </div>
        <Icon
          v-show="showCloseIcon"
          type="ios-close-circle"
          :class="[prefixCls + '-arrow']"
          @click.native.stop="clearSelect"
        />
        <Icon
          :type="arrowType"
          :custom="customArrowType"
          :size="arrowSize"
          :class="[prefixCls + '-arrow']"
        />
      </slot>
    </div>
    <transition name="transition-drop">
      <Drop
        v-show="visible"
        ref="drop"
        v-transfer-dom
        :class="{ [prefixCls + '-transfer']: transfer }"
        :data-transfer="transfer"
        :transfer="transfer"
        style="position: relative;box-shadow:0 1px 6px rgba(0,0,0,.2);background:#fff;z-index:1000000; will-change: top, left; transform-origin: center top; top: 32px; left: 0px;"
      >
        <div>
          <Caspanel
            v-show="!filterable || (filterable && query === '')"
            ref="caspanel"
            :prefix-cls="prefixCls"
            :data="data"
            :disabled="disabled"
            :change-on-select="changeOnSelect"
            :trigger="trigger"
          />
          <div
            v-show="filterable && query !== '' && querySelections.length"
            :class="[prefixCls + '-dropdown']"
          >
            <ul
              style="min-width:160px"
              :class="[selectPrefixCls + '-dropdown-list']"
            >
              <!--eslint-disable-->
              <li
                v-for="(item, index) in querySelections"
                :key="index"
                :class="[selectPrefixCls + '-item', {
                  [selectPrefixCls + '-item-disabled']: item.disabled
                }]"
                @click="handleSelectItem(index)"
                v-html="item.display"
              />
            </ul>
          </div>
          <ul
            v-show="(filterable && query !== '' && !querySelections.length) || !data.length"
            style="min-width:160px;"
            :class="[prefixCls + '-not-found-tip']"
          >
            <li>{{ localeNotFoundText }}</li>
          </ul>
        </div>
      </Drop>
    </transition>
  </div>
</template>
<script>
import {Input, Icon} from 'iview'
import Caspanel from './caspanel.vue'
import {directive as clickOutside} from 'v-click-outside-x'
import TransferDom from './transfer-dom'
import {oneOf} from './assist'
import Emitter from './emitter'
import Locale from './lacale'
import Drop from './dropdown.vue'

const prefixCls = 'ivu-cascader'
const selectPrefixCls = 'ivu-select'

export default {
    name: 'GCascader',
    components: {Caspanel, Drop,Input,Icon},
    directives: {clickOutside, TransferDom},
    mixins: [ Emitter, Locale ],
    props: {
        data: {
            type: Array,
            default() {
                return []
            }
        },
        value: {
            type: Array,
            default() {
                return []
            }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String
        },
        size: {
            validator(value) {
                return oneOf(value, ['small', 'large', 'default'])
            },
            default() {
                return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size
            }
        },
        trigger: {
            validator(value) {
                return oneOf(value, ['click', 'hover'])
            },
            default: 'click'
        },
        changeOnSelect: {
            type: Boolean,
            default: false
        },
        renderFormat: {
            type: Function,
            default(label) {
                return label.join(' / ')
            }
        },
        loadData: {
            type: Function
        },
        filterable: {
            type: Boolean,
            default: false
        },
        notFoundText: {
            type: String
        },
        transfer: {
            type: Boolean,
            default() {
                return !this.$IVIEW || this.$IVIEW.transfer === '' ? false : this.$IVIEW.transfer
            }
        },
        name: {
            type: String
        },
        elementId: {
            type: String
        }
    },
    data() {
        return {
            prefixCls,
            selectPrefixCls,
            visible: false,
            selected: [],
            tmpSelected: [],
            updatingValue: false, // to fix set value in changeOnSelect type
            currentValue: this.value,
            query: '',
            validDataStr: '',
            isLoadedChildren: false // #950
        }
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-show-clear`]: this.showCloseIcon,
                    [`${prefixCls}-size-${this.size}`]: !!this.size,
                    [`${prefixCls}-visible`]: this.visible,
                    [`${prefixCls}-disabled`]: this.disabled,
                    [`${prefixCls}-not-found`]: this.filterable && this.query !== '' && !this.querySelections.length
                }
            ]
        },
        showCloseIcon() {
            return this.currentValue && this.currentValue.length && this.clearable && !this.disabled
        },
        displayRender() {
            const label = []
            for (var j = 0; j < this.selected.length; j++) {
                label.push(this.selected[j].label)
            }
            return this.renderFormat(label, this.selected)
        },
        displayInputRender() {
            return this.filterable ? '' : this.displayRender
        },
        localePlaceholder() {
            if (this.placeholder === undefined) {
                return this.t('i.select.placeholder')
            } else {
                return this.placeholder
            }
        },
        inputPlaceholder() {
            return this.filterable && this.currentValue.length ? null : this.localePlaceholder
        },
        localeNotFoundText() {
            if (this.notFoundText === undefined) {
                return this.t('i.select.noMatch')
            } else {
                return this.notFoundText
            }
        },
        querySelections() {
            let selections = []
            function getSelections(arr, label, value) {
                for (let i = 0; i < arr.length; i++) {
                    const item = arr[i]
                    item.__label = label ? label + ' / ' + item.label : item.label
                    item.__value = value ? [...value, item.value] : [item.value]
                    if (item.children && item.children.length) {
                        getSelections(item.children, item.__label, item.__value)
                        delete item.__label
                        delete item.__value
                    } else {
                        selections.push({
                            label: item.__label,
                            value: item.__value,
                            display: item.__label,
                            item,
                            disabled: !!item.disabled
                        })
                    }
                }
            }
            getSelections(this.data)
            selections = selections.filter(item => {
                return item.label ? item.label.toLocaleLowerCase().indexOf(this.query.toLocaleLowerCase()) > -1 : false
            }).map(item => {
                let index = item.display.search(new RegExp(this.query, 'i'))
                let targetStr = item.display.substr(index,this.query.length)
                if(index != -1) {
                    item.display = item.display.replace(new RegExp(targetStr), `<span>${targetStr}</span>`)
                }
                return item
            })
            return selections
        },
        // 3.4.0, global setting customArrow 有值时，arrow 赋值空
        arrowType() {
            let type = 'ios-arrow-down'
            if (this.$IVIEW) {
                if (this.$IVIEW.cascader.customArrow) {
                    type = ''
                } else if (this.$IVIEW.cascader.arrow) {
                    type = this.$IVIEW.cascader.arrow
                }
            }
            return type
        },
        // 3.4.0, global setting
        customArrowType() {
            let type = ''
            if (this.$IVIEW) {
                if (this.$IVIEW.cascader.customArrow) {
                    type = this.$IVIEW.cascader.customArrow
                }
            }
            return type
        },
        // 3.4.0, global setting
        arrowSize() {
            let size = ''
            if (this.$IVIEW) {
                if (this.$IVIEW.cascader.arrowSize) {
                    size = this.$IVIEW.cascader.arrowSize
                }
            }
            return size
        }
    },
    watch: {
        visible(val) {
            if (val) {
                if (this.currentValue.length) {
                    this.updateSelected()
                }
                if (this.transfer) {
                    this.$refs.drop.update()
                }
                this.broadcast('Drop', 'on-update-popper')
            } else {
                if (this.filterable) {
                    this.query = ''
                    this.$refs.input.currentValue = ''
                }
                if (this.transfer) {
                    this.$refs.drop.destroy()
                }
                this.broadcast('Drop', 'on-destroy-popper')
            }
            this.$emit('on-visible-change', val)
        },
        value(val) {
            this.currentValue = val
            if (!val.length) {
                this.selected = []
            }
        },
        currentValue() {
            this.$emit('input', this.currentValue)
            if (this.updatingValue) {
                this.updatingValue = false
                return
            }
            this.updateSelected(true)
        },
        data: {
            deep: true,
            handler() {
                const validDataStr = JSON.stringify(this.getValidData(this.data))
                if (validDataStr !== this.validDataStr) {
                    this.validDataStr = validDataStr
                    if (!this.isLoadedChildren) {
                        this.$nextTick(() => this.updateSelected(false, this.changeOnSelect))
                    }
                    this.isLoadedChildren = false
                }
            }
        }
    },
    created() {
        this.validDataStr = JSON.stringify(this.getValidData(this.data))
        this.$on('on-result-change', (params) => {
            // lastValue: is click the final val
            // fromInit: is this emit from update value
            const lastValue = params.lastValue
            const changeOnSelect = params.changeOnSelect
            const fromInit = params.fromInit
            if (lastValue || changeOnSelect) {
                const oldVal = JSON.stringify(this.currentValue)
                this.selected = this.tmpSelected
                const newVal = []
                this.selected.forEach((item) => {
                    newVal.push(item.value)
                })

                if (!fromInit) {
                    this.updatingValue = true
                    this.currentValue = newVal
                    this.emitValue(this.currentValue, oldVal)
                }
            }
            if (lastValue && !fromInit) {
                this.handleClose()
            }
        })
    },
    mounted() {
        this.updateSelected(true)
    },
    methods: {
        clearSelect() {
            if (this.disabled) {
                return false
            }
            const oldVal = JSON.stringify(this.currentValue)
            this.currentValue = this.selected = this.tmpSelected = []
            this.handleClose()
            this.emitValue(this.currentValue, oldVal)
            //                this.$broadcast('on-clear');
            this.broadcast('Caspanel', 'on-clear')
        },
        handleClose() {
            this.visible = false
        },
        toggleOpen() {
            if (this.disabled) {
                return false
            }
            if (this.visible) {
                if (!this.filterable) {
                    this.handleClose()
                }
            } else {
                this.onFocus()
            }
        },
        onFocus() {
            this.visible = true
            if (!this.currentValue.length) {
                this.broadcast('Caspanel', 'on-clear')
            }
        },
        updateResult(result) {
            this.tmpSelected = result
        },
        updateSelected(init = false, changeOnSelectDataChange = false) {
            // #2793 changeOnSelectDataChange used for changeOnSelect when data changed and set value
            if (!this.changeOnSelect || init || changeOnSelectDataChange) {
                this.broadcast('Caspanel', 'on-find-selected', {
                    value: this.currentValue
                })
            }
        },
        emitValue(val, oldVal) {
            if (JSON.stringify(val) !== oldVal) {
                this.$emit('on-change', this.currentValue, JSON.parse(JSON.stringify(this.selected)))
                this.$nextTick(() => {
                    this.dispatch('FormItem', 'on-form-change', {
                        value: this.currentValue,
                        selected: JSON.parse(JSON.stringify(this.selected))
                    })
                })
            }
        },
        handleInput(event) {
            this.query = event.target.value
        },
        handleSelectItem(index) {
            const item = this.querySelections[index]
            if (item.item.disabled) {
                return false
            }
            this.query = ''
            this.$refs.input.currentValue = ''
            const oldVal = JSON.stringify(this.currentValue)
            this.currentValue = item.value
            // use setTimeout for #4786, can not use nextTick, because @on-find-selected use nextTick
            setTimeout(() => {
                this.emitValue(this.currentValue, oldVal)
                this.handleClose()
            }, 0)
        },
        handleFocus() {
            this.$refs.input.focus()
        },
        // 排除 loading 后的 data，避免重复触发 updateSelect
        getValidData(data) {
            function deleteData(item) {
                const newItem = Object.assign({}, item)
                if ('loading' in newItem) {
                    delete newItem.loading
                }
                if ('__value' in newItem) {
                    delete newItem.__value
                }
                if ('__label' in newItem) {
                    delete newItem.__label
                }
                if (Array.isArray(newItem.children) && newItem.children.length) {
                    newItem.children = newItem.children.map(i => deleteData(i))
                }
                return newItem
            }
            return data.map(item => deleteData(item))
        }
    }
}
</script>

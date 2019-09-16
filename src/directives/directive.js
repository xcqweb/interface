import Vue from 'vue'

function deal(el, isVisible) {
    if (isVisible.value) {
        el.style.visibility = "visible"
    } else {
        el.style.visibility = "hidden"
    }
}

Vue.directive('visible', {
    update: function(el, isVisible) {
        deal(el, isVisible)
    },
    inserted: function(el, isVisible) {
        deal(el, isVisible)
    }
})
Vue.directive('clickOutSide', {
    bind: function(el, {value}) {
        let clickOutside = value
        el.handler = function(e) {

            if (el && !el.contains(e.target)) {
                clickOutside(e)
            }
        }
        document.addEventListener('click', el.handler, true)
    },
    unbind: function(el) {
        document.removeEventListener('click', el.handler, true)
        el.handler = null
    }
})
/** 
 * 限制只能输入数字
 * eg: v-number.minus="2" 允许负数，最多输入两位小数
 * 值表示允许输入几位小数，为空时表示不限制小数位数
 * 修饰符minus表示是否允许负数，默认为false
 * 
*/
Vue.directive('number', {
    bind: function(el, {value, modifiers}, vNode) {
        let decimal = value;
        const minus = !!modifiers.minus;
        const isempty = val => val === '' || val === null || val === undefined;
        const tonumber = function(val) {
            if (!isempty(val)) {
                val = val.toString().replace(new RegExp('[a-zA-Z,]', 'g'), '');
                let regx = null;
                if (isempty(decimal)) {
                    regx = new RegExp(minus ? '(\\-\\d*|\\d+)(\\.\\d*)?' : '(\\d+)(\\.\\d*)?');
                } else if (decimal === 0) {
                    regx = new RegExp(minus ? '(\\-\\d*|\\d+)' : '(\\d+)');
                } else {
                    decimal = Math.abs(decimal);
                    regx = new RegExp(minus ? '(\\-\\d*|\\d+)(\\.\\d{0,' + decimal + '})?' : '(\\d+)(\\.\\d{0,' + decimal + '})?');
                }
                val = val.match(regx);
                // 替换前置0 如：01.2122 或 -01.12类数字
                val = val ? (minus ? val[0].replace(new RegExp('^(\\-?)(0*)(\\d+)'), '$1$3') : val[0].replace(new RegExp('^(0*)(\\d+)'), '$2')) : '';
            }
            return val;
        };
        el.handler = function(e) {
            const val = tonumber(e.target.value);
            if (vNode.componentInstance) {
                vNode.componentInstance.$emit('input', val);
            } else {
                e.target.value = val;
                el.dispatchEvent(new Event('input'));
            }
        };

        el.addEventListener('keyup', el.handler, true);
    },
    unbind: function(el) {
        el.removeEventListener('keyup', el.handler, true);
        el.handler = null;
    }
})
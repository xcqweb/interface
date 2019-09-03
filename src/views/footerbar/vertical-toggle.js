const elTransition = '0.3s height linear, 0.3s padding-top linear, 0.3s padding-bottom linear'
const Transition = {
    'before-enter'(el) {
    // console.log(el)
        el.style.transition = elTransition
        if (!el.dataset) {el.dataset = {}}

        el.dataset.oldPaddingTop = el.style.paddingTop
        el.dataset.oldPaddingBottom = el.style.paddingBottom

        el.style.height = 0
        el.style.paddingTop = 0
        el.style.paddingBottom = 0
    },

    'enter'(el) {
        el.dataset.oldOverflow = el.style.overflow
        if (el.scrollHeight !== 0) {
            el.style.width = '100' + '%'
            el.style.height = 200 + 'px'
            el.style.paddingTop = el.dataset.oldPaddingTop
            el.style.paddingBottom = el.dataset.oldPaddingBottom
        } else {
            el.style.width = '100' + '%'
            el.style.height = ''
            el.style.paddingTop = el.dataset.oldPaddingTop
            el.style.paddingBottom = el.dataset.oldPaddingBottom
        }

        el.style.overflow = 'hidden'
    },

    'after-enter'(el) {
    // console.log(el)
        el.style.transition = ''
        el.style.height = ''
        el.style.overflow = el.dataset.oldOverflow
    },

    'before-leave'(el) {
    // console.log(el)
        if (!el.dataset) {el.dataset = {}}
        el.dataset.oldPaddingTop = el.style.paddingTop
        el.dataset.oldPaddingBottom = el.style.paddingBottom
        el.dataset.oldOverflow = el.style.overflow

        el.style.height = 200 + 'px'
        el.style.overflow = 'hidden'
    },

    'leave'(el) {
        if (el.scrollHeight !== 0) {
            el.style.transition = elTransition
            el.style.height = 0
            el.style.paddingTop = 0
            el.style.width = '100' + '%'
            el.style.paddingBottom = 0
        }
    },

    'after-leave'(el) {
        el.style.transition = ''
        el.style.height = ''
        el.style.overflow = el.dataset.oldOverflow
        el.style.paddingTop = el.dataset.oldPaddingTop
        el.style.paddingBottom = el.dataset.oldPaddingBottom
    }
}

export default {
    name: 'VerticalToggle',
    functional: true,
    render(h, {
        children
    }) {
        const data = {
            on: Transition
        }
        return h('transition', data, children)
    }
}
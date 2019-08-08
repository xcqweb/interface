
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import {getCookie} from '../../services/Utils';
import en from './language/en';
import zh from './language/zh';

Vue.use(VueI18n);



export const i18n = new VueI18n({
    locale: getCookie('language') ? getCookie('language') : 'zh',
    messages: {
        en: {
            ...en,
        },
        zh: {
            ...zh,
        },
    },

});


import {Message} from 'iview'

export default {
    methods: {
        // 判断数据模型是否在编辑
        canGoOn() {
            if (this.$store.state.main.modelEditing) {
                if (!this.$_showingEditMessage) {
                    this.$_showingEditMessage = true;
                    Message.warning(this.$t('dataSource.haveUnsavedModels'));
                    setTimeout(() => {
                        this.$_showingEditMessage = false;
                    }, 1.5 * 1000);
                }
                return true;
            }
            return false;
        },
        
    },
};

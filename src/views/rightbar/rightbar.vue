<template>
  <div class="geSidebarContainer geRightBarContainer">
    <div class="geSidebarContainer geFormatContainer" />
    <div class="geSidebarContainer gePaletteManageContainer" />
    <div
      id="rightbarShortcut"
      class="rightbarShortcut"
    />
  </div>
</template>
<script>
export default {
    components: {},
    props: [""],
    data() {
        return {
            /*  leftBar: [
                {
                    text: "文字",
                    icon: require("@/assets/images/menu/rightBar/text_ic.png")
                },
                {
                    text: "矩形",
                    icon: require("@/assets/images/menu/rightBar/rectangle_ic.png")
                },
                {
                    text: "椭圆",
                    icon: require("@/assets/images/menu/rightBar/oval_ic.png")
                },
                {
                    text: "直线",
                    icon: require("@/assets/images/menu/rightBar/line_ic.png")
                },
                {
                    text: "按钮",
                    icon: require("@/assets/images/menu/rightBar/btn_ic.png")
                },
                {
                    text: "表格",
                    icon: require("@/assets/images/menu/rightBar/form_ic.png")
                },
                {
                    text: "图片",
                    icon: require("@/assets/images/menu/rightBar/bg_ic.png")
                }
            ] */
        };
    },
    created() {},
    mounted() {
    },
    methods: {
        
    }
};
</script>

<style lang="less">
.geRightBarContainer {
    align-items: flex-end;
    .rightbarShortcut {
        font-size: 12px;
        position: absolute;
        box-sizing: border-box;
        top: 0;
        left: 0;
        height: 100%;
        width: 40px;
        border-right: 1px solid #ccc;
        border-left: 1px solid #ccc;
        .geSidebar{
            padding: 0;
        }
        a{
            padding: 0 !important;
            width: auto !important;
            height: 45px !important;
            background-size:22px 22px;
            background-position: top center;
            svg{
                height: 21px !important;
            }
        }
        /* .shortcutItem {
            text-align: center;
            height: 32px;
            margin-top: 15px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            cursor: pointer;
            &:last-child {
                background-size: 23px 16px !important;
            }
        } */
    }
    .geFormatContainer {
        width: 210px !important;
    }
    .gePaletteManageContainer {
        width: 210px !important;
    }
}
</style>

/**
 * 获取控件样式
 */
class GetNodeInfo {
    constructor(node) {
        this.node = node
        this.styles = this.node.getAttribute('style')
    }

    getStyles(key) {
        let reg = new RegExp(key + '=(.+?);')
        let execStr = reg.exec(this.styles);
        return execStr ? execStr[1] : '';
    }
}

export default GetNodeInfo
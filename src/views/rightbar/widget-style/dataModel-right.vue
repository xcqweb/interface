<template>
  <div class="datamodel-right-wrap">
    <dataRightColum
      :title="titleArr[0]"
      :widthlen="widthlenArr[0]"
      :showtitle="showtitleArr[0]"
    >
      <div class="dataSource-right-content">
        4
      </div>
    </dataRightColum>
    <dataRightColum
      :title="titleArr[1]"
      :widthlen="widthlenArr[1]"
      :showtitle="showtitleArr[1]"
    >
      <div class="dataSource-right-content">
        5
      </div>
    </dataRightColum>
    <dataRightColum
      :title="titleArr[2]"
      :widthlen="widthlenArr[2]"
      :showtitle="showtitleArr[2]"
    >
      <div class="dataSource-right-content">
        描述
      </div>
    </dataRightColum>
  </div>
</template>

<script>
import dataRightColum from './data-rightcolum'
export default {
    components: {
        dataRightColum
    },
    data() {
        return {
            titleArr:['设备类型','参数列表',''],
            widthlenArr: [200,200,652],
            showtitleArr: [true, true, false]
        }
    }
}
</script>
<style lang="less" scoped>
.datamodel-right-wrap{
    height:100%;
    display:flex;
}
</style>
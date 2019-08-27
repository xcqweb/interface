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
        <div class="dataSource-addModel add-condition">
          <span 
            @click.stop.prevent="addModelHandle"
          >
            {{ addModelText }}
          </span>
        </div>
      </div>
    </dataRightColum>
    <dataRightColum
      :title="titleArr[2]"
      :widthlen="widthlenArr[2]"
      :showtitle="showtitleArr[2]"
    >
      <div 
        class="dataSource-right-content" 
        style="padding-top:0px;display:flex;flex-direction: column"
      >
        <div class="dataSource-title">
          {{ descript }}
        </div>
        <div class="textare-wrap">
          <Input 
            v-model="textareValue" 
            type="textarea" 
            :placeholder="descriptText"
            :autosize="{maxRows: 3,minRows: 3}" 
          />
        </div>
        <div class="dataSource-title">
          {{ condition }}
        </div>
        <div class="dataSource-conditioncontent-wrap">
          <div class="dataSource-condition-content">
            <div class="add-condition">
              <span
                @click.stop.prevent="addConditionHandle"
              >
                {{ addConditionText }}
              </span>
            </div>
          </div>
        </div>
        <div class="dataSource-condition-bottom">
          <Button
            type="primary"
            size="small"
            @click.stop.prevent="saveModelHandle"
          >
            {{ saveModelText }}
          </Button>
        </div>
      </div>
    </dataRightColum>
  </div>
</template>

<script>
import dataRightColum from './data-rightcolum'
import {Input, Button} from 'iview'
export default {
    components: {
        dataRightColum,
        Input,
        Button,
    },
    data() {
        return {
            titleArr:['设备类型','参数列表',''],
            widthlenArr: [200,200,652],
            showtitleArr: [true, true, false],
            descript: '描述',
            descriptText: '描述内容',
            textareValue: '',
            condition: '条件',
            saveModelText:'保存模型',
            addConditionText: '添加条件',
            addModelText: '添加模型'
        }
    },
    methods: {
        saveModelHandle() {
            console.log('保存为模型')
        },
        addConditionHandle() {
            console.log('添加条件')
        },
        addModelHandle() {
            console.log('添加模型')
        }
    }
}
</script>
<style lang="less" scoped>
.datamodel-right-wrap{
    height:100%;
    display:flex;
    .dataSource-right-content{
      .dataSource-title{
        height:36px;
        line-height: 4;
        padding-left:10px;
      }
      .textare-wrap{
        height:77px;
        padding:10px 10px 0;
      }
      .dataSource-conditioncontent-wrap{
        flex:1;
        padding:10px 10px 0;
        .dataSource-condition-content{
          height:100%;
          border: 1px dashed #D4D4D4;
          border-radius: 2px;
          padding: 10px;
        }
      }
      .dataSource-condition-bottom{
        height: 60px;
        padding:0 10px;
        text-align: right;
        padding-top:16px;
      }
      .add-condition{
        height:24px;
        width: 80px;
        span{
          display:block;
          padding-left: 16px;
          height:24px;
          line-height: 22px;
          box-sizing: border-box;
          background:url('../../assets/images/leftsidebar/addpage.png') no-repeat left center;
          background-size: 16px 16px; 
          border:1px solid #CCCCCC;
          border-radius: 2px;
          cursor: pointer;
        }
        &.dataSource-addModel{
          width: 90px;
          padding-left: 10px;
          span{
            border:none;
            line-height: 24px;
          }
        }
      }
    }
}
</style>
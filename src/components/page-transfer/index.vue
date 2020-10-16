<template>
  <div class="standard-modal add-modal">
    <div class="content-transfer">
      <!-- 全部 -->
      <div class="left">
        <p class="checkAll">
          <Checkbox 
            v-model="allCheck" 
            :disabled="allData.length === 0 || allDis" 
            @on-change="allCheckChange"
          >
            {{ leftTitle }} ({{ comNum }})
          </Checkbox>
        </p>
        <div class="white">
          <Input 
            v-model="leftKeyword"
            :placeholder="inputHolder"
            :clearable="true"
            size="small"
            @on-clear="inputSearch('all')" 
            @on-change="inputSearch('all')"
          />
          <div class="data-wrap scrollbarStyle">
            <CheckboxGroup 
              v-model="leftCheckModal" 
              @on-change="leftCheckModalChange"
            >
              <div 
                v-for="item in allData"
                :key="item.id"
                class="data-item"
              >
                <Checkbox
                  :label="item.id" 
                  :disabled="item.disabled"
                >
                  <Tooltip 
                    placement="right" 
                    theme="light"
                    class="tooltip-width-inner"
                    transfer
                  >
                    <div slot="content">
                      <p 
                        style="line-height: 22px;text-align:left;white-space:normal"
                      >
                        设备名称:{{ item.name }}
                      </p>
                      <p
                        style="line-height: 22px;text-align:left;white-space:normal"
                      >
                        设备编号:{{ item.serialNumber }}
                      </p>
                      <p
                        style="line-height: 22px;text-align:left;white-space:normal"
                      >
                        设备位置:{{ item.locationNamePath }}
                      </p>
                    </div>
                    <slot name="leftItem">
                      &nbsp;&nbsp;{{ item.name }}
                    </slot>
                  </Tooltip>
                </Checkbox>
              </div>
            </CheckboxGroup>
          </div>
        </div>
      </div>
      <div class="middel">
        <Button 
          type="default"
          size="small"
          style="margin-bottom:12px"
          @click="del"
        >
          <Icon type="ios-arrow-back" />
        </Button>        
        <Button 
          type="default"
          size="small"
          @click="add"
        >
          <Icon type="ios-arrow-forward" />
        </Button>
      </div>
      <!-- 已选 -->
      <div class="right">
        <p class="checkAll">
          <Checkbox
            v-model="checkRight"
            :disabled="checkData.length === 0"
            @on-change="rightCheckChange"
          >
            {{ rightTitle }} ({{ checkData.length }})
          </Checkbox>
        </p>
        <div class="white">
          <Input
            v-model="rightKeyword" 
            :placeholder="inputHolder"
            :clearable="true" 
            size="small"
            @on-change="inputSearch('right')"
          />
          <div class="data-wrap scrollbarStyle">
            <CheckboxGroup 
              v-model="rightCheckModal" 
              @on-change="rightCheckModalChange"
            >
              <div 
                v-for="item in checkData" 
                :key="item.id"
                class="data-item" 
              >
                <Checkbox 
                  :label="item.id"
                >
                  <Tooltip 
                    placement="right" 
                    theme="light"
                    class="tooltip-width-inner"
                    transfer
                  >
                    <div slot="content">
                      <p 
                        style="line-height: 22px;text-align:left;white-space:normal"
                      >
                        设备名称:{{ item.name }}
                      </p>
                      <p
                        style="line-height: 22px;text-align:left;white-space:normal"
                      >
                        设备编号:{{ item.serialNumber }}
                      </p>
                      <p
                        style="line-height: 22px;text-align:left;white-space:normal"
                      >
                        设备位置:{{ item.locationNamePath }}
                      </p>
                    </div>
                    <slot 
                      name="rightItem"
                    >
                      &nbsp;&nbsp;{{ item.name }}
                    </slot>
                  </Tooltip>
                </Checkbox>
              </div>
            </CheckboxGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {Button, CheckboxGroup, Checkbox, Input, Icon, Tooltip} from 'iview'
export default {
  components: {
    Button,
    CheckboxGroup,
    Checkbox,
    Input,
    Icon,
    Tooltip
  },
  props:{
    title:String,
    leftTitle:String,
    rightTitle:String,
    inputHolder:String,
    apiMethods:String,
    elseParams:Object,
    pageSizeParams:String,
    currentPageParams:String,
    dealData:Function,
    keyword:String,
    visible:Boolean,
    selectDatas:Array,
    paramsStr: String,
  },
  data() {
    return {
      showModal:false,
      checkAll: false,
      userDataModel: [],
      leftCheckModal: [],
      pageSize:10000,
      recordsTotal: 0,
      currentPage: 1,
      rightCheckModal: [],
      allCheck: false,
      allDis: false,
      checkRight: false,
      checkData: [],
      checkDataBk: [],
      allData:[],
      leftKeyword: '',
      rightKeyword: '',
    };
  },
  computed: {
    comNum() {
      let num = 0;
      for (const key of this.allData) {
        for (const item of this.leftCheckModal) {
          if (key.id === item) {
            num++;
            break;
          }
        }
      }
      return num;
    },
  },
  watch:{
    elseParams: {
      handler(val) {
        if (val[this.paramsStr]) {
          this.loadData()
        } else {
          this.allData = []
        }
      },
      deep: true,
      immediate: true,
    },
    visible: {
      handler(val) {
        if (val) {
          this.init()
        }
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    init() {
      this.leftKeyword = this.rightKeyword = '';
      this.allCheck = this.checkRight = false;
      this.rightCheckModal = this.leftCheckModal = [];
      this.checkData = [];
      this.checkDataBk = [];
    },
    loadData(keyword = "") {
      let params = {};
      params[this.pageSizeParams] = this.pageSize;
      params[this.currentPageParams] = this.currentPage;
      params[this.keyword] = keyword;
      params = Object.assign(params,this.elseParams);
      this.requestUtil.post(this.apiMethods, params).then(res => {
        this.allData = [];
        res.records.forEach(item=>{
          const temp = this.dealData(item)
          temp.disabled = false;
          this.allData.push(temp)
        });
        this.recordsTotal = res.total;
                
        this.leftCheckModal = this.selectDatas.concat(this.checkDataBk).map(item=>{
          return item.id;
        });
        for(const key of this.selectDatas.concat(this.checkDataBk)) {
          for(const item of this.allData) {
            if(key.id === item.id) {
              item.disabled = true;
              break;
            }
          }
        }
        this.chechAll();
      });
    },
    //刷新提示
    refreshHandler(e) {
      e.returnValue = this.$t('sureLeavePage');
      return;
    },
    leftCheckModalChange(data) {
      data.length < this.pageSize ? (this.allCheck = false) : (this.allCheck = true);
    },
    rightCheckModalChange(data) {
      data.length < this.checkData.length ? (this.checkRight = false) : (this.checkRight = true);
    },
    allCheckChange(val) {
      if (val) {
        this.leftCheckModal = this.allData.concat(this.selectDatas, this.checkDataBk).map( (item) => {
          return item.id;
        });
        this.leftCheckModal = [...new Set(this.leftCheckModal)];
      }else{
        this.leftCheckModal = [];
      }
    },
    rightCheckChange(val) {
      if (val) {
        this.rightCheckModal = this.checkData.map( (item) => {
          return item.id;
        });
      }else{
        this.rightCheckModal = [];
      }
    },
    //选中和禁用已选
    chechAll() {
      const re = this.allData.every( (item) => {
        return this.leftCheckModal.includes(item.id);
      });
      if (re && this.allData.length) {
        this.allCheck = true;
        this.allDis = true;
      }else{
        this.allCheck = false;
        this.allDis = false;
      }
    },
    repeatArrayObject(arr) {
      const mp = new Map();
      for (const key of arr) {
        mp.set(key.id, key);
      }
      return [...mp.values()];
    },
    add() {
      this.rightKeyword = '';
      const arr = [];
      this.allData.forEach( (item) => {
        if (this.leftCheckModal.includes(item.id) && !item.disabled) {
          arr.push(item);
        }
      });
      const resultArr = arr.concat(this.checkData);
      this.checkData = this.repeatArrayObject(resultArr);
      for (const key of this.allData) {
        for (const item of this.leftCheckModal) {
          if (key.id === item) {
            key.disabled = true;
            break;
          }
        }
      }
      this.chechAll();
      this.checkDataBk = this.repeatArrayObject(this.checkData.concat(this.checkDataBk));
      this.rightCheckModal.length < this.checkData.length ? (this.checkRight = false) : (this.checkRight = true);
      this.$emit('chooseData',this.checkDataBk);
    },
    del() {
      this.checkDataBk = this.checkDataBk.filter( (item) => {
        return !this.rightCheckModal.includes(item.id);
      });
      this.checkData = this.checkData.filter( (item) => {
        return !this.rightCheckModal.includes(item.id);
      });
      for (const key of this.allData) {
        for (const item of this.rightCheckModal) {
          if (key.id === item) {
            key.disabled = false;
            break;
          }
        }
      }
      this.leftCheckModal = this.checkDataBk.map( (item) => {
        return item.id;
      });
      //模糊搜索
      this.checkDataBk = this.repeatArrayObject(this.checkData.concat(this.checkDataBk));
      this.rightCheckModal = [];
      this.chechAll();
      this.checkRight = false;
      this.$emit('chooseData',this.checkDataBk);
    },
    show() {
      this.showModal = true;
    },
    modalChange(flag) {
      this.$emit('update:visible',flag);
    },
    cancel() {
      this.showModal = false; 
    },
    //提交
    confirm() {
      this.showModal = false;
      this.$emit('chooseData',this.checkDataBk);
    },
    changePageIndex(page) {
      this.currentPage = page;
      this.allCheck = false; 
      this.loadData();
    },
    //搜索
    inputSearch(type) {
      if(type === "all") {
        this.loadData(this.leftKeyword, 1);
      } else {
        if(this.rightKeyword) {
          this.checkData = this.checkDataBk.filter(item=>{
            return item.name.includes(this.rightKeyword);
          });
        } else {
          this.checkData = this.checkDataBk;
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
    /deep/.ivu-input-group-append{
        .ivu-btn-icon-only{
            display: flex;
            justify-content: center;
            .ivu-icon-ios-search{
                font-size: 16px;
            }
        }
    }
    .add-modal{
        /deep/.tooltip-width-inner{
        background: #fff !important;
        .ivu-tooltip-popper {
          .ivu-tooltip-inner-with-width{
            white-space: normal !important
          }
        }
      }
        margin-left: 12px;
        /deep/.addFooter{
            .ivu-btn{
                &>span{
                    font-size: 16px;
                }
            }
            .ivu-btn:nth-child(2){
                &>span{
                    color: #3B72A8;
                }
            }
        }
        /deep/.ivu-modal-body{
            padding: 24px 42px;
        }
        .content-transfer{
            display: flex;
            .middel{
                width: 84px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
            .right{
                .data-wrap{
                    height:calc(378px - 75px) !important;
                }
            }
            .left, .right{
                width: 200px;
                border: 1px solid #DCE5E8;
                border-radius: 4px 4px 0 0;
                height: 378px;
                position: relative;
                padding: 12px;
                background-color: #fff;
                padding-top: 34px;
                .data-wrap{
                    overflow: auto;
                    height:calc(378px - 75px);
                    .data-item {
                        margin: 5px 0;
                        img {
                            border-style: none;
                            height: 16px;
                            width: 16px;
                            margin-right: 2px;
                        }
                        /deep/.ivu-checkbox-group-item {
                            display: flex;
                        }
                        /deep/.ivu-checkbox-wrapper {
                            margin-right: 0;
                            display: flex;
                            align-items: center;
                        }
                        .con-wrap {
                            width: 100%;
                            display: flex;
                            margin-left: 5px;
                            margin-top: -2px;
                            font-size: 14px;
                        }
                        .username {
                            margin-right: 2px;
                            color: #0F1517;
                        }
                        .job-number {
                            color: #b9b9b9;
                        }
                        .group{
                            flex: 1;
                            text-align: right;
                            color: #999;
                            margin-right: 16px;
                        }
                        /deep/.ivu-checkbox-inner {
                            top: 2px;
                        }
                        /deep/.ivu-input-wrapper {
                            height: 24px;
                        }
                    }
                }
                
                .page-foot {
                    position: absolute;
                    left: 12px;
                    bottom: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .ivu-page-prev,
                    .ivu-page-next,
                    .ivu-page-item-jump-prev,
                    .ivu-page-item-jump-next {
                        min-width: 22px;
                    }
                    /deep/.ivu-page-simple .ivu-page-simple-pager {
                        margin-right: 0;
                        input {
                            margin: 0;
                            width: 36px;
                            height: 20px;
                        }
                    }
                    .recordsTotal {
                        line-height: 23px;
                        color: #666;
                    }
                }
                .checkAll{
                    position: absolute;
                    width: 100%;
                    background: #EBF2F9;
                    top: 0;
                    left: 0;
                    height: 24px;
                    line-height: 24px;
                    background: linear-gradient(0deg, #d8d8d8 0%, #e4e3e4 100%);
                    border-radius: 4px 4px 0 0;
                    padding-left: 10px;
                    /deep/.ivu-checkbox-wrapper{
                        color: #0F1517;
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>
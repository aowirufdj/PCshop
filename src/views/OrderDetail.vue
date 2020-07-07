<template>

  <div class="oneMessage">
    <div class="head">
      <div class="orderNum">
        <span>订单号:</span>
        <span>{{orderMessage.order_sn}}</span>
      </div>
    </div>
    <el-steps :active="progressNow" finish-status="success" class="progress" align-center>
      <el-step title="选择商品"></el-step>
      <el-step title="确认下单"></el-step>
      <el-step title="付款"></el-step>
      <el-step title="发货"></el-step>
      <el-step title="运输"></el-step>
      <el-step title="签收完成"></el-step>
    </el-steps>
    <div class="deliverbd"></div>
    <div class="deliver">
      <p>收货地址:</p>
      <div>
        <p class="name">{{orderMessage.address_realname}}</p>
        <p class="phone">{{orderMessage.address_tel_phone}}</p>
        <p>{{orderMessage.address_area_info}}</p>
      </div>
    </div>
    <div class="deliverbd"></div>
    <div>
      <div class="itemBox" v-for="(it,j) in orderMessage.order_goods">
        <img :src="$host + it.good_pic_url" alt="">
        <div class="itemcontent">
          <span class="search" style="font-size: 12px" title="搜索添加的商品" v-if="it.good_from=='member'"><i class="el-icon-search"></i></span>

          <p class="itemname" @click="gotoGood(it)">{{it.good_title}}</p>
          <div class="itemorigin"><span>价格: </span><span>{{it.good_pay_price}}</span><span>来源:
            </span>
            <a :href="it.good_detail_url" target="_blank">
              {{it.good_platform == 'taobao' ? '淘宝':it.good_platform == 'jd' ? '京东':it.good_platform == 'zy'?'自营':''}}</a>
            <span style="margin-left: 40px"> 数量: {{it.good_num}}</span>

          </div>
          <div class="itemface">
            <div class="faceNum">
              <span v-for="(op,p) in it.member_options" :key="p">{{op}}</span>
            </div>
          </div>
          <p class="itemother" v-if="it.member_remark"><span>备注: </span>{{it.member_remark}}</p>
          <div class="imgList">
            <el-image class="oneimg" v-for="(itr,r) in it.member_small" :src="itr" :key="r"
                      @click="showList(j,r)">
            </el-image>
          </div>
        </div>
        <div class="itemTotal">
          <div class="total">合计: <span>{{it.good_pay_price*it.good_num}}</span></div>
        </div>
      </div>

    </div>
    <p class="totall"><span>订单总额：</span><span class="num">{{orderMessage.sumPrice}}</span></p>
    <ElImageViewer v-if="showViewer"
                   :on-close="closeViewer"
                   :initialIndex="initIndex"
                   :url-list="listNow"></ElImageViewer>
  </div>

</template>

<script>
  import {gotoitem} from "../api/index.js";
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
  export default {
    name: 'OrderDetail',
    data(){
      return{
        showViewer:false,
        initIndex:0,
        listNow:[],
        progressNow:0,
        orderMessage:{},
      }
    },
    mounted(){
      console.log(this.$route);
      if (this.$route.query.order&&window.localStorage.getItem('order')&&JSON.parse(window.localStorage.getItem('order'))) {
        console.log(this.$route.query.order);
        this.orderMessage = JSON.parse(window.localStorage.getItem('order'));
        console.log(this.orderMessage);
        this.orderMessage.order_state == '待支付' ? this.progressNow =2 :
          this.orderMessage.order_state == '已支付' ? this.progressNow = 3 :
            this.orderMessage.order_state == '已发货' ? this.progressNow = 4 :
              this.orderMessage.order_state == '已完成' ? this.progressNow = 5 :'';
      }
    },
    methods:{
      closeViewer(){
        this.showViewer = false;
      },
      showList(i,r){
        this.listNow = this.orderMessage.order_goods[i].member_uploads;
        this.initIndex = r;
        this.showViewer = true;
      },
      gotoGood(obj){
        gotoitem(obj)
      },
    },
    components:{
      ElImageViewer:ElImageViewer,
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
  .oneMessage{
    @include initWrap;
    .head{
      text-align: left;
      height: 40px;
      position: relative;
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #ddd;
      .orderNum{
        float: right;
        line-height: 54px;
      }
    }
    .progress{
      margin-bottom: 20px;
    }
    .back{
      text-align: left;
      font-size: 15px;
      cursor: pointer;

    }
    .back:hover{
      color: $active;
    }
    .deliver{
      height: 116px;
      padding: 20px 0;
      text-align: left;
      >p{
        color: rgba(0,0,0,.8);
        font-size: 18px;
        margin-bottom: 14px;
      }
      div{
        color: rgba(0,0,0,.54);
        .name{
          font-size: 16px;
          margin-bottom: 8px;
          color: rgba(0,0,0,.8);
        }
        .phone{
          margin-bottom: 6px;
        }
      }
    }
    .deliverbd{
      height: 3px;
      background-position-x: -1.875rem;
      background-size: 7.25rem .1875rem;
      background-image: repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6 33px,transparent 0,transparent 41px,#f18d9b 0,#f18d9b 74px,transparent 0,transparent 82px);
    }
    .itemBox{
      border-bottom: 1px solid rgba(0,0,0,.09);
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      font-size: $titlefontsize;
      text-align: left;
      position: relative;
      >img{
        width: 80px;
        margin-left: 20px;
      }
      .itemcontent{
        margin-left: 20px;
        width:760px;
        position: relative;
        .search{
          position: absolute;
          top: 6px;
          right: 8px;
        }
        .itemname{
          font-size: $titlefontsize;
          color: #333;
          margin-top: 16px;
          cursor: pointer;
        }
        .itemname:hover{
          @include hover;
        }

        .itemorigin{
          margin-top: 8px;
          span:nth-child(2){
            color: $active;
            margin-right: 40px;
          }
          span:last-child{
            color: #999;
          }
        }
        .itemface{
          display: flex;
          align-items: center;
          margin: 8px 0 4px;
          .faceNum{
            span:nth-child(2){
              margin-left: 10px;
              padding: 4px 8px;
            }
          }
          .faceColor{
            display: flex;
            align-items: center;
            span:first-child{
              margin-left: 40px;
              margin-right: 8px;
            }
            img{
              width: 40px;
            }
          }
        }
        .itemother{
          margin-bottom: 8px;
          color: #999;
          span{
            color: #333;
          }
        }
        .imgList{
          width: 244px;
          margin-bottom: 8px;
          .oneimg{
            cursor: pointer;
            width: 40px;margin: 6px 12px 0 0;
          }
        }
      }
      .itemTotal{
        text-align: left;
        width:134px;
        position: absolute;
        height: 100%;
        top:0;
        right: 0;
        margin: auto;
        .itemmount{

          span{
            color: #888;
          }
        }
        .total{
          position: absolute;
          top:0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          display: inline-block;
          text-align: center;
          height: 40px;
          line-height: 40px;
          font-size: 15px;
          span{
            color: $active;
            font-size: 18px;

          }
        }
      }
    }
    .totall{
      text-align: right;
      margin-bottom: 18px;
      span{
        color: rgba(0,0,0,.54);
      }
      .num{
        color: #ee4d2d;
        font-size: 28px;
      }
    }
  }

</style>


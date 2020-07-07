<template>
  <div class="orderMessageWrap">
    <div>
      <div class="tableSelect">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部订单" name=" "></el-tab-pane>
          <el-tab-pane label="待支付" name="10"></el-tab-pane>
          <el-tab-pane label="已支付" name="20"></el-tab-pane>
          <el-tab-pane label="已发货" name="21"></el-tab-pane>
          <el-tab-pane label="已完成" name="31"></el-tab-pane>
          <el-tab-pane label="已取消" name="11"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="showContent" v-for="(item,i) in orders" :key="i">
        <div class="showhead clearfix">
          <div class="orderNum">
            <span>订单编号: </span>
            <span>{{item.order_sn}}</span>
          </div>
          <div class="orderTime">
            <span>下单时间: </span>
            <span>{{item.create_time}}</span>
          </div>
          <div class="orderState">
            <span>状态: </span>
            <span>{{item.order_state}}</span>
          </div>
<!--          <div class="orderprice">-->
<!--            <span>订单合计: </span>-->
<!--            <span>{{item.sumPrice}}</span>-->
<!--          </div>-->
          <div class="lastDiv" v-if="item.order_state=='待支付'">
            <i class="el-icon-delete del" @click="delOrder(i)"></i>
          </div>
        </div>
        <div class="bwrap">
          <div class="itemBox" v-for="(it,j) in item.order_goods">
            <img :src="$host + it.good_pic_url" alt="">
            <div class="itemcontent">
              <span class="search" style="font-size: 12px" title="搜索添加的商品" v-if="it.good_from=='member'"><i class="el-icon-search"></i></span>
              <p class="itemname" @click="gotoGood(it)" :title="it.good_title">{{it.good_title}}</p>
              <div class="itemorigin"><span>价格: </span><span>{{it.good_pay_price}}</span><span>来源:
            </span>
                <a :href="it.good_detail_url" target="_blank">
                  {{it.good_platform == 'taobao' ? '淘宝':it.good_platform == 'jd' ? '京东':it.good_platform == 'zy'?'自营':''}}</a>
                <span style="margin-left: 40px">{{it.good_num}}</span>
              </div>
              <div class="itemface">
                <div class="faceNum">
                  <span v-for="(op,p) in it.member_options" :key="p">{{op}}</span>
                </div>
                <!--              <div class="faceColor">-->
                <!--                <span>颜色: </span>-->
                <!--                <img src="../assets/img/downApp.png" alt="">-->
                <!--              </div>-->
              </div>
<!--              <p class="itemother" v-if="it.member_remark"><span>备注: </span>{{it.member_remark}}</p>-->
            </div>
          </div>
          <div class="itemTotal">
            <div class="total">合计: <span>{{item.sumPrice}}</span>
              <p  @click="gotoItems(i)" class="detail">订单详情</p>
            </div>
          </div>
        </div>
      </div>

      <el-pagination
        hide-on-single-page
        @current-change="change"
        background
        :current-page.sync="pageNow"
        :page-size="limit"
        layout="prev, pager, next"
        :total="countAll">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {publicPost,gotoitem} from "../api/index.js";

  export default {
    data(){
      return{
        date:['10天内','20天内','30天内'],
        dateSelect: '10天内',
        activeName: '',
        listNow:[],
        orders:[],
        allOrders:[],
        showOne:false,
        sumPrice:0,
        totalPage:1,
        countAll:0,
        countNow:1,
        pageNow:1,
        limit:8,
        activeBefore:'',
      }
    },
    methods:{
      gotoGood(obj){
        gotoitem(obj)
      },
      gotoItems(index){
        var obj =this.orders[index];
        window.localStorage.setItem('order',JSON.stringify(obj));
        var et = this.$router.resolve({
          path:'/orderDetail',
          query:{
            order:true,
          }
        })
        window.open(et.href,'_blank')
      },
      change(e){
        this.getList(this.activeName,e);
      },

      delOrder(index){
        this.$confirm('确定删除订单？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          publicPost('order/delOrder',[{id:this.$cookies.get('user').id}, {token:this.$cookies.get('user').token},
            {order_id:this.orders[index].id}]).then((res) =>{
            if(res.data.code==0){
              this.$message({
                type:'success',
                message:'删除成功',
              })
              var arr= [];
              this.orders.forEach((item,i) => {
                if(i != index) {
                  arr.push(item);
                }
              })
              this.orders = arr;
            } else {
              this.$message(res.data.msg);
            }
          })
          }).catch(action => {
          });
      },
      handleClick(){
        if (this.activeBefore != this.activeName) {
          this.getList(this.activeName,1);
          this.activeBefore = this.activeName;
          this.pageNow = 1;
        }
      },
      getList(state,page){
//         订单状态参数
//         10 => ‘待支付’,
//         20 => ‘已支付’,
//         21 => ‘已发货’,
//         31 => ‘已完成’
// 如 order_state = 10, 即获取“待支付”订单
        publicPost('user/getOrders',[{order_state:state},{id:this.$cookies.get('user').id},
          {token:this.$cookies.get('user').token},{page:page},{limit:this.limit}]).then((res) => {
          console.log(res);
          if(res.data.code == 0) {
              var cartAll = res.data.data.orders;
            console.log(cartAll);
              var arr = [];
            // address_area: (...)
            // address_area_info: (...)
            // address_city: (...)
            // address_detail: (...)
            // address_id: (...)
            // address_realname: (...)
            // address_tel_phone: (...)
            // buyer_id: (...)
            // create_time: (...)
            // finnshed_time: (...)
            // goods_amount: (...)
            // id: (...)
            // order_goods: Array(1)
            // 0:
            // good: Object
            // good_id: (...)
            // good_num: (...)
            // good_pay_price: (...)
            // id: (...)
            // member_options: (...)
            // member_remark: (...)
            // member_small: (...)
            // member_uploads: (...)
            // order_id: (...)
            // order_sn: (...)
            // order_state: (...)
            // pay_sn: (...)
            // payment_code: (...)
            // payment_time: (...)
            // sumPrice: 20
            // update_time: (...)


              cartAll.forEach((item,k) =>{
                var obj=item;
                item.order_goods.forEach((itr,i) => {
                  if (itr.member_uploads&&itr.member_uploads.length) {
                    var arr2 =[],small=[];
                    itr.member_uploads.forEach((it,j) => {
                      var url = it.split('.');
                      var url2 = it + '_t.' + url[url.length-1];
                      small.push(this.$host + url2);
                      arr2.push(this.$host + it);
                    })
                  }
                  var url = obj.order_goods[i].good_pic_url.split('.');
                  obj.order_goods[i].good_pic_url = obj.order_goods[i].good_pic_url + '_bc.' + url[url.length-1];
                  obj.order_goods[i].member_small = small;
                  obj.order_goods[i].member_uploads = arr2;

                })
                arr.push(obj);
              })
              console.log(arr);
              this.orders = arr;
              this.countAll = res.data.data.count - 0;
              this.orders.forEach((item,i) => {
                var sum=0;
                item.order_goods.forEach((it,j) => {
                  var num = it.good_pay_price*it.good_num;
                  sum += num;
                })
                this.orders[i].sumPrice = sum;
              })
              this.allOrders = this.orders;
            } else {
              this.$message(res.data.data);
            }
        })
      }
    },
    mounted(){
      this.getList('',1);
    },
    name: 'OrderMessage'
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
  .orderMessageWrap{
    width: 100%;
    .dayPickOne{
        width: 140px;
        left: 40%;
    }
    .showContent{
      position: relative;
      box-shadow: $boxShadow;
      background: white;
      margin: 10px 0 36px;
      width: 800px;
      .oneContent{
        bottom: 20px;
      }
      .showhead{
        -webkit-user-select: text;
        user-select: text;
        width: 100%;
        border-bottom: 1px solid #ddd;
        >div{
          position: relative;
          margin: 8px 30px 8px 32px;
          font-size: 14px;
          display: inline-block;
          float: left;
          line-height: 40px;
          span:nth-child(2){
            color: #888;
          }
          .btn{
            background: $themeColor;
          }
        }
        .orderNum{

        }
        .orderState{
          span:nth-child(2){
            color: #2FB210;
          }
        }
        .orderprice{
          width: 148px;
          span:nth-child(2){
            color: $active;
          }
        }
        .lastDiv{
          position: absolute;
          right: 0;
          .del{
            line-height: 40px;
            cursor: pointer;
            font-size: 22px;
            color: #666;
          }
          .del:hover{
            color: $active;
          }
        }
      }
      .bwrap{
        position: relative;
        .itemTotal{
          text-align: center;
          width:134px;
          position: absolute;
          height: 100%;
          top: 0;
          right: 0;
          margin: auto;
          border-left: 1px solid #ddd;
          .detail{
            margin-top: 8px;
            cursor: pointer;
            color: #aaa;
          }
          .detail:hover{
            color: $active;
          }
          .itemCenter{

          }
          .itemmount{
            margin-right: 12px;
            span{
              color: #888;
            }
          }
          .total{
            position: absolute;
            height: 86px;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            color: rgba(0,0,0,.8);

            span{
              color: $active;
              font-size: 28px;
            }
          }
        }

      }
      .itemBox{
        width: 666px;
        border-bottom: 1px solid #ddd;
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
          width:520px;
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
            margin: 8px 0;
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
        }
      }
      .itemBox:last-child{
        border-bottom: none;
      }
    }
  }
</style>
<style lang="scss">
  .tableSelect{
    width: 100%;
    .el-tabs__item:hover{
      color: #e70e0e;
    }
    .el-tabs__item.is-active{
      color: #e70e0e;
    }
    .el-tabs__active-bar{
      background-color: #e70e0e;
    }
    .el-tabs__item{
      font-size: 16px;
    }
  }
</style>

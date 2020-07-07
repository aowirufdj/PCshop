<template>
  <div class="confirmWrap">
    <Nav :title="title"></Nav>
    <div v-if="!showSuccess" class="cwrap">
      <div class="progress">
        <el-steps :active="progressNow" finish-status="success" align-center>
          <el-step title="选择商品"></el-step>
          <el-step title="确认下单"></el-step>
          <el-step title="付款"></el-step>
          <el-step title="运输"></el-step>
          <el-step title="签收完成"></el-step>
        </el-steps>
      </div>
      <div class="oneItem">
        <div class="head">
          <span>收货地址</span>
          <div class="right">
            <span @click="showEdit=true">更改当前地址</span>
            <span @click="editLocation">使用其它地址</span>
          </div>
        </div>
        <div class="item" v-if="locationNow">
          <div class="left">
            <div class="name">
              <span>{{locationNow.realname}}</span>
              <span>{{locationNow.tel_phone}}</span>
            </div>
            <div class="loca">
              <img src="../assets/img/location1.png" alt="">
              {{locationNow.area_info}}
            </div>
          </div>
        </div>
        <transition name="el-zoom-in-top">
          <div v-show="show2" class="transition-box">
            <div class="box" v-if="locations&&locations.length">
              <div class="left" v-for="(item,i) in locations" :key="i">
                <div class="name">
                  <span>{{item.realname}}</span>
                  <span>{{item.tel_phone}}</span>
                </div>
                <div class="loca">
                  <img src="../assets/img/location1.png" alt="">
                  {{item.area_info}}
                </div>
                <div class="choose">
                  <el-radio v-model="item.isSelect" @change="change(i)" border>选做收货地址</el-radio>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="oneItem oneItem2">
        <div class="head">
          <span>订单信息</span>
<!--          <span>订单号:{{order.order_sn}}</span>-->
        </div>
        <div class="items" v-for="(item,i) in order" :key="i">
          <div class="item2">
            <span class="search" style="font-size: 12px" title="搜索添加的商品" v-if="item.good_from=='member'"><i class="el-icon-search"></i></span>

            <div class="imgWrap">
              <img :src="$host + item.good_pic_url" alt="">
            </div>
            <div class="list">
              <p class="head2" :title="item.good_title" @click="gotoItem(item)">
                {{item.good_title}}
              </p>
              <div class="price"><span>价格: </span><span>{{item.price}}</span><span>来源: </span>
                <a :href="item.good_detail_url" target="_blank">
                  {{item.good_platform == 'taobao' ? '淘宝':item.good_platform == 'jd' ? '京东':item.good_platform == 'zy'?'自营':''}}</a>
              </div>
              <div class="item3">
                <span v-for="(itr,k) in item.member_options" :key="k">{{itr}}</span>
<!--                <span>6GB + 128GB</span>-->
<!--                <span>颜色: </span>-->
<!--                <img src="../assets/img/downApp.png" alt="">-->
              </div>
              <div class="beizhu">
                <p><span>备注: </span>{{item.member_remark}}</p>

              </div>
              <div class="imgList">
                <el-image class="oneimg" v-for="(it,r) in item.member_small" :src="it" :key="r"
                          @click="showList(i,r)">
                </el-image>

              </div>
            </div>
          </div>
          <div class="item4">
            <span>数量: </span>
            <span class="num">{{item.good_num}}</span>
            <span>合计: </span>
            <span class="price">{{item.price*item.good_num}}</span>
            <span class="line"></span>
          </div>

        </div>
      </div>
      <div class="oneItem item5">
        <div class="itemLast">
<!--          <div class="left">-->
<!--            <div class="name">-->
<!--              <span>张44</span>-->
<!--              <span>15862542356</span>-->
<!--            </div>-->
<!--            <div class="loca">-->
<!--              <img src="../assets/img/location1.png" alt="">-->
<!--              jdfhfkdsjfdskjf-->
<!--            </div>-->
<!--          </div>-->
          <div class="right">
            <div>
              <span>订单合计</span>
              <span>{{goods_amount}}</span>
            </div>
            <el-button class="btn" @click="gotoNext">确认订单</el-button>
          </div>
        </div>
      </div>
      <div class="changelocation" v-if="showEdit">
        <ChooseLocation :locationNow="locationNow" @closeEdit="closeEdit" @changeLocation="changeLocation"></ChooseLocation>
      </div>
    </div>
    <ElImageViewer v-if="showViewer"
                   :on-close="closeViewer"
                   :initialIndex="initIndex"
                   :url-list="listNow"></ElImageViewer>
    <div v-if="showSuccess">
      <div class="successWrap">
        <i class="el-icon-finished sucs"></i>
        <p>下单成功!</p>
        <div style="margin-top: 18px">
          <el-button style="margin-right: 12px" @click="gotoHome">继续购物</el-button>
          <el-button style="margin-left: 12px" @click="gotoOrder">查看订单</el-button>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
  import {publicPost,gotoitem} from "../api/index.js";
  import Nav from '../components/Nav.vue'
  import ChooseLocation from '../components/ChooseLocation.vue'

  export default {
    data(){
      return{
        title:{
          title: '确认订单',
          name: '',
        },
        listNow:[],
        initIndex:0,
        show2: false,
        progressNow:2,
        order:{},
        locationNow:{},
        otherLocation:[],
        locations:[],
        showEdit:false,
        goods_amount:0,
        showSuccess:false,
        orderObj:{},
        showViewer:false,
      }
    },
    mounted(){
      if(this.$route.params.cart) {
        this.orderObj = JSON.parse(this.$route.params.cart);
        var cartAll = this.orderObj.cart;
        console.log(cartAll);

        var arr = [];
        cartAll.forEach((item,i) => {
          var arr2 =[],small=[];
          if (item.member_uploads&& item.member_uploads.length) {
            item.member_uploads.forEach((it,j) => {
              var url = it.split('.');
              var url2 = it + '_t.' + url[url.length-1];
              small.push(this.$host + url2);
              arr2.push(this.$host + it);
            })
          }

          item.member_small = small;
          item.member_uploads = arr2;

          var url = item.good_pic_url.split('.');
          item.good_pic_url = item.good_pic_url + '_bc.' + url[url.length-1];

          arr.push(item);
        })
        console.log(arr);


        this.order = arr;
        console.log(this.order);
        this.progressNow = 1;
        this.order.forEach((item) => {
          this.goods_amount = this.goods_amount + item.price*item.good_num;
        })
        publicPost('user/getAddress',[{id:this.$cookies.get('user').id},{token:this.$cookies.get('user').token}]).then((res) => {
          if(res.data.code == 0){
            // area: "齐齐哈尔 铁锋区"
            // area_info: "黑龙江 齐齐哈尔 铁锋区 aseana 3"
            // city: "黑龙江"
            // create_time: "2020-06-19 22:02:00"
            // detail: "aseana 3"
            // id: 11
            // is_default: 1
            // member_id: 10
            // realname: "daxia"
            // tel_phone: "09564561494"
            // update_time: "2020-06-19 22:02:00"

            var data = res.data.data;
            data.forEach((item,i) => {
              if(item.is_default) {
                data[i].isSelect = true;
              } else {
                data[i].isSelect = false;
              }
            })
            this.locations = data;
            var isDeafault = false;
            this.locations.forEach((item)=>{
              if(item.is_default) {
                this.locationNow = item;
                isDeafault =true;
              }
            })
            if (!isDeafault) {
              this.locationNow = this.locations[0];
            }
          } else {
            this.$message(res.data.msg);
          }
          console.log(res);
        })
      }
      if(this.$route.params.id) {
        publicPost('order/getOrderInfo',[{order_sn:this.$route.params.id},{token:this.$cookies.get('user').token},
          {id:this.$cookies.get('user').id}]).then((res) => {
            if(res.data.code==0) {
              // 订单状态参数
              // 10 => ‘待支付’,
              // 20 => ‘已支付’,
              // 21 => ‘已发货’,
              // 31 => ‘已完成’

              this.order = res.data.data;
              if(this.order.order_state == '待支付') {
                this.progressNow = 1;
              }
            } else {
              this.$message(res.data.msg);
            }
          console.log(res);
        })
      }
    },
    methods:{
      showList(i,r){
        this.listNow = this.order[i].member_uploads;
        this.initIndex = r;
        this.showViewer = true;
      },
      gotoItem(obj){
        gotoitem(obj);
      },
      closeViewer(){
        this.showViewer = false;
      },
      gotoHome(){
        this.$router.push({
          path:'/',
        })
      },
      gotoOrder(){
        this.$router.push({
          path:'/personInfo/orderMessage',
        })
      },
      gotoNext(){
        var arr = [];
        this.order.forEach((item) => {
          arr.push(item.good_id)
        })
        publicPost('order/purchase',[{id:this.$cookies.get('user').id},{token:this.$cookies.get('user').token},
          {cart_ids:this.orderObj.cartId},{address_id:this.locationNow.id}]).then((res) => {
          console.log(res);
          if(res.data.code == 0) {
            this.showSuccess = true;
            this.$store.dispatch('getCartNum');
            this.$store.state.newAdd = 0;
          } else {
            this.$message(res.data.msg);
          }
        })
      },
      changeLocation(obj){
        this.locationNow = obj;
        this.showEdit = false;
      },
      closeEdit(bool){
        this.showEdit = bool;
      },
      change(index){
        this.locations.forEach((item,i) => {
          if(i != index) {
            this.$set(this.locations[i],'isSelect', false);
          } else {
            this.locationNow = this.locations[index];
          }
          this.show2 = false;
        })
      },
      editLocation(){
        this.show2 = !this.show2;
      }
    },
    components:{
      Nav:Nav,
      ElImageViewer:ElImageViewer,
      ChooseLocation:ChooseLocation,
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
.confirmWrap{
  @include initWrap;
  .successWrap{
    text-align: center;
    .sucs{
      color: #67c23a;
      font-size: 190px;
    }
    p{
      font-size: 16px;
    }
  }

  .cwrap{

    border-top: 1px solid $lightBorderColor;
    .progress{
      margin: 20px auto;
      text-align: left;
      width: 80%;
      min-width: 600px;
    }
    .oneItem2{
      margin: 28px 0;
      position: relative;
      .items{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 0;
        border-bottom: 1px solid #ddd;
        .search{
          position: absolute;
          top: 6px;
          right: 8px;
        }
        .item1{
          display: flex;
          align-items: center;
        }
        .item2{

          overflow: hidden;
          display: flex;
          align-items: center;

          .imgWrap{
            display: inline-block;
            margin-right: 20px;
            img{
              width: 120px;
            }
          }
          .list{
            display: inline-block;
            text-align: left;
            .head2{
              font-size: 18px;
              width: 704px;
              cursor: pointer;
            }
            .head2:hover{
              color: $active;
            }
            .price{
              margin: 10px 0;
              span:nth-child(2){
                color: $active;
                margin-right: 30px;
              }
              span:last-child{
                color: #999;
              }
            }
            .beizhu{
              font-size: 14px;
              width: 800px;
              p{
                span{
                  color: #999;
                  margin-right: 10px;
                }
              }
            }
            .imgList{
              margin-top: 10px;
              .oneimg{
                cursor: pointer;
                width: 40px;margin: 6px 12px 0 0;
              }
            }
          }
        }
        .item3{
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-bottom: 10px;
          span:nth-child(2){
            margin-left: 18px;
            padding: 4px 2px;
            margin-right: 28px;
          }
          img{
            margin-left: 8px;
            padding:2px;
            border: 1px solid #bbb;
          }
        }
        .item4{
          font-size: 14px;
          margin-right: 20px;
          .num{
            color: #666;
            margin:0 22px 0 8px;
          }
          .price{
            color: $active;
            font-size: 16px;
          }
        }
        .item5{
          display: flex;
          align-items: center;
          font-size: 14px;
          span{
            cursor: pointer;
            color: #999;
          }
          span:hover{
            color: $active;

          }
        }
      }
      .items:last-child{
        border-bottom: none;
      }
    }
    .oneItem{
      font-size: 16px;
      box-shadow: $boxShadow;
      background: white;
      padding: 12px 20px;
      border-radius: 6px;
      .itemLast{
        text-align: right;
        color: #666;
        margin: 16px 0 8px;
        .left{
          font-size: 16px;
          text-align: left;
          .name{
            margin-bottom: 10px;
            font-size: 18px;
            span:nth-child(2){
              margin-left: 22px;
            }
          }
          .loca{
            color: #999;
            img{
              height: 20px;
            }
          }
        }
        .right{
          margin-right: 20px;
          span:first-child{
            color: #333;
          }
          span:nth-child(2){
            color: $active;
            margin-left: 16px;
          }
          .btn{
            margin-top: 8px;
            width: 114px;
            background: $themeColor;
            color: white;
          }
        }
      }
      .head{
        width: 100%;
        position: relative;
        border-bottom: 1px solid #ccc;
        padding-bottom: 8px;
        color: #111;
        text-align: left;
        >span:first-child{
          margin-right: 16px;
        }
        .right{
          position: absolute;
          right: 0;
          top: 0;
          span{
            cursor: pointer;
            color: #999;
          }
          span:hover{
            color: $active;
          }
          span:first-child{
            margin-right: 16px;
          }
        }
      }
      .item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #666;
        margin: 16px 0 8px;
        .left{
          font-size: 16px;
          text-align: left;
          .name{
            margin-bottom: 10px;
            font-size: 18px;
            span:nth-child(2){
              margin-left: 22px;
            }
          }
          .loca{
            color: #999;
            img{
              height: 20px;
            }
          }
        }
        .right{
          font-size: 16px;
          text-align: left;
          span{
            margin-left: 20px;
          }
          span:nth-child(1){
            color: #999;
            cursor: pointer;
          }
          span:nth-child(1):hover{
            color: $active;
          }
          span:nth-child(2){
            color: $active;
            cursor: pointer;
          }
          span:nth-child(2):hover{
            color: #999;
          }
          span:nth-child(3){
            display: inline-block;
            height: 30px;
            width: 30px;
            border-radius: 50%;
            background: RGB(249,205,53);
            text-align: center;
            line-height: 30px;
            color:white;
          }
        }
      }
      .box{
        width: 500px;
        margin: 8px auto;
        padding: 26px 30px;
        /* background: #4a90e2; */
        border: 1px dashed #999;
        border-radius: 7px;
        .left{
          text-align: left;
          border-bottom: 1px solid #ccc;
          padding-bottom: 8px;
          margin-bottom: 16px;
          position: relative;
          .loca{
            color: #999;
            img{
              height: 20px;
            }
          }
          .name{
            margin-bottom: 6px;
            span{
              margin-right: 22px;
              color: #666;
            }
          }
          .choose{
            position: absolute;
            right: 8px;
            top: 5px;
          }
        }
      }
    }
    .item5{
      box-shadow: none;
    }
    .changelocation{
      position: fixed;
      z-index: 200;
      width: 600px;
      padding: 39px 20px;
      border-radius: 8px;
      top: 160px;
      left: 0;
      right: 0;
      background: #c4c4c4;
      margin: auto;
    }
  }
}
</style>

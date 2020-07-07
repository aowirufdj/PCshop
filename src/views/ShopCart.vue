<template>
 <div class="shopCart">
   <div class="navss">
     <Nav :title="title"></Nav>
     <p>您的购物车 <span>{{cartNum}}</span>件产品</p>
   </div>
   <div class="shopCartcontent">
     <div class="content">
       <div v-if="cartList.length">
         <div class="item8" v-for="(item,i) in cartList" :key="i">
           <span class="search" style="font-size: 12px" title="搜索添加的商品" v-if="item.good_from=='member'"><i class="el-icon-search"></i></span>
           <p class="title" :title="item.good_title" @click="gotoItem(item)">{{item.good_title}}</p>
           <div class="mid">
                <el-checkbox v-model="item.isSelect" size="medium"></el-checkbox>
                <span class="line"></span>
               <img :src="$host + item.pic" alt="">
             <div class="price">
               <span>价格: </span><span>{{item.price}}</span>
               <span>来源:</span><a :href="item.good_detail_url" target="_blank">
                 {{item.good_platform == 'taobao' ? '淘宝':item.good_platform == 'jd' ? '京东':item.good_platform == 'zy'?'自营':''}}</a>
             </div>
             <span class="line"></span>
             <div class="prop">
               <span v-for="(it,p) in item.member_options" :key="p" :title="it">{{it}}</span>
             </div>

             <span class="line"></span>
             <div class="num">
               <span>数量: </span>
               <span>{{item.good_num}}</span>
             </div>

             <span class="line"></span>
             <div class="sum">
               <span>合计：</span>
               <span>{{item.price*item.good_num}}</span>
             </div>

             <span class="line"></span>
             <div class="last">
               <el-popconfirm
                 confirmButtonText='删除'
                 cancelButtonText='取消'
                 @onConfirm="delOne(i)"
                 icon="el-icon-info"
                 iconColor="red"
                 title="确定删除商品？"
               >
                 <span class="del" slot="reference">删除</span>
               </el-popconfirm>
               <span class="edit" @click="edit(i)">修改</span>
             </div>
           </div>
           <div class="beizhu">
             备注：<span>
             {{item.member_remark}}
           </span>

           </div>
         </div>

<!--         <div class="item" v-for="(item,i) in cartList" :key="i">-->
<!--           <div class="item1">-->
<!--             <el-checkbox v-model="item.isSelect" size="medium"></el-checkbox>-->
<!--             <span class="line"></span>-->
<!--           </div>-->
<!--           <div class="item2">-->
<!--             <div class="imgWrap">-->
<!--               <img :src="$host + item.pic" alt="">-->
<!--             </div>-->
<!--             <div class="list">-->
<!--               <p class="head" :title="item.good.title" @click="gotoItem(item.good_id)">-->
<!--                 {{item.good.title}}-->
<!--               </p>-->
<!--               <div class="price"><span>价格: </span><span>{{item.price}}</span><span>来源: </span><span>{{item.good.good_platform=='taobao'?'淘宝':-->
<!--                item.good.good_platform=='jd'?'京东':'自营'}}</span></div>-->
<!--               <div class="beizhu">-->
<!--                 <span>备注: </span>-->
<!--                 <span>{{item.member_remark}}</span>-->
<!--               </div>-->
<!--             </div>-->
<!--             <span class="line"></span>-->
<!--           </div>-->
<!--           <div class="item3">-->
<!--             <span v-for="(it,p) in item.member_options" :key="p" :title="it">{{it}}</span>-->
<!--             <span class="line"></span>-->
<!--           </div>-->
<!--           &lt;!&ndash;          <div class="item3">&ndash;&gt;-->
<!--           &lt;!&ndash;            <span>颜色: </span>&ndash;&gt;-->
<!--           &lt;!&ndash;            <img src="../assets/img/downApp.png" alt="">&ndash;&gt;-->
<!--           &lt;!&ndash;            <span class="line"></span>&ndash;&gt;-->
<!--           &lt;!&ndash;          </div>&ndash;&gt;-->
<!--           <div class="item4">-->
<!--             <span>数量: </span>-->
<!--             <span class="num">{{item.good_num}}</span>-->
<!--&lt;!&ndash;             <el-input-number v-model="item.good_num" class="inputNum" size="mini" @change="handleChange" :min="1" label="描述文字"></el-input-number>&ndash;&gt;-->
<!--             <span>合计: </span>-->
<!--             <span class="price">{{item.price*item.good_num}}</span>-->
<!--             <span class="line"></span>-->
<!--           </div>-->
<!--           <div class="item5">-->
<!--             <el-popconfirm-->
<!--               confirmButtonText='删除'-->
<!--               cancelButtonText='取消'-->
<!--               @onConfirm="delOne(i)"-->
<!--               icon="el-icon-info"-->
<!--               iconColor="red"-->
<!--               title="确定删除商品？"-->
<!--             >-->
<!--               <span class="del" slot="reference">删除</span>-->
<!--             </el-popconfirm>-->
<!--             <span class="edit" @click="edit(i)">修改</span>-->
<!--           </div>-->
<!--         </div>-->
         <div class="doWith">
           <div class="left">
             <el-checkbox v-model="checked" @change="selectAll" size="medium" label="全选"></el-checkbox>
             <span class="del" @click="delChoose">删除</span>
           </div>
           <div class="right">
             <span>订单合计:</span>
             <span>{{sumPrice}}</span>
             <el-button class="commit" @click="submit">提交</el-button>
           </div>
         </div>
       </div>
        <p v-if="getReady && !cartList.length">请先添加商品</p>
     </div>
   </div>
   <div class="addGoodWrap1" v-if="showCate">
     <AddGood :cate="cate" :showCate.sync="showCate"></AddGood>
   </div>
 </div>
</template>

<script>
  import {publicPost,gotoitem} from '../api/index.js'
  import AddGood from '../components/AddGood.vue'
  import Nav from '../components/Nav.vue'
  export default {
    data(){
      return{
        checked: false,
        getReady:false,
        num : 1,
        title:{
          title: '购物车',
          name: ''
        },
        cartNum:0,
        cartList:[],
        showCate:false,
        cate:{},
      }
    },
    mounted(){
      this.getList();
    },
    components:{
      Nav,
      AddGood
    },
    methods:{
      getList(){
        publicPost('cart/getCartInfo',[{token:this.$cookies.get('user').token},{id:this.$cookies.get('user').id}]).then((res) => {
          console.log(res);
          if(res.data.code == 0) {
            var data = res.data.data;

            // data.forEach((item,i) => {
            //   var obj = item;
            //   if (item.good_from && item.good_from=='member') {
            //     console.log(item.good_skus);
            //     item.good_skus = JSON.parse(item.good_skus);
            //     console.log(item.good_skus);
            //     // for (var ob in item) {
            //     //   if (ob.indexOf('good_') == 0) {
            //     //     var str = ob.split('good_')[1];
            //     //     obj[str] = item[ob];
            //     //   }
            //     // }
            //   }
            //   data[i] = item;
            // })

            console.log(data);
            this.getReady = true;
            var num = 0;
            data.forEach((p,k) => {
              num +=p.good_num;
              data[k].isSelect = false;
              var url = p.good_pic_url;
              if (url) {
                url = url + '_bc.' + url.split('.')[1];
              }
              data[k].pic = url;
              if(p.good_skus.sku.length) {
                p.good_skus.sku.forEach((item,i) => {
                  if(item.sku_id == p.good_sku_id) {
                    data[k].price = item.price
                  }
                })
              } else {
                data[k].price = data.good.price
              }
            })
            this.cartNum = num;
            if (data.length >= this.newAdd) {
              for (var k=0;k<this.newAdd;k++) {
                data[data.length-1-k].isSelect = true;
              }
            }
            this.cartList = data;
          }
        })
      },
      edit(i){
        var obj = {};
        obj.isChange = true;
        obj.id = this.cartList[i].good_id;
        obj.num = this.cartList[i].good_num;
        obj.remark = this.cartList[i].member_remark;
        obj.plat = this.cartList[i].good_platform;
        obj.cartId = this.cartList[i].id;
        obj.title = this.cartList[i].good_title;
        obj.imgs = this.cartList[i].member_uploads;
        obj.prop = this.cartList[i].member_options;
        var arr = this.cartList[i].good_pic_url.split('.');
        obj.pic = this.$host + this.cartList[i].good_pic_url + '_bc.' + arr[arr.length-1];
        this.cartList[i].good_skus.sku.forEach((item,j) => {
          if (item.sku_id == this.cartList[i].good_sku_id) {
            obj.sku = item;
          }
        })
        this.cate = obj;
        this.showCate = true;
      },
      submit(){
        var obj = {};
        var cart = [],isSelect = false,cartId=[];
        this.cartList.forEach((item) => {
          if(item.isSelect) {
            isSelect = true;
            cart.push(item);
            cartId.push(item.id)
          }
        })
        if(!isSelect) {
          this.$message('请先选择商品');
          return;
        }
        obj.cart = cart;
        obj.cartId = cartId;
        this.$router.push({
          name:'ConfirmOrder',
          params:{
            cart: JSON.stringify(obj),
          }
        })
      },
      delChoose(){
        this.$confirm('删除选中的商品,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.cartList.forEach((item,i) => {
            if(item.isSelect) {
              this.delOne(i);
            }
          })
        }).catch(() => {
        });
      },
      delOne(index){
        publicPost('cart/del',[{id:this.$cookies.get('user').id},{token:this.$cookies.get('user').token},{cart_id:this.cartList[index].id}]).then((res) => {
          if(res.data.code == 0) {
            if (this.cartList.length<2) {
              this.cartList = [];
            } else {
              var arr = [];
              this.cartList.forEach((p,j) => {
                if(index != j) {
                  arr.push(p)
                }
              })
              this.cartList = arr;
            }
            this.$store.state.cartNum = this.$store.state.cartNum-1;
          }
          console.log(res);
        })
      },
      gotoItem(item){
        gotoitem(item);
      },
      selectAll(){
        if(!this.checked) {
          this.cartList.forEach((item,i) => {
            this.$set(this.cartList[i],'isSelect',false)
          })
        } else {
          this.cartList.forEach((item,i) => {
            this.$set(this.cartList[i],'isSelect',true)
          })
        }
      },
      handleChange(){

      },
      change(index){
        console.log(index);
      }
    },
    computed:{
      newAdd(){
        return this.$store.state.newAdd;
      },
      sumPrice:function () {
        var sum = 0;
        this.cartList.forEach((item,i) => {
          if(item.isSelect) {
            var pr = item.price*item.good_num - 0;
            sum += pr;

          }
        })
        sum = sum.toFixed(3);
        sum = Math.round(sum * 100) / 100;
        return sum;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
  .item8{
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
    word-break: break-all;
    position: relative;
    .search{
      position: absolute;
      top: 6px;
      right: 8px;
    }
    .title,.beizhu{
      width: 972px;
    }
    .title{
      font-size: 15px;
      margin-left: 166px;
      margin-bottom: -20px;
      cursor: pointer;
    }
    .title:hover{
      color: $active;
    }
    .beizhu{
      font-size: 14px;
      color: #999;
      margin-left: 166px;
      margin-top: -16px;
      span{
        word-break: break-all;
      }
    }
    .mid{
      font-size: 15px;
      display: flex;
      align-items: center;
      img{
        width: 90px;
        margin-right: 20px;
      }
      .prop{
        display: inline-block;
        width: 356px;
      }
      .price{
        width: 200px;
        span:nth-child(2){
          color: $active;
        }
        span:nth-child(3){
          margin-left: 16px;
        }
        span:nth-child(4){
          color: #999;
        }
      }
      .sum{
        width: 140px;
        span:nth-child(2){
          font-size: 16px;
          color: $active;
        }
      }
      .num{
        width: 68px;
      }
      .last{
        color: #999;
        >span{
          cursor: pointer;
        }
        .edit{
          margin-left: 12px;
        }
        span:hover{
          color: $active;
        }
      }
    }
  }
  .item8:nth-last-child(2){
    border-bottom: none;
  }
.shopCart{
  .navss{
    text-align: left;
    background: white;
    padding: 10px;
    box-shadow: $boxShadow;

    p{
      padding-top: 10px;
      border-top: 1px dashed #ddd;
      font-size: 18px;
      margin-top: 10px;
      span{
        color: $active;
        margin-left: 2em;
      }
    }
  }
  min-height: calc(100vh - 320px);
  @include initWrap;
  .head{
    text-align: left;
    font-size: 18px;
    color: #333;
    padding-bottom: 10px;
  }
  .shopCartcontent{
    text-align: left;
    @include content;
    .content{
      margin: 20px 0;
      box-shadow: $boxShadow;
      width: 100%;
      box-sizing: border-box;
      border-radius: 4px;
      background: white;
      padding: 0 14px;
      font-size: $titlefontsize;
      color: #333;

      .item{
        display: flex;
        align-items: center;
        padding: 20px 0;
        border-bottom: 1px solid #ddd;
        .item1{
          display: flex;
          align-items: center;
        }
        .item2{
          display: flex;
          align-items: center;
          .imgWrap{
            display: inline-block;
            margin-right: 20px;
            img{
              width: 90px;
              border-radius: 4px;
            }
          }
          .list{
            width: 310px;
            display: inline-block;
            .head{
              font-size: $titlefontsize;
              width: 942px;
              @include ellipse;
              cursor: pointer;
            }
            .head:hover{
              color: $active;
            }
            .price{
              height: 42px;
              line-height: 42px;
              margin-bottom: 12px;
              span:nth-child(2){
                color: $active;
                margin-right: 30px;
              }
              span:last-child{
                color: #999;
              }
            }
            .beizhu{
              width: 942px;
              span:last-child{
                color: #999;
                margin-left: 10px;
              }
              span{
                word-break: break-all;
              }
            }
          }
        }
        .item3{
          position: relative;
          width: 290px;
          display: flex;
          align-items: center;
          font-size: 14px;
          span:first-child{
            margin-right: 12px;
          }
          span:nth-child(2){
          }
          img{
            margin-left: 8px;
            padding:2px;
            border: 1px solid #bbb;
          }
          .line{
            position: absolute;
            right: -14px;
          }
        }
        .item4{
          width: 224px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          position: relative;
          .inputNum{
            width: 96px;
            margin:0 16px 0 8px;
          }
          .price{
            color: $active;
            font-size: 16px;
          }
          .num{
            margin-right: 28px;
          }
          .line{
            position: absolute;
            right: 0;
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
          .del{
            margin-right: 20px;
          }
        }
      }
      .item:nth-last-child(2){
        border-bottom: none;
      }
      .doWith{
        width: 100%;
        margin-top: 20px;
        border-top: 1px solid $lightBorderColor;
        padding: 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left{
          display: flex;
          align-items: center;
          span{
            cursor: pointer;
          }
          span:nth-child(2){
            color: #333;
          }
          span:last-child{
            color: #999;
          }
          span:hover{
            color: $active;
          }
          .del{
            font-size: 15px;
            margin-left: 24px;
          }
        }
        .right{
          span:first-child{
            color: #333;
          }
          span:nth-child(2){
            color: $active;
            margin: 0 16px;
          }
          .commit{
            background: $themeColor;
            color: white;
            padding: 10px 38px;
            font-size: 18px;
          }
        }
      }
    }
  }
  .line{
    display: inline-block;
    width: 1px;
    background: $borderColor;
    height: 32px;
    margin: 0 20px;
  }
}
  .addGoodWrap1{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    z-index: 1999;
    background: $greyBack;
  }
</style>
<style scoped>

</style>

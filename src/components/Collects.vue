<template>
  <div class="collects">
    <div class="card1" v-for="(item,i) in collect" :key="i" @mouseenter="showDelete(i)" @mouseleave="hideDelete()">
      <div v-if="showDeleteNow === i" class="el-icon-close delete" @click="deleteOne(item.good.id,i)"></div>
      <div class="img1" :style="{backgroundImage:'url('+item.good.pic+')'}"></div>
      <div class="bottom">
        <p class="name" :title="item.good.title">{{item.good.title}}</p>
        <p class="price">{{item.good.price}}</p>
        <div class="detail">
          <div>
            来源: <span>{{item.good.good_platform == 'jd'? '京东' : item.good.good_platform == 'taobao'? '淘宝' : item.good.good_platform == 'zy'?'自营':''}}</span>
          </div>
          <span @click="gotoItems(item.good.id)">查看</span>
        </div>
      </div>
    </div>
    <div class="bpa">
      <el-pagination
        background
        v-show="countAll>limit"
        @current-change="change"
        :current-page="pageNow"
        layout="prev, pager, next"
        :total="countAll">
      </el-pagination>
    </div>
    <el-button type="primary" icon="el-icon-arrow-left" @click="preClick" circle class="leftBtn" v-if="countAll>limit&&pageNow>1"></el-button>
    <el-button type="primary" icon="el-icon-arrow-right" @click="nextClick" circle class="rightBtn" v-if="countAll>limit&&pageNow<maxPage"></el-button>

  </div>
</template>

<script>
  import {getCollects,collect,publicPost} from '../api/index.js'
  export default {
    name: 'Collects',
    data(){
      return{
        showDeleteNow: '',
        collect:[],
        limit:8,
        countAll:0,
        maxPage:0,
        pageNow:1,
      }
    },
    methods:{
      nextClick(){
        this.pageNow=this.pageNow-0+1
        this.change(this.pageNow);
      },
      preClick(){
        this.pageNow=this.pageNow-1;
        this.change(this.pageNow);
      },
      change(e){
        console.log(e);
        this.pageNow = e;
        this.getList(e);

      },
      deleteOne(id,index){
        var user = this.$cookies.get('user');
        collect(user,id,'',true).then((res) => {
          if (res.data.code == 0) {
            var arr = [];
            this.collect.forEach((item,i) => {
              if (index != i) {
                arr.push(item);
              }
            })
            this.collect = arr;
          } else {
            this.$message(res.data.msg);
          }
        })
      },
      showDelete(i){
        this.showDeleteNow = i
      },
      hideDelete(){
        this.showDeleteNow = ''
      },
      gotoItems(id){
        this.$router.push({
            name : 'Items',
            params: {
              id: id,
            },
          }
        )
      },
      getList(page){
        var user = this.$cookies.get('user');
        publicPost('user/getCollects',[{id:user.id},{token:user.token},{page:page},{limit:this.limit}]).then((res) => {
          if (res.data.code == 0) {
            var data = res.data.data.collects;
            this.countAll = res.data.data.count;
            this.maxPage = Math.ceil(this.countAll/this.limit);
            data.forEach((item,i) => {
              var str = item.good.pic_url + '_bc';
              var arr2 = item.good.pic_url.split('.');
              str = this.$host + str + '.'+arr2[arr2.length-1];
              data[i].good.pic = str;
            })
            this.collect = data;
          }
        })
      },
    },
    mounted() {
      this.getList(1);
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
.collects{
  width: 820px;
  text-align: left;
  position: relative;
  .leftBtn{
    position: absolute;
    left: -50px;
    top: 42%;
  }
  .rightBtn{
    position: absolute;
    right: -50px;
    top: 42%;
  }
  .card1{
    display: inline-block;
    position: relative;
    margin: 0 24px 30px 0;
    box-shadow: $boxShadow;
    background: white;
    border-radius: 4px;
    .delete{
      position: absolute;
      cursor: pointer;
      top: -13px;
      right: -13px;
      font-size: 18px;
      color: white;
      background: $active;
      border-radius: 50%;
      padding: 4px;
    }
  }
  .card1:nth-child(4n){
    margin: 0 0 30px 0;
  }
  .img1{
    border-radius: 4px 4px 0 0;
    width: 186px;
    height: 166px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  .bottom{
    text-align: left;
    margin-bottom: 6px;
    .name{
      padding: 0 0.5em;
      box-sizing: border-box;
      font-size: 16px;
      color: #666;
      line-height: 24px;
      margin-top: 6px;
      width: 170px;
      height: 24px;
      @include ellipse;
    }
    .price{
      padding: 0 0.5em;
      font-size: 16px;
      color: $active;
    }
    .detail{
      padding: 0 0.5em;
      display: flex;
      align-items: center;
      justify-content: space-between;
      >div{
        span{
          color: #999;
        }
      }
      >span:last-child{
        display: inline-block;
        padding: 3px 15px;
        cursor: pointer;
        border-radius: 4px;
        color: white;
        background: $themeColor;
      }
    }
  }
  .bpa{
    text-align: center;
  }
}
</style>

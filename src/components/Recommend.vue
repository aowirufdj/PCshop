<template>
  <div class="cwrap">
      <div class="head">
        {{iscateNow ? title : $t('head.recommend')}}
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="item" v-for="(item,i) in commandData" :key="i" :title="item.title">
          <div class="leftItem">
            <img :src="$host + item.pic_url" alt="">
          </div>
          <div class="rightItem">
            <p class="rightHead" @click="gotoItems(item)" :title="item.title">
              {{item.title}}
            </p>
            <p class="detail" :title="item.desctxt">
              {{item.desctxt}}
            </p>
            <p class="price">{{item.price}}</p>
            <div class="bottom">
              <div class="one1">
                <span>上架时间：</span>
                <span>{{item.create_time}}</span>
              </div>
              <div class="one2" @click="collectByUser(item.id,i)">
                {{item.iscollect ? '已收藏':'收藏'}} <i class="el-icon-star-on collect" :style="{color:item.iscollect? '#F9CD35':'#999'}"></i>
              </div>
              <div class="one3">
                来源：<a :href="item.detail_url" target="_blank">{{item.good_platform == 'taobao' ? '淘宝':item.good_platform == 'jd' ? '京东':item.good_platform == 'zy'?'自营':''}}</a>
                <span @click="gotoItems(item)">去购买<i class="el-icon-arrow-right"></i></span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
</template>

<script>
  import {getCommandList,collect,getCollects,publicPost} from '../api/index.js'
  export default {
    name: 'Recommend',
    data(){
      return{
        list: [],
        loading: false,
        finished: false,
        commandData: [],
        pageNow: 1,
        num: 6,
        iscateNow:false,
        title:'',
      }
    },
    mounted(){
      if(this.$route.query.id && this.$route.query.name){
        this.iscateNow = true;
        this.title = this.$route.query.name;
      } else {
        this.iscateNow = false
      }
      var user = this.$cookies.get('user');
      if (user) {
        this.$store.dispatch('getCollects');
        // getCollects(user).then((res) => {
        //   if (res.data.code == 0) {
        //     this.collectList = res.data.data.collects;
        //   }
        //   console.log(res);
        // })
      }
      // this.iscate ? this.iscateNow = true:this.iscateNow = false;
    },
    methods:{
      collectByUser(id,i){
        var user = this.$cookies.get('user');
        if (user) {
          if(this.commandData[i].iscollect){
            collect(user,id,'',true).then((res) => {
              if (res.data.code == 0) {
                this.$set(this.commandData[i],'iscollect',false)
              } else {
                this.$message(res.data.msg);
              }
            })
          } else {
            collect(user,id,'',false).then((res) => {
              if (res.data.code == 0) {
                this.$set(this.commandData[i],'iscollect',true)
              } else {
                this.$message(res.data.msg);
              }
              console.log(res);
            })
          }
        } else {
          this.$store.state.showLogin = true
        }
      },
      onLoad() {
        if (this.iscateNow){
          this.getList([{'page': this.pageNow},{'limit': this.num},{'cate':this.$route.query.id}]);

          //异步更新数据  分类展示
          // getCommandList(this.pageNow,this.num,this.$route.query.id).then((res) => {
          //   console.log(res);
          //   if (res.data.code == 0) {
          //     var arr1 = [],arr = [];
          //     res.data.data.goods.forEach((item,i) => {
          //       res.data.data.goods[i].create_time = item.create_time.split(' ')[0];
          //     })
          //     if (this.pageNow == 1) {
          //       arr1 = res.data.data.goods;
          //     } else {
          //       res.data.data.goods.forEach((item) => {
          //         arr1.push(item);
          //       })
          //     }
          //     if (res.data.data.count <= this.pageNow* this.num) {
          //       this.finished = true;
          //     }
          //     this.pageNow = this.pageNow + 1;
          //     arr1.forEach((item,i) => {
          //       var str = item.pic_url + '_bc';
          //       var arr2 = item.pic_url.split('.');
          //       str = str + '.'+arr2[arr2.length-1];
          //       item.pic_url = str;
          //       arr.push(item);
          //     })
          //     this.commandData = this.commandData.concat(arr);
          //   }
          //   if(this.collectList.length) {
          //     this.collectList.forEach((it,i) => {
          //       this.commandData.forEach((itr,j) => {
          //         if (it == itr.id) {
          //           this.$set(this.commandData[j],'iscollect',true)
          //         }
          //       })
          //     })
          //   }
          //
          //   this.loading = false;
          // });
        }else {
          // 异步更新数据
          this.getList([{'page': this.pageNow},{'limit': this.num}]);
          // getCommandList(this.pageNow,this.num).then((res) => {
          //   if (res.data.code == 0) {
          //     var arr1 = [],arr = [];
          //     res.data.data.goods.forEach((item,i) => {
          //       res.data.data.goods[i].create_time = item.create_time.split(' ')[0];
          //     })
          //     if (this.pageNow == 1) {
          //       arr1 = res.data.data.goods;
          //     } else {
          //       res.data.data.goods.forEach((item) => {
          //         arr1.push(item);
          //       })
          //     }
          //     if (res.data.data.count <= this.pageNow* this.num) {
          //       this.finished = true;
          //     }
          //     this.pageNow = this.pageNow + 1;
          //     arr1.forEach((item,i) => {
          //       var str = item.pic_url + '_bc';
          //       var arr2 = item.pic_url.split('.');
          //       str = str + '.'+arr2[arr2.length-1];
          //       item.pic_url = str;
          //       arr.push(item);
          //     })
          //     this.commandData = this.commandData.concat(arr);
          //     if(this.collectList.length) {
          //       this.collectList.forEach((it,i) => {
          //         this.commandData.forEach((itr,j) => {
          //           if (it == itr.id) {
          //             this.$set(this.commandData[j],'iscollect',true)
          //           }
          //         })
          //       })
          //     }
          //   }
          //   this.loading = false;
          // });
        }
      },
      getList(arrData){
        console.log(arrData);
        getCommandList('home/getGoods',arrData).then((res) => {
          console.log(res);
          if (res.data.code == 0) {

            var arr1 = [],arr = [];
            res.data.data.goods.forEach((item,i) => {
              res.data.data.goods[i].create_time = item.create_time.split(' ')[0];
            })
            if (this.pageNow == 1) {
              arr1 = res.data.data.goods;
            } else {
              res.data.data.goods.forEach((item) => {
                arr1.push(item);
              })
            }
            if (res.data.data.count <= this.pageNow* this.num) {
              this.finished = true;
            }
            this.pageNow = this.pageNow + 1;
            arr1.forEach((item,i) => {
              var str = item.pic_url + '_bc';
              var arr2 = item.pic_url.split('.');
              str = str + '.'+arr2[arr2.length-1];
              item.pic_url = str;
              arr.push(item);
            })
            this.commandData = this.commandData.concat(arr);
            if(this.collectList.length) {
              this.collectList.forEach((it,i) => {
                this.commandData.forEach((itr,j) => {
                  if (it == itr.id) {
                    this.$set(this.commandData[j],'iscollect',true)
                  }
                })
              })
            }
          }
          this.loading = false;
        }).catch((err)=>{
          // console.log(err);
        })
      },
      gotoItems(item){
        this.$router.push({
            name : 'Items',
            params: {
              content: JSON.stringify(item),
              id: item.id,
            },
          }
        )
      }
    },
    computed:{
      collectList(){
        return this.$store.state.collectList;
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/base.scss';

  .cwrap{
    width: 100%;
    .itemWrap{
      width: 100%;
      height: 500px;
      overflow: auto;
    }
    .head{
      font-size: $headFontSize;
      color: black;
      text-align: left;
      height: 50px;
      line-height: 50px;
    }
    .item{
      margin-bottom: 24px;
      width: 100%;
      box-shadow: $boxShadow;
      display: flex;
      height: 210px;
      align-items: center;
      justify-content: space-between;
      background: white;
      .leftItem{
        width: 30%;
        img{
          width: 180px;
        }
      }
      .rightItem{
        height: 100%;
        margin-top: 24px;
        padding-right: 10px;
        position: relative;
        margin-left: 10px;
        text-align: left;
        box-sizing: border-box;
        width: 70%;
        .rightHead{
          font-size: $titlefontsize;
          color: black;
          cursor: pointer;
          line-height: 22px;
          max-height: 44px;

          @include twoEllis;

        }
        .rightHead:hover{
          @include hover
        }
        .detail{
          margin: 18px 0 14px;
          font-size: 14px;
          color: #999;
          word-break: break-word;
          line-height: 18px;
          height: 36px;
          @include twoEllis;
        }
        .price{
          color: $active;
          font-size: 24px;
        }
        .bottom{
          position: absolute;
          bottom: 18px;
          left: 0;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          width: 100%;
          >div{
            display: inline-block;
          }
          .one1{
            color: #999;
            width: 36%;
          }

          .one2{
            width: 20%;
            cursor: pointer;
            color: #999;
            display: flex;
            align-items: center;
            justify-content: center;
            .collect{
              font-size: 30px;
            }
          }
          .one3{
            width: 42%;
            color: #666;
            text-align: right;
            span:nth-child(1){
              margin-right: 12px;
            }
            span:nth-child(2){
              cursor: pointer;
              display: inline-block;
              padding: 4px 12px;
              background: $active;
              color: white;
              border-radius: 6px;
              margin-left: 16px;
              margin-right: 6px;
            }
          }
        }

      }
    }
  }

</style>

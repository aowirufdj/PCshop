<template>
  <div>
    <div class="wrapContainer" ref="wrap">
      <div class="wrap5">
        <!--      推荐组件-->
        <div class="left">
          <div class="cateList" @mouseenter="isactive=true" @mouseleave="leave">
            <div :class="showAll? 'oneother': 'one'" >
              <span class="allList" v-if="!showAll" @mouseenter="showAll=true">其他分类 <i class="el-icon-arrow-down"></i></span>
              <div :class="{cateleft:true, active:activeNow == i&&isactive}" v-for="(item,i) in homeData.cates" :key="i" @mouseenter="enter(i)">
                <span :title="item.cate_name" @click="gotoCate(item.id,item.cate_name)" >{{item.cate_name}}</span>
                <i class="el-icon-arrow-right"></i>
              </div>
              <div class="cateright">
                <div class="oneline" v-for="(item,i) in cateNow" :key="i">
                  <span :title="item.cate_name" @click="gotoCate(item.id,item.cate_name)" >{{item.cate_name}}</span>
                  <span v-for="(it,j) in item.children" :key="j" @click="gotoCate(it.id,it.cate_name)"  :title="it.cate_name">{{it.cate_name}}</span>
                </div>
              </div>
            </div>
          </div>
          <Recommand></Recommand>
        </div>
        <!--      右边资讯以及精选-->
        <div class="right" id="right" @load="comput">
          <InfoOfChioce :infoList = 'homeData.article' id="right1"></InfoOfChioce>
          <HotCommand :hotGood = 'homeData.hotgoods' id="right2"></HotCommand>
<!--          <GoodsCatagary :class="isFixed ? 'isfixed' : ''" :cates="homeData.cates" id="right3"></GoodsCatagary>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {homeList} from '../api/index.js'
  import Recommand from '../components/Recommend.vue'
  import InfoOfChioce from '../components/InfoOfChioce.vue'
  import HotCommand from '../components/HotCommand.vue'
  import GoodsCatagary from '../components/GoodsCatagary.vue'
  import Brands from '../components/Brands.vue'
  export default {
    data() {
      return{
        isFixed: false,
        init: 0,
        homeData:{},
        cateNow:[],
        activeNow:0,
        isactive:false,
        showAll:false,
        cateActive:{},
        cateId : 0,
        cateName:'',
        iscate:false,
        head:'',
      }
    },
    mounted(){
      if(this.$route.query.name){
        document.title = document.title + '-' + this.$route.query.name;
      }
      this.comput();
      homeList().then((res) => {
        if (res.data.code == 0) {
          this.homeData = res.data.data;
          this.homeData.cates = this.sortArr(this.homeData.cates);
          // this.homeData.cates = this.sortArr(this.homeData.cates);
          if(this.$route.query.id){
            var id = this.$route.query.id;
            this.homeData.cates.forEach((item,i) => {
              if (item.id == id) {
                this.head = item;
              }
              if(item.children) {
                item.children.forEach((itr) => {
                  if(itr.id == id){
                    this.head = item;
                  }
                  if(itr.children) {
                    itr.children.forEach((it) => {
                      if(it.id == id){
                        this.head = item;
                      }
                    })
                  }
                })
              }
            })
          }

        }
      })

    },
    methods:{
      gotoCate(id,name){
        var op = this.$router.resolve({
            path: '/categorys',
            query: {
              id:id,
              name:name,
            }
          }
        )
        window.open(op.href,'_blank');
      },
      scroll(){
        // window.addEventListener('scroll', this.scrolling)
      },
      scrolling(){
        if (this.$route.name=='Categorys') {
          var dh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
          setTimeout(() => {
            var h1 = document.querySelector('#right1').getBoundingClientRect().height;
            var h2 = document.querySelector('#right2').getBoundingClientRect().height;
            var h3 = document.querySelector('#right3').getBoundingClientRect().height;
            var h = h1+h2+h3;
            if (dh > h) {
              this.isFixed = true
            } else {
              this.isFixed = false
            }
          }, 300)
        }
      },
      sortArr(newarr){
        //分类排序 从大到小
        for (let i = 0; i < newarr.length; i++) {
          for (let j = 0; j < newarr.length-1; j++) {
            if (newarr[j].cate_order < newarr[j+1].cate_order) {
              let pre = newarr[j];
              newarr[j] = newarr[j+1];
              newarr[j+1] = pre;
            }
          }
        }
        return newarr;
      },
      dueLis(){
        // 有二级分类
        if (this.homeData.cates[this.activeNow].children) {
          // 二级分类排序
          this.homeData.cates[this.activeNow] = this.sortArr(this.homeData.cates[this.activeNow]);
          if (this.homeData.cates[this.activeNow].children.children) {
            this.homeData.cates[this.activeNow].children.children = this.sortArr(this.homeData.cates[this.activeNow].children.children);
          }
        }
      },
      comput() {
        this.scroll()
      },
      enter(i){
        this.cateNow = this.homeData.cates[i].children;
        this.dueLis();
        this.activeNow = i;
        this.isactive = true;
      },
      leave(){
        this.isactive=false;
        this.showAll = false;
        this.cateNow = [];
      },
    },
    destroyed(){
      window.removeEventListener("scroll",this.scrolling);
    },
    components:{
      Recommand,
      InfoOfChioce,
      HotCommand,
      GoodsCatagary,
      Brands,
    },
    name: 'Home'
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
  .wrapContainer{
    @include initWrap
  }
  .wrap{
    display: block;
    margin-bottom: 20px;
    position: relative;
    width: 100%;
    .navwrap{
      position: absolute;
      left: 0;
      top: 0;
    }
    .leftNav{
      position: absolute;
      left:0;
      top: 0;
      z-index: 3000;
      width: 256px;
      background: rgba(255,255,255,0.7);
      .leftNavWrap{
        margin: 14px 0 50px;
        transition: 500ms ease-in-out;
        >div{
          height: 38px;
          line-height: 38px;
          width: 100%;
          margin: 0 auto;
          font-weight: 400;
          text-indent: 4em;
          text-align: left;
          font-size: 16px;
          color: #333;
          cursor: pointer;
        }
        >div:hover{
          font-weight: 500;
          color: black;
          background: #ddd;
        }
      }
      .more{
        position: absolute;
        text-align: center;
        font-size: 16px;
        display: inline-block;
        width: 100%;
        left: 0;
        bottom: 4px;
        color: #999;
        .down{
          color: #999;
        }
      }
    }
    .rightView{
      position: absolute;
      left: 256px;
      top: 0;
      width: 300px;
      z-index: 3000;
      background: rgba(255,255,255,0.7);
    }
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }
  .content{
    width: 100%;
    display: block;
  }
  .wrap5{
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    .left{
      width: 56%;
      .cateList{
        margin-top: 22px;
        width: 100%;
        .one {
          text-align: left;
          position: relative;
          padding: 10px;
          height: 21px;
          overflow: hidden;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .oneother{
          text-align: left;
          position: relative;
          padding: 10px;
          box-shadow: $boxShadow;
        }
        .allList{
          position: absolute;
          right: 10px;
        }
          span{
            cursor: pointer;
          }
          .cateleft{
            width: 200px;
            position: relative;
            @include ellipse;
            margin-bottom: 10px;
            span{
              color: #222;
            }
            i{
              position: absolute;
              right: 4px;
              color: #999;
              top: 8%;
              font-size: 20px;
            }

          }
          .cateleft.active{
            span,i{
              color: $themeColor;
            }
          }
          .cateright{
            position: absolute;
            left: 210px;
            width: 470px;
            top: 12px;
            .oneline{
              margin-bottom: 10px;
              span{
                display: inline-block;
                max-width: 130px;
                @include ellipse;
                margin-right: 8px;
                line-height: 16px;
                color: #999;
              }
              span:first-child{
                color: #222;
              }
              span:hover{
                color: $themeColor;
              }
            }

          }
      }
    }
    .right{
      width: 40%;
    }
  }
</style>

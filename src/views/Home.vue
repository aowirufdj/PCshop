<template>
  <div>
<!--    头部组件-->
    <div class="wrapContainer" ref="wrap">
      <div class="wrap">
        <div class="navwrap" @mouseenter = 'hover()' @mouseleave = 'leaveHover()'>
          <div class="leftNav" :style="{height:isHover ? 'auto' : '358px'}" ref="nav">
            <div class="leftNavWrap" :style="{height:isHover ? 'auto' : '294px',overflow: isHover? 'auto':'hidden'}">
              <span class="more">更多<i class="el-icon-caret-bottom down"></i></span>
              <div v-for="(item, i) in homeData.cates" :class="isHover&&hoverNow == i ? 'hover':''" :title="item.cate_name" :key="i" @mouseenter = 'hoverList(i)' @click="gotoCate(item.id,item.cate_name)">
                {{item.cate_name}}
              </div>
            </div>
          </div>
          <div class="rightView" v-if="isHover" :style="{height: heightRight + 'px'}">
            <div class="rightWrap clearfix">
              <div class="oneItem" v-for="(arr, j) in rightArr" :key="j">
                  <div class="one" v-for="(itr, k) in arr" :key="k"  @click="gotoCate(itr.id,itr.cate_name)">
                    <p class="title" :title="itr.cate_name"  @click="gotoCate(itr.id,itr.cate_name)">{{itr.cate_name}}</p>
                    <p class="oneTip" v-for="(it, j) in itr.children" :key="j"  @click="gotoCate(it.id,it.cate_name)" :title="it.cate_name">{{it.cate_name}}</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <el-carousel class="swip">
          <el-carousel-item v-for="(item1, i) in homeData.pics" :key="i">
            <a :href="item1.href" target="_blank">
              <img class="one" :src="$host + item1.url" alt="">
            </a>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="wrap5">
        <!--      推荐组件-->
        <div class="left">
          <Recommand></Recommand>
        </div>
        <!--      右边资讯以及精选-->
        <div class="right" @load="comput">
          <InfoOfChioce :infoList = 'homeData.article' id="right1"></InfoOfChioce>
          <HotCommand :hotGood = 'homeData.hotgoods' id="right2"></HotCommand>
          <GoodsCatagary :class="isFixed ? 'isfixed' : ''" :cates="homeData.cates" id="right3"></GoodsCatagary>
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
export default {
    name: 'Home',
    components:{
      Recommand,
      InfoOfChioce,
      HotCommand,
      GoodsCatagary,
    },
    data() {
      return{
        item: [1,2,3,4],
        imgHeight: 200,
        isHover: false,
        isScroll: false,
        isFixed: false,
        init: 0,
        homeData:{},
        hoverNow: 0,
        heightRight: 358,
        splitArr: 0,
        rightArr:[
          [],[],[]
        ],
        rangArr:[],
        absArr:[],
        indexNow: 0,
        changValue: false,
      }
    },
  mounted(){
    this.comput()
    homeList().then((res) => {
      if (res.data.code == 0) {
        var data = res.data.data,arr=[];

        data.hotgoods.forEach((item,i) => {
          var str = item.pic_url + '_bc';
          var arr2 = item.pic_url.split('.');
          str = str + '.'+arr2[arr2.length-1];
          item.pic_url = str;
          arr.push(item);
        })
        data.hotgoods = arr;
        this.homeData = data;
        this.homeData.cates = this.sortArr(this.homeData.cates);
        console.log(this.homeData.cates);
      }
    })
  },
  methods:{
    gotoCate(id,name){
      this.$router.push({
          path: '/categorys',
          query: {
            id:id,
            name:name,
          }
        }
      )
    },
    scroll(){
        window.addEventListener('scroll', this.scrolling)
    },
    scrolling(){
      if (this.$route.name=='Home') {
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
    eachArr(){
      if (this.homeData.cates[this.hoverNow].children) {
        if (this.homeData.cates[this.hoverNow].children.length >= 1) {
          this.homeData.cates[this.hoverNow].children.forEach((itr, k) => {
            // 取到每一个二级分类
            this.rangArr[k] = this.computArr(itr);
          })
          var sum = 0;
          this.rangArr.forEach(item =>{
            sum = sum + item;
          })
          this.splitArr = Math.floor(sum / 3);
          this.changeArr();
          // 计算完每个二级分类高度后塞进数组里
        }
      }
    },
    computArr(data){
      if (data.children.length >= 1) {
        //当有多个三级目录时
        return 1 + data.children.length;
      } else {
        return 1;
      }
    },
    changeArr(){
      this.absArr = [];
      this.change(this.rangArr[0], 0);
    },
    change(item, i){
      var b = i+1;
      var a = item + this.rangArr[b];
      if (item < this.splitArr) {
        if (i < this.rangArr.length) {
          this.change(a, b)
        } else {
          return;
        }
      } else {
        this.absArr.push(i);
        this.indexNow = b;
        this.changValue = !this.changValue;
      }
    },
    comput() {
      this.scroll()
    },
    // resize(){
    //   window.onresize = () =>{
    //     this.$nextTick(() => {
    //       this.imgHeight = this.$refs.wrap.clientWidth/this.$refs.height1[0].width*this.$refs.height1[0].height;
    //     })
    //   }
    // },
    hover() {
      this.isHover = !this.isHover;
      if (this.isHover) {
        setTimeout(() => {
          this.heightRight = this.$refs.nav.offsetHeight;
        })
      }
    },
    hoverList(i){
      this.rangArr = [];
      this.hoverNow = i;
      // 一级分类排序
      this.rightArr = [
        [],[],[]
      ];
      this.eachArr();
    },
    leaveHover(){
      this.isHover = false;
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
      if (this.homeData.cates[this.hoverNow].children) {
        // 二级分类排序
        this.homeData.cates[this.hoverNow] = this.sortArr(this.homeData.cates[this.hoverNow]);
        // 第一段
        this.homeData.cates[this.hoverNow].children.forEach((cate, a) => {
          if (a <= this.absArr[0]) {
            var cat = this.sortArr(cate)
            this.rightArr[0].push(cat);
          }
        })

        // 第二段
        this.homeData.cates[this.hoverNow].children.forEach((cate, a) => {
          if (a >this.absArr[0] && a <= this.absArr[1]) {
            var cat = this.sortArr(cate)
            this.rightArr[1].push(cat);
          }
        })

        // 第三段
        this.homeData.cates[this.hoverNow].children.forEach((cate, a) => {
          if (a >this.absArr[1]) {
            var cat = this.sortArr(cate)
            this.rightArr[2].push(cat);
          }
        })
      }
    },
    // loadImg(){
    //   this.imgHeight = this.$refs.wrap.clientWidth/this.$refs.height1[0].width*this.$refs.height1[0].height;
    // }
  },
  watch:{
    changValue:function (newVal, oldVal) {
      if (newVal) {
        if (this.indexNow < this.rangArr.length) {
          this.change(this.rangArr[this.indexNow], this.indexNow);
          if (this.absArr.length >= 2) {
            this.dueLis();
          }
        }
      }
    }
  },
  computed:{
  },
  destroyed(){
    window.removeEventListener("scroll",this.scrolling);
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
  .wrapContainer{
    @include initWrap
  }
  .wrap{
    margin-bottom: 2px;
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .navwrap{
      position: relative;
    }
    .swip{
      background: white;
      width: 936px;
      height: 358px;
      .el-carousel__item{
        height: 358px;
      }
      a{
        display: inline-block;
        width: 936px;
        height: 358px;
      }
      .one{
        width: 936px;
        height: 358px;
      }
    }
    .leftNav{
      position: absolute;
      left:0;
      top: 0;
      background: white;
      z-index: 1000;
      width: 256px;
      .leftNavWrap{
        margin: 14px 0 50px;
        transition: 500ms ease-in-out;
        >div{
          height: 38px;
          line-height: 38px;
          width: 100%;
          margin: 0 auto;
          font-weight: 400;
          text-indent: 2em;
          text-align: left;
          font-size: 14px;
          color: #333;
          cursor: pointer;
        }
       .hover{
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
      width: 800px;
      height: 100%;
      z-index: 1000;
      background: white;
      .rightWrap{
        display: flex;
        width: 800px;
        margin: 14px 0;
        .oneItem{
          width: 33.33%;
          border-right: 1px solid #ccc;
          .one{
            p{
              padding-left: 1em;
              max-width: 90%;
              overflow: hidden;
              word-break: keep-all;
              text-align: left;
              line-height: 16px;
              font-size: 14px;
              margin: 12px 0;
            }
            .title{
              font-weight: bolder;
              position: relative;
              color: #000;
            }
            .title::after{
              content: '';
              position: absolute;
              top: 0;
              width: 2px;
              left: 2px;
              height: 20px;
              background: $themeColor;
            }
            .oneTip{
              font-weight: 400;
              text-align: left;
              color: #9f9d9d;
              cursor: pointer;
            }
            >p{
              margin-left: 40px;
              cursor: pointer;
            }
            >p:hover{
              @include hover
            }
          }
          .one:last-child{
            border-right: none;
          }
        }
        .oneItem:last-child{
          border-right: none;
        }
      }
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
      width: 58%;
    }
    .right{
      width: 40%;
    }
  }
</style>
<style>
  .wrap .el-carousel__button{
    width: 24px;
    height: 4px;
    border-radius: 2px;
    background: white;
  }
  .wrap .is-active .el-carousel__button{
    background: red;
  }
</style>

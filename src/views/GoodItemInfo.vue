<template>
  <div class="goodWrap">
    <Nav :title="title"></Nav>
    <div class="wrapContainer" ref="wrap">
      <div class="wrap5">
        <!--      好价资讯-->
        <div class="left">
          <GoodPriceCommand></GoodPriceCommand>
        </div>
        <!--      右边热门排行-->
        <div class="right">
          <HotRange></HotRange>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import GoodPriceCommand from '../components/GoodPriceCommand.vue'
  import HotRange from '../components/HotRange.vue'
  import Nav from '../components/Nav.vue'
  export default {
    data() {
      return{
        isFixed: false,
        init: 0,
        title:{
          title: '好物资讯',
          name: ''
        }
      }
    },
    mounted(){
    },
    methods:{
    },
    components:{
      GoodPriceCommand,
      HotRange,
      Nav,
    },
    name: 'Home'
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
  .goodWrap{
    @include initWrap
  }
  .wrapContainer{

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
    }
    .right{
      width: 40%;
    }
  }
</style>

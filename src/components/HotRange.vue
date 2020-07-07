<template>
  <div class="cwrap">
    <div class="head">
      热门排行
    </div>
    <div class="newWrap">
      <div class="item" v-for="item in list" :key="item" :title="item" @click="gotoItems">
        <div class="leftItem">
          <img src="../assets/img/downApp.png" alt="">
        </div>
        <div class="rightItem">
          <p class="rightHead">
            超级简约台灯
          </p>
          <p class="detail">
            45654646545465454564456546465454654545644565464654546545456445654646545465454564456546465454654545644565464654546545456445654646545465454564

          </p>
          <p class="time"><span>发布时间 </span> 2020-5-4</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'HotRange',
    data(){
      return{
        list: [1,2,3,4],
        loading: false,
        finished: false,
      }
    },
    methods:{
      gotoItems(){
        this.$router.push(
          '/items'
        )
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/base.scss';

  .cwrap{
    width: 100%;
    .newWrap{
      border: 1px solid #ddd;
    }
    .itemWrap{
      width: 100%;
      height: 500px;
      overflow: auto;
    }
    .head{
      font-size: $headFontSize;
      color: black;
      text-align: left;
      height: 70px;
      line-height: 70px;
    }
    .item{
      display: flex;
      height: 150px;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      width: 98%;
      margin:0 auto 28px;

      .leftItem{
        width: 30%;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          height: 124px;
          width: auto;
        }
      }
      .rightItem{
        height: 100%;
        padding: 20px 0;
        position: relative;
        margin-left: 10px;
        text-align: left;
        box-sizing: border-box;
        width: 70%;
        .rightHead{
          font-size: 18px;
          color: black;
          cursor: pointer;
        }
        .rightHead:hover{
          @include hover
        }
        .detail{
          margin: 11px 0;
          font-size: 16px;
          color: #999;
          max-width: 96%;
          overflow: hidden;
          word-break: break-word;
          line-height: 22px;
          max-height: 48px;
          text-overflow: ellipsis;
        }
        .time{
          max-width: 94%;
          text-align: right;
          color: #999;

          span{
            margin-right: 8px;
          }
        }
      }
    }
    .item:last-child{
      border-bottom: none;
    }
  }

</style>

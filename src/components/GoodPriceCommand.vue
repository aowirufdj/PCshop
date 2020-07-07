<template>
  <div class="cwrap">
    <div class="head">
      好价推荐
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
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
    </van-list>
  </div>
</template>

<script>
  export default {
    name: 'GoodPriceCommand',
    data(){
      return{
        list: [],
        loading: false,
        finished: false,
      }
    },
    methods:{
      onLoad() {
        // 异步更新数据
        // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            this.list.push(this.list.length + 1);
          }

          // 加载状态结束
          this.loading = false;

          // 数据全部加载完成
          if (this.list.length >= 40) {
            this.finished = true;
          }
        }, 1000);
      },
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
      margin-bottom: 28px;
      width: 100%;
      box-shadow: $boxShadow;
      display: flex;
      height: 150px;
      align-items: center;
      justify-content: space-between;
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
          max-width: 90%;
          overflow: hidden;
          word-break: break-word;
          line-height: 22px;
          max-height: 48px;
          text-overflow: ellipsis;
        }
        .time{
          max-width: 90%;
          text-align: right;
          color: #999;
          padding-right: 4em;
          span{
            margin-right: 8px;
          }
        }
      }
    }
  }

</style>

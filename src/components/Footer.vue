<template>

  <div class="foot">
    <div class="footwrap">
      <div class="word">
        <p>联系电话：45454545</p>
        <p>公司地址：的话就是咖啡会尽快的撒附近</p>
      </div>

      <div class="qrdown">
        <img src="../assets/img/downApp.png" alt="">
        <span>下载手机版</span>
      </div>
    </div>
  </div>


</template>

<script>
  export default {
    name:'Footer'
  }
</script>

<style lang="scss" scoped>
@import "../assets/css/base.scss";
  .foot{
    margin-top: 100px;
    flex: 0 0 auto;
    clear: both;
    box-shadow:0px -2px 7px 1px #919191;
    height: 140px;
    width: 100%;
    position: relative;
    bottom: 0;
    .footwrap{
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      height: 140px;
      position: relative;
    }
    .word{
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      p{
        font-size: 22px;
        color: #999;
        text-align: left;
        height: 50px;
        line-height: 50px;
      }
    }
    .qrdown{
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      top: -44%;
      img{
        width: 150px;
      }
      span{
        font-size: 20px;
        color: #999;
        margin-top: 8px;
      }
    }
  }
</style>

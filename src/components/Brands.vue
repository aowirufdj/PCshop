<template>
  <div class="bwrap">
    <div class="item">
    <img src="../assets/img/downApp.png" alt="">
    <span>淘宝</span>
  </div>
    <div class="item">
      <img src="../assets/img/downApp.png" alt="">
      <span>淘宝</span>
    </div>
    <div class="item">
      <img src="../assets/img/downApp.png" alt="">
      <span>淘宝</span>
    </div>
    <div class="item">
      <img src="../assets/img/downApp.png" alt="">
      <span>淘宝</span>
    </div>
    <div class="item">
      <img src="../assets/img/downApp.png" alt="">
      <span>淘宝</span>
    </div>
    <div class="item">
      <img src="../assets/img/downApp.png" alt="">
      <span>淘宝</span>
    </div>
    <div class="item">
      <img src="../assets/img/downApp.png" alt="">
      <span>淘宝</span>
    </div>
    <div class="item">
      <img src="../assets/img/downApp.png" alt="">
      <span>淘宝</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Brands'
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
  .bwrap{
    overflow: hidden;
    width: 100%;
    margin-top: 30px;
    .item{
      cursor: pointer;
      user-select: none;
      float: left;
      margin: 10px 32px 20px 0;
      font-size: 20px;
      display: flex;
      align-items: center;
      :hover{
        color: $active;
        text-decoration: underline $active;
      }
      img{
        margin-right: 8px;
        height: 40px;
      }
    }
  }
</style>

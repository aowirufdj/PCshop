<template>
  <div class="loading" @click="$store.state.loading = false">
    <img :src="src" alt="">
    <p>{{loading}}</p>
  </div>
</template>

<script>
  var img1 = require('../assets/img/1.png');
  var img2 = require ('../assets/img/2.png');
  export default {
    name: 'Loading',
    data(){
      return{
        loading:'loading',
        src: img1,
        loadingPoint:1,
      }
    },
    mounted(){
      this.waving();
    },
    methods:{
      waving(){
        var self = this;
        var show = setInterval(function () {
          self.src = self.src == img1 ? img2 : img1;
          var point = '';
          for(var i=0;i<self.loadingPoint;i++ ) {
            point += '.';
          }
          self.loading = 'loading' + point;
          self.loadingPoint = self.loadingPoint-0 + 1;
          if(self.loadingPoint>5){
            self.loadingPoint = 1;
          }
        }, 200)
        setTimeout(function () {
          self.$store.state.loading = false;
          clearInterval(show);
        }, 10000)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
  .loading{
    width: 200px;
    height: 212px;
    position: fixed;
    z-index: 2100;
    top: 20%;
    right: 0;
    left: 0;
    margin: auto;
    background: rgba(249, 205, 53, 0.6);
    border-radius: 13%;
    img{
      width: 160px;
      margin: 20px 20px 0 20px;
    }
    p{
      text-align: center;
      font-size: 16px;
      color: #4f4545;
      font-style: oblique;
      line-height: 4px;
    }
  }
</style>

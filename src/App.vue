<template>
  <div id="app">
    <Header></Header>
    <router-link to="/"></router-link>
    <Login v-if="$store.state.showLogin"></Login>

    <Loading v-if="$store.state.loading"></Loading>
    <keep-alive>
      <router-view class="main-lay" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view class="main-lay" v-if="!$route.meta.keepAlive"></router-view>
    <vue-progress-bar></vue-progress-bar>
    <Footer></Footer>
  </div>
</template>
<script>
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'
  import Login from './components/Login.vue'
  import Loading from './components/Loading.vue'
  export default {
    data(){
      return{
        top: 0,
        canchange: true,
      }
    },
    components:{
      Header,
      Footer,
      Login,
      Loading,
    },
    mounted() {
      this.top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      window.addEventListener('scroll', this.handleScroll);
    },
    methods:{
      handleScroll : function() {
        if (this.canchange) {
          this.canchange = false;
          setTimeout(() => {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop >= this.top && scrollTop > 120) {
              this.$store.state.hideAppDown = true;
            } else {
              this.$store.state.hideAppDown = false;
            }
            this.canchange = true;
          },300)
        }
      }
    },
  }
</script>
<style lang="scss">
#app {
  /*font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;*/
  font-family: Roboto, "Helvetica Neue", Helvetica, Arial, 文泉驛正黑, "WenQuanYi Zen Hei", "Hiragino Sans GB", "儷黑 Pro", "LiHei Pro", "Heiti TC", 微軟正黑體, "Microsoft JhengHei UI", "Microsoft JhengHei", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height:100vh;
  display: flex;
  flex-direction: column;
}
.main-lay{
  flex: 1 0 auto;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<template>
  <div style="height: 92px">
    <el-header class="head" height="92px" :style="{marginTop:hideAppDown ? '-32px' : '0'}">
      <div class="downApp">
        <div class="left">
          <img src="../assets/img/downApp.png" alt="">
          <span>{{$t('head.downApp')}}</span>
        </div>
        <div class="right right2" v-if="!$store.state.user.id"  @click="$store.state.showLogin = true">
          <i class="el-icon-user-solid user"></i>
          <span>
            {{$t('head.login')}}
          </span>
        </div>
        <div class="right" v-if="user && $store.state.user.id"  @click="gotoUser($store.state.user.id)">
          <el-dropdown @command="handleCommand" class="drop">
            <span style="height: 26px;display: inline-block;line-height: 24px">
              <img v-if="$store.state.user.member_avatar" :src="$host + $store.state.user.member_avatar" alt="">
            <img v-if="!$store.state.user.member_avatar" :src="$host + $cookies.get('otherAvatar')" alt="">
            {{$store.state.user.member_nickname}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/personInfo/editInfo">账户</el-dropdown-item>
              <el-dropdown-item command="/personInfo/orderMessage">订单信息</el-dropdown-item>
              <el-dropdown-item command="/personInfo/collects">我的收藏</el-dropdown-item>
              <el-dropdown-item command="logout" style="border-top: 1px dashed #ddd">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>
<!--        <el-select size="mini" class="selectLang" v-model="language" :placeholder="$t('head.name')" @change="selectLanguage">-->
<!--          <el-option-->
<!--            v-for="item in ls"-->
<!--            :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
      </div>
      <div class="headContentWrap">
        <div class="headContent">
          <router-link to="/">
            <img class="logo" src="../assets/img/logo2.png" alt="">
          </router-link>
          <div class="input">
            <el-input
              class="text"
              placeholder="请输入商品网址搜索商品"
              v-model="url"
              @keyup.enter.native='getByUrls'
              clearable>
            </el-input>
            <span @click="getByUrls">{{$t('head.search')}}</span>
          </div>

          <div class="rightContent" @mouseenter="hoverCart = true" @mouseleave="hoverCart = false" @click="gotoShopCart">
            <!--          <div @click="$store.state.showLogin = true">-->
            <!--            <img src="../assets/img/login.png" alt="">-->
            <!--            <span>{{$t('head.login')}}</span>-->
            <!--          </div>-->
            <el-badge :value="cartNum" :class="hoverCart?'isactive':''" >
              <img class="cart" src="../assets/img/shopCart.png" alt="">
            </el-badge>
            <!--          <router-link class="rtl" target="_blank" to="/personInfo">-->
            <!--            <span>{{$t('head.search')}}</span>-->
            <!--          </router-link>-->
          </div>
        </div>
      </div>
    </el-header>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import {getByUrl,publicPost} from  '../api/index.js';
  import cookie from 'vue-cookies'
export default {
  name: 'Header',
  data() {
    return {
      input: '',
      url: '',
      hoverCart:false,
      language: cookie.get('lang') || 'cn',
      ls:[
        {
          value: 'cn',
          label: '中文'
        }, {
          value: 'en',
          label: 'English',
        }
      ],
    }
  },
  computed:{
    ...mapState(['lang', 'hideAppDown','cartNum','user'])
  },
  methods:{
    handleCommand(path){
      if(path == 'logout'){
        this.$confirm('确认退出登录?',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$cookies.remove('user');
          this.$store.commit('logOut');
          this.$router.push({
            name:'Home'
          })
          this.$message({
            type:'success',
            message:'退出登录成功',
          })
        }).catch(() => {
        });
      }  else {
        this.$router.push({
          path:path,
        })
      }
    },
    gotoShopCart(){
      console.log('a');
      this.$router.push({
        path:'/shopCart',
      })
    },
    gotoUser(id){
      this.$router.push({
          path: '/personInfo',
          query: {
            id:id
          }
        }
      )
    },
    selectLanguage: function () {
      if (this.$cookies.get('lang') != this.language) {
        if (this.language == 'en') {
          this.$i18n.locale = 'en';
        } else {
          this.$i18n.locale = 'cn';
        }
        this.$store.commit('switchLang', this.language)
      }

      // if (this.$cookies.get('lang') != this.language) {
      //   this.$store.commit('switchLang', this.language)
      //   this.$i18n.locale = this.language;
      // }
    },
    getByUrls : function () {
      if (this.url.length && this.url.trim().length > 1) {
        this.$store.state.loading = true;
        getByUrl(this.url).then((res) => {
          this.$store.state.loading = false;
          if (res.data.code == 0) {
            var obj = unescape(res.data.data.replace(/\\u/gi, '%u'));
            window.localStorage.setItem('content',obj);
            console.log(this.$route);
            if (this.$route.name=='Items') {
              this.$router.push({
                  name : 'Items',
                  params: {
                    id: 'diy',
                  },
                }
              )
              // setTimeout(() => {
              //   this.$store.state.keyReload = !this.$store.state.keyReload;
              // },30)
            } else {
              // var op = this.$router.resolve({
              //     name : 'Items',
              //     params: {
              //       id: 'diy',
              //     },
              //   }
              // )
              // window.open(op.href,'_blank');
              this.$router.push({
                  name : 'Items',
                  params: {
                    id: 'diy',
                  },
                }
              )
            }

            // else {
            //   this.$router.push({
            //       name : 'Items',
            //       params: {
            //         content: obj,
            //         id: 'diy',
            //       },
            //     }
            //   )
            // }
          } else {
            this.$store.state.loading = false;
            this.$message('搜索商品失败');
          }
        }).catch((err) => {
          this.$store.state.loading = false;
          console.log(err);
          this.$message('获取不到商品信息,请与客服反馈')
        })
      }
    }
  },
  mounted() {
    if(this.user && this.user.id && !this.$store.state.cartNum) {
      this.$store.dispatch('getCartNum');
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../assets/css/base.scss";
  .head{
    flex: 0 0 auto;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1999;
    background: white;
    padding: 0;
    -moz-box-shadow:0px 3px 4px 0px #8F8F8F;
    -webkit-box-shadow:0px 3px 4px 0px #8F8F8F;
    box-shadow:0px 3px 4px 0px #8F8F8F;
    transition: margin-top 50ms ease-in-out;
    .selectLang{
      position: absolute;
      right: 0;
      top: 2px;
      .el-popper{
        z-index: 88888888;
      }
    }
  }
  .left{
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      margin-right: 10px;
      width: 26px;
    }
  }
  .right{
    cursor: pointer;
    user-select: none;
    margin-right: 8px;
    img{
      height: 26px;
      border-radius: 50%;
    }
  }
  .right2{
    color: #888;
    display: flex;
    align-items: center;
    span{

      margin-left: 2px;
    }
    .user{
      font-size: 21px;


    }
  }
  .left:hover, .right:hover{
    color: #aaa;
  }
  .downApp{
    position: relative;
    color: $active;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    max-width: 1200px;
    margin: 0 auto;

    .rightL{
      position: relative;
      z-index: 2000004;
    }
  }
  .headContentWrap{
    width: 100%;
    background: RGB(249,205,53);
  }
  .headContent{
    max-width: 1200px;
    margin: 0 auto;
    height: 60px;
    background: RGB(249,205,53);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .logo{
      height: 52px;
    }
    .input{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      width: calc(100% - 600px);
      max-width: 960px;
      min-width: 320px;
      display: flex;
      align-items: center;
      justify-content: center;
      /*overflow: hidden;*/
      /*-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box;*/
      height: 34px;
      outline: none;
      font-size: 13px;
      color: #333;
      .text{


      }
      span{
        cursor: pointer;
        display: inline-block;
        height: 36px;
        border-radius: 0 5px 5px 0;
        line-height: 36px;
        width: 10%;
        text-align: center;
        background: RGB(255,64,66);
        color: white;
        user-select: none;
        overflow: hidden;
      }
    }
    >img{

    }
    .rightContent{
      display: flex;
      align-items: center;
      justify-content: center;
      >div, .rtl{
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        img{
          width: 30px;
          margin-right: 6px;
        }
      }
      >div:hover{
        color: $active;
      }
      >div:first-child{
        margin-right: 8px;
      }
      .rtl:hover{
        color: $active;
      }
      .rtl:first-child{
        margin-right: 30px;
      }
    }
  }
</style>
<style>
  .rightContent .el-badge__content.is-fixed{
    right: 15px;
  }
  .rightContent .isactive .el-badge__content{
    background: white;
    color: #F56C6C;
    border-color: #F56C6C;
  }
  .headContentWrap .headContent .input .el-input__inner{
    background: RGB(253,239,213);
    border-radius: 5px 0 0 5px;
    border: 1px solid RGB(255,64,66);
    height: 36px;

  }
  .headContentWrap .headContent .input .el-input{
    height: 37px;
  }
  .headContentWrap .headContent .el-input__inner::placeholder{
    color: #999;
  }
</style>

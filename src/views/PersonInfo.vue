<template>
<div>
  <div class="infowrap">
    <div class="head">
      <span>首页 > 账户信息</span>
    </div>
    <div class="infoContent">
      <div class="infoLeft">
        <div class="userAvatar clearfix">
<!--          <i v-if="!userInfo.member_avatar" class="el-icon-user-solid img"></i>-->

            <img v-if="member_avatar" :src="$host + member_avatar" alt="">

          <div class="text">
            <p class="name">{{userInfo.member_nickname}}</p>
<!--            <router-link to='/personInfo/editInfo'>-->
<!--              <p class="edit" @click="editNow(span55)" :class="titleNow == span55 || showNow == span55 ? 'active' : ''"-->
<!--                 @mouseenter="enter(span55)" @mouseleave="leave(span55)">{{span55}}</p>-->
<!--            </router-link>-->
            <p class="edit" @click="showChangePass = true">更改密码</p>
            <p class="edit" v-if="logOut" @click="logOutNow">退出登录</p>
          </div>
        </div>
        <div class="manage">
          <div class="mhead"><span></span><span>{{userData.title}}</span></div>
          <div class="list">
            <div v-for="(item,i) in userData.data" @mouseenter="enter(item.title)" @mouseleave="leave(item.title)" :key="i" @click="editNow(item.title)">
              <router-link :to="item.route">
                <img :src="path==item.route ? item.img2 :item.img1" alt="">
                <span :class="path==item.route ? 'active' : ''">{{item.title}}</span>
              </router-link>

            </div>
          </div>
        </div>
        <div class="manage">
          <div class="mhead"><span></span><span>{{manageData.title}}</span></div>
          <div class="list">
            <div v-for="(it, t) in manageData.data" @mouseenter="enter(it.title)" @mouseleave="leave(it.title)" @click="editNow(it.title)" :key=t>
              <router-link :to="it.route">
                <img :src="path == it.route ? it.img2 :it.img1" alt="">
                <span :class="path == it.route? 'active' : ''">{{it.title}}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="infoRight">
        <div class="infohead">
          <span>{{showNow}}</span>
        </div>
        <div class="pad">
          <router-view></router-view>
<!--          <EditInfo v-show="showNow == span55 || showNow == manageData.data[0].title" @changeAvatar="changeAvatar" :userInfo="userInfo"></EditInfo>-->
<!--          <OrderMessage v-if="showNow == userData.data[0].title"></OrderMessage>-->
<!--          <Locations v-if="showNow == userData.data[1].title"></Locations>-->
<!--          <Collects v-if="showNow == manageData.data[1].title"></Collects>-->
        </div>
      </div>
    </div>
  </div>
  <div class="changePass" v-if="showChangePass">
    <el-form :model="ruleForm" label-width="100px">
      <el-form-item label="验证码" prop="valiCode">
        <el-input v-model.number="ruleForm.valiCode">
          <span slot="suffix" class="getVali" @click="getOtherVali">{{showTime}}</span>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" class="bbx">
        <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="valiPassword" class="bbx">
        <el-input type="password" v-model="ruleForm.valiPassword" autocomplete="off"></el-input>
      </el-form-item>

        <el-button type="primary" @click="submitChangePass">提交</el-button>
        <el-button class="btn2" @click="showChangePass = false">取消</el-button>

    </el-form>
  </div>
</div>
</template>

<script>
  import {getPersonInfo,publicPost} from '../api/index.js'
  import EditInfo from '../components/EditInfo.vue'
  import OrderMessage from '../components/OrderMessage.vue'
  import Locations from '../components/Locations.vue'
  import Collects from '../components/Collects.vue'
  import Data from '../assets/js/userdata.js'
  export default {
    name: 'PersonInfo',
    data(){
      return{
        showChangePass:false,
        showTime: '获取验证码',
        ruleForm:{
          valiCode:'',
          newPassword:'',
          valiPassword:'',
        },
        span55: '修改账户',
        userData : Data.userData(),
        manageData : Data.manageData(),
        titleNow: '',
        showNow: '账户信息',
        userInfo:{},
        logOut:false,
        member_avatar:'',
        path:'',
      }
    },
    mounted(){
      // if (document.title.indexOf('-')) {
      //   document.title = document.title.split('-')[0] + '-'+ this.showNow;
      // } else {
      //   document.title = document.title + '-'+ this.showNow;
      // }
      this.due();
      this.changeAvatar();
      this.$cookies.get('user').id ? this.logOut = true : this.logOut =false;
    },
    methods:{
      due(){
        this.path = this.$route.path;
        this.userData.data.forEach((item,i) => {
          if(item.route == this.path) {
            this.showNow = item.title;
          }
        })
        this.manageData.data.forEach((item,i) => {
          if(item.route == this.path) {
            this.showNow = item.title;
          }
        })
      },
      getOtherVali(){
        if (this.showTime == '获取验证码') {
          this.showTime = '30';
          var tt = setInterval(() => {
            this.showTime = this.showTime - 1;
            if (this.showTime < 0) {
              this.showTime = '获取验证码';
              clearInterval(tt);
            }
          }, 1000)
          publicPost('user/changePwd',[{id:this.$cookies.get('user').id}, {token:this.$cookies.get('user').token}]).then((res) =>{
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
            } else {
              this.$message({
                message: res.data.msg,
              });
            }
          })
        }
      },

      submitChangePass(){
        if(this.ruleForm.valiCode&& this.ruleForm.newPassword&&this.ruleForm.valiPassword) {
          if(this.ruleForm.newPassword==this.ruleForm.valiPassword) {
              publicPost('user/changePwd',[{code:this.ruleForm.valiCode},{new_pwd:this.ruleForm.newPassword},
                {id:this.$cookies.get('user').id}, {token:this.$cookies.get('user').token}]).then((res) => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.msg,
                    type: 'success'
                  });
                  this.showChangePass = false;
                } else {
                  this.$message({
                    message: res.data.msg,
                  });
                }
              })
          } else {
            this.$message('请确认两次密码是否相同')
          }
        }
      },

      changeAvatar(){
        this.member_avatar = this.$cookies.get('user').member_avatar;
      },
      logOutNow(){
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
      },
      enter(title){
        if (title != this.showNow) {
          this.titleNow = title;
        }
      },
      updateAccount(){
      },
      leave(title){
        if (title != this.showNow) {
          this.titleNow = ''
        }
      },
      editNow(title){
       this.titleNow = title;
        this.showNow = title;
        this.due();

        // if (document.title.indexOf('-')) {
        //   document.title = document.title.split('-')[0] + '-'+ this.showNow;
        // } else {
        //   document.title = document.title + '-'+ this.showNow;
        // }
      }
    },
    components:{
      EditInfo,
      OrderMessage,
      Locations,
      Collects
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
.infowrap{
  @include initWrap;
  background: white;
  .head{
    @include head;
  }
  .infoContent{
    margin: 10px 0;
    border-top: 1px solid #ccc;
    user-select: none;
    overflow: hidden;
    position: relative;
    .infoLeft{
      width: 210px;
      float: left;
      border-right: 1px solid #ccc;
      padding-left: 2em;
      box-sizing: border-box;
      .userAvatar{
        width: 100%;
        margin-top: 20px;
        >div{
          float: left;
        }
        img{
          width: 75px;
          cursor: pointer;
          vertical-align: top;
          float: left;
          margin-right: 8px;
        }
        .text{
          cursor: pointer;
          .name{
            text-align: left;
            font-size: 20px;
            font-weight: 500;
          }
          .edit{
            font-size: 14px;
            color: #999;
            margin-top: 8px;
          }
          .edit:hover{
            color:$active;
          }
          .active{
            color: $active;
          }
        }
      }
      .manage{
        width: 100%;
        margin-top: 40px;
        .mhead{
          font-size: 20px;
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 26px;
          margin-bottom: 20px;
          span:first-child{
            display: inline-block;
            background: RGB(249,205,53);
            width: 3px;
            line-height: 26px;
            height: 80%;
            margin-right: 10px;
          }
          span:nth-child(2){
            display: inline-block;
            height: 26px;
            line-height: 26px;
          }
        }
        .list{
          >div{
            margin-bottom: 20px;
            display: flex;
            align-items: center;

            cursor: pointer;
            img{
              margin-right: 8px;
            }
            span{
              color: #999;
              line-height: 30px;
            }
            .active{
              color: $active;
            }
          }
        }
      }
    }
    .infoRight{
      float: left;
      .infohead{
        text-align: left;
        margin-bottom: 20px;
        span{
          display: inline-block;
          padding: 10px 20px;
          background: #ccc;
          color: #555;
          font-size: 18px;
        }
      }
      .pad{
        padding-left: 80px;
      }
    }
  }
}
  .changePass{
    padding: 74px 40px 20px;
    position: fixed;
    background: #222;
    z-index: 55;
    width: 470px;
    height: 260px;
    border-radius: 10px;
    top: 154px;
    right: 0;
    left: 0;
    margin: auto;
    .getVali{
      line-height: 40px;
      cursor: pointer;
    }
    .getVali:hover{
      color: $active;
    }
    .el-button{
      height: 40px;
      width: 84px;
    }
  }
</style>
<style>
  .changePass .el-form-item__label{
    color: white;
  }

</style>

<template>
  <div class="logWrap" :style="{opacity: $store.state.showLogin ? '1' : '0'}">
    <div :class="{box:true, boxMove:$store.state.showLogin}" :style="{height: showLog == 0 ? '266px' : 'auto', paddingRight: showLog == 0? '24px' : '50px',paddingTop: showLog == 0 ? '24px' : '46px'}">
      <div v-if="showLog == 0">
        <div class="head">
          <span>登录</span>
          <i class="el-icon-error close" @click="$store.state.showLogin = false"></i>
        </div>
        <div class="content">
          <div class="face" @click="FBLog">Facebook</div>
          <div class="gg" id="google-signin-button" @click="googleGo">Google +</div>
        </div>
        <div class="bottom">
          <span @click="hasAccount">已有账号</span>
          <span @click="gotoNew">注册</span>
        </div>
      </div>
      <div v-if="showLog == 1">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="昵称" prop="name">
            <el-input type="text" v-model="ruleForm.name" autocomplete="off"></el-input>
          </el-form-item>
<!--          <el-form-item label="账号" prop="account">-->
<!--            <el-input type="text" v-model="ruleForm.account" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model.number="ruleForm.phone">
              <el-select v-model="select" slot="prepend" class="select" placeholder="选择国家">
                <el-option v-for="(lb,b) in labelData" :key="b" :label="lb.label" :value="lb.value"></el-option>
              </el-select>
              <span slot="suffix" class="getVali" @click="getVali">{{showTime}}</span>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="valiCode">
            <el-input v-model.number="ruleForm.valiCode"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="register">注册</el-button>
            <el-button class="btn2" @click="cancle()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="showLog == 2" class="box2">
<!--        手机号码密码登录-->
        <el-form :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
          <el-form-item label="手机号码" prop="phone">
            <el-input type="text" v-model.number="ruleForm.phone" autocomplete="off">
              <el-select v-model="select" slot="prepend" class="select" placeholder="选择国家">
                <el-option v-for="(lb,b) in labelData" :key="b" :label="lb.label" :value="lb.value"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass" class="bbx">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            <div class="forget">
              <span @click="showLog = 3">忘记密码</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">登录</el-button>
            <el-button class="btn2" @click="cancle()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="forgetBox box2" v-if="showLog == 3">
<!--        忘记密码-->
        <h4>重设密码</h4>
        <el-form :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model.number="ruleForm.phone">
              <el-select v-model="select" slot="prepend" class="select" placeholder="选择国家">
                <el-option v-for="(lb,b) in labelData" :key="b" :label="lb.label" :value="lb.value"></el-option>
              </el-select>
              <span slot="suffix" class="getVali" @click="getChangeVali">{{showTime}}</span>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="valiCode">
            <el-input v-model.number="ruleForm.valiCode"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" class="bbx">
            <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changePassword">提交</el-button>
            <el-button class="btn2" @click="cancle()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="forgetBox box3" v-if="showLog == 4">
        <!--        第三方登录绑定手机号-->
        <h4>绑定手机号</h4>
        <el-form :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
<!--          <el-form-item label="昵称" prop="name">-->
<!--            <el-input type="text" v-model="ruleForm.name" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="账号" prop="account">-->
<!--            <el-input type="text" v-model="ruleForm.account" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="密码" prop="pass">-->
<!--            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="确认密码" prop="checkPass">-->
<!--            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model.number="ruleForm.phone">
              <el-select v-model="select" slot="prepend" class="select" placeholder="选择国家">
                <el-option v-for="(lb,b) in labelData" :key="b" :label="lb.label" :value="lb.value"></el-option>
              </el-select>
              <span slot="suffix" class="getVali" @click="getOtherVali">{{showTime}}</span>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="valiCode">
            <el-input v-model.number="ruleForm.valiCode"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitOtherPhone">提交</el-button>
            <el-button class="btn2" @click="cancleOtherPhone">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import labelData from '../assets/js/phoneList.js'
  import {setPhoneCode,valiCode,changePassword,changeVali,logByOther,bindOtherPhone,bindOtherPhoneVali,loginByPhone} from '../api/index.js'
  export default {
    name: 'Login',
    data() {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('昵称不能为空'));
        }
      }
      var checkValicode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('短信验证码不能为空'));
        }
      }
      var checkAccount = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空'));
        } else if (value.trim().length < 6) {
          return callback(new Error('账号长度不能小于6位'));
        }
      }
      var checkNum = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          account: '',
          pass: '',
          checkPass: '',
          phone: '',
          name: '',
          valiCode: '',
          newPassword: '',
          api:'',
        },
        rules: {
          name: [
            {
              validator: checkName, trigger: 'blur'
            }
          ],
          pass: [
            {validator: validatePass, trigger: 'change'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'change'}
          ],
          phone: [
            {validator: checkNum, trigger: 'change'}
          ],
          account: [
            {validator: checkAccount, trigger: 'change'}
          ],
          valiCode: [
            {
              validator: checkValicode, trigger: 'change'
            }
          ],

        },
        showLog: 0,
        showTime: '获取验证码',
        token: '',
        gg: false,
        select:labelData[0].value,
        labelData: labelData,
      };
    },
    methods: {
      submitForm() {
        if (this.ruleForm.phone && this.ruleForm.pass) {
          loginByPhone(this.select+this.ruleForm.phone, this.ruleForm.pass).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              this.$cookies.set('user', res.data.data);
              this.$store.commit('login', res.data.data);
              this.$message({message:'登录成功',type: 'success'});
              this.$store.commit('closeLog', false);
              this.$store.dispatch('getCartNum');
              this.$store.dispatch('getCollects');
            } else {
              this.$message(res.data.msg);
            }
          })
        }
      },
      submitOtherPhone(){
        // 第三方登录时用户手机号码  用户信息填写提交
        if (this.ruleForm.phone && this.ruleForm.valiCode) {
          bindOtherPhone(this.select + this.ruleForm.phone, this.ruleForm.valiCode,this.token,this.api).then((res) => {
            console.log('第三方登录时用户手机号码  验证码提交');
            console.log(res);
            if(res.data.code == 0) {
              this.$cookies.set('user', res.data.data);
              this.$store.state.user = res.data.data;
              this.$message({message:'注册成功',type: 'success'});
              this.$store.commit('closeLog', false);
            } else {
              this.$message(res.data.msg);
            }

          })
        }
      },
      cancleOtherPhone(){
        this.$store.state.showLogin = false;
      },
      FBLog(){
        var self = this;
        FB.login(function(response) {
          if (response.status === 'connected') {
            self.api = 'facebook';
            self.token = response.authResponse.accessToken;
            if (self.showLog == 0) {
              self.logByOthers();
            } else {
              self.connectOther()
            }
          } else {
          }
        },{scope: 'public_profile,email'});
      },
      connectOther(){
        //手机注册账号后绑定第三方

      },
      statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
        var self = this;
        if (response.status === 'connected') {   // Logged into your webpage and Facebook.
          // self.token = response.authResponse.accessToken;
          // self.api = 'facebook';
          // self.logByOthers();
        } else {                                 // Not logged into your webpage or we are unable to tell.
        }
      },
      onFBLogin() {
        var self = this;
        window.fbAsyncInit = function() {
          FB.init({
            appId : '2909397145812687',
            cookie : true,                     // Enable cookies to allow the server to access the session.
            xfbml : true,
            version: 'v7.0',
          });
          FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
            self.statusChangeCallback(response);        // Returns the login status.
          });
        };
      },
      fbInit(){
        (function(d, s, id) {                      // Load the SDK asynchronously
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      },
      register(){
        // 手机号与验证码注册
        if (this.ruleForm.phone && this.ruleForm.valiCode && this.ruleForm.name&& this.ruleForm.pass) {
          valiCode(this.select + this.ruleForm.phone, this.ruleForm.valiCode, this.ruleForm.pass, this.ruleForm.name).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              this.$cookies.set('user', res.data.data);
              this.$store.state.user = res.data.data;

              this.$notify({
                title: '',
                message: '注册成功',
                type: 'success'
              });
              this.$confirm('绑定Facebook或者Google账号, 是否继续?', '提示', {
                confirmButtonText: '绑定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
              }).then(() => {
                this.$store.commit('closeLog', false)
              }).catch(() => {
                this.$store.commit('closeLog', false)
              });
            } else {
              this.$notify.error({
                title: '',
                message: res.data.msg,
              });
            }
          })
        }
      },
      submitPhone() {

      },
      googleGo(){
        this.gg = true;
      },
      changePassword(){
        if(this.ruleForm.phone && this.ruleForm.valiCode &&this.ruleForm.newPassword) {
          changePassword(this.select + this.ruleForm.phone,this.ruleForm.valiCode,this.ruleForm.newPassword).then((res) => {
            if (res.data.code == 0) {
              this.$notify({
                title: '',
                message: res.data.msg,
                type: 'success'
              });
              this.showLog = 2;
            } else {
              this.$notify.error({
                title: '',
                message: res.data.msg,
              });
            }
          })
        }
      },
      getOtherVali(){
        //第三方绑定手机发送验证码
        if (this.ruleForm.phone && this.showTime == '获取验证码') {
          this.showTime = '30';
          var tt = setInterval(() => {
            this.showTime = this.showTime - 1;
            if (this.showTime < 0) {
              this.showTime = '获取验证码';
              clearInterval(tt);
            }
          }, 1000)
          bindOtherPhoneVali(this.select + this.ruleForm.phone).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              this.$notify({
                title: '',
                message: res.data.msg,
                type: 'success'
              });
            } else {
              this.$notify.error({
                title: '',
                message: res.data.msg,
              });
            }
          })
        }
      },
      getChangeVali(){
        // 修改密码验证码
        if (this.ruleForm.phone && this.showTime == '获取验证码') {
          this.showTime = '30';
          var tt = setInterval(() => {
            this.showTime = this.showTime - 1;
            if (this.showTime < 0) {
              this.showTime = '获取验证码';
              clearInterval(tt);
            }
          }, 1000)
          changeVali(this.select + this.ruleForm.phone).then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              this.$notify({
                title: '',
                message: res.data.msg,
                type: 'success'
              });
            } else {
              this.$notify.error({
                title: '',
                message: res.data.msg,
              });
            }
          })
        }
      },
      getVali(){
        // 注册验证码
        if (this.ruleForm.phone && this.showTime == '获取验证码') {
          this.showTime = '30';
          var tt = setInterval(() => {
            this.showTime = this.showTime - 1;
            if (this.showTime < 0) {
              this.showTime = '获取验证码';
              clearInterval(tt);
            }
            console.log(this.showTime);
          }, 1000)
          setPhoneCode(this.select + this.ruleForm.phone).then((res) => {
            if (res.data.code == 0) {
              this.$notify({
                title: '',
                message: res.data.msg,
                type: 'success'
              });
            } else {
              this.$notify.error({
                title: '',
                message: res.data.msg,
              });
            }
          })
        }
      },
      hasAccount(){
        this.showLog = 2;
     },
      cancle() {
        this.showLog = 0;
      },
      gotoNew() {
        this.showLog = 1;
      },
      //第三方登录
      logByOthers(){
        logByOther(this.api,this.token).then((res) => {
          if (res.data.code == 2) {
            // 走绑定手机号
            this.$message(res.data.msg);
            this.showLog = 4;
          }
          if (res.data.code == 0) {
            //走登录成功
            this.$cookies.set('user', res.data.data);
            if (this.api == 'facebook') {
              this.$cookies.set('otherAvatar', res.data.data.facebook_picture);
            } else {
              this.$cookies.set('otherAvatar', res.data.data.google_picture);
            }
            this.$store.commit('login',res.data.data)
            this.$message({message:'登录成功',type: 'success'});
            this.$store.commit('closeLog', false);
            this.$store.dispatch('getCartNum');
            this.$store.dispatch('getCollects');
          }
          console.log(res);
        })
      },
      onSignIn(user) {
        console.log(user);
        var id_token = user.wc.id_token;
        this.token = id_token;
        this.api = 'google';
        if (this.showLog == 0) {
          this.logByOthers();
        } else {
          this.connectOther();
        }
        console.log("ID Token: " + id_token);
      },
      gInit(){
        gapi.signin2.render('google-signin-button', {
          onsuccess: this.onSignIn,
          width: 532,
          height: 40,
        })
      }
    },
    mounted() {
      this.onFBLogin();
    },
    watch:{
      gg: function (newVal, oldVal) {
        if (newVal) {
          this.gInit();
        }
      }
    },
    created() {
      this.fbInit();
    },
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
.logWrap{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  background: $greyBack;
  .box{
    -webkit-transform: translateY(0);
    transform: translateY(0);
    box-sizing: border-box;
    margin: 0 auto;
    width: 580px;
    background: #f1f1f1;
    border-radius: 8px;
    padding-top: 24px;
    padding-right: 24px;
    padding-bottom: 24px;
    padding-left: 24px;
    .box2{
      margin-top: 26px;
      margin-right: 50px;
      h4{
        line-height: 32px;
        margin-bottom: 20px;
        text-indent: 2.2em;
        font-size: 22px;
        font-weight: bolder;
      }
      .bbx{
        margin-bottom: 10px;
      }
      .forget{
        user-select: none;
        font-size: 12px;
        text-align: right;
        span{
          cursor: pointer;
        }
        span:hover{
          color: $active;
        }
      }
    }
    .box3{
      margin-top: 26px;
      margin-right: 16px;
      h4{
        line-height: 32px;
        margin-bottom: 20px;
        text-indent: 2.2em;
        font-size: 22px;
        font-weight: bolder;
      }
      .bbx{
        margin-bottom: 10px;
      }
      .forget{
        user-select: none;
        font-size: 12px;
        text-align: right;
        span{
          cursor: pointer;
        }
        span:hover{
          color: $active;
        }
      }
      .getVali{
        line-height: 40px;
      }
    }
    .head{
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .close{
        cursor: pointer;
      }
    }
    .content{
      text-align: center;
      >div{
        border-radius: 4px;
        margin-bottom: 10px;
        height: 36px;
        line-height: 36px;
        color: white;
        box-shadow: 0 2px 0 0 rgba(0,0,0,.2);
      }
      .face{
        background: #4d75b9;
        cursor: pointer;

      }
      .face:hover{
        background: #3c5e97;
      }
      .gg{
        background: #e5101d;
        cursor: pointer;
      }
      .gg:hover{
        background: #bc000b ;
      }
    }
    .bottom{
      margin-top: 34px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      span{
        cursor: pointer;
        color: #4a90e2;
        text-decoration: underline;
      }
    }
  }
  .boxMove{
    transition: -webkit-transform .3s ease-out;
    transition: transform .3s ease-out;
    -webkit-transform: translateY(90px);
    transform: translateY(90px);
  }
}
  .getVali{
    cursor: pointer;
    user-select: none;
  }
  .getVali:hover{
    @include hover
  }
</style>
<style>
  .logWrap .box .el-select .el-input__inner,.logWrap .box .select .el-input--suffix .el-input__inner{
    padding-left: 10px;
    padding-right: 0;
  }
  .logWrap .box .select{
    width: 100px;
  }
  .logWrap .box .getVali{
    line-height: 40px;
  }
  .logWrap .box .btn2{
    margin-right: 34px;
  }
</style>

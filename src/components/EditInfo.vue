<template>
  <div class="editWrap">
    <div class="eLeft">
      <i v-if="!form.pic" class="el-icon-user-solid img"></i>
      <img class="img" v-if="form.pic" :src="$host+form.pic" alt="">
      <el-upload
        action=""
        :on-change="change"
        :auto-upload="false"
        >
        <el-button slot="trigger" size="small" @click="uploadImg" type="primary">更改头像</el-button>
      </el-upload>
<!--      <span>修改密码</span>-->
    </div>
    <div class="eRight">
      <el-form ref="form" :model="form" label-width="80px" style="width: 480px" v-if="!changePass">
        <el-form-item label="邮件">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" disabled>
            <el-button slot="append" class="updatephone" @click="changePassBtn">更改</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="名字">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="form.birth"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="update" @click="onSubmit">更新资料</el-button>
        </el-form-item>
      </el-form>

      <el-form label-width="80px" style="width: 480px" v-if="changePass">
        <el-form-item label="手机号码" >
          <el-input v-model.number="newphone">
            <el-select v-model="select" slot="prepend" class="select" placeholder="选择国家">
              <el-option v-for="(lb,b) in labelData" :key="b" :label="lb.label" :value="lb.value"></el-option>
            </el-select>
            <span slot="suffix" class="getVali" @click="getChangeVali">{{showTime}}</span>
          </el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model.number="changevaliCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="update" @click="changepass">更换手机号码</el-button>
          <el-button class="update" @click="changePass = false">取消</el-button>
        </el-form-item>


      </el-form>

    </div>
  </div>
</template>

<script>
  import labelData from '../assets/js/phoneList.js'

  import {publicPost,uploadImage,getPersonInfo} from "../api/index.js";
  export default {
    data(){
      return{
        select:labelData[0].value,
        labelData: labelData,
        showTime: '获取验证码',

        changevaliCode:'',
        changePass:false,
        newphone:'',

        file:'',
        form:{
          email: '',
          phone: '',
          name: '',
          gender: '男',
          birth: '',
          pic:'',
        },
        userInfo2:this.userInfo,
      }
    },
    methods:{
      getChangeVali(){
        // 修改手机号码验证码
        if(!this.newphone) {
          this.$message('请输入新的电话号码')
        }
        if (this.newphone && this.showTime == '获取验证码') {
          this.showTime = '30';
          var tt = setInterval(() => {
            this.showTime = this.showTime - 1;
            if (this.showTime < 0) {
              this.showTime = '获取验证码';
              clearInterval(tt);
            }
          }, 1000)
          publicPost('user/changePhone',[{phone:this.select + this.newphone},
            {id:this.$cookies.get('user').id},{token:this.$cookies.get('user').token}]).then((res) => {
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
      changepass(){
        if (this.newphone && this.changevaliCode) {
          publicPost('user/changePhone',[{id:this.$cookies.get('user').id},
            {token:this.$cookies.get('user').token},{phone:this.select + this.newphone},{code:this.changevaliCode}]).then((res) => {
            if (res.data.code == 0) {
              this.$notify({
                title: '',
                message: res.data.msg,
                type: 'success'
              });
              this.form.phone = this.select + this.newphone;
              this.changePass = false;
            } else {
              this.$notify.error({
                title: '',
                message: res.data.msg,
              });
            }
          })
        }
      },
      changePassBtn(){
        this.changePass = !this.changePass;
      },
      onSubmit(){
        if (!this.changePass) {
          var gender = this.form.gender == '男' ? 'male' : 'female';
          publicPost('user/editUserInfo',[{truename:this.form.name},{sex:gender},{birthday:this.form.birth},{email:this.form.email},
            {id:this.$cookies.get('user').id},{token:this.$cookies.get('user').token}]).then((res) => {
            if(res.data.code == 0) {
              this.$message({
                type:'success',
                message:'更新成功',
              })
            } else {
              this.$message(res.data.data);
            }
          })
        } else {

        }

      },
      uploadImg() {

      },
      change(file, fileList) {
        this.file = file;
        uploadImage(file.raw).then((res) => {
          if(res.data.state == 'SUCCESS') {
            var url = res.data.url;
            publicPost('user/changeAvatar',[{id:this.$cookies.get('user').id},
              {token:this.$cookies.get('user').token},{image_url:res.data.url}]).then((res) => {
              console.log(res);
              this.form.pic = url;
              var user = this.$cookies.get('user');
              user.member_avatar = url;
              this.$cookies.set('user',user);
              this.$store.commit('login',user);
              this.$parent.changeAvatar();
            })
          }
        })
      },
      showData(){
        console.log(this.userInfo2);
        this.userInfo2.member_sex== 'male'?this.form.gender ='男':this.form.gender ='女';
        this.form.name = this.userInfo2.member_truename&& this.userInfo2.member_truename!='null'?this.userInfo2.member_truename:'';
        this.form.phone = this.userInfo2.member_phone&& this.userInfo2.member_phone!='null'?this.userInfo2.member_phone:'';
        this.form.email = this.userInfo2.member_email && this.userInfo2.member_email!='null'? this.userInfo2.member_email:'';
        this.form.birth = this.userInfo2.member_birthday&& this.userInfo2.member_birthday!='null'?this.userInfo2.member_birthday:'';
        this.form.pic = this.userInfo2.member_avatar && this.userInfo2.member_avatar!='null'?this.userInfo2.member_avatar: this.$cookies.get('otherAvatar');
      }
    },
    mounted(){
      getPersonInfo(this.$cookies.get('user').id, this.$cookies.get('user').token).then((res) => {
        if (res.data.code == 0) {
            this.userInfo2 = res.data.data;
            this.showData();
        }
      })
    },
    name: 'EditInfo'
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
  .editWrap{
    width: 100%;
    text-align: left;
    overflow: hidden;
    .eLeft{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      float: left;
      margin-right: 8px;
      .img{
        text-align: center;
        font-size: 86px;
        width: 160px;
        margin-bottom: 20px;
      }
      span{
        font-size: 16px;
        color: #888;
        display: inline-block;
        margin-top: 6px;
        cursor: pointer;
      }
      span:hover{
        color: $active;
      }
    }
    .eRight{
      float: left;
      .update{
        background: RGB(249,205,53);
        color: white;
      }
      .updatephone{
        color: RGB(249,205,53);
      }
    }
  }


</style>
<style>
  .editWrap .eLeft .el-upload-list{
    display: none;
  }
  .editWrap .el-select .el-input__inner,.editWrap .select .el-input--suffix .el-input__inner{
    padding-left: 10px;
    padding-right: 0;
  }
  .editWrap .select{
    width: 100px;
  }
  .editWrap .getVali{
    line-height: 40px;
    cursor: pointer;

  }
</style>

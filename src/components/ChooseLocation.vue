<template>
  <div>
    <div class="editLocation">
      <el-form ref="form" :model="form2" label-width="90px">
        <p style="text-align: center;margin-bottom: 20px">修改收货地址</p>
        <el-form-item label="姓名*">
          <el-input v-model="form2.name"></el-input>
        </el-form-item>
        <el-form-item label="省市*">
          <el-select v-model="form2.shengshi" placeholder="请选择">
            <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="县/区*">
          <el-select v-model="form2.xianqu" placeholder="请选择">
            <el-option
              v-for="item in area"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="坊/公社*">
          <el-select v-model="form2.fang" placeholder="请选择">
            <el-option
              v-for="item in xianqu"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址*">
          <el-input v-model="form2.location">
          </el-input>
        </el-form-item>
        <el-form-item label="电话*">
          <el-input v-model="form2.phone"></el-input>
        </el-form-item>
        <div class="btns">
          <el-button class="update" @click="onSubmit">保存信息</el-button>
          <el-button @click="cancle" type="info">取消</el-button>
        </div>


      </el-form>
    </div>
  </div>
</template>

<script>
  import citis from '../assets/js/city.js'
  import {publicPost} from "../api/index.js";
  export default {
    data(){
      return{
        showEdit: false,
        isEdit:false,
        editId:'',
        form2:{
          name: '',
          location:'',
          shengshi: '',
          xianqu: '',
          fang:'',
          phone: '',
        },
        locations:[],
        cities: [],
      }
    },
    props:['locationNow'],
    mounted(){
      var arr = Object.keys(citis);
      arr.forEach((item) => {
        var obj = {value:item,label:item};
        this.cities.push(obj);
      })
      console.log(this.locationNow);
      this.edit();
    },
    computed:{
      area: function () {
        if(this.form2.shengshi) {
          var arr = Object.keys(citis[this.form2.shengshi]),arr2=[];
          if(arr&&arr.length) {
            arr.forEach((item) => {
              var obj = {value:item,label:item};
              arr2.push(obj);
            })
          }
          return arr2;
        }

      },
      xianqu:function () {
        if(this.form2.shengshi&&this.form2.xianqu) {
          var arr = citis[this.form2.shengshi][this.form2.xianqu],arr2=[];
          if(arr&&arr.length) {
            arr.forEach((item) => {
              var obj = {value:item,label:item};
              arr2.push(obj);
            })
          }
          return arr2;
        } else {
          return [];
        }
      }
    },
    methods:{
      cancle(){
        this.$emit('closeEdit',false);
      },
      edit(){
        console.log(this.locationNow);
        this.showEdit = true;
        this.editId = this.locationNow.id;
        this.cities.forEach((item,j) => {
          if(item.value == this.locationNow.city) {
            this.form2.shengshi = item.label;
          }
        })
        this.form2.name = this.locationNow.realname;
        var isdef = this.locationNow.is_default == '1' ? true:false;
        this.$set(this.form2,'defaultLocation',isdef);
        if(this.locationNow.area){
          this.form2.xianqu = this.locationNow.area.split(' ')[0];
          this.form2.fang = this.locationNow.area.split(' ')[1];
        }
        this.form2.location = this.locationNow.detail;
        this.form2.phone = this.locationNow.tel_phone;
      },
      onSubmit2(){
        var arr = Object.values(this.form2),arr2 = Object.keys(this.form2);
        var isall = false
        console.log(arr);
        arr.forEach((item, p)=>{
          if(!item && arr2[p] != 'defaultLocation'){
            console.log(item);
            isall = true;
          }
        })
        if(isall) {
          this.$message({message:'请填写必要的信息'});
          return;
        }
        // area: "齐齐哈尔 铁锋区"
        // area_info: "黑龙江 齐齐哈尔 铁锋区 aseana 3"
        // city: "黑龙江"
        // create_time: "2020-06-19 22:02:00"
        // detail: "aseana 3"
        // id: 11
        // isSelect: true
        // is_default: 1
        // member_id: 10
        // realname: "daxia"
        // tel_phone: "09564561494"
        // update_time: "2020-06-19 22:02:00"
        var objNow = {
          area:this.form2.shengshi + ' '+this.form2.xianqu,
          area_info:this.form2.shengshi + ' '+this.form2.xianqu + ' '+this.form2.fang+' '+this.form2.location,
          city:this.form2.shengshi,
          create_time:this.locationNow.create_time,
          detail:this.form2.location,
          id:this.locationNow.id,
          is_default: this.locationNow.is_default,
          member_id:this.locationNow.member_id,
          realname: this.form2.name,
          tel_phone:this.form2.phone,
          update_time:this.locationNow.update_time,
        };

        this.$emit('changeLocation',objNow)
      },
      onSubmit(){
        var arr = Object.values(this.form2),arr2 = Object.keys(this.form2);
        var isall = false
        console.log(arr);
        arr.forEach((item, p)=>{
          if(!item && arr2[p] != 'defaultLocation'){
            console.log(item);
            isall = true;
          }
        })
        if(isall) {
          this.$message({message:'请填写必要的信息'});
          return;
        }

        var isde = this.form2.defaultLocation ? '1' : '0';
        var addressId = '';
        if(this.isEdit) {
          addressId = this.editId;
        }
        publicPost('user/saveAddress',[{address_id: addressId},{realname:this.form2.name},{city:this.form2.shengshi},
          {area:this.form2.xianqu+' ' +this.form2.fang},{detail:this.form2.location},{tel_phone:this.form2.phone},{is_default:isde},{area_info:this.form2.shengshi+' '+
              this.form2.xianqu +' ' +this.form2.fang+ ' '+this.form2.location},{id:this.$cookies.get('user').id},{token:this.$cookies.get('user').token}]).then((res) =>{
          if(res.data.code==0){
            var objNow = {
              area:this.form2.shengshi + ' '+this.form2.xianqu,
              area_info:this.form2.shengshi + ' '+this.form2.xianqu + ' '+this.form2.fang+' '+this.form2.location,
              city:this.form2.shengshi,
              create_time:this.locationNow.create_time,
              detail:this.form2.location,
              id:this.locationNow.id,
              is_default: this.locationNow.is_default,
              member_id:this.locationNow.member_id,
              realname: this.form2.name,
              tel_phone:this.form2.phone,
              update_time:this.locationNow.update_time,
            };
            this.$emit('changeLocation',objNow)
          }
        })
      },
    },
    name: 'ChooseLocation'
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
  .editLocation{
    text-align: left;
    .span5{
      color: red;
      .span1{
        margin-right: 20px;
      }
    }
    .el-select{
      width: 310px;
    }
    .btns{
      text-align: center;
    }
  }
  .update{
    background: RGB(249,205,53);
    color: white;
  }
</style>

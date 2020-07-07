<template>
  <div>
    <div class="showlocations" v-if="!showEdit">
<!--      // area: "Shanghai"-->
<!--      // area_info: "Chengdu Shanghai ddddddddddddd"-->
<!--      // city: "Chengdu"-->
<!--      // create_time: "2020-06-18 20:27:31"-->
<!--      // detail: "ddddddddddddd"-->
<!--      // id: 6-->
<!--      // is_default: 1-->
<!--      // member_id: 10-->
<!--      // realname: "daxia"-->
<!--      // tel_phone: "09564561494"-->
<!--      // update_time: "2020-06-18 20:27:31"-->
      <div class="item" v-for="(item,i) in locations" :key="i">
        <div class="left">
          <div class="name">
            <span>{{item.realname}}</span>
            <span>{{item.tel_phone}}</span>
          </div>
          <div class="loca">
            <img src="../assets/img/location1.png" alt="">
            {{item.area_info}}
          </div>
        </div>
        <div class="right">
          <span @click="edit(i)">修改</span>

          <el-popconfirm
            confirmButtonText='删除'
            cancelButtonText='取消'
            @onConfirm="del(i)"
            icon="el-icon-info"
            iconColor="red"
            title="确定删除该地址？"
          >
          <span class="edit" slot="reference">删除</span>
          </el-popconfirm>
          <span :class="item.is_default== '1' ? 'active':''">{{item.is_default== '1' ? '默':''}}</span>
        </div>
      </div>
      <el-button class="update" icon="el-icon-plus" @click="addLocation">添加地址</el-button>
    </div>
    <div class="editLocation" v-if="showEdit">
      <el-form ref="form" :model="form2" label-width="80px">
        <el-form-item class="span5">
          <span class="span1">你最多可以创建50个地址</span>
          <span class="span2">带*为必填</span>
        </el-form-item>
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
          <el-input v-model="form2.location"></el-input>
        </el-form-item>
        <el-form-item label="电话*">
          <el-input v-model="form2.phone"></el-input>
        </el-form-item>
        <el-form-item label="设为默认" style="text-align: left">
          <el-switch
            v-model="form2.defaultLocation"
            inactive-color="#b0c8fe"
            >
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button class="update" @click="onSubmit">保存信息</el-button>
          <el-button @click="showList" type="info">取消</el-button>
        </el-form-item>
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
          defaultLocation:false,
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
    mounted(){
      this.getLocationList();
      var arr = Object.keys(citis);
      arr.forEach((item) => {
        var obj = {value:item,label:item};
        this.cities.push(obj);
      })
      console.log(this.cities);

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
      edit(i){
       // area: "Shanghai"-->
        // area_info: "Chengdu Shanghai ddddddddddddd"-->
        // city: "Chengdu"-->
        // create_time: "2020-06-18 20:27:31"-->
        // detail: "ddddddddddddd"-->
        // id: 6-->
        // is_default: 1-->
        // member_id: 10-->
        // realname: "daxia"-->
        // tel_phone: "09564561494"-->
        // update_time: "2020-06-18 20:27:31"-->
        this.showEdit = true;
        this.isEdit = true;
        this.editId = this.locations[i].id;

        this.cities.forEach((item,j) => {
          if(item.value == this.locations[i].city) {
            this.form2.shengshi = item.label;
          }
        })
        this.form2.name = this.locations[i].realname;
        var isdef = this.locations[i].is_default == '1' ? true:false;
        this.$set(this.form2,'defaultLocation',isdef);

        this.form2.xianqu = this.locations[i].area.split(' ')[0];

        this.form2.fang = this.locations[i].area.split(' ')[1];

        this.form2.location = this.locations[i].detail;
        this.form2.phone = this.locations[i].tel_phone;
        this.addLocation();
      },
      del(index){
        publicPost('user/delAddress',[{id:this.$cookies.get('user').id},{token:this.$cookies.get('user').token},
          {address_id:this.locations[index].id}]).then((res) => {
            if(res.data.code == 0) {
              var arr = [];
              this.locations.forEach((item,i) => {
                if(index != i) {
                  arr.push(item);
                }
              })
              this.locations = arr;
            } else {
              this.$message(res.data.data);
            }
        })
      },
      getLocationList(){
        publicPost('user/getAddress',[{id:this.$cookies.get('user').id},{token:this.$cookies.get('user').token}]).then((res) => {
          if(res.data.code == 0){
            this.locations = res.data.data;
          } else {
            this.$message(res.data.data);
          }
          console.log(res);
        })
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
        console.log(isde);
        publicPost('user/saveAddress',[{address_id: addressId},{realname:this.form2.name},{city:this.form2.shengshi},
          {area:this.form2.xianqu+' ' +this.form2.fang},{detail:this.form2.location},{tel_phone:this.form2.phone},{is_default:isde},{area_info:this.form2.shengshi+' '+
              this.form2.xianqu +' ' +this.form2.fang+ ' '+this.form2.location},{id:this.$cookies.get('user').id},{token:this.$cookies.get('user').token}]).then((res) =>{
                if(res.data.code==0){
                  if(this.isEdit) {
                    this.$message({
                      type:'success',
                      message:'编辑成功',
                    })
                  } else {
                    this.$message({
                      type:'success',
                      message:'修改成功',
                    })
                  }
                  this.form2.defaultLocation = false;
                  this.isEdit = false;
                  this.showEdit = false;
                  this.showList();
                  this.getLocationList();
                }
        })
      },
      addLocation(){
        this.showEdit = true;
      },
      showList(){
        this.showEdit = false;
      }
    },
    name: 'Locations'
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
  .showlocations{
    .item{
      box-shadow: $boxShadow;
      width: 600px;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      color: #666;
      margin-bottom: 24px;
      .left{
        font-size: 16px;
        text-align: left;
        .name{
          margin-bottom: 10px;
          span:nth-child(2){
            margin-left: 22px;
          }
        }
        .loca{
          img{
            height: 20px;
          }
        }
      }
      .right{
        font-size: 16px;
        text-align: left;
        .edit{
          margin-left: 20px;
        }
        span:nth-child(1){
          color: #999;
          cursor: pointer;
        }
        span:nth-child(1):hover{
          color: $active;
        }
        .edit{
          color: $active;
          cursor: pointer;
        }
        .edit:hover{
          color: #999;
        }
        >span:nth-child(3){
          display: inline-block;
          height: 30px;
          width: 30px;
          border-radius: 50%;
          text-align: center;
          line-height: 30px;
          color:white;
        }
        >span.active{
          background: $themeColor;
        }
      }
    }
  }
  .editLocation{
    .span5{
      color: red;
      .span1{
        margin-right: 20px;
      }
    }
    .el-select{
      width: 310px;
    }
  }
  .update{
    background: RGB(249,205,53);
    color: white;
  }
</style>

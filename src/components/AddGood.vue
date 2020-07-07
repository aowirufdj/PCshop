<template>
  <div class="addGoodWrap" v-loading="loading" element-loading-text="上传中"
       element-loading-spinner="el-icon-loading">
    <div class="top clearfix">
      <div class="left">
        <p class="title">商品来源:{{cate.plat == 'taobao' ? '淘宝': cate.plat == 'jd' ? '京东' : '自营'}}</p>
        <p class="name">名称:{{cate.title}}</p>
        <p class="price">价格:<span>{{price}}</span></p>
      </div>
      <div class="right">
        <img :src="cate.pic" alt="">
      </div>
    </div>
  <div class="bb">
    <div class="num">
      <span>选择数量:</span>
      <el-input-number v-model="num" class="inputNum" size="mini" @change="handleChange" :min="1" label="选择数量"></el-input-number>
    </div>
    <div class="subs">
      <span v-for="(item,i) in cate.prop" :key="i">{{item}}</span>
    </div>
    <div class="sub">
      <span>备注:</span>
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
    </div>
    <div class="upload">
      <span>上传图片:</span>

      <el-upload
        action=""
        :multiple="true"
        :limit="8"
        list-type="picture-card"
        :auto-upload="false"
        :file-list="imgList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-change="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <p>最多上传8张</p>
    </div>
    <div class="btns">
      <el-button class="btn" type="success" @click="addCart">{{cate.isChange? '修改':'加入购物车'}}</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </div>

  </div>
</template>

<script>
  import {uploadImage,addCart,publicPost} from '../api/index'
  export default {
    name: 'AddGood',
    data(){
      return{
        textarea:'',
        num:1,
        dialogImageUrl: '',
        dialogVisible: false,
        price:0,
        fileList:[],
        uploadList:[],
        imgList:[],
        loading:false,
      }
    },
    props:{
      cate:{
        type: Object,
        default: function () {
          return{
          }
        }
      },
      showCate:{
        type: Boolean,
        default: function () {
          return true
        }
      },
    },
    mounted(){
      this.price = this.cate.sku.price;
      console.log(this.cate);
      if(this.cate.isChange){
        this.num = this.cate.num;
        this.price = this.cate.num*this.cate.sku.price;
        this.textarea = this.cate.remark;
        if(this.cate.imgs && this.cate.imgs.length) {
          this.cate.imgs.forEach((item) =>{
              var obj = {};
              obj.url = this.$host + item;
              this.imgList.push(obj);
          })
        }
      }
    },
    methods:{
      addCart(){
        console.log(this.fileList);
        console.log(this.imgList);
        if (this.cate.isChange) {
          if(this.fileList.length) {
            this.loading = true;
            //有改动
            this.uploadList = [];
            this.editUpload(this.fileList[0],0);
          } else {
            // 没有做任何改动
            this.uploadList = this.cate.imgs;
            this.editUploadAll();
          }
        } else {
            // 本网站的新增
            if(this.fileList.length) {
              this.loading = true;
              this.uploadList = [];
              this.upload(this.fileList[0].raw,0);
            } else {
              this.uploadAll();
            }
        }
      },
      editUpload(item,j){
        var k = j-0 +1;
         if (item.status== 'success') {
           this.uploadList.push(item.url.split(this.$host)[1]);
           if(k < this.fileList.length) {
             this.editUpload(this.fileList[k],k);
           } else {
             this.editUploadAll();
           }
         } else {
           var user = this.$cookies.get('user');
           publicPost('userservice/userUpload',[{id:user.id},{token:user.token},{upfile:item.raw}]).then((res) => {
             if(res.data.code == 0) {
               this.uploadList.push(res.data.data.url);
               if(k < this.fileList.length) {
                 this.editUpload(this.fileList[k],k);
               } else {
                 this.editUploadAll();
               }
             }
           })
         }
      },
      upload(file,index){
        var j = index;
        var user = this.$cookies.get('user');
        publicPost('userservice/userUpload',[{id:user.id},{token:user.token},{upfile:file}]).then((res) => {
          console.log(res);
          if(res.data.code == 0) {
            this.uploadList.push(res.data.data.url);
            j++;
            if(j < this.fileList.length) {
              this.upload(this.fileList[j].raw,j);
            } else {
              this.uploadAll();
            }
          }
        })
        // uploadImage(file).then((res) => {
        //   if(res.data.state == 'SUCCESS') {
        //     this.uploadList.push(res.data.url);
        //     j++;
        //     if(j < this.fileList.length) {
        //       this.upload(this.fileList[j].raw,j);
        //     } else {
        //       this.uploadAll();
        //     }
        //   }
        // })
      },
      editUploadAll(){
        var user = this.$cookies.get('user');
        publicPost('cart/save',[{id:user.id},{token:user.token},{num:this.num},{options:this.cate.prop},
          {uploads:this.uploadList},{remark:this.textarea},{good_sku_id:this.cate.sku.sku_id},
          {cart_id:this.cate.cartId}]).then((res) => {
          if(res.data.code == 0) {
            this.loading = false;
            if (this.cate.isChange) {
              this.$message({
                type:'success',
                message:'修改成功',
              })
            } else {
              this.$message({
                type:'success',
                message:'添加成功'
              })
            }
            this.$parent.getList();
          } else{
            this.$message(res.data.data)
          }
          this.close();
        })
      },
      uploadAll(){
        var user = this.$cookies.get('user');
        var id ='';
        if (this.cate.isChange) {
          id =''
        } else {
          id=this.cate.id;
        }
        if (this.cate.diy) {
          var skuobj = {
            sku:this.cate.skus
          }
          publicPost('cart/memberSave',[{id:user.id},{token:user.token},{good_sku_id:this.cate.sku.sku_id},
            {good_num:this.num},{member_options:this.cate.prop},{member_uploads:this.uploadList},{member_remark:this.textarea},
            {good_detail_url:this.cate.detailUrl},{good_platform:this.cate.platform},{good_title:this.cate.title},
            {good_price:this.cate.sku.price},{good_orginal_price:this.cate.sku.orginal_price},
            {good_skus:JSON.stringify(skuobj)},{good_pic_url:this.cate.pic}]).then((res) => {
            console.log(res);
            this.loading = false;
            if(res.data.code == 0) {
              if (this.cate.isChange) {
                this.$message({
                  type:'success',
                  message:'修改成功',
                })
              } else {
                this.$message({
                  type:'success',
                  message:'添加成功'
                })
                this.$store.state.cartNum = this.$store.state.cartNum-0 +this.num;
                this.$store.state.newAdd = this.$store.state.newAdd-0+1;
              }
            } else{
              this.$message(res.data.msg)
            }
            this.close();
          })
        } else {
          publicPost('cart/save',[{id:user.id},{token:user.token},{good_id:id},{num:this.num},
            {remark:this.textarea},{good_sku_id:this.cate.sku.sku_id},{uploads:this.uploadList},{options:this.cate.prop}]).then((res) => {
            console.log(res);
            this.loading = false;
            if(res.data.code == 0) {
              if (this.cate.isChange) {
                this.$message({
                  type:'success',
                  message:'修改成功',
                })
              } else {
                this.$message({
                  type:'success',
                  message:'添加成功'
                })
                this.$store.state.cartNum = this.$store.state.cartNum-0 +this.num;
                this.$store.state.newAdd = this.$store.state.newAdd-0+1;
              }
            } else{
              this.$message(res.data.msg)
            }
            this.close();
          })
        }
      },
      close(){
        this.$emit('update:showCate',false);
      },
      handleChange(){
        var pr;
        var priceOne = this.cate.sku.price -0;
        pr = priceOne * this.num.toFixed(3);
        pr = Math.round(pr * 100) / 100;
        this.price = pr;
      },
      handleRemove(file, fileList) {
        this.fileList = fileList;
        console.log(fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/base.scss";
.addGoodWrap{
  text-align: left;
  background: white;
  width: 420px;
  padding: 20px 2em;
  margin: 50px auto 0;
  border-radius: 6px;
  font-size: 15px;
  .top{
    >div{
      float: left;
      width: 49.8%;
      box-sizing: border-box;
    }
    .left{
      p{
        margin-bottom: 8px;
      }
      .name{
      }
      .price span{
        color: $active;
      }
    }
    .right{
      text-align: right;
      img{
        width: 140px;
        margin-right: 1em;
        border-radius: 4px;
      }
    }
  }
  .bb{
    >div{
      margin-bottom: 8px;
    }
    .num{
      span{
        margin-right: 18px;
      }
      .inputNum{
        width: 98px;
      }
    }
    .subs{
      span{
        margin-right: 12px;
      }
    }
    .upload{
      p{
        text-align: right;
        font-size: 12px;
        color: $active;
      }
    }
    .btns{
      text-align: center;
    }

  }

}
</style>
<style>
  .addGoodWrap .upload .el-upload--picture-card{
    height: 90px;
    width: 90px;
    line-height: 90px;
  }
  .addGoodWrap .upload .el-upload-list--picture-card .el-upload-list__item{
    height: 90px;
    width: 90px;
    line-height: 90px;
  }
</style>

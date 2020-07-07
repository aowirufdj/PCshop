<template>
  <div class="itemsWrap">
<!--    <Nav :title="title"></Nav>-->
    <div class="oneWrap clearfix">
      <div class="imgWrap">
        <!--      大图地址  big-url-->
        <pic-zoom :url="bigUrl"
                  :scale="2"></pic-zoom>
        <div class="bottomList">
          <swiper class="swiper" :options="swiperOption">
            <swiper-slide v-for="(item,i) in imgList" :key="i">
              <img :class="selectImgNow == i ? 'active' : ''" @click="changeImg(i)" :src="item" alt=""></swiper-slide>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
          </swiper>
<!--          <div class="collect" @click="collectByUser(content.id)">-->
<!--             <i class="el-icon-star-on collectimg" :style="{color:collectList.indexOf(content.id)>=0? '#F9CD35':'#999'}"></i>{{collectList.indexOf(content.id)>=0 ? '已收藏':'收藏'}}-->
<!--&lt;!&ndash;            <img src="../assets/img/collect1.png" alt="">&ndash;&gt;-->
<!--&lt;!&ndash;            <span>收藏</span>&ndash;&gt;-->
<!--          </div>-->
        </div>
      </div>
      <div class="itemShowTop">
        <div class="showRight">
          <p class="title">
            {{titleHead}}
          </p>
          <p class="price">{{onePrice}}</p>
          <div class="from">
            来源：<a :href="content.detail_url" target="_blank">{{content.good_platform == 'taobao' ? '淘宝':content.good_platform == 'jd' ? '京东':content.good_platform == 'zy'?'自营':''}}</a>
          </div>
            <div class="props" v-if="keyName[0]">
              <i>{{keyName[0].title}}</i>
              <div class="propsWrap">
                <div v-for="(it, j) in keyName[0].value" :key="j" :title="it.name" @click="showSku(0,j,it.value)" :class="{active:skuNow == j}" >
                  <!--                <img v-if="it.prop_img" :src="it.prop_img" alt="">-->
                  <span>{{it.name}}</span>
                </div>
              </div>
            </div>
            <div class="props" v-if="keyName[1]">
              <i>{{keyName[1].title}}</i>
              <div class="propsWrap">
                <div v-for="(it, j) in keyName[1].value" :key="j" :title="it.name" @click="showSku(1,j,it.value)" :class="{active:skuNow1 == j,noavailable:!it.available}" >
                  <!--                <img v-if="it.prop_img" :src="it.prop_img" alt="">-->
                  <span>{{it.name}}</span>
                </div>
              </div>
            </div>
            <div class="props" v-if="keyName[2]">
              <i>{{keyName[2].item.title}}</i>
              <div class="propsWrap">
                <div v-for="(it, j) in keyName[2].value" :key="j" :title="it.name" @click="showSku(2,j,it.value)" :class="{active:skuNow2 == j,noavailable:!it.available}">
                  <!--                <img v-if="it.prop_img" :src="it.prop_img" alt="">-->
                  <span>{{it.name}}</span>
                </div>
              </div>
            </div>
<!--          <div class="num">-->
<!--            <span>选择数量</span>-->
<!--            <el-input-number v-model="num" class="inputNum" size="mini" @change="handleChange" :min="1" label="选择数量"></el-input-number>-->
<!--          </div>-->
<!--          <div class="sum">-->
<!--            <span>合计</span>-->
<!--            <span>{{priceTotal}}</span>-->
<!--            <span>来源</span>-->
<!--            <span v-if="content.good_platform">{{content.good_platform == 'taobao' ? '淘宝': content.good_platform == 'jd'?'京东':-->
<!--              content.good_platform == 'zy'?'自营':''}}</span>-->
<!--          </div>-->
<!--          <div class="sub">-->
<!--            <span>备注</span>-->
<!--            <el-input-->
<!--              type="textarea"-->
<!--              :rows="3"-->
<!--              placeholder="请输入内容"-->
<!--              v-model="textarea">-->
<!--            </el-input>-->
<!--          </div>-->
          <div class="btns">
            <el-button class="addCart" @click="submitCate">加入购物车</el-button>
            <el-button class="chat" @click="chat">咨询客服</el-button>
            <el-button v-if="showTranslate" @click="translate">一键翻译</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="itemShowBottom">
      <div class="head clearfix">
        <span>商品详情</span>
      </div>
      <div class="itemDetail">
        <div v-for="(item,i) in content.props" :key="i">
          <span>{{item.name}}:</span>
          <span>{{item.value}}</span>
        </div>
      </div>
      <div id="qwe" class="clearfix"></div>
    </div>
    <div class="addGoodWrap1" v-if="showCate">
      <AddGood :cate="cate" :showCate.sync="showCate"></AddGood>
    </div>
  </div>
</template>

<script>
  import {publicPost} from '../api/index.js'
  import PicZoom from 'vue-piczoom'
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'
  import Nav from '../components/Nav.vue'
  import AddGood from '../components/AddGood.vue'

  export default {
    data(){
      return{
        swiperOption: {
          slidesPerView: 6,
          spaceBetween: 10,
          loop: false,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
        showTranslate:false,
        title: {
          // title: '手机数码',
          // name: '三星'
          title: '',
          name: ''
        },
        num: 1,
        textarea:'',
        selectImgNow: '0',
        content: '',
        bigUrl: '',
        sku:[],
        skuNow: 0,
        skuNow1:0,
        skuNow2: 0,
        value: 0,
        value1:0,
        value2:0,
        propertyNow: 0,
        imgList:[],
        titleHead: '',
        keyName:[],
        property:'',
        cate:{},
        showCate:false,
        // 一共有几种选择
      }
    },
    mounted(){
      //骨架屏生成前的修改
      // publicPost('home/getGoodInfo',[{id:119}]).then((res) => {
      //   if (res.data.code == 0) {
      //     this.$store.state.loading = false;
      //     this.content = res.data.data;
      //     this.changeImg(0);
      //     var arr5 = [];
      //     var arr3 = [];
      //     if (this.content.good_platform == 'jd') {
      //       this.content.skus.sku.forEach((item, i) => {
      //         if (item.sku_id == this.content.num_iid) {
      //           arr3.push(item);
      //           this.content.skus.sku = arr3;
      //         }
      //       })
      //     }
      //     this.content.skus.sku.forEach((item,i) => {
      //       if (item.prop_img) {
      //         item.prop_img = this.$host + item.prop_img;
      //       }
      //       arr5.push(item);
      //     })
      //     this.sku = arr5;
      //     this.propList();
      //     this.titleHead = this.content.title;
      //     this.imgDoList();
      //     this.$nextTick( () => {
      //       document.getElementById('qwe').innerHTML = this.content.desc;
      //     })
      //   } else {
      //     this.$store.state.loading = false;
      //     this.$message('出错了');
      //   }
      // })


      if(this.$route.params.id){
        if (this.$route.params.id == 'diy') {
          // 从api接口请求数据  头部请求网址  已请求过数据
          var obj2 = window.localStorage.getItem('content');
          if (obj2) {
            var obj = JSON.parse(obj2);
            this.bigUrl = obj.item.pic_url;
            this.titleHead= obj.item.title;
            console.log(obj);
            this.changeData(obj);
            this.showTranslate = true
          }
        } else if(this.$route.params.id != 'diy'){
          // 从后台请求数据
          this.$store.state.loading = true;
          publicPost('home/getGoodInfo',[{id:this.$route.params.id}]).then((res) => {
            if (res.data.code == 0) {
              this.$store.state.loading = false;
              this.content = res.data.data;
              this.changeImg(0);
              var arr5 = [];
              var arr3 = [];
              if (this.content.good_platform == 'jd') {
                this.content.skus.sku.forEach((item, i) => {
                  if (item.sku_id == this.content.num_iid) {
                    arr3.push(item);
                    this.content.skus.sku = arr3;
                  }
                })
              }
              this.content.skus.sku.forEach((item,i) => {
                if (item.prop_img) {
                  item.prop_img = this.$host + item.prop_img;
                }
                arr5.push(item);
              })
              this.sku = arr5;
              this.propList();
              this.titleHead = this.content.title;
              this.imgDoList();
              this.$nextTick( () => {
                document.getElementById('qwe').innerHTML = this.content.desc;
              })
            } else {
              this.$store.state.loading = false;
              this.$message('出错了');
            }
          })
        } else {
          this.$store.state.loading = false;
          this.$router.push({
            name: 'Home',
          })
        }
      } else {
        this.$store.state.loading = false;
        this.$router.push({
          path: '/',
        })
      }


      (function () {
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/5ef06f419e5f694422910d81/default';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
      })();




      // var user = this.$cookies.get('user');
      // if (user) {
      //   this.$store.dispatch('getCollects');
      // }
    },
    activated(){
      this.initData();
    },
    components:{
      Nav,
      AddGood,
      PicZoom,
      Swiper,
      SwiperSlide
    },
    methods:{
      translate(){
       // keyName:[
       //   {"title":"颜色分类","value":[{"name":"银色（16-50）","value":"1627207:1264872239","available":true},{"name":"白色（16-50）","value":"1627207:1264872240","available":true},{"name":"绿色（16-50）","value":"1627207:1816426530","available":true}]},{"title":"套餐类型","value":[{"name":"官方标配","value":"5919063:6536025","available":true}]}
       //   ]
       //  var arr = [];
        if (this.titleHead) {
          this.getTranslateText(this.titleHead).then((res) => {
            this.titleHead = res
          })
        }
       this.keyName.forEach((item,i) => {
         if (item.title) {
           this.getTranslateText(item.title).then((res) => {
             this.$set(this.keyName[i],'title',res)
           })
         }
         if (item.value && item.value.length) {
           item.value.forEach((it,r) => {
             this.getTranslateText(it.name).then((res) => {
               this.keyName[i].value[r].name = res;
             })
           })
         }
       })

      },
      getTranslateText(text){
        return new Promise((resolve,reject) => {
          publicPost('common/translate',[{text:text}]).then((res) => {
            console.log(res);
            if (res.data.code==0) {
              resolve(res.data.data.trans_result[0].dst);
            } else {
              this.$message(res.msg);
            }
          })
        })

      },
      chat(){
        Tawk_API.toggle()
      },
      // collectByUser(id){
      //   var user = this.$cookies.get('user');
      //   if (user&&user.id) {
      //     if(this.collectList.indexOf(this.content.id)>=0){
      //       collect(user,id,'',true).then((res) => {
      //         if (res.data.code == 0) {
      //           var arr = [];
      //           this.collectList.forEach((it) => {
      //             if(it != id) {
      //               arr.push(it)
      //             }
      //           })
      //           this.$store.commit('changeCollect', arr);
      //
      //         } else {
      //           this.$message(res.data.msg);
      //         }
      //       })
      //     } else {
      //       collect(user,id,'',false).then((res) => {
      //         if (res.data.code == 0) {
      //           var arr = this.collectList;
      //           arr.push(id);
      //           this.$store.commit('changeCollect', arr);
      //         } else {
      //           this.$message(res.data.msg);
      //         }
      //         console.log(res);
      //       })
      //     }
      //   } else {
      //     this.$store.state.showLogin = true
      //   }
      // },

      submitCate(){
        if(this.$cookies.get('user') &&this.$cookies.get('user').id) {
          if(this.onePrice) {
            var prop = [];
            // [
            //   {"title":"颜色分类",
            //     "value":[
            //       {"name":"银色（16-50）","value":"1627207:1264872239","available":true},
            //       {"name":"白色（16-50）","value":"1627207:1264872240","available":true},
            //       {"name":"绿色（16-50）","value":"1627207:1816426530","available":true}]},
            //   {"title":"套餐类型","value":[
            //     {"name":"官方标配","value":"5919063:6536025","available":true}]}]
            this.keyName.forEach((item,i) => {
              if (item.title&&item.value&&item.value.length) {
                item.value.forEach((pit,i) => {
                  if(this.property.indexOf(';') >= 0) {
                    var pr = this.property.split(';');
                    pr.forEach((it) => {
                      if(it==pit.value) {
                        prop.push(item.title + ':' + pit.name)
                      }
                    })
                  } else {
                    if(this.property== pit) {
                      prop.push(item.title + ':' + pit.name)
                    }
                  }
                })
              }
            })


            // var keys = Object.keys(this.content.props_list);
            // keys.forEach((item,i) => {
            //   if(this.property.indexOf(';') >= 0) {
            //     var pr = this.property.split(';');
            //     pr.forEach((it) => {
            //       if(it==item) {
            //         prop.push(this.content.props_list[item])
            //       }
            //     })
            //   } else {
            //     if(this.property== item) {
            //       prop.push(this.content.props_list[item])
            //     }
            //   }
            // })
            var obj = {};
            if (this.$route.params.id == 'diy') {
              obj.diy = true;
              obj.detailUrl = this.content.detail_url;
              obj.platform = this.content.good_platform;
              obj.skus = this.sku;
            }
            obj.id = this.content.id;
            obj.plat = this.content.good_platform;
            obj.title = this.titleHead;
            obj.prop = prop;
            var arr = this.bigUrl.split('.');
            obj.pic = this.bigUrl;
            this.sku.forEach((item,i) => {
              if (item.properties == this.property) {
                obj.sku = item;
              }
            })
            this.cate = obj;
            console.log(obj);
            this.showCate = true;
          } else {
            this.$message('请先选择可购买的商品')
          }
        } else {
          this.$store.state.showLogin = true;
        }
      },
      showSku(index,now,value){
        var str = '';
        index == 0 ? this.skuNow = now : index == 1 ? this.skuNow1 = now : index == 2 ? this.skuNow12= now : '';
        index == 0 ? this.value = value : index == 1 ? this.value1 = value : index == 2 ? this.value2= value : '';
        this.keyName.length == 1 ? str = this.value : this.keyName.length == 2 ? str = this.value + ';' + this.value1 :
          this.keyName.length == 3 ? str = this.value + ';' + this.value1 + ';' + this.value2 : '';

        // this.sku.forEach((item,i) => {
        //   if (item.properties.indexOf(value) >= 0) {
        //     this.keyName.forEach((it,j) => {
        //       if(j!=index) {
        //         it.value.forEach((itr,p) => {
        //           if(item.properties.indexOf(itr.value) >= 0) {
        //             this.$set(this.keyName[j].value[p],'available',true)
        //           } else{
        //             this.$set(this.keyName[j].value[p],'available',false)
        //           }
        //         })
        //       }
        //     })
        //   }
        // })
        this.property = str;
      },
      propList(){
        var prop = this.content.props_list;
        var propObj = {};
        this.sku.forEach((item, i) => {
          for (var it in prop) {
            if (item.properties.indexOf(';' > 0)) {
              var str = item.properties.split(';');
              if (it == str[0] || it == str[str.length - 1]) {
                propObj[it] = prop[it];
              }
            } else {
              if (item.properties == it) {
                propObj[it] = prop[it];
              }
            }
          }
        //   for (var it in prop) {
        //     var str = item.properties.split(';');
        //     if (item.properties.indexOf(it) >= 0) {
        //       propObj[it] = prop[it];
        //     }
        //   }
        })
        // 0:2: "尺码:230x229cm被套"
        // 1:1: "颜色:快乐小花"
        // 1:11: "颜色:帕米拉蓝"
        console.log(propObj);
        var arr = Object.keys(propObj);
        // 左边数组拿到
        var arrLeft = [];
        arr.forEach((item,i) => {
          var a = item.split(':')[0];
          if(arrLeft.indexOf(a) < 0) {
            //是颜色还是尺寸  有几种类别
            arrLeft.push(a);
          }
        })

        var right = Object.values(propObj);
        var arrRight = [];
        right.forEach((item) => {
          var b = item.split(':')[0],c = item.split(':')[1];
          if (arrRight.indexOf(b) < 0) {
            // 类别的名称（颜色分类或者尺寸之类）
            arrRight.push(b);
          }
        })

        //右边分类整理
        var arrleftprop = [];
        arrLeft.forEach((item, i) => {
          arrleftprop.push([]);
          for (var it in propObj) {
            if (it.indexOf(item) >= 0) {
              var str = propObj[it];
              if (str.indexOf(':') >= 0) {
                str = str.split(':')[1];
              }
              var obj = {
                name: str,
                value: it,
                available:true,
              }
              arrleftprop[i].push(obj);
            }
          }
        })
        var objNow = [];
        arrRight.forEach((it,i) => {
          objNow.push({});
          arrleftprop.forEach((left,j) => {
            if (i==j) {
              objNow[i].title = it;
              objNow[i].value = left;
            }
          })
        })
        this.keyName = objNow;
        // [{
        //   title: "颜色分类",
        //   value: [{
        //     name: "iPhone7/8 Plus专用-白色",
        //     value: "1627207:587329408",
        //   }]
        // }]

        console.log(this.keyName);
        if (this.keyName.length == 1) {
          this.showSku(0,0,this.keyName[0].value[0].value)
        }
        if (this.keyName.length == 2) {
          this.showSku(0,0,this.keyName[0].value[0].value);
          this.showSku(1,0,this.keyName[1].value[0].value);
        }
        if (this.keyName.length == 3) {
          this.showSku(0,0,this.keyName[0].value[0].value);
          this.showSku(1,0,this.keyName[1].value[0].value);
          this.showSku(2,0,this.keyName[2].value[0].value);
        }
      },
      handleChange(){},
      changeData(obj){
        var arr5 = [], arr=[],imglist = [];
        if (Array.isArray(obj.call_args)) {
          obj.call_args.forEach((item) => {
            obj.item.skus.sku.forEach((ir) => {
              if (obj.api_type == 'taobao') {
                arr5.push(ir)
              }
              if (obj.api_type == 'jd') {
                if (item == ir.sku_id) {
                  arr5.push(ir)
                }
              }
            })
          })
        } else {
          obj.item.skus.sku.forEach((ir) => {
            if (obj.api_type == 'taobao') {
              arr5.push(ir)
            }
            if (obj.api_type == 'jd') {
              if (obj.call_args.num_iid == ir.sku_id) {
                arr5.push(ir)
              }
            }
          })
        }
        if (Array.isArray(obj.item.item_imgs)) {
          obj.item.item_imgs.forEach((item, i) =>{
            imglist = obj.item.item_imgs;
          })
        } else{
          obj.item.item_imgs.item_img.forEach((item, i) =>{
            imglist = obj.item.item_imgs.item_img;
          })
        }
        console.log(arr5);

        // [{
        //   orginal_price: "431.00"
        //   price: "184.00"
        //   prop_img: "//img10.360buyimg.com/n1/jfs/t1/7424/8/11653/286657/5c2dd778E724f3220/692aaf971e504923.png"
        //   properties: "0:2;1:11"
        //   properties_name: "0:2:尺码:230x229cm被套;1:11:颜色:帕米拉蓝"
        //   props: "颜色:帕米拉蓝"
        //   quantity: 99
        //   sku_id: 25378594875
        //   sku_url: "http://item.jd.com/25378594875.html"
        // }]
        arr5.forEach((q,i) => {
          if (q.properties) {
            // 筛选出选择商品中的图片跟尺寸
            if(obj.item.prop_imgs.prop_img) {
              obj.item.prop_imgs.prop_img.forEach((item,j) =>{
                if (q.properties.indexOf(item.properties) >=0) {
                  // 小图片
                  q.prop_img = item.url;
                }
              })
            }
          }
          var props_list = Object.keys(obj.item.props_list);
          props_list.forEach((it,i) => {
            if(q.properties.indexOf(it) >= 0){
              q.props = obj.item.props_list[it];
            }
          })
          arr.push(q);
        })
        var arr6 = [];
        console.log(imglist);
        imglist.forEach((item,i) => {
          arr6.push(Object.values(item)[0]);
        })
        console.log(arr6);
        this.imgList = arr6;
        this.sku = arr;
        this.content = obj.item;
        this.content.good_platform = obj.api_type;

        console.log(this.content);
        this.propList();
        this.$nextTick( () => {
          document.getElementById('qwe').innerHTML = obj.item.desc;
        })
      },
      // showCollect(){
      //   this.collectList.forEach((id)=>{
      //     if(this.content.id == id) {
      //       this.content.iscollect = true;
      //     }
      //   })
      // },
      changeImg(i){
        this.selectImgNow = i;
        if(this.$route.params.id == 'diy'){
          this.bigUrl = this.imgList[i];
        } else {
          var arr2 = this.content.item_imgs[i].origin.split('.');
          var str = this.content.item_imgs[i].origin + '_b.' + arr2[arr2.length-1];
          this.bigUrl = this.$host + str;
        }
      },
      imgDoList(){
        var arr = [];
        this.content.item_imgs.forEach((item,i) => {
          if(item.middle) {
            arr.push(this.$host +item.middle)
          } else {
            arr.push(item)
          }
          // var arr2 = item.middle.split('.');
          // arr2[arr2.length-2] = arr2[arr2.length-1] + '_bc';
          // arr.push(this.$host + arr2.join('.'));
        })
        this.imgList = arr;
      },
    },
    watch:{
      $route (to, from) {
        if (to.path=='/items/diy') {
          this.$router.go(0)
        }
      }
    },
    computed:{
      // collectList(){
      //   return this.$store.state.collectList;
      // },
      // isCollect(){
      //   this.collectList.forEach((id) => {
      //     if (this.content && this.content.id) {
      //       if(this.content.id == id){
      //         return true;
      //       }
      //     }
      //   })
      // },
      onePrice: function(){
        var pr = 0;
        if (this.sku&&this.sku.length) {
          this.sku.forEach((item,i) => {
            if (item.properties == this.property) {
                pr =  item.price;
            }
          })
          return pr;
        }
      },
      priceTotal: function () {
        var pr = 0;
        if (this.sku&&this.sku.length) {
          this.sku.forEach((item,i) => {
            if (item.properties == this.property) {
              item.price = item.price -0;
              pr = item.price * this.num.toFixed(3);
              pr = Math.round(pr * 100) / 100;
            }
          })
          return pr;
        }else {
          var price = this.content.price -0;
          pr = price * this.num.toFixed(3);
          pr = Math.round(pr * 100) / 100;
          return pr;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../assets/css/base.scss";
  .itemsWrap{
    background: white;
    padding: 0 8px;
    box-sizing: border-box;
    .addGoodWrap1{
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      z-index: 1999;
      background: $greyBack;
    }
    margin-bottom: 28px;
    @include initWrap;
    min-width: 1200px;
    .oneWrap{
      margin-top: 38px;
      .imgWrap{
        width: 350px;
        float: left;
        .bottomList{
          margin-top: 10px;
          height: 98px;
          .swiper-button-prev:after, .swiper-button-next:after{
            font-size: 20px;
            color: #666;
          }
          img{
            width: 50px;
            padding: 1px;
            box-sizing: border-box;
            cursor: pointer;
          }
          .swiper{
            user-select: none;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
          }
          .active{
            border: 1px solid $active;
          }
          .collect{
            user-select: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-top: 8px;
            img{
              width: 28px;
              margin-right: 6px;
            }
            .collectimg{
              font-size: 30px;
            }

          }
          .collect:hover{

          }
        }
      }
      .showRight{
        float: left;
        margin-left: 68px;
        text-align: left;
        font-size: 18px;
        color: #888;
        width: 760px;
        .from{
          font-size: 14px;
        }
        >div{
          margin-bottom: 24px;
        }
        .title{
          letter-spacing: 1.2px;
          font-size: 24px;
          font-weight: bolder;
          line-height: 30px;
          color: #333;
          margin-bottom: 20px;
        }
        .price{
          letter-spacing: 2px;
          font-size: 28px;
          font-weight: bolder;
          color: $active;
          margin-bottom: 20px;
        }
        .props{
          box-sizing: border-box;
          user-select: none;
          >i{
            display: inline-block;
            margin-bottom: 8px;
          }
          .propsWrap2{
            >div{
              vertical-align: top;
              cursor: pointer;
              display: inline-block;
              margin: 0 10px 10px 0;

              img{
                width: 36px;
                height: 36px;
                padding: 1px;
                border: 1px solid #DCDCDC;
                display: inline-block;
                border-radius: 3px;
              }
              span{
                padding: 1px;
                display: inline-block;
                height: 36px;
                line-height: 36px;
                width: 82px;
                border: 1px solid #DCDCDC;
                font-size: 12px;
                @include ellipse;
              }
            }
            .active{
              border-width: 2px;
              border-color: $active;
              color: $active;
            }
          }
          .propsWrap{
            >div{
              height: 28px;
              display: inline-block;
              margin: 0 16px 4px 0;
              border: 1px solid #999;
              cursor: pointer;
              text-align: center;
              border-radius: 3px;
              img{
                height: 46px;
              }
              span{
                display: inline-block;
                max-width: 760px;
                line-height: 28px;
                font-size: 13px;
                padding: 2px 8px;
                @include ellipse;
              }
              i{
                margin-right: 16px;
              }
            }
            .active{
              border-width: 2px;
              border-color: $active;
              color: $active;
            }
            .noavailable{
              cursor: not-allowed;
              border-color: #999;
              color: #999;
              background: #f7f7f7;
            }
          }
        }
        .chioce{
          >div{
            >span{
              margin-right: 20px;
              max-width: 260px;
              display: inline-block;
              margin-bottom: 4px;
              @include ellipse
            }
          }

          .item{
            user-select: none;
            cursor: pointer;
            margin-right: 16px;
            padding: 4px 8px;
            border: 1px solid #999;
            font-size: 16px;
            img{
              width: auto;
              max-height: 40px;
              margin-right: 8px;
            }
          }
          .active{
            border-color: $active;
            color: $active;
          }
        }
        .num{
          span{
            margin-right: 18px;
          }
          .inputNum{
            width: 98px;
          }
        }
        .sum{
          span:first-child{
            margin-right: 54px;
          }
          span:nth-child(2){
            color: $active;
            margin-right: 18px;
          }
          span:nth-child(3){
            margin-right: 8px;
          }
          span:nth-child(4){
            color: #aaa;
          }
        }
        .sub{
          margin-bottom: 40px;
          span{
            margin-right: 54px;
            vertical-align: top;
          }
          .el-textarea{
            width: 80%;
          }
        }
        .btns{
          .addCart{
            background: #FF2525;
            color: white;
          }
          .chat{
            background: $themeColor;
            margin: 0 20px;
            color: white;
          }
        }
        .translate{
          text-align: right;
          span{
            color: #333;
            font-size: 13px;
            padding-right: 2em;
            cursor: pointer;
          }
          span:hover{
            color: $active;
          }
        }
      }
    }


    .itemShowBottom{
      clear: both;
      margin-top: 34px;
      .itemDetail{
        color: #555;
        text-align: left;
        width: 94%;
        margin: 16px auto;
        >div{
          display: inline-block;
          margin-bottom: 8px;
          margin-right: 20px;
          span{
            margin-right: 10px;
          }
        }
      }
      .head{
        text-align: left;
        font-size: 28px;
        padding-bottom: 8px;
        color: #333;
        width: 100%;
        border-bottom: 1px solid #aaa;
      }
    }
  }
.demo{
  width: 484px;
  height: 500px;
}
  #qwe{
    *zoom:1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 0 auto;
  }

</style>


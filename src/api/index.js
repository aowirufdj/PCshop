import {http} from './http.js'
import axios from 'axios'
import $store from '../store/index.js'
import Router from '../router/index.js'
import { Message } from 'element-ui';
import cookie from 'vue-cookies'
import app55 from '../main.js'
var $http5 = axios.create({
  headers:{
    'Content-Type': 'multipart/form-data'
  },
  baseURL: 'https://api.amandacat.shop/api',
});

// 首页数据
export function homeList() {
  return http('home',[]);
}
// 首页推荐懒加载
export function getCommandList(url,arr) {
    return http(url,arr);
}

// 首页商品网址查询
export function getByUrl(url) {
  return http(
    'service/loadGood',[{'good_url' : url}]
  )
}
//注册-发送验证码
export function setPhoneCode(phone) {
    return http(
      'common/register', [{'phone' : phone}]
    )
}

// 注册确认
export function valiCode(phone, code, pwd, nickname) {
  return http(
    'common/register', [{'phone' : phone}, {'code': code}, {'pwd': pwd}, {'nickname':nickname}]
  )
}

//单个商品详情
export function getOneItem(id) {
  return http(
    'home/getGoodInfo', [{'id' : id}]
  )
}

// 修改密码
export function changePassword(phone,code,newpwd) {
  return http(
    'common/resetPwd',[{'phone': phone}, {'code': code}, {'newpwd': newpwd}]
  )
}
 //修改密码时发送验证码
export function changeVali(phone) {
  return http(
    'common/resetPwd',[{'phone': phone}]
  )
}
export function getPersonInfo(id, token) {
  return http(
    'user/getUserInfo',[{'id': id}, {'token': token}]
  )
}

// 第三方登录接口
export function logByOther(api, token) {
  return http(
    'common/login', [{'api': api}, {'param[token]':token}]
  )
}

// 第三方第一次登陆绑定手机号
export function bindOtherPhone(phone, code,token, api) {
  return http(
    'common/bindPhone',
    [{'phone' : phone},{'code': code},{'param[token]': token},{'api': api}]
  )
}

// 第三方第一次发送手机验证码
export function bindOtherPhoneVali(phone) {
  return http(
    'common/bindPhone', [{'phone': phone}]
  )
}

//手机号与密码直接登录
export function loginByPhone(phone,pwd) {
  return http('common/login', [{'phone': phone}, {'pwd': pwd}])
}

// 收藏、取消收藏
export function collect(user,good_id,remark,isdelete) {
  if (isdelete) {
    return http('user/collect',[{id:user.id},{token:user.token},{good_id:good_id},{remark:remark},{delete:1}])
  } else {
    return http('user/collect',[{id:user.id},{token:user.token},{good_id:good_id},{remark:remark}])
  }
}
// 获取收藏列表
export function getCollects(user) {
  return http('user/getCollects',[{id:user.id},{token:user.token}])
}
//获取文章列表
export function getArticles(page,limit) {
  return http('home/getArticles',[{page:page},{limit:limit}])
}
//获取文章内容
export function getArticleContent(id) {
  return http('home/getArticleContent',[{id:id}])
}
// 上传图片
export function uploadImage(file) {
  var formDate = new FormData();
  formDate.append('upfile',file)
  return axios.post('https://api.amandacat.shop/static/js/editor/ueditor2/php/controller.php?action=uploadimage',formDate,{
    headers:{
      'Content-Type': 'multipart/form-data'
    },
  })
}
// //添加进购物车
// export function addCart(id,token,good_id,num,options,uploads,remark,good_sku_id) {
//   var arr = [{id:id},{token:token},{good_id:good_id},{num:num},{remark:remark},{good_sku_id:good_sku_id}];
//   uploads.forEach((item,i) => {
//     var obj = {};
//     obj['uploads['+i+']'] = item;
//     arr.push(obj);
//   })
//   options.forEach((op,p) => {
//     var obj ={};
//     obj['options['+p+']'] = op;
//     arr.push(obj);
//   })
//   return http('cart/save',arr)
// }


// 公共ajax
export function publicPost(url,data) {
  return new Promise((resolve,reject) => {
    if (app55) {
      app55.$Progress.start();
    }
    var formData = new FormData();
    data.forEach((item, i) => {
      var objName = Object.getOwnPropertyNames(item)[0];
      var value = Object.values(item)[0];
      if (Array.isArray(value)) {
        value.forEach((it,k) => {
          formData.append(objName+'['+k+']', it);
        })
      } else {
        formData.append(objName, item[objName]);
      }
    })
    $http5.post(url, formData).then((res) => {
      if (res.data.code == 0) {
        if (app55) {
          app55.$Progress.finish();
        }
        resolve(res);
      } else if(res.data.code == 300){
        if (app55) {
          app55.$Progress.fail();
        }
        cookie.remove('user');
        Message('登录过期,请重新登录');
        $store.state.showLogin = true;
      }
    }).catch((err) =>{
      if (app55) {
        app55.$Progress.fail();
      }
      reject(err);
      // Message(res.data.msg);
    });
  })
}

export function gotoitem(obj) {
  if(obj.good_from == 'member') {
    $store.state.loading = true;
    getByUrl(obj.good_detail_url).then((res) => {
      $store.state.loading = false;
      if (res.data.code == 0) {
        var obj = unescape(res.data.data.replace(/\\u/gi, '%u'));
        window.localStorage.setItem('content',obj);
        var ope = Router.resolve({
            name : 'Items',
            params: {
              id: 'diy',
            },
          }
        )
        window.open(ope.href,'_blank')
      } else {
        $store.state.loading = false;
        Message('获取商品信息失败');
      }
    })
  } else {
    var op = Router.resolve({
      name:'Items',
      params:{
        id:obj.good_id,
      }
    })
    window.open(op.href,'_blank')
  }
}


import axios from 'axios'
// axios.interceptors.response.use(response => {
// }, err => {
//   if (err && err.response) {
//     switch (err.response.status) {
//       case 400:
//         err.message = '错误请求'
//         break
//       case 401:
//         err.message = '未授权，请重新登录'
//         break
//       case 403:
//         err.message = '拒绝访问'
//         break
//       case 404:
//         err.message = '请求错误,未找到该资源'
//         break
//       case 405:
//         err.message = '请求方法未允许'
//         break
//       case 408:
//         err.message = '请求超时'
//         break
//       case 500:
//         err.message = '服务器端出错'
//         break
//       case 501:
//         err.message = '网络未实现'
//         break
//       case 502:
//         err.message = '网络错误'
//         break
//       case 503:
//         err.message = '服务不可用'
//         break
//       case 504:
//         err.message = '网络超时'
//         break
//       case 505:
//         err.message = 'http版本不支持该请求'
//         break
//       default:
//         err.message = `连接错误${err.response.status}`
//     }
//     let errData = {
//       code: err.response.status,
//       message: err.message
//     }
//     // 统一错误处理可以放这，例如页面提示错误...
//     this.$message(errData);
//     console.log('统一错误处理: ', errData)
//   }
//   //
//   // return Promise.reject(err)
// })

var $http = axios.create({
  headers:{
    'Content-Type': 'multipart/form-data'
  },
  baseURL: 'https://api.amandacat.shop/api',
});

export function http(url, data) {
  var formData = new FormData();
  data.forEach((item, i) => {
    var objName = Object.getOwnPropertyNames(item)[0];
    formData.append(objName, item[objName]);
  })
  return $http.post(url,formData);
}


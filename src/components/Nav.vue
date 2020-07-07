<template>
  <div class="head">
    <router-link to="/">
      <span>首页</span>
    </router-link><i class="el-icon-arrow-right" v-if="title.title"></i><span> {{title.title}} </span>
    <i class="el-icon-arrow-right" v-if="title.name"></i><span> {{title.name}}</span>
  </div>
</template>

<script>
  export default {
    props:{
      title:{
        type: Object,
        default: function () {
          return{
            title: '首页',
              name: ''
          }
        }
      }
    },
    name: 'Nav'
  }
</script>

<style lang="scss" scoped>
@import "../assets/css/base.scss";
  .head{
    @include head;
    span{
      cursor: pointer;
      margin-right: 10px;
    }
  }
</style>

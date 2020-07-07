<template>
  <div class="catagory">
    <div class="head">
      商品分类
    </div>
    <div class="content">
        <span v-for="(item, i) in cates" :key="i" :title="item.cate_name" @click="gotoCate(item.id,item.cate_name)">{{item.cate_name}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GoodsCatagary',
    props:{
      cates: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    methods:{
      gotoCate(id,name){
        this.$router.push({
            path: '/categorys',
            query: {
              id:id,
              name:name,
            }
          }
        )
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/base.scss';
  .catagory{
    transition: opacity 50ms ease-in-out;
    width: 480px;
    text-align: left;
    .head{
      @include hotAndGood;
      background: url("../assets/img/timg2.png") no-repeat left 12px;
      padding-left: 1.4em;
      padding-bottom: 8px;
    }
    .content{
      background: white;
      box-shadow: $boxShadow;
      padding: 40px;
      span{
        color: #333;
        text-decoration: underline #666;
        display: inline-block;
        width: 188px;
        cursor: pointer;
        text-align: center;
        margin: 10px 0;
      }
      span:hover{
        @include hover
      }
    }
  }
  .isfixed{
    position: fixed;
    right: calc((100vw - 1217px) / 2);
    width: 40%;
    top: 0;
    /*bottom: 0;*/
    margin: auto;
    max-width: 480px;
  }
  /*@media (min-width: 1200px) and (max-width: 1680px){*/
  /*  .isfixed{*/
  /*    position: fixed;*/
  /*    right: 100px;*/
  /*    width: 40%;*/
  /*    top: 180px;*/
  /*    max-width: 480px;*/
  /*  }*/
  /*}*/
  /*@media screen and (max-width: 1200px) {*/
  /*  .isfixed{*/
  /*    position: fixed;*/
  /*    right: 0;*/
  /*    width: 40%;*/
  /*    top: 180px;*/
  /*    max-width: 480px;*/
  /*  }*/
  /*}*/
</style>

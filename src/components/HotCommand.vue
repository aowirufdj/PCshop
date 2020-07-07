<template>
  <div class="hotWrap">
    <div class="head">
      <span>热门推荐</span></div>
    <div class="hotContent">
      <div class="item" v-for="(item, i) in hotGood" :key="i">
        <div class="leftItem">
          <img :src="$host + item.pic_url" alt="">
        </div>
        <div class="rightItem">
          <p class="rightHead" :title="item.title" @click="gotoItems(item)">
            {{item.title}}
          </p>
<!--          <p class="tip">(免税专属)</p>-->
          <p class="price">{{item.price}}</p>
          <p class="detail">
            {{item.desctxt}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HotCommand',
    props:{
      hotGood:{
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    methods:{
      gotoItems(item){
        this.$router.push({
            name : 'Items',
            params: {
              content: JSON.stringify(item),
              id: item.id,
            },
          }
        )
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../assets/css/base.scss';
  .hotWrap{
  width: 100%;
  text-align: left;
  .head{
    @include hotAndGood;
    background: url("../assets/img/timg2.png") no-repeat left 12px;
    padding-left: 1.4em;
    padding-bottom: 8px;
  }
  .hotContent{
    box-shadow: $boxShadow;
    .item{
      width: 100%;
      display: flex;
      height: 192px;
      background: white;

      align-items: center;
      justify-content: space-between;
      .leftItem{
        width: 30%;
        height: 100%;
        img{
          width: 120px;
          margin: 24px 0 0 12px;
        }
      }
      .rightItem{
        height: 100%;
        padding: 20px 0;
        position: relative;
        margin-left: 10px;
        text-align: left;
        box-sizing: border-box;
        width: 70%;
        .tip{
          font-size: 14px;
          color: #999;
        }
        .rightHead{
          font-size: $titlefontsize;
          color: black;
          cursor: pointer;
          max-height: 44px;
          padding-right: 4px;
          overflow: hidden;
          line-height: 22px;
          position:relative;
          text-overflow:ellipsis;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
        }
        .rightHead:hover{
          @include hover;
        }
        .detail{
          margin: 6px 0;
          font-size: 14px;
          color: #999;
          max-width: 96%;
          overflow: hidden;
          word-break: break-word;
          line-height: 22px;
          max-height: 66px;
        }
        .price{
          margin-top: 4px;
          color: $active;
          font-size: 24px;
        }
        .bottom{
          position: absolute;
          bottom: 18px;
          left: 0;
          padding-right: 20px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          .one1{
            color: #999;
          }

          .one2{
            cursor: pointer;
            color: #999;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            .collect{
              font-size: 30px;
            }
          }
          .one3{
            color: #666;
            span:nth-child(1){
              margin-right: 12px;
            }
            span:nth-child(2){
              cursor: pointer;
              display: inline-block;
              padding: 4px 12px;
              background: $active;
              color: white;
              border-radius: 6px;
            }
          }
        }

      }
    }
  }
}
</style>

<template>
  <div class="infoWrap">
    <div class="head">
      <span @mouseenter="show(1)" :class="activeName == 1 ? 'active': ''">{{$t('head.goodinfo')}}</span>
      <span @mouseenter="show(2)" :class="activeName == 2 ? 'active': ''">{{$t('head.goodselect')}}</span>
    </div>
    <div class="infoContent" v-if="dataNow[0]">
        <div class="item">
          <div class="leftItem">
              <img :src="$host + dataNow[0].article_cover.bigcover" alt="">
          </div>
          <div class="rightItem">
            <p class="rightHead" :title="dataNow[0].article_title" @click="gotoItems(dataNow[0].id)">
              {{dataNow[0].article_title}}
            </p>
<!--            <p class="tip" :title="dataNow[0].article_class"  @click="gotoItems(dataNow[0].id)">({{dataNow[0].article_class}})</p>-->
            <p class="price" :title="dataNow[0].article_description"  @click="gotoItems(dataNow[0].id)">"{{dataNow[0].article_description}}"</p>
            <!--          <p class="detail">-->
            <!--            {{dataNow[0].article_content}}-->
            <!--          </p>-->
          </div>
        </div>

        <div v-for="(itr, j) in otherData" :key="j" @mouseenter="enter(j)" @mouseleave="leave(j)">
          <p :class="{'active':show55 ==j, 'moreDetail':true}" :title="itr.article_title"  @click="gotoItems(itr.id)">{{itr.article_title}}</p>
          <div class="item8" :style="{height: show55 ==j ? 'auto': '0'}">
            <div class="leftItem">
              <img :src="$host + itr.article_cover.smallcover" alt="">
            </div>
            <div class="rightItem">
              <p class="rightHead" :title="itr.article_description">
                "{{itr.article_description}}"
              </p>
              <!--            <p class="rightHead">-->
              <!--              {{itr.article_content}}-->
              <!--            </p>-->
<!--              <div class="bottom">-->
<!--                <div class="one2">-->
<!--                  <span   @click="gotoItems(itr.id)">查看</span>-->
<!--                </div>-->
<!--              </div>-->
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'InfoOfChioce',
    data(){
      return{
        activeName: '1',
        show55:'1000',
        titleList: [],
        dataList:[],
        dataList2:[],
        dataNow: [],
        otherData:[],
        isLeave : true,
      }
    },
    props:{
      infoList:{
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    mounted(){
      console.log(this.infoList);
    },
    methods:{
      gotoItems(id){
        this.$router.push({
            name : 'Article',
            params: {
              id: id,
            },
          }
        )
      },
      show(num){
        this.activeName = num;
        if (this.activeName == '1') {
          this.dataNow = this.dataList;
        } else {
          this.dataNow = this.dataList2;
        }
      },
      enter(j){
        this.show55 = j;
      },
      leaveAll(){
        this.isLeave = false;
      },
      leave(j){
        this.show55 = this.otherData.length +5;
      },
      getTitleList(){
        console.log(this.infoList);
        var arr = [];
        arr.push(this.infoList.features[0].article_class);
        arr.push(this.infoList.recommends[0].article_class);
        this.titleList = arr;
      },
    },
    components:{
    },
    watch:{
      infoList: function (newVal, oldVal) {
        this.dataNow = newVal.features;
          this.dataList = newVal.features;
          this.dataList2 = newVal.recommends;
      },
      dataNow: function (newVal, old) {
        var arr = [];
        newVal.forEach((it,i) => {
          if (i>0) {
            arr.push(it)
          }
        })
        this.otherData = arr;
      },
    },
    computed:{
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/base.scss';

  .infoWrap{
  width: 100%;
  .head{
    width: 100%;
    user-select: none;
    span{
      display: inline-block;
      font-size: $headFontSize;
      color: #666;
      text-align: center;
      width: 50%;
      height: 48px;
      line-height: 48px;
      cursor: pointer;
    }
    .active{
      border-bottom: 2px solid $active;
      color: $active;
    }
  }
  .infoContent{
    background: white;
    box-shadow: $boxShadow;
    padding-bottom: 16px;
    .item{
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .leftItem{
        width: 30%;
        display: flex;
        height: 100%;
        justify-content: center;
        img{
          width: 120px;
          margin-top: 22px;
        }
      }
      .rightItem{
        height: 100%;
        padding: 18px 0 10px;
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
          line-height: 22px;
          max-height: 44px;
          @include twoEllis;
        }
        .rightHead:hover{
          @include hover
        }
        .detail{
          margin-top: 8px;
          font-size: 16px;
          color: #999;
          max-width: 96%;
          overflow: hidden;
          word-break: break-word;
          line-height: 22px;
          max-height: 66px;
        }
        .price{
          font-style: italic;
          margin-top: 8px;
          color: #777;
          font-size: 14px;
          line-height: 18px;
          height: 72px;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
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
              background: #e70e0e;
              color: white;
              border-radius: 6px;
            }
          }
        }

      }
    }
    .moreDetail{
      color: #333;
      cursor: pointer;
      font-size: 16px;
      line-height: 30px;
      text-align: left;
      padding: 0 20px;
      @include ellipse
    }
    .active{
      color: $active;
    }
    .moreDetail:hover{

    }
    .item8{
      width: 90%;
      margin: 0 auto 12px;
      overflow: hidden;
      transition: height 300ms ease-in-out;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: white;
      .leftItem{
        width: 30%;
        img{
          width: 70px;
          max-width: none;
        }
      }
      .rightItem{
        height: 100%;
        padding: 10px 0;
        position: relative;
        margin-left: 10px;
        text-align: left;
        box-sizing: border-box;
        .rightHead{
          font-style: italic;
          font-size: 14px;
          color: #999;
          cursor: pointer;
          height: 84px;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
        .rightHead:hover{
          @include hover
        }
        .detail{
          margin: 14px 0 20px;
          font-size: 16px;
          color: #999;
          max-width: 90%;
          overflow: hidden;
          word-break: break-word;
          line-height: 22px;
          max-height: 66px;
        }
        .price{
          color: $active;
          font-size: 24px;
        }
        .bottom{
          position: relative;
          padding-right: 20px;
          box-sizing: border-box;
          display: flex;
          margin-top: 8px;
          align-items: center;
          width: 100%;
          >div{
            display: inline-block;
          }
          .one1{
            color: #999;
            width: 36%;
          }

          .one2{
            cursor: pointer;
            color: #999;
            right: 1em;
            margin-top: 10px;
            text-align: right;
            span{
              background: $active;
              color: white;
              padding: 6px 16px;
              border-radius: 5px;
            }
            .collect{
              font-size: 30px;
            }
          }
          .one3{
            width: 42%;
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


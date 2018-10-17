<template>
  <div>
    <nav-header>
      <a href="javascript:;" @click="goShop()">到购物车界面</a>
    </nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods()">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click='checkPrice("all")'>All</a></dd>
              <dd>
                <a href="javascript:void(0)" @click='checkPrice("0")'>0 - 100</a>
              </dd>
              <dd>
                <a href="javascript:void(0)" @click='checkPrice("1")'>100 - 500</a>
              </dd>
              <dd>
                <a href="javascript:void(0)" @click='checkPrice("2")'>500 - 1000</a>
              </dd>
              <dd>
                <a href="javascript:void(0)" @click='checkPrice("3")'>1000 - 2000</a>
              </dd>
            </dl>
          </div>
          
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList">
                  <div class="pic">
                    <a href="#"><img :src="'../../static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <img src="./../assets/loading-spinning-bubbles.svg" alt="" v-show='loading'>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal v-bind:mdShows="mdShow" v-on:close="closeModal()">
      <p slot="message">
        请先登录，否则无法加入到购物车
      </p>
      <div slot="btnGroup">
        <a href="javaScript:;" class="btn btn--m" @click="mdShow=false">关闭</a>
      </div>
    </modal>
  
    <modal v-bind:mdShows="mdShowCart" v-on:close="closeModal()">
      <p slot="message">
        加入购物车成功
      </p>
      <div slot="btnGroup">
        <a href="javaScript:;" class="btn btn--m" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m" href="javaScript:;" to="/cart" style="margin-left: 24px">跳转到购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import '../assets/css/base.css'
  import '../assets/css/product.css'
  import NavHeader from '../components/Header.vue'
  import NavFooter from '../components/Navfooter.vue'
  import NavBread from '../components/NavBread.vue'
  import Modal from '../components/modal.vue'
  import axios from 'axios'
  export default{
    components:{
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    data(){
      return {
        goodsList:[],
        page:1,
        sortFlag:true,
        pageSize:8,
        busy:true,
        loading:false,
        priceLevels:'all',
        mdShow:false,
        mdShowCart:false
      }
    },
    mounted(){
      this.getGoodsList();
    },
    methods:{
      getGoodsList(flag){
        let param = {
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortFlag?1:-1,
          priceLevel:this.priceLevels,
          
        };
        this.loading=true;
        axios.get("/goods/list",{
          params:param
        }).then((response)=>{
          let res=response.data;
          this.loading=false;
          if(res.status=="0"){
            if(flag){
              this.goodsList = this.goodsList.concat(res.result.list);
              console.log(this.goodsList);
              if(res.result.count==0){
                this.busy=true;
              }else {
                this.busy=false
              }
            }else {
              this.goodsList = res.result.list;
              this.busy=false
            }
          }else {
            this.goodsList=[];
          }
        })
      },
      sortGoods(){
        this.sortFlag = !this.sortFlag;
        this.page=1;
        this.getGoodsList()
      },
      loadMore(){
        this.busy=true;
        setTimeout(()=>{
          this.page++;
          this.getGoodsList(true);
        },1000)
      },
      checkPrice(index){
        this.priceLevels=index;
        this.page=1;
        this.getGoodsList();
      },
      addCart(productId){
        axios.post("/goods/addCart",{
          productId:productId
        }).then((res)=>{
          if(res.data.status==0){
            this.mdShowCart=true;
            console.log(res);
            this.$store.commit('updateCartCount',1)
          }else {
            this.mdShow=true;
          }
        })
      },
      closeModal(){
        this.mdShow=false;
        this.mdShowCart=false
      },
      goShop(){
        this.$router.push({path:'/cart'});
      }
    }
  }
</script>
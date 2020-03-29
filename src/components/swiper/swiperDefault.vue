<template>
    <div>
        <swiper :options='swiperOption' class="swiper">
            <swiper-slide class="swiper-slide" v-for="(item,index) in slide" :key="index">
                Slide:{{item}}
            </swiper-slide>
            <!-- <swiper-slide class="text">
                <div class="centent">
                     一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章.........
                     一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章.........
                     一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章.........
                     一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章......... 一大堆文章.........
                </div>
            </swiper-slide> -->
        </swiper>
        <div class="swiper-pagination" slot="pagination"></div>
    </div>
</template>

<script>
    import 'swiper/dist/css/swiper.css'
    import { swiper , swiperSlide } from 'vue-awesome-swiper'
    export default {
        data(){
            return {
                slide:[1,2,3,4,5,6],
                swiperOption:{
                    loop:true,
                    pagination:{
                        el:'.swiper-pagination',
                        clickable:true

                    }
                }
                // swiperOption:{
                //     direction:'vertical',
                //     slidesPerView:'auto',
                //     freeMode:true,
                //     mousewheel:true
                // }
            }
        },
        components:{swiper,swiperSlide}
    }
</script>

<style>
.swiper-slide{
      height: 4rem;
      text-align: center;
      padding-top: 3rem;
      border-bottom: 1px solid #ccc;
  }
  .swiper{
      height: 300px;
      overflow: hidden;
  }
  .text{
      font-size: 18px !important;
      text-align: left;
      padding:30px;
      height: auto;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
   
  }
</style>
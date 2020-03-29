// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import { Button, Row, Col ,Search , Swipe , SwipeItem , Lazyload , List , Field , NavBar, Tab , Tabs , Sidebar, SidebarItem,PullRefresh,Tabbar,TabbarItem,IndexBar, IndexAnchor,Cell, CellGroup,AddressEdit,Image,Tag, Collapse, CollapseItem,AddressList,Popup,Uploader,SwipeCell,SubmitBar,ContactCard,Overlay,Card,Picker,
  Stepper,Rate} from 'vant'
Vue.use(Button).use(Row).use(Col).use(Search).use(Swipe).use(SwipeItem).use(Lazyload,{loading:require('@/assets/loading.gif')}).use(List).use(PullRefresh).use(IndexBar).use(IndexAnchor).use(Cell).use(CellGroup).use(Collapse).use(CollapseItem).use(AddressList).use(Popup).use(Uploader).use(SwipeCell).use(SubmitBar).use(ContactCard).use(Overlay).use(Card).use(Picker)    
.use(Field).use(NavBar).use(Tab).use(Tabs).use(Sidebar).use(SidebarItem).use(Tabbar).use(TabbarItem).use(AddressEdit).use(Image).use(Tag) 
.use(Stepper).use(Rate) 

Vue.config.productionTip = false

Vue.config.devtools = true

// 引入适配方案
//import 'lib-flexible/flexible.js'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})

<template>
  <div id="app">
    <keep-alive include="Main,Goods">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
    window.localSet=function(name,val){
      localStorage[name] = JSON.stringify(val);
    }
    window.localGet=function(name,initVal){
      if(localStorage[name]!=null){
        return JSON.parse(localStorage[name]);
      }else {
        return initVal;
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow-x:hidden;
}
</style>

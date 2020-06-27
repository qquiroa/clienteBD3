<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  beforeCreate(){
    if(sessionStorage.tokenPolicia){
      this.$router.push("/")
    }
    else{
      this.$router.push("/Login")
    }
  }
}
</script>

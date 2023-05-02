<template>
  <div id="app">
    <!-- <header> -->
    <!-- {{ stateSync }} -->
    <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    <!-- </header> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  // Save data on reload
  // computed: {

  //   stateSync() {
     
  //     localStorage.setItem("local", JSON.stringify(stt));
  //     return "";
  //   },
  // },
  created() {
    console.log(this);

    // if (savedstate != null) {
    //   this.$pinia.replaceState(JSON.parse(savedstate));
    // }
  },
};
</script>

<style >
</style>

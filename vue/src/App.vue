<template>
  <div id="app">
    <Menu/>
    <div class="main-view">
      <router-view />
    </div>
  </div>
</template>

<script>

import Menu from './components/Menu';
export default {
  components: {
    Menu
  }
}

</script>

<style>
@import url("./assets/styles.css");
</style>

<template>
  <div id="app">
    <router-link to="/accounts">Account List</router-link> |
    <router-link to="/accounts/create">Create Account</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* Add your styles here */
</style>

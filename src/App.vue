<template>
  <div id="app" class="container">
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <router-link :to="{ name: 'test1' }" class="navbar-brand" exact
        >Test</router-link
      >
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link :to="{ name: 'test1' }" class="nav-link" exact
              >Test1</router-link
            >
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'test2' }" class="nav-link" exact
              >Test2</router-link
            >
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'test3' }" class="nav-link" exact
              >Test3</router-link
            >
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link :to="{ name: 'vue-test' }" class="nav-link" exact
              >Vuejs Test</router-link
            >
          </li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";

export default {
  name: "App",
};
</script>

<style>
.router-link-active {
  font-weight: bold;
}
</style>

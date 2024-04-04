<template>
  <div class="container mt-4">
    <h1>Create Account</h1>
    <form @submit.prevent="createAccount" class="needs-validation" novalidate>
      <div class="form-group">
        <label for="login">Login:</label>
        <input
          type="text"
          id="login"
          v-model="login"
          class="form-control"
          required
        />
        <div class="invalid-feedback">Login is required.</div>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          required
        />
        <div class="invalid-feedback">Password is required.</div>
      </div>
      <button type="submit" class="btn btn-primary my-2">Create</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";
Vue.use(VueToast);

export default {
  data() {
    return {
      login: "",
      password: "",
    };
  },
  methods: {
    createAccount() {
      axios
        .post(`${process.env.VUE_APP_API_URL}/accounts`, {
          login: this.login,
          password: this.password,
        })
        .then(() => {
          Vue.$toast.success("Account created successfully");
        })
        .catch((error) => {
          const errorKeys = Object.keys(error.response.data.error);
          errorKeys.forEach((key) => {
            Vue.$toast.error(error.response.data.error[key][0]);
          });
        });
    },
  },
};
</script>

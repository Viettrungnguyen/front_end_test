<template>
  <div class="container">
    <h1>Update Account</h1>
    <form @submit.prevent="updateAccount" class="needs-validation" novalidate>
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
      <div class="form-group">
        <label for="phone">Phone:</label>
        <input type="text" id="phone" v-model="phone" class="form-control" />
        <div class="invalid-feedback">Phone is required.</div>
      </div>
      <button type="submit" class="btn btn-primary my-2">Update</button>
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
      phone: "",
    };
  },
  mounted() {
    this.fetchAccountDetails();
  },
  methods: {
    fetchAccountDetails() {
      const accountId = this.$route.params.id;
      axios
        .get(`${process.env.VUE_APP_API_URL}/accounts/${accountId}`)
        .then((response) => {
          this.login = response.data.login;
          this.password = response.data.password;
          this.phone = response.data.phone;
        })
        .catch((error) => {
          const errorKeys = Object.keys(error.response.data.error);
          errorKeys.forEach((key) => {
            Vue.$toast.error(error.response.data.error[key][0]);
          });
        });
    },
    updateAccount() {
      const accountId = this.$route.params.id;
      axios
        .post(`${process.env.VUE_APP_API_URL}/accounts/${accountId}`, {
          login: this.login,
          password: this.password,
          phone: this.phone,
        })
        .then(() => {
          Vue.$toast.success("Account updated successfully");
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

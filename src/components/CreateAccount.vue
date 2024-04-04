<template>
  <div>
    <h1>Create Account</h1>
    <form @submit.prevent="createAccount">
      <label>Login:</label>
      <input type="text" v-model="login" required />
      <label>Pasword:</label>
      <input type="password" v-model="password" required />
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      login: "",
      email: "",
    };
  },
  methods: {
    createAccount() {
      axios
        .post(`${process.env.VUE_APP_API_URL}/accounts`, {
          login: this.login,
          password: this.password,
        })
        .then((response) => {
          console.log("Account created successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error creating account:", error);
        });
    },
  },
};
</script>

<template>
  <div>
    <h1>Update Account</h1>
    <form @submit.prevent="updateAccount">
      <label>Name:</label>
      <input type="text" v-model="name" required />
      <label>Email:</label>
      <input type="email" v-model="email" required />
      <button type="submit">Update</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      email: "",
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
          this.name = response.data.name;
          this.email = response.data.email;
        })
        .catch((error) => {
          console.error("Error fetching account details:", error);
        });
    },
    updateAccount() {
      const accountId = this.$route.params.id;
      axios
        .put(`${process.env.VUE_APP_API_URL}/accounts/${accountId}`, {
          name: this.name,
          email: this.email,
        })
        .then((response) => {
          console.log("Account updated successfully:", response.data);
          // Optionally, redirect to account list or perform other actions
        })
        .catch((error) => {
          console.error("Error updating account:", error);
        });
    },
  },
};
</script>

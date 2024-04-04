<template>
  <div>
    <h1>Delete Account</h1>
    <button @click="deleteAccount">Delete</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    deleteAccount() {
      const accountId = this.$route.params.id;
      axios
        .delete(`${process.env.VUE_APP_API_URL}/accounts/${accountId}`)
        .then((response) => {
          console.log("Account deleted successfully:", response.data);
          // Optionally, redirect to account list or perform other actions
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
        });
    },
  },
};
</script>

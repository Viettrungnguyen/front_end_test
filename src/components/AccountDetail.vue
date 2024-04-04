<template>
  <div class="container">
    <h1>Account Detail</h1>
    <div class="card">
      <div class="card-body">
        <p><strong>Name:</strong> {{ account.login }}</p>
        <p><strong>Phone:</strong> {{ account.phone }}</p>
        <router-link
          :to="{ name: 'update-account', params: { id: account.registerID } }"
          class="btn btn-primary"
          >Edit</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      account: {
        login: "",
        registerID: "",
        phone: "",
      },
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
          this.account = response.data;
        })
        .catch((error) => {
          console.error("Error fetching account details:", error);
        });
    },
  },
};
</script>

<style>
.card {
  margin-top: 20px;
}
</style>

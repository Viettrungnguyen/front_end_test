<template>
  <div>
    <h1>Account Detail</h1>
    <p><strong>Name:</strong> {{ account.login }}</p>
    <p><strong>Phone:</strong> {{ account.phone }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      account: {
        login: "",
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

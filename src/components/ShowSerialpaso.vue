<template>
  <div class="container">
    <h1>Show Serial Paso</h1>
    <form @submit.prevent="showSerialPaso">
      <div class="form-group">
        <label for="file">File:</label>
        <input type="text" class="form-control" v-model="file" required />
      </div>
      <div class="form-group">
        <label for="appEnv">Application Environment:</label>
        <select class="form-control" v-model="appEnv" required>
          <option value="0">AWS</option>
          <option value="1">K5</option>
          <option value="2">T2</option>
        </select>
      </div>
      <div class="form-group">
        <label for="contractServer">Contract Server:</label>
        <select class="form-control" v-model="contractServer" required>
          <option value="0">App1</option>
          <option value="1">App2</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary my-2">
        Show Serial Paso
      </button>
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
      file: "",
      appEnv: "0",
      contractServer: "0",
    };
  },
  methods: {
    showSerialPaso() {
      axios
        .post(`${process.env.VUE_APP_API_URL}/showSerialpaso`, {
          file: this.file,
          app_env: this.appEnv,
          contract_server: this.contractServer,
        })
        .then((response) => {
          Vue.$toast.success(response.data.message);
        })
        .catch((error) => {
          Vue.$toast.error(error.response.data.message);
        });
    },
  },
};
</script>

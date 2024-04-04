<template>
  <div class="container">
    <h1>Folder Comparison</h1>
    <div class="row">
      <div class="col-md-6">
        <label for="folder1">Folder 1:</label>
        <input
          type="text"
          id="folder1"
          class="form-control"
          v-model="folder1"
        />
      </div>
      <div class="col-md-6">
        <label for="folder2">Folder 2:</label>
        <input
          type="text"
          id="folder2"
          class="form-control"
          v-model="folder2"
        />
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-md-12">
        <button class="btn btn-primary" @click="compareFolders">Compare</button>
      </div>
    </div>
    <div class="row mt-3" v-if="commonFiles.length > 0">
      <div class="col-md-12">
        <h2>Common Files:</h2>
        <ul>
          <li v-for="file in commonFiles" :key="file">{{ file }}</li>
        </ul>
      </div>
    </div>
    <div class="row mt-3" v-else>
      <div class="col-md-12">
        <p>No common files found.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      folder1: "",
      folder2: "",
      commonFiles: [],
    };
  },
  methods: {
    compareFolders() {
      axios
        .post(`${process.env.VUE_APP_API_URL}/compare-folders`, {
          folder1: this.folder1,
          folder2: this.folder2,
        })
        .then((response) => {
          this.commonFiles = response.data.common_files;
        })
        .catch((error) => {
          console.error("Error comparing folders:", error);
        });
    },
  },
};
</script>

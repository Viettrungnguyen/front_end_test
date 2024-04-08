<template>
  <div class="col-md-3">
    <div class="sidebar">
      <div class="my-4">
        <div class="d-flex justify-content-between my-3">
          <span class="text-secondary">Storage</span>
          <a class="text-secondary" href="javascript:void(0)">Change plan</a>
        </div>
        <div class="progress">
          <div
            class="progress-bar"
            role="progressbar"
            :aria-valuenow="progressPercentage"
            aria-valuemin="0"
            aria-valuemax="100"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <p>
          <span class="text-primary fw-bold mx-1">{{
            Math.round(progressPercentage) + "%"
          }}</span>
          <span>used of 2GB</span>
        </p>
      </div>
      <hr />
      <div class="my-4">
        <p class="text-secondary">Search</p>
        <input
          type="text"
          @input="emitSearchTerm"
          v-model="searchTerm"
          class="form-control mb-4"
          placeholder="e.g. image.png"
        />
      </div>
      <hr />
      <div>
        <div class="d-flex justify-content-between my-3">
          <span class="text-secondary">Folder</span>
          <a
            class="text-secondary"
            @click="addNewFolder"
            >New folder</a
          >
        </div>
        <div v-for="option in options" :key="option.id">
          <div
            @click="selectOption(option)"
            class="option fw-bold mb-2"
            :class="{ 'active-div-option': option === selectedOption }"
          >
            <i
              v-if="option === selectedOption"
              class="bi bi-caret-up-fill me-2"
            ></i>
            <i v-else class="bi bi-caret-right-fill me-2"></i>
            <span
              ><i class="bi bi-folder-fill"></i
              ><span class="mx-2">{{ option.name }}</span></span
            >
            <span class="option-count">{{ option.children.length }}</span>
          </div>
          <div v-if="selectedOption && selectedOption.id === option.id">
            <ul class="list-group">
              <li
                v-for="child in option.children"
                :key="child.id"
                class="list-group-item"
                :class="{ 'active-option': child === selectedItem }"
                @click="showDetails(child)"
              >
                <button
                  @click="showDetails(child)"
                  class="btn btn-light btn-block d-flex w-100 justify-content-between"
                >
                  <span
                    ><i class="bi bi-caret-right-fill me-2"></i
                    ><i class="bi bi-folder-fill"></i
                    ><span class="mx-2">{{ child.name }}</span></span
                  >
                  <span class="option-count">{{ child.children.length }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr />
      <div class="d-flex justify-content-between my-3">
        <span class="text-secondary">Members</span>
        <div>
          <a
            class="text-secondary"
            @click="selectAllPhotosByChanged"
            >Select all</a
          >
        </div>
      </div>
      <div>
        <div v-for="photoBy in uniquePhotoBy" :key="photoBy">
          <label>
            <input
              type="checkbox"
              v-model="selectedPhotoBy"
              @change="selectPhotosByChanged"
              :value="photoBy"
            />
            {{ photoBy }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: Array,
    uniquePhotoBy: Array,
  },
  data() {
    return {
      selectedItem: null,
      isModalOpen: false,
      selectedOption: null,
      modalImageUrl: "",
      selectedImages: [],
      sortByColumn: null,
      sortDirection: "asc",
      storageLimitGB: 2,
      searchTerm: "",
      selectedPhotoBy: [],
      hoveredImageId: null,
    };
  },
  mounted() {
    this.selectAllPhotosByChanged();
    if (this.options.length > 0) {
      this.selectOption(this.options[0]);
    }
  },
  computed: {
    totalSize() {
      let total = 0;
      this.options.forEach((option) => {
        option.children.forEach((child) => {
          child.children.forEach((element) => {
            const size = parseInt(element.size);
            total += size;
          });
        });
      });
      return total;
    },
    progressPercentage() {
      const totalBytes = 2 * 1024 * 1024 * 1024;
      return (this.totalSize / totalBytes) * 100;
    },
  },
  methods: {
    generateUniqueId() {
      return Math.floor(Math.random() * 1000000);
    },
    addNewFolder() {
      const folderName = prompt("Enter the name of the new folder:");
      const folderDimension = prompt("Enter the dimension of the new folder:");

      if (folderName && folderDimension) {
        const newFolderId = this.generateUniqueId();

        const newFolder = {
          id: newFolderId,
          name: folderName,
          children: [],
        };
        this.$emit("newFolderAdded", newFolder);
      } else {
        alert("Please provide both name and dimension for the new folder.");
      }
    },
    emitSearchTerm() {
      this.$emit("searchTermChanged", this.searchTerm);
    },
    selectOption(option) {
      this.selectedOption = option;
      this.selectedImages = [];
      this.$emit("selectedAllChanged", false);
      const mergedChildren = option.children.reduce((accumulator, child) => {
        return accumulator.concat(child.children);
      }, []);
      this.$emit("selectedItemChanged", { children: mergedChildren });
      this.$emit("selectedImagesChanged", (this.selectedImages = []));
    },
    showDetails(item) {
      this.$emit("selectedAllChanged", false);
      this.$emit("selectedItemChanged", (this.selectedItem = item));
      this.$emit("selectedImagesChanged", (this.selectedImages = []));
    },

    selectAllPhotosByChanged() {
      if (this.selectedPhotoBy.length === this.uniquePhotoBy.length) {
        this.selectedPhotoBy = [];
      } else {
        this.selectedPhotoBy = [...this.uniquePhotoBy];
      }
      this.$emit("selectedAllPhotoByChanged", this.selectedPhotoBy);
    },

    selectPhotosByChanged() {
      this.$emit("selectedPhotoByChanged", this.selectedPhotoBy);
    },
  },
};
</script>

<style scoped>
.option {
  width: 100%;
  background: white;
  border: none;
  color: black;
  text-align: left;
}

.option-count {
  padding: 0px 5px;
  border: 1px solid #bdbcbc;
  background: #bdbcbc;
  border-radius: 5px;
  font-size: 14px;
}

.list-group li {
  border: none;
  padding: 2px 0 2px 22px;
}

.active-option button,
.active-option i,
.active-option button:hover {
  color: #5356ff;
  background: #dff5ff;
}

.active-option button .option-count {
  background: #5356ff;
  color: white;
  border-color: #5356ff;
}
i {
  color: #6c757d;
}

.active-div-option i {
  color: #000;
}
</style>

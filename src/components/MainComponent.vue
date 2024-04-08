<template>
  <div class="container">
    <div class="row">
      <Sidebar
        :options="options"
        :uniquePhotoBy="uniquePhotoBy"
        :selectAll="selectAll"
        @searchTermChanged="updateSearchTerm"
        @selectedItemChanged="updateSelectedItem"
        @selectedImagesChanged="updateSelectedImages"
        @selectedPhotoByChanged="updateSelectedPhotoByChanged"
        @selectedAllChanged="updateSelectAll"
        @selectedAllPhotoByChanged="updateSelectedPhotoByChanged"
        @newFolderAdded="handleNewFolderAdded"
      />
      <Content
        :selectedItem="selectedItem"
        :filteredOptions="filteredOptions"
        :selectAll="selectAll"
        :hoveredImageId="hoveredImageId"
        @mouse-over-image="handleMouseOverImage"
        @modalImageUrlChanged="updateModalImageUrlChanged"
        @modalOpenChanged="updateModalOpenChanged"
        @mouse-leave-image="handleMouseLeaveImage"
        @selectAllChanged="updateSelectAll"
      />
      <Modal
        :isModalOpen="isModalOpen"
        @closeModal="isModalOpen = false"
        :modalImageUrl="modalImageUrl"
      />
    </div>
  </div>
</template>

<script>
import { options } from "@/constants/options";
import Sidebar from "@/components/SidebarComponent.vue";
import Content from "@/components/TableComponent.vue";
import Modal from "@/components/ModalComponent.vue";

export default {
  components: {
    Sidebar,
    Content,
    Modal,
  },
  data() {
    return {
      options: options,
      selectedOption: null,
      hoveredImageId: null,
      selectedItem: null,
      isModalOpen: false,
      modalImageUrl: "",
      selectAll: false,
      selectedImages: [],
      sortByColumn: null,
      sortDirection: "asc",
      storageLimitGB: 2,
      searchTerm: "",
      selectedPhotoBy: [],
    };
  },
  computed: {
    sortedItems() {
      if (!this.selectedItem || !this.selectedItem.children) {
        return [];
      }

      if (!this.sortByColumn) {
        return this.selectedItem.children;
      }

      return this.selectedItem.children.slice().sort((a, b) => {
        let modifier = 1;
        if (this.sortDirection === "desc") modifier = -1;
        if (a[this.sortByColumn] < b[this.sortByColumn]) return -1 * modifier;
        if (a[this.sortByColumn] > b[this.sortByColumn]) return 1 * modifier;
        return 0;
      });
    },
    filteredOptions() {
      let filteredItems = this.sortedItems;
      const searchTerm = this.searchTerm.toLowerCase().trim();

      if (
        !(
          this.selectedPhotoBy.includes("All") ||
          this.selectedPhotoBy.length === 0
        )
      ) {
        filteredItems = filteredItems.filter(
          (option) =>
            this.optionContainsTerm(option, searchTerm) &&
            this.selectedPhotoBy.includes(option.photo_by)
        );
      }
      return filteredItems.filter((option) =>
        this.optionContainsTerm(option, searchTerm)
      );
    },
    uniquePhotoBy() {
      const photoBySet = new Set();
      photoBySet.add("All");
      this.options.forEach((option) => {
        option.children.forEach((child) => {
          child.children.forEach((item) => {
            photoBySet.add(item.photo_by);
          });
        });
      });
      return Array.from(photoBySet);
    },
  },
  methods: {
    updateSearchTerm(searchTerm) {
      this.searchTerm = searchTerm;
    },
    updateSelectedItem(selectedItem) {
      this.selectedItem = selectedItem;
    },
    updateSelectedImages(selectedImages) {
      this.selectedImages = selectedImages;
    },
    updateSelectedPhotoByChanged(selectedPhotoBy) {
      this.selectedPhotoBy = selectedPhotoBy;
    },
    updateModalImageUrlChanged(modalImageUrl) {
      this.modalImageUrl = modalImageUrl;
    },
    updateModalOpenChanged(isModalOpen) {
      this.isModalOpen = isModalOpen;
    },
    handleMouseOverImage(imageId) {
      this.hoveredImageId = imageId;
    },
    updateSelectAll(selectAll) {
      this.selectAll = selectAll;
    },
    handleMouseLeaveImage() {
      this.hoveredImageId = null;
    },
    optionContainsTerm(option, term) {
      return option.name.toLowerCase().includes(term);
    },
    handleNewFolderAdded(newFolderData) {
      console.log(newFolderData);
      this.options.push(newFolderData);
    },
  },
};
</script>

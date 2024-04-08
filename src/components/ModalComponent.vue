<template>
  <div class="modal" :class="{ 'is-active': isModalOpen }" @click="closeModal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <button
        class="modal-close"
        aria-label="close"
        @click="closeModal"
      ></button>
      <img
        :src="modalImageUrl"
        alt="Full Image"
        style="max-width: 100%; max-height: 80vh; object-fit: scale-down"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isModalOpen: Boolean,
    modalImageUrl: String,
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style scoped>
.modal {
  display: none;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.modal.is-active {
  display: flex;
}

.modal-content {
  max-width: 1000px;
  max-height: 80vh;
  position: relative;
}

.modal-close {
  position: absolute;
  top: -7px;
  right: -32px;
  width: 30px;
  height: 30px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.modal-close:before {
  content: "x";
  font-size: 20px;
  color: #fff;
}
.image-container {
  position: relative;
  display: inline-block;
}

.image {
  max-width: 200px;
  cursor: pointer;
  border-radius: 10px;
}

.enlarge-text {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 10px;
  align-content: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  background-color: rgba(14, 64, 87, 0.5);
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.enlarge-text i {
  color: white;
}

.content-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 10px;
  background-color: rgba(36, 166, 226, 0.5);
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 14px;
  transition: opacity 0.3s ease;
}

.image-container:hover .enlarge-text {
  opacity: 1;
}
</style>

<template>
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
        </div>

        <div class="modal-body">
          <p>{{ message }}</p>
        </div>

        <div class="modal-footer">
          <button class="btn btn-primary" @click="$emit('confirm')">
            {{ confirmText }}
          </button>
        </div>

      </div>
    </div>
  </div>

  <div class="modal-backdrop fade show"></div>
</template>

<script setup>
  defineProps({
    title: String,
    message: String,
    confirmText: String,
  })

  defineEmits(['confirm'])
</script>
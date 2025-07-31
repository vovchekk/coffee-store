<script setup>
defineProps({
  title: String,
  description: String,
  imageUrl: String,
});
</script>

<template>
  <div class="flex flex-col items-center text-center w-72">
    <img height="150" width="150" :src="imageUrl" alt="Info image" />
    <h2 class="mt-2 text-2xl font-medium">{{ title }}</h2>
    <p class="text-gray-500 mt-1">{{ description }}</p>
  </div>
</template>

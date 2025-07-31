<script setup>
import { Heart } from "lucide-vue-next";
import { ShoppingCart } from "lucide-vue-next";
const emit = defineEmits(["openDrawer"]);
defineProps({
  totalPrice: Number,
});
</script>

<template>
  <div class="flex justify-center">
    <div
      class="flex w-7/9 items-center bg-stone-900 rounded-b-2xl justify-between"
    >
      <div class="pl-15">
        <router-link to="/">
          <div class="flex items-center gap-2">
            <img src="/logo.png" alt="logo" class="w-8" />
            <h1 class="text-gray-100 text-2xl font-bold">Jardin Coffee</h1>
          </div>
        </router-link>
      </div>
      <ul class="flex items-center text-white mx-10 h-16 gap-10">
        <li
          @click="emit('openDrawer')"
          class="flex items-center gap-2 hover:text-gray-200 cursor-pointer"
        >
          <ShoppingCart class="text-gray-500" />
          <p>{{ totalPrice }} руб.</p>
        </li>
        <router-link to="/favorites">
          <li
            class="flex items-center gap-2 hover:text-gray-200 cursor-pointer"
          >
            <Heart class="text-gray-500" />
            <p>Закладки</p>
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

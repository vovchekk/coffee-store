<script setup>
import { provide, ref, computed, watch } from "vue";
import axios from "axios";

import Header from "./components/Header.vue";
import Drawer from "./components/Drawer.vue";

const cart = ref([]);

const drawerOpen = ref(false);

const totalPrice = computed(() =>
  cart.value.reduce((acc, item) => acc + item.price * (item.count || 1), 0)
);

const closeDrawer = () => {
  drawerOpen.value = false;
};

const openDrawer = () => {
  drawerOpen.value = true;
};

const onClickAddButton = (item, selectedWeight) => {
  const exists = cart.value.some(
    (cartItem) => cartItem.id === item.id && cartItem.weight === selectedWeight
  );

  if (!exists) {
    addToCart(item, selectedWeight);
  } else {
    removeFromCart(item, selectedWeight);
  }
};
const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        parentId: item.id,
        item,
      };
      item.isFavorite = true;
      const { data } = await axios.post(
        `https://68889b83adf0e59551ba9db8.mockapi.io/favorites`,
        obj
      );
      item.favoriteId = data.id;
    } else {
      item.isFavorite = false;
      await axios.delete(
        `https://68889b83adf0e59551ba9db8.mockapi.io/favorites/${item.favoriteId}`
      );
      item.favoriteId = null;
    }
  } catch (err) {
    console.log(err);
  }
};

const addToCart = (item, selectedWeight) => {
  const price = item.prices[selectedWeight];
  const existing = cart.value.find(
    (c) => c.id === item.id && c.weight === selectedWeight
  );
  if (existing) {
    existing.count++;
  } else {
    cart.value.push({
      ...item,
      weight: selectedWeight,
      price,
      count: 1,
    });
  }
};
const removeFromCart = (item, selectedWeight) => {
  cart.value = cart.value.filter(
    (i) => !(i.id === item.id && i.weight === selectedWeight)
  );
};

function formatWeight(weight) {
  const w = Number(weight);
  if (w >= 1000) {
    const kg = w / 1000;
    return Number.isInteger(kg) ? `${kg} кг` : `${kg.toFixed(1)} кг`;
  }
  return `${w} г`;
}

watch(
  cart,
  () => {
    localStorage.setItem("cart", JSON.stringify(cart.value));
  },
  { deep: true }
);

provide("cart", {
  cart,
  formatWeight,
  addToCart,
  removeFromCart,
  onClickAddButton,
  addToFavorite,
});
</script>

<template>
  <Drawer
    v-if="drawerOpen"
    @close-drawer="closeDrawer"
    :total-price="totalPrice"
  />
  <Header :total-price="totalPrice" @open-drawer="openDrawer" />
  <div class="bg-white w-7/9 m-auto rounded-xl shadow-xl my-10 p-5">
    <router-view></router-view>
  </div>
</template>

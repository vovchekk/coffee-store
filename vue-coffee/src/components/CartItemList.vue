<script setup>
import CartItem from "./CartItem.vue";
import { inject } from "vue";

const { cart, removeFromCart } = inject("cart");
</script>

<template>
  <div class="flex flex-col gap-3 p-2 py-3" v-auto-animate>
    <CartItem
      v-for="item in cart"
      :key="item.id + '-' + item.weight"
      :title="item.title"
      :price="item.price"
      :weight="item.weight"
      :imageUrl="item.imageUrl"
      :count="item.count"
      @on-click-remove="() => removeFromCart(item, item.weight)"
      @updateCount="
        (val) => {
          item.count = val;
        }
      "
    />
  </div>
</template>

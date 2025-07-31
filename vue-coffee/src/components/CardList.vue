<script setup>
import Card from "./Card.vue";

const props = defineProps({
  items: Array,
});

const emit = defineEmits(["add-to-cart", "add-to-favorite"]);
</script>

<template>
  <div class="grid grid-cols-4 gap-4" v-auto-animate>
    <Card
      v-for="item in items"
      :key="item.id"
      v-bind="item"
      :onClickAdd="
        (selectedWeight) => emit('add-to-cart', item, selectedWeight)
      "
      :onClickFavorite="() => emit('add-to-favorite', item)"
    />
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, inject } from "vue";
import CardList from "../components/CardList.vue";
import InfoBlock from "../components/InfoBlock.vue";

const { onClickAddButton, addToFavorite } = inject("cart");

const favorites = ref([]);

onMounted(async () => {
  try {
    const { data } = await axios.get(
      "https://68889b83adf0e59551ba9db8.mockapi.io/favorites"
    );
    favorites.value = data.map((obj) => ({
      ...obj.item,
      favoriteId: obj.id,
    }));
  } catch (err) {
    console.log(err);
  }
});
</script>

<template>
  <h1 class="flex justify-center text-xl mt-2 mb-4">Закладки</h1>

  <div v-if="favorites.length === 0" class="flex justify-center mt-10">
    <InfoBlock
      title="Здесь ничего нет"
      description="Добавьте хотя бы одну карточку в избранное"
      imageUrl="/emoji-1.png"
    />
  </div>

  <CardList
    :items="favorites"
    @add-to-favorite="addToFavorite"
    @add-to-cart="onClickAddButton"
  />
</template>

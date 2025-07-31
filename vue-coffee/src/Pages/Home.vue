<script setup>
import { inject, reactive, ref, onMounted, computed, watch } from "vue";
import { Search } from "lucide-vue-next";
import CardList from "../components/CardList.vue";
import axios from "axios";
import debounce from "lodash.debounce";

const { cart, addToCart, removeFromCart, addToFavorite } = inject("cart");

const items = ref([]);

const filters = reactive({
  sortBy: "title",
  searchQuery: "",
  types: [],
});

const debouncedQuery = ref("");

const updateDebouncedQuery = debounce((val) => {
  debouncedQuery.value = val;
}, 400);

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
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

const filteredItems = computed(() => {
  let result = [...items.value];

  if (debouncedQuery.value.trim()) {
    const query = debouncedQuery.value.toLowerCase();
    result = result.filter((item) => item.title?.toLowerCase().includes(query));
  }

  if (filters.types.length > 0) {
    const keywords = filters.types.map((k) => k.toLowerCase());
    result = result.filter((item) => {
      const titleLower = item.title?.toLowerCase() || "";
      return keywords.some((keyword) => titleLower.includes(keyword));
    });
  }

  result.sort((a, b) => {
    if (filters.sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    const maxWeightA = Math.max(...Object.keys(a.prices).map(Number));
    const maxWeightB = Math.max(...Object.keys(b.prices).map(Number));
    const priceA = a.prices[maxWeightA];
    const priceB = b.prices[maxWeightB];

    if (filters.sortBy === "maxPriceAsc") return priceA - priceB;
    if (filters.sortBy === "maxPriceDesc") return priceB - priceA;

    return 0;
  });

  return result;
});

const fetchItems = async () => {
  try {
    const { data } = await axios.get(
      "https://68889b83adf0e59551ba9db8.mockapi.io/items"
    );
    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      isAdded: false,
    }));
  } catch (err) {
    console.log("Ошибка при загрузке items:", err);
  }
};

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(
      "https://68889b83adf0e59551ba9db8.mockapi.io/favorites"
    );

    items.value = items.value.map((item) => {
      const favorite = favorites.find(
        (favorite) => favorite.parentId === item.id
      );
      if (!favorite) {
        return item;
      } else {
        return {
          ...item,
          isFavorite: true,
          favoriteId: favorite.id,
        };
      }
    });
  } catch (err) {
    console.log(err);
  }
};

watch(
  () => filters.searchQuery,
  (newVal) => {
    updateDebouncedQuery(newVal);
  }
);

onMounted(async () => {
  const localCart = localStorage.getItem("cart");
  cart.value = localCart ? JSON.parse(localCart) : [];
  await fetchItems();
  await fetchFavorites();
});
</script>

<template>
  <div class="mb-4">
    <div class="flex flex-wrap gap-4 justify-end items-center">
      <ul class="flex flex-wrap gap-4 items-center">
        <li class="flex items-center">
          <input
            type="checkbox"
            value="в зёрнах"
            v-model="filters.types"
            class="w-4 h-4 mr-2 cursor-pointer"
          />
          <span class="text-sm">В зёрнах</span>
        </li>
        <li class="flex items-center">
          <input
            type="checkbox"
            value="молотый"
            v-model="filters.types"
            class="w-4 h-4 mr-2 cursor-pointer"
          />
          <span class="text-sm">Молотый</span>
        </li>
        <li class="flex items-center">
          <input
            type="checkbox"
            value="растворимый"
            v-model="filters.types"
            class="w-4 h-4 mr-2 cursor-pointer"
          />
          <span class="text-sm">Растворимый</span>
        </li>
      </ul>

      <div class="flex flex-wrap gap-4 items-center">
        <select
          @change="onChangeSelect"
          class="border rounded-md border-stone-200 py-2 pr-4 pl-2 outline-none"
        >
          <option value="title">По названию</option>
          <option value="maxPriceAsc">По возрастанию цены</option>
          <option value="maxPriceDesc">По убыванию цены</option>
        </select>

        <div class="relative w-full sm:w-auto">
          <Search class="top-2 left-3 absolute text-slate-500" />
          <input
            v-model="filters.searchQuery"
            type="text"
            placeholder="Поиск"
            class="border rounded-md border-stone-200 py-2 pr-4 pl-11 outline-none w-full sm:w-64"
          />
        </div>
      </div>
    </div>
  </div>

  <div>
    <CardList
      :items="filteredItems"
      @add-to-favorite="addToFavorite"
      @add-to-cart="onClickAddButton"
    />
  </div>
</template>

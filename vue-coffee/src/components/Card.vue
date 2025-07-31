<script setup>
import { ref, inject, computed } from "vue";
import { Heart } from "lucide-vue-next";

const props = defineProps({
  id: Number,
  title: String,
  prices: Object,
  imageUrl: String,
  isFavorite: Boolean,
  onClickFavorite: Function,
  onClickAdd: Function,
});

const selectedWeight = ref(
  Object.keys(props.prices || {})
    .map(Number)
    .sort((a, b) => b - a)[0]
    .toString() || ""
);

const { cart, formatWeight } = inject("cart") ?? {
  cart: ref([]),
  formatWeight: (w) => `${w} г`,
};

const isInCart = computed(() =>
  cart.value.some(
    (item) => item.id === props.id && item.weight === selectedWeight.value
  )
);
</script>

<template>
  <div
    class="relative border rounded-xl p-4 border-slate-200 transition hover:shadow-xl hover:translate-y-1 overflow-hidden min-h-[360px] flex flex-col justify-between"
  >
    <Heart
      @click="onClickFavorite"
      :class="[
        'absolute right-5 top-5 w-8 h-8 cursor-pointer',
        isFavorite
          ? 'text-red-400 hover:text-red-300'
          : 'text-slate-900 hover:text-red-200',
      ]"
    />
    <img
      class="rounded-2xl w-full aspect-[3/4] object-cover"
      :src="imageUrl"
      alt="card"
    />

    <div class="text-[18px] flex gap-2 mt-2">
      <span class="text-green-400 font-bold">
        {{ prices[selectedWeight] }} руб.
      </span>
      /
      <select
        v-model="selectedWeight"
        class="border-b border-slate-300 outline-none bg-transparent cursor-pointer w-[70px] focus:border-b-black"
      >
        <option v-for="(price, weight) in prices" :key="weight" :value="weight">
          {{ formatWeight(weight) }}
        </option>
      </select>
    </div>

    <div class="flex flex-col h-full justify-between mt-2">
      <div>
        <h1 class="mb-3">{{ title }}</h1>
      </div>

      <div>
        <button
          v-if="!isInCart"
          @click="() => onClickAdd(selectedWeight)"
          class="w-full border rounded-xl py-3 mt-2 bg-stone-900 text-white cursor-pointer hover:border-stone-800 hover:bg-white hover:text-stone-900 transition"
        >
          Добавить в корзину
        </button>

        <button
          v-else
          @click="() => onClickAdd(selectedWeight)"
          class="w-full border rounded-xl py-3 mt-2 bg-white text-stone-900 cursor-pointer hover:border-stone-800 hover:bg-stone-900 hover:text-white transition"
        >
          Удалить из корзины
        </button>
      </div>
    </div>
  </div>
</template>

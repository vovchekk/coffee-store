<script setup>
import { inject, computed, ref } from "vue";
import { SquareX } from "lucide-vue-next";

const emit = defineEmits(["onClickRemove", "updateCount"]);

const props = defineProps({
  id: Number,
  title: String,
  price: Number,
  weight: String,
  imageUrl: String,
  count: Number,
});

const { formatWeight } = inject("cart") || { formatWeight: (w) => `${w} г` };

const titleAndWeight = computed(
  () => `${props.title}, ${formatWeight(props.weight)}`
);

const totalPrice = computed(() => props.price * props.count);

function onInputChange(event) {
  let val = parseInt(event.target.value);

  if (isNaN(val) || val < 1) {
    val = 1;
  } else if (val > 45) {
    val = 45;
  }

  event.target.value = val;
  emit("updateCount", val);
}
</script>

<template>
  <div
    class="relative flex border rounded-xl border-slate-200 p-2 hover:shadow-xl transition"
  >
    <SquareX
      @click="emit('onClickRemove')"
      class="absolute top-2 right-2 w-6 h-6 cursor-pointer text-red-400 hover:text-red-600"
    />
    <img :src="props.imageUrl" alt="card" class="h-23 mr-2 rounded-xl pt-2" />
    <div class="flex flex-col justify-between py-2 flex-1">
      <p class="mr-10">{{ titleAndWeight }}</p>

      <div class="flex justify-between mt-2">
        <div>
          <input
            type="number"
            min="1"
            max="45"
            class="w-12 text-center outline-none border rounded-md border-slate-200 mr-2"
            :value="props.count"
            @input="onInputChange"
          />
          <span>кол-во</span>
        </div>
        <p class="font-bold">{{ totalPrice }} руб.</p>
      </div>
    </div>
  </div>
</template>

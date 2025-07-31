<script setup>
import { ref, inject, computed, onMounted, onUnmounted } from "vue";
import { X } from "lucide-vue-next";
import CartItemList from "./CartItemList.vue";
import InfoBlock from "./InfoBlock.vue";
import axios from "axios";

const emit = defineEmits(["closeDrawer"]);

const props = defineProps({
  totalPrice: Number,
});

const { cart } = inject("cart");

const deliveryMethod = ref("");
const fullName = ref("");
const phone = ref("");
const address = ref("");

const isCreating = ref(false);
const orderId = ref(null);
const createOrder = async () => {
  try {
    isCreating.value = true;

    const { data } = await axios.post(
      "https://688aa3532a52cabb9f4eacd1.mockapi.io/orders",
      {
        items: cart.value,
        totalPrice: props.totalPrice,
        deliveryMethod: deliveryMethod.value,
        fullName: fullName.value,
        phone: phone.value,
        address: address.value,
      }
    );

    cart.value = [];
    orderId.value = data.id;
  } catch (err) {
    console.log(err);
  } finally {
    isCreating.value = false;
  }
};

const onPhoneInput = (e) => {
  phone.value = e.target.value.replace(/\D/g, "");
};

const isFormValid = computed(() => {
  const phoneDigitsOnly = /^\d+$/;
  return (
    deliveryMethod.value &&
    fullName.value.trim() &&
    phone.value.trim() &&
    address.value.trim()
  );
});

onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

const cartIsEmpty = computed(() => cart.value.length === 0);
const buttonDisabled = computed(
  () => isCreating.value || cartIsEmpty.value || !isFormValid.value
);
</script>

<template>
  <div class="fixed inset-0 bg-opacity-7 bg-black/70 z-10"></div>

  <div
    class="absolute z-20 bg-white m-auto inset-0 rounded-2xl p-5 w-[90%] max-w-4xl h-[90%] max-h-[600px] flex flex-col min-h-0"
  >
    <X
      @click="emit('closeDrawer')"
      class="absolute text-gray-500 top-5 right-4 w-8 h-8 cursor-pointer hover:text-gray-900"
    />

    <h1 class="text-2xl font-bold text-center mb-4">Корзина</h1>

    <div
      class="grid grid-cols-1 md:grid-cols-2 mt-5 w-full h-full divide-y md:divide-y-0 md:divide-x divide-gray-300 flex-1 min-h-0"
    >
      <div class="flex flex-col w-full h-full pb-4 pr-4 md:pb-0 min-h-0">
        <p class="font-bold mb-3 text-center">Товары</p>

        <div class="flex-1 overflow-auto min-h-0">
          <div
            v-if="!totalPrice || orderId"
            class="flex h-full items-center justify-center"
          >
            <InfoBlock
              v-if="!totalPrice && !orderId"
              title="Корзина пустая"
              description="Добавьте хотя бы один товар для оформления заказа."
              imageUrl="/empty-box.png"
            />
            <InfoBlock
              v-if="orderId"
              title="Заказ оформлен!"
              :description="`Ваш заказ #${orderId} успешно оформлен. Менеджер свяжется с вами в ближайшее время.`"
              imageUrl="/order-success.png"
            />
          </div>
          <div v-else>
            <CartItemList />
          </div>
        </div>

        <div v-if="totalPrice > 0" class="flex gap-2 pt-3 mt-3">
          <span>Итого:</span>
          <div class="flex-1 border-b border-dashed border-b-slate-200"></div>
          <b>{{ totalPrice }} руб.</b>
        </div>
      </div>

      <div class="md:pl-5 flex flex-col gap-2 pt-4 md:pt-0">
        <p class="flex justify-center font-bold mb-3">Оформление заказа</p>

        <label>
          <p>Способ доставки:</p>
          <select
            v-model="deliveryMethod"
            class="border rounded-md border-stone-200 py-2 pr-4 pl-2 outline-none w-full"
          >
            <option disabled value="">Выберите способ доставки</option>
            <option>Курьерская доставка по городу</option>
            <option>СДЭК доставка по России</option>
          </select>
        </label>

        <label>
          <p>ФИО:</p>
          <input
            v-model="fullName"
            type="text"
            placeholder="Иванов Иван Иванович"
            class="border rounded-md border-stone-200 py-2 pr-4 pl-2 outline-none w-full"
          />
        </label>

        <label>
          <p>Телефон:</p>
          <input
            v-model="phone"
            type="text"
            placeholder="+7 (999) 123-45-67"
            @input="onPhoneInput"
            class="border rounded-md border-stone-200 py-2 pr-4 pl-2 outline-none w-full"
          />
        </label>

        <label>
          <p>Адрес доставки:</p>
          <input
            v-model="address"
            type="text"
            placeholder="г. Чебоксары, ул. 500-летия, д. 14, кв. 1"
            class="border rounded-md border-stone-200 py-2 pr-4 pl-2 outline-none w-full"
          />
        </label>
      </div>
    </div>

    <div class="w-full mt-4">
      <button
        :disabled="buttonDisabled"
        @click="createOrder"
        class="bg-green-600 text-white rounded-xl p-3 w-full cursor-pointer hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-default"
      >
        Оформить заказ
      </button>
    </div>
  </div>
</template>

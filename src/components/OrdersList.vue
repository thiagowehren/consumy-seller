<script setup lang="ts">
import { ref } from 'vue';
import { OrderResponse } from '@/dtos/orderDTO';
import { updateOrderState } from '@/api/orderAPI';
import OrderModal from '@/components/OrderModal.vue';

const props = defineProps<{
  orders: OrderResponse[];
}>();

const mutableOrders = ref<OrderResponse[]>([...props.orders]);
const selectedOrder = ref<OrderResponse | null>(null);

const openModal = (order: OrderResponse) => {
  selectedOrder.value = order;
};

const closeModal = () => {
  selectedOrder.value = null;
};
</script>

<template>
  <div>
    <ul>
      <li v-for="order in mutableOrders" :key="order.id" class="order-item" :class="`order-${order.state}`">
        <div class="order-header">
          <router-link :to="`/orders/${order.id}`" class="order-id">ID #{{ order.id }}</router-link>
          <p class="order-date">Criado em {{ order.created_at }}</p>
        </div>
        <div class="order-details" @click="openModal(order)">
          <p>Estado: {{ order.state }}</p>
          <p><strong>Total: {{ order.total_price }}</strong></p>
        </div>
      </li>
    </ul>

    <OrderModal v-if="selectedOrder" :order="selectedOrder" @close="closeModal" />
  </div>
</template>

<style scoped>
.order-item {
  cursor: pointer;
}
</style>

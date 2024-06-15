<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { getOrder, updateOrderState } from '@/api/orderAPI';
import { OrderResponse } from '@/dtos/orderDTO';
import defaultProductImage from '@/assets/dish-default-256.png';
import LinkPathNav from '@/components/LinkPathNav.vue';

const props = defineProps<{ orderId?: string }>();
const route = useRoute();
const orderId = props.orderId || route.params.orderId as string;
const order = ref<OrderResponse | null>(null);

const fetchOrder = async () => {
  try {
    const response = await getOrder(orderId);
    order.value = response.order;
  } catch (error) {
    // console.error('Failed to fetch order details', error);
  }
};

watchEffect(() => {
  fetchOrder();
});

const handleUpdateOrderState = async (orderId: string, state: string) => {
  try {
    const updatedOrder = await updateOrderState(orderId, state);
    order.value = updatedOrder;
  } catch (error) {
    // console.error(`Failed to update order state to ${state}`, error);
  }
};

const isStateActive = (state: string) => {
  return order.value && order.value.possible_states.includes(state);
};

// currency: R$
const calculateOriginalPrice = (item: OrderItem): string => {
  const originalPrice = parseFloat(item.total_price.replace('R$ ', '').replace(',', '.')) / item.amount;
  return `R$ ${originalPrice.toFixed(2).replace('.', ',')}`;
};
</script>

<template>
  <div v-if="order" class="order-details">
    <div><LinkPathNav :route="`orders/${orderId}`" :clickableSegments="[0, 1]" /></div>

    <h2>Detalhes do Pedido</h2>
    <p><strong>ID:</strong> #{{ order.id }}</p>
    <p><strong>Total:</strong> {{ order.total_price }}</p>
    <p><strong>Estado:</strong> {{ order.state }}</p>
    <p><strong>Criado em:</strong> {{ order.created_at }}</p>
    <h3>Itens do Pedido</h3>
    <ul>
      <li v-for="item in order.order_items" :key="item.product.id" class="order-item">
        <img :src="item.product.image_url ? item.product.image_url : defaultProductImage" :alt="'Imagem da loja'" class="product-image" />
        <p><strong>Título:</strong> {{ item.product.title }}</p>
        <p><strong>Preço:</strong> {{ calculateOriginalPrice(item) }}</p>
        <p><strong>Quantidade:</strong> {{ item.amount }}</p>
        <p><strong>Preço Total:</strong> {{ item.total_price }}</p>
      </li>
    </ul>

    <div class="order-action">
      <button 
        v-for="state in ['accept', 'dispatch', 'complete', 'cancel']" 
        :key="state" 
        :class="{ active: isStateActive(state), inactive: !isStateActive(state) }"
        @click.prevent="isStateActive(state) && handleUpdateOrderState(order.id, state)"
      >
        <template v-if="state === 'accept'">✔️</template>
        <template v-else-if="state === 'dispatch'">🏍️</template>
        <template v-else-if="state === 'complete'">📍</template>
        <template v-else-if="state === 'cancel'">❌</template>
      </button>
    </div>
  </div>
  <div v-else>
    <p>Carregando detalhes do pedido...</p>
  </div>
</template>

<style scoped>
.order-details {
  padding: 20px;
  background: white;
  color: black;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.product-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.order-action {
  margin-top: 20px;
}

.active {
  cursor: pointer;
}

.inactive {
  background-color: darkgrey;
  cursor: not-allowed;
}
</style>

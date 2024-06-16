<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllStores } from '@/api/storeAPI';
import { getAllStoreOrders } from '@/api/orderAPI';
import { OrderResponse } from '@/dtos/orderDTO';
import { StoreResponse } from '@/dtos/storeDTO';
import { Pagination } from '@/dtos/paginationDTO';
import StoreCarousel from '@/components/StoreCarousel.vue';
import OrdersList from '@/components/OrdersList.vue';
import LinkPathNav from '@/components/LinkPathNav.vue';
import UserNavigation from '@/components/UserNavigation.vue';

const stores = ref<StoreResponse[]>([]);
const orders = ref<OrderResponse[]>([]);
const currentStoreId = ref<string | null>(null);
const storePagination = ref<Pagination>({ current: 1, pages: 1 });
const orderPagination = ref<Pagination>({ current: 1, pages: 1 });

onMounted(() => {
  fetchStores();
});

const fetchStores = async (page = 1) => {
  try {
    const response = await getAllStores(page);
    stores.value.push(...response.stores);
    storePagination.value = response.pagination;
  } catch (error) {
    // console.error('Failed to fetch stores', error); // ALERT
  }
};

const fetchOrders = async (storeId: string, page = 1) => {
  if (currentStoreId.value && page == 1) {
    orders.value = [];
  }

  try {
    const response = await getAllStoreOrders(storeId, page);
    orders.value.push(...response.orders);
    orderPagination.value = response.pagination;
  } catch (error) {
    // console.error('Failed to fetch orders', error); // ALERT
  }
};

const fetchMoreStores = () => {
  if (storePagination.value.next) {
    fetchStores(storePagination.value.current + 1);
  }
};

const fetchMoreOrders = () => {
  if (orderPagination.value.next) {
    fetchOrders(currentStoreId.value as string, orderPagination.value.current + 1);
  }
};

const handleStoreSelected = (storeId) => {
  currentStoreId.value = storeId;
  fetchOrders(currentStoreId.value)
};
</script>


<template>
  <v-app>
    <v-main>
      <UserNavigation />
      
      <div><LinkPathNav :route="`/orders`" :clickableSegments="[0]"/></div>
      <section>
        <h1>Orders</h1>
        <p v-if="stores.length === 0">Aviso: Não há lojas para serem selecionadas.</p>
        <StoreCarousel
          :stores="stores"
          :storePagination="storePagination"
          @store-selected="handleStoreSelected"
          @load-more="fetchMoreStores"
        />
      </section>
    
    
      <section>
        <h2 >Pedidos da Loja Selecionada</h2>
        <div v-if="!currentStoreId">
          <p>Selecione uma loja antes de visualizar os produtos.</p>
        </div>
        <div v-else-if="orders.length === 0">
          <p>Não há pedidos disponíveis para esta loja.</p>
        </div>
        <div v-else>
          <OrdersList :orders="orders" />
          <button @click="fetchMoreOrders" v-if="orderPagination.next">Carregar Mais Pedidos</button>
        </div>
      </section>
    </v-main>
  </v-app>
</template>

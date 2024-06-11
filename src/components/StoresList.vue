<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAllStores } from '@/api/storeAPI';
import { standardizeErrorMessage } from '@/helpers/standardizeErrorMessage';
import Paginator from '@/components/PaginatorNav.vue';
import defaultShopImage from '@/assets/shop-default-256.png';
import { Pagination } from '@/dtos/paginationDTO';
import { StoreResponse } from '@/dtos/storeDTO';
import LinkPathNav from '@/components/LinkPathNav.vue';

const route = useRoute();
const router = useRouter();

const alert = route.query.alert as string | undefined;
const errorMessage = ref('');

let page = 1;
if (typeof route.query.page === 'string' && !isNaN(parseInt(route.query.page))) {
  page = parseInt(route.query.page);
}

const stores = ref<StoreResponse[]>([]);
const pagination = ref<Pagination>({ current: 1, pages: 1 });

onMounted(() => {
  fetchStores();
});

const fetchStores = async (newPage?: number) => {
  try {
    if (newPage !== undefined) {
      page = newPage;
    }

    console.log('Fetching stores for page:', page);

    const response = await getAllStores(page);
    stores.value = response.stores;
    pagination.value = response.pagination;
    console.log(pagination.value);
  } catch (error) {
    errorMessage.value = standardizeErrorMessage(error);
    console.log(errorMessage.value);
  }
};

</script>

<template>
  <main>
    <div><p v-if="alert">{{ alert }}</p></div>
    <div><p v-if="errorMessage">{{ errorMessage }}</p></div>
    <div><LinkPathNav :route="`/stores`" /></div>
    <div>
      <h1>Stores</h1>
      <router-link to="/stores/new">Create a new store</router-link>
      <p>(page: {{ page }})</p>

      <Paginator :pagination="pagination" path="/stores" @page-change="fetchStores" />

      <ul v-if="stores.length > 0">
        <li v-for="store in stores" :key="store.id">
          <img :src="store.image_url ? store.image_url : defaultShopImage" alt="Imagem da loja" style="width: 100px; height: 100px;">
          <p>{{ store.name }}</p>
          <router-link :to="{ path: '/stores/' + store.id }">Ir a loja</router-link>
          <p v-if="store.hidden">Hidden</p>
        </li>
      </ul>
      <p v-else>Não há lojas disponíveis no momento.</p>
    </div>
  </main>
</template>
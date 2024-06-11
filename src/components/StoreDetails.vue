<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getStore } from '@/api/storeAPI';
import { getAllStoreProducts } from '@/api/productAPI';
import { standardizeErrorMessage } from '@/helpers/standardizeErrorMessage';
import defaultShopImage from '@/assets/shop-default-256.png';
import { StoreResponse, ProductResponse } from '@/dtos/storeDTO';
import LinkPathNav from '@/components/LinkPathNav.vue';
import ProductDetails from '@/components/ProductDetails.vue';

const route = useRoute();
const router = useRouter();

const errorMessage = ref('');
const store = ref<StoreResponse | null>(null);
const products = ref<ProductResponse[]>([]);
const storeId = route.params.storeId as string;

const isStoreLoaded = ref(false);

onMounted(() => {
  fetchStore();
});

const fetchStore = async () => {
  try {
    const response = await getStore(storeId);
    store.value = response;
    isStoreLoaded.value = true;
    fetchProducts();
  } catch (error) {
    errorMessage.value = standardizeErrorMessage(error);
    console.log(errorMessage.value);
  }
};

const fetchProducts = async () => {
  if (!isStoreLoaded.value) {
    return;
  }

  try {
    const response = await getAllStoreProducts(storeId);
    products.value = response.products;
  } catch (error) {
    errorMessage.value = standardizeErrorMessage(error);
    console.log(errorMessage.value);
  }
};
</script>

<template>
  <main>
    <div>
      <h1>Store</h1>

      <div><p v-if="errorMessage">{{ errorMessage }}</p></div>
      <div><LinkPathNav :route="`stores/${storeId}`" :clickableSegments="[0, 1]" /></div>
      <div v-if="store">
          <img :src="store.image_url ? store.image_url : defaultShopImage" alt="Imagem da loja" style="width: 100px; height: 100px;">
          <p>{{ store.name }}</p>
          <p>Hidden: {{store.hidden}}</p>
          <router-link :to="'/stores/' + store.id + '/edit'">Editar</router-link>
      </div>

      <h2>Products</h2>
      <div v-if="products.length > 0">
        <ProductDetails v-for="product in products" :key="product.id" :product="product" :storeId="storeId" />
      </div>
      <div v-else>
        <p>No products available</p>
      </div>
    </div>
  </main>
</template>
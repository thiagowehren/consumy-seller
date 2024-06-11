<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getStore } from '@/api/storeAPI';
import { standardizeErrorMessage } from '@/helpers/standardizeErrorMessage';
import defaultShopImage from '@/assets/shop-default-256.png';
import { StoreResponse } from '@/dtos/storeDTO';
import LinkPathNav from '@/components/LinkPathNav.vue';

const route = useRoute();
const router = useRouter();

const errorMessage = ref('');
const store = ref<StoreResponse>();
const storeId = route.params.storeId as string

onMounted(() => {
  fetchStore();
});

const fetchStore = async () => {
  try {
    const response = await getStore(storeId);
    store.value = response;
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
      <div><LinkPathNav :route="`stores/${storeId}`" /></div>
      <div v-if="store">
          <img :src="store.image_url ? store.image_url : defaultShopImage" alt="Imagem da loja" style="width: 100px; height: 100px;">
          <p>{{ store.name }}</p>
          <p>Hidden: {{store.hidden}}</p>
          <router-link :to="'/stores/' + store.id + '/edit'">Editar</router-link>
      </div>
    </div>
  </main>
</template>
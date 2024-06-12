<script setup lang="ts">
import { ref, onMounted, defineModel } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { getStoreProduct, createStoreProduct, updateStoreProduct } from '@/api/productAPI'
import { standardizeErrorMessage } from '@/helpers/standardizeErrorMessage'
import { ProductResponse, CreateProduct } from '@/dtos/productDTO'
import { productFormErrorMessages } from '@/helpers/constants/productFormErrorMessages'
import defaultProductImage from '@/assets/dish-default-256.png';

import BaseTextInput from '@/components/BaseTextInput.vue'
import BaseCheckboxInput from '@/components/BaseCheckboxInput.vue'
import BaseSelectInput from '@/components/BaseSelectInput.vue'
import LinkPathNav from '@/components/LinkPathNav.vue';

const route = useRoute()
const router = useRouter()

const errorMessage = ref('')
const errors = defineModel<boolean>('errors', {default: false})
const isLoading = ref(false);

const storeId = route.params.storeId as string | undefined
const productId = route.params.productId as string | undefined
const isEditMode = ref(!!productId)

const title = defineModel<string>('title')
const price = defineModel<string>('price')
const hidden = defineModel<boolean>('hidden', { default: false })
const image = ref<File | null>(null);

const expires_in = defineModel<number>('expires_in', {default: 0})
const expiresInOptions = [
  { label: 'Never', value: 0 },
  { label: '5 seconds', value: 5 },
  { label: '30 minutes', value: 1800 },
  { label: '1 hour', value: 3600 },
  { label: '4 hours', value: 14400 },
  { label: '8 hours', value: 28800 },
  { label: '16 hours', value: 57600 },
  { label: '1 day', value: 86400 }
];

let product: ProductResponse | null = null;

const fetchProduct = async () => {
  try {
    const response = await getStoreProduct(storeId, productId)
    product = response
    title.value = product.title
    price.value = product.price
    hidden.value = product.hidden
  } catch (error) {
    errorMessage.value = standardizeErrorMessage(error)
    router.push({ path: '/stores', query: { alert: errorMessage.value } });
  }
}

onMounted(() => {
  if (isEditMode.value) {
    fetchProduct();
  }
})

const onSubmit = async () => {
    if (isLoading.value) {
        return;
    }

    isLoading.value = true;
    errors.value = false;

    if (!title.value || title.value.length < 1) {
        errorMessage.value = title.value ? productFormErrorMessages.title.invalid : productFormErrorMessages.title.required;
        errors.value = true;
        return;
    } else {
        try {
          const productData: Partial<CreateProduct['product']> = { title: title.value, hidden: hidden.value, price: price.value, expires_in: expires_in.value };
          if (image.value) {
              productData.image = image.value;
          }

          if (isEditMode.value && storeId) {
              await updateStoreProduct(storeId, productId, productData);
              router.go(0);
          } else {
              await createStoreProduct(storeId, productData);
              router.push({ path: `/stores/${storeId}`, query: { notice: "Produto criado com sucesso." } });
          }
      } catch (error) {
          errorMessage.value = standardizeErrorMessage(error);
          errors.value = true;
      } finally {
          isLoading.value = false;
      }
  }
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    image.value = file;
  }
}
</script>

<template>
<main>
  <div>
    <div v-if="isEditMode">
      <LinkPathNav :route="`/stores/${storeId}/products/${productId}/edit`"  :clickableSegments="[0, 1, 4]" />
    </div>
    <div v-else>
      <LinkPathNav :route="`/stores/${storeId}/products/new`" :clickableSegments="[0, 1, 3]"/>
    </div>

    <h1>{{ isEditMode ? 'Edit Product' : 'New Product' }}</h1>
    <div><p v-if="errors">{{ errorMessage }}</p></div>

    <div>
      <div v-if="isEditMode && product">
        <img :src="product.image_url ? product.image_url : defaultProductImage" alt="Product Image" style="width: 100px; height: 100px;">
      </div>
      <div v-else>
        <img :src="defaultProductImage" alt="Default Product Image" style="width: 100px; height: 100px;">
      </div>

      <form novalidate @submit.prevent="onSubmit">
        <BaseTextInput type="text" required v-model="title" label="Title" />
        <BaseTextInput type="text" required v-model="price" label="Price" />
        <BaseCheckboxInput type="checkbox" v-model="hidden" label="Hidden" v-bind:checked="hidden"/>
        <BaseSelectInput v-model="expires_in" id="expires_in" label="Expiration" :options="exp">
          <option v-for="option in expiresInOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </BaseSelectInput>
        <input type="file" @change="onFileChange" accept="image/*" />
        <button type="submit">{{ isEditMode ? 'Update' : 'Create' }}</button> 
      </form>
    </div>
  </div>
</main>
</template>


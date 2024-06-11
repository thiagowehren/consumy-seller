<script setup lang="ts">
import { ref, onMounted, defineModel } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { getStore, createStore, updateStore } from '@/api/storeAPI'
import { standardizeErrorMessage } from '@/helpers/standardizeErrorMessage'
import { StoreResponse, CreateStore } from '@/dtos/storeDTO'

import BaseTextInput from '@/components/BaseTextInput.vue'
import BaseCheckboxInput from '@/components/BaseCheckboxInput.vue'
import { storeFormErrorMessages } from '@/helpers/constants/storeFormErrorMessages'
import defaultShopImage from '@/assets/shop-default-256.png';
import LinkPathNav from '@/components/LinkPathNav.vue';

const route = useRoute()
const router = useRouter()

const errorMessage = ref('')
const errors = defineModel<boolean>('errors', {default: false})

const storeId = route.params.storeId as string | undefined
const isEditMode = ref(!!storeId)

const name = defineModel<string>('name')
const hidden = defineModel<boolean>('hidden', { default: false })
const image = ref<File | null>(null);

let storeData: StoreResponse | null = null;

const fetchStore = async () => {
  try {
    const response = await getStore(storeId)
    storeData = response
    name.value = storeData.name
    hidden.value = storeData.hidden
  } catch (error) {
    errorMessage.value = standardizeErrorMessage(error)
    router.push({ path: '/stores', query: { alert: errorMessage.value } });
  }
}

onMounted(() => {
  if (isEditMode.value) {
    fetchStore();
  }
})

const onSubmit = async () => {
  errors.value = false;
  if (!name.value) {
      errorMessage.value = storeFormErrorMessages.name.required;
      errors.value = true;
      return;
  } else if (name.value.length < 3) {
      errorMessage.value = storeFormErrorMessages.name.invalid;
      errors.value = true;
      return;
  } else {
      try {
          const storeData: Partial<CreateStore['store']> = { name: name.value, hidden: hidden.value };
          if (image.value) {
              storeData.image = image.value;
          }

          if (isEditMode.value && storeId) {
              await updateStore(storeId, storeData);
          } else {
              await createStore(storeData);
          }
          router.push('/stores');
      } catch (error) {
          errorMessage.value = standardizeErrorMessage(error);
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
      <LinkPathNav :route="`/stores/${storeId}/edit`" />
      </div>
    <div v-else>
      <LinkPathNav :route="`/stores/new`" />
    </div>

    <h1>{{ isEditMode ? 'Edit Store' : 'New Store' }}</h1>
    <div><p v-if="errors">{{ errorMessage }}</p></div>

    <div>
      <div v-if="isEditMode && storeData">
        <img :src="storeData.image_url ? storeData.image_url : defaultShopImage" alt="Imagem da loja" style="width: 100px; height: 100px;">
      </div>
      <div v-else>
        <img :src="defaultShopImage" alt="Imagem da loja" style="width: 100px; height: 100px;">
      </div>

      <form novalidate @submit.prevent="onSubmit">
        <BaseTextInput type="text" required v-model="name" label="Name" />
        <BaseCheckboxInput type="checkbox" v-model="hidden" label="Hidden" v-bind:checked="hidden"/>
        <input type="file" @change="onFileChange" accept="image/*" />
        <button type="submit">{{ isEditMode ? 'Update' : 'Create' }}</button> 
      </form>
    </div>
  </div>
</main>
</template>

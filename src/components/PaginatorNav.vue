<template>
  <div class="paginator">
    <button @click="goToPage(1)" :disabled="pagination.current === 1">
      First
    </button>
    <button @click="goToPage(pagination.previous)" :disabled="!pagination.previous">
      Previous
    </button>
    <span v-for="num in pageNumbers" :key="num">
      <button @click="goToPage(num)">{{ num }}</button>
    </span>
    <button @click="goToPage(pagination.next)" :disabled="!pagination.next">
      Next
    </button>
    <button @click="goToPage(pagination.pages)" :disabled="pagination.current === pagination.pages">
      Last
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { Pagination } from '../dtos/paginationDTO';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

const props = defineProps<{
  pagination: Pagination;
  path: string;
}>();

const emit = defineEmits(['page-change']);

const goToPage = (page: number | null) => {
  if (page !== null) {
    const url = new URL(props.path, import.meta.env.VITE_DELIVERY_API_URL);
    url.searchParams.set('page', page.toString());
    router.push(url.pathname + url.search);
    emit('page-change', page);
  }
};

const pageNumbers = computed(() => {
  const pages = [];
  const currentPage = props.pagination.current;
  const totalPages = props.pagination.pages;

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});
</script>

<style scoped>
.paginator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

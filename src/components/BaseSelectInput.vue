<template>
  <div class="input-wrap form-select">
    <label v-if="label">{{ label }}</label><br/>
    <select
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
    >
      <slot></slot>
    </select><br/>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  label: {
    type: [String, Boolean],
    default: false,
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: null,
  },
});
</script>

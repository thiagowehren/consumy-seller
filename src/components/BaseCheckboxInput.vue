<template>
  <div class="input-wrap">
    <label v-if="label">{{ label }}</label><br/>
    <input
      :type="type"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      v-bind="$attrs"
    /><br/>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  label: {
    type: [String, Boolean],
    default: false,
  },
  modelValue: {
    type: [String, Boolean],
    default: "",
  },
});
</script>

<template>
  <nav>
    <span v-for="(segment, index) in segments" :key="index">
      <span v-if="index !== 0"> > </span>
      <router-link :to="segment.path">{{ segment.label }}</router-link>
    </span>
  </nav>
</template>

<script>
export default {
  props: {
    route: {
      type: String,
      required: true
    }
  },
  computed: {
    segments() {
      const paths = this.route.split('/').filter(path => path !== '');
      const segments = [];

      segments.push({ path: '/', label: 'Home' });

      let currentPath = '';

      for (let i = 0; i < paths.length; i++) {
        currentPath += `/${paths[i]}`;
        segments.push({
          path: currentPath,
          label: paths[i].replace(/^\w/, c => c.toUpperCase())
        });
      }

      return segments;
    }
  }
};
</script>

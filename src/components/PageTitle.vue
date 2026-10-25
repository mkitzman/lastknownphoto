<script setup lang="ts">
defineProps<{ eyebrow: string }>()
</script>

<template>
  <header class="page-title">
    <div class="page-eyebrow">{{ eyebrow }}</div>
    <h1 class="page-heading"><slot /></h1>
    <div v-if="$slots.credit" class="page-credit"><slot name="credit" /></div>
  </header>
</template>

<style scoped>
/* Full-width rule under the title; bottom padding matches the homepage hero's gap above its rule */
.page-title {
  padding: 48px 56px 22px;
  border-bottom: 1px solid var(--hairline);
}

.page-heading {
  font-family: 'Young Serif', Georgia, serif;
  font-size: 72px;
  line-height: 1;
  letter-spacing: -1px;
  font-weight: 400;
  margin: 0;
}

@media (max-width: 1100px) {
  .page-title {
    padding: 40px 40px 20px;
  }
  .page-heading {
    font-size: 56px;
  }
}

@media (max-width: 640px) {
  .page-title {
    padding: 28px 24px 18px;
  }
  .page-heading {
    font-size: 40px;
    letter-spacing: -0.6px;
  }
}
</style>

<template>
  {{ `© 2017-${currentYear} Lorin (Twintails) Francell` }}
</template>

<style>
footer {
  padding: 1rem;
  font-size: small;
}
</style>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

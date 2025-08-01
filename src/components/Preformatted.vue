<template>
  <pre id="color-diff-output" v-html="highlighted"></pre>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { syntaxHighlight } from "../utils/syntaxHighlight";

const props = defineProps<{ value: any }>();

const highlighted = computed(() =>
  syntaxHighlight(JSON.stringify(props.value, null, 2)),
);
</script>

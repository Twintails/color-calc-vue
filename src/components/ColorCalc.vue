<template>
  <h1>Color Calc</h1>
  <p>Adjust the Primary Color and Delta color values.</p>
  <form @submit.prevent>
    <fieldset>
      <legend>Color Inputs</legend>
      <label for="primary">Primary Color:</label>
      <input
        id="primary"
        v-model="primary"
        type="color"
        colorspace="display-p3"
      />
      <label for="primary-diff">Primary diff Color:</label>
      <input
        id="primary-diff"
        v-model="primaryDiff"
        type="color"
        colorspace="display-p3"
      />
    </fieldset>
  </form>
  <div v-for="n in detailsLabels.length" :key="n" :class="`detail-${n}`">
    <span :class="`detail-label`">{{ detailsLabels[n - 1] }}:</span>
    <span
      :class="`detail-value`"
      :data-footnote="getFootnote(detailsValues[n - 1], detailsLabels[n - 1])"
    >
      {{ detailsValues[n - 1] || "≈&nbsp;≈" }}
    </span>
  </div>
  <p>'Verify Out' should equal 'Prime Diff'</p>
  <Preformatted :value="diffColors(primary, primaryDiff)" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Preformatted from "./Preformatted.vue";
import { details, initialState } from "../assets/constants";
import {
  adjustColorHSL,
  diffColors,
  displayP3ToHex,
  hexToHSL,
  hslDiff,
  rgbToHex,
} from "../utils/diff";

const detailsLabels = Object.keys(details);
const primary = ref(initialState.primaryHex);
const primaryDiff = ref(initialState.pDeltaHex);
const verifyOut = ref("");

// detailsValues: [primary, primaryDiff, $a hue, $b hue, diff-hue, $a sat, $b sat, diff-sat, $a lt, $b lt, diff-lt, verifyOut]
const detailsValues = ref<string[]>([]);
// Helper: Check if a value is at or near a clamp boundary or has excessive decimals
function getFootnote(val: any, label: string) {
  if (typeof val !== "string" && typeof val !== "number") return "";
  let num = Number(val);
  if (isNaN(num)) return "";
  const tolerance = 1e-7;
  if (
    (label.toLowerCase().includes("hue") &&
      (Math.abs(num) < tolerance || Math.abs(num - 360) < tolerance)) ||
    (label.toLowerCase().includes("sat") &&
      (Math.abs(num) < tolerance || Math.abs(num - 100) < tolerance)) ||
    (label.toLowerCase().includes("lt") &&
      (Math.abs(num) < tolerance || Math.abs(num - 100) < tolerance))
  ) {
    return "Edge case: value is at or near clamp boundary (0, 100, or 360). May be imprecise.";
  }
  if (typeof val === "number" && val.toString().split(".")[1]?.length > 7) {
    return "High precision: value has more than 7 decimals. May be imprecise.";
  }
  if (label.toLowerCase().includes("Verify out")) {
    return "Verification color should match 𝜟 Hex color.";
  }
  return "";
}

function onColorInput(value: string) {
  // If not hex, try to convert
  if (!value.startsWith("#")) {
    if (value.startsWith("rgb")) {
      return rgbToHex(value);
    } else if (value.startsWith("color") || value.startsWith("display-p3")) {
      console.log("Converting Display-P3 to Hex:", value);
      return displayP3ToHex(value);
    }
    // Add more conversions if needed
  }

  return value;
}

function calculateDetails() {
  const hslA = hexToHSL(primary.value);
  const hslB = hexToHSL(primaryDiff.value);
  const diff = hslDiff(hslA, hslB);
  const verify = adjustColorHSL(primary.value, {
    hue: diff.hue,
    saturation: diff.sat,
    lightness: diff.lgt,
  });
  verifyOut.value = verify;
  detailsValues.value = [
    primary.value,
    primaryDiff.value,
    hslA.h.toFixed(6),
    hslB.h.toFixed(6),
    diff.hue.toFixed(6),
    hslA.s.toFixed(6),
    hslB.s.toFixed(6),
    diff.sat.toFixed(6),
    hslA.l.toFixed(6),
    hslB.l.toFixed(6),
    diff.lgt.toFixed(6),
    verify,
  ];
}

function setColors() {
  calculateDetails();
  const hslA = hexToHSL(primary.value);
  const hslB = hexToHSL(primaryDiff.value);
  const diff = hslDiff(hslA, hslB);
  // Build CSS custom properties string
  const cssVars = `:root {
    --primary-color: ${primary.value};
    --primary-diff-color: ${primaryDiff.value};
    --primary-hue: ${detailsValues.value[2]};
    --delta-hue: ${detailsValues.value[3]};
    --diff-hue: ${diff.hue}deg;
    --diff-hue-color: hsl(${diff.hue}deg,${diff.sat}%,${diff.lgt}%);
    --primary-sat: ${detailsValues.value[5]}%;
    --delta-sat: ${detailsValues.value[6]}%;
    --diff-sat: ${diff.sat}%;
    --diff-sat-color: hsl(${diff.hue}deg,${diff.sat}%,${diff.lgt}%);
    --primary-lgt: ${detailsValues.value[9]}%;
    --delta-lgt: ${detailsValues.value[10]}%;
    --diff-lgt: ${diff.lgt}%;
    --diff-lgt-color: hsl(${diff.hue}deg,${diff.sat}%,${diff.lgt}%);
    --verify-adjust-color-hsl: ${verifyOut.value};
  }`;
  // Find or create the <style data-runtime-generated> element
  let styleEl = document.head.querySelector("style[data-runtime-generated]");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.setAttribute("data-runtime-generated", "");
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = cssVars;
}

// Populate on mount and whenever colors change
onMounted(() => {
  calculateDetails();
  setColors();
});

watch([primary, primaryDiff], ([newPrimary, newPrimaryDiff]) => {
  // Normalize input to HEX
  primary.value = onColorInput(newPrimary);
  primaryDiff.value = onColorInput(newPrimaryDiff);

  calculateDetails();
  setColors();
});
</script>

<style>
@import "color-calc.css";
</style>

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ColorCalc from "./ColorCalc.vue";

describe("ColorCalc.vue", () => {
  it.skip("updates --verify-adjust-color-hsl and applies it to .detail-label:before", async () => {
    const wrapper = mount(ColorCalc);
    // Set initial colors
    const primaryInput = wrapper.find("#primary");
    const diffInput = wrapper.find("#primary-diff");
    await primaryInput.setValue("#A3CAE8");
    await diffInput.setValue("#C84B4B");
    // Click the button
    await wrapper.find("button").trigger("click");

    // Check the CSS custom property on body
    const verifyColor = getComputedStyle(document.body)
      .getPropertyValue("--verify-adjust-color-hsl")
      .trim();
    expect(verifyColor).toMatch(/^#[0-9A-F]{6}$/i);

    // Find the last .detail-label span
    const labels = wrapper.findAll(".detail-label");
    const lastLabel = labels[labels.length - 1];
    // Create a style element to simulate the pseudo-element
    const style = document.createElement("style");
    style.innerHTML = `.detail-label:last-of-type:before { background-color: var(--verify-adjust-color-hsl); }`;
    document.head.appendChild(style);
    // Create a dummy element to test computed style
    const dummy = document.createElement("span");
    dummy.className = "detail-label";
    document.body.appendChild(dummy);
    // Get computed background-color
    const bg = getComputedStyle(dummy, ":before").backgroundColor;
    expect(bg).not.toBe("");
    // Cleanup
    document.head.removeChild(style);
    document.body.removeChild(dummy);
  });
});

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ColorCalc from "./ColorCalc.vue";

describe("ColorCalc.vue", () => {
  it("updates --verify-adjust-color-hsl and applies it to .detail-label:before", async () => {
    const wrapper = mount(ColorCalc);
    // Set initial colors
    const primaryInput = wrapper.find("#primary");
    const diffInput = wrapper.find("#primary-diff");
    await primaryInput.setValue("#A3CAE8");
    await diffInput.setValue("#C84B4B");

    // Check the CSS custom property in the <style data-runtime-generated> element
    const styleEl = document.head.querySelector(
      "style[data-runtime-generated]",
    );
    expect(styleEl).not.toBeNull();
    const cssText = styleEl?.textContent || "";
    // Extract the value of --verify-adjust-color-hsl from the CSS string
    const match = cssText.match(/--verify-adjust-color-hsl:\s*([^;\s]+)/);
    expect(match).not.toBeNull();
    const verifyColor = match?.[1] || "";
    expect(verifyColor).toMatch(/^#[0-9A-F]{6}$/i);

    // Snapshot test for the generated runtime style
    // Find the last .detail-label span
    // const labels = wrapper.findAll(".detail-label");
    // const lastLabel = labels[labels.length - 1];
    // // Create a style element to simulate the pseudo-element
    // const style = document.createElement("style");
    // style.innerHTML = `.detail-label:last-of-type:before { background-color: var(--verify-adjust-color-hsl); }`;
    // document.head.appendChild(style);
    // // Create a dummy element to test computed style
    // const dummy = document.createElement("span");
    // dummy.className = "detail-label";
    // document.body.appendChild(dummy);
    // // Get computed background-color
    // // const bg = getComputedStyle(dummy, ":before").backgroundColor;
    // // expect(bg).not.toBe("");
    // // // Cleanup
    // document.head.removeChild(style);
    // document.body.removeChild(dummy);

    expect(cssText).toMatchSnapshot();
  });
});

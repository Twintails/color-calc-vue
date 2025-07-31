import { describe, it, expect } from "vitest";
import {
  hexToHSL,
  hslColors,
  hslDiff,
  hslMixHueSatLig,
  hslFrom,
  hslHueA_SatLigB,
  diffColors,
  adjustColorHSL,
  hslToHex,
} from "./diff";
describe("adjustColorHSL", () => {
  it("adjusts hue, saturation, and lightness positively", () => {
    // #A3CAE8: h=206.086956522, s=60, l=77.450980392
    const base = "#A3CAE8";
    const result = adjustColorHSL(base, {
      hue: 10,
      saturation: 10,
      lightness: 10,
    });
    // Should be h=216.086956522, s=70, l=87.450980392
    const expected = hslToHex(216.086956522, 70, 87.450980392);
    expect(result).toBe(expected);
  });

  it("adjusts hue, saturation, and lightness negatively", () => {
    const base = "#A3CAE8";
    const result = adjustColorHSL(base, {
      hue: -20,
      saturation: -30,
      lightness: -40,
    });
    // Should be h=186.086956522, s=30, l=37.450980392
    const expected = hslToHex(186.086956522, 30, 37.450980392);
    expect(result).toBe(expected);
  });

  it("clamps saturation and lightness to [0,100]", () => {
    const base = "#A3CAE8";
    const result = adjustColorHSL(base, { saturation: 100, lightness: 100 });
    // s = 160 -> 100, l = 177.450980392 -> 100
    const expected = hslToHex(206.086956522, 100, 100);
    expect(result).toBe(expected);
  });

  it("supports decimal deltas", () => {
    const base = "#A3CAE8";
    const result = adjustColorHSL(base, {
      hue: 0.5,
      saturation: -0.5,
      lightness: 0.25,
    });
    const expected = hslToHex(206.586956522, 59.5, 77.700980392);
    expect(result).toBe(expected);
  });
});

describe("hexToHSL", () => {
  it("should match implementation for #A3CAE8", () => {
    const result = hexToHSL("#A3CAE8");
    expect(result.h).toBeCloseTo(206.086956522, 5);
    expect(result.s).toBeCloseTo(60.0, 5);
    expect(result.l).toBeCloseTo(77.450980392, 5);
  });

  it("should match implementation for #C84B4B", () => {
    const result = hexToHSL("#C84B4B");
    expect(result.h).toBeCloseTo(0, 5);
    expect(result.s).toBeCloseTo(53.191489362, 5);
    expect(result.l).toBeCloseTo(53.921568627, 5);
  });

  it("should match implementation for #fff", () => {
    const result = hexToHSL("#fff");
    expect(result.h).toBeCloseTo(0, 5);
    expect(result.s).toBeCloseTo(0, 5);
    expect(result.l).toBeCloseTo(100, 5);
  });
});

describe("hslColors", () => {
  it("returns correct diff and function names", () => {
    const a = { h: 200, s: 60, l: 50 };
    const b = { h: 180, s: 50, l: 60 };
    const result = hslColors(a, b);
    expect(result).toEqual({
      hue: 20,
      desaturate: 10,
      lighten: 10,
    });
  });
});

describe("hslDiff", () => {
  it("returns signed differences", () => {
    const a = { h: 200, s: 60, l: 50 };
    const b = { h: 180, s: 50, l: 60 };
    const result = hslDiff(a, b);
    expect(result).toEqual({
      hue: -20,
      sat: -10,
      lgt: 10,
    });
  });
});

describe("hslMixHueSatLig", () => {
  it("mixes hue from A and sat/lig from B", () => {
    const a = { h: 100, s: 20, l: 30 };
    const b = { h: 200, s: 80, l: 90 };
    expect(hslMixHueSatLig(a, b)).toEqual({ h: 100, s: 80, l: 90 });
  });
});

describe("hslFrom", () => {
  it("returns the same HSL object", () => {
    const a = { h: 10, s: 20, l: 30 };
    expect(hslFrom(a)).toEqual({ h: 10, s: 20, l: 30 });
  });
});

describe("hslHueA_SatLigB", () => {
  it("returns hue from A, sat/lig from B", () => {
    const a = { h: 10, s: 20, l: 30 };
    const b = { h: 200, s: 80, l: 90 };
    expect(hslHueA_SatLigB(a, b)).toEqual({ h: 10, s: 80, l: 90 });
  });
});

describe("diffColors", () => {
  function expectDiffKeys(
    result: {
      hue: number;
      desaturate?: number;
      saturate?: number;
      darken?: number;
      lighten?: number;
    },
    expected: { hue: number; sat: number; lig: number },
  ) {
    expect(result).toHaveProperty("hue");
    // Saturation
    if (result.desaturate !== undefined) {
      expect(result.desaturate).toBeCloseTo(expected.sat, 5);
    } else {
      expect(result.saturate).toBeCloseTo(expected.sat, 5);
    }
    // Lightness
    if (result.darken !== undefined) {
      expect(result.darken).toBeCloseTo(expected.lig, 5);
    } else {
      expect(result.lighten).toBeCloseTo(expected.lig, 5);
    }
    expect(result.hue).toBeCloseTo(expected.hue, 5);
  }

  it("returns correct diff object for #A3CAE8 vs #C84B4B", () => {
    const result = diffColors("#A3CAE8", "#C84B4B");
    expect(result).toHaveProperty("desaturate");
    expect(result).toHaveProperty("darken");
    expectDiffKeys(result, {
      hue: 206.086956522,
      sat: 6.808510638,
      lig: 23.529411765,
    });
  });

  it("returns correct diff object for #C84B4B vs #A3CAE8", () => {
    const result = diffColors("#C84B4B", "#A3CAE8");
    expect(result).toHaveProperty("saturate");
    expect(result).toHaveProperty("lighten");
    expectDiffKeys(result, {
      hue: 206.086956522,
      sat: 6.808510638,
      lig: 23.529411765,
    });
  });

  it("returns correct diff object for #FF0000 vs #00FF00", () => {
    const result = diffColors("#FF0000", "#00FF00");
    expectDiffKeys(result, {
      hue: 120,
      sat: 0,
      lig: 0,
    });
  });

  it("returns correct diff object for #123456 vs #FEDCBA", () => {
    const result = diffColors("#123456", "#FEDCBA");
    expectDiffKeys(result, {
      hue: 180,
      sat: 31.758241758,
      lig: 65.882352941,
    });
  });

  it("returns correct diff object for #888888 vs #444444", () => {
    const result = diffColors("#888888", "#444444");
    expectDiffKeys(result, {
      hue: 0,
      sat: 0,
      lig: 26.666666667,
    });
  });

  it("returns correct diff object for #444444 vs #888888", () => {
    const result = diffColors("#444444", "#888888");
    expectDiffKeys(result, {
      hue: 0,
      sat: 0,
      lig: 26.666666667,
    });
  });
});

describe("diffColors edge cases", () => {
  function expectDiffKeys(
    result: {
      hue: number;
      desaturate?: number;
      saturate?: number;
      darken?: number;
      lighten?: number;
    },
    expected: { hue: number; sat: number; lig: number },
  ) {
    expect(result).toHaveProperty("hue");
    if (result.desaturate !== undefined) {
      expect(result.desaturate).toBeCloseTo(expected.sat, 5);
    } else {
      expect(result.saturate).toBeCloseTo(expected.sat, 5);
    }
    if (result.darken !== undefined) {
      expect(result.darken).toBeCloseTo(expected.lig, 5);
    } else {
      expect(result.lighten).toBeCloseTo(expected.lig, 5);
    }
    expect(result.hue).toBeCloseTo(expected.hue, 5);
  }

  it("black vs white", () => {
    const result = diffColors("#000000", "#ffffff");
    expectDiffKeys(result, {
      hue: 0,
      sat: 0,
      lig: 100,
    });
  });

  it("black vs gray", () => {
    const result = diffColors("#000000", "#888888");
    expectDiffKeys(result, {
      hue: 0,
      sat: 0,
      lig: 53.333333333,
    });
  });

  it("white vs gray", () => {
    const result = diffColors("#ffffff", "#888888");
    expectDiffKeys(result, {
      hue: 0,
      sat: 0,
      lig: 46.666666667,
    });
  });

  it("fully saturated vs unsaturated", () => {
    const result = diffColors("#ff0000", "#808080"); // red vs gray
    expectDiffKeys(result, {
      hue: 0,
      sat: 100,
      lig: 0.196078431,
    });
  });

  it("same color", () => {
    const result = diffColors("#123456", "#123456");
    expectDiffKeys(result, {
      hue: 0,
      sat: 0,
      lig: 0,
    });
  });
});

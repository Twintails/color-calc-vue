import { describe, it, expect } from "vitest";
import { syntaxHighlight } from "./syntaxHighlight";

describe("syntaxHighlight", () => {
  it("highlights string values", () => {
    const json = '"foo"';
    const html = syntaxHighlight(json);
    expect(html).toContain('<span class=\"json-string\">"foo"</span>');
  });

  it("highlights keys", () => {
    const json = '"foo":';
    const html = syntaxHighlight(json);
    expect(html).toContain('<span class=\"json-key\">"foo":</span>');
  });

  it("highlights numbers", () => {
    const json = "42";
    const html = syntaxHighlight(json);
    expect(html).toContain('<span class=\"json-number\">42</span>');
  });

  it("highlights booleans", () => {
    const json = "true";
    const html = syntaxHighlight(json);
    expect(html).toContain('<span class=\"json-boolean\">true</span>');
  });

  it("highlights null", () => {
    const json = "null";
    const html = syntaxHighlight(json);
    expect(html).toContain('<span class=\"json-null\">null</span>');
  });

  it("handles mixed JSON", () => {
    const obj = { foo: "bar", num: 1, bool: false, none: null };
    const json = JSON.stringify(obj, null, 2);
    const html = syntaxHighlight(json);
    expect(html).toContain('<span class=\"json-key\">"foo":</span>');
    expect(html).toContain('<span class=\"json-string\">"bar"</span>');
    expect(html).toContain('<span class=\"json-key\">"num":</span>');
    expect(html).toContain('<span class=\"json-number\">1</span>');
    expect(html).toContain('<span class=\"json-key\">"bool":</span>');
    expect(html).toContain('<span class=\"json-boolean\">false</span>');
    expect(html).toContain('<span class=\"json-key\">"none":</span>');
    expect(html).toContain('<span class=\"json-null\">null</span>');
  });
});

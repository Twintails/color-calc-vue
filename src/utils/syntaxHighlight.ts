export function syntaxHighlight(json: string): string {
  if (!json) return "";
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // Match keys ("foo":), strings, numbers, booleans, null
  const regex =
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")(:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  let result = "";
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(json)) !== null) {
    // Add text before match
    result += json.slice(lastIndex, match.index);
    let token = match[0];
    let cls = "json-number";
    if (match[1]) {
      // string or key
      if (match[3]) {
        // colon present, so it's a key
        cls = "json-key";
        token = match[1] + match[3];
      } else {
        cls = "json-string";
        token = match[1];
      }
    } else if (match[4]) {
      // true|false|null
      if (match[4] === "true" || match[4] === "false") {
        cls = "json-boolean";
      } else {
        cls = "json-null";
      }
      token = match[4];
    }
    result += `<span class=\"${cls}\">${token}</span>`;
    lastIndex = regex.lastIndex;
  }
  // Add remaining text
  result += json.slice(lastIndex);
  return result;
}

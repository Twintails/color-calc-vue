import pc from "picocolors";

const origLog = console.log;
console.log = (...args) => {
  const stack = new Error().stack?.split("\n")[2] || "";
  // Extract file:line info from the stack trace
  const match = stack.match(/\(([^)]+)\)/);
  const location = match ? match[1] : stack.trim();
  origLog(pc.bgCyan(pc.black(`[LOG at ${location}]`)), ...args);
};

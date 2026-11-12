type Cell = string | number | boolean | null | undefined;

function escapeCell(value: Cell): string {
  let text = value === null || value === undefined ? "" : String(value);
  // Stops spreadsheet programs treating form input as a formula.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

// Semicolons and a byte order mark, so Hungarian Excel opens it correctly.
export function toCsv(headers: string[], rows: Cell[][]): string {
  const lines = [headers, ...rows].map((row) => row.map(escapeCell).join(";"));
  return `﻿${lines.join("\r\n")}\r\n`;
}

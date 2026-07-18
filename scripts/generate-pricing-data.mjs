// Regenerates lib/pricingData.ts from data/PC Repair & Service Price.xlsx.
// Run this after updating the price list spreadsheet: node scripts/generate-pricing-data.mjs
import xlsx from 'xlsx';
import { writeFileSync } from 'fs';

const SOURCE = './data/PC Repair & Service Price.xlsx';
const OUTPUT = './lib/pricingData.ts';

const wb = xlsx.readFile(SOURCE);
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });

const [header, ...dataRows] = rows;
const items = dataRows
  .filter((row) => row[0] && row[1])
  .map(([service, price]) => ({ service: String(service).trim(), price: String(price).trim() }));

const fileContent = `// Auto-generated from "${SOURCE}" by scripts/generate-pricing-data.mjs
// Do not edit by hand — update the spreadsheet and re-run the script instead.

export interface PricingItem {
  service: string;
  price: string;
}

export const pricingItems: PricingItem[] = ${JSON.stringify(items, null, 2)};
`;

writeFileSync(OUTPUT, fileContent);
console.log(`Wrote ${items.length} pricing items to ${OUTPUT}`);

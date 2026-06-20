export function normalizePhoneNumber(input: string): string {
  if (!input) return '';

  // Remove all non-digit characters except +
  let phone = input.replace(/[^\d+]/g, '');

  // If starts with +, remove it temporarily for processing
  const hasPlus = phone.startsWith('+');
  if (hasPlus) phone = phone.slice(1);

  // Remove leading zeros
  phone = phone.replace(/^0+/, '');

  // If it starts with 60, keep it
  if (phone.startsWith('60')) {
    phone = phone.slice(2); // remove 60
  }

  // Final format: +60 + number (without leading zero)
  return `+60${phone}`;
}

// Example usage:
// normalizePhoneNumber("0104787487")     → "+60104787487"
// normalizePhoneNumber("+60104787487")   → "+60104787487"
// normalizePhoneNumber("+60 0104787487") → "+60104787487"
// normalizePhoneNumber("60104787487")    → "+60104787487"
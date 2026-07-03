// Deterministic masked/proxy "connect" number, standing in for IndiaMART's real
// number-masking infrastructure (seller-side proxy numbers, buyer-side masked numbers —
// neither party's real phone number is ever exposed to the other). Not a real, dialable
// line — same "illustrative, not real" status as the rest of this prototype's contact
// data — but deliberately formatted to read as a routed/virtual line, not a personal
// mobile number, so it's visually distinct from what it replaces.
export function getMaskedConnectNumber(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const digits = String(hash % 10000000).padStart(7, '0');
  return `+91 8065 ${digits.slice(0, 3)} ${digits.slice(3)}`;
}

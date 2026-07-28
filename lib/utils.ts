export function formatCurrency(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}
export function formatDate(d: Date | string) {
  const dt = new Date(d);
  return dt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
export function formatDateTime(d: Date | string) {
  const dt = new Date(d);
  return dt.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
export function generateInvoiceNumber(date = new Date(), seq = 1) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `INV-${y}${m}${dd}-${String(seq).padStart(4, "0")}`;
}
export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
export const ORDER_STATUS_LABEL: Record<string, string> = {
  RECEIVED: "Received", WASHING: "Washing", DRYING: "Drying", IRONING: "Ironing",
  FINISHED: "Finished", PICKED_UP: "Picked Up", CANCELLED: "Cancelled",
};
export const ORDER_STATUS_COLOR: Record<string, string> = {
  RECEIVED: "secondary", WASHING: "info", DRYING: "warning", IRONING: "primary",
  FINISHED: "success", PICKED_UP: "dark", CANCELLED: "danger",
};
export const PAYMENT_STATUS_COLOR: Record<string, string> = {
  UNPAID: "danger", DP: "warning", PAID: "success",
};

import { format, parseISO } from "date-fns";

export function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";

  const date = parseISO(dateString); // parse ISO string
  return format(date, "MMM dd, yyyy"); // Example: "Jan 12, 2024"
}

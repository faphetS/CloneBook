import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";

export function formatShortTime(date: Date) {
  const now = new Date();

  const minutes = differenceInMinutes(now, date);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours}h`;

  const days = differenceInDays(now, date);
  return `${days}d`;
}

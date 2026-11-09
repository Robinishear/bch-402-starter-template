export const SORTABLE_FIELDS = ["createdAt", "name", "email"];



export const DAY_MS = 86_400_000;
export const dayKey = (d: Date) => d.toISOString().slice(0, 10);

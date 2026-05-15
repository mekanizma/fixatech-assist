export const deskKeys = {
  all: ["desk"] as const,
  publicTicket: (code: string) => ["desk", "public", code] as const,
};

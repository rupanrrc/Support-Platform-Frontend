type PopulatedRef = string | { _id: string; name?: string; email?: string; slug?: string } | null | undefined;

export function refId(ref: PopulatedRef): string | null {
  if (!ref) return null;
  return typeof ref === "string" ? ref : ref._id;
}

export function refName(ref: PopulatedRef, fallback = "—"): string {
  if (!ref) return fallback;
  if (typeof ref === "string") return fallback;
  return ref.name || ref.slug || fallback;
}

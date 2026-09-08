const DEFAULT_DEST = "/app";

/**
 * Sanitize a `?next=` param into a safe in-app path.
 * Rejects absolute URLs, protocol-relative `//`, and auth routes.
 */
export function safeNext(next: string | string[] | null | undefined): string {
  const value = Array.isArray(next) ? next[0] : next;
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/login") ||
    value.startsWith("/auth")
  ) {
    return DEFAULT_DEST;
  }
  return value;
}

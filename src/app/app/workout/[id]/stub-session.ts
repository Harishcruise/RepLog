/** Stand-in for a real session fetch until sessions/sets have a schema
 *  (SPEC.md milestone 2). Pretends the session started 24 minutes ago. */
export function getStubStartedAt() {
  return new Date(Date.now() - 24 * 60 * 1000);
}

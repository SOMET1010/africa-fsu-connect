import { describe, it, expect } from "vitest";

describe("HomeHeroBlock fallback", () => {
  it("fallback badge value in source code is 'USF Digital Connect Africa'", async () => {
    const source = await import("../HomeHeroBlock?raw");
    expect(source.default).toContain("'USF Digital Connect Africa'");
  });
});

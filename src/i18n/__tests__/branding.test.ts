import { describe, it, expect } from "vitest";
import fr from "../translations/fr.json";
import en from "../translations/en.json";
import pt from "../translations/pt.json";
import ar from "../translations/ar.json";

const BRAND_NAME = "USF Digital Connect Africa";

const translations = { fr, en, pt, ar } as Record<string, Record<string, string>>;
const languages = ["fr", "en", "pt", "ar"] as const;

describe("Branding: USF Digital Connect Africa", () => {
  describe("home.hero.badge", () => {
    for (const lang of languages) {
      it(`[${lang}] should be "${BRAND_NAME}"`, () => {
        expect(translations[lang]["home.hero.badge"]).toBe(BRAND_NAME);
      });
    }
  });

  describe("footer.platform.name", () => {
    for (const lang of languages) {
      it(`[${lang}] should be "${BRAND_NAME}"`, () => {
        expect(translations[lang]["footer.platform.name"]).toBe(BRAND_NAME);
      });
    }
  });

  describe("No legacy brand names in branding keys", () => {
    const legacyTerms = ["NEXUS", "Universal Digital Connect (UDC)", "Plateforme UDC"];
    const brandingKeys = ["home.hero.badge", "footer.platform.name"];

    for (const lang of languages) {
      for (const key of brandingKeys) {
        for (const term of legacyTerms) {
          it(`[${lang}] ${key} should not contain "${term}"`, () => {
            expect(translations[lang][key] ?? "").not.toContain(term);
          });
        }
      }
    }
  });

  describe("Cross-language consistency", () => {
    it("home.hero.badge is identical across all languages", () => {
      const values = languages.map((lang) => translations[lang]["home.hero.badge"]);
      expect(new Set(values).size).toBe(1);
    });

    it("footer.platform.name is identical across all languages", () => {
      const values = languages.map((lang) => translations[lang]["footer.platform.name"]);
      expect(new Set(values).size).toBe(1);
    });
  });
});

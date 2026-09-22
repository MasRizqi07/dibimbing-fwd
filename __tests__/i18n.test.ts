import { describe, expect, it } from "vitest";
import { dictionaries } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

describe("i18n Dictionaries & Localization", () => {
  const locales: Locale[] = ["ID", "EN"];

  it("defines both ID and EN dictionaries with all required root keys", () => {
    for (const locale of locales) {
      const dict = dictionaries[locale];
      expect(dict).toBeDefined();
      expect(dict.nav).toBeDefined();
      expect(dict.hero).toBeDefined();
      expect(dict.services).toBeDefined();
      expect(dict.pricing).toBeDefined();
      expect(dict.contact).toBeDefined();
      expect(dict.footer).toBeDefined();
    }
  });

  it("ensures nav keys match identically across ID and EN", () => {
    const idKeys = Object.keys(dictionaries.ID.nav).sort();
    const enKeys = Object.keys(dictionaries.EN.nav).sort();
    expect(idKeys).toEqual(enKeys);
    expect(dictionaries.ID.nav.services).toBe("Layanan");
    expect(dictionaries.EN.nav.services).toBe("Services");
  });

  it("ensures contact keys match identically across ID and EN", () => {
    const idKeys = Object.keys(dictionaries.ID.contact).sort();
    const enKeys = Object.keys(dictionaries.EN.contact).sort();
    expect(idKeys).toEqual(enKeys);
    expect(dictionaries.ID.contact.submitBtn).toBe("Kirim Pesan");
    expect(dictionaries.EN.contact.submitBtn).toBe("Send Message");
  });

  it("ensures services keys match identically across ID and EN", () => {
    const idKeys = Object.keys(dictionaries.ID.services).sort();
    const enKeys = Object.keys(dictionaries.EN.services).sort();
    expect(idKeys).toEqual(enKeys);
    expect(dictionaries.ID.services.searchLabel).toBe("Cari layanan");
    expect(dictionaries.EN.services.searchLabel).toBe("Search services");
  });
});


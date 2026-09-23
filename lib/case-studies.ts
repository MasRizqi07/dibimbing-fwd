// Visual concepts supplied in Design/. These are not verified client engagements.
export interface CaseStudy {
  slug: string;
  title: string;
  imagePath: string;
  visualAlt: string;
  categoryId: string;
  categoryEn: string;
  nextSlug: string;
}

export const caseStudies: Record<string, CaseStudy> = {
  "nomad-coffee-roasters": {
    slug: "nomad-coffee-roasters",
    title: "Nomad Coffee Roasters",
    imagePath: "/projects/nomad-coffee.png",
    visualAlt: "Konsep visual kemasan kopi dan storefront Nomad Coffee Roasters",
    categoryId: "Konsep identitas merek dan toko digital",
    categoryEn: "Brand identity and digital storefront concept",
    nextSlug: "aura-studio-fashion",
  },
  "aura-studio-fashion": {
    slug: "aura-studio-fashion",
    title: "Aura Studio",
    imagePath: "/projects/aura-studio.png",
    visualAlt: "Konsep visual lookbook dan situs fashion Aura Studio",
    categoryId: "Konsep lookbook dan pengalaman fashion",
    categoryEn: "Fashion lookbook and experience concept",
    nextSlug: "ruang-pulih-holistic-spa",
  },
  "ruang-pulih-holistic-spa": {
    slug: "ruang-pulih-holistic-spa",
    title: "Ruang Pulih",
    imagePath: "/projects/ruang-pulih.png",
    visualAlt: "Konsep visual brand dan situs wellness Ruang Pulih",
    categoryId: "Konsep identitas wellness",
    categoryEn: "Wellness identity concept",
    nextSlug: "nomad-coffee-roasters",
  },
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

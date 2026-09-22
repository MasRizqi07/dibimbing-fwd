export type Locale = "ID" | "EN";

export interface Dictionary {
  nav: {
    services: string;
    portfolio: string;
    process: string;
    pricing: string;
    contact: string;
    startProject: string;
    consultWhatsapp: string;
    menu: string;
    closeMenu: string;
    selectLanguage: string;
    brandAria: string;
  };
  hero: {
    proof: string;
    headlineStart: string;
    headlineAccent: string;
    subheadline: string;
    ctaStart: string;
    ctaPortfolio: string;
    stats: {
      projectsDone: string;
      projectsDoneLabel: string;
      satisfaction: string;
      satisfactionLabel: string;
      turnaround: string;
      turnaroundLabel: string;
    };
  };
  services: {
    title: string;
    searchPlaceholder: string;
    searchLabel: string;
    allCategory: string;
    noResults: string;
    resetSearch: string;
    availableSuffix: string;
  };
  pricing: {
    title: string;
    ctaStarter: string;
    ctaGrowth: string;
    ctaEnterprise: string;
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    sendingBtn: string;
    successTitle: string;
    successDesc: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
}


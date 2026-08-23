export interface WebsiteNavLink {
  label: string;
  href: string;
}

export interface WebsiteFooter {
  tagline: string;
  links: WebsiteNavLink[];
  copyright: string;
}

export interface WebsiteHero {
  headline: string;
  sub: string;
}

export interface WebsitePriziaEntry {
  label: string;
  placeholder: string;
}

export interface WebsiteWhatIs {
  heading: string;
  paragraphs: string[];
}

export interface WebsiteValue {
  title: string;
  description: string;
  icon: string;
}

export interface WebsiteDomain {
  id: string;
  name: string;
  description: string;
  href: string;
}

export interface WebsiteCurrentlyExploring {
  heading: string;
  domains: WebsiteDomain[];
}

export interface WebsiteGalleryPreview {
  heading: string;
  description: string;
  href: string;
}

export interface WebsitePriziaInvitation {
  heading: string;
  sub: string;
}

export interface WebsiteHomepage {
  hero: WebsiteHero;
  priziaEntry: WebsitePriziaEntry;
  whatIs: WebsiteWhatIs;
  values: WebsiteValue[];
  currentlyExploring: WebsiteCurrentlyExploring;
  galleryPreview: WebsiteGalleryPreview;
  priziaInvitation: WebsitePriziaInvitation;
}

export interface WebsiteConfig {
  site: {
    name: string;
    tagline: string;
    description: string;
  };
  nav: WebsiteNavLink[];
  footer: WebsiteFooter;
  homepage: WebsiteHomepage;
}

export interface WebsiteData {
  draft: WebsiteConfig;
  published: WebsiteConfig;
}

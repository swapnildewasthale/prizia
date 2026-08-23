export type Alignment = "left" | "center" | "right";

export interface TextStyle {
  alignment?: Alignment;
  color?: string | null;
}

export interface ButtonStyle {
  bgColor?: string | null;
  textColor?: string | null;
}

export interface WebsiteNavLink {
  label: string;
  href: string;
  visible?: boolean;
}

export interface WebsiteFooter {
  tagline: string;
  links: WebsiteNavLink[];
  copyright: string;
}

export interface WebsiteHero {
  headline: string;
  sub: string;
  visible?: boolean;
  headlineStyle?: TextStyle;
  subStyle?: TextStyle;
}

export interface WebsitePriziaEntry {
  label: string;
  placeholder: string;
  visible?: boolean;
}

export interface WebsiteWhatIs {
  heading: string;
  paragraphs: string[];
  visible?: boolean;
  headingStyle?: TextStyle;
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
  ctaText?: string;
}

export interface WebsiteCurrentlyExploring {
  heading: string;
  domains: WebsiteDomain[];
  visible?: boolean;
}

export interface WebsiteGalleryPreview {
  heading: string;
  description: string;
  href: string;
  ctaText?: string;
  visible?: boolean;
  headingStyle?: TextStyle;
}

export interface WebsitePriziaInvitation {
  heading: string;
  sub: string;
  visible?: boolean;
  headingStyle?: TextStyle;
  cta?: {
    text: string;
    href: string;
    visible?: boolean;
    style?: ButtonStyle;
  };
}

export interface WebsiteRegistration {
  label: string;
  heading: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  helpText: string;
  phoneDisplay: string;
  phoneLink: string;
  visible?: boolean;
  ctaStyle?: ButtonStyle;
}

export interface WebsiteHomepage {
  hero: WebsiteHero;
  priziaEntry: WebsitePriziaEntry;
  whatIs: WebsiteWhatIs;
  values: WebsiteValue[];
  currentlyExploring: WebsiteCurrentlyExploring;
  galleryPreview: WebsiteGalleryPreview;
  priziaInvitation: WebsitePriziaInvitation;
  registration: WebsiteRegistration;
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

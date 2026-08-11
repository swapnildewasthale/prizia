export const site = {
  name: "Prizmistic",
  tagline: "Learn. Make. Explore.",
  description:
    "Ek aisi jagah jahan ideas ko sirf socha nahi jaata — unhe try bhi kiya jaata hai.",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Explore", href: "/explore" },
    { label: "Gallery", href: "/gallery" },
    { label: "Prizia", href: "/prizia" },
  ] as const,
  footer: {
    tagline: "Learn · Make · Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "Explore", href: "/explore" },
      { label: "Gallery", href: "/gallery" },
      { label: "Prizia", href: "/prizia" },
    ],
    copyright: "© Prizmistic",
  },
} as const;

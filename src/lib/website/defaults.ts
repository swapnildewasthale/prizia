import { WebsiteConfig } from "./types";

export const defaultWebsiteConfig: WebsiteConfig = {
  site: {
    name: "Prizmistic",
    tagline: "Learn. Make. Explore.",
    description:
      "Ek aisi jagah jahan ideas ko sirf socha nahi jaata — unhe try bhi kiya jaata hai.",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Explore", href: "/explore" },
    { label: "Gallery", href: "/gallery" },
  ],
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
  homepage: {
    hero: {
      headline: "Kuch seekho. Kuch banao.\nKuch explore karo.",
      sub: "Prizmistic ek aisi jagah hai — jahan aap kuch seekh sakte hain, kuch bana sakte hain, ya bas kisi idea ko explore kar sakte hain.",
    },
    priziaEntry: {
      label: "Kuch curious ho?",
      placeholder: "Prizia se pucho kuch bhi...",
    },
    whatIs: {
      heading: "Prizmistic kya hai?",
      paragraphs: [
        "Prizmistic ek aisi jagah hai jahan alag-alag subjects, skills, ideas aur log ek jagah aate hain.",
        "Yahan kuch bhi ho sakta hai — koi naya skill seekho, koi project banao, kisi naye idea ke saath experiment karo, ya bas kuch interesting discover karo.",
        "Prizmistic flexibles hai. Jo hota hai wahan badalta rehta hai — naye ideas, naye subjects, naye experiences.",
      ],
    },
    values: [
      {
        title: "Learn",
        description:
          "Sirf information collect karna nahi — samajhna, ghera jaana, khud ko challenge karna.",
        icon: "learn",
      },
      {
        title: "Make",
        description:
          "Jo seekha hai, uske saath kuch banao. Haath ganda karo. Create karo.",
        icon: "make",
      },
      {
        title: "Experiment",
        description:
          "Try karo. Galat ho. Dobara try karo. Har idea ek experiment ho sakta hai.",
        icon: "experiment",
      },
      {
        title: "Explore",
        description:
          "Dekho idea tumhe kahan le jaata hai. Curiosity ko follow karo.",
        icon: "explore",
      },
    ],
    currentlyExploring: {
      heading: "Currently exploring",
      domains: [
        {
          id: "ai",
          name: "Artificial Intelligence",
          description:
            "AI ko sirf samajhna nahi — uske saath experiment karna, use karna, aur dekhna ki wo kya-kya kar sakta hai.",
          href: "/explore",
        },
      ],
    },
    galleryPreview: {
      heading: "Things we've made",
      description:
        "Abhi shuru ho raha hai. Jaise-jaise experiences honge, yahan unki visual memory banegi.",
      href: "/gallery",
    },
    priziaInvitation: {
      heading: "Kuch poochna hai?",
      sub: "Prizia se pucho — Prizmistic ki intelligence.",
    },
  },
};

import {
  BriefcaseBusiness,
  Github,
  Home,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  UserRound,
} from "lucide-react";

export const EMAIL = "krbucang@gmail.com";

// Page order matters: the active-section tracker relies on it.
export const sections = [
  { id: "home", label: "Home", navLabel: "HOME", Icon: Home },
  { id: "works", label: "Works", navLabel: "MY WORKS", Icon: BriefcaseBusiness },
  { id: "stack", label: "Stack", navLabel: "TECH STACK", Icon: Layers3 },
  { id: "about", label: "About", navLabel: "WHO AM I", Icon: UserRound },
  { id: "contact", label: "Contact", navLabel: "CONTACT ME", Icon: Mail },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const socialLinks = [
  {
    Icon: Github,
    href: "https://github.com/KennelyRay",
    label: "GitHub",
    value: "@KennelyRay",
  },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/in/kennely-ray-bucang-b432a710b/",
    label: "LinkedIn",
    value: "Kennely Ray Bucang",
  },
  {
    Icon: Instagram,
    href: "http://instagram.com/kennn.dev/",
    label: "Instagram",
    value: "@kennn.dev",
  },
];

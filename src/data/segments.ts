export type SegmentIconId =
  | "percent"
  | "caipirinha"
  | "mandioquinha"
  | "bolinho"
  | "croquete"
  | "crostini";

export type WheelSegment = {
  id: string;
  lines: [string, string?];
  color: string;
  text: string;
  icon: SegmentIconId;
};

export const segments: WheelSegment[] = [
  {
    id: "desconto-10",
    lines: ["Vale", "10%"],
    color: "#C4452A",
    text: "#FFF6E8",
    icon: "percent",
  },
  {
    id: "caipirinha",
    lines: ["Caipi", "rinha"],
    color: "#E3A008",
    text: "#2A1810",
    icon: "caipirinha",
  },
  {
    id: "mandioquinha",
    lines: ["Mandio", "quinha"],
    color: "#E07A2F",
    text: "#FFF6E8",
    icon: "mandioquinha",
  },
  {
    id: "bolinho",
    lines: ["Bolinho"],
    color: "#8B1E1E",
    text: "#FFF6E8",
    icon: "bolinho",
  },
  {
    id: "croquete",
    lines: ["Croquete"],
    color: "#D4A017",
    text: "#2A1810",
    icon: "croquete",
  },
  {
    id: "crostini",
    lines: ["Crostini"],
    color: "#C45C26",
    text: "#FFF6E8",
    icon: "crostini",
  },
];

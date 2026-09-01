import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Indoor Player UI",
    brandUrl: "/",
    brandTarget: "_self",
    colorPrimary: "#1d4ed8",
    colorSecondary: "#2563eb",
    appBg: "#f3f6fa",
    appContentBg: "#ffffff",
    appBorderColor: "#e2e8f0",
    appBorderRadius: 10,
    fontBase: '"Geist Variable", Inter, system-ui, sans-serif',
    fontCode: "ui-monospace, SFMono-Regular, Consolas, monospace",
    textColor: "#0f172a",
    textInverseColor: "#ffffff",
    barTextColor: "#475569",
    barSelectedColor: "#1d4ed8",
    barHoverColor: "#2563eb",
    inputBg: "#ffffff",
    inputBorder: "#cbd5e1",
    inputTextColor: "#0f172a",
    inputBorderRadius: 8,
  }),
});

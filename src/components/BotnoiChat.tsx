import { useEffect } from "react";

const SDK_ID = "bn-jssdk";
const SDK_SRC = "https://console.botnoi.ai/customerchat/index.js";
const BOT_ID = "6ac5b3466952e934fd556cec";
const BOT_LOGO =
  "https://bn-sme-production-ap-southeast-1.s3.amazonaws.com/6ac5b3466952e934fd556cec/4e3bc3eb-e7df-44b9-868f-200ea23e8834.png";

// Hex equivalents of the oklch tokens in styles.css (Botnoi only accepts hex).
const THEME_PRIMARY = "#f58028"; // --primary
const THEME_SECONDARY = "#ffe6c8"; // --secondary
const THEME_INK = "#1c1410"; // --ink

// The widget renders inside an open shadow root, so page CSS can't reach it.
// This gets injected into that shadow root to match the site's "pop" style.
const BADGE_CSS = `
  .bn-badge {
    width: 64px; height: 64px;
    background: ${THEME_SECONDARY};
    border: 3px solid ${THEME_INK};
    box-shadow: 4px 4px 0 ${THEME_INK};
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .bn-badge:hover { transform: translate(-2px, -2px) rotate(-6deg); box-shadow: 6px 6px 0 ${THEME_INK}; }
  .bn-badge:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 ${THEME_INK}; }
  .bn-badge:focus-visible { box-shadow: 0 0 0 3px ${THEME_PRIMARY}, 4px 4px 0 ${THEME_INK}; }
  .bn-badge[aria-expanded="true"] { background: ${THEME_PRIMARY}; }
  .bn-logo { width: 82%; filter: saturate(1.15) hue-rotate(-8deg); }
  .bn-panel { bottom: 76px; border: 3px solid ${THEME_INK}; border-radius: 1.5rem; box-shadow: 6px 6px 0 ${THEME_INK}; }
`;

type BNInstance = { shadow: ShadowRoot | null };
type BNGlobal = { init: (opts: { version: string }) => unknown; instances: BNInstance[] };

function initWidget() {
  const BN = (window as unknown as { BN?: BNGlobal }).BN;
  if (!BN) return;
  BN.init({ version: "1.0" });
  for (const { shadow } of BN.instances) {
    if (!shadow || shadow.querySelector("style[data-theme-override]")) continue;
    const style = document.createElement("style");
    style.setAttribute("data-theme-override", "");
    style.textContent = BADGE_CSS;
    shadow.appendChild(style);
  }
}

export function BotnoiChat() {
  useEffect(() => {
    const existing = document.getElementById(SDK_ID);
    if (existing) {
      initWidget();
      return;
    }
    const js = document.createElement("script");
    js.id = SDK_ID;
    js.src = SDK_SRC;
    js.async = true;
    js.onload = initWidget;
    document.body.appendChild(js);
  }, []);

  return (
    <>
      <div id="bn-root" />
      <div
        className="bn-customerchat"
        {...{
          bot_id: BOT_ID,
          bot_logo: BOT_LOGO,
          bot_name: "CatClicker",
          theme_color: THEME_PRIMARY,
        }}
      />
    </>
  );
}

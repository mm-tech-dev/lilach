"use client";

// ============================================================================
// Accessibility Widget - Hebrew, brand-themed.
// Self-contained logic; icons come from lucide-react (the site's icon set) so
// every control reads as one consistent, same-weight family.
// ============================================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Accessibility,
  X,
  RotateCcw,
  ALargeSmall,
  ZoomIn,
  Heading,
  Link2,
  Type,
  MoveHorizontal,
  MoveVertical,
  Bold,
  AlignLeft,
  BookOpen,
  Image as ImageIcon,
  Moon,
  Sun,
  Contrast,
  Droplets,
  Droplet,
  CircleDashed,
  Coffee,
  Eye,
  SunMoon,
  Ruler,
  Pause,
  MousePointer2,
  Keyboard,
  MousePointer,
  type LucideIcon,
} from "lucide-react";
import "./a11y.css";
import { A11Y_T } from "./translations";

type ColorMode =
  | "none"
  | "dark"
  | "light"
  | "highContrast"
  | "highSaturation"
  | "lowSaturation"
  | "monochrome"
  | "sepia"
  | "yellowBlack"
  | "invert";

type ToggleKey =
  | "highlightTitles"
  | "highlightLinks"
  | "dyslexicFont"
  | "letterSpacing"
  | "lineHeight"
  | "fontWeight"
  | "alignLeft"
  | "readingMode"
  | "imageAlt"
  | "readingGuide"
  | "stopAnimations"
  | "bigCursor"
  | "keyboardNav"
  | "blackCursor";

type Settings = {
  fontScale: number;
  zoom: number;
  colorMode: ColorMode;
  toggles: Record<ToggleKey, boolean>;
};

// Same-weight lucide icon for every control, so they look like one set.
const ICONS: Record<string, LucideIcon> = {
  fontSize: ALargeSmall,
  pageZoom: ZoomIn,
  highlightTitles: Heading,
  highlightLinks: Link2,
  dyslexicFont: Type,
  letterSpacing: MoveHorizontal,
  lineHeight: MoveVertical,
  fontWeight: Bold,
  alignLeft: AlignLeft,
  readingMode: BookOpen,
  imageAlt: ImageIcon,
  dark: Moon,
  light: Sun,
  highContrast: Contrast,
  highSaturation: Droplets,
  lowSaturation: Droplet,
  monochrome: CircleDashed,
  sepia: Coffee,
  yellowBlack: Eye,
  invert: SunMoon,
  readingGuide: Ruler,
  stopAnimations: Pause,
  bigCursor: MousePointer2,
  keyboardNav: Keyboard,
  blackCursor: MousePointer,
};

function CardIcon({ name }: { name: string }) {
  const Icon = ICONS[name];
  return Icon ? <Icon size={20} strokeWidth={1.75} aria-hidden /> : null;
}

const TOGGLE_CLASS: Partial<Record<ToggleKey, string>> = {
  highlightTitles: "a11y-highlight-titles",
  highlightLinks: "a11y-highlight-links",
  dyslexicFont: "a11y-dyslexic",
  letterSpacing: "a11y-letter-spacing",
  lineHeight: "a11y-line-height",
  fontWeight: "a11y-font-weight",
  alignLeft: "a11y-align-left",
  readingMode: "a11y-reading-mode",
  imageAlt: "a11y-image-alt",
  stopAnimations: "a11y-stop-animations",
  bigCursor: "a11y-big-cursor",
  keyboardNav: "a11y-keyboard-nav",
  blackCursor: "a11y-black-cursor",
};

const COLOR_CLASS: Record<ColorMode, string> = {
  none: "",
  dark: "a11y-color-dark",
  light: "a11y-color-light",
  highContrast: "a11y-color-high-contrast",
  highSaturation: "a11y-color-high-saturation",
  lowSaturation: "a11y-color-low-saturation",
  monochrome: "a11y-color-monochrome",
  sepia: "a11y-color-sepia",
  yellowBlack: "a11y-color-yellow-black",
  invert: "a11y-color-invert",
};
const ALL_COLOR_CLASSES = Object.values(COLOR_CLASS).filter(Boolean);

const CONTENT_TOGGLES: ToggleKey[] = [
  "highlightTitles",
  "highlightLinks",
  "dyslexicFont",
  "letterSpacing",
  "lineHeight",
  "fontWeight",
  "alignLeft",
  "readingMode",
  "imageAlt",
];
const COLOR_MODES: ColorMode[] = [
  "dark",
  "light",
  "highContrast",
  "highSaturation",
  "lowSaturation",
  "monochrome",
  "sepia",
  "yellowBlack",
  "invert",
];
const NAV_TOGGLES: ToggleKey[] = [
  "readingGuide",
  "stopAnimations",
  "bigCursor",
  "keyboardNav",
  "blackCursor",
];

const STORAGE_KEY = "a11y-settings-v1";

const DEFAULTS: Settings = {
  fontScale: 1,
  zoom: 1,
  colorMode: "none",
  toggles: {
    highlightTitles: false,
    highlightLinks: false,
    dyslexicFont: false,
    letterSpacing: false,
    lineHeight: false,
    fontWeight: false,
    alignLeft: false,
    readingMode: false,
    imageAlt: false,
    readingGuide: false,
    stopAnimations: false,
    bigCursor: false,
    keyboardNav: false,
    blackCursor: false,
  },
};

function applySettings(s: Settings) {
  const html = document.documentElement;

  html.style.fontSize = s.fontScale !== 1 ? `${Math.round(s.fontScale * 100)}%` : "";
  if (s.zoom !== 1) html.style.setProperty("zoom", String(s.zoom));
  else html.style.removeProperty("zoom");

  (Object.keys(TOGGLE_CLASS) as ToggleKey[]).forEach((key) => {
    const cls = TOGGLE_CLASS[key];
    if (cls) html.classList.toggle(cls, s.toggles[key]);
  });

  ALL_COLOR_CLASSES.forEach((c) => html.classList.remove(c));
  if (s.colorMode !== "none") html.classList.add(COLOR_CLASS[s.colorMode]);

  if (s.toggles.imageAlt) {
    document.querySelectorAll<HTMLImageElement>("img[alt]").forEach((img) => {
      if (!img.title && img.alt) img.title = img.alt;
    });
  }
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [guideY, setGuideY] = useState(0);

  // Hydrate from storage after mount (keeps SSR markup deterministic).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Settings>;
        setSettings({
          ...DEFAULTS,
          ...parsed,
          toggles: { ...DEFAULTS.toggles, ...(parsed.toggles ?? {}) },
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Apply + persist whenever settings change.
  useEffect(() => {
    applySettings(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  // Reading guide follows the pointer when enabled.
  useEffect(() => {
    if (!settings.toggles.readingGuide) return;
    const onMove = (e: MouseEvent) => setGuideY(e.clientY);
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [settings.toggles.readingGuide]);

  // A dialog has to be dismissible from the keyboard.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const t = A11Y_T;

  const toggle = useCallback((key: ToggleKey) => {
    setSettings((s) => ({ ...s, toggles: { ...s.toggles, [key]: !s.toggles[key] } }));
  }, []);

  const setColor = useCallback((mode: ColorMode) => {
    setSettings((s) => ({ ...s, colorMode: s.colorMode === mode ? "none" : mode }));
  }, []);

  const step = useCallback(
    (field: "fontScale" | "zoom", delta: number, min: number, max: number) => {
      setSettings((s) => ({
        ...s,
        [field]: Math.min(max, Math.max(min, Math.round((s[field] + delta) * 10) / 10)),
      }));
    },
    [],
  );

  const reset = useCallback(() => setSettings(DEFAULTS), []);

  const guide = useMemo(
    () =>
      settings.toggles.readingGuide ? (
        <div className="a11y-reading-guide" style={{ top: guideY - 14 }} />
      ) : null,
    [settings.toggles.readingGuide, guideY],
  );

  // Everything the widget renders lives inside `.a11y-root`, because the colour
  // and font rules in a11y.css exclude that subtree. The launcher and overlay
  // used to sit outside it, so dark/invert modes repainted them too.
  return (
    <div className="a11y-root">
      {guide}

      {!open && (
        <button
          className="a11y-launcher"
          aria-label={t.openMenu}
          onClick={() => setOpen(true)}
        >
          <Accessibility size={26} strokeWidth={1.75} aria-hidden />
        </button>
      )}

      {open && (
        <>
          <div className="a11y-overlay" onClick={() => setOpen(false)} />
          <aside
            className="a11y-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            dir="rtl"
          >
              <div className="a11y-panel-header">
                <h2>{t.title}</h2>
                <div className="a11y-header-actions">
                  <button className="a11y-close" aria-label={t.close} onClick={() => setOpen(false)}>
                    <X size={18} strokeWidth={2} aria-hidden />
                  </button>
                </div>
              </div>

              <div className="a11y-panel-content">
                {/* Content adjustments */}
                <section className="a11y-section">
                  <h3 className="a11y-section-title">{t.sections.content}</h3>
                  <div className="a11y-grid">
                    <div className="a11y-card a11y-card-wide">
                      <span className="a11y-card-label">
                        <CardIcon name="fontSize" /> {t.features.fontSize}
                      </span>
                      <div className="a11y-stepper">
                        <button aria-label="הקטנה" onClick={() => step("fontScale", -0.1, 0.8, 1.6)}>−</button>
                        <span className="a11y-stepper-value">
                          {Math.round(settings.fontScale * 100)}%
                        </span>
                        <button aria-label="הגדלה" onClick={() => step("fontScale", 0.1, 0.8, 1.6)}>+</button>
                      </div>
                    </div>
                    <div className="a11y-card a11y-card-wide">
                      <span className="a11y-card-label">
                        <CardIcon name="pageZoom" /> {t.features.pageZoom}
                      </span>
                      <div className="a11y-stepper">
                        <button aria-label="הקטנה" onClick={() => step("zoom", -0.1, 1, 1.5)}>−</button>
                        <span className="a11y-stepper-value">
                          {Math.round(settings.zoom * 100)}%
                        </span>
                        <button aria-label="הגדלה" onClick={() => step("zoom", 0.1, 1, 1.5)}>+</button>
                      </div>
                    </div>
                    {CONTENT_TOGGLES.map((key) => (
                      <button
                        key={key}
                        className={`a11y-card ${settings.toggles[key] ? "is-active" : ""}`}
                        aria-pressed={settings.toggles[key]}
                        onClick={() => toggle(key)}
                      >
                        <CardIcon name={key} />
                        {t.features[key]}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Color adjustments */}
                <section className="a11y-section">
                  <h3 className="a11y-section-title">{t.sections.color}</h3>
                  <div className="a11y-grid">
                    {COLOR_MODES.map((mode) => (
                      <button
                        key={mode}
                        className={`a11y-card ${settings.colorMode === mode ? "is-active" : ""}`}
                        aria-pressed={settings.colorMode === mode}
                        onClick={() => setColor(mode)}
                      >
                        <CardIcon name={mode} />
                        {t.features[mode]}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Navigation tools */}
                <section className="a11y-section">
                  <h3 className="a11y-section-title">{t.sections.navigation}</h3>
                  <div className="a11y-grid">
                    {NAV_TOGGLES.map((key) => (
                      <button
                        key={key}
                        className={`a11y-card ${settings.toggles[key] ? "is-active" : ""}`}
                        aria-pressed={settings.toggles[key]}
                        onClick={() => toggle(key)}
                      >
                        <CardIcon name={key} />
                        {t.features[key]}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <div className="a11y-panel-footer">
                <Link
                  href="/accessibility"
                  className="a11y-statement-link"
                  onClick={() => setOpen(false)}
                >
                  {t.statement}
                </Link>
                <button className="a11y-reset" onClick={reset}>
                  <RotateCcw size={16} strokeWidth={2} aria-hidden /> {t.reset}
                </button>
              </div>
          </aside>
        </>
      )}
    </div>
  );
}
